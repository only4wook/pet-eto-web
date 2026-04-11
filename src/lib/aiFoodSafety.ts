// 반려동물 음식 안전 가이드

export interface FoodItem {
  name: string;
  keywords: string[];
  dogSafe: "safe" | "caution" | "danger";
  catSafe: "safe" | "caution" | "danger";
  description: string;
  detail: string;
}

export const FOOD_DATABASE: FoodItem[] = [
  // === 위험 (절대 금지) ===
  { name: "초콜릿", keywords: ["초콜릿","초코","쵸코","카카오"], dogSafe: "danger", catSafe: "danger",
    description: "🚨 절대 금지!",
    detail: "테오브로민 성분이 심장·신경계에 치명적. 다크초콜릿이 가장 위험.\n증상: 구토, 설사, 경련, 심장마비\n섭취 시: 즉시 동물병원! 먹은 양과 종류를 알려주세요." },
  { name: "포도/건포도", keywords: ["포도","건포도","레이즌","머스캣"], dogSafe: "danger", catSafe: "danger",
    description: "🚨 절대 금지!",
    detail: "신부전을 유발할 수 있음. 소량도 위험.\n증상: 구토, 설사, 무기력, 소변 감소\n섭취 시: 즉시 동물병원!" },
  { name: "양파/마늘/파", keywords: ["양파","마늘","파","대파","쪽파","부추","리크","샬롯"], dogSafe: "danger", catSafe: "danger",
    description: "🚨 절대 금지!",
    detail: "적혈구를 파괴하여 빈혈 유발. 익혀도 위험!\n고양이가 특히 민감. 양파가 들어간 모든 음식 주의.\n증상: 무기력, 잇몸 창백, 붉은 소변 (2~3일 후 나타남)" },
  { name: "자일리톨", keywords: ["자일리톨","무설탕","무가당 껌","자일","설탕대체"], dogSafe: "danger", catSafe: "caution",
    description: "🚨 강아지 절대 금지!",
    detail: "강아지에서 급격한 혈당 저하 → 간부전 유발.\n껌, 치약, 무설탕 캔디 등에 포함.\n소량도 치명적! 섭취 시 즉시 동물병원." },
  { name: "카페인", keywords: ["커피","카페인","에너지 드링크","홍차","녹차","카페"], dogSafe: "danger", catSafe: "danger",
    description: "🚨 절대 금지!",
    detail: "심박수 증가, 경련, 심장마비 유발 가능.\n커피, 차, 에너지 드링크, 콜라 등 모두 위험." },
  { name: "알코올", keywords: ["술","맥주","소주","와인","알코올","알콜"], dogSafe: "danger", catSafe: "danger",
    description: "🚨 절대 금지!",
    detail: "소량도 간·뇌 손상 유발. 체중이 적어 사람보다 훨씬 위험.\n발효 빵 반죽도 위험 (위에서 알코올 생성)." },
  { name: "아보카도", keywords: ["아보카도","아보"], dogSafe: "danger", catSafe: "danger",
    description: "🚨 위험!",
    detail: "퍼신(persin) 독소가 구토, 설사, 심근 손상 유발.\n씨, 껍질, 과육 모두 위험." },
  { name: "견과류(마카다미아)", keywords: ["마카다미아","견과류","호두","아몬드","견과"], dogSafe: "danger", catSafe: "caution",
    description: "🚨 마카다미아는 절대 금지!",
    detail: "마카다미아: 근육 떨림, 고열, 무기력 유발 (강아지).\n기타 견과류: 높은 지방으로 췌장염 위험.\n소량이라도 주지 마세요." },

  // === 주의 (소량 가능하나 주의) ===
  { name: "우유/유제품", keywords: ["우유","유제품","치즈","요거트","요구르트","밀크","아이스크림"], dogSafe: "caution", catSafe: "caution",
    description: "⚠️ 주의 필요",
    detail: "대부분의 성견/성묘는 유당 불내증 → 설사 유발.\n소량의 플레인 요거트나 저지방 치즈는 OK.\n고양이 전용 우유는 유당 제거되어 안전." },
  { name: "뼈", keywords: ["뼈","뼈다귀","닭뼈","생뼈","뼈간식"], dogSafe: "caution", catSafe: "danger",
    description: "⚠️ 주의!",
    detail: "익힌 뼈는 절대 금지! (쪼개져 내장 손상)\n생뼈는 크기에 맞게 주되, 감독 하에만.\n닭뼈·생선뼈는 특히 위험 (가시가 목에 걸림)." },
  { name: "계란", keywords: ["계란","달걀","에그","날계란"], dogSafe: "caution", catSafe: "caution",
    description: "✅ 익힌 것은 OK",
    detail: "익힌 계란: 훌륭한 단백질 공급원! 간식으로 좋아요.\n날계란: 살모넬라 위험 + 비오틴 흡수 방해. 꼭 익혀서!" },
  { name: "참치", keywords: ["참치","캔 참치","통조림","참치캔","튜나"], dogSafe: "caution", catSafe: "caution",
    description: "⚠️ 소량만 OK",
    detail: "소량 간식으로는 괜찮지만, 주식으로는 부적합.\n⚠️ 사람용 참치캔 주의사항:\n• 소금·기름이 많아 신장에 부담\n• 수은 축적 위험 (자주 먹이면)\n• 기름 참치보다 물 참치가 나음\n• 고양이 전용 참치 간식이 더 안전해요\n\n💡 가끔 소량(1~2스푼)은 괜찮지만 매일 주지 마세요." },

  // === 안전 ===
  { name: "닭가슴살", keywords: ["닭가슴살","닭고기","삶은 닭","치킨","닭","닭안심"], dogSafe: "safe", catSafe: "safe",
    description: "✅ 안전! 추천 간식",
    detail: "삶거나 구운 닭가슴살은 훌륭한 단백질 간식!\n⚠️ 주의: 양념·소금 없이 조리, 뼈 제거 필수.\nKFC·치킨 같은 양념·튀김 치킨은 절대 안 돼요." },
  { name: "고구마", keywords: ["고구마","군고구마","삶은 고구마"], dogSafe: "safe", catSafe: "safe",
    description: "✅ 안전! 좋은 간식",
    detail: "식이섬유·비타민 풍부. 삶거나 찐 것으로.\n너무 많이 주면 가스가 찰 수 있으니 소량씩.\n껍질은 제거하는 것이 좋아요." },
  { name: "당근", keywords: ["당근","캐럿"], dogSafe: "safe", catSafe: "safe",
    description: "✅ 안전! 좋은 간식",
    detail: "비타민A 풍부, 저칼로리 간식. 익혀서 주면 소화가 더 잘 돼요.\n생당근은 이빨 건강에 도움." },
  { name: "블루베리", keywords: ["블루베리","베리","딸기","수박"], dogSafe: "safe", catSafe: "safe",
    description: "✅ 안전!",
    detail: "항산화제 풍부. 수박(씨 제거), 딸기, 블루베리 모두 OK.\n포도는 절대 안 돼요! (포도와 헷갈리지 마세요)" },
  { name: "사과", keywords: ["사과","배","감","귤","오렌지","바나나"], dogSafe: "safe", catSafe: "caution",
    description: "✅ 과육은 안전",
    detail: "과육만 소량 OK. 씨·심·껍질은 제거!\n사과씨에는 시안화물이 미량 포함.\n바나나: 칼륨 풍부하지만 당분 높아 소량만.\n감·귤: 소량 OK." },
  { name: "밥/쌀", keywords: ["밥","쌀","쌀밥","흰쌀","현미"], dogSafe: "safe", catSafe: "caution",
    description: "✅ 소량 OK",
    detail: "소화가 잘 되는 탄수화물. 설사 시 삶은 닭가슴살+흰 쌀이 좋아요.\n하지만 주식으로 쌀만 먹이면 영양 불균형!" },
  { name: "연어/생선", keywords: ["연어","생선","고등어","광어","참치","오메가"], dogSafe: "safe", catSafe: "safe",
    description: "✅ 익힌 것은 OK",
    detail: "오메가3 풍부, 피모 건강에 좋아요.\n⚠️ 반드시 익혀서! 날생선은 기생충·세균 위험.\n⚠️ 뼈 완전 제거 필수." },
];

