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

export async function callOpenAI(
  messages: OpenAIMessage[],
  options: OpenAIChatOptions = {}
): Promise<{ ok: boolean; reply?: string; error?: string }> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return { ok: false, error: "OPENAI_API_KEY 미설정 (Vercel 환경변수 대문자 확인)" };
  }

  const {
    model = "gpt-4o-mini",
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
      return { ok: false, error: `OpenAI API 오류: ${res.status} — ${errText.slice(0, 200)}` };
    }

    const data = await res.json();
    const reply = data?.choices?.[0]?.message?.content;
    if (!reply) {
      return { ok: false, error: "OpenAI 응답이 비어있습니다." };
    }

    return { ok: true, reply: reply.trim() };
  } catch (err: any) {
    clearTimeout(timeout);
    if (err.name === "AbortError") {
      return { ok: false, error: "OpenAI 응답 시간 초과" };
    }
    return { ok: false, error: err.message || "OpenAI 호출 실패" };
  }
}
