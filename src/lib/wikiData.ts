// P.E.T 펫-위키 데이터
// 나무위키 스타일 반려동물 정보

export interface BreedInfo {
  id: string;
  name: string;
  nameEn: string;
  origin: string;
  weight: string;
  lifespan: string;
  personality: string[];
  image: string;
  description: string;
  characteristics: string;
  health: string;
  care: string;
  history: string;
}

export interface PetOverview {
  species: "cat" | "dog";
  title: string;
  scientificName: string;
  description: string;
  history: string;
  characteristics: string;
  healthTips: string;
  breeds: BreedInfo[];
}

export const CAT_DATA: PetOverview = {
  species: "cat",
  title: "고양이",
  scientificName: "Felis catus",
  description: "고양이는 식육목 고양이과에 속하는 포유류로, 약 1만 년 전부터 인간과 함께 생활해온 반려동물입니다. 전 세계적으로 약 6억 마리 이상의 고양이가 사육되고 있으며, 독립적인 성격과 깔끔한 습성으로 현대인에게 가장 사랑받는 반려동물 중 하나입니다.",
  history: "고양이의 가축화는 약 9,500년 전 근동 지역에서 시작된 것으로 추정됩니다. 농경 사회에서 곡물을 저장하기 시작하면서 쥐가 모여들었고, 쥐를 잡기 위해 야생 고양이가 인간 거주지 근처로 접근한 것이 가축화의 시작이었습니다. 고대 이집트에서는 고양이를 신성한 동물로 숭배했으며, 바스테트(Bastet) 여신의 화신으로 여겨졌습니다.",
  characteristics: "고양이는 뛰어난 야간 시력, 예민한 청각, 유연한 신체 구조를 가지고 있습니다. 수염(비브리사)은 공간 감각을 돕는 감각 기관이며, 앞발의 발톱은 자유자재로 출납이 가능합니다. 체온은 38~39도이며, 하루 평균 12~16시간을 수면에 사용합니다. 그루밍(자기 몸을 핥는 행동)에 하루 약 30~50%의 깨어있는 시간을 할애합니다.",
  healthTips: "고양이의 평균 수명은 12~18년이며, 실내에서 키우면 더 오래 살 수 있습니다. 주요 건강 관리 포인트: 정기적인 예방접종(범백, 칼리시, 허피스), 중성화 수술(6개월 전후), 구충(3개월마다), 치과 관리, 적정 체중 유지가 중요합니다. 고양이는 아픈 것을 숨기는 습성이 있으므로, 식욕 변화, 음수량 변화, 배변 상태를 주의 깊게 관찰해야 합니다.",
  breeds: [
    { id: "korean-shorthair", name: "코리안 숏헤어", nameEn: "Korean Shorthair", origin: "한국", weight: "3.5~5.5kg", lifespan: "15~20년", personality: ["독립적", "영리함", "적응력 강함", "호기심 많음"],
      image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop",
      description: "코리안 숏헤어(코숏)는 한국 토종 고양이로, 특정 품종이 아닌 한국에서 자연 발생한 단모종 고양이를 통칭합니다. 한국에서 가장 많이 키우는 고양이이며, 건강하고 적응력이 뛰어납니다.",
      characteristics: "다양한 모색(치즈, 고등어, 턱시도, 삼색이 등)을 가지며, 체형과 성격도 개체마다 다양합니다. 전반적으로 건강하고 면역력이 강하며, 혼합 유전자 풀 덕분에 유전 질환이 적은 편입니다.",
      health: "전반적으로 건강한 편이나, 비만에 주의해야 합니다. 중성화 수술 후 체중 관리가 중요하며, 구내염과 결석에 주의가 필요합니다.",
      care: "단모종이라 브러싱은 주 1~2회면 충분합니다. 활동적이므로 놀이 시간을 충분히 제공하고, 캣타워 등 수직 공간을 마련해주세요.",
      history: "한반도에서 수천 년간 자연적으로 번식해온 고양이입니다. 특정 브리딩 프로그램 없이 자연 선택에 의해 진화했습니다." },
    { id: "british-shorthair", name: "브리티시 숏헤어", nameEn: "British Shorthair", origin: "영국", weight: "4~8kg", lifespan: "12~17년", personality: ["온순함", "느긋함", "독립적", "조용함"],
      image: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400&h=300&fit=crop",
      description: "브리티시 숏헤어는 영국 원산의 고양이 품종으로, 둥글고 통통한 체형과 풍성한 털이 특징입니다. '블루' 색상이 가장 유명하며, 온순하고 차분한 성격으로 인기가 높습니다.",
      characteristics: "둥근 얼굴과 큰 눈, 짧고 두꺼운 목, 넓은 가슴이 특징입니다. 털은 짧지만 매우 밀도가 높아 플러시 인형 같은 촉감입니다.",
      health: "비대성 심근병증(HCM), 다낭성 신장병(PKD)에 주의가 필요합니다. 비만이 되기 쉬우므로 식이 조절이 중요합니다.",
      care: "주 2~3회 브러싱이 필요하며, 비만 예방을 위해 적절한 운동과 식이 관리가 중요합니다.",
      history: "로마인들이 영국에 데려온 고양이의 후손으로, 19세기에 정식 품종으로 인정받았습니다." },
    { id: "russian-blue", name: "러시안 블루", nameEn: "Russian Blue", origin: "러시아", weight: "3~5.5kg", lifespan: "15~20년", personality: ["수줍음", "충성스러움", "조용함", "영리함"],
      image: "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=400&h=300&fit=crop",
      description: "러시안 블루는 은청색의 아름다운 털과 에메랄드빛 녹색 눈이 특징인 우아한 고양이입니다. 조용하고 수줍은 성격이지만, 주인에게는 매우 충성스럽습니다.",
      characteristics: "이중 구조의 짧고 촘촘한 털이 특징으로, 벨벳 같은 촉감입니다. 알레르기를 유발하는 Fel d 1 단백질 분비가 적어 알레르기 환자에게 비교적 적합합니다.",
      health: "유전적으로 건강한 편이나, 비뇨기계 질환과 비만에 주의가 필요합니다.",
      care: "주 1회 브러싱으로 충분합니다. 규칙적인 생활을 좋아하므로 급식 시간과 놀이 시간을 일정하게 유지하세요.",
      history: "러시아 아르한겔스크 항구에서 유래한 것으로 알려져 있으며, 19세기 중반 영국으로 건너가 품종으로 확립되었습니다." },
    { id: "persian", name: "페르시안", nameEn: "Persian", origin: "이란(페르시아)", weight: "3.5~7kg", lifespan: "12~17년", personality: ["온순함", "차분함", "애교 많음", "느긋함"],
      image: "https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=400&h=300&fit=crop",
      description: "페르시안은 긴 털과 납작한 얼굴이 특징인 고양이 품종으로, 세계에서 가장 인기 있는 장모종 고양이 중 하나입니다.",
      characteristics: "길고 풍성한 털, 짧은 다리, 넓은 얼굴이 특징입니다. 매우 조용하고 차분한 성격으로 실내 생활에 적합합니다.",
      health: "다낭성 신장병(PKD), 안면 구조로 인한 호흡기 문제, 눈물 흘림이 흔합니다. 정기적인 건강 검진이 중요합니다.",
      care: "매일 브러싱이 필수입니다. 눈 주변 세정, 정기적인 목욕(월 1~2회)이 필요합니다.",
      history: "17세기 이탈리아를 통해 유럽에 소개되었으며, 빅토리아 시대에 영국 왕실에서 큰 인기를 얻었습니다." },
    { id: "scottish-fold", name: "스코티시 폴드", nameEn: "Scottish Fold", origin: "스코틀랜드", weight: "3~6kg", lifespan: "11~15년", personality: ["다정함", "사교적", "유순함", "장난기 많음"],
      image: "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=400&h=300&fit=crop",
      description: "스코티시 폴드는 앞으로 접힌 귀가 가장 큰 특징인 고양이 품종입니다. 둥근 얼굴과 큰 눈이 부엉이를 닮아 독특한 매력이 있습니다.",
      characteristics: "접힌 귀는 유전적 돌연변이에 의한 것으로, 모든 스코티시 폴드가 접힌 귀를 가지는 것은 아닙니다. 다양한 자세로 앉는 것을 좋아합니다.",
      health: "골연골이형성증(관절 문제)에 취약합니다. 폴드끼리의 교배는 금지되어 있으며, 정기적인 관절 검사가 중요합니다.",
      care: "주 2회 브러싱, 접힌 귀 안쪽 청소에 주의가 필요합니다.",
      history: "1961년 스코틀랜드의 한 농장에서 발견된 접힌 귀 고양이 '수지'가 시조입니다." },
    { id: "bengal", name: "뱅갈", nameEn: "Bengal", origin: "미국", weight: "3.5~7kg", lifespan: "12~16년", personality: ["활발함", "영리함", "호기심 강함", "장난꾸러기"],
      image: "https://images.unsplash.com/photo-1606491956689-2ea866880049?w=400&h=300&fit=crop",
      description: "뱅갈은 아시아표범고양이와 집고양이의 교배로 탄생한 품종으로, 야생적인 외모와 활발한 성격이 특징입니다.",
      characteristics: "표범 무늬의 아름다운 털이 최대 특징입니다. 매우 활동적이고 에너지가 넘치며, 물을 좋아하는 특이한 습성이 있습니다.",
      health: "비대성 심근병증(HCM), 진행성 망막위축증(PRA)에 주의가 필요합니다.",
      care: "많은 운동량이 필요합니다. 캣휠, 캣타워 등 충분한 활동 공간을 제공하고, 인터랙티브 장난감으로 놀아주세요.",
      history: "1963년 진 밀(Jean Mill)이 아시아표범고양이와 집고양이를 교배하여 탄생시켰습니다." },
  ],
};

