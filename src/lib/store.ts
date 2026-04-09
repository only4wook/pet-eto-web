import { create } from "zustand";
import type { User, Post } from "../types";

const DEMO_USER: User = {
  id: "demo-user", email: "demo@peteto.com", nickname: "대욱",
  avatar_url: null, points: 150, created_at: "2026-04-01T00:00:00Z",
};

const u = (id: string, nick: string, pts: number): User => ({
  id, email: "", nickname: nick, avatar_url: null, points: pts, created_at: "",
});

const DEMO_POSTS: Post[] = [
  // === 질문 (10개) ===
  { id: "q1", author_id: "u1", category: "질문", title: "고양이가 갑자기 밥을 안 먹어요 ㅠㅠ 어떻게 해야 하나요?", content: "3살 코숏인데 어제부터 갑자기 사료를 안 먹어요. 간식은 조금 먹는데... 병원 가야 할까요?", tags: ["고양이", "식욕부진", "건강"], view_count: 342, like_count: 15, comment_count: 23, is_expert_answered: true, created_at: "2026-04-09T10:30:00Z", author: u("u1", "냥집사", 350) },
  { id: "q2", author_id: "u5", category: "질문", title: "강아지 산책 하루에 몇 번이 적당한가요?", content: "소형견 말티즈 키우는데 하루에 몇 번 산책시켜야 할까요? 요즘 날씨도 더워지는데...", tags: ["강아지", "산책"], view_count: 287, like_count: 12, comment_count: 18, is_expert_answered: false, created_at: "2026-04-09T08:00:00Z", author: u("u5", "말티즈아빠", 220) },
  { id: "q3", author_id: "u8", category: "질문", title: "고양이 스크래처 추천해주세요", content: "집에 있는 스크래처를 다 무시하는데 어떤 게 좋을까요? 캣타워 말고 단독형으로요", tags: ["고양이", "용품"], view_count: 198, like_count: 5, comment_count: 14, is_expert_answered: false, created_at: "2026-04-08T22:00:00Z", author: u("u8", "츄르도둑", 80) },
  { id: "q4", author_id: "u9", category: "질문", title: "강아지 귀에서 냄새가 나요... 외이염인가요?", content: "3일 전부터 귀를 자꾸 긁고 냄새가 나는데, 외이염 증상인지 궁금합니다", tags: ["강아지", "외이염", "귀"], view_count: 445, like_count: 22, comment_count: 31, is_expert_answered: true, created_at: "2026-04-08T16:00:00Z", author: u("u9", "댕댕이맘", 510) },
  { id: "q5", author_id: "u10", category: "질문", title: "고양이 중성화 수술 시기가 언제가 좋나요?", content: "5개월 된 수컷 고양이인데 중성화 시기를 고민 중입니다. 너무 빨라도 안 좋다고 해서...", tags: ["고양이", "중성화", "수술"], view_count: 678, like_count: 34, comment_count: 27, is_expert_answered: true, created_at: "2026-04-08T10:00:00Z", author: u("u10", "초보집사", 120) },
  { id: "q6", author_id: "u11", category: "질문", title: "강아지 사료 추천 좀 해주세요 (소형견)", content: "말티즈 2살인데 지금 먹는 사료가 단종됐어요. 비슷한 가격대 추천 부탁드립니다", tags: ["강아지", "사료", "추천"], view_count: 523, like_count: 18, comment_count: 42, is_expert_answered: false, created_at: "2026-04-07T20:00:00Z", author: u("u11", "사료고민중", 90) },
  { id: "q7", author_id: "u12", category: "질문", title: "고양이가 화분 흙을 먹어요... 괜찮은 건가요?", content: "베란다 화분 흙을 자꾸 파먹는데 혹시 영양 결핍인 건지 걱정됩니다", tags: ["고양이", "이상행동"], view_count: 312, like_count: 8, comment_count: 15, is_expert_answered: false, created_at: "2026-04-07T14:00:00Z", author: u("u12", "식물집사", 150) },
  { id: "q8", author_id: "u13", category: "질문", title: "강아지 분리불안 어떻게 교정하나요?", content: "출근하면 계속 짖고 물건을 물어뜯어요. 분리불안 교정 방법이 있을까요?", tags: ["강아지", "분리불안", "행동교정"], view_count: 891, like_count: 56, comment_count: 38, is_expert_answered: true, created_at: "2026-04-07T09:00:00Z", author: u("u13", "직장인집사", 280) },
  { id: "q9", author_id: "u14", category: "질문", title: "고양이 구내염 치료비가 얼마나 드나요?", content: "수의사님이 구내염이라고 하시는데 발치 치료를 권하시더라고요. 비용이 궁금합니다", tags: ["고양이", "구내염", "치료비"], view_count: 456, like_count: 13, comment_count: 25, is_expert_answered: true, created_at: "2026-04-06T18:00:00Z", author: u("u14", "구내염투병", 170) },
  { id: "q10", author_id: "u15", category: "질문", title: "강아지 첫 목욕 언제 시키면 되나요?", content: "2개월 된 강아지인데 아직 목욕을 안 시켰어요. 언제부터 가능한가요?", tags: ["강아지", "목욕", "초보"], view_count: 234, like_count: 7, comment_count: 12, is_expert_answered: false, created_at: "2026-04-06T12:00:00Z", author: u("u15", "강아지초보", 60) },

  // === 정보 (10개) ===
  { id: "i1", author_id: "u2", category: "정보", title: "[정리] 2026년 강아지 예방접종 스케줄 총정리", content: "강아지 예방접종 시기와 종류를 정리해봤습니다. DHPPL, 코로나, 켄넬코프, 광견병 등...", tags: ["강아지", "예방접종", "정보공유"], view_count: 1205, like_count: 89, comment_count: 12, is_expert_answered: false, created_at: "2026-04-09T09:00:00Z", author: u("u2", "멍수의사", 2800) },
  { id: "i2", author_id: "u6", category: "정보", title: "반려동물 보험 비교 (2026년 최신판)", content: "주요 펫보험 5개사 비교해봤습니다. 보장범위, 월 보험료, 면책사항 정리...", tags: ["보험", "정보"], view_count: 891, like_count: 45, comment_count: 7, is_expert_answered: false, created_at: "2026-04-09T06:30:00Z", author: u("u6", "보험전문가", 1500) },
  { id: "i3", author_id: "u16", category: "정보", title: "고양이가 절대 먹으면 안 되는 음식 리스트", content: "초콜릿, 포도, 양파, 마늘, 자일리톨 등 고양이에게 독이 되는 음식 총정리입니다", tags: ["고양이", "음식", "주의"], view_count: 2341, like_count: 178, comment_count: 34, is_expert_answered: true, created_at: "2026-04-08T20:00:00Z", author: u("u16", "수의사김", 5200) },
  { id: "i4", author_id: "u17", category: "정보", title: "강아지 치석 관리하는 꿀팁 5가지", content: "매일 양치가 힘들다면 이 방법들을 시도해보세요. 덴탈껌 선택법부터 칫솔 습관까지", tags: ["강아지", "치석", "관리"], view_count: 678, like_count: 42, comment_count: 15, is_expert_answered: false, created_at: "2026-04-08T14:00:00Z", author: u("u17", "치과수의사", 3100) },
  { id: "i5", author_id: "u18", category: "정보", title: "여름철 반려동물 열사병 예방법", content: "여름에 특히 주의해야 할 열사병! 증상 확인법과 응급처치 방법을 알려드립니다", tags: ["여름", "열사병", "응급"], view_count: 1567, like_count: 102, comment_count: 28, is_expert_answered: true, created_at: "2026-04-08T08:00:00Z", author: u("u18", "동물병원장", 7800) },
  { id: "i6", author_id: "u19", category: "정보", title: "고양이 화장실 모래 종류별 장단점 비교", content: "벤토나이트, 두부모래, 카사바, 펄프... 각 모래의 장단점과 추천 브랜드 정리", tags: ["고양이", "모래", "비교"], view_count: 934, like_count: 56, comment_count: 22, is_expert_answered: false, created_at: "2026-04-07T18:00:00Z", author: u("u19", "모래연구가", 890) },
  { id: "i7", author_id: "u20", category: "정보", title: "반려동물 등록 방법 (2026년 의무화)", content: "내장형 칩 의무화 시행! 미등록 시 과태료, 등록 방법, 비용까지 총정리했습니다", tags: ["등록", "의무화", "법률"], view_count: 2103, like_count: 134, comment_count: 41, is_expert_answered: false, created_at: "2026-04-07T12:00:00Z", author: u("u20", "펫법률가", 1200) },
  { id: "i8", author_id: "u21", category: "정보", title: "강아지 발바닥 갈라짐 원인과 케어법", content: "겨울에 특히 심해지는 발바닥 갈라짐! 원인별 케어 방법과 추천 밤(balm) 제품 소개", tags: ["강아지", "발바닥", "케어"], view_count: 567, like_count: 31, comment_count: 11, is_expert_answered: false, created_at: "2026-04-06T20:00:00Z", author: u("u21", "그루머", 670) },
  { id: "i9", author_id: "u22", category: "정보", title: "고양이 스트레스 신호 10가지 체크리스트", content: "고양이가 스트레스를 받으면 보이는 행동 변화 10가지! 여러분의 고양이는 괜찮나요?", tags: ["고양이", "스트레스", "행동"], view_count: 1890, like_count: 145, comment_count: 52, is_expert_answered: true, created_at: "2026-04-06T14:00:00Z", author: u("u22", "고양이행동학", 4500) },
  { id: "i10", author_id: "u23", category: "정보", title: "반려견 MBTI? 견종별 성격 유형 정리", content: "우리 강아지 성격은 어떤 유형? 인기 견종 20종의 성격, 운동량, 주의사항 총정리", tags: ["강아지", "견종", "성격"], view_count: 3456, like_count: 234, comment_count: 67, is_expert_answered: false, created_at: "2026-04-06T08:00:00Z", author: u("u23", "견종박사", 2100) },

  // === 일상 (10개) ===
  { id: "d1", author_id: "u3", category: "일상", title: "우리 뽀삐 오늘 미용했어요 ㅋㅋㅋ 너무 귀엽", content: "썸머컷 했는데 진짜 다른 강아지 같아요 ㅋㅋㅋ 집에 오니까 어색해하네요", tags: ["일상", "미용"], view_count: 523, like_count: 67, comment_count: 31, is_expert_answered: false, created_at: "2026-04-09T08:15:00Z", author: u("u3", "뽀삐맘", 430) },
  { id: "d2", author_id: "u7", category: "일상", title: "고양이 집사 1년차 후기 (feat. 입양 추천)", content: "작년에 유기묘 입양했는데 진짜 인생이 바뀌었어요. 1년간의 기록을 공유합니다.", tags: ["고양이", "입양", "후기"], view_count: 1567, like_count: 203, comment_count: 56, is_expert_answered: false, created_at: "2026-04-09T06:00:00Z", author: u("u7", "냥이사랑", 1800) },
  { id: "d3", author_id: "u24", category: "일상", title: "오늘 강아지랑 한강 산책 다녀왔어요!", content: "날씨 좋아서 한강공원에서 2시간 뛰었더니 차에서 바로 잠들었네요 ㅎㅎ", tags: ["산책", "한강", "일상"], view_count: 345, like_count: 45, comment_count: 8, is_expert_answered: false, created_at: "2026-04-08T18:00:00Z", author: u("u24", "산책러버", 320) },
  { id: "d4", author_id: "u25", category: "일상", title: "고양이가 택배 박스를 점령했습니다", content: "택배 뜯자마자 박스 안에 들어감 ㅋㅋ 1시간째 안 나오는 중", tags: ["고양이", "일상", "웃김"], view_count: 2345, like_count: 312, comment_count: 78, is_expert_answered: false, created_at: "2026-04-08T12:00:00Z", author: u("u25", "박스주인", 560) },
  { id: "d5", author_id: "u26", category: "일상", title: "우리집 강아지 생일파티 했어요 🎂", content: "수제 강아지 케이크 만들어줬는데 30초만에 다 먹음... 행복하면 됐지 뭐 ㅎㅎ", tags: ["생일", "케이크", "일상"], view_count: 789, like_count: 98, comment_count: 23, is_expert_answered: false, created_at: "2026-04-08T06:00:00Z", author: u("u26", "생일축하", 410) },
  { id: "d6", author_id: "u27", category: "일상", title: "고양이 캣휠 들여왔는데 대성공이에요", content: "살찐 고양이 운동시키려고 캣휠 사줬는데 밤마다 미친듯이 돌림 ㅋㅋ 다이어트 성공 기원", tags: ["고양이", "캣휠", "다이어트"], view_count: 1234, like_count: 167, comment_count: 45, is_expert_answered: false, created_at: "2026-04-07T20:00:00Z", author: u("u27", "캣휠러", 290) },
  { id: "d7", author_id: "u28", category: "일상", title: "강아지 수영 첫 도전기 (feat. 구명조끼)", content: "구명조끼 입혀서 한강에서 수영 시켰는데 처음엔 무서워하다가 나중엔 안 나올라 함", tags: ["강아지", "수영", "도전"], view_count: 567, like_count: 72, comment_count: 19, is_expert_answered: false, created_at: "2026-04-07T14:00:00Z", author: u("u28", "수영코치", 180) },
  { id: "d8", author_id: "u29", category: "일상", title: "다묘가정 5마리의 하루 일과", content: "5마리 고양이와 사는 일상을 공유합니다. 아침 사료전쟁부터 밤 이불뺏기까지...", tags: ["다묘", "일상", "고양이"], view_count: 1890, like_count: 245, comment_count: 62, is_expert_answered: false, created_at: "2026-04-07T08:00:00Z", author: u("u29", "다묘집사", 2300) },
  { id: "d9", author_id: "u30", category: "일상", title: "펫카페 가봤는데 우리 강아지 사회성이...", content: "다른 강아지 보면 숨는 우리 강아지... 사회성 기르려고 갔는데 구석에서 안 나옴 ㅠ", tags: ["펫카페", "사회성", "강아지"], view_count: 456, like_count: 34, comment_count: 27, is_expert_answered: false, created_at: "2026-04-06T18:00:00Z", author: u("u30", "소심이아빠", 140) },
  { id: "d10", author_id: "u31", category: "일상", title: "고양이가 노트북 위에서 안 내려와요", content: "재택근무 중인데 키보드 위에 앉아서 안 움직임. 오늘 야근 확정입니다.", tags: ["고양이", "재택", "일상"], view_count: 3456, like_count: 456, comment_count: 89, is_expert_answered: false, created_at: "2026-04-06T10:00:00Z", author: u("u31", "재택집사", 780) },

  // === 긴급 (10개) ===
  { id: "e1", author_id: "u4", category: "긴급", title: "[급함] 고양시 일산 근처 24시 동물병원 아시는 분??", content: "고양이가 갑자기 구토를 심하게 해요.. 지금 새벽 2시인데 24시 동물병원 어디 있나요?", tags: ["긴급", "동물병원", "고양시"], view_count: 156, like_count: 8, comment_count: 45, is_expert_answered: true, created_at: "2026-04-09T02:00:00Z", author: u("u4", "걱정집사", 230) },
  { id: "e2", author_id: "u32", category: "긴급", title: "[긴급] 강아지가 초콜릿을 먹었어요!", content: "다크 초콜릿 한 조각을 먹었는데 지금 토할 것 같아해요. 응급처치 어떻게 하나요?", tags: ["긴급", "초콜릿", "중독"], view_count: 789, like_count: 12, comment_count: 56, is_expert_answered: true, created_at: "2026-04-08T23:00:00Z", author: u("u32", "급한사람", 70) },
  { id: "e3", author_id: "u33", category: "긴급", title: "[도움] 고양이가 실 같은 걸 삼켰어요", content: "바느질하다가 실을 삼킨 것 같은데 입에서 실이 나와있어요. 잡아당겨도 되나요?", tags: ["긴급", "이물질", "고양이"], view_count: 567, like_count: 6, comment_count: 38, is_expert_answered: true, created_at: "2026-04-08T20:00:00Z", author: u("u33", "다급한집사", 40) },
  { id: "e4", author_id: "u34", category: "긴급", title: "[급] 강아지가 다리를 절뚝거려요", content: "산책 중에 갑자기 왼쪽 뒷다리를 못 짚어요. 탈구인지 골절인지 모르겠어요", tags: ["긴급", "부상", "다리"], view_count: 345, like_count: 5, comment_count: 29, is_expert_answered: true, created_at: "2026-04-08T16:00:00Z", author: u("u34", "산책중사고", 110) },
  { id: "e5", author_id: "u35", category: "긴급", title: "[SOS] 고양이 경련 증상이에요 어떡하죠", content: "갑자기 몸을 떨면서 경련을 일으켰어요. 5분 정도 지속됐는데 지금은 멈췄어요", tags: ["긴급", "경련", "고양이"], view_count: 234, like_count: 4, comment_count: 52, is_expert_answered: true, created_at: "2026-04-08T03:00:00Z", author: u("u35", "공포의밤", 30) },
  { id: "e6", author_id: "u36", category: "긴급", title: "[급함] 강아지 눈에서 피가 나요", content: "놀다가 부딪힌 건지 눈 주변에서 피가 나고 있어요. 눈을 못 뜨는데 어떡하죠?", tags: ["긴급", "눈", "출혈"], view_count: 178, like_count: 3, comment_count: 34, is_expert_answered: true, created_at: "2026-04-07T22:00:00Z", author: u("u36", "눈다침", 50) },
  { id: "e7", author_id: "u37", category: "긴급", title: "[긴급] 고양이가 배를 누르면 울어요", content: "만지면 고통스러워하고 밥도 안 먹어요. 복막염인 건 아닌지 걱정됩니다", tags: ["긴급", "복통", "고양이"], view_count: 290, like_count: 7, comment_count: 41, is_expert_answered: true, created_at: "2026-04-07T15:00:00Z", author: u("u37", "복통집사", 130) },
  { id: "e8", author_id: "u38", category: "긴급", title: "[도움] 강아지가 벌에 쏘였어요!", content: "산책 중 벌에 쏘여서 입 주변이 부어오르고 있어요. 알러지 반응인 것 같아요", tags: ["긴급", "벌", "알러지"], view_count: 412, like_count: 9, comment_count: 36, is_expert_answered: true, created_at: "2026-04-07T10:00:00Z", author: u("u38", "벌주의", 90) },
  { id: "e9", author_id: "u39", category: "긴급", title: "[급] 고양이가 높은 데서 떨어졌어요", content: "5층 베란다에서 떨어졌는데 걸어는 다니는데 배를 끌고 다녀요. 내장 손상인가요?", tags: ["긴급", "낙상", "고양이"], view_count: 567, like_count: 11, comment_count: 48, is_expert_answered: true, created_at: "2026-04-06T20:00:00Z", author: u("u39", "베란다사고", 60) },
  { id: "e10", author_id: "u40", category: "긴급", title: "[긴급] 강아지가 세제를 핥았어요", content: "바닥 청소 후 세제 성분이 남아있었는데 핥은 것 같아요. 거품을 토하고 있어요", tags: ["긴급", "중독", "세제"], view_count: 345, like_count: 6, comment_count: 43, is_expert_answered: true, created_at: "2026-04-06T14:00:00Z", author: u("u40", "세제사고", 20) },
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
