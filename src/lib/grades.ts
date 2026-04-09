// ====================================
// P.E.T 유저 등급 시스템
// ====================================

export type UserRole = "user" | "expert_vet" | "expert_doctor" | "expert_pharma" | "expert_biz";
export type UserGrade = "newbie" | "beginner" | "intermediate" | "advanced" | "semi_pro" | "master";

export interface GradeInfo {
  grade: UserGrade;
  label: string;
  color: string;
  bgColor: string;
  minPoints: number;
  icon: string;
}

export interface RoleInfo {
  role: UserRole;
  label: string;
  color: string;
  bgColor: string;
  icon: string;
}

// 일반유저 등급 (포인트 기반 자동 승급)
export const GRADE_TABLE: GradeInfo[] = [
  { grade: "newbie",       label: "새싹 반려인",   color: "#888",    bgColor: "#f0f0f0", minPoints: 0,    icon: "🌱" },
  { grade: "beginner",     label: "초보 반려인",   color: "#22C55E", bgColor: "#F0FFF4", minPoints: 100,  icon: "🐾" },
  { grade: "intermediate", label: "중급 반려인",   color: "#3B82F6", bgColor: "#EFF6FF", minPoints: 500,  icon: "💙" },
  { grade: "advanced",     label: "고급 반려인",   color: "#8B5CF6", bgColor: "#F5F3FF", minPoints: 1500, icon: "⭐" },
  { grade: "semi_pro",     label: "준전문가",      color: "#F59E0B", bgColor: "#FFFBEB", minPoints: 5000, icon: "🏅" },
  { grade: "master",       label: "마스터",        color: "#EF4444", bgColor: "#FEF2F2", minPoints: 15000,icon: "👑" },
];

// 전문가 역할 (관리자 인증 후 부여)
export const ROLE_TABLE: RoleInfo[] = [
  { role: "expert_vet",    label: "수의사",   color: "#fff", bgColor: "#2EC4B6", icon: "🩺" },
  { role: "expert_doctor", label: "의사",     color: "#fff", bgColor: "#3B82F6", icon: "⚕️" },
  { role: "expert_pharma", label: "약사",     color: "#fff", bgColor: "#8B5CF6", icon: "💊" },
  { role: "expert_biz",    label: "업체",     color: "#fff", bgColor: "#F59E0B", icon: "🏢" },
];

// 포인트 → 등급 계산
export function getGrade(points: number): GradeInfo {
  for (let i = GRADE_TABLE.length - 1; i >= 0; i--) {
    if (points >= GRADE_TABLE[i].minPoints) return GRADE_TABLE[i];
  }
  return GRADE_TABLE[0];
}

// 다음 등급까지 남은 포인트
export function getNextGrade(points: number): { next: GradeInfo | null; remaining: number } {
  const current = getGrade(points);
  const currentIdx = GRADE_TABLE.findIndex((g) => g.grade === current.grade);
  if (currentIdx >= GRADE_TABLE.length - 1) return { next: null, remaining: 0 };
  const next = GRADE_TABLE[currentIdx + 1];
  return { next, remaining: next.minPoints - points };
}

// 역할 정보 가져오기
export function getRoleInfo(role: string): RoleInfo | null {
  return ROLE_TABLE.find((r) => r.role === role) ?? null;
}

// 등급 승급 조건 안내 텍스트
export const GRADE_REQUIREMENTS = [
  { grade: "새싹 반려인",  condition: "회원가입 시 자동 부여" },
  { grade: "초보 반려인",  condition: "100P 이상 (글 10개 또는 댓글 20개)" },
  { grade: "중급 반려인",  condition: "500P 이상" },
  { grade: "고급 반려인",  condition: "1,500P 이상" },
  { grade: "준전문가",     condition: "5,000P 이상 + 전문가답변 채택 10회 이상" },
  { grade: "마스터",       condition: "15,000P 이상 + 커뮤니티 기여 우수자" },
];

// 포인트 적립 규칙
export const POINT_RULES = [
  { action: "회원가입",         points: "+100P" },
  { action: "게시글 작성",      points: "+10P" },
  { action: "댓글 작성",        points: "+5P" },
  { action: "좋아요 받기",      points: "+2P" },
  { action: "전문가 답변 채택", points: "+50P" },
  { action: "일일 출석",        points: "+3P" },
];
