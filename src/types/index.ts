export interface User {
  id: string;
  email: string;
  nickname: string;
  avatar_url: string | null;
  points: number;
  created_at: string;
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

export type PostCategory = "전체" | "질문" | "정보" | "일상" | "긴급";

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
}

export interface AnalysisResult {
  severity: "normal" | "mild" | "moderate" | "urgent";
  symptoms: string[];
  summary: string;
  recommendation: string;
}

export interface FeedComment {
  id: string;
  feed_post_id: string;
  author_id: string;
  content: string;
  created_at: string;
  author?: User;
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
