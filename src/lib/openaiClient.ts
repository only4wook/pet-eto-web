// OpenAI GPT-4o 클라이언트 (Gemini 앙상블 파트너)
// KEY: OPENAI_API_KEY (대문자 필수)

export interface OpenAIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface OpenAIChatOptions {
  model?: string;          // default: "gpt-4o-mini" (비용 효율)
  temperature?: number;    // default: 0.6
  maxTokens?: number;      // default: 2000
  timeoutMs?: number;      // default: 15000
}

export interface OpenAIErrorInfo {
  status?: number;
  code?: string;
  type?: string;
  message: string;
}

function parseOpenAIError(status: number, raw: string): OpenAIErrorInfo {
  try {
    const parsed = JSON.parse(raw);
    const err = parsed?.error || {};
    return {
      status,
      code: typeof err.code === "string" ? err.code : undefined,
      type: typeof err.type === "string" ? err.type : undefined,
      message: typeof err.message === "string" ? err.message.slice(0, 240) : `OpenAI API 오류: ${status}`,
    };
  } catch {
    return { status, message: raw.slice(0, 240) || `OpenAI API 오류: ${status}` };
  }
}

export async function callOpenAI(
  messages: OpenAIMessage[],
  options: OpenAIChatOptions = {}
): Promise<{ ok: boolean; reply?: string; error?: string; errorInfo?: OpenAIErrorInfo; model?: string }> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    const errorInfo = { code: "missing_api_key", message: "OPENAI_API_KEY 미설정 (Vercel 환경변수 대문자 확인)" };
    return { ok: false, error: errorInfo.message, errorInfo };
  }

  const {
    model = process.env.OPENAI_MODEL || "gpt-4o-mini",
    temperature = 0.6,
    maxTokens = 2000,
    timeoutMs = 15000,
  } = options;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) {
      const errText = await res.text();
      const errorInfo = parseOpenAIError(res.status, errText);
      console.warn("[OpenAI]", {
        status: errorInfo.status,
        code: errorInfo.code,
        type: errorInfo.type,
        model,
      });
      return { ok: false, error: errorInfo.message, errorInfo, model };
    }

    const data = await res.json();
    const reply = data?.choices?.[0]?.message?.content;
    if (!reply) {
      const errorInfo = { code: "empty_response", message: "OpenAI 응답이 비어있습니다." };
      return { ok: false, error: errorInfo.message, errorInfo, model };
    }

    return { ok: true, reply: reply.trim(), model };
  } catch (err: any) {
    clearTimeout(timeout);
    if (err.name === "AbortError") {
      const errorInfo = { code: "timeout", message: "OpenAI 응답 시간 초과" };
      console.warn("[OpenAI]", { code: errorInfo.code, model });
      return { ok: false, error: errorInfo.message, errorInfo, model };
    }
    const errorInfo = { code: "request_failed", message: err.message || "OpenAI 호출 실패" };
    console.warn("[OpenAI]", { code: errorInfo.code, model });
    return { ok: false, error: errorInfo.message, errorInfo, model };
  }
}
