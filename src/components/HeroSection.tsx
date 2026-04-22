"use client";
import { useState, useRef, useEffect } from "react";
import { CAT_DATA, DOG_DATA } from "../lib/wikiData";
import { analyzeSymptoms } from "../lib/symptomAnalyzer";
import { searchVetByArea } from "../lib/vetSearch";
import { findSymptomGuide, formatSymptomResponse, detectAnimal } from "../lib/aiKnowledge";
import { findFood, formatFoodResponse } from "../lib/aiFoodSafety";
import { BREED_DISEASE_DATA } from "../lib/wikiDiseaseData";
import { useAppStore } from "../lib/store";
import { supabase } from "../lib/supabase";
import { useI18n } from "./I18nProvider";
import { findEnglishFallback, defaultEnglishResponse } from "../lib/aiFallbackEn";

// 지역 키워드 추출 (세부 지역 우선 매칭, 동물 이름 혼동 방지)
function findArea(q: string): string | null {
  // 세부 지역(구/동)을 먼저 매칭 — 더 구체적인 것이 우선
  const detailAreas = [
    // 서울 25개구 + 주요 동/역/랜드마크
    "강남구","역삼","삼성","논현","청담","압구정","신사","도곡","대치","개포","일원","수서","세곡",
    "강동구","천호","길동","둔촌","명일","고덕","상일","강일","암사",
    "강북구","수유","미아","번동","우이","인수",
    "강서구","화곡","마곡","발산","등촌","가양","염창","방화","공항",
    "관악구","신림","봉천","낙성대","서울대입구","남현",
    "광진구","건대","자양","구의","광나루","중곡","능동","군자",
    "구로구","구로","디지털단지","신도림","개봉","오류","고척",
    "금천구","가산","독산","시흥",
    "노원구","노원","상계","중계","하계","월계","공릉",
    "도봉구","도봉","방학","쌍문","창동",
    "동대문구","회기","청량리","전농","답십리","장안","용두","신설",
    "동작구","사당","노량진","대방","신대방","흑석","동작","상도",
    "마포구","합정","상수","망원","연남","서교","홍대","공덕","아현","마포","신수","도화","용강","성산",
    "서대문구","신촌","이대","연희","홍제","홍은","남가좌","북가좌","충정로",
    "서초구","서초","방배","반포","잠원","양재","내곡","우면",
    "성동구","왕십리","행당","성수","한양대","옥수","금호","응봉","사근","마장",
    "성북구","성북","길음","돈암","안암","보문","정릉","삼선","동선","월곡","종암",
    "송파구","잠실","가락","문정","방이","오금","풍납","석촌","송파","거여","마천",
    "양천구","목동","신월","신정",
    "영등포구","영등포","여의도","당산","문래","양평","신길","대림","도림",
    "용산구","용산","이태원","한남","한강로","보광","서빙고","이촌","청파",
    "은평구","응암","불광","연신내","녹번","갈현","대조","진관","역촌","신사",
    "종로구","종로","광화문","혜화","삼청","북촌","동숭","이화","창신","숭인","부암","평창","무악",
    "중구","을지로","명동","충무로","남산","필동","황학","신당","약수","동화",
    "중랑구","면목","상봉","중화","묵동","신내","망우",
    // 경기
    "파주","운정","금촌","문산","교하",
    "일산","백석","마두","주엽","대화","킨텍스","풍동","식사",
    "고양시",
    "수원","영통","권선","팔달","장안","인계","매탄",
    "용인","수지","죽전","기흥","처인","동백",
    "성남","분당","정자","야탑","서현","이매","판교",
    "인천","구월","부평","송도","연수","남동","계양",
    "부천","중동","상동","역곡",
    "안양","평촌","범계","비산",
    "의정부","민락","녹양","가능",
    "남양주","다산","별내","호평",
    "하남","미사","풍산","덕풍",
    "김포","장기","구래","풍무",
  ];

  for (const area of detailAreas) {
    if (q.includes(area)) return area;
  }

  // 광역 "서울" 매칭은 마지막 (세부 지역이 없을 때만)
  if (q.includes("서울")) return "서울";
  return null;
}

