import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { checkRateLimit, getClientIP, isAdmin } from "../../../../lib/security";
import { PET_AI_PERSONA, IMAGE_ANALYSIS_CONFIG, SAFETY_SETTINGS } from "../../../../lib/aiPrompts";
import { buildSymptomChecklistKo, TOTAL_SYMPTOMS } from "../../../../lib/symptomTaxonomy";

/**
 * 시드 피드 생성 엔드포인트 (관리자 전용)
 *
 * 합법 이미지 소스(Unsplash API) + Gemini AI 진단을 조합해서
 * 데모·투자자 시연용 피드 포스트를 자동 생성.
 *
 * 필요한 env:
 *   - UNSPLASH_ACCESS_KEY (Unsplash Developer)
 *   - GEMINI_API_KEY + GEMINI_MODEL (이미 존재)
 *   - SUPABASE_SERVICE_ROLE_KEY (RLS 우회 insert)
 *   - DEMO_SEED_USER_ID (시드 포스트 작성자로 쓸 users 테이블 UUID)
 *
 * 호출:
 *   POST /api/admin/seed-feed
 *   { password: "peteto2026", count: 10, species: "cat" }
 */

const SUPABASE_URL = "https://akhtlrcmvftfacaroeiq.supabase.co";

// 한국식 시드 닉네임 풀 (Gemini API 호출 없이 바로 사용 — 비용·속도 효율)
const KO_NICKNAMES = [
  "냥집사영희", "멍멍이아빠", "꼬물이누나", "고양이러버", "강아지대디",
  "치즈냥맘", "삼색이맘", "고등어집사", "뚱냥이누나", "코숏대장",
  "푸들맘", "시바견아빠", "말티즈누나", "골든리트러버", "포메집사",
  "냥이팔랑귀", "댕댕이덕후", "집냥이엄마", "반려인A", "반려인B",
  "은별이엄마", "루나누나", "밤톨이아빠", "초코맘", "라떼집사",
  "모카누나", "곰돌이덕후", "해피맘", "순이엄마", "복실이아빠",
  "나비맘", "하늘이누나", "별이아빠", "달님집사", "햇님맘",
  "구름이누나", "바람이아빠", "민트집사", "레몬맘", "체리누나",
  "꼬맹이아빠", "뽀삐누나", "토토집사", "까미맘", "흰둥이아빠",
  "검댕이누나", "회색이집사", "얼룩이맘", "점박이아빠", "줄무늬누나",
];

// 설명 템플릿 (자연스러운 한국어 반려인 톤)
const DESC_TEMPLATES_CAT = [
  "우리집 냥이 오늘 모습이에요 🐱 귀엽죠?",
  "요즘 부쩍 이런 표정을 자주 지어요. 괜찮은 걸까요?",
  "새 캣타워 선물했더니 하루종일 여기서 놀아요 ㅎㅎ",
  "아침에 일어나서 만난 우리 고양이입니다 😊",
  "창가에서 햇볕 쬐는 모습이 너무 사랑스러워서 찍어봤어요",
  "이 표정 뭔가요... 귀엽긴 한데 뭘 원하는 걸까요?",
  "평소에 이런 자세 자주 취하는데 건강해 보이나요?",
  "혹시 이 정도 살이면 비만 아닐까요? 다이어트 시켜야 하나 고민 중입니다",
  "잠 깨자마자 찍은 우리 애기 🥰",
  "간식 기다리는 눈빛 좀 봐주세요!",
  "털갈이 시즌인가 봐요. 털이 너무 많이 빠져요 ㅠㅠ",
  "발바닥 젤리가 너무 예뻐서 인증샷!",
];

