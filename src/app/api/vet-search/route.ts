import { NextRequest, NextResponse } from "next/server";

// 동물병원 자동 검색 API (카카오 로컬 API 프록시)
// 환경변수 필요: KAKAO_REST_API_KEY (카카오 디벨로퍼스에서 발급)
// 없으면 빈 결과 반환 + 사용자에게 수동 입력 유도

type KakaoPlace = {
  id: string;
  place_name: string;
  category_name: string;
  phone: string;
  address_name: string;
  road_address_name: string;
  x: string; // longitude
  y: string; // latitude
};

export async function GET(req: NextRequest) {
  const apiKey = process.env.KAKAO_REST_API_KEY;
  const query = req.nextUrl.searchParams.get("q")?.trim();

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  if (!apiKey) {
    return NextResponse.json({
      results: [],
      hint: "KAKAO_REST_API_KEY 미설정 — 관리자에게 문의",
    });
  }

  try {
    // 카테고리 코드: HP8 = 병원 (동물병원 포함)
    // 키워드 검색 + 전국 범위
    const url = new URL("https://dapi.kakao.com/v2/local/search/keyword.json");
    url.searchParams.set("query", `${query} 동물병원`);
    url.searchParams.set("size", "10");
    url.searchParams.set("sort", "accuracy");

    const kakaoRes = await fetch(url.toString(), {
      headers: { Authorization: `KakaoAK ${apiKey}` },
      cache: "no-store",
    });

    if (!kakaoRes.ok) {
      const errText = await kakaoRes.text();
      return NextResponse.json(
        { results: [], error: `Kakao API 오류 ${kakaoRes.status}`, detail: errText.slice(0, 200) },
        { status: 200 }
      );
    }

    const data = await kakaoRes.json();
    const documents: KakaoPlace[] = data.documents || [];

    // 동물병원 키워드 필터 (일반 병원 제거)
    const vets = documents.filter((p) =>
      p.category_name.includes("동물병원") ||
      p.place_name.includes("동물") ||
      /펫|애니멀|animal|VET|24시 동물/i.test(p.place_name)
    );

    return NextResponse.json({
      results: vets.map((p) => ({
        id: p.id,
        name: p.place_name,
        phone: p.phone,
        address: p.road_address_name || p.address_name,
        category: p.category_name,
        lat: parseFloat(p.y),
        lng: parseFloat(p.x),
      })),
    });
  } catch (err: any) {
    return NextResponse.json({ results: [], error: err.message || "서버 오류" }, { status: 200 });
  }
}