// AI 응답 생성 (룰 기반 폴백) — Gemini API 실패 시에만 사용
function generateAIResponse(query: string): string {
  const q = query.toLowerCase().replace(/\s+/g, " ");
  const allBreeds = [...CAT_DATA.breeds, ...DOG_DATA.breeds];

  // -1. 부정문 전처리: "안 먹고", "아니고", "아닌데" 뒤의 키워드가 진짜 증상
  // "이물질 안 먹고 숨을 안 쉬어" → 이물질은 부정, 숨 안 쉬어가 핵심
  const negationPatterns = [
    /(?:이물질|이물)\s*(?:안|아닌|아니|않|없)/,
    /안\s*먹고/,
    /아니고/,
    /아닌데/,
    /그게\s*아니/,
  ];
  let cleanedQ = q;
  for (const pat of negationPatterns) {
    if (pat.test(q)) {
      // 부정된 부분 제거하고 나머지로 분석
      cleanedQ = q.replace(/이물질\s*(안|아닌|아니|않)\s*먹/, "").replace(/삼킨\s*게\s*아니/, "");
    }
  }

  // 0.0 고양이 ↔ 강아지 싸움/갈등 (다종 합사 고빈도 질문) — findSymptomGuide 이전에 처리
  //     findSymptomGuide의 텍스트 풀백이 "고양이/강아지" 단어만으로 엉뚱한 가이드를 잡는 문제 방지
  {
    const qq = cleanedQ || q;
    const hasCat = qq.includes("고양이") || qq.includes("냥") || qq.includes("캣");
    const hasDog = qq.includes("강아지") || qq.includes("멍") || qq.includes("댕") || /(?:^|\s)개(?:$|\s|가|랑|와|를|의)/.test(qq);
    const hasConflict =
      qq.includes("싸우") || qq.includes("싸운") || qq.includes("싸움") || qq.includes("싸웠") ||
      qq.includes("다툼") || qq.includes("공격") || qq.includes("덤벼") || qq.includes("하악") ||
      qq.includes("쫓") || qq.includes("할퀴") || qq.includes("으르렁") || qq.includes("짖");
    if (hasCat && hasDog && hasConflict) {
      return "🐱🐶 고양이와 강아지 싸움 — 단계별 해결\n\n놀라셨겠어요. 다행히 대부분 해결 가능한 상황이에요.\n\n⚠️ 심각도 먼저 판단\n• 피·상처 O → 즉시 분리 + 수의사 방문\n• 하악/으르렁/꼬리털 곤두섬 → 긴장 단계 (재설정 필요)\n• 강아지 추격·고양이 도망 → 놀이 오해 가능성 (위험)\n• 식사/수면 거부·숨기만 함 → 고양이 만성 스트레스\n\n📌 주요 원인 5가지\n1. 소통 방식 충돌 — 강아지 꼬리 흔들기 = 흥분, 고양이엔 위협 신호\n2. 자원 경쟁 — 밥·물·화장실·보호자 관심\n3. 강아지 포식 놀이 본능(프레이 드라이브) — 작게 움직이면 쫓는 본능\n4. 공간 부족 — 고양이는 수직 피난처(높은 곳) 필수\n5. 서열 스트레스 — 늦게 들어온 쪽이 보통 스트레스 큼\n\n🏠 오늘 바로 할 것\n1. 완전 분리 72시간 — 각자 다른 방, 시야 차단\n2. 고양이 수직 공간 — 캣타워/책장 위 피난처 확보 (강아지 접근 불가)\n3. 자원 분리 — 밥·물·화장실 전부 강아지 접근 불가 위치\n4. 페로몬 동시 사용 — Feliway(고양이용) + Adaptil(강아지용) 2주 이상\n5. 강아지 에너지 해소 — 산책 2회/일, 지치게 → 고양이 안 쫓음\n\n📅 단계적 재합사 (2~4주)\n1주차: 수건으로 냄새 교환, 문 사이로 서로 간식\n2주차: 베이비게이트 너머 시각 접촉, 긍정 연결\n3주차: 강아지 리드줄 + 고양이 탈출구 확보한 짧은 만남 (5분)\n4주차: 만남 시간 늘리기, 둘 다 편안하면 성공\n\n⛔ 절대 금지\n• 억지로 대면시키기 — 각인된 공포는 수개월 간다\n• 한쪽만 혼내기 — 서로 연관 짓기 학습 (더 악화)\n• 분무기 체벌 — 신뢰 파괴, 스트레스 2배\n\n🏥 전문가 기준\n• 피·상처 O → 동물병원 (검진 3~8만원)\n• 1개월 이상 호전 X → 반려동물 행동학 전문가\n• 행동상담 비용: 회당 10~20만원 (방문은 20~40만원)\n\n💡 혹시 이 아이들의 나이·중성화 여부·합사 시작 시점 알려주시면 더 정밀하게 조언드릴게요!";
    }
  }

  // 0.1 독성 음식(초콜릿·자일리톨·포도·양파 등) 우선 — 증상 가이드보다 먼저 처리
  //     "고양이가 초콜릿 먹었어" 같은 질문이 "이물질 삼킴"으로 잘못 매칭되는 문제 방지
  const toxicFoodKeywords = ["초콜릿","자일리톨","포도","건포도","양파","마늘","파 ","카페인","알코올","술","아보카도","마카다미아","코코아","과자","사탕"];
  if (toxicFoodKeywords.some((k) => q.includes(k))) {
    const food = findFood(q);
    if (food) return formatFoodResponse(food, query);
  }

  // 0.15 화상(인덕션·스토브·히터·뜨거운 물)
  const isBurn = (q.includes("데였") || q.includes("데인") || q.includes("화상") || q.includes("뜨거운 물") || q.includes("끓는 물")) ||
    ((q.includes("인덕션") || q.includes("전기레인지") || q.includes("난로") || q.includes("히터") || q.includes("스토브") || q.includes("가스레인지")) && (q.includes("데") || q.includes("올라") || q.includes("밟") || q.includes("닿")));
  if (isBurn) {
    const animal = q.includes("강아지") || q.includes("멍") ? "강아지" : "고양이";
    return `🔥 ${animal} 화상 응급 대처\n\n놀라셨겠어요. 지금 당장 할 것부터 알려드릴게요.\n\n⚠️ 화상 정도 판단 (지금 확인)\n1. 1도 — 발바닥/피부 빨갛고 열감만 (집에서 처치 가능)\n2. 2도 — 수포(물집), 털 눌어붙음 (병원 필수)\n3. 3도 — 까맣게 변함, 흰색 두꺼운 딱지 (즉시 응급, 피부 이식 가능성)\n\n🏠 지금 당장 할 것\n1. 흐르는 찬물 10분 이상 — 미지근한 물 X, 얼음 X (혈관 수축으로 악화)\n2. 발을 들어 공기 접촉 줄이기 (통증↓)\n3. 연고·소독약 금지 (병원에서 딱지·감염 확인 방해)\n4. 넥카라 착용 — 핥으면 세균 감염\n5. 사진 찍어 병원에 보여주기\n\n🏥 병원 기준\n• 즉시: 수포·까만 부위·걷기 거부·떨림\n• 24시간 내: 붉기 지속, 밥 안 먹음\n• 예상 비용: 초진 3~5만원 + 소독·연고 2~5만원. 2도 이상이면 붕대·재진료 포함 15~30만원\n\n⛔ 재발 방지\n• 인덕션: 사용 직후 덮개/가드 설치\n• 조리 중 주방 출입 금지 게이트\n• 뜨거운 물 끓일 땐 뚜껑 덮기\n\n💡 ${animal}의 나이·체중과 어느 부위가 데였는지 알려주시면 더 정밀한 대처를 안내드릴게요.`;
  }

  // 0.16 염색/미용 화학 제품 문의
  if ((q.includes("염색") || q.includes("탈색") || q.includes("펌") || q.includes("매니큐어") || q.includes("향수")) &&
      (q.includes("되") || q.includes("가능") || q.includes("해도") || q.includes("시켜도") || q.includes("해볼") || q.includes("하고 싶"))) {
    const animal = q.includes("강아지") || q.includes("멍") ? "강아지" : "고양이";
    return `❌ ${animal} 염색/화학 미용 — 절대 금지\n\n결론부터 말씀드리면, 안 됩니다.\n\n⚠️ 의학적 이유 3가지\n1. 그루밍 시 화학물질 섭취 — ${animal}는 하루 수시간 털을 핥음. 사람용 염색약의 암모니아·과산화수소는 급성 중독(구토·간부전·사망 사례 다수)\n2. ${animal}의 피부는 사람의 1/5 두께 — 화학 화상·알레르기 쇼크 위험\n3. 스트레스성 심장 합병증 — 과한 자극만으로도 고양이는 심장마비 사례 보고 (국내 미용실 사망 사례 있음)\n\n⚖️ 법적 이슈\n동물보호법 제10조 — 외형 변형 미용은 학대로 분류될 수 있음. SNS 업로드는 신고 대상.\n\n✅ 안전한 대안\n1. 펫 전용 천연 컬러 스프레이 (식용 성분, 24시간 자연 소멸)\n2. 사진 앱 필터로 디지털 염색\n3. 옷·스카프·목줄로 스타일링\n\n💡 어떤 행사·상황에 쓰시려는지 알려주시면 맞춤 대안을 더 드릴게요.`;
  }

  // 0.165 식분증(자기 똥/다른 동물 똥 먹기 — Coprophagia)
  const isCoprophagia = (q.includes("똥") || q.includes("대변") || q.includes("분변") || q.includes("변을") || q.includes("배설물")) &&
    (q.includes("먹") || q.includes("삼키") || q.includes("핥") || q.includes("먹어") || q.includes("먹는"));
  if (isCoprophagia) {
    const animal = q.includes("강아지") || q.includes("멍") || q.includes("댕") ? "강아지" : "고양이";
    return `🔍 ${animal} 식분증 (Coprophagia)\n\n당황스러우시죠. 흔한 행동이라 해결법이 있어요.\n\n⚠️ 심각도: 주의 — 건강 신호일 수 있어서 원인 파악이 중요\n\n📌 주요 원인 5가지\n1. 영양 흡수 장애 — 췌장염·장염으로 소화 못 한 영양소가 대변에 남아 다시 먹음 (가장 흔함)\n2. 사료 영양 부족 — 저품질 사료·비타민/효소 결핍\n3. 스트레스·불안 — 화장실 환경 나쁨, 다묘/다견 갈등, 집사 부재, 이사 등\n4. 학습된 행동 — 과거 배변 실수로 혼난 기억 → 증거 없애려고 먹음 / 관심 끌기\n5. 어린 개체·모견 본능 — 생후 6개월 미만은 정상 범위. 어미가 새끼 똥 치우는 본능\n\n🏠 오늘부터 할 것 (우선순위 순)\n1. **즉시 치우기 루틴** — 배변 후 3초 내 치우기. 기회 차단이 가장 효과적\n2. **사료 재점검** — 소화율 높은 프리미엄 사료로 교체 (원료 1순위가 고기인지 확인)\n3. **프로바이오틱스 + 소화효소 보충** — 약국·펫샵 (월 1~3만원)\n4. **놀이·산책 20~30분 추가** — 스트레스·지루함 감소\n5. **파인애플/호박 소량 급여 (강아지)** — 대변 맛을 쓰게 만듦 (고양이는 효과 약함)\n6. **혼내기 금지** — 관심을 주면 강화됨. 무반응으로 치우기만\n\n🏥 병원 기준\n• 체중 감소 동반 → 위장·췌장 검사 필수 (혈액검사 5~15만원, 분변검사 3~5만원)\n• 구토/설사 동반 → 즉시 병원\n• 1개월 이상 지속 → 행동 전문가 상담 (회당 10~20만원)\n\n⛔ 절대 하지 말 것\n• 입에서 억지로 빼기 (문 채로 달아남 → 학습)\n• 분무기·고함 (공포만 학습, 행동 고착)\n• 체벌 — 배변 자체를 숨기는 행동으로 악화\n\n💡 몇 살인지, 언제부터 시작했는지, 자기 똥인지 다른 동물 똥인지 알려주시면 더 정밀하게 원인을 좁혀드릴게요.`;
  }

  // 0.166 배변 실수 (소변·대변을 화장실 외 장소에)
  const isPottyAccident = (q.includes("배변 실수") || q.includes("실수") || q.includes("아무데") || q.includes("아무데나") || q.includes("침대") || q.includes("이불") || q.includes("소파") || q.includes("카펫")) &&
    (q.includes("소변") || q.includes("오줌") || q.includes("쉬") || q.includes("싸") || q.includes("대변") || q.includes("똥") || q.includes("용변"));
  if (isPottyAccident && !isCoprophagia) {
    const animal = q.includes("강아지") || q.includes("멍") ? "강아지" : "고양이";
    return `🚽 ${animal} 배변 실수 — 원인별 접근\n\n걱정되시죠. 대부분 환경·건강 이슈로 해결 가능해요.\n\n⚠️ 심각도: 주의 — 의학적 원인 먼저 배제\n\n📌 우선 배제할 의학 원인\n1. 방광염·요도염 — 고양이 특히 흔함. 소변 자주/조금씩, 피 섞임\n2. 요로결석 — 수컷 고양이는 24시간 내 응급 가능\n3. 신장질환 — 노령동물에서 물 많이 마심 + 소변 많음\n4. 당뇨병 — 갈증·다뇨 동반\n5. 관절염 — 화장실 턱이 높아서 못 넘음 (시니어)\n\n→ 우선 병원에서 소변검사 (2~5만원) 권장\n\n📌 행동·환경 원인\n1. **화장실 자체 문제** — 너무 좁다·뚜껑 답답·냄새 남음·모래 이상\n2. **화장실 수 부족** — 고양이는 마릿수+1개가 기본 (2묘 = 3개)\n3. **위치 불량** — 시끄럽거나 개/사람 지나다니는 곳\n4. **스트레스 표출** — 이사·새 가족·가구 변경 등\n5. **영역 표시 (마킹)** — 중성화 안 한 수컷 / 집밖 동물 보고\n6. **노령견 인지장애** — 치매 초기 증상 가능\n\n🏠 이번 주 바로 실행\n1. 병원 소변검사 먼저 (의학 원인 O/X 판단)\n2. 화장실 추가 설치 + 모래 종류 바꿔보기 (2종 동시 비교)\n3. 실수한 자리 → 효소 세제로 완전 냄새 제거 (같은 곳에 또 함)\n4. 고양이: 페로몬(Feliway) 2주 / 강아지: Adaptil\n5. 강아지는 배변 성공 시 3초 내 간식 보상\n\n⛔ 금지\n• 코 박기·혼내기 — 보호자 앞에서 배변 거부로 악화\n• 실수한 자리 일반 세제 청소 — 효소 세제만 냄새 완전 제거\n\n💰 예상 비용\n• 소변검사: 2~5만원 / 혈액검사: 5~15만원\n• 방광염 치료: 5~20만원 (1~2주)\n• 요로결석 수술: 50~200만원 (남묘는 특히 주의)\n\n💡 언제부터, 어느 장소에, 소변인지 대변인지 알려주시면 원인을 더 좁혀드릴게요.`;
  }

  // 0.17 햄스터·조류·파충류 등 소형동물과 고양이/강아지 동거
  const isSmallAnimalCohab = (q.includes("햄스터") || q.includes("기니피그") || q.includes("토끼") || q.includes("새") || q.includes("앵무") || q.includes("도마뱀") || q.includes("거북")) &&
    (q.includes("같이") || q.includes("함께") || q.includes("키울") || q.includes("기르") || q.includes("합사") || q.includes("입양") || q.includes("들이"));
  if (isSmallAnimalCohab) {
    const target = q.includes("햄스터") ? "햄스터" : q.includes("기니피그") ? "기니피그" : q.includes("토끼") ? "토끼" : q.includes("앵무") ? "앵무새" : q.includes("새") ? "새" : "소형동물";
    const predator = q.includes("고양이") ? "고양이" : q.includes("강아지") ? "강아지" : "반려동물";
    return `⚠️ ${predator} + ${target} 동거 — 매우 신중해야 합니다\n\n질문 주셔서 다행이에요 — 들이기 전 상담이 제일 중요합니다.\n\n🚨 결론: 같은 공간에서의 자유 합사는 불가능에 가깝습니다\n\n📌 이유 (${predator}의 본능)\n1. ${target}의 크기·움직임·체온·소리는 ${predator} 사냥 본능을 95% 자극\n2. ${predator} 반응속도 0.1초 — 보호자 눈앞에서도 케이지를 덮치는 사례 보고\n3. ${target}은 스트레스만으로 쇼크사 가능 (${predator} 냄새·시선 자체가 치명적)\n4. 케이지 이중 잠금에도 사고 사례 다수\n\n🏠 정말 같이 키우고 싶다면\n1. 완전 분리 방 — ${predator}가 절대 들어올 수 없는 독립 공간\n2. 유리 케이지 + 이중 뚜껑 고정 (플라스틱은 부숨)\n3. ${target} 방 출입 시 ${predator} 다른 방에 격리\n4. 환기·위생으로 냄새 교차 최소화\n\n✅ 더 안전한 대안\n1. 다른 ${predator} (같은 종 합사가 가장 안전)\n2. 대형 거북이·도마뱀 (반응 없음)\n3. 수조 속 관상어 — ${predator}에게 자극만 주고 사고 위험 낮음\n\n💡 ${target}를 원하시는 이유(자녀 교육·관찰·저비용)를 알려주시면 상황별 최선안을 제안해드릴게요.`;
  }

  // 0. 증상 상세 가이드
  const symptomGuide = findSymptomGuide(cleanedQ || q);
  if (symptomGuide) {
    return formatSymptomResponse(symptomGuide, query);
  }

  // 0.3 토 색깔 질문 (구토 가이드로 연결)
  if ((q.includes("초록") || q.includes("노란") || q.includes("갈색") || q.includes("하얀") || q.includes("빨간") || q.includes("분홍")) && (q.includes("토") || q.includes("구토"))) {
    const colorGuide: Record<string, string> = {
      "초록": "초록색 토 = 담즙 + 풀/캣그라스/사료 색소\n빈속에 토하면서 사료나 풀 성분이 섞인 경우. 가끔이면 정상이지만 반복되면 위장염 의심.",
      "노란": "노란색 토 = 담즙 구토\n공복이 길면 담즙(쓸개즙)이 올라옴. 식사 간격을 줄여보세요. (소량씩 자주 급여)",
      "갈색": "갈색 토 = 사료 역류 또는 위출혈\n먹은 직후면 사료 역류(과식). 시간이 지났는데 갈색이면 위출혈 가능 → 병원!",
      "하얀": "하얀 거품 토 = 위산 과다/공복\n빈속일 때 위산이 올라오는 경우. 가끔이면 정상. 반복되면 위염 의심.",
      "빨간": "🚨 빨간/분홍 토 = 혈액! 즉시 병원!\n위궤양, 이물질에 의한 상처, 중독 등. 응급 상황입니다.",
      "분홍": "🚨 분홍색 토 = 소량의 혈액 혼합. 즉시 병원!\n위나 식도 출혈 가능성.",
    };
    let matched = "";
    for (const [color, info] of Object.entries(colorGuide)) {
      if (q.includes(color)) { matched = info; break; }
    }
    const animal = q.includes("고양이") ? "고양이" : q.includes("강아지") ? "강아지" : "반려동물";
    return `🔍 ${animal} 토 색깔 분석\n\n${matched}\n\n📋 토 색깔별 정리:\n• 노란색 = 담즙 (공복)\n• 초록색 = 담즙+풀/사료\n• 갈색 = 사료 역류\n• 하얀 거품 = 위산 과다\n• 🚨 빨간/분홍 = 혈액 → 즉시 병원!\n\n🏠 대처: 12시간 금식 후 소량 물부터\n🚨 하루 3회 이상 반복 → 병원 방문`;
  }

  // 0.5 음식 안전 가이드
  const food = findFood(q);
  if (food) {
    return formatFoodResponse(food, query);
  }

  // 0.7 먹음/먹었 + 키워드 없는 음식 → 일반 안내
  if (q.includes("먹었") || q.includes("먹음") || q.includes("삼켰") || q.includes("삼킴") || q.includes("먹어도") || q.includes("줘도 돼") || q.includes("먹여도") || q.includes("급여")) {
    const animal = detectAnimal(query);
    const animalLabel = animal === "cat" ? "고양이" : animal === "dog" ? "강아지" : "반려동물";
    return `🍽️ ${animalLabel} 음식 안전 가이드\n\n🚨 절대 금지 식품:\n• 초콜릿, 포도/건포도, 양파/마늘/파\n• 자일리톨(무설탕 껌), 카페인, 알코올\n• 아보카도, 마카다미아\n\n⚠️ 주의 (소량만):\n• 우유/유제품, 참치캔, 뼈, 날계란\n\n✅ 안전한 간식:\n• 삶은 닭가슴살, 고구마, 당근\n• 블루베리, 수박(씨 제거), 사과(씨 제거)\n\n💡 구체적인 음식 이름을 말해주시면 안전 여부를 알려드려요!\n예: "고양이가 참치 먹어도 돼?"`;
  }

  // 1. 지역 + 병원/중성화/치료 질문
  const area = findArea(q);
  if (area) {
    const clinics = searchVetByArea(area);

    if (q.includes("중성화")) {
      const price = q.includes("고양이") ? "15~30만원" : "20~40만원";
      const animal = q.includes("고양이") ? "고양이" : "강아지";
      let resp = `💉 ${area} 지역 ${animal} 중성화 안내\n\n예상 비용: ${price}\n(병원마다 다르며, 몸무게·성별에 따라 달라요)\n\n`;
      if (clinics.length > 0) {
        resp += `📍 ${area} 근처 동물병원:\n`;
        clinics.slice(0, 3).forEach((c) => {
          resp += `• ${c.name} ${c.is24h ? "(24시)" : ""}\n  ${c.address}\n  📞 ${c.phone}\n`;
        });
        resp += `\n💡 전화해서 중성화 비용을 미리 문의하세요!`;
      } else {
        resp += `아직 ${area} 지역 병원 데이터가 부족해요.\n카카오톡으로 문의하시면 직접 찾아드릴게요!`;
      }
      return resp;
    }

    if (q.includes("병원") || q.includes("동물병원") || q.includes("근처") || q.includes("가까운")) {
      let resp = `🏥 ${area} 지역 동물병원\n\n`;
      if (clinics.length > 0) {
        clinics.slice(0, 4).forEach((c) => {
          resp += `• ${c.name} ${c.is24h ? "🔴24시" : ""}\n  ${c.address}\n  📞 ${c.phone}\n\n`;
        });
      } else {
        resp += `아직 ${area} 지역에 등록된 병원이 없어요.\n\n💬 카카오톡으로 문의하시면 직접 찾아드릴게요!\n또는 피드에 글을 올리면 GPS로 가까운 병원을 자동 안내해드려요.`;
      }
      return resp;
    }

    // 지역 + 기타 질문 (중성화/치료 외의 지역 질문)
    if (clinics.length > 0) {
      let resp = `📍 ${area} 지역 동물병원\n\n`;
      clinics.slice(0, 3).forEach((c) => {
        resp += `• ${c.name} ${c.is24h ? "🔴24시" : ""}\n  📞 ${c.phone}\n`;
      });
      resp += `\n더 궁금한 점이 있으면 물어봐주세요!`;
      return resp;
    } else {
      return `아직 ${area} 지역에 등록된 병원 데이터가 없어요.\n\n💬 카카오톡으로 문의하시면 직접 찾아드릴게요!\n\n다른 질문도 환영해요:\n• 증상 분석: "고양이가 토해요"\n• 비용 안내: "중성화 비용"\n• 품종 정보: "말티즈 특징"`;
    }
  }

  // 2. 품종 이름 매칭
  const matched = allBreeds.find(
    (b) => q.includes(b.name.toLowerCase()) || q.includes(b.nameEn.toLowerCase()) || q.includes(b.id)
  );
  if (matched) {
    let resp = `📖 ${matched.name} (${matched.nameEn})\n\n`;
    resp += `🌍 원산지: ${matched.origin}\n⚖️ 체중: ${matched.weight}\n⏳ 수명: ${matched.lifespan}\n🐾 성격: ${matched.personality.join(", ")}\n\n`;

    // 질문 맥락에 따라 다른 정보 표시
    if (q.includes("건강") || q.includes("질병") || q.includes("아프") || q.includes("병")) {
      resp += `🏥 건강 정보:\n${matched.health.slice(0, 250)}...\n\n`;
      const diseaseInfo = BREED_DISEASE_DATA[matched.id];
      if (diseaseInfo) {
        resp += `💰 주요 질병 예상 비용:\n`;
        diseaseInfo.diseases.slice(0, 3).forEach((d) => {
          resp += `• ${d.name}: ${Math.round(d.costRange.min/10000)}~${Math.round(d.costRange.max/10000)}만원\n`;
        });
        resp += `\n📋 연간 검진비: ${diseaseInfo.annualCheckupCost}`;
      }
    } else if (q.includes("관리") || q.includes("키우") || q.includes("돌봄") || q.includes("케어")) {
      resp += `🛁 관리법:\n${matched.care.slice(0, 300)}`;
    } else if (q.includes("비용") || q.includes("얼마") || q.includes("돈") || q.includes("가격")) {
      const diseaseInfo = BREED_DISEASE_DATA[matched.id];
      if (diseaseInfo) {
        resp += `💰 ${matched.name} 예상 의료비:\n\n`;
        diseaseInfo.diseases.forEach((d) => {
          resp += `• ${d.name}: ${Math.round(d.costRange.min/10000)}~${Math.round(d.costRange.max/10000)}만원 (${d.costNote || ""})\n`;
        });
        resp += `\n📋 연간 검진비: ${diseaseInfo.annualCheckupCost}\n🛡️ ${diseaseInfo.insuranceRecommended ? "펫보험 권장!" : "펫보험 선택"}`;
      }
    } else if (q.includes("역사") || q.includes("유래") || q.includes("기원")) {
      resp += `📜 역사:\n${matched.history.slice(0, 300)}`;
    } else {
      // 기본: 개요
      resp += `${matched.description.slice(0, 200)}...\n\n`;
      resp += `💡 더 궁금하시면:\n• "${matched.name} 건강" — 질병·비용 정보\n• "${matched.name} 관리" — 관리법\n• "${matched.name} 비용" — 의료비`;
    }

    resp += `\n\n👉 위키에서 전체 정보 확인하기!`;
    return resp;
  }

  // 3. 증상 분석
  const analysis = analyzeSymptoms(query, q.includes("고양이") ? "cat" : "dog");
  if (analysis.severity !== "normal") {
    return `🔍 AI 증상 분석 결과\n\n` +
      `${analysis.severity === "urgent" ? "🚨 긴급" : analysis.severity === "moderate" ? "⚠️ 주의" : "💡 관찰"} 등급\n` +
      `감지 증상: ${analysis.symptoms.join(", ")}\n\n` +
      `${analysis.summary}\n\n` +
      `💡 ${analysis.recommendation}\n\n` +
      `👉 피드에 사진과 함께 올리면 주변 병원도 안내해드려요!`;
  }

  // 4. 주제별 매칭 (확장)
  if (q.includes("넥카라") || q.includes("깔때기") || q.includes("카라") && (q.includes("빼") || q.includes("벗") || q.includes("싫"))) return `🔧 넥카라(깔때기) 관리\n\n자꾸 빼는 이유:\n• 불편해서 스트레스 (정상 반응)\n• 크기가 안 맞아서 (너무 크거나 작음)\n• 시야가 가려져서 불안\n\n대처법:\n• 넥카라 안 벗기기 위한 팁:\n  - 도넛형 넥카라(부드러운 타입)로 교체 → 훨씬 편해함\n  - 수술복(바디수트)으로 대체 → 입히는 타입\n  - 넥카라 크기 조절: 코 끝에서 2~3cm 여유\n  - 밥/물 먹을 때만 잠깐 벗기고 감독\n• 적응 기간: 보통 1~2일이면 적응\n• 넥카라 착용 기간: 수술 후 7~14일 (실밥 제거까지)\n\n⚠️ 넥카라 없이 상처를 핥으면 감염 위험! 꼭 착용시켜주세요.`;
  if (q.includes("장난감") || q.includes("놀아") || q.includes("놀이") || q.includes("놀아주") || q.includes("뭘로 놀") || q.includes("심심")) return `🎾 반려동물 놀이/장난감 추천\n\n🐶 강아지:\n• 터그놀이 (밧줄 장난감): 에너지 발산에 최고\n• 노즈워크 (간식 숨기기): 두뇌 자극\n• 공 던지기: 리트리버 등 활동량 많은 견종\n• 콩(KONG): 안에 간식 넣어두면 오래 놀아요\n\n🐱 고양이:\n• 낚싯대 장난감: 사냥 본능 자극 (가장 효과적!)\n• 레이저 포인터: 운동량 UP (마무리에 실제 간식 줘야 스트레스 안 받음)\n• 박스/종이봉투: 저렴하지만 최고의 장난감\n• 캣닙 장난감: 고양이 60%가 반응\n\n⏰ 하루 15~30분 놀아주는 것만으로도 스트레스와 문제 행동이 줄어요!`;
  if (q.includes("장례") || q.includes("무지개") || q.includes("하늘나라") || q.includes("죽었") || q.includes("떠나") || q.includes("안락사") || q.includes("마지막")) return `🌈 반려동물 장례/이별\n\n진심으로 위로드립니다.\n\n장례 절차:\n1. 동물병원에서 사망 확인\n2. 반려동물 장례식장 선택 (화장/수목장/봉안)\n3. 화장 비용: 소형 15~30만원, 대형 30~50만원\n\n마음 준비:\n• 슬퍼하는 것은 자연스러운 일이에요\n• 반려동물 상실 상담 서비스도 있어요\n• 다른 반려동물이 있다면 그 아이도 슬퍼할 수 있어요\n\n💡 P.E.T 파트너 네트워크에 장례 서비스도 연계 예정입니다.\n💬 카카오톡으로 문의하시면 가까운 장례식장을 안내해드려요.`;
  if (q.includes("훈련") || q.includes("교육") && !q.includes("배변")) return `🎓 반려동물 훈련 가이드\n\n🐶 강아지 기본 명령어:\n1. 앉아(Sit): 간식을 코 위로 → 엉덩이가 자연히 앉음 → 즉시 칭찬\n2. 기다려(Stay): 앉은 상태에서 손바닥 보여주며 한 발 뒤로\n3. 이리와(Come): 이름 부르며 간식 보여주기\n4. 하우스(Crate): 크레이트에 들어가면 칭찬\n\n핵심 원칙:\n• 긍정 강화(보상)가 가장 효과적!\n• 혼내기/체벌은 역효과 (공포만 학습)\n• 짧게 5~10분씩 여러 번\n• 일관성이 핵심 (가족 모두 같은 규칙)\n\n💰 전문 훈련:\n• 방문 훈련: 회당 5~10만원\n• 위탁 훈련: 월 80~150만원\n\n👉 P.E.T 파트너 훈련사에게 연결해드릴 수 있어요!`;

  if (q.includes("중성화") || q.includes("수술")) {
    const animal = q.includes("고양이") ? "고양이" : "강아지";
    const price = animal === "고양이" ? "15~30만원" : "20~40만원";
    return `✂️ ${animal} 중성화 수술 안내\n\n💰 예상 비용: ${price}\n⏰ 적정 시기: 생후 5~8개월\n⏱️ 수술 시간: 30분~1시간\n🏥 입원: 당일~1일\n\n장점: 질병 예방, 행동 교정, 스트레스 감소\n\n💡 지역명을 포함해서 물어보시면 가까운 병원도 안내해드려요!\n예: "파주에서 고양이 중성화"`;
  }
  if (q.includes("사료") || q.includes("밥") || q.includes("간식") || q.includes("먹이")) return "🍽️ 사료 선택 가이드\n\n🐶 강아지: 퍼피(~12개월)→어덜트(1~7세)→시니어(7세~)\n🐱 고양이: 습식+건식 병행 권장, 수분 섭취 중요\n\n💰 월 사료비:\n• 소형견/고양이: 3~8만원\n• 중형견: 5~12만원\n• 대형견: 8~20만원\n\n💡 품종별 추천 사료는 위키에서 확인하세요!";
  if (q.includes("24시간") || q.includes("24시야") || q.includes("24시간이야") || q.includes("밤에도") || q.includes("새벽에도") || q.includes("야간 진료")) {
    return "🏥 24시 동물병원 안내\n\n지역명을 포함해서 물어봐주세요!\n\n예: \"남양주 24시 동물병원\", \"일산 24시 병원\"\n\n💡 일반 동물병원은 보통 09:00~20:00 운영이에요.\n24시 병원은 야간/주말 할증(30~100%)이 있을 수 있습니다.\n\n🚨 응급 상황이라면 지역명과 함께 물어봐주세요!\n예: \"남양주 24시 병원\"";
  }
  if (q.includes("병원") || q.includes("동물병원")) return "🏥 동물병원 찾기\n\n지역명을 포함해서 물어봐주세요!\n\n예시:\n• 서울 근처 동물병원\n• 파주 24시 병원\n• 강남 동물병원\n\n또는 피드에 증상을 올리면 GPS 기반으로 자동 안내해드려요!";
  if (q.includes("예방접종") || q.includes("접종") || q.includes("백신")) return "💉 예방접종 스케줄\n\n🐶 강아지:\n• 6~8주: 1차 DHPPL+코로나\n• 10~12주: 2차 DHPPL+코로나\n• 14~16주: 3차 DHPPL+켄넬코프+광견병\n• 매년: 추가접종+심장사상충 검사\n💰 회당 3~5만원\n\n🐱 고양이:\n• 6~8주: 1차 FVRCP\n• 10~12주: 2차 FVRCP\n• 14~16주: 3차 FVRCP+광견병\n• 매년: 추가접종\n💰 회당 3~5만원";
  if (q.includes("비용") || q.includes("치료비") || q.includes("얼마") || q.includes("가격") || q.includes("돈 얼마") || q.includes("들꺼") || q.includes("들거")) {
    // 맥락 기반 비용 안내 — 어떤 상황의 비용인지 파악
    if (q.includes("숨") && (q.includes("안 쉬") || q.includes("안쉬") || q.includes("못 쉬") || q.includes("못쉬") || q.includes("정지") || q.includes("멈"))) {
      return "🚨💰 호흡 정지/심폐소생 응급 비용\n\n⚠️ 지금 이 상황이라면 비용보다 즉시 병원입니다!\n\n💰 응급 처치 예상 비용:\n• 응급실 초진 + 기본 처치: 10~30만원\n• 산소 공급 + 모니터링: 20~50만원\n• 기관삽관 + 인공호흡: 30~80만원\n• 심폐소생술(CPR): 50~150만원\n• 입원 (ICU): 일 10~30만원\n• 혈액/X-ray/초음파 검사: 20~40만원\n\n📋 총 예상: 50~300만원+ (원인에 따라 크게 달라짐)\n\n⏰ 골든타임은 4분입니다. 비용은 나중에 걱정하세요!\n🏥 대부분 병원에서 응급 시 후불/분할 결제 가능합니다.";
    }
    if (q.includes("이물질") || q.includes("삼켰") || q.includes("삼킴")) {
      return "💰 이물질 삼킴 치료 예상 비용\n\n🏥 검사:\n• X-ray: 5~15만원\n• 초음파: 10~20만원\n• 혈액검사: 5~15만원\n\n🔧 치료:\n• 구토 유발 (삼킨 지 2시간 이내): 5~15만원\n• 내시경 제거: 30~80만원\n• 개복 수술: 80~200만원\n• 장절제 수술 (장폐색 시): 150~400만원\n\n📋 총 예상: 20~400만원 (물건 종류와 위치에 따라)\n\n💡 빨리 갈수록 내시경으로 해결 가능 → 비용 절약!";
    }
    if (q.includes("골절") || q.includes("다리") || q.includes("부러") || q.includes("절뚝") || q.includes("쩔뚝")) {
      return "💰 골절/다리 부상 예상 비용\n\n🏥 검사:\n• X-ray: 5~15만원\n• CT 촬영: 30~50만원\n\n🔧 치료:\n• 슬개골 탈구 수술: 100~350만원 (한쪽)\n• 골절 수술 (핀/플레이트): 100~300만원\n• 십자인대 수술: 200~500만원\n• 보존적 치료 (깁스): 10~30만원\n\n📋 입원비: 일 5~15만원\n📋 재활 치료: 회당 3~10만원";
    }
    if (q.includes("24시") || q.includes("응급")) {
      return "💰 24시 응급 동물병원 비용\n\n⚠️ 야간/주말 할증이 있을 수 있어요\n\n• 응급 진료비: 3~10만원 (일반 진료 대비 1.5~2배)\n• 야간 할증: 30~100% 추가\n• 주말/공휴일: 20~50% 추가\n\n💡 응급 상황에서는 비용보다 빠른 진료가 중요합니다!\n대부분 병원에서 카드 결제 가능하고, 분할 납부 상담도 가능해요.";
    }
    // 기본 비용 안내
    return "💰 반려동물 주요 의료비\n\n🔧 수술:\n• 슬개골 탈구: 100~350만원\n• 디스크: 200~600만원\n• 중성화: 15~40만원\n• 이물질 제거: 30~200만원\n• 종양 제거: 50~200만원\n\n🏥 정기 관리:\n• 스케일링: 20~80만원\n• 건강검진: 10~30만원\n• 예방접종: 회당 3~5만원\n\n🚨 응급:\n• 응급 처치: 10~50만원\n• CPR/입원: 50~300만원\n\n📋 월 관리비:\n• 소형견/고양이: 8~20만원\n• 대형견: 15~40만원\n\n💡 구체적으로 어떤 상황인지 알려주시면 더 정확한 비용을 안내해드려요!\n예: \"슬개골 수술비\", \"이물질 제거 비용\", \"중성화 얼마\"";
  }
  if (q.includes("입양") || q.includes("처음") || q.includes("초보") || q.includes("키우") || q.includes("분양")) return "🐾 반려동물 처음 키우기 가이드\n\n1️⃣ 건강검진 (입양 후 1~3일)\n2️⃣ 동물등록 (30일 이내, 의무)\n3️⃣ 예방접종 시작\n4️⃣ 중성화 수술 (5~8개월)\n5️⃣ 필수 용품 준비\n\n💰 초기 비용: 약 30~80만원\n📋 월 관리비: 8~30만원\n\n👉 위키 품종 페이지에서 상세 체크리스트를 확인하세요!";
  if (q.includes("보험") || q.includes("펫보험")) return "🛡️ 펫보험 안내\n\n가입 적기: 생후 8주~8세\n월 보험료: 2~8만원 (품종/나이별 차이)\n\n보장 항목:\n• 수술비, 입원비, 통원 치료비\n• 배상책임 (타인 물린 경우)\n\n💡 슬개골·디스크 등 고비용 수술이 흔한 소형견은 가입 권장!\n\n주요 보험사: KB손보, 삼성화재, 현대해상, 메리츠";
  if (q.includes("산책") || q.includes("운동")) return "🚶 산책 가이드\n\n🐶 강아지 (하루 기준):\n• 소형견: 20~30분\n• 중형견: 40~60분\n• 대형견: 1~2시간\n• 초대형/목양견: 2시간+\n\n⏰ 추천 시간: 아침 7~8시, 저녁 6~7시\n🌡️ 여름: 아스팔트 화상 주의 (30도↑ 시 자제)\n❄️ 겨울: 소형견 보온 필수\n\n🐱 고양이: 실내 놀이 15~20분/일로 충분";
  if (q.includes("슬개골")) return "🦵 슬개골 탈구 안내\n\n소형견 최다 질환 (말티즈, 푸들, 포메 등)\n\n등급:\n• 1등급: 관찰 (수술 불필요)\n• 2등급: 경과 관찰\n• 3등급: 수술 권장\n• 4등급: 수술 필수\n\n💰 수술비: 한쪽 50~200만원, 양쪽 100~350만원\n🏥 입원: 3~5일\n⏱️ 회복: 6~8주\n\n예방: 체중 관리, 미끄러운 바닥 방지, 높은 곳 점프 금지";
  if (q.includes("디스크") || q.includes("추간판")) return "🦴 디스크(IVDD) 안내\n\n닥스훈트, 코기, 시츄 등 허리 긴 견종 주의\n\n💰 수술비: 200~600만원\n🏥 입원: 5~14일\n⏱️ 재활: 2~6개월\n\n예방:\n• 비만 방지 (최대 위험요인)\n• 계단 대신 경사로\n• 안을 때 허리 받치기\n• 높은 곳 점프 금지";
  // 4.5 행동학/생활/특이 질문 (변칙 대응)
  if (q.includes("골골") || q.includes("그르렁") || q.includes("가르랑") || q.includes("퍼링") || q.includes("purr")) return "😺 고양이 골골송 (퍼링)\n\n골골거리는 이유:\n• 기분 좋을 때 (가장 흔함)\n• 아프거나 불안할 때 자기 치유 (진동이 뼈·근육 회복 도움)\n• 보호자에게 관심 요청\n• 수유 중 새끼에게 신호\n\n💡 골골 + 편안한 표정 = 행복\n⚠️ 골골 + 움츠림/안 먹음 = 통증 가능성";
  if (q.includes("꼬리") || q.includes("꼬리를 흔") || q.includes("꼬리 흔") || q.includes("꼬리가 빳") || q.includes("꼬리 세")) return "🐾 꼬리 언어 해석\n\n🐶 강아지:\n• 넓게 흔들기 = 기쁨, 흥분\n• 빠르게 흔들기 = 매우 흥분 (좋거나 경계)\n• 꼬리 내림 = 불안, 두려움\n• 다리 사이 = 극도의 공포\n\n🐱 고양이:\n• 꼬리 세움 = 기분 좋음, 인사\n• 꼬리 부풀림 = 놀람, 공포\n• 꼬리 좌우 흔들기 = 짜증, 사냥 모드\n• 꼬리 감기 = 편안함";
  if (q.includes("혀를 내") || q.includes("혀 내") || q.includes("블렙") || q.includes("핥아") || q.includes("핥는") || q.includes("핥고")) return "👅 핥는 행동 해석\n\n🐶 강아지:\n• 보호자 핥기 = 애정 표현, 관심 요청\n• 바닥 핥기 = 스트레스, 구역질, 위장 불편\n• 발 핥기 = 알레르기, 스트레스, 습관\n• 입술 핥기 = 불안, 스트레스 신호\n\n🐱 고양이:\n• 보호자 핥기 = 그루밍 (가족으로 인정!)\n• 과도한 자기 핥기 = 스트레스성 탈모 주의\n• 혀 내밀고 있기(블렙) = 대부분 정상, 이빨 문제 가능성도";
  if (q.includes("짖") || q.includes("짖는") || q.includes("짖어") || q.includes("컹컹") || q.includes("왈왈") || q.includes("헛짖") || q.includes("짖음")) return "🔊 짖음 문제 해결\n\n짖는 이유:\n• 경계/알림: 낯선 소리, 사람, 동물에 반응\n• 요구: 간식, 산책, 관심 달라는 신호\n• 분리불안: 혼자 있을 때 짖음\n• 지루함: 운동/자극 부족\n• 공포: 천둥, 폭죽 등\n\n해결법:\n• 짖을 때 관심 주지 않기 (강화 방지)\n• 조용할 때 칭찬+간식 (긍정 강화)\n• 충분한 산책과 놀이\n• 사회화 훈련 (다양한 소리에 노출)\n• 심하면 행동 전문 수의사 상담";
  if (q.includes("물어") && (q.includes("뜯") || q.includes("가구") || q.includes("신발") || q.includes("소파") || q.includes("전선") || q.includes("벽"))) return "🦷 물어뜯기/파괴 행동\n\n원인:\n• 이갈이 (강아지 3~6개월): 가렵고 아파서 뜯음\n• 에너지 과잉: 운동 부족\n• 분리불안: 혼자 있을 때 파괴\n• 지루함/스트레스\n\n해결법:\n• 이갈이: 냉동 장난감, 치아 발달 간식 제공\n• 씹어도 되는 것 vs 안 되는 것 구분 훈련\n• 외출 시 콩(노즈워크 장난감)에 간식 채워주기\n• 전선 커버, 쓴맛 스프레이 활용\n• 하루 1~2시간 충분한 산책";
  if (q.includes("배변") && (q.includes("훈련") || q.includes("교육") || q.includes("가르") || q.includes("실수"))) return "🚽 배변 훈련\n\n🐶 강아지:\n1. 식후, 기상 후, 놀이 후 → 배변 장소로 유도\n2. 성공하면 즉시 칭찬+간식 (3초 이내!)\n3. 실수해도 혼내지 말기 (역효과)\n4. 냄새 제거 완벽히 (같은 곳에 또 함)\n5. 배변패드→야외 순서로 전환\n\n🐱 고양이:\n• 대부분 본능적으로 화장실 사용\n• 실수한다면: 화장실 위치/개수/모래 종류 점검\n• 화장실 수 = 고양이 수 + 1\n• 조용하고 프라이빗한 위치에 배치";
  if (q.includes("밤에") || q.includes("새벽") || q.includes("잠을 안") || q.includes("안 자") || q.includes("잠 안") || q.includes("야행성") || q.includes("뛰어다") || q.includes("운동회")) return "🌙 밤에 안 자는 문제\n\n🐱 고양이:\n• 정상: 고양이는 새벽 활동(던·더스크 활동)이 본능\n• '새벽 운동회'는 에너지 발산 행동\n• 해결: 자기 전 15~20분 격렬한 놀이 → 간식 → 수면 루틴\n• 놀아달라 울면: 반응하지 않기 (강화 방지)\n\n🐶 강아지:\n• 새끼 강아지: 적응 기간 (1~2주) 필요\n• 자기 전 산책+배변으로 에너지 소진\n• 크레이트 트레이닝으로 수면 공간 확립";
  // 고양이 ↔ 강아지 싸움/갈등 (가장 흔한 다종 합사 문제) — 합사 일반 핸들러보다 먼저 매칭
  const catDogFighting =
    (q.includes("고양이") || q.includes("냥") || q.includes("캣")) &&
    (q.includes("강아지") || q.includes("멍") || q.includes("개") || q.includes("댕")) &&
    (q.includes("싸우") || q.includes("싸운") || q.includes("싸움") || q.includes("다툼") ||
     q.includes("공격") || q.includes("덤벼") || q.includes("하악") || q.includes("쫓") ||
     q.includes("물어") || q.includes("할퀴") || q.includes("으르렁") || q.includes("짖"));
  if (catDogFighting) {
    return "🐱🐶 고양이와 강아지 싸움 — 단계별 해결\n\n놀라셨겠어요. 다행히 대부분 해결 가능한 상황이에요.\n\n⚠️ 심각도 먼저 판단\n• 피·상처 O → 즉시 분리 + 수의사 방문\n• 하악/으르렁/꼬리털 곤두섬 → 긴장 단계 (재설정 필요)\n• 강아지 추격·고양이 도망 → 놀이 오해 가능성 (위험)\n• 식사/수면 거부·숨기만 함 → 고양이 만성 스트레스\n\n📌 주요 원인 5가지\n1. 소통 방식 충돌 — 강아지 꼬리 흔들기 = 흥분, 고양이엔 위협 신호\n2. 자원 경쟁 — 밥·물·화장실·보호자 관심\n3. 강아지 포식 놀이 본능(프레이 드라이브) — 작게 움직이면 쫓는 본능\n4. 공간 부족 — 고양이는 수직 피난처(높은 곳) 필수\n5. 서열 스트레스 — 늦게 들어온 쪽이 보통 스트레스 큼\n\n🏠 오늘 바로 할 것\n1. 완전 분리 72시간 — 각자 다른 방, 시야 차단\n2. 고양이 수직 공간 — 캣타워/책장 위 피난처 확보 (강아지 접근 불가)\n3. 자원 분리 — 밥·물·화장실 전부 강아지 접근 불가 위치\n4. 페로몬 동시 사용 — Feliway(고양이용) + Adaptil(강아지용) 2주 이상\n5. 강아지 에너지 해소 — 산책 2회/일, 지치게 → 고양이 안 쫓음\n\n📅 단계적 재합사 (2~4주)\n1주차: 수건으로 냄새 교환, 문 사이로 서로 간식\n2주차: 베이비게이트 너머 시각 접촉, 긍정 연결\n3주차: 강아지 리드줄 + 고양이 탈출구 확보한 짧은 만남 (5분)\n4주차: 만남 시간 늘리기, 둘 다 편안하면 성공\n\n⛔ 절대 금지\n• 억지로 대면시키기 — 각인된 공포는 수개월 간다\n• 한쪽만 혼내기 — 서로 연관 짓기 학습 (더 악화)\n• 분무기 체벌 — 신뢰 파괴, 스트레스 2배\n\n🏥 전문가 기준\n• 피·상처 O → 동물병원 (검진 3~8만원)\n• 1개월 이상 호전 X → 반려동물 행동학 전문가\n• 행동상담 비용: 회당 10~20만원 (방문은 20~40만원)\n\n💡 혹시 이 아이들의 나이·중성화 여부·합사 시작 시점 알려주시면 더 정밀하게 조언드릴게요!";
  }

  if (q.includes("합사") || q.includes("새 고양이") || q.includes("새고양이") || q.includes("새 강아지") || q.includes("새강아지") || q.includes("다묘") || q.includes("다견") || q.includes("합류") || q.includes("싸워") || q.includes("싸운") || q.includes("싸움") || q.includes("서열")) return "🤝 합사/새 동물 소개\n\n🐱 고양이 합사:\n1. 격리 기간: 최소 1~2주 (별도 방)\n2. 냄새 교환: 수건 교환, 문 사이로 간식\n3. 시각 접촉: 문 살짝 열기, 펜스 사용\n4. 직접 만남: 짧게 시작, 점차 늘리기\n5. 절대 서두르지 않기! 2~4주 걸릴 수 있음\n\n🐶 강아지 합사:\n1. 중립 지역(공원 등)에서 첫 만남\n2. 리드줄 착용한 채로\n3. 간식으로 긍정 연결\n4. 자원(밥그릇, 장난감) 분리";
  if (q.includes("나이") || q.includes("몇 살") || q.includes("사람 나이") || q.includes("환산") || q.includes("수명")) return "📅 반려동물 나이 환산\n\n🐶 강아지 → 사람 나이:\n• 1살 = 약 15세\n• 2살 = 약 24세\n• 3살~ = 매년 +4~5세\n• 소형견 10살 ≈ 56세\n• 대형견 10살 ≈ 66세 (대형견이 더 빨리 노화)\n\n🐱 고양이 → 사람 나이:\n• 1살 = 약 15세\n• 2살 = 약 24세\n• 3살~ = 매년 +4세\n• 10살 ≈ 56세\n• 15살 ≈ 76세\n\n💡 7세 이상은 '시니어'로 연 2회 건강검진 권장";
  if (q.includes("등록") || q.includes("동물등록") || q.includes("마이크로칩") || q.includes("칩")) return "📋 동물등록 (의무!)\n\n⚖️ 2개월 이상 강아지는 동물등록 의무!\n미등록 시 과태료 100만원 이하\n\n방법:\n1. 내장형 칩 (권장): 동물병원에서 삽입, 1~3만원\n2. 외장형 인식표: 목걸이 부착\n\n등록처: 가까운 동물병원 또는 지자체\n확인: animal.go.kr\n\n💡 고양이는 의무는 아니지만 분실 대비 강력 권장!";

  if (q.includes("깨물") || q.includes("깨무") || q.includes("물어") && !q.includes("삼") && !q.includes("뜯")) return `🦷 ${q.includes("고양이") || q.includes("냥") ? "고양이" : "강아지"} 깨무는 이유\n\n${q.includes("고양이") || q.includes("냥") ? "🐱 고양이:\n• 사랑 깨물기(Love Bite): 살살 깨물면 애정 표현\n• 과잉 자극: 쓰다듬다가 갑자기 물면 '그만해' 신호\n• 놀이 공격: 사냥 본능 발현\n• 전조 신호: 꼬리 탁탁, 귀 접음, 피부 떨림 → 곧 물 수 있음\n\n대처: 물면 즉시 '아!' 하고 놀이 중단. 손 대신 장난감으로 놀기" : "🐶 강아지:\n• 이갈이 (3~6개월): 잇몸 가려워서 뭐든 깨뭄\n• 놀이: 강아지끼리는 입으로 놀이하는 것이 정상\n• 관심 요구: 물면 반응해주니까 학습됨\n• 불안/공포: 무서울 때 방어적으로 뭄\n\n대처: 물면 '아!' 하고 무시(30초). 안 물 때 칭찬+간식"}`;
  if (q.includes("채터링") || q.includes("딱딱") && q.includes("입") || q.includes("이빨") && q.includes("딸딸")) return "🐱 고양이 채터링 (이빨 딸깍)\n\n창문 밖 새/벌레를 보며 입을 딱딱거리는 행동\n\n원인:\n• 사냥 본능 흥분: 잡고 싶지만 못 잡는 좌절감\n• 먹잇감 죽이기 연습: 목뼈 물어 끊는 동작의 반사\n• 흥분/기대: 매우 관심 있는 대상을 봤을 때\n\n💡 완전히 정상적인 행동이에요! 걱정하지 마세요.\n창문에 새 모이대를 설치하면 좋은 자극이 됩니다.";
  if (q.includes("배를 보") || q.includes("배 보") || q.includes("드러누") || q.includes("뒤집") || q.includes("배를 내") || q.includes("뒹굴")) return `🐾 배 보여주는 행동\n\n${q.includes("고양이") || q.includes("냥") ? "🐱 고양이:\n• 극도의 신뢰: '너를 믿어'라는 의미 (급소 노출)\n• ⚠️ 하지만 '만져도 돼'는 아님! 배 만지면 물릴 수 있음\n• 더울 때: 체온 조절을 위해 배를 대놓음\n• 놀이 유도: 뒹굴며 관심 끌기" : "🐶 강아지:\n• 복종/신뢰: '당신이 리더예요'\n• 배 만져달라: 실제로 배 긁기를 좋아함\n• 더울 때: 체온 조절\n• 놀이 초대: 같이 놀자는 신호"}`;
  if (q.includes("꾹꾹") || q.includes("반죽") || q.includes("이불") && q.includes("발")) return "🐱 고양이 꾹꾹이 (니딩)\n\n앞발로 꾹꾹 누르는 행동\n\n원인:\n• 어미 젖 먹던 본능: 젖이 잘 나오게 하던 행동의 잔재\n• 극도의 편안함/행복: 보호자 옆에서 할 때 최고로 행복한 상태\n• 영역 표시: 발바닥 분비샘으로 냄새 묻히기\n• 잠자리 만들기: 자기 전 자리 정리\n\n💡 꾹꾹이는 고양이의 최고 애정 표현이에요!\n발톱에 긁히면 담요를 깔아주세요.";
  if (q.includes("냄새 맡") || q.includes("냄새를 맡") || q.includes("킁킁") || q.includes("엉덩이 냄새") || q.includes("코 대")) return "🐶 냄새 맡는 행동\n\n🐶 강아지:\n• 엉덩이 냄새: 항문낭의 고유 냄새로 '명함 교환' (정상!)\n• 바닥 냄새: 다른 동물의 흔적 탐색\n• 소변 냄새: 영역 정보 확인\n• 보호자 냄새: 어디 다녀왔는지 체크\n\n🐱 고양이:\n• 코 인사: 서로 코를 대는 건 친근한 인사\n• 입 벌리고 냄새 (플레멘): 페로몬 분석 중 (웃는 것 아님!)";
  if (q.includes("똥꼬스키") || q.includes("갑자기 뛰") || q.includes("미친듯이 뛰") || q.includes("줌") || q.includes("좀비") || q.includes("화장실 후") || q.includes("똥 싸고")) return "🐱 똥꼬스키/줌 (Zoomies)\n\n화장실 후 미친 듯이 뛰어다니는 행동\n\n원인:\n• 배변 후 해방감: 편안해져서 에너지 폭발\n• 냄새 회피 본능: 야생에서 배변 냄새로 적에게 발견될까 봐 도망치던 본능\n• 에너지 발산: 실내 생활의 스트레스 해소\n\n🐶 강아지도:\n• 줌(Zoomies): 갑자기 미친 듯이 원을 그리며 뛰어다님\n• 원인: 에너지 과잉, 흥분, 스트레스 해소\n\n💡 완전히 정상! 위험한 물건만 치워주세요.";
  if (q.includes("울어") || q.includes("울음") || q.includes("야옹") || q.includes("낑낑") || q.includes("킹킹") || q.includes("끙끙") || q.includes("훌쩍") || q.includes("낑") || q.includes("삐")) return `🔊 울음소리 해석\n\n${q.includes("고양이") || q.includes("냥") ? "🐱 고양이:\n• 짧은 야옹: 인사, 관심 요구\n• 긴 야옹: 밥 달라, 문 열어달라 등 요구\n• 밤에 크게 울기: 발정기 (중성화로 해결)\n• 하악/쉬: 경고, 공포\n• 골골: 행복 or 아픔 (상황 판단 필요)" : "🐶 강아지:\n• 낑낑: 관심 요구, 불안, 아픔\n• 하울링(울부짖기): 외로움, 사이렌 반응\n• 짧은 컹: 놀람, 아픔\n• 끙끙: 불편함, 통증\n• 킁킁: 냄새 탐색 중 (정상)"}`;

  // 사람이 다쳤을 때
  if ((q.includes("사람") || q.includes("내가") || q.includes("제가") || q.includes("나") || q.includes("아이") || q.includes("아기") || q.includes("어린이")) && (q.includes("물렸") || q.includes("물림") || q.includes("물어") || q.includes("할퀴") || q.includes("긁혔") || q.includes("긁힘") || q.includes("다쳤") || q.includes("상처") || q.includes("피가") || q.includes("공격"))) return "🚑 사람이 반려동물에게 다쳤을 때 응급처치\n\n🐶 강아지에게 물렸을 때:\n1. 흐르는 물에 5분 이상 세척 (가장 중요!)\n2. 비누로 상처 주변 세척\n3. 소독 후 깨끗한 거즈로 압박 지혈\n4. ⚠️ 반드시 병원(외과/응급실) 방문!\n   - 파상풍 주사 필요 여부 확인\n   - 항생제 처방 (구강 세균 감염 위험)\n   - 광견병 접종 여부 확인 필수\n5. 📋 동물 물림 신고 (보건소)\n\n🐱 고양이에게 할퀴었을 때:\n1. 흐르는 물에 세척\n2. 소독약 도포\n3. ⚠️ 고양이 할큄병(묘소병) 주의!\n   - 2~3일 후 상처 부위 붓거나 열나면 병원\n   - 림프절 부어오르면 항생제 필요\n\n🚨 즉시 병원: 깊은 상처, 출혈 멈추지 않음, 얼굴/손 물림, 유기동물에 물림";
  if (q.includes("묘소병") || q.includes("할큄병") || q.includes("파상풍") || q.includes("광견병") && q.includes("사람")) return "🏥 반려동물 관련 인수공통감염증\n\n🐱 묘소병(Cat Scratch Disease):\n• 고양이 할큄 후 2~3일 뒤 상처 부위 붓고 열\n• 림프절 부어오름 → 항생제 필요\n• 예방: 고양이 발톱 관리, 할퀴면 즉시 세척\n\n💉 파상풍:\n• 물린 상처로 감염 가능\n• 마지막 파상풍 접종 10년 이상이면 추가접종\n\n🦠 광견병:\n• 국내 반려동물은 접종 의무 → 위험 낮음\n• 유기동물/야생동물 물림 시 반드시 확인\n• 접종 미확인 동물에 물리면 즉시 병원!\n\n🐛 피부사상균(곰팡이):\n• 고양이→사람 전염 가능\n• 원형 발진, 가려움 → 피부과 방문";

  if (q.includes("심장사상충") || q.includes("사상충")) return "🛡️ 심장사상충 예방\n\n모기를 통해 감염되는 치명적 질환!\n\n💊 예방:\n• 매월 1회 예방약 투여 (생후 8주부터)\n• 월 1~3만원 (먹는 약 또는 바르는 약)\n• 연간 항원 검사 권장\n\n🚨 감염 시:\n• 초기: 무증상\n• 중기: 기침, 운동 불내성\n• 말기: 호흡곤란, 복수, 사망\n• 치료비: 100~300만원+\n\n💡 예방이 치료보다 100배 쉽고 저렴해요!";
  if (q.includes("중성화 후") || q.includes("중성화 뒤") || q.includes("수술 후")) return "✂️ 중성화 수술 후 관리\n\n⏰ 회복 기간: 7~14일\n\n관리 포인트:\n• 넥카라(깔때기) 착용 필수 (상처 핥기 방지)\n• 실밥 제거: 7~10일 후 (녹는 실이면 불필요)\n• 목욕 금지: 실밥 제거 후 3일까지\n• 격한 운동 자제: 2주간\n• 식욕 변화: 중성화 후 식욕 증가 → 사료 양 20~30% 줄이기\n• 체중 관리: 중성화 전용 사료로 변경 권장\n\n🚨 수술 부위가 부어오르거나 고름이 나오면 즉시 병원!";
  if (q.includes("안녕") || q.includes("반가") || q.includes("하이") || q.includes("hello")) return "안녕하세요! 🐾 P.E.T AI입니다!\n\n무엇이든 물어보세요:\n• 증상: \"고양이가 헥헥거려요\"\n• 음식: \"강아지가 초콜릿 먹었어\"\n• 품종: \"말티즈 특징\", \"코숏 건강\"\n• 비용: \"슬개골 수술비\", \"중성화 비용\"\n• 병원: \"강남 24시 동물병원\"\n• 관리: \"목욕 방법\", \"발톱 깎기\"\n• 건강: \"예방접종\", \"심장사상충\"\n• 입양: \"처음 키우기 가이드\"";
  if (q.includes("고마") || q.includes("감사") || q.includes("땡큐")) return "감사합니다! 🐾\n\n더 궁금한 게 있으면 언제든 물어보세요!\n\n💬 카카오톡으로도 1:1 상담 가능해요!";

  // 5. 위키 데이터 전체 텍스트 검색 (최후 수단)
  const searchTerms = q.split(/\s+/).filter((w) => w.length >= 2);
  for (const breed of allBreeds) {
    const allText = `${breed.description} ${breed.characteristics} ${breed.health} ${breed.care}`.toLowerCase();
    const matchCount = searchTerms.filter((t) => allText.includes(t)).length;
    if (matchCount >= 2) {
      // 여러 단어가 매칭되면 관련 정보 추출
      const relevantField = searchTerms.some((t) => breed.health.toLowerCase().includes(t)) ? breed.health
        : searchTerms.some((t) => breed.care.toLowerCase().includes(t)) ? breed.care
        : breed.description;
      return `🔍 관련 정보를 찾았어요!\n\n📖 ${breed.name}에서 관련 내용:\n${relevantField.slice(0, 250)}...\n\n👉 위키에서 전체 내용을 확인하세요!`;
    }
  }

  // 6. 기본 응답 (도움말) — 더 친근하게
  const animal = detectAnimal(query);
  if (animal !== "unknown") {
    const label = animal === "cat" ? "고양이" : "강아지";
    return `${label}에 대해 궁금하시군요! 🐾\n\n이렇게 물어봐주시면 더 잘 도와드릴 수 있어요:\n\n🔍 "우리 ${label}가 토해요"\n🍽️ "${label}가 초콜릿 먹었어"\n💰 "${label} 중성화 비용"\n🏥 "서울 24시 동물병원"\n📖 "말티즈 특징"\n\n구체적인 증상이나 상황을 알려주세요!`;
  }

  return "안녕하세요! P.E.T AI입니다 🐾\n\n이런 것들을 물어보세요:\n\n🔍 증상: \"고양이가 토해요\", \"강아지가 다리를 절어요\"\n🍽️ 음식: \"강아지가 초콜릿 먹었어\", \"참치 줘도 돼?\"\n📖 품종: \"말티즈 특징\", \"코숏 건강\"\n💰 비용: \"슬개골 수술비\", \"중성화 비용\"\n🏥 병원: \"강남 동물병원\", \"파주 24시\"\n💉 건강: \"예방접종\", \"펫보험\"\n🐾 관리: \"산책 시간\", \"사료 추천\"\n🏠 입양: \"처음 키우기 가이드\"";
}