const DESC_TEMPLATES_DOG = [
  "우리 강아지 산책 다녀온 직후 모습이에요 🐕",
  "요즘 자꾸 이런 행동 하는데 괜찮을까요?",
  "오늘 미용 갔다 와서 엄청 깔끔해졌어요!",
  "새로 산 간식 좋아하는 표정 좀 보세요 ㅎㅎ",
  "혹시 이 자세가 어디 아픈 신호일까요? 평소랑 다른 것 같아요",
  "우리집 댕댕이, 잠들기 전 모습이에요 💤",
  "햇살 좋은 날 공원에서 한 컷!",
  "이 녀석 요즘 부쩍 살이 찐 것 같아서 걱정이에요",
  "새 장난감 정말 좋아해요! 하루종일 물고 다녀요",
  "목욕 후 털 말릴 때 찍은 사진이에요",
  "귀 긁는 게 평소보다 많아진 것 같은데 한번 봐주실 수 있나요?",
  "이 표정 너무 웃기지 않나요? 밥 달라고 조르는 중 🤣",
];

interface UnsplashPhoto {
  id: string;
  urls: { regular: string; small: string };
  user: { name: string; links: { html: string } };
  description: string | null;
  alt_description: string | null;
}

async function fetchUnsplashPhotos(
  query: string,
  count: number,
  apiKey: string
): Promise<UnsplashPhoto[]> {
  // 'random' 엔드포인트: 최대 30장/호출
  const pageSize = Math.min(count, 30);
  const res = await fetch(
    `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&count=${pageSize}&orientation=landscape`,
    {
      headers: { Authorization: `Client-ID ${apiKey}` },
    }
  );
  if (!res.ok) {
    throw new Error(`Unsplash API error: ${res.status} — ${await res.text()}`);
  }
  const data = await res.json();
  return Array.isArray(data) ? data : [data];
}

