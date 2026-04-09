import { create } from "zustand";
import type { User, Post } from "../types";

// 데모용 더미 데이터
const DEMO_USER: User = {
  id: "demo-user",
  email: "demo@peteto.com",
  nickname: "대욱",
  avatar_url: null,
  points: 150,
  created_at: "2026-04-01T00:00:00Z",
};

const DEMO_POSTS: Post[] = [
  {
    id: "1", author_id: "demo-user", category: "질문",
    title: "고양이가 갑자기 밥을 안 먹어요 ㅠㅠ 어떻게 해야 하나요?",
    content: "3살 코숏인데 어제부터 갑자기 사료를 안 먹어요. 간식은 조금 먹는데... 병원 가야 할까요?",
    tags: ["고양이", "식욕부진", "건강"], view_count: 342, like_count: 15, comment_count: 23,
    is_expert_answered: true, created_at: "2026-04-05T10:30:00Z",
    author: { id: "u1", email: "", nickname: "냥집사", avatar_url: null, points: 0, created_at: "" },
  },
  {
    id: "2", author_id: "demo-user", category: "정보",
    title: "[정리] 2026년 강아지 예방접종 스케줄 총정리",
    content: "강아지 예방접종 시기와 종류를 정리해봤습니다. DHPPL, 코로나, 켄넬코프, 광견병 등...",
    tags: ["강아지", "예방접종", "정보공유"], view_count: 1205, like_count: 89, comment_count: 12,
    is_expert_answered: false, created_at: "2026-04-05T09:00:00Z",
    author: { id: "u2", email: "", nickname: "멍수의사", avatar_url: null, points: 0, created_at: "" },
  },
  {
    id: "3", author_id: "demo-user", category: "일상",
    title: "우리 뽀삐 오늘 미용했어요 ㅋㅋㅋ 너무 귀엽",
    content: "썸머컷 했는데 진짜 다른 강아지 같아요 ㅋㅋㅋ",
    tags: ["일상", "미용"], view_count: 523, like_count: 67, comment_count: 31,
    is_expert_answered: false, created_at: "2026-04-05T08:15:00Z",
    author: { id: "u3", email: "", nickname: "뽀삐맘", avatar_url: null, points: 0, created_at: "" },
  },
  {
    id: "4", author_id: "demo-user", category: "긴급",
    title: "[급함] 고양시 일산 근처 24시 동물병원 아시는 분??",
    content: "고양이가 갑자기 구토를 심하게 해요.. 지금 새벽 2시인데 24시 동물병원 어디 있나요?",
    tags: ["긴급", "동물병원", "고양시"], view_count: 156, like_count: 8, comment_count: 45,
    is_expert_answered: true, created_at: "2026-04-05T02:00:00Z",
    author: { id: "u4", email: "", nickname: "걱정집사", avatar_url: null, points: 0, created_at: "" },
  },
  {
    id: "5", author_id: "demo-user", category: "질문",
    title: "강아지 산책 하루에 몇 번이 적당한가요?",
    content: "소형견 말티즈 키우는데 하루에 몇 번 산책시켜야 할까요?",
    tags: ["강아지", "산책"], view_count: 287, like_count: 12, comment_count: 18,
    is_expert_answered: false, created_at: "2026-04-04T18:00:00Z",
    author: { id: "u5", email: "", nickname: "말티즈아빠", avatar_url: null, points: 0, created_at: "" },
  },
  {
    id: "6", author_id: "demo-user", category: "정보",
    title: "반려동물 보험 비교 (2026년 최신판)",
    content: "주요 펫보험 5개사 비교해봤습니다. 보장범위, 월 보험료, 면책사항 정리...",
    tags: ["보험", "정보"], view_count: 891, like_count: 45, comment_count: 7,
    is_expert_answered: false, created_at: "2026-04-04T15:30:00Z",
    author: { id: "u6", email: "", nickname: "보험전문가", avatar_url: null, points: 0, created_at: "" },
  },
  {
    id: "7", author_id: "demo-user", category: "일상",
    title: "고양이 집사 1년차 후기 (feat. 입양 추천)",
    content: "작년에 유기묘 입양했는데 진짜 인생이 바뀌었어요. 1년간의 기록을 공유합니다.",
    tags: ["고양이", "입양", "후기"], view_count: 1567, like_count: 203, comment_count: 56,
    is_expert_answered: false, created_at: "2026-04-04T12:00:00Z",
    author: { id: "u7", email: "", nickname: "냥이사랑", avatar_url: null, points: 0, created_at: "" },
  },
  {
    id: "8", author_id: "demo-user", category: "질문",
    title: "고양이 스크래처 추천해주세요",
    content: "집에 있는 스크래처를 다 무시하는데 어떤 게 좋을까요?",
    tags: ["고양이", "용품"], view_count: 198, like_count: 5, comment_count: 14,
    is_expert_answered: false, created_at: "2026-04-04T10:00:00Z",
    author: { id: "u8", email: "", nickname: "츄르도둑", avatar_url: null, points: 0, created_at: "" },
  },
];

interface AppState {
  user: User | null;
  posts: Post[];
  setUser: (user: User | null) => void;
  setPosts: (posts: Post[]) => void;
  initDemo: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  posts: DEMO_POSTS,
  setUser: (user) => set({ user }),
  setPosts: (posts) => set({ posts }),
  initDemo: () => set({ user: DEMO_USER, posts: DEMO_POSTS }),
}));