export const DOG_DATA: PetOverview = {
  species: "dog",
  title: "강아지",
  scientificName: "Canis lupus familiaris",
  description: "강아지(개)는 식육목 개과에 속하는 포유류로, 약 1만 5천 년 전 늑대에서 가축화된 인류 최초의 반려동물입니다. 전 세계적으로 약 5억 마리 이상이 사육되고 있으며, 충성스러운 성격과 높은 사회성으로 '인간의 가장 친한 친구'로 불립니다.",
  history: "개의 가축화는 약 15,000~40,000년 전으로 추정되며, 회색늑대(Canis lupus)에서 분화된 것으로 알려져 있습니다. 초기에는 사냥 보조, 경비, 목축 등의 역할을 했으며, 시대가 변하면서 반려, 구조, 안내, 치료 등 다양한 분야에서 활약하고 있습니다.",
  characteristics: "개는 뛰어난 후각(인간의 1만~10만 배), 높은 사회성, 학습 능력을 보유하고 있습니다. 꼬리 흔들기, 짖기, 몸짓 등 다양한 방법으로 감정을 표현하며, 주인의 감정을 읽는 능력이 뛰어납니다. 품종에 따라 체형, 성격, 운동량이 크게 다릅니다.",
  healthTips: "강아지의 평균 수명은 소형견 12~16년, 대형견 8~12년입니다. 주요 건강 관리: 예방접종(DHPPL, 코로나, 켄넬코프, 광견병), 심장사상충 예방(매월), 구충(3개월마다), 치석 관리, 적정 체중 유지, 정기 건강검진이 중요합니다.",
  breeds: [
    { id: "maltese", name: "말티즈", nameEn: "Maltese", origin: "몰타", weight: "2~4kg", lifespan: "12~15년", personality: ["활발함", "애교 많음", "용감함", "사교적"],
      image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop",
      description: "말티즈는 하얀 실크 같은 긴 털이 특징인 소형견으로, 한국에서 가장 인기 있는 견종 중 하나입니다. 밝고 활발한 성격에 애교가 넘칩니다.",
      characteristics: "체중 2~4kg의 초소형견으로, 순백의 긴 털이 최대 특징입니다. 활발하고 에너지가 넘치며, 주인에 대한 애착이 매우 강합니다.",
      health: "슬개골 탈구, 치과 질환, 눈물 자국(누루증)이 흔합니다. 저혈당에 주의하고, 정기적인 치과 검진이 중요합니다.",
      care: "매일 브러싱이 필요하며, 2~4주마다 미용이 권장됩니다. 눈물 자국 관리, 이빨 양치가 중요합니다.",
      history: "2,000년 이상의 역사를 가진 가장 오래된 소형견 중 하나로, 지중해의 몰타 섬에서 유래했습니다." },
    { id: "poodle", name: "푸들", nameEn: "Poodle", origin: "프랑스/독일", weight: "스탠다드 20~32kg, 미니어처 5~9kg, 토이 2~3kg", lifespan: "12~15년", personality: ["매우 영리함", "활발함", "훈련 잘 됨", "사교적"],
      image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=300&fit=crop",
      description: "푸들은 전 견종 중 두 번째로 지능이 높은 견종으로, 스탠다드, 미니어처, 토이 세 가지 크기로 나뉩니다. 곱슬곱슬한 저자극성 털이 특징입니다.",
      characteristics: "곱슬한 단일 모층으로 털 빠짐이 거의 없어 알레르기 환자에게 적합합니다. 매우 영리하고 훈련성이 높으며, 다양한 도그 스포츠에서 활약합니다.",
      health: "고관절 이형성증, 진행성 망막위축증(PRA), 애디슨병에 주의가 필요합니다.",
      care: "4~6주마다 전문 미용이 필요합니다. 지적 자극이 필요하므로 퍼즐 장난감과 훈련을 제공하세요.",
      history: "원래 물새 사냥견으로 개발되었으며, 프랑스의 국견이지만 독일이 원산지로 추정됩니다." },
    { id: "golden-retriever", name: "골든 리트리버", nameEn: "Golden Retriever", origin: "영국(스코틀랜드)", weight: "25~34kg", lifespan: "10~12년", personality: ["온순함", "충성스러움", "영리함", "인내심 강함"],
      image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&h=300&fit=crop",
      description: "골든 리트리버는 금빛 털과 온순한 성격으로 전 세계적으로 사랑받는 대형견입니다. 안내견, 치료견, 구조견 등 다방면에서 활약합니다.",
      characteristics: "금빛의 이중 모층, 근육질 체형, 부드러운 입이 특징입니다. 매우 사교적이고 아이들과 잘 지내며, 물을 좋아합니다.",
      health: "고관절 이형성증, 암(특히 림프종, 혈관육종), 심장 질환에 주의가 필요합니다. 정기 건강검진이 매우 중요합니다.",
      care: "주 3~4회 브러싱, 충분한 운동(하루 1~2시간), 수영 기회 제공을 권장합니다.",
      history: "19세기 스코틀랜드에서 수렵용으로 개발되었으며, 1925년 AKC에 등록되었습니다." },
    { id: "pomeranian", name: "포메라니안", nameEn: "Pomeranian", origin: "독일/폴란드", weight: "1.5~3.5kg", lifespan: "12~16년", personality: ["활발함", "호기심 많음", "용감함", "자신감 있음"],
      image: "https://images.unsplash.com/photo-1560807707-8cc77767d783?w=400&h=300&fit=crop",
      description: "포메라니안은 작은 체구에 풍성한 이중 모층이 특징인 소형견입니다. 밝고 활기찬 성격으로 '작은 사자'라는 별명을 가지고 있습니다.",
      characteristics: "풍성한 이중 모층, 여우 같은 얼굴, 말려 올라간 꼬리가 특징입니다. 체구는 작지만 자신감이 넘치고, 경계심이 강합니다.",
      health: "슬개골 탈구, 기관허탈, 치과 질환, 탈모증에 주의가 필요합니다.",
      care: "주 3~4회 브러싱, 정기적인 미용이 필요합니다. 작은 체구이므로 낙상 사고에 주의하세요.",
      history: "독일과 폴란드의 포메라니아 지역에서 유래했으며, 빅토리아 여왕이 소형화를 촉진시켰습니다." },
    { id: "shih-tzu", name: "시츄", nameEn: "Shih Tzu", origin: "중국(티베트)", weight: "4~8kg", lifespan: "10~16년", personality: ["다정함", "쾌활함", "고집 있음", "사교적"],
      image: "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=400&h=300&fit=crop",
      description: "시츄는 '사자개'라는 뜻의 이름을 가진 소형견으로, 긴 실크 같은 털과 동그란 얼굴이 특징입니다. 중국 황실에서 사랑받은 품종입니다.",
      characteristics: "길고 풍성한 이중 모층, 짧은 주둥이, 큰 눈이 특징입니다. 사교적이고 다정하며, 다른 동물과도 잘 지냅니다.",
      health: "안면 구조로 인한 호흡기 문제, 안구 질환, 슬개골 탈구, 귀 감염에 주의가 필요합니다.",
      care: "매일 브러싱이 필수이며, 얼굴 주름 사이 청소와 귀 관리가 중요합니다.",
      history: "티베트에서 기원하여 중국 황실의 궁정견으로 사랑받았으며, 20세기 초 서양에 소개되었습니다." },
    { id: "welsh-corgi", name: "웰시 코기", nameEn: "Welsh Corgi", origin: "웨일스(영국)", weight: "10~14kg", lifespan: "12~15년", personality: ["영리함", "활발함", "충성스러움", "대담함"],
      image: "https://images.unsplash.com/photo-1612536057832-2ff7ead58194?w=400&h=300&fit=crop",
      description: "웰시 코기는 짧은 다리와 긴 몸통이 특징인 중소형 목양견입니다. 영국 엘리자베스 2세 여왕의 반려견으로 유명하며, 밝고 영리한 성격입니다.",
      characteristics: "짧은 다리, 긴 몸통, 큰 귀, 여우 같은 얼굴이 특징입니다. 목양견 본능이 강해 움직이는 것을 쫓아다니는 습성이 있습니다.",
      health: "추간판 질환(디스크), 고관절 이형성증, 비만에 주의가 필요합니다. 긴 허리 구조상 체중 관리가 매우 중요합니다.",
      care: "주 2~3회 브러싱, 하루 1시간 이상의 운동이 필요합니다. 계단 이용 시 주의가 필요합니다.",
      history: "웨일스에서 수백 년간 소 몰이를 위해 사용된 목양견으로, 펨브로크와 카디건 두 품종이 있습니다." },
  ],
};