type ChatMsg = { role: "user" | "ai"; text: string };
type PetInfo = { id: string; name: string; species: string; breed: string };

export default function HeroSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [userPets, setUserPets] = useState<PetInfo[]>([]);
  const user = useAppStore((s) => s.user);
  const { t, locale } = useI18n();

  // 로그인 유저의 등록 반려동물 조회
  useEffect(() => {
    if (user && user.id !== "demo-user") {
      supabase.from("pets").select("id, name, species, breed")
        .eq("owner_id", user.id)
        .then(({ data }) => { if (data) setUserPets(data); });
    }
  }, [user]);

  // locale에 따라 인사말·등록동물 안내 분기
  const petGreeting = userPets.length > 0
    ? (locale === "en"
        ? `${t("ai.chatGreeting")}\nRegistered pets: ${userPets.map((p) => `${p.name} (${p.species} · ${p.breed})`).join(", ")}\n\nAsk me anything!`
        : `${t("ai.chatGreeting")}\n등록된 반려동물: ${userPets.map((p) => `${p.name}(${p.species === "cat" ? "고양이" : p.species === "dog" ? "강아지" : p.species} · ${p.breed})`).join(", ")}\n\n무엇이든 물어보세요!`)
    : `${t("ai.chatGreeting")}\n${t("ai.chatGreetingSub")}`;

  const [messages, setMessages] = useState<ChatMsg[]>([
    { role: "ai", text: petGreeting },
  ]);
  const [thinking, setThinking] = useState(false);
  const chatBoxRef = useRef<HTMLDivElement>(null);

  // 반려동물 로드 후 인사말 업데이트
  useEffect(() => {
    if (userPets.length > 0 && messages.length === 1) {
      setMessages([{ role: "ai", text: petGreeting }]);
    }
  }, [userPets]);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages, thinking]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    window.open("https://forms.gle/e5cY46BRkambEjE19", "_blank");
    setSubmitted(true);
  }

  async function handleChat(e: React.FormEvent) {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setThinking(true);

    const qLower = userMsg.toLowerCase();

    // Gemini 우선 호출 — 모든 질문은 C-level 수의사 페르소나가 응답.
    // 네트워크·API 키·쿼터 문제로 실패했을 때만 룰 기반 폴백이 작동.
    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg,
          history: messages.slice(-8),
          pets: userPets.map((p) => ({ name: p.name, species: p.species, breed: p.breed })),
          locale,
        }),
      });
      const data = await res.json();

      if (data.success && data.reply) {
        setMessages((prev) => [...prev, { role: "ai", text: data.reply }]);
        setThinking(false);
        return;
      }

      // Gemini 실패 원인을 관리자 진단용으로 로깅 (사용자에겐 매끄럽게 폴백)
      if (data.fallback) {
        console.warn("[P.E.T AI] Gemini 폴백 모드 진입:", data.error || "unknown");
      }

      // EN 모드: 룰 기반 영어 폴백 (chocolate, vomit, limping 등 13개 영어 규칙)
      if (locale === "en") {
        const ruleResponse = findEnglishFallback(userMsg);
        const enReply = ruleResponse || defaultEnglishResponse(userMsg);
        setMessages((prev) => [...prev, { role: "ai", text: enReply }]);
        setThinking(false);
        return;
      }

      // KO 모드: 룰 기반 폴백 (후속 질문 맥락 결합)
      const prevMsgs = messages.filter((m) => m.role === "user");
      const context = prevMsgs.length > 0 ? prevMsgs[prevMsgs.length - 1].text : "";
      let enrichedQuery = userMsg;
      if (["거기","그 근처","그쪽","더 알려","자세히","추가로"].some((w) => qLower.includes(w)) && context) {
        enrichedQuery = context + " " + userMsg;
      }
      const reply = generateAIResponse(enrichedQuery);
      setMessages((prev) => [...prev, { role: "ai", text: reply }]);
      setThinking(false);
    } catch (err) {
      if (locale === "en") {
        const ruleResponse = findEnglishFallback(userMsg);
        const enReply = ruleResponse || defaultEnglishResponse(userMsg);
        setMessages((prev) => [...prev, { role: "ai", text: enReply }]);
        setThinking(false);
        return;
      }
      const reply = generateAIResponse(userMsg);
      setMessages((prev) => [...prev, { role: "ai", text: reply }]);
      setThinking(false);
    }
  }

  return (
    <section id="ai-chat" className="hero-section" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* ── 상단 CTA 스트립 (5%) ── */}
      <div className="hero-cta" style={{
        background: "#fff", borderRadius: 16, border: "1px solid #E5E7EB",
        padding: "16px 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 12,
      }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <h1 style={{ fontSize: 18, fontWeight: 800, color: "#1D1D1F", margin: 0, letterSpacing: "-0.03em" }}>
            {t("ai.matchTitle")}
          </h1>
          <p style={{ fontSize: 13, color: "#6B7280", margin: "4px 0 0" }}>
            {t("ai.matchDesc")}
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
          {[t("ai.trust3step"), t("ai.trustAI"), t("ai.trustReport"), t("ai.trustPay")].map((label) => (
            <span key={label} style={{
              fontSize: 12, color: "#6B7280", background: "#F9FAFB",
              border: "1px solid #E5E7EB", borderRadius: 20, padding: "5px 14px",
              fontWeight: 500, whiteSpace: "nowrap",
            }} className="pc-only">
              {label}
            </span>
          ))}
          <a href="https://pf.kakao.com/_giedX/chat" target="_blank" rel="noopener noreferrer" style={{
            background: "#1D1D1F", color: "#fff", padding: "8px 18px",
            borderRadius: 10, fontSize: 13, fontWeight: 600, textDecoration: "none",
            whiteSpace: "nowrap",
          }}>
            {t("ai.matchCta")}
          </a>
        </div>
      </div>

      {/* ── AI 채팅 (80%) ── */}
      <div className="hero-chat" style={{
        background: "#1D1D1F", borderRadius: 20, overflow: "hidden",
        display: "flex", flexDirection: "column",
        minHeight: "calc(100vh - 250px)",
        boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
      }}>
        {/* AI 헤더 */}
        <div style={{
          padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.08)",
          display: "flex", alignItems: "center", gap: 12,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 12,
            background: "linear-gradient(135deg, #FF6B35, #F59E0B)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18,
          }}>🤖</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>{t("ai.chatTitle")}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{t("ai.chatSubtitle")}</div>
          </div>
          <span style={{
            fontSize: 11, fontWeight: 600,
            background: "rgba(5,150,105,0.2)", color: "#34D399", padding: "3px 10px", borderRadius: 8,
          }}>{t("ai.chatOnline")}</span>
        </div>

        {/* 채팅 메시지 영역 */}
        <div ref={chatBoxRef} style={{
          flex: 1, padding: "20px 24px", overflowY: "auto",
          display: "flex", flexDirection: "column", gap: 12,
        }}>
          {messages.map((msg, i) => (
            <div key={i} style={{
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              maxWidth: "80%",
            }}>
              <div style={{
                background: msg.role === "user"
                  ? "linear-gradient(135deg, #FF6B35, #F59E0B)"
                  : "rgba(255,255,255,0.06)",
                color: msg.role === "user" ? "#fff" : "rgba(255,255,255,0.9)",
                padding: "12px 16px", borderRadius: 16,
                fontSize: 14, lineHeight: 1.7, whiteSpace: "pre-line",
                borderBottomRightRadius: msg.role === "user" ? 4 : 16,
                borderBottomLeftRadius: msg.role === "ai" ? 4 : 16,
              }}>
                {msg.text}
              </div>
            </div>
          ))}
          {thinking && (
            <div style={{
              alignSelf: "flex-start", background: "rgba(255,255,255,0.06)",
              color: "rgba(255,255,255,0.4)", padding: "12px 16px", borderRadius: 16,
              fontSize: 14, borderBottomLeftRadius: 4,
            }}>
              <span style={{ display: "inline-block", animation: "pulse 1.5s infinite" }}>{t("ai.chatThinking")}</span>
            </div>
          )}
        </div>

        {/* 빠른 질문 */}
        <div className="hero-quick-q" style={{
          padding: "10px 20px", display: "flex", gap: 8,
          overflowX: "auto", borderTop: "1px solid rgba(255,255,255,0.06)",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
        }}>
          {[t("ai.quickQ1"), t("ai.quickQ2"), t("ai.quickQ3"), t("ai.quickQ4"), t("ai.quickQ5"), t("ai.quickQ6")].map((q) => (
            <button key={q} onClick={() => { setChatInput(q); }}
              style={{
                flexShrink: 0, background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)",
                border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20,
                padding: "6px 14px", fontSize: 12, cursor: "pointer", whiteSpace: "nowrap",
                transition: "all 0.15s",
                fontFamily: "inherit",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
            >
              {q}
            </button>
          ))}
        </div>

        {/* 입력 */}
        <form onSubmit={handleChat} className="hero-input-form" style={{
          padding: "14px 20px", borderTop: "1px solid rgba(255,255,255,0.06)",
          display: "flex", gap: 8,
        }}>
          <input
            value={chatInput} onChange={(e) => setChatInput(e.target.value)}
            placeholder={t("ai.chatInputPlaceholder")}
            style={{
              flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 12, padding: "12px 16px", color: "#fff",
              fontSize: 15, outline: "none", minWidth: 0,
              fontFamily: "inherit",
            }}
          />
          <button type="submit" disabled={thinking} style={{
            background: "linear-gradient(135deg, #FF6B35, #F59E0B)", color: "#fff", border: "none",
            borderRadius: 12, padding: "0 18px", fontSize: 14,
            fontWeight: 700, cursor: "pointer", flexShrink: 0,
            letterSpacing: "-0.01em",
            fontFamily: "inherit",
          }}>
            {t("ai.chatSend")}
          </button>
        </form>
      </div>

      {/* ── 신뢰 배지 (5%) ── */}
      <div style={{
        display: "flex", justifyContent: "center", gap: 24, padding: "8px 0",
        flexWrap: "wrap",
      }}>
        {[
          { label: t("ai.trust3step"), desc: t("ai.trust3stepDesc") },
          { label: t("ai.trustAI"), desc: t("ai.trustAIDesc") },
          { label: t("ai.trustReport"), desc: t("ai.trustReportDesc") },
          { label: t("ai.trustPay"), desc: t("ai.trustPayDesc") },
        ].map((item) => (
          <div key={item.label} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#1D1D1F" }}>{item.label}</div>
            <div style={{ fontSize: 11, color: "#9CA3AF" }}>{item.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
