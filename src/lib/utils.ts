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

// 표시용 닉네임 안전 처리 — 최소한의 방어선 (사용자가 직접 입력한 닉네임은 존중)
// 차단 대상: 이메일·UUID·카카오/구글 OAuth ID처럼 '명확히 식별자 형태'인 것만
// 일반 영문+숫자 닉네임(gsh941025 등)은 사용자 의도일 수 있으므로 **그대로 표시**.
// 개인정보가 걱정되면 사용자가 /mypage에서 본인이 바꿀 수 있게 해야 함.
export function safeNickname(nickname: string | null | undefined, fallbackSeed?: string): string {
  if (!nickname) return generateAnonymousNickname(fallbackSeed);
  const n = String(nickname).trim();
  if (!n) return generateAnonymousNickname(fallbackSeed);

  // 1) 이메일 (@ 포함) → 차단
  if (n.includes("@")) return generateAnonymousNickname(fallbackSeed);

  // 2) UUID → 차단
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(n)) {
    return generateAnonymousNickname(fallbackSeed);
  }

  // 3) OAuth 프로바이더 ID (kakao_123456 등) → 차단
  if (/^(kakao|google|naver)[_-]?\d+$/i.test(n)) return generateAnonymousNickname(fallbackSeed);

  // 4) 너무 긴 닉네임 (36자 초과) → 차단
  if (n.length > 36) return generateAnonymousNickname(fallbackSeed);

  // 그 외에는 사용자가 입력한 닉네임을 그대로 존중
  return n;
}
