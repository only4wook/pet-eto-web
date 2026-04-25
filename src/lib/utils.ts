export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "방금 전";
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const h = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${m}.${d} ${h}:${min}`;
}

// 피드 표시용: 과거 업로드 데이터에 description 안으로 섞여 들어간 AI 분석 전문 제거.
// AI 분석은 analysis_result에서 상세 카드로만 보여주고, 작성자 본문에는 사용자 글만 남긴다.
export function stripInlineAiAnalysis(description: string | null | undefined): string {
  const text = String(description || "");
  const markers = [
    /\s*🤖\s*/i,
    /\s*(?:-{2,}|—+|–+)\s*(?:🤖\s*)?AI\s*(?:이미지\s*)?분석\s*[:：]?/i,
    /\s*(?:🤖\s*)?AI\s*(?:이미지\s*)?분석\s*[:：]?/i,
    /\s*사진\s*\d+\s*장\s*분석\s*결과/i,
    /\s*\[\s*사진\s*\d+\s*\]/i,
  ];

  let cutAt = text.length;
  for (const marker of markers) {
    const match = marker.exec(text);
    if (match && match.index < cutAt) cutAt = match.index;
  }

  return text.slice(0, cutAt).replace(/[\s\-—–|:：]+$/g, "").trim();
}

export function getCategoryColor(cat: string): string {
  switch (cat) {
    case "질문": return "#3B82F6";
    case "정보": return "#22C55E";
    case "일상": return "#A855F7";
    case "긴급": return "#EF4444";
    default: return "#888";
  }
}

// 익명 닉네임 생성 (소셜 로그인 시 이메일/ID 노출 방지용)
// 예: "보송한집사4821", "귀여운반려인2019"
const NICKNAME_ADJ = [
  "보송한", "귀여운", "포근한", "다정한", "씩씩한", "행복한", "든든한",
  "부드러운", "따뜻한", "상냥한", "사랑스런", "말랑한", "뽀송한", "느긋한",
];
const NICKNAME_NOUN = [
  "집사", "반려인", "펫러버", "냥집사", "멍집사", "펫프렌드", "털친구",
  "보호자", "가족", "펫맘", "펫대디",
];
export function generateAnonymousNickname(seed?: string): string {
  // seed(보통 user.id)가 있으면 결정론적 해시, 없으면 랜덤
  let h = 0;
  if (seed) {
    for (let i = 0; i < seed.length; i++) {
      h = ((h << 5) - h + seed.charCodeAt(i)) | 0;
    }
    h = Math.abs(h);
  } else {
    h = Math.floor(Math.random() * 100000);
  }
  const adj = NICKNAME_ADJ[h % NICKNAME_ADJ.length];
  const noun = NICKNAME_NOUN[Math.floor(h / NICKNAME_ADJ.length) % NICKNAME_NOUN.length];
  const num = (h % 9000) + 1000; // 1000~9999
  return `${adj}${noun}${num}`;
}

// 표시용 닉네임 안전 처리 — 이메일/UUID/ID가 닉네임 자리에 들어와 있으면 익명 닉네임으로 마스킹
// 개인정보 보호: 로그인 계정 식별자가 절대 피드/커뮤니티에 노출되지 않도록 방어선 역할
export function safeNickname(nickname: string | null | undefined, fallbackSeed?: string): string {
  if (!nickname) return generateAnonymousNickname(fallbackSeed);
  const n = String(nickname).trim();
  if (!n) return generateAnonymousNickname(fallbackSeed);

  // 1) 이메일 (@ 포함) → 차단
  if (n.includes("@")) return generateAnonymousNickname(fallbackSeed);

  // 2) UUID 형식 (예: 8d2f5a...-...) → 차단
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(n)) {
    return generateAnonymousNickname(fallbackSeed);
  }

  // 3) 순수 숫자 또는 랜덤 해시처럼 보이는 문자열 → 차단
  if (/^\d{6,}$/.test(n)) return generateAnonymousNickname(fallbackSeed);
  if (/^[a-f0-9]{16,}$/i.test(n)) return generateAnonymousNickname(fallbackSeed);

  // 4) 카카오 OAuth ID (kakao_xxxxxxxx 형식) → 차단
  if (/^(kakao|google|naver)[_-]?\d+$/i.test(n)) return generateAnonymousNickname(fallbackSeed);

  // 5) 지나치게 긴 닉네임 (24자 초과) → 개인정보 포함 가능성 → 차단
  if (n.length > 24) return generateAnonymousNickname(fallbackSeed);

  // 6) "영문+숫자4자리 이상" 패턴 (예: gsh941025, kim0825) → 이메일 로컬파트/아이디 가능성
  //    생년월일/전화번호 끝자리 노출 위험 → 익명 닉네임으로 마스킹
  //    단, 한글이 포함된 닉네임(예: "포메2024")은 제외 — 의도적인 영문+숫자 닉네임만 차단
  const hasHangul = /[가-힣]/.test(n);
  const looksLikeEmailLocal = /^[a-z]+\d{4,}$/i.test(n) || /^[a-z]{2,}[._-]?\d{4,}$/i.test(n);
  if (!hasHangul && looksLikeEmailLocal) return generateAnonymousNickname(fallbackSeed);

  return n;
}