// 질문에서 음식 찾기
export function findFood(query: string): FoodItem | null {
  const q = query.toLowerCase();
  for (const food of FOOD_DATABASE) {
    for (const kw of food.keywords) {
      if (q.includes(kw)) return food;
    }
  }
  return null;
}

// 음식 응답 포맷
export function formatFoodResponse(food: FoodItem, query: string): string {
  const q = query.toLowerCase();
  const isCat = q.includes("고양이") || q.includes("냥");
  const isDog = q.includes("강아지") || q.includes("개") || q.includes("멍");
  const safety = isCat ? food.catSafe : isDog ? food.dogSafe : food.dogSafe;

  const safetyLabel = safety === "danger" ? "🚨 위험" : safety === "caution" ? "⚠️ 주의" : "✅ 안전";
  const animal = isCat ? "고양이" : isDog ? "강아지" : "반려동물";

  let resp = `🍽️ ${animal}와 ${food.name}\n\n`;
  resp += `${safetyLabel} — ${food.description}\n\n`;
  resp += `${food.detail}\n`;

  if (safety === "danger") {
    resp += `\n🚨 이미 먹었다면 즉시 동물병원에 연락하세요!\n먹은 양과 시간을 메모해서 수의사에게 알려주세요.`;
  }

  return resp;
}
