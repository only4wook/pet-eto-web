export type UserRole = "user" | "vet" | "vet_student" | "vet_clinic" | "behaviorist" | "petshop" | "admin";

export interface User {
  id: string;
  email: string;
  nickname: string;
  avatar_url: string | null;
  points: number;
  created_at: string;
  role?: UserRole;
  clinic_name?: string | null;
  license_no?: string | null;
  school_name?: string | null;
  specialty?: string | null;
  // 닉네임을 사용자가 직접 설정했는지 (true면 자동 덮어쓰기 금지)
  nickname_set_by_user?: boolean;
}

export interface Pet {
  id: string;
  owner_id: string;
  name: string;
  species: "dog" | "cat" | "fish" | "reptile" | "other";
  breed: string;
  birth_date: string | null;
  gender: "male" | "female" | "unknown";
  weight: number | null;
  photo_url: string | null;
  medical_notes: string | null;
  created_at: string;
}

export type PostCategory = "전체" | "질문" | "정보" | "일상" | "긴급" | "후기" | "문의" | "논문" | "행사";

export interface Post {
  id: string;
  author_id: string;
  category: string;
  title: string;
  content: string;
  tags: string[];
  view_count: number;
  like_count: number;
  comment_count: number;
  is_expert_answered: boolean;
  created_at: string;
  author?: User;
}

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  is_expert: boolean;
  like_count: number;
  created_at: string;
  author?: User;
}

// 숏폼 피드
export type ExpertTarget = "vet" | "vet_clinic" | "behaviorist";
export type ExpertStatus = "none" | "pending" | "answered";

export interface FeedPost {
  id: string;
  author_id: string;
  image_url: string;
  description: string;
  pet_name: string;
  pet_species: string;
  analysis_result: AnalysisResult | null;
  like_count: number;
  comment_count: number;
  created_at: string;
  author?: User;
  // 전문가 답변 요청 메타 (2026-04-19 추가)
  request_expert?: boolean;
  expert_target?: ExpertTarget | null;
  expert_status?: ExpertStatus;
  accepted_expert_answer_id?: string | null;
  answer_accepted_at?: string | null;
  expert_auto_settled_at?: string | null;
}

export interface AnalysisResult {
  severity: "normal" | "mild" | "moderate" | "urgent";
  symptoms: string[];
  summary: string;
  recommendation: string;
  // 구조화된 AI 분석 (2026-04-19)
  fgs_total?: number | null;          // 0~10 (고양이 FGS 통증 지수)
  fgs_breakdown?: {
    ear?: number | null;
    orbital?: number | null;
    muzzle?: number | null;
    whiskers?: number | null;
    head?: number | null;
  } | null;
  severity_score?: number | null;     // 0~10
  bboxes?: BBox[];                    // 이미지 부위 마킹
}

export interface BBox {
  label: string;
  x: number;   // 0~1 normalized
  y: number;
  w: number;
  h: number;
}

export interface FeedComment {
  id: string;
  feed_post_id: string;
  author_id: string;
  content: string;
  created_at: string;
  author?: User;
}

// 전문가 답변
export interface ExpertAnswer {
  id: string;
  feed_post_id: string;
  expert_id: string;
  content: string;
  expert_role: UserRole;
  expert_name: string | null;
  expert_clinic: string | null;
  expert_license: string | null;
  severity_opinion: "normal" | "mild" | "moderate" | "urgent" | null;
  follow_up_recommended: boolean;
  created_at: string;
  reward_status?: "none" | "accepted" | "auto_paid";
  reward_points?: number;
  rewarded_at?: string | null;
  expert?: User;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string | null;
  link: string | null;
  is_read: boolean;
  created_at: string;
}

// 전문가 계정 신청
export interface ExpertApplication {
  id: string;
  user_id: string;
  requested_role: UserRole;
  real_name: string;
  clinic_name: string | null;
  license_no: string | null;
  school_name: string | null;
  specialty: string | null;
  experience_years: number | null;
  license_doc_url: string | null;
  intro: string | null;
  phone: string | null;
  status: "pending" | "approved" | "rejected";
  reviewer_id: string | null;
  reviewer_note: string | null;
  created_at: string;
  reviewed_at: string | null;
  user?: User;
}

export interface VetClinic {
  name: string;
  address: string;
  phone: string;
  distance: number;
  lat: number;
  lng: number;
  is24h: boolean;
}
