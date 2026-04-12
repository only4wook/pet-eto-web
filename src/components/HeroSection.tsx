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

// AI 응답 생성
function generateAIResponse(query: string): string {
  const q = query.toLowerCase().replace(/\s+/g, " ");
  const allBreeds = [...CAT_DATA.breeds, ...DOG_DATA.breeds];

  // 0. 증상 상세 가이드 (최우선)
  const symptomGuide = findSymptomGuide(q);
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
  if (q.includes("병원") || q.includes("동물병원")) return "🏥 동물병원 찾기\n\n지역명을 포함해서 물어봐주세요!\n\n예시:\n• 서울 근처 동물병원\n• 파주 24시 병원\n• 강남 동물병원\n\n또는 피드에 증상을 올리면 GPS 기반으로 자동 안내해드려요!";
  if (q.includes("예방접종") || q.includes("접종") || q.includes("백신")) return "💉 예방접종 스케줄\n\n🐶 강아지:\n• 6~8주: 1차 DHPPL+코로나\n• 10~12주: 2차 DHPPL+코로나\n• 14~16주: 3차 DHPPL+켄넬코프+광견병\n• 매년: 추가접종+심장사상충 검사\n💰 회당 3~5만원\n\n🐱 고양이:\n• 6~8주: 1차 FVRCP\n• 10~12주: 2차 FVRCP\n• 14~16주: 3차 FVRCP+광견병\n• 매년: 추가접종\n💰 회당 3~5만원";
  if (q.includes("비용") || q.includes("치료비") || q.includes("얼마") || q.includes("가격")) return "💰 반려동물 주요 의료비\n\n🔧 수술:\n• 슬개골 탈구: 100~350만원\n• 디스크: 200~600만원\n• 중성화: 15~40만원\n\n🏥 정기 관리:\n• 스케일링: 20~80만원\n• 건강검진: 10~30만원\n• 예방접종: 회당 3~5만원\n\n📋 월 관리비:\n• 소형견/고양이: 8~20만원\n• 대형견: 15~40만원\n\n👉 품종별 고질병·비용은 위키에서 확인!";
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
  if (q.includes("합사") || q.includes("새 고양이") || q.includes("새고양이") || q.includes("새 강아지") || q.includes("새강아지") || q.includes("다묘") || q.includes("다견") || q.includes("합류") || q.includes("싸워") || q.includes("서열")) return "🤝 합사/새 동물 소개\n\n🐱 고양이 합사:\n1. 격리 기간: 최소 1~2주 (별도 방)\n2. 냄새 교환: 수건 교환, 문 사이로 간식\n3. 시각 접촉: 문 살짝 열기, 펜스 사용\n4. 직접 만남: 짧게 시작, 점차 늘리기\n5. 절대 서두르지 않기! 2~4주 걸릴 수 있음\n\n🐶 강아지 합사:\n1. 중립 지역(공원 등)에서 첫 만남\n2. 리드줄 착용한 채로\n3. 간식으로 긍정 연결\n4. 자원(밥그릇, 장난감) 분리";
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

  // 로그인 유저의 등록 반려동물 조회
  useEffect(() => {
    if (user && user.id !== "demo-user") {
      supabase.from("pets").select("id, name, species, breed")
        .eq("owner_id", user.id)
        .then(({ data }) => { if (data) setUserPets(data); });
    }
  }, [user]);

  const petGreeting = userPets.length > 0
    ? `안녕하세요! P.E.T AI입니다 🐾\n등록된 반려동물: ${userPets.map((p) => `${p.name}(${p.species === "cat" ? "고양이" : p.species === "dog" ? "강아지" : p.species} · ${p.breed})`).join(", ")}\n\n무엇이든 물어보세요!`
    : "안녕하세요! P.E.T AI입니다 🐾\n품종 정보, 증상 분석, 치료비 등 무엇이든 물어보세요!";

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

  function handleChat(e: React.FormEvent) {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setThinking(true);
    setTimeout(() => {
      const qLower = userMsg.toLowerCase();

      // 피드백 감지: "틀렸어", "아니야", "그게 아니라" 등
      const isCorrection = ["틀렸","아니야","아닌데","그게 아니","이게 아니","잘못","다시","제대로","엉뚱","딴소리","헛소리","뭔소리","말도 안"].some((w) => qLower.includes(w));
      if (isCorrection) {
        // 이전 대화 맥락에서 원래 질문 찾기
        const prevUserMsgs = messages.filter((m) => m.role === "user").map((m) => m.text);
        const lastQ = prevUserMsgs[prevUserMsgs.length - 1] || "";
        const reply = `죄송해요! 다시 분석해볼게요 🔄\n\n이전 질문: "${lastQ}"\n\n좀 더 구체적으로 말씀해주시면 정확한 답변을 드릴 수 있어요.\n\n예시:\n• "동작구 동물병원 알려줘"\n• "고양이가 구토를 해요"\n• "말티즈 슬개골 비용"\n\n💬 또는 카카오톡으로 직접 상담해보세요!`;
        setMessages((prev) => [...prev, { role: "ai", text: reply }]);
        setThinking(false);
        return;
      }

      // 이전 대화 맥락 활용 (후속 질문)
      const prevMsgs = messages.filter((m) => m.role === "user");
      const context = prevMsgs.length > 0 ? prevMsgs[prevMsgs.length - 1].text : "";

      // "거기", "그 근처", "더 알려줘" 등 후속 질문 처리
      let enrichedQuery = userMsg;
      if (["거기","그 근처","그쪽","더 알려","자세히","추가로"].some((w) => qLower.includes(w)) && context) {
        enrichedQuery = context + " " + userMsg;
      }

      let reply = generateAIResponse(enrichedQuery);
      // 등록 반려동물 맥락 추가
      if (userPets.length > 0) {
        const petContext = userPets.map((p) =>
          `${p.name}(${p.species === "cat" ? "고양이" : p.species === "dog" ? "강아지" : p.species}·${p.breed})`
        ).join(", ");
        reply += `\n\n🐾 등록된 반려동물: ${petContext}`;
      }
      setMessages((prev) => [...prev, { role: "ai", text: reply }]);
      setThinking(false);
    }, 600);
  }

  return (
    <section style={{
      position: "relative", overflow: "hidden",
      background: "linear-gradient(135deg, #FFF7ED, #FEF3C7, #FFFBEB)",
      borderRadius: 16, marginBottom: 24,
    }}>
      <div style={{
        position: "absolute", top: -80, right: -80, width: 300, height: 300,
        background: "rgba(255,107,53,0.08)", borderRadius: "50%", filter: "blur(60px)",
      }} />

      <div style={{
        position: "relative", maxWidth: 1100, margin: "0 auto",
        padding: "28px 24px", display: "flex", gap: 24, alignItems: "stretch",
      }} className="hero-flex">
        {/* 왼쪽: CTA (축소) */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <span style={{
            display: "inline-block", background: "#FFF7ED", border: "1px solid #FDBA74",
            color: "#C2410C", fontSize: 12, fontWeight: 700, padding: "3px 12px",
            borderRadius: 20, marginBottom: 10,
          }}>
            반려동물 긴급케어 플랫폼
          </span>

          <h1 style={{
            fontSize: 22, fontWeight: 900, color: "#1F2937", lineHeight: 1.4,
            margin: "0 0 8px", letterSpacing: "-0.5px",
          }} className="hero-title">
            갑자기 못 돌볼 때,<br />
            <span style={{ color: "#FF6B35" }}>10분 안에</span> 케어러 연결
          </h1>

          <p style={{ color: "#6B7280", fontSize: 13, lineHeight: 1.6, margin: "0 0 6px" }}>
            신원 인증 펫시터 · 수의사 자문 · 에스크로 안전결제
          </p>
          <div style={{
            background: "#FFF7ED", border: "1px solid #FDBA74", borderRadius: 8,
            padding: "8px 12px", marginBottom: 12, fontSize: 13, color: "#92400E",
          }}>
            💰 <strong>긴급 방문 3만원/1시간</strong> · 반일 6만원 · 1일 12만원 &nbsp;
            <span style={{ color: "#FF6B35", fontWeight: 700 }}>선착순 10명 무료 체험!</span>
          </div>

          {submitted ? (
            <div style={{
              background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 10,
              padding: "10px 16px", color: "#15803D", fontWeight: 600, fontSize: 13,
            }}>
              출시 시 가장 먼저 알려드릴게요!
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8 }} className="hero-form">
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일 주소 입력" required
                style={{
                  flex: 1, padding: "10px 14px", borderRadius: 10,
                  border: "1px solid #E5E7EB", fontSize: 13, outline: "none",
                  background: "#fff", minWidth: 0,
                }}
              />
              <button type="submit" style={{
                background: "#FF6B35", color: "#fff", fontWeight: 700,
                padding: "10px 18px", borderRadius: 10, border: "none",
                fontSize: 13, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
              }}>
                출시 알림
              </button>
            </form>
          )}

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
            {[
              { icon: "🛡️", label: "안전결제" },
              { icon: "👨‍⚕️", label: "수의사 자문" },
              { icon: "✅", label: "신원인증" },
              { icon: "🎓", label: "한양대 창업팀" },
            ].map((item) => (
              <span key={item.label} style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                fontSize: 11, color: "#6B7280", background: "rgba(255,255,255,0.7)",
                borderRadius: 16, padding: "4px 10px",
              }}>
                {item.icon} {item.label}
              </span>
            ))}
          </div>
        </div>

        {/* 오른쪽: AI 검색/상담 */}
        <div style={{
          flex: 1, minWidth: 0, background: "#1F2937", borderRadius: 16,
          display: "flex", flexDirection: "column", overflow: "hidden",
          boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
        }} className="hero-ai-area">
          {/* AI 헤더 */}
          <div style={{
            padding: "14px 18px", borderBottom: "1px solid #374151",
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10,
              background: "linear-gradient(135deg, #FF6B35, #FB923C)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16,
            }}>🤖</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#F9FAFB" }}>P.E.T AI</div>
              <div style={{ fontSize: 11, color: "#9CA3AF" }}>품종 정보 · 증상 분석 · 비용 안내</div>
            </div>
            <span style={{
              marginLeft: "auto", fontSize: 10, fontWeight: 600,
              background: "#059669", color: "#fff", padding: "2px 8px", borderRadius: 8,
            }}>온라인</span>
          </div>

          {/* 채팅 영역 */}
          <div ref={chatBoxRef} style={{
            flex: 1, padding: "12px 16px", overflowY: "auto",
            display: "flex", flexDirection: "column", gap: 10,
            minHeight: 200, maxHeight: 300,
          }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                maxWidth: "85%",
              }}>
                <div style={{
                  background: msg.role === "user" ? "#FF6B35" : "#374151",
                  color: msg.role === "user" ? "#fff" : "#E5E7EB",
                  padding: "10px 14px", borderRadius: 12,
                  fontSize: 13, lineHeight: 1.6, whiteSpace: "pre-line",
                  borderBottomRightRadius: msg.role === "user" ? 4 : 12,
                  borderBottomLeftRadius: msg.role === "ai" ? 4 : 12,
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            {thinking && (
              <div style={{
                alignSelf: "flex-start", background: "#374151",
                color: "#9CA3AF", padding: "10px 14px", borderRadius: 12,
                fontSize: 13, borderBottomLeftRadius: 4,
              }}>
                분석 중...
              </div>
            )}
          </div>

          {/* 빠른 질문 버튼 */}
          <div style={{
            padding: "8px 16px", display: "flex", gap: 6,
            overflowX: "auto", borderTop: "1px solid #374151",
          }}>
            {["말티즈 특징", "구토 증상", "중성화 비용", "서울 24시 병원", "처음 키우기"].map((q) => (
              <button key={q} onClick={() => { setChatInput(q); }}
                style={{
                  flexShrink: 0, background: "#374151", color: "#D1D5DB",
                  border: "1px solid #4B5563", borderRadius: 16,
                  padding: "4px 12px", fontSize: 11, cursor: "pointer", whiteSpace: "nowrap",
                }}>
                {q}
              </button>
            ))}
          </div>

          {/* 입력 */}
          <form onSubmit={handleChat} style={{
            padding: "12px 16px", borderTop: "1px solid #374151",
            display: "flex", gap: 8,
          }}>
            <input
              value={chatInput} onChange={(e) => setChatInput(e.target.value)}
              placeholder="증상, 품종, 비용 등 무엇이든 물어보세요..."
              style={{
                flex: 1, background: "#374151", border: "1px solid #4B5563",
                borderRadius: 10, padding: "10px 14px", color: "#F9FAFB",
                fontSize: 13, outline: "none", minWidth: 0,
              }}
            />
            <button type="submit" disabled={thinking} style={{
              background: "#FF6B35", color: "#fff", border: "none",
              borderRadius: 10, padding: "10px 16px", fontSize: 13,
              fontWeight: 700, cursor: "pointer", flexShrink: 0,
            }}>
              전송
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
