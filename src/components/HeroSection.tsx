"use client";
import { useState, useRef, useEffect } from "react";
import { CAT_DATA, DOG_DATA } from "../lib/wikiData";
import { analyzeSymptoms } from "../lib/symptomAnalyzer";
import { searchVetByArea } from "../lib/vetSearch";
import { findSymptomGuide, formatSymptomResponse, detectAnimal } from "../lib/aiKnowledge";
import { findFood, formatFoodResponse } from "../lib/aiFoodSafety";
import { BREED_DISEASE_DATA } from "../lib/wikiDiseaseData";

// 지역 키워드 추출 (세부 지역 우선 매칭, 동물 이름 혼동 방지)
function findArea(q: string): string | null {
  // 세부 지역(구/동)을 먼저 매칭 — 더 구체적인 것이 우선
  const detailAreas = [
    "강서구","화곡","마곡","발산","등촌","가양","염창",
    "강남구","역삼","삼성","논현","청담","압구정","신사","도곡","대치",
    "서초구","서초","방배","반포","잠원",
    "마포구","합정","상수","망원","연남","서교","홍대",
    "성동구","왕십리","행당","성수","한양대","옥수","금호",
    "송파구","잠실","가락","문정","방이",
    "강동구","천호","길동","둔촌","명일",
    "관악구","신림","봉천","낙성대",
    "영등포구","영등포","여의도","당산",
    "노원구","노원","상계","중계",
    "종로구","종로","광화문","혜화",
    "중구","을지로","명동","충무로",
    "용산구","용산","이태원","한남",
    "동대문구","회기","청량리","전농",
    "서대문구","신촌","이대",
    "구로구","구로","디지털단지",
    "금천구","가산","독산",
    "양천구","목동",
    "동작구","사당","노량진",
    "성북구","성북","길음","돈암",
    "광진구","건대","자양","구의",
    "강북구","수유","미아",
    "도봉구","도봉","방학",
    "중랑구","면목","상봉",
    "은평구","응암","불광","연신내",
    // 경기
    "파주","운정","금촌","문산",
    "일산","백석","마두","주엽","대화","킨텍스",
    "고양시",  // "고양이"와 구분
    "수원","영통","권선","팔달",
    "용인","수지","죽전","기흥",
    "성남","분당","정자","야탑",
    "인천","구월","부평","송도",
    "부천","안양","평촌","의정부","남양주","하남","김포",
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

export default function HeroSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<ChatMsg[]>([
    { role: "ai", text: "안녕하세요! P.E.T AI입니다 🐾\n품종 정보, 증상 분석, 치료비 등 무엇이든 물어보세요!" },
  ]);
  const [thinking, setThinking] = useState(false);
  const chatBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 채팅 컨테이너 내부만 스크롤 (페이지 전체 스크롤 방지)
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
    // 짧은 딜레이로 AI 느낌
    setTimeout(() => {
      const reply = generateAIResponse(userMsg);
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

          <p style={{ color: "#6B7280", fontSize: 13, lineHeight: 1.6, margin: "0 0 14px" }}>
            신원 인증 펫시터 · 수의사 자문 · 에스크로 안전결제<br />
            출시 전 등록 시 <strong style={{ color: "#FF6B35" }}>첫 이용 20% 할인</strong>
          </p>

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