async function analyzeImageWithGemini(
  imageUrl: string,
  species: "cat" | "dog",
  description: string,
  apiKey: string,
  model: string
): Promise<{ analysis: string; severity: "normal" | "mild" | "moderate" | "urgent" }> {
  // Unsplash 이미지 다운로드 + base64 변환
  const imgRes = await fetch(imageUrl);
  if (!imgRes.ok) throw new Error(`Image fetch failed: ${imgRes.status}`);
  const buffer = Buffer.from(await imgRes.arrayBuffer());
  const base64 = buffer.toString("base64");
  const mimeType = imgRes.headers.get("content-type") || "image/jpeg";

  const animalName = species === "cat" ? "고양이" : "강아지";
  const userContext = `보호자가 ${animalName} 사진을 올렸습니다.\n보호자 설명: "${description}"`;

  const checklist = buildSymptomChecklistKo(species);
  const systemText =
    PET_AI_PERSONA +
    `\n\n## 지금 주어진 과제: 이미지 기반 건강 분석\n사진을 보고 부위별 체크 + 심각도(normal/mild/moderate/urgent) + 집에서 할 것 + 병원 기준 + 예상 비용 순으로 답변.\n` +
    checklist;

  const geminiRes = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemText }] },
        contents: [
          {
            role: "user",
            parts: [
              { inlineData: { mimeType, data: base64 } },
              { text: userContext },
            ],
          },
        ],
        generationConfig: IMAGE_ANALYSIS_CONFIG,
        safetySettings: SAFETY_SETTINGS,
      }),
    }
  );

  if (!geminiRes.ok) {
    throw new Error(`Gemini API ${geminiRes.status}: ${(await geminiRes.text()).slice(0, 300)}`);
  }

  const data = await geminiRes.json();
  const analysis =
    data?.candidates?.[0]?.content?.parts?.[0]?.text || "분석 결과를 가져올 수 없습니다.";

  // severity 추출 (analyze-image/route.ts 와 동일 로직)
  const labelMatch = analysis.match(
    /(?:심각도|severity)\s*[*:\-—\s]*\s*(normal|mild|moderate|urgent)\b/i
  );
  let severity: "normal" | "mild" | "moderate" | "urgent" = "normal";
  if (labelMatch) {
    severity = labelMatch[1].toLowerCase() as typeof severity;
  } else if (/🚨|긴급/.test(analysis)) severity = "urgent";
  else if (/⚠️/.test(analysis) && /주의/.test(analysis)) severity = "moderate";
  else if (/💡/.test(analysis) && /관찰 필요/.test(analysis)) severity = "mild";

  return { analysis, severity };
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export async function POST(req: NextRequest) {
  try {
    // ── 1) 보안 검사 ──
    const ip = getClientIP(req);
    if (!checkRateLimit(ip, 3, 60000)) {
      return NextResponse.json(
        { error: "시드 생성은 분당 3회 제한입니다." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { password, count = 5, species = "cat" } = body as {
      password?: string;
      count?: number;
      species?: "cat" | "dog";
    };

    if (!isAdmin(password || "")) {
      return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
    }

    if (count < 1 || count > 30) {
      return NextResponse.json(
        { error: "count는 1~30 사이여야 합니다." },
        { status: 400 }
      );
    }

    if (species !== "cat" && species !== "dog") {
      return NextResponse.json(
        { error: "species는 cat 또는 dog여야 합니다." },
        { status: 400 }
      );
    }

    // ── 2) env 검증 ──
    const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const demoUserId = process.env.DEMO_SEED_USER_ID;
    const geminiModel = process.env.GEMINI_MODEL || "gemini-2.5-flash";

    const missing: string[] = [];
    if (!unsplashKey) missing.push("UNSPLASH_ACCESS_KEY");
    if (!geminiKey) missing.push("GEMINI_API_KEY");
    if (!serviceKey) missing.push("SUPABASE_SERVICE_ROLE_KEY");
    if (!demoUserId) missing.push("DEMO_SEED_USER_ID");
    if (missing.length > 0) {
      return NextResponse.json(
        { error: `env 누락: ${missing.join(", ")}` },
        { status: 500 }
      );
    }

    // ── 3) Supabase 서비스 롤 클라이언트 (RLS 우회) ──
    const sb = createClient(SUPABASE_URL, serviceKey!, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // ── 4) Unsplash 에서 사진 받아오기 ──
    const query = species === "cat" ? "cat pet" : "dog pet";
    const photos = await fetchUnsplashPhotos(query, count, unsplashKey!);

    // ── 5) 각 사진 → AI 진단 + DB insert ──
    const results: Array<{ ok: boolean; id?: string; error?: string; unsplashId?: string }> = [];
    const descTemplates = species === "cat" ? DESC_TEMPLATES_CAT : DESC_TEMPLATES_DOG;

    for (const photo of photos) {
      try {
        const description = pick(descTemplates);
        const nickname = pick(KO_NICKNAMES);
        const imageUrl = photo.urls.regular;

        // Gemini 분석
        const { analysis, severity } = await analyzeImageWithGemini(
          imageUrl,
          species,
          description,
          geminiKey!,
          geminiModel
        );

        // feed_posts insert (시드 식별용 메타데이터 포함)
        const { data: inserted, error } = await sb
          .from("feed_posts")
          .insert({
            author_id: demoUserId!,
            image_url: imageUrl, // Unsplash hotlink 허용 (약관 준수)
            description: `[시드] ${description} — 사진: ${photo.user.name} via Unsplash`,
            pet_name: nickname,
            pet_species: species,
            analysis_result: {
              analysis,
              severity,
              symptomsCount: TOTAL_SYMPTOMS,
              locale: "ko",
              isSeed: true,
              unsplashPhotoId: photo.id,
              unsplashPhotographer: photo.user.name,
              unsplashProfileUrl: photo.user.links.html,
              generatedAt: new Date().toISOString(),
            },
          })
          .select("id")
          .single();

        if (error) {
          results.push({ ok: false, error: error.message, unsplashId: photo.id });
        } else {
          results.push({ ok: true, id: inserted.id, unsplashId: photo.id });
        }
      } catch (err: any) {
        results.push({ ok: false, error: err.message || "unknown", unsplashId: photo.id });
      }
    }

    const succeeded = results.filter((r) => r.ok).length;
    const failed = results.length - succeeded;

    return NextResponse.json({
      success: true,
      requested: count,
      received: photos.length,
      succeeded,
      failed,
      species,
      results,
      note: "시드 피드 생성 완료. Unsplash 약관에 따라 사진 작가 크레딧이 analysis_result.unsplashPhotographer 에 저장됨.",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "시드 생성 서버 오류" },
      { status: 500 }
    );
  }
}
