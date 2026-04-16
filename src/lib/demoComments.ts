export interface DemoComment {
  id: string;
  nickname: string;
  content: string;
  is_expert: boolean;
  time: string;
  is_ai?: boolean;
}

export const COMMENTS_MAP: Record<string, DemoComment[]> = {
  // ============================================================
  // QUESTIONS (q1 ~ q10)
  // ============================================================

  // q1: 고양이가 갑자기 밥을 안 먹어요
  q1: [
    {
      id: "q1-c1",
      nickname: "냥이수의사",
      content:
        "24시간 이상 식욕부진이 지속되면 지방간(간 리피도시스) 위험이 있으니 병원 방문을 권합니다. 특히 통통한 고양이일수록 위험도가 높아요.",
      is_expert: true,
      time: "2시간 전",
    },
    {
      id: "q1-c2",
      nickname: "먼치킨집사",
      content:
        "저도 같은 경험 있어요! 사료 로트가 바뀌면서 맛이 달라졌었나 봐요. 다른 맛으로 바꿔주니까 다시 먹더라고요.",
      is_expert: false,
      time: "1시간 전",
    },
    {
      id: "q1-c3",
      nickname: "코숏러버",
      content:
        "혹시 최근에 환경 변화가 있었나요? 이사나 가구 배치 변경 같은 거요. 고양이는 스트레스에 민감해서 밥을 거부하기도 해요.",
      is_expert: false,
      time: "45분 전",
    },
    {
      id: "q1-c4",
      nickname: "캣맘95",
      content:
        "저희 애기는 구내염이었어요... 밥 앞에서 먹고 싶은데 아파서 못 먹는 느낌이었거든요. 입 안도 한번 확인해보세요!",
      is_expert: false,
      time: "30분 전",
    },
  ],

  // q2: 강아지 산책 하루에 몇 번이 적당한가요?
  q2: [
    {
      id: "q2-c1",
      nickname: "반려동물행동전문가",
      content:
        "견종과 나이에 따라 다릅니다. 소형견은 하루 2회 15~20분, 중형견은 2회 30분, 대형견이나 활동적인 견종은 2회 40분 이상 권장합니다.",
      is_expert: true,
      time: "3시간 전",
    },
    {
      id: "q2-c2",
      nickname: "골든리트리버아빠",
      content:
        "저희 골든이는 하루에 아침저녁 두 번, 각각 40분씩 산책해요. 그래야 집에서 안 뛰어다녀요 ㅋㅋ",
      is_expert: false,
      time: "2시간 전",
    },
    {
      id: "q2-c3",
      nickname: "포메사랑",
      content:
        "소형견이라 15분만 걸어도 헥헥거리던데, 무리하면 안 되겠죠? 짧게 자주가 나을까요?",
      is_expert: false,
      time: "1시간 전",
    },
    {
      id: "q2-c4",
      nickname: "산책왕보더콜리",
      content:
        "보더콜리 키우시는 분들은 아실 텐데... 산책 1시간은 기본이에요. 에너지가 넘쳐서 프리스비도 같이 해요.",
      is_expert: false,
      time: "40분 전",
    },
    {
      id: "q2-c5",
      nickname: "노견케어",
      content:
        "나이 든 강아지는 짧게 여러 번이 좋아요. 관절에 무리 안 가게 10~15분씩 3번 정도 추천합니다.",
      is_expert: false,
      time: "20분 전",
    },
  ],

  // q3: 고양이 스크래처 추천
  q3: [
    {
      id: "q3-c1",
      nickname: "캣타워장인",
      content:
        "수직형이랑 수평형 둘 다 두는 게 좋아요. 저희 집은 골판지 수평 스크래처를 제일 좋아하더라고요. 가성비도 좋고!",
      is_expert: false,
      time: "4시간 전",
    },
    {
      id: "q3-c2",
      nickname: "고양이행동교정사",
      content:
        "스크래처 선택 시 안정성이 가장 중요합니다. 흔들리면 고양이가 사용을 거부해요. 또한 고양이마다 선호하는 재질(사이잘, 골판지, 카펫)이 다르니 여러 종류를 시도해보세요.",
      is_expert: true,
      time: "3시간 전",
    },
    {
      id: "q3-c3",
      nickname: "삼색이집사",
      content:
        "저는 캣폴에 사이잘 로프 감은 거 쓰는데 진짜 미친 듯이 긁어요. 소파를 안 긁게 됐어요 감동!",
      is_expert: false,
      time: "2시간 전",
    },
    {
      id: "q3-c4",
      nickname: "냥스타그램",
      content: "다이소 골판지 스크래처 3천 원짜리 추천! 한 달에 한 번 갈아주면 돼요.",
      is_expert: false,
      time: "1시간 전",
    },
  ],

  // q4: 강아지 귀에서 냄새
  q4: [
    {
      id: "q4-c1",
      nickname: "수의사김닥터",
      content:
        "귀에서 냄새가 나면 외이염(otitis externa)을 의심해야 합니다. 특히 축축하고 갈색 분비물이 있으면 세균 또는 효모 감염일 수 있어요. 귀 세정은 전용 클리너로만 하시고, 면봉은 절대 사용하지 마세요.",
      is_expert: true,
      time: "5시간 전",
    },
    {
      id: "q4-c2",
      nickname: "코카스파니엘맘",
      content:
        "귀가 접힌 견종은 외이염이 자주 와요ㅠㅠ 저희 코카도 3개월마다 병원 가서 귀 세정 받아요.",
      is_expert: false,
      time: "4시간 전",
    },
    {
      id: "q4-c3",
      nickname: "푸들아빠",
      content:
        "저희 푸들이도 귀 냄새 때문에 갔더니 귀진드기래요. 약 넣어주니까 일주일 만에 나았어요!",
      is_expert: false,
      time: "2시간 전",
    },
  ],

  // q5: 고양이 중성화 수술 시기
  q5: [
    {
      id: "q5-c1",
      nickname: "고양이전문수의사",
      content:
        "일반적으로 생후 5~6개월이 적정 시기입니다. 조기 중성화(8주~)도 가능하지만 체중이 1kg 이상이어야 안전합니다. 수술 전 혈액검사를 통해 마취 위험을 확인하는 것이 중요해요.",
      is_expert: true,
      time: "6시간 전",
    },
    {
      id: "q5-c2",
      nickname: "러시안블루집사",
      content:
        "저는 5개월에 했는데 회복도 빠르고 좋았어요. 암컷이라 복강 수술인데 3일 만에 뛰어다녔어요.",
      is_expert: false,
      time: "5시간 전",
    },
    {
      id: "q5-c3",
      nickname: "길냥이보호자",
      content: "TNR 활동하면서 느낀 건데 너무 어리면 마취 위험이 있어요. 꼭 체중 확인하세요!",
      is_expert: false,
      time: "3시간 전",
    },
    {
      id: "q5-c4",
      nickname: "브숏라떼맘",
      content:
        "수술 후 넥카라 대신 수술복 입히니까 스트레스를 덜 받더라고요. 참고하세요!",
      is_expert: false,
      time: "1시간 전",
    },
  ],

  // q6: 강아지 사료 추천 (소형견)
  q6: [
    {
      id: "q6-c1",
      nickname: "반려동물영양사",
      content:
        "소형견은 대사율이 높아 고칼로리·고단백 사료가 좋습니다. AAFCO 기준 충족 여부, 첫 번째 원재료가 육류인지 확인하세요. 알러지가 있다면 단일 단백질 사료도 고려해보세요.",
      is_expert: true,
      time: "4시간 전",
    },
    {
      id: "q6-c2",
      nickname: "말티즈여왕",
      content:
        "저는 오리젠 스몰브리드 급여 중인데 모질이 확 좋아졌어요. 알갱이도 작아서 잘 먹어요.",
      is_expert: false,
      time: "3시간 전",
    },
    {
      id: "q6-c3",
      nickname: "치와와러버",
      content:
        "저희 치와와는 위가 약해서 하림 펫푸드 먹이고 있어요. 국내 브랜드 중에서는 괜찮은 것 같아요.",
      is_expert: false,
      time: "2시간 전",
    },
    {
      id: "q6-c4",
      nickname: "사료연구가",
      content:
        "사료 성분표에서 '부산물'이나 '곡물' 이 상위에 있으면 피하세요. 단백질 함량 25% 이상 추천합니다.",
      is_expert: false,
      time: "1시간 전",
    },
    {
      id: "q6-c5",
      nickname: "닥스훈트파파",
      content:
        "닥스훈트처럼 허리 약한 견종은 체중 관리가 중요해서 저칼로리 사료도 같이 보고 있어요. 고민이네요ㅠ",
      is_expert: false,
      time: "30분 전",
    },
  ],

  // q7: 고양이가 화분 흙을 먹어요
  q7: [
    {
      id: "q7-c1",
      nickname: "고양이내과수의사",
      content:
        "이식증(pica)의 일종일 수 있습니다. 빈혈이나 미네랄 결핍이 원인일 수 있으니 혈액검사를 권장합니다. 또한 일부 화분 흙에는 비료 성분이 있어 중독 위험이 있으니 화분을 치워주세요.",
      is_expert: true,
      time: "3시간 전",
    },
    {
      id: "q7-c2",
      nickname: "식물집사",
      content:
        "저도 겪었어요! 화분 위에 돌멩이 깔아놨더니 안 먹어요. 근데 근본적인 건 병원 가보시는 게...",
      is_expert: false,
      time: "2시간 전",
    },
    {
      id: "q7-c3",
      nickname: "냥이세마리",
      content:
        "캣그라스 키워서 옆에 두니까 흙 대신 풀을 뜯어먹어요. 시도해보세요!",
      is_expert: false,
      time: "1시간 전",
    },
  ],

  // q8: 강아지 분리불안 어떻게 교정
  q8: [
    {
      id: "q8-c1",
      nickname: "동물행동치료사",
      content:
        "분리불안 교정은 단계적 둔감화가 핵심입니다. 처음엔 30초 외출 후 돌아오기, 점차 시간을 늘려가세요. 외출 시 특별 간식(콩 장난감 등)을 주면 외출을 긍정적으로 인식하게 됩니다. 심한 경우 수의 행동학 전문의 상담을 추천합니다.",
      is_expert: true,
      time: "5시간 전",
    },
    {
      id: "q8-c2",
      nickname: "비숑프리제맘",
      content:
        "저희 비숑이는 CCTV 켜놓고 말 걸어주는 것만으로도 많이 좋아졌어요. 펫캠 추천!",
      is_expert: false,
      time: "3시간 전",
    },
    {
      id: "q8-c3",
      nickname: "유기견봉사자",
      content:
        "유기견 출신은 분리불안이 심한 경우가 많아요. 저희 아이는 교정에 6개월 걸렸지만 지금은 많이 나아졌어요. 포기하지 마세요!",
      is_expert: false,
      time: "2시간 전",
    },
    {
      id: "q8-c4",
      nickname: "웰시코기사육사",
      content:
        "혼자 있을 때 라디오 틀어놓으면 좀 나아요. 사람 목소리가 안정감을 주는 것 같아요.",
      is_expert: false,
      time: "1시간 전",
    },
  ],

  // q9: 고양이 구내염 치료비
  q9: [
    {
      id: "q9-c1",
      nickname: "고양이치과수의사",
      content:
        "구내염 치료 비용은 단계에 따라 다릅니다. 내과적 치료(스케일링+약물)는 20~40만 원, 발치 수술은 70~150만 원 정도입니다. 전구 발치가 필요한 중증 케이스는 200만 원 이상 나올 수 있어요.",
      is_expert: true,
      time: "4시간 전",
    },
    {
      id: "q9-c2",
      nickname: "구내염극복집사",
      content:
        "저희 고양이 전구 발치에 130만 원 들었어요. 하지만 발치 후 밥도 잘 먹고 삶의 질이 확 올라갔어요. 후회 없습니다.",
      is_expert: false,
      time: "3시간 전",
    },
    {
      id: "q9-c3",
      nickname: "다묘집사",
      content:
        "반려동물 보험 들어두길 잘했어요. 구내염 치료비 70%나 돌려받았거든요.",
      is_expert: false,
      time: "2시간 전",
    },
    {
      id: "q9-c4",
      nickname: "노묘케어",
      content:
        "나이 든 고양이일수록 구내염 위험이 높아요. 정기 검진이 제일 중요한 것 같아요.",
      is_expert: false,
      time: "1시간 전",
    },
  ],

  // q10: 강아지 첫 목욕 언제
  q10: [
    {
      id: "q10-c1",
      nickname: "펫그루머전문가",
      content:
        "첫 목욕은 예방접종이 완료된 후(보통 생후 12~14주)가 안전합니다. 그 전에는 젖은 수건으로 닦아주세요. 첫 목욕 시 미지근한 물과 강아지 전용 샴푸를 사용하고, 귀에 물이 안 들어가게 주의하세요.",
      is_expert: true,
      time: "6시간 전",
    },
    {
      id: "q10-c2",
      nickname: "시츄사랑해",
      content:
        "저는 3개월 때 첫 목욕 시켰어요. 처음엔 무서워했는데 간식 주면서 하니까 금방 적응했어요!",
      is_expert: false,
      time: "4시간 전",
    },
    {
      id: "q10-c3",
      nickname: "강아지목욕왕",
      content:
        "드라이가 제일 중요해요! 덜 말리면 피부병 생깁니다. 꼼꼼히 말려주세요.",
      is_expert: false,
      time: "2시간 전",
    },
    {
      id: "q10-c4",
      nickname: "펫살롱원장",
      content:
        "처음에는 집에서 하시고, 미용실은 성격이 어느 정도 형성된 4~5개월부터 데려오시는 게 좋아요.",
      is_expert: false,
      time: "1시간 전",
    },
  ],

  // ============================================================
  // INFO (i1 ~ i10)
  // ============================================================

  // i1: 강아지 예방접종 스케줄
  i1: [
    {
      id: "i1-c1",
      nickname: "우리동네수의사",
      content:
        "정리 잘 해주셨네요! 추가로 켄넬코프(기관지염) 백신도 사회화 전에 맞히시면 좋습니다. 특히 펫카페, 유치원 이용 예정이라면 필수예요.",
      is_expert: true,
      time: "5시간 전",
    },
    {
      id: "i1-c2",
      nickname: "초보견주",
      content:
        "이거 진짜 필요했어요! 스케줄 캘린더에 바로 등록했습니다. 감사해요!",
      is_expert: false,
      time: "4시간 전",
    },
    {
      id: "i1-c3",
      nickname: "다견가정",
      content:
        "다두 키우시는 분들은 한 마리가 아프면 다 맞아야 해서 비용이ㅠ 정기 접종 잘 챙기는 게 답이에요.",
      is_expert: false,
      time: "2시간 전",
    },
    {
      id: "i1-c4",
      nickname: "요키맘",
      content: "광견병 접종은 법적 의무라는 거 처음 알았어요! 좋은 정보 감사합니다.",
      is_expert: false,
      time: "1시간 전",
    },
  ],

  // i2: 반려동물 보험 비교
  i2: [
    {
      id: "i2-c1",
      nickname: "보험분석가",
      content:
        "보험 가입 시 면책기간, 보상한도, 갱신 조건을 꼭 확인하세요. 특히 기왕증(기존 질환) 보상 여부가 보험사마다 크게 다릅니다.",
      is_expert: true,
      time: "4시간 전",
    },
    {
      id: "i2-c2",
      nickname: "골든맘",
      content:
        "대형견은 슬개골, 고관절 질환이 잦아서 보험 꼭 필요해요. 수술비 300만 원 나왔는데 보험으로 다 해결했어요.",
      is_expert: false,
      time: "3시간 전",
    },
    {
      id: "i2-c3",
      nickname: "고양이보험가입자",
      content:
        "고양이 구내염 치료에 보험 덕을 많이 봤어요. 다만 치과 치료는 보상 안 되는 보험도 있으니 잘 보세요.",
      is_expert: false,
      time: "2시간 전",
    },
  ],

  // i3: 고양이가 먹으면 안 되는 음식
  i3: [
    {
      id: "i3-c1",
      nickname: "동물독성학전문가",
      content:
        "양파, 마늘, 포도, 초콜릿, 자일리톨이 대표적입니다. 특히 백합과 식물은 소량만 섭취해도 급성 신부전을 유발할 수 있어 매우 위험합니다.",
      is_expert: true,
      time: "5시간 전",
    },
    {
      id: "i3-c2",
      nickname: "참치캔집사",
      content:
        "사람용 참치캔도 나트륨이 높아서 안 좋다고 하더라고요. 저 그동안 줬는데 앞으로 조심해야겠어요.",
      is_expert: false,
      time: "3시간 전",
    },
    {
      id: "i3-c3",
      nickname: "집사초보",
      content:
        "우유도 안 되나요? 드라마에서 고양이한테 우유 주는 장면 많이 봤는데...",
      is_expert: false,
      time: "2시간 전",
    },
    {
      id: "i3-c4",
      nickname: "냥이영양사",
      content:
        "대부분의 성묘는 유당불내증이에요. 우유 대신 고양이 전용 우유를 주세요!",
      is_expert: false,
      time: "1시간 전",
    },
  ],

  // i4: 강아지 치석 관리 꿀팁
  i4: [
    {
      id: "i4-c1",
      nickname: "수의치과의사",
      content:
        "치석 예방의 핵심은 매일 양치입니다. 강아지 전용 칫솔과 치약을 사용하세요. 이미 치석이 쌓였다면 스케일링이 필요하며, 마취하 스케일링이 가장 효과적입니다.",
      is_expert: true,
      time: "6시간 전",
    },
    {
      id: "i4-c2",
      nickname: "양치마스터",
      content:
        "매일 양치하기 힘들면 덴탈 껌이라도 주세요. 저는 그린티즈 급여 중인데 입냄새가 확 줄었어요!",
      is_expert: false,
      time: "4시간 전",
    },
    {
      id: "i4-c3",
      nickname: "슈나우저집사",
      content:
        "슈나우저는 치석이 잘 생기는 견종이라 일주일에 3번은 양치해요. 처음엔 힘들었는데 이제 습관 됐어요.",
      is_expert: false,
      time: "2시간 전",
    },
    {
      id: "i4-c4",
      nickname: "스케일링후기",
      content: "작년에 스케일링 했는데 치석 제거 후 이빨이 2개 빠졌어요ㅠ 미리미리 관리합시다...",
      is_expert: false,
      time: "1시간 전",
    },
  ],

  // i5: 여름철 열사병 예방법
  i5: [
    {
      id: "i5-c1",
      nickname: "응급수의사",
      content:
        "열사병 증상은 과도한 헐떡임, 침흘림, 비틀거림입니다. 발견 시 시원한 곳으로 이동시키고 미지근한 물(차가운 물 X)로 체온을 낮춘 후 즉시 병원으로 가세요.",
      is_expert: true,
      time: "3시간 전",
    },
    {
      id: "q5-c2",
      nickname: "불독아빠",
      content:
        "단두종은 열사병에 특히 취약해요. 여름엔 아예 낮 산책을 안 하고 밤에만 나가요.",
      is_expert: false,
      time: "2시간 전",
    },
    {
      id: "i5-c3",
      nickname: "산책러",
      content:
        "아스팔트 온도 확인 꿀팁: 손등을 5초간 대보세요. 뜨거우면 강아지 발바닥도 화상 입어요!",
      is_expert: false,
      time: "1시간 전",
    },
    {
      id: "i5-c4",
      nickname: "쿨매트추천",
      content: "쿨매트 깔아주면 고양이도 강아지도 좋아해요. 올여름 필수템!",
      is_expert: false,
      time: "30분 전",
    },
  ],

  // i6: 고양이 화장실 모래 종류별 비교
  i6: [
    {
      id: "i6-c1",
      nickname: "고양이행동전문가",
      content:
        "모래 선택 시 고양이의 선호도가 가장 중요합니다. 일반적으로 입자가 고운 모래를 선호하며, 갑자기 모래를 바꾸면 화장실 기피 행동이 생길 수 있으니 서서히 섞어서 전환하세요.",
      is_expert: true,
      time: "5시간 전",
    },
    {
      id: "i6-c2",
      nickname: "두부모래파",
      content:
        "두부 모래 쓰고 있는데 먼지도 적고 변기에 버릴 수 있어서 편해요. 다만 응고력은 벤토나이트가 더 좋긴 해요.",
      is_expert: false,
      time: "3시간 전",
    },
    {
      id: "i6-c3",
      nickname: "벤토집사",
      content:
        "벤토나이트 쓰다가 먼지 때문에 두부모래로 바꿨는데 고양이가 안 쓰려고 해요ㅠ 혼합해서 적응 중입니다.",
      is_expert: false,
      time: "2시간 전",
    },
    {
      id: "i6-c4",
      nickname: "카사바모래파",
      content: "카사바 모래도 좋아요! 응고력 좋고 먼지 적고. 가격이 좀 비싼 게 단점.",
      is_expert: false,
      time: "1시간 전",
    },
  ],

  // i7: 반려동물 등록 방법 2026
  i7: [
    {
      id: "i7-c1",
      nickname: "반려동물법률전문가",
      content:
        "2026년부터 동물등록이 더 강화되었습니다. 내장형 칩 의무이며, 미등록 시 과태료가 60만 원까지 올랐습니다. 가까운 동물병원이나 동물등록대행업체에서 등록 가능합니다.",
      is_expert: true,
      time: "4시간 전",
    },
    {
      id: "i7-c2",
      nickname: "등록완료",
      content:
        "동물병원에서 칩 삽입하면서 바로 등록했어요. 비용은 1만 원 정도였어요. 간단합니다!",
      is_expert: false,
      time: "3시간 전",
    },
    {
      id: "i7-c3",
      nickname: "고양이도등록",
      content: "고양이도 등록 대상인 거 모르는 분 많더라고요. 실내묘도 꼭 등록하세요!",
      is_expert: false,
      time: "2시간 전",
    },
    {
      id: "i7-c4",
      nickname: "정보감사",
      content: "국민동물보호정보시스템에서 온라인으로도 확인할 수 있어요. 유용한 정보 감사합니다!",
      is_expert: false,
      time: "1시간 전",
    },
  ],

  // i8: 강아지 발바닥 갈라짐
  i8: [
    {
      id: "i8-c1",
      nickname: "피부과수의사",
      content:
        "발바닥 갈라짐은 건조, 알레르기, 아연 결핍, 과도한 산책 등이 원인일 수 있습니다. 강아지 전용 발 밤(paw balm)을 발라주시고, 심하면 내원하셔서 피부 검사를 받아보세요.",
      is_expert: true,
      time: "4시간 전",
    },
    {
      id: "i8-c2",
      nickname: "발밤추천러",
      content:
        "저는 머셔스 퍼피 발밤 쓰는데 효과 좋아요. 자기 전에 발라주면 다음 날 촉촉해져 있어요!",
      is_expert: false,
      time: "3시간 전",
    },
    {
      id: "i8-c3",
      nickname: "겨울산책러",
      content:
        "겨울에 제설제 뿌린 길 걸으면 발바닥이 많이 상해요. 산책 후 꼭 발 씻겨주세요.",
      is_expert: false,
      time: "2시간 전",
    },
  ],

  // i9: 고양이 스트레스 신호 10가지
  i9: [
    {
      id: "i9-c1",
      nickname: "고양이행동학자",
      content:
        "좋은 정리글이네요. 추가로 '과도한 그루밍으로 인한 탈모'도 대표적인 스트레스 신호입니다. 행동 변화가 2주 이상 지속되면 반드시 수의사와 상담하세요.",
      is_expert: true,
      time: "5시간 전",
    },
    {
      id: "i9-c2",
      nickname: "3냥이집사",
      content:
        "다묘 가정에서 한 아이만 숨으면 스트레스 받는 거라고 하더라고요. 개별 공간이 중요해요.",
      is_expert: false,
      time: "3시간 전",
    },
    {
      id: "i9-c3",
      nickname: "페르시안집사",
      content:
        "저희 고양이가 갑자기 화장실 밖에 실수하길래 병원 갔더니 스트레스성 방광염이래요ㅠ",
      is_expert: false,
      time: "2시간 전",
    },
    {
      id: "i9-c4",
      nickname: "펠리웨이사용자",
      content:
        "펠리웨이 디퓨저 써보세요. 과학적으로 효과 입증된 거고, 우리 고양이 확실히 안정됐어요.",
      is_expert: false,
      time: "1시간 전",
    },
  ],

  // i10: 반려견 MBTI 견종별 성격
  i10: [
    {
      id: "i10-c1",
      nickname: "반려동물심리사",
      content:
        "재미있는 분류네요! 다만 같은 견종이라도 개체차가 크다는 점 참고하세요. 사회화 시기의 경험이 성격 형성에 큰 영향을 미칩니다.",
      is_expert: true,
      time: "3시간 전",
    },
    {
      id: "i10-c2",
      nickname: "시바견사육사",
      content:
        "시바는 ISTP가 맞는 것 같아요 ㅋㅋ 독립적이고 자기 할 일 하고... 주인 부르면 쳐다만 봐요.",
      is_expert: false,
      time: "2시간 전",
    },
    {
      id: "i10-c3",
      nickname: "래브라도러버",
      content:
        "래브라도는 ESFJ 맞네요! 사교적이고 모든 사람한테 꼬리 흔들고 다녀요 ㅋㅋㅋ",
      is_expert: false,
      time: "1시간 전",
    },
    {
      id: "i10-c4",
      nickname: "보더콜리천재",
      content: "보더콜리는 ENTJ! 지능이 높아서 사람을 훈련시키는 느낌이에요 ㅋㅋ",
      is_expert: false,
      time: "30분 전",
    },
  ],

  // ============================================================
  // DAILY (d1 ~ d10)
  // ============================================================

  // d1: 뽀삐 미용했어요
  d1: [
    {
      id: "d1-c1",
      nickname: "미용사언니",
      content: "너무 예뻐요! 서머컷 하셨나봐요? 어떤 스타일로 하셨어요?",
      is_expert: false,
      time: "2시간 전",
    },
    {
      id: "d1-c2",
      nickname: "푸들맘",
      content: "헉 완전 인형이잖아요!! 미용실 어디예요? 저도 가고 싶어요!",
      is_expert: false,
      time: "1시간 전",
    },
    {
      id: "d1-c3",
      nickname: "비숑파파",
      content: "뽀삐 너무 귀여워요 ㅠㅠ 저희 비숑이도 곧 미용 예약인데 참고할게요!",
      is_expert: false,
      time: "45분 전",
    },
    {
      id: "d1-c4",
      nickname: "펫그루머전문가",
      content:
        "예쁘게 잘 나왔네요! 미용 후에는 피부가 외부에 노출되니까 자외선 차단에 신경 써주세요.",
      is_expert: true,
      time: "30분 전",
    },
  ],

  // d2: 고양이 집사 1년차 후기
  d2: [
    {
      id: "d2-c1",
      nickname: "10년차집사",
      content:
        "1년차 때가 제일 힘들고 또 제일 행복해요. 공감 가는 후기네요. 앞으로 더 재밌어질 거예요!",
      is_expert: false,
      time: "3시간 전",
    },
    {
      id: "d2-c2",
      nickname: "냥린이",
      content: "저도 곧 1년차인데 공감 백배! 고양이가 저를 집사로 인정해주는 게 느껴질 때 감동이에요.",
      is_expert: false,
      time: "2시간 전",
    },
    {
      id: "d2-c3",
      nickname: "아비시니안집사",
      content:
        "처음에 안 오더니 1년 지나니까 무릎에 올라오죠? ㅋㅋ 그 느낌 압니다!",
      is_expert: false,
      time: "1시간 전",
    },
    {
      id: "d2-c4",
      nickname: "고양이수의사",
      content:
        "1년차 후기 보니 건강관리도 잘 해주시는 것 같아요. 매년 건강검진 잊지 마세요!",
      is_expert: true,
      time: "30분 전",
    },
  ],

  // d3: 한강 산책 다녀왔어요
  d3: [
    {
      id: "d3-c1",
      nickname: "한강러닝크루",
      content: "날씨 좋은 날 한강 산책 최고죠! 어느 코스로 다녀오셨어요?",
      is_expert: false,
      time: "2시간 전",
    },
    {
      id: "d3-c2",
      nickname: "멍뭉이산책",
      content: "사진 너무 좋아요! 저도 여의도 쪽으로 자주 가는데 강아지 놀이터도 있어서 좋아요.",
      is_expert: false,
      time: "1시간 전",
    },
    {
      id: "d3-c3",
      nickname: "견주모임장",
      content: "한강에서 반려견 동반 가능한 구역이 정해져 있으니 확인하고 가세요! 과태료 주의요.",
      is_expert: false,
      time: "45분 전",
    },
    {
      id: "d3-c4",
      nickname: "산책후기",
      content: "진드기 조심하세요! 풀밭에서 놀고 나면 꼭 빗질하면서 확인해야 해요.",
      is_expert: false,
      time: "30분 전",
    },
  ],

  // d4: 고양이가 택배 박스를 점령
  d4: [
    {
      id: "d4-c1",
      nickname: "박스고양이",
      content: "ㅋㅋㅋ 고양이와 택배 박스는 떼려야 뗄 수 없는 관계! 우리 집도 박스를 못 버려요.",
      is_expert: false,
      time: "3시간 전",
    },
    {
      id: "d4-c2",
      nickname: "스코티쉬집사",
      content: "택배 올 때마다 고양이가 더 신나하는 것 같아요 ㅋㅋ 본체만체하다가 들어가 있음",
      is_expert: false,
      time: "2시간 전",
    },
    {
      id: "d4-c3",
      nickname: "냥이놀이연구가",
      content:
        "박스에 구멍 뚫어서 장난감 달아주면 대박 놀이터가 돼요! 한번 해보세요.",
      is_expert: false,
      time: "1시간 전",
    },
    {
      id: "d4-c4",
      nickname: "고양이행동전문가",
      content:
        "고양이가 박스를 좋아하는 건 밀폐된 공간에서 안정감을 느끼기 때문이에요. 스트레스 해소에도 좋답니다!",
      is_expert: true,
      time: "30분 전",
    },
  ],

  // d5: 강아지 생일파티
  d5: [
    {
      id: "d5-c1",
      nickname: "파티플래너",
      content: "생일 축하해요! 케이크 직접 만드셨어요? 너무 예쁘다!",
      is_expert: false,
      time: "2시간 전",
    },
    {
      id: "d5-c2",
      nickname: "댕댕이아빠",
      content: "저도 곧 우리 강아지 생일인데 참고할게요! 어디서 강아지 케이크 사셨어요?",
      is_expert: false,
      time: "1시간 전",
    },
    {
      id: "d5-c3",
      nickname: "반려동물영양사",
      content:
        "강아지 케이크는 설탕, 초콜릿 없는 전용 제품으로 주세요! 고구마, 당근 베이스가 안전합니다.",
      is_expert: true,
      time: "45분 전",
    },
    {
      id: "d5-c4",
      nickname: "해피독",
      content: "생일 모자 쓴 거 너무 귀여워요 ㅠㅠ 축하축하!",
      is_expert: false,
      time: "30분 전",
    },
  ],

  // d6: 고양이 캣휠 대성공
  d6: [
    {
      id: "d6-c1",
      nickname: "캣휠구매고민",
      content: "오! 어떤 브랜드 쓰시나요? 저도 사고 싶은데 비싸서 고민 중이에요.",
      is_expert: false,
      time: "3시간 전",
    },
    {
      id: "d6-c2",
      nickname: "뱅갈고양이맘",
      content: "뱅갈이는 캣휠 설치하자마자 미친 듯이 뛰어요 ㅋㅋ 운동량 해결 끝!",
      is_expert: false,
      time: "2시간 전",
    },
    {
      id: "d6-c3",
      nickname: "먼치킨파파",
      content: "먼치킨은 다리가 짧아서 캣휠 탈 수 있을까 걱정이에요. 어떤 사이즈가 좋을까요?",
      is_expert: false,
      time: "1시간 전",
    },
    {
      id: "d6-c4",
      nickname: "고양이비만전문가",
      content:
        "실내묘 비만 예방에 캣휠은 정말 좋은 선택이에요! 하루 20~30분 운동만으로도 큰 효과가 있습니다.",
      is_expert: true,
      time: "30분 전",
    },
  ],

  // d7: 강아지 수영 첫 도전기
  d7: [
    {
      id: "d7-c1",
      nickname: "수영하는리트리버",
      content: "ㅋㅋ 처음엔 다 무서워해요! 저희 골든이도 처음엔 안 들어가려고 했는데 지금은 물 보면 미쳐요.",
      is_expert: false,
      time: "3시간 전",
    },
    {
      id: "d7-c2",
      nickname: "반려견수영코치",
      content:
        "처음엔 얕은 곳에서 시작하고 구명조끼를 꼭 입혀주세요! 수영 후에는 귀 안의 물기를 꼭 제거해야 외이염을 예방할 수 있어요.",
      is_expert: true,
      time: "2시간 전",
    },
    {
      id: "d7-c3",
      nickname: "코기수영일기",
      content: "코기가 수영하는 거 보면 짧은 다리 허우적거리는 게 너무 귀여워요 ㅋㅋㅋ",
      is_expert: false,
      time: "1시간 전",
    },
    {
      id: "d7-c4",
      nickname: "독스파추천",
      content: "강남에 반려견 수영장 좋은 데 있어요. 수온도 관리되고 안전해요!",
      is_expert: false,
      time: "30분 전",
    },
  ],

  // d8: 다묘가정 5마리의 하루
  d8: [
    {
      id: "d8-c1",
      nickname: "7냥집사",
      content: "5마리요? 저는 7마리인데 공감 백배ㅋㅋ 화장실 관리가 제일 힘들죠?",
      is_expert: false,
      time: "4시간 전",
    },
    {
      id: "d8-c2",
      nickname: "다묘초보",
      content: "대단하세요! 다묘 합사할 때 팁 좀 알려주세요. 지금 2마리인데 3번째 합사 고민 중이에요.",
      is_expert: false,
      time: "3시간 전",
    },
    {
      id: "d8-c3",
      nickname: "고양이행동전문가",
      content:
        "다묘 가정에서는 화장실 수를 '고양이 수 + 1'로 유지하고, 각자의 은신처와 높은 곳을 확보해주는 것이 중요합니다.",
      is_expert: true,
      time: "2시간 전",
    },
    {
      id: "d8-c4",
      nickname: "사료비걱정",
      content: "5마리면 사료비 한 달에 얼마나 나와요? 궁금합니다 ㅎㅎ",
      is_expert: false,
      time: "1시간 전",
    },
  ],

  // d9: 펫카페 다녀왔는데 우리 강아지 사회성이...
  d9: [
    {
      id: "d9-c1",
      nickname: "펫카페매니아",
      content: "어떤 펫카페 다녀오셨어요? 사회성은 자주 가면 서서히 좋아져요!",
      is_expert: false,
      time: "3시간 전",
    },
    {
      id: "d9-c2",
      nickname: "동물행동교정사",
      content:
        "처음에는 조용한 시간대에 방문해서 1~2마리와만 접촉하게 해주세요. 갑자기 많은 강아지를 만나면 오히려 트라우마가 될 수 있어요.",
      is_expert: true,
      time: "2시간 전",
    },
    {
      id: "d9-c3",
      nickname: "소심이견주",
      content: "저희 강아지도 처음엔 구석에만 있었는데, 3번째부터 슬슬 다른 강아지한테 다가가더라고요!",
      is_expert: false,
      time: "1시간 전",
    },
    {
      id: "d9-c4",
      nickname: "사회화전문가",
      content:
        "사회화 시기(3~14주)를 놓쳤다면 더 천천히 접근해야 해요. 긍정적인 경험을 쌓아가는 게 중요합니다.",
      is_expert: false,
      time: "30분 전",
    },
  ],

  // d10: 고양이가 노트북 위에서 안 내려와요
  d10: [
    {
      id: "d10-c1",
      nickname: "재택근무집사",
      content: "ㅋㅋㅋ 만국 공통인가 봐요. 저도 매일 키보드 쟁탈전이에요.",
      is_expert: false,
      time: "2시간 전",
    },
    {
      id: "d10-c2",
      nickname: "IT집사",
      content: "미끼 노트북 하나 펼쳐두면 거기로 가요! 디코이 전략 추천합니다 ㅋㅋ",
      is_expert: false,
      time: "1시간 전",
    },
    {
      id: "d10-c3",
      nickname: "냥이해석가",
      content:
        "노트북이 따뜻해서 그래요. 가까이에 펫 히팅 패드를 놓아두면 그쪽으로 갈 수도 있어요!",
      is_expert: false,
      time: "45분 전",
    },
    {
      id: "d10-c4",
      nickname: "고양이행동학자",
      content:
        "집사의 관심이 노트북에 쏠리는 걸 감지하고 관심을 요구하는 행동이에요. 작업 전에 충분히 놀아주면 줄어들 수 있습니다.",
      is_expert: true,
      time: "30분 전",
    },
  ],

  // ============================================================
  // EMERGENCY (e1 ~ e10)
  // ============================================================

  // e1: 고양시 24시 동물병원
  e1: [
    {
      id: "e1-c1",
      nickname: "응급수의사",
      content:
        "고양시 일산 지역 24시 병원 정보 드립니다. 응급 시 전화 먼저 하시고 가세요. 이동 중에도 전화로 응급 처치 안내 받을 수 있습니다. 증상을 최대한 자세히 설명해주세요.",
      is_expert: true,
      time: "1시간 전",
    },
    {
      id: "e1-c2",
      nickname: "고양시민견주",
      content:
        "일산 쪽에 24시 동물병원 두 군데 가봤는데 둘 다 시설 좋아요. 응급실 대기가 길 수 있으니 미리 전화하세요.",
      is_expert: false,
      time: "45분 전",
    },
    {
      id: "e1-c3",
      nickname: "야간응급후기",
      content: "새벽 3시에 급하게 갔었는데 정말 다행이었어요. 24시 병원 위치 미리 알아두는 게 중요합니다!",
      is_expert: false,
      time: "30분 전",
    },
  ],

  // e2: 강아지가 초콜릿을 먹었어요
  e2: [
    {
      id: "e2-c1",
      nickname: "응급독성학수의사",
      content:
        "즉시 동물병원에 가세요! 초콜릿의 테오브로민 성분이 강아지에게 치명적입니다. 먹은 초콜릿 종류, 양, 강아지 체중을 병원에 알려주세요. 다크 초콜릿일수록 위험합니다. 구토를 유도하지 마시고 바로 이동하세요.",
      is_expert: true,
      time: "30분 전",
    },
    {
      id: "e2-c2",
      nickname: "초콜릿사고경험자",
      content:
        "저도 경험 있어요. 빨리 병원 가서 구토 처치 받으니 괜찮았어요. 시간이 생명입니다!",
      is_expert: false,
      time: "20분 전",
    },
    {
      id: "e2-c3",
      nickname: "예방이최고",
      content: "초콜릿, 포도, 자일리톨 껌은 강아지 손 안 닿는 곳에 꼭 보관하세요!",
      is_expert: false,
      time: "15분 전",
    },
  ],

  // e3: 고양이가 실 같은 걸 삼켰어요
  e3: [
    {
      id: "e3-c1",
      nickname: "고양이외과수의사",
      content:
        "절대 실을 잡아당기지 마세요! 장이 주름처럼 접혀서 천공될 위험이 있습니다. 실 끝이 입 밖으로 나와 있어도 자르지 말고 그대로 병원으로 오세요. X-ray와 초음파 검사가 필요합니다.",
      is_expert: true,
      time: "15분 전",
    },
    {
      id: "e3-c2",
      nickname: "실삼킨고양이집사",
      content:
        "저희 고양이가 바느질실 삼켜서 수술했어요. 장폐색 직전이었대요. 제발 빨리 병원 가세요!",
      is_expert: false,
      time: "10분 전",
    },
    {
      id: "e3-c3",
      nickname: "응급수의간호사",
      content:
        "이동 중에 고양이가 토할 수 있으니 캐리어에 수건 깔아주시고, 식사는 절대 시키지 마세요.",
      is_expert: false,
      time: "5분 전",
    },
  ],

  // e4: 강아지가 다리를 절뚝거려요
  e4: [
    {
      id: "e4-c1",
      nickname: "정형외과수의사",
      content:
        "갑자기 절뚝거리면 슬개골 탈구, 십자인대 파열, 골절 등이 원인일 수 있습니다. 다리를 만져보되 무리하게 움직이지 마시고, 활동을 제한한 후 병원에서 X-ray 촬영을 받아보세요.",
      is_expert: true,
      time: "1시간 전",
    },
    {
      id: "e4-c2",
      nickname: "슬개골수술후기",
      content: "저희 포메가 슬개골 탈구 3기였어요. 수술 후 재활하니 지금은 잘 뛰어다녀요. 빨리 확인해보세요!",
      is_expert: false,
      time: "45분 전",
    },
    {
      id: "e4-c3",
      nickname: "소형견주의",
      content: "소형견은 높은 곳에서 뛰어내리면 골절 위험이 커요. 소파, 침대에 계단 놓아주세요.",
      is_expert: false,
      time: "30분 전",
    },
  ],

  // e5: 고양이 경련 증상
  e5: [
    {
      id: "e5-c1",
      nickname: "신경과수의사",
      content:
        "경련이 5분 이상 지속되면 즉시 응급실로 가세요. 경련 중에는 입에 손을 넣지 마시고, 주변 위험한 물건을 치워주세요. 가능하다면 경련 영상을 촬영해 주시면 진단에 큰 도움이 됩니다.",
      is_expert: true,
      time: "20분 전",
    },
    {
      id: "e5-c2",
      nickname: "간질고양이집사",
      content:
        "저희 고양이도 간질이 있어서 매일 약 먹고 있어요. 처음 경련 봤을 때 너무 무서웠는데, 약으로 잘 조절되고 있어요.",
      is_expert: false,
      time: "15분 전",
    },
    {
      id: "e5-c3",
      nickname: "응급경험자",
      content: "당황하지 마시고 시간 체크하세요. 경련 지속 시간이 진단에 중요하대요.",
      is_expert: false,
      time: "10분 전",
    },
  ],

  // e6: 강아지 눈에서 피가 나요
  e6: [
    {
      id: "e6-c1",
      nickname: "안과수의사",
      content:
        "눈 출혈은 외상, 녹내장, 혈액응고 장애 등 다양한 원인이 있습니다. 절대 눈을 만지거나 압박하지 마시고, 엘리자베스 칼라가 있으면 씌워서 강아지가 눈을 긁지 못하게 한 후 즉시 내원하세요.",
      is_expert: true,
      time: "10분 전",
    },
    {
      id: "e6-c2",
      nickname: "시츄눈관리",
      content: "시츄처럼 눈이 돌출된 견종은 눈 부상이 잦아요. 산책 시 풀숲 조심하세요!",
      is_expert: false,
      time: "5분 전",
    },
    {
      id: "e6-c3",
      nickname: "응급처치맘",
      content: "깨끗한 거즈로 살짝 덮어주시고 병원으로 빨리 가세요. 감염 예방이 중요해요.",
      is_expert: false,
      time: "3분 전",
    },
  ],

  // e7: 고양이가 배를 누르면 울어요
  e7: [
    {
      id: "e7-c1",
      nickname: "내과수의사",
      content:
        "복부 통증은 장폐색, 요로결석, 복막염 등 심각한 질환의 신호일 수 있습니다. 먹이와 물을 주지 마시고 즉시 병원에서 초음파 검사를 받으세요. 고양이가 웅크리고 있거나 숨으려 한다면 더욱 긴급합니다.",
      is_expert: true,
      time: "15분 전",
    },
    {
      id: "e7-c2",
      nickname: "요로결석경험",
      content: "저희 고양이도 비슷했는데 요로결석이었어요. 수컷 고양이는 특히 위험하다고 해요.",
      is_expert: false,
      time: "10분 전",
    },
    {
      id: "e7-c3",
      nickname: "빠른대응",
      content: "배를 만졌을 때 우는 건 상당히 아프다는 신호예요. 주저하지 말고 응급실로!",
      is_expert: false,
      time: "5분 전",
    },
  ],

  // e8: 강아지가 벌에 쏘였어요
  e8: [
    {
      id: "e8-c1",
      nickname: "응급수의사",
      content:
        "벌침이 보이면 신용카드 같은 납작한 것으로 밀어서 빼주세요(핀셋으로 집으면 독이 더 들어갈 수 있어요). 냉찜질로 부기를 줄이고, 얼굴이 붓거나 호흡곤란 증상이 있으면 아나필락시스 위험이 있으니 즉시 병원으로 가세요.",
      is_expert: true,
      time: "10분 전",
    },
    {
      id: "e8-c2",
      nickname: "벌쏘임경험자",
      content:
        "입 주변을 쏘이면 기도가 부을 수 있어서 위험해요. 저희 강아지도 입술이 부어서 급하게 갔었어요.",
      is_expert: false,
      time: "5분 전",
    },
    {
      id: "e8-c3",
      nickname: "산책주의",
      content: "봄여름에 풀밭 산책할 때 벌 조심! 꽃 냄새 맡으려고 코 대다가 쏘이는 경우 많아요.",
      is_expert: false,
      time: "3분 전",
    },
  ],

  // e9: 고양이가 높은 데서 떨어졌어요
  e9: [
    {
      id: "e9-c1",
      nickname: "응급외과수의사",
      content:
        "고층 낙상(high-rise syndrome)은 긴급 상황입니다. 겉으로 멀쩡해 보여도 내부 장기 손상, 기흉, 골절이 있을 수 있습니다. 고양이를 평평한 바닥에 조심히 눕히고, 무리하게 움직이지 마신 후 즉시 병원에서 X-ray와 초음파 검사를 받으세요.",
      is_expert: true,
      time: "5분 전",
    },
    {
      id: "e9-c2",
      nickname: "낙상사고경험",
      content:
        "저희 고양이가 3층에서 떨어졌었는데 다행히 골절만 있었어요. 꼭 창문 방충망 설치하세요!",
      is_expert: false,
      time: "3분 전",
    },
    {
      id: "e9-c3",
      nickname: "고양이안전",
      content: "잠깐이라도 창문 열 때 안전망 필수예요. 고양이는 호기심에 뛰어내릴 수 있어요.",
      is_expert: false,
      time: "2분 전",
    },
  ],

  // e10: 강아지가 세제를 핥았어요
  e10: [
    {
      id: "e10-c1",
      nickname: "독성학수의사",
      content:
        "세제 종류와 성분을 확인해주세요. 구토를 유도하지 마세요(부식성 성분이면 식도를 다시 손상시킵니다). 입 주변을 깨끗한 물로 닦아주시고, 세제 용기를 가지고 즉시 병원으로 오세요. 성분표가 치료 방향을 결정합니다.",
      is_expert: true,
      time: "5분 전",
    },
    {
      id: "e10-c2",
      nickname: "세제사고경험",
      content: "저희 강아지도 바닥 세제 핥은 적 있어요. 다행히 소량이라 괜찮았지만 정말 놀랐어요. 세제류는 꼭 잠금장 안에!",
      is_expert: false,
      time: "3분 전",
    },
    {
      id: "e10-c3",
      nickname: "반려견안전",
      content: "캐비닛 잠금장치 설치 강추합니다. 아기 안전용품 코너에서 살 수 있어요.",
      is_expert: false,
      time: "2분 전",
    },
  ],

  // ============================================================
  // PAPERS (p1 ~ p5)
  // ============================================================

  // p1: 반려견 분리불안의 행동학적 치료 효과 연구
  p1: [
    {
      id: "p1-c1",
      nickname: "동물행동학박사",
      content:
        "흥미로운 연구네요. 단계적 둔감화와 역조건형성의 병행이 약물 단독 치료보다 장기적으로 효과적이라는 결론이 인상적입니다. 표본 크기가 좀 작은 점이 아쉽긴 하네요.",
      is_expert: true,
      time: "6시간 전",
    },
    {
      id: "p1-c2",
      nickname: "수의행동학전공",
      content:
        "대조군 설정이 잘 되어 있어요. 다만 견종별 차이에 대한 분석이 추가되면 더 좋을 것 같습니다.",
      is_expert: false,
      time: "4시간 전",
    },
    {
      id: "p1-c3",
      nickname: "반려견트레이너",
      content:
        "현장에서 느끼는 것과 일치하는 결과예요. 보호자 교육이 치료 성공률에 큰 영향을 미친다는 부분에 공감합니다.",
      is_expert: false,
      time: "2시간 전",
    },
    {
      id: "p1-c4",
      nickname: "석사과정",
      content: "참고문헌 리스트가 도움이 많이 됩니다. 관련 후속 연구가 있으면 공유해주세요!",
      is_expert: false,
      time: "1시간 전",
    },
  ],

  // p2: 고양이 만성 신부전의 조기 진단 바이오마커
  p2: [
    {
      id: "p2-c1",
      nickname: "내과학교수",
      content:
        "SDMA와 기존 크레아티닌 대비 조기 진단 민감도 향상에 대한 비교 분석이 잘 정리되어 있습니다. 임상 현장 적용 가능성에 대해 추가 논의가 필요할 것 같아요.",
      is_expert: true,
      time: "5시간 전",
    },
    {
      id: "p2-c2",
      nickname: "수의내과레지던트",
      content:
        "SDMA가 CKD IRIS Stage 1에서도 유의미한 변화를 보인다는 결과가 인상적이에요. 정기 검진에 포함시킬 가치가 있네요.",
      is_expert: false,
      time: "3시간 전",
    },
    {
      id: "p2-c3",
      nickname: "고양이신장연구",
      content:
        "표본이 다양한 연령대를 포괄한 점이 좋네요. 품종별 정상 참고치에 대한 연구도 기대됩니다.",
      is_expert: false,
      time: "2시간 전",
    },
  ],

  // p3: 반려동물 행동 분석을 위한 AI 영상인식
  p3: [
    {
      id: "p3-c1",
      nickname: "AI연구원",
      content:
        "YOLO 기반 실시간 행동 분류 정확도가 92%라니 상당히 높네요. 학습 데이터셋 구축 과정이 궁금합니다. 데이터 증강 기법은 어떤 걸 쓰셨나요?",
      is_expert: true,
      time: "4시간 전",
    },
    {
      id: "p3-c2",
      nickname: "펫테크스타트업",
      content:
        "상용화 가능성이 높아 보입니다. 펫캠과 연동하면 보호자가 외출 중에도 반려동물 상태를 파악할 수 있겠네요.",
      is_expert: false,
      time: "3시간 전",
    },
    {
      id: "p3-c3",
      nickname: "수의학과학생",
      content:
        "행동 이상 조기 감지가 가능하면 질병 조기 발견에도 활용할 수 있을 것 같아요. 후속 연구가 기대됩니다.",
      is_expert: false,
      time: "1시간 전",
    },
    {
      id: "p3-c4",
      nickname: "컴퓨터비전전공",
      content:
        "다두 가정에서 개체 식별 정확도는 어떤가요? 비슷한 외모의 고양이 구분이 어려울 것 같은데요.",
      is_expert: false,
      time: "30분 전",
    },
  ],

  // p4: 소형견 슬개골 탈구 수술 후 재활
  p4: [
    {
      id: "p4-c1",
      nickname: "재활수의사",
      content:
        "수술 후 재활 프로토콜에 수중 트레드밀이 포함된 점이 좋습니다. 2주차부터 수동 ROM 운동 시작하는 타임라인이 최근 가이드라인과 일치하네요.",
      is_expert: true,
      time: "5시간 전",
    },
    {
      id: "p4-c2",
      nickname: "슬개골수술보호자",
      content:
        "저희 강아지도 수술 후 재활 열심히 했더니 6개월 만에 완전 회복했어요. 재활이 진짜 중요하다는 걸 느꼈습니다.",
      is_expert: false,
      time: "3시간 전",
    },
    {
      id: "p4-c3",
      nickname: "정형외과전공",
      content:
        "Grade별 재활 강도 차이에 대한 서브그룹 분석이 있으면 더 유용할 것 같습니다. 좋은 연구 감사합니다.",
      is_expert: false,
      time: "1시간 전",
    },
  ],

  // p5: 1인 가구 반려동물 양육 실태
  p5: [
    {
      id: "p5-c1",
      nickname: "반려동물정책연구원",
      content:
        "1인 가구 비율이 계속 증가하는 만큼 시의적절한 연구입니다. 경제적 부담과 분리불안 문제가 주요 과제라는 결과가 정책 수립에 참고가 되겠네요.",
      is_expert: true,
      time: "4시간 전",
    },
    {
      id: "p5-c2",
      nickname: "혼자사는집사",
      content:
        "1인 가구 집사로서 너무 공감 가는 연구예요. 특히 갑자기 아플 때 반려동물 맡길 곳이 없다는 게 제일 큰 걱정이에요.",
      is_expert: false,
      time: "3시간 전",
    },
    {
      id: "p5-c3",
      nickname: "사회학석사",
      content: "응답자 중 펫시터 서비스 이용 경험이 43%라는 결과가 인상적이네요. 반려동물 돌봄 인프라 확충이 필요합니다.",
      is_expert: false,
      time: "2시간 전",
    },
    {
      id: "p5-c4",
      nickname: "독거노인케어",
      content:
        "독거 어르신의 반려동물 양육 실태도 조사해주시면 좋겠어요. 사회적 관심이 필요한 부분입니다.",
      is_expert: false,
      time: "1시간 전",
    },
  ],

  // ============================================================
  // EVENTS (ev1 ~ ev6)
  // ============================================================

  // ev1: 2026 서울 펫쇼
  ev1: [
    {
      id: "ev1-c1",
      nickname: "펫쇼매니아",
      content: "올해 부스 라인업 어떤가요? 작년에 사료 샘플 엄청 받았는데 올해도 기대됩니다!",
      is_expert: false,
      time: "4시간 전",
    },
    {
      id: "ev1-c2",
      nickname: "반려동물기자",
      content:
        "올해는 펫테크 기업들이 많이 참가한다고 하네요. AI 건강 모니터링 기기 체험 부스도 있대요.",
      is_expert: false,
      time: "3시간 전",
    },
    {
      id: "ev1-c3",
      nickname: "강아지동반입장",
      content: "반려동물 동반 입장 가능한가요? 사이즈 제한이 있는지 궁금해요.",
      is_expert: false,
      time: "2시간 전",
    },
    {
      id: "ev1-c4",
      nickname: "얼리버드",
      content: "사전 등록하면 입장료 할인 있어요! 홈페이지에서 미리 등록하세요.",
      is_expert: false,
      time: "1시간 전",
    },
    {
      id: "ev1-c5",
      nickname: "작년참가자",
      content: "주차장이 빨리 차니까 대중교통 추천해요. 주말은 특히 사람 많으니 평일 추천!",
      is_expert: false,
      time: "30분 전",
    },
  ],

  // ev2: 2026 고양 반려동물 문화축제
  ev2: [
    {
      id: "ev2-c1",
      nickname: "고양시민",
      content: "우리 동네에서 열리는 거라 너무 기대돼요! 킨텍스 쪽이면 교통도 편하고요.",
      is_expert: false,
      time: "5시간 전",
    },
    {
      id: "ev2-c2",
      nickname: "축제기대",
      content: "작년에 유기동물 입양 부스가 있었는데 올해도 있나요? 입양 생각하고 있거든요.",
      is_expert: false,
      time: "3시간 전",
    },
    {
      id: "ev2-c3",
      nickname: "고양이카페사장",
      content: "저희 카페에서도 부스 참여 예정이에요! 놀러 오세요 ㅎㅎ",
      is_expert: false,
      time: "2시간 전",
    },
    {
      id: "ev2-c4",
      nickname: "일산주민",
      content: "무료 건강검진 부스도 있으면 좋겠어요. 작년에 있었는데 줄이 엄청 길었어요.",
      is_expert: false,
      time: "1시간 전",
    },
  ],

  // ev3: 2026 반려동물 건강 세미나 (한양대)
  ev3: [
    {
      id: "ev3-c1",
      nickname: "한양대수의대",
      content: "저희 학교에서 열리는 세미나라 자랑스럽네요! 이번 주제가 예방의학 중심이라 실용적이에요.",
      is_expert: false,
      time: "4시간 전",
    },
    {
      id: "ev3-c2",
      nickname: "세미나참석예정",
      content: "사전 신청은 어디서 하나요? 정원 제한이 있으면 빨리 신청해야 할 것 같아서요.",
      is_expert: false,
      time: "3시간 전",
    },
    {
      id: "ev3-c3",
      nickname: "수의사지망생",
      content: "학생 할인 있나요? 수의학과 학생인데 꼭 참석하고 싶어요!",
      is_expert: false,
      time: "2시간 전",
    },
    {
      id: "ev3-c4",
      nickname: "온라인참여",
      content: "현장 참석이 어려운데 온라인 중계나 녹화본 공유 계획이 있을까요?",
      is_expert: false,
      time: "1시간 전",
    },
  ],

  // ev4: 2026 부산 펫 페스티벌
  ev4: [
    {
      id: "ev4-c1",
      nickname: "부산견주",
      content: "해운대에서 열리면 좋겠다! 작년 센텀 시티 행사장은 좀 좁았어요.",
      is_expert: false,
      time: "3시간 전",
    },
    {
      id: "ev4-c2",
      nickname: "서울에서부산",
      content: "KTX 타고 갈 예정인데 강아지 동반 가능한 숙소 추천해주세요!",
      is_expert: false,
      time: "2시간 전",
    },
    {
      id: "ev4-c3",
      nickname: "부산펫프렌즈",
      content: "올해는 반려견 수영 체험도 있대요! 해변가 옆이라 분위기 좋을 것 같아요.",
      is_expert: false,
      time: "1시간 전",
    },
    {
      id: "ev4-c4",
      nickname: "페스티벌러버",
      content: "가족 단위로 가기 좋은 행사인 것 같아요. 아이들 체험 프로그램도 있나요?",
      is_expert: false,
      time: "30분 전",
    },
  ],

  // ev5: 2026 세계 동물의 날
  ev5: [
    {
      id: "ev5-c1",
      nickname: "동물권활동가",
      content: "세계 동물의 날을 맞아 유기동물 문제에 대한 관심이 높아졌으면 좋겠어요. 입양을 고려해주세요!",
      is_expert: false,
      time: "5시간 전",
    },
    {
      id: "ev5-c2",
      nickname: "봉사활동",
      content: "이 날 보호소 봉사 갈 예정이에요. 같이 가실 분 계신가요?",
      is_expert: false,
      time: "3시간 전",
    },
    {
      id: "ev5-c3",
      nickname: "교육프로그램",
      content: "아이들에게 동물 존중을 가르칠 수 있는 교육 프로그램이 있으면 좋겠어요.",
      is_expert: false,
      time: "2시간 전",
    },
    {
      id: "ev5-c4",
      nickname: "인스타그래머",
      content: "SNS에서 #세계동물의날 해시태그 캠페인 참여해요! 우리 아이 사진 올리면서 동물 보호 메시지 전달해요.",
      is_expert: false,
      time: "1시간 전",
    },
  ],

  // ev6: 2026 크리스마스 펫 마켓
  ev6: [
    {
      id: "ev6-c1",
      nickname: "크리스마스덕후",
      content: "작년에 수제 간식이랑 강아지 옷 득템했어요! 올해도 기대됩니다!",
      is_expert: false,
      time: "4시간 전",
    },
    {
      id: "ev6-c2",
      nickname: "핸드메이드작가",
      content: "수제 반려동물 용품 판매자로 참여하고 싶은데 부스 신청은 어떻게 하나요?",
      is_expert: false,
      time: "3시간 전",
    },
    {
      id: "ev6-c3",
      nickname: "산타견",
      content: "산타 의상 입히고 가면 사진 찍어주는 부스 있나요? 작년에 있었는데 줄이 길어서 못 찍었어요ㅠ",
      is_expert: false,
      time: "2시간 전",
    },
    {
      id: "ev6-c4",
      nickname: "선물추천",
      content: "반려동물 크리스마스 선물 추천 코너도 있으면 좋겠어요. 뭘 사줘야 할지 항상 고민이에요.",
      is_expert: false,
      time: "1시간 전",
    },
    {
      id: "ev6-c5",
      nickname: "고양이산타",
      content: "고양이 용품도 많이 있으면 좋겠어요. 작년엔 강아지 용품 위주였거든요.",
      is_expert: false,
      time: "30분 전",
    },
  ],

  // ============================================================
  // 후기 (r1 ~ r5)
  // ============================================================
  r1: [
    { id: "r1-c1", nickname: "같은경험", content: "저도 야근 때 P.E.T 써봤는데 진짜 편했어요. 30분 안에 오시니까 안심이 됩니다", is_expert: false, time: "3시간 전" },
    { id: "r1-c2", nickname: "궁금이", content: "혹시 펫시터님이 오실 때 신분증 확인 같은 거 가능한가요?", is_expert: false, time: "2시간 전" },
    { id: "r1-c3", nickname: "P.E.T공식", content: "모든 파트너는 신원조회 완료된 분들이며, 방문 시 프로필 사진과 이름이 카카오톡으로 전달됩니다.", is_expert: true, time: "1시간 전" },
    { id: "r1-c4", nickname: "직장인집사", content: "야근 잦은 직장인에게 필수 서비스네요. 정기 구독 같은 건 없나요?", is_expert: false, time: "30분 전" },
  ],
  r2: [
    { id: "r2-c1", nickname: "수의사박", content: "SDMA 검사는 기존 혈액검사보다 평균 17개월 먼저 신부전을 감지합니다. 7세 이상 고양이는 연 2회 검사를 권합니다.", is_expert: true, time: "5시간 전" },
    { id: "r2-c2", nickname: "같은병명", content: "저희 고양이도 초기 신부전 진단 받았는데, 조기 발견이 정말 중요하더라고요. 다행이에요!", is_expert: false, time: "4시간 전" },
    { id: "r2-c3", nickname: "AI궁금", content: "AI 분석이 어떤 원리로 작동하는 건가요? 키워드 기반인가요?", is_expert: false, time: "2시간 전" },
  ],
  r3: [
    { id: "r3-c1", nickname: "푸들맘", content: "저도 위키 매일 봐요! 푸들 피부병 정보가 진짜 상세하더라고요", is_expert: false, time: "6시간 전" },
    { id: "r3-c2", nickname: "비숑파파", content: "비숑 정보도 있나요? 눈물자국 관리법이 궁금해요", is_expert: false, time: "4시간 전" },
    { id: "r3-c3", nickname: "초보집사2", content: "강아지 처음 키우는데 위키 덕분에 많이 배워가고 있어요 감사합니다!", is_expert: false, time: "2시간 전" },
  ],
  r4: [
    { id: "r4-c1", nickname: "출장많은편", content: "저도 출장이 잦은데 이 정도면 합리적인 가격 같아요. 3일 6회에 18만원이면 하루 6만원이니까", is_expert: false, time: "5시간 전" },
    { id: "r4-c2", nickname: "고양이호텔비교", content: "호텔 맡기면 하루 5만원인데 스트레스 받으니까, 방문 돌봄이 더 나은 것 같아요", is_expert: false, time: "3시간 전" },
    { id: "r4-c3", nickname: "다묘집사", content: "다묘 가정도 추가 비용 없이 가능한가요? 3마리인데...", is_expert: false, time: "1시간 전" },
  ],
  r5: [
    { id: "r5-c1", nickname: "새벽응급", content: "새벽에 24시 병원 찾기 진짜 힘든데 이 기능 너무 좋네요", is_expert: false, time: "4시간 전" },
    { id: "r5-c2", nickname: "일산주민", content: "고양시 일산 쪽 24시 병원도 나오나요? 여기 24시가 별로 없어서...", is_expert: false, time: "2시간 전" },
    { id: "r5-c3", nickname: "수의사김", content: "응급 상황에서 가장 중요한 건 빠른 판단과 이동입니다. 위치 기반 검색은 정말 유용한 기능이에요.", is_expert: true, time: "1시간 전" },
  ],

  // ============================================================
  // 가이드 (g1 ~ g5)
  // ============================================================
  g1: [
    { id: "g1-c1", nickname: "수의사이", content: "백합은 고양이에게 치명적인 독성 식물입니다. 꽃뿐만 아니라 잎, 줄기, 꽃가루, 물까지 전부 위험합니다. 반드시 치워주세요.", is_expert: true, time: "8시간 전" },
    { id: "g1-c2", nickname: "3년차집사", content: "화장실 고양이 수 +1개 진짜 중요해요. 하나만 놓으면 스트레스 받아서 실수하더라고요", is_expert: false, time: "6시간 전" },
    { id: "g1-c3", nickname: "초보중초보", content: "다음 주에 고양이 입양하는데 이 글 저장했습니다! 감사해요", is_expert: false, time: "3시간 전" },
    { id: "g1-c4", nickname: "캣맘", content: "저는 적응 기간에 너무 많이 만져서 고양이가 숨기만 했어요ㅠ 처음엔 기다려주는 게 최고입니다", is_expert: false, time: "1시간 전" },
  ],
  g2: [
    { id: "g2-c1", nickname: "훈련사박", content: "좋은 프로그램이네요. 추가 팁으로, 콩 장난감에 간식을 넣어두면 혼자 있는 시간이 긍정적 경험으로 바뀝니다.", is_expert: true, time: "7시간 전" },
    { id: "g2-c2", nickname: "분리불안극복", content: "저희 강아지는 3단계까지 8주 걸렸는데 지금은 혼자 4시간도 잘 있어요! 포기하지 마세요", is_expert: false, time: "5시간 전" },
    { id: "g2-c3", nickname: "직장인견주", content: "CCTV 추천 부탁드려요. 어떤 게 좋을까요?", is_expert: false, time: "2시간 전" },
  ],
  g3: [
    { id: "g3-c1", nickname: "응급수의사", content: "이물질 삼킨 경우 절대로 집에서 구토를 유발하지 마세요. 식도를 2차 손상시킬 수 있습니다. 즉시 병원으로 오세요.", is_expert: true, time: "6시간 전" },
    { id: "g3-c2", nickname: "경험자", content: "작년에 강아지가 초콜릿 먹어서 응급실 갔었는데, 이런 매뉴얼 미리 알았으면 덜 당황했을 거예요", is_expert: false, time: "4시간 전" },
    { id: "g3-c3", nickname: "저장했어요", content: "스크린샷 찍어서 냉장고에 붙여놨습니다. 감사합니다!", is_expert: false, time: "2시간 전" },
    { id: "g3-c4", nickname: "다견가정", content: "강아지 3마리 키우는데 응급 상황이 제일 무서워요. 이 글 가족 단톡방에 공유했습니다", is_expert: false, time: "1시간 전" },
  ],
  g4: [
    { id: "g4-c1", nickname: "신규회원", content: "AI 건강 분석이 무료인 거 맞나요? 대박이네요", is_expert: false, time: "5시간 전" },
    { id: "g4-c2", nickname: "포인트모으기", content: "출석 매일 하면 한 달에 300P 모이는 거죠? 나중에 포인트로 뭘 할 수 있나요?", is_expert: false, time: "3시간 전" },
    { id: "g4-c3", nickname: "카카오유저", content: "카카오 로그인 되니까 따로 가입 안 해도 되서 편해요", is_expert: false, time: "1시간 전" },
  ],
  g5: [
    { id: "g5-c1", nickname: "수의사최", content: "제설제 성분(염화칼슘)은 발바닥 화상뿐만 아니라, 핥았을 때 구토와 설사를 유발합니다. 산책 후 반드시 발을 씻겨주세요.", is_expert: true, time: "7시간 전" },
    { id: "g5-c2", nickname: "추위싫어", content: "소형견은 진짜 옷 필수예요. 치와와 키우는데 안 입히면 벌벌 떨어요", is_expert: false, time: "4시간 전" },
    { id: "g5-c3", nickname: "실내산책", content: "너무 추운 날은 실내에서 노즈워크 게임 해주면 운동 효과 있더라고요!", is_expert: false, time: "2시간 전" },
  ],
};

// ============================================================
// AI_OPINIONS - P.E.T AI 분석 코멘트
// ============================================================

export const AI_OPINIONS: Record<string, DemoComment> = {
  // QUESTIONS
  q1: {
    id: "q1-ai",
    nickname: "P.E.T AI",
    content:
      "고양이의 갑작스러운 식욕부진은 스트레스, 구강 질환, 소화기 문제 등 다양한 원인이 있을 수 있습니다. 24시간 이상 지속되면 간 리피도시스(지방간) 위험이 있으므로 병원 방문을 권장합니다. 사료 변경, 환경 변화, 식기 위치도 점검해보세요.",
    is_expert: false,
    is_ai: true,
    time: "방금",
  },
  q2: {
    id: "q2-ai",
    nickname: "P.E.T AI",
    content:
      "적정 산책 횟수는 견종, 나이, 건강 상태에 따라 달라집니다. 일반적으로 하루 2회, 소형견 15~20분, 중대형견 30~60분을 권장합니다. 산책은 운동뿐 아니라 정신적 자극과 사회화에도 중요하므로, 다양한 경로로 산책하는 것이 좋습니다.",
    is_expert: false,
    is_ai: true,
    time: "방금",
  },
  q3: {
    id: "q3-ai",
    nickname: "P.E.T AI",
    content:
      "고양이 스크래처 선택 시 안정성, 재질, 형태를 고려하세요. 수직형과 수평형을 함께 제공하면 좋습니다. 골판지, 사이잘 로프, 카펫 등 재질 선호도는 개체마다 다르니 여러 종류를 시도해보시고, 가구 근처에 배치하면 가구 긁기 행동을 줄일 수 있습니다.",
    is_expert: false,
    is_ai: true,
    time: "방금",
  },
  q4: {
    id: "q4-ai",
    nickname: "P.E.T AI",
    content:
      "강아지 귀 냄새는 외이염의 주요 증상입니다. 세균, 효모 감염, 귀진드기 등이 원인일 수 있으며, 귀가 접힌 견종에서 더 흔합니다. 전용 귀 세정제로 관리하되, 면봉 사용은 피하세요. 냄새가 심하거나 분비물이 있으면 수의사 진료를 받으시기 바랍니다.",
    is_expert: false,
    is_ai: true,
    time: "방금",
  },
  q5: {
    id: "q5-ai",
    nickname: "P.E.T AI",
    content:
      "고양이 중성화 적정 시기는 생후 5~6개월이며, 체중 1kg 이상이어야 안전합니다. 중성화는 생식기 질환 예방, 행동 안정화에 도움이 됩니다. 수술 전 혈액검사로 마취 안전성을 확인하고, 수술 후에는 수술복 착용과 안정이 중요합니다.",
    is_expert: false,
    is_ai: true,
    time: "방금",
  },
  q6: {
    id: "q6-ai",
    nickname: "P.E.T AI",
    content:
      "소형견 사료 선택 시 AAFCO 기준 충족 여부, 첫 번째 원재료가 육류인지, 단백질 25% 이상인지 확인하세요. 소형견은 대사율이 높아 고칼로리 사료가 필요하며, 알갱이 크기도 중요합니다. 알레르기가 있다면 단일 단백질 사료를 고려해보세요.",
    is_expert: false,
    is_ai: true,
    time: "방금",
  },
  q7: {
    id: "q7-ai",
    nickname: "P.E.T AI",
    content:
      "고양이가 흙을 먹는 행동은 이식증(pica)의 일종으로, 빈혈이나 미네랄 결핍이 원인일 수 있습니다. 화분 흙에는 비료 성분이 포함될 수 있어 중독 위험이 있으니 화분을 치워주시고, 혈액검사를 통해 원인을 확인하시길 권장합니다. 캣그라스를 대안으로 제공해보세요.",
    is_expert: false,
    is_ai: true,
    time: "방금",
  },
  q8: {
    id: "q8-ai",
    nickname: "P.E.T AI",
    content:
      "분리불안 교정의 핵심은 단계적 둔감화입니다. 짧은 외출부터 시작해 점차 시간을 늘리고, 외출 시 특별 간식을 제공하여 긍정적 연관을 만드세요. 외출/귀가 시 과도한 인사를 피하는 것도 도움이 됩니다. 심한 경우 수의 행동학 전문의 상담을 권합니다.",
    is_expert: false,
    is_ai: true,
    time: "방금",
  },
  q9: {
    id: "q9-ai",
    nickname: "P.E.T AI",
    content:
      "고양이 구내염 치료비는 단계에 따라 다릅니다. 내과적 치료(스케일링+약물) 20~40만 원, 부분 발치 50~100만 원, 전구 발치 100~200만 원 이상입니다. 반려동물 보험 가입을 고려해보시고, 정기 구강 검진으로 조기 발견이 중요합니다.",
    is_expert: false,
    is_ai: true,
    time: "방금",
  },
  q10: {
    id: "q10-ai",
    nickname: "P.E.T AI",
    content:
      "강아지 첫 목욕은 예방접종 완료 후(생후 12~14주)가 안전합니다. 미지근한 물과 강아지 전용 샴푸를 사용하고, 귀에 물이 들어가지 않도록 주의하세요. 첫 경험이 중요하므로 간식과 칭찬으로 긍정적 경험을 만들어주시고, 드라이를 꼼꼼히 해주세요.",
    is_expert: false,
    is_ai: true,
    time: "방금",
  },

  // INFO
  i1: {
    id: "i1-ai",
    nickname: "P.E.T AI",
    content:
      "강아지 예방접종은 생후 6~8주부터 시작하여 2~4주 간격으로 기본 접종(DHPPL)을 진행합니다. 광견병은 생후 3개월 이후 필수이며 법적 의무입니다. 연 1회 추가접종을 잊지 마시고, 켄넬코프 백신도 사회화 활동 전에 맞히시길 권합니다.",
    is_expert: false,
    is_ai: true,
    time: "방금",
  },
  i2: {
    id: "i2-ai",
    nickname: "P.E.T AI",
    content:
      "반려동물 보험 비교 시 면책기간, 보상한도, 갱신 조건, 기왕증 보상 여부를 확인하세요. 월 보험료뿐 아니라 연간 보상 한도와 자기부담금 비율도 중요합니다. 어린 나이에 가입할수록 보험료가 저렴하고 가입 조건이 유리합니다.",
    is_expert: false,
    is_ai: true,
    time: "방금",
  },
  i3: {
    id: "i3-ai",
    nickname: "P.E.T AI",
    content:
      "고양이에게 위험한 대표 음식은 양파, 마늘, 포도, 초콜릿, 자일리톨, 카페인, 알코올입니다. 특히 백합과 식물은 소량으로도 급성 신부전을 유발합니다. 대부분의 성묘는 유당불내증이므로 우유 대신 고양이 전용 우유를 급여하세요.",
    is_expert: false,
    is_ai: true,
    time: "방금",
  },
  i4: {
    id: "i4-ai",
    nickname: "P.E.T AI",
    content:
      "강아지 치석 예방의 핵심은 매일 양치질입니다. 강아지 전용 칫솔과 치약을 사용하시고, 양치가 어렵다면 덴탈 껌, 덴탈 워터를 보조적으로 활용하세요. 이미 치석이 쌓였다면 마취하 스케일링이 가장 효과적이며, 1~2년에 한 번 권장됩니다.",
    is_expert: false,
    is_ai: true,
    time: "방금",
  },
  i5: {
    id: "i5-ai",
    nickname: "P.E.T AI",
    content:
      "열사병 예방을 위해 한낮(11시~16시) 산책을 피하고, 아스팔트 온도를 손등으로 확인하세요. 항상 물을 지참하고, 단두종(불독, 퍼그 등)은 특히 주의가 필요합니다. 과도한 헐떡임, 침흘림, 비틀거림이 보이면 즉시 시원한 곳으로 이동 후 병원을 방문하세요.",
    is_expert: false,
    is_ai: true,
    time: "방금",
  },
  i6: {
    id: "i6-ai",
    nickname: "P.E.T AI",
    content:
      "고양이 모래는 벤토나이트(응고력 우수, 먼지 많음), 두부 모래(친환경, 변기 처리 가능), 카사바(응고력+저먼지), 크리스탈(흡수력 우수) 등이 있습니다. 모래 교체 시 기존 모래에 새 모래를 섞어 서서히 전환하면 화장실 기피를 예방할 수 있습니다.",
    is_expert: false,
    is_ai: true,
    time: "방금",
  },
  i7: {
    id: "i7-ai",
    nickname: "P.E.T AI",
    content:
      "2026년 기준 반려동물 등록은 내장형 칩 의무이며 미등록 시 과태료 최대 60만 원입니다. 가까운 동물병원이나 동물등록대행업체에서 등록 가능하며, 비용은 약 1만 원입니다. 고양이도 등록 대상이니 실내묘도 꼭 등록해주세요.",
    is_expert: false,
    is_ai: true,
    time: "방금",
  },
  i8: {
    id: "i8-ai",
    nickname: "P.E.T AI",
    content:
      "강아지 발바닥 갈라짐은 건조, 과도한 산책, 알레르기, 제설제 접촉 등이 원인입니다. 강아지 전용 발밤(paw balm)을 꾸준히 발라주시고, 산책 후 발을 씻기고 잘 말려주세요. 심하게 갈라지거나 피가 나면 수의사 진료를 받으시길 권합니다.",
    is_expert: false,
    is_ai: true,
    time: "방금",
  },
  i9: {
    id: "i9-ai",
    nickname: "P.E.T AI",
    content:
      "고양이 스트레스 주요 신호: 숨기, 식욕 변화, 과도한 그루밍, 공격성 증가, 화장실 외 배변, 과도한 울음, 털 세움, 동공 확대, 과민 반응, 활동량 감소입니다. 2주 이상 지속되면 수의사 상담을 받고, 페로몬 디퓨저(펠리웨이)도 도움이 됩니다.",
    is_expert: false,
    is_ai: true,
    time: "방금",
  },
  i10: {
    id: "i10-ai",
    nickname: "P.E.T AI",
    content:
      "견종별 성격 유형은 재미있는 참고 자료이지만, 같은 견종이라도 개체 차이가 큽니다. 성격은 유전적 요인과 함께 사회화 시기의 경험, 양육 환경에 크게 영향받습니다. 견종 특성을 이해하되, 자신의 반려견 개성을 존중하는 것이 가장 중요합니다.",
    is_expert: false,
    is_ai: true,
    time: "방금",
  },

  // DAILY
  d1: {
    id: "d1-ai",
    nickname: "P.E.T AI",
    content:
      "뽀삐 미용 너무 예쁘게 나왔네요! 미용 후에는 피부가 외부에 노출되므로 자외선 차단과 보습에 신경 써주세요. 여름철 서머컷은 시원해 보이지만 너무 짧으면 자외선 화상 위험이 있으니 적당한 길이를 유지하는 것이 좋습니다.",
    is_expert: false,
    is_ai: true,
    time: "방금",
  },
  d2: {
    id: "d2-ai",
    nickname: "P.E.T AI",
    content:
      "고양이 집사 1년차 축하드립니다! 첫 해는 서로 적응하는 시간이죠. 앞으로 매년 건강검진을 챙겨주시고, 고양이의 미묘한 행동 변화에 관심을 기울이면 더 깊은 유대감을 형성할 수 있습니다. 행복한 집사 생활 응원합니다!",
    is_expert: false,
    is_ai: true,
    time: "방금",
  },
  d3: {
    id: "d3-ai",
    nickname: "P.E.T AI",
    content:
      "한강 산책 즐거우셨겠어요! 야외 산책 시 진드기 예방약 투여 여부를 확인하시고, 풀밭에서 놀고 난 후에는 빗질하며 진드기를 확인해주세요. 반려견 동반 구역과 리드줄 규정도 미리 확인하시면 좋습니다.",
    is_expert: false,
    is_ai: true,
    time: "방금",
  },
  d4: {
    id: "d4-ai",
    nickname: "P.E.T AI",
    content:
      "고양이의 박스 사랑은 밀폐된 공간에서 안정감을 느끼는 본능에서 비롯됩니다. 박스는 스트레스 해소에도 도움이 되니 안전한 박스를 놀이 공간으로 활용해보세요. 다만 테이프나 스테이플러 등 삼킬 수 있는 부착물은 제거해주세요!",
    is_expert: false,
    is_ai: true,
    time: "방금",
  },
  d5: {
    id: "d5-ai",
    nickname: "P.E.T AI",
    content:
      "생일 축하해요! 강아지 케이크는 설탕, 초콜릿, 자일리톨이 없는 전용 제품을 선택해주세요. 고구마, 당근, 바나나 베이스가 안전합니다. 파티 소음이 강아지에게 스트레스가 될 수 있으니 편안한 분위기를 유지해주세요.",
    is_expert: false,
    is_ai: true,
    time: "방금",
  },
  d6: {
    id: "d6-ai",
    nickname: "P.E.T AI",
    content:
      "캣휠은 실내묘의 비만 예방과 스트레스 해소에 매우 효과적입니다! 하루 20~30분 정도 사용하면 충분한 운동량을 채울 수 있어요. 처음에는 간식으로 유도하시고, 안전을 위해 미끄럼 방지 패드가 있는 제품을 선택하세요.",
    is_expert: false,
    is_ai: true,
    time: "방금",
  },
  d7: {
    id: "d7-ai",
    nickname: "P.E.T AI",
    content:
      "강아지 수영 도전 대단해요! 처음에는 얕은 곳에서 시작하고 구명조끼를 꼭 착용시켜주세요. 수영 후에는 귀 안의 물기를 제거해 외이염을 예방하고, 깨끗한 물로 헹궈주는 것이 좋습니다. 모든 견종이 수영에 적합한 것은 아니니 개체 상태를 관찰하세요.",
    is_expert: false,
    is_ai: true,
    time: "방금",
  },
  d8: {
    id: "d8-ai",
    nickname: "P.E.T AI",
    content:
      "다묘 가정 5마리, 대단하세요! 다묘 가정의 핵심은 충분한 자원 배분입니다. 화장실은 '고양이 수 + 1'개, 밥그릇과 물그릇은 각자, 수직 공간과 개별 은신처를 확보해주세요. 서열 갈등이 보이면 분리 공간을 마련하는 것이 중요합니다.",
    is_expert: false,
    is_ai: true,
    time: "방금",
  },
  d9: {
    id: "d9-ai",
    nickname: "P.E.T AI",
    content:
      "사회성 훈련은 꾸준함이 중요합니다. 처음에는 조용한 시간대에 소수의 강아지와 접촉하고, 긍정적 경험을 쌓아가세요. 사회화 시기(3~14주)를 놓쳤더라도 천천히 접근하면 개선됩니다. 강아지가 불안해하면 억지로 밀어붙이지 마시고 거리를 유지해주세요.",
    is_expert: false,
    is_ai: true,
    time: "방금",
  },
  d10: {
    id: "d10-ai",
    nickname: "P.E.T AI",
    content:
      "고양이가 노트북 위에 앉는 건 따뜻한 표면을 좋아하는 습성과 집사의 관심을 끌려는 행동이 결합된 것입니다. 작업 전 충분히 놀아주고, 근처에 따뜻한 펫 히팅 패드나 담요를 놓아두면 자연스럽게 유도할 수 있어요!",
    is_expert: false,
    is_ai: true,
    time: "방금",
  },

  // EMERGENCY
  e1: {
    id: "e1-ai",
    nickname: "P.E.T AI",
    content:
      "응급 상황 시: 1) 가장 가까운 24시 동물병원에 전화로 증상 설명 2) 이동 중에도 전화 상담 유지 3) 반려동물을 안정시키고 안전하게 이동. 평소에 야간 응급병원 연락처와 위치를 미리 저장해두시길 강력히 권합니다.",
    is_expert: false,
    is_ai: true,
    time: "방금",
  },
  e2: {
    id: "e2-ai",
    nickname: "P.E.T AI",
    content:
      "긴급합니다! 1) 먹은 초콜릿 종류와 양, 강아지 체중을 기록하세요 2) 직접 구토를 유도하지 마세요 3) 즉시 동물병원으로 이동하세요. 다크 초콜릿이 가장 위험하며, 섭취 후 2시간 이내가 치료의 골든타임입니다.",
    is_expert: false,
    is_ai: true,
    time: "방금",
  },
  e3: {
    id: "e3-ai",
    nickname: "P.E.T AI",
    content:
      "긴급합니다! 1) 절대 실을 잡아당기거나 자르지 마세요 (장 천공 위험) 2) 먹이와 물을 주지 마세요 3) 즉시 동물병원으로 이동하세요. 선형 이물(실, 끈)은 장을 주름처럼 접히게 하여 매우 위험합니다. X-ray와 초음파 검사가 필요합니다.",
    is_expert: false,
    is_ai: true,
    time: "방금",
  },
  e4: {
    id: "e4-ai",
    nickname: "P.E.T AI",
    content:
      "강아지 절뚝거림 대응: 1) 활동을 제한하고 안정시키세요 2) 다리를 관찰하되 무리하게 만지지 마세요 3) 부종, 변형, 심한 통증이 있으면 즉시 병원으로 이동하세요. 슬개골 탈구, 십자인대 파열, 골절 등이 원인일 수 있으며 X-ray 촬영이 필요합니다.",
    is_expert: false,
    is_ai: true,
    time: "방금",
  },
  e5: {
    id: "e5-ai",
    nickname: "P.E.T AI",
    content:
      "긴급합니다! 1) 경련 중에는 입에 손을 넣지 마세요 2) 주변 위험한 물건을 치워주세요 3) 경련 시간을 측정하세요 4) 가능하면 영상을 촬영하세요 5) 5분 이상 지속되면 즉시 응급실로 이동하세요. 경련 영상은 수의사 진단에 매우 중요합니다.",
    is_expert: false,
    is_ai: true,
    time: "방금",
  },
  e6: {
    id: "e6-ai",
    nickname: "P.E.T AI",
    content:
      "긴급합니다! 1) 눈을 만지거나 압박하지 마세요 2) 엘리자베스 칼라를 씌워 눈 긁기를 방지하세요 3) 깨끗한 거즈로 살짝 덮어주세요 4) 즉시 동물병원으로 이동하세요. 눈 출혈은 외상, 녹내장, 혈액 응고 장애 등이 원인일 수 있습니다.",
    is_expert: false,
    is_ai: true,
    time: "방금",
  },
  e7: {
    id: "e7-ai",
    nickname: "P.E.T AI",
    content:
      "긴급합니다! 1) 먹이와 물을 주지 마세요 2) 고양이를 안정시키되 복부를 누르지 마세요 3) 즉시 병원에서 초음파 검사를 받으세요. 복부 통증은 장폐색, 요로결석, 복막염 등의 신호일 수 있으며, 수컷 고양이의 요도 폐색은 생명을 위협합니다.",
    is_expert: false,
    is_ai: true,
    time: "방금",
  },
  e8: {
    id: "e8-ai",
    nickname: "P.E.T AI",
    content:
      "벌 쏘임 대응: 1) 침이 보이면 납작한 물건으로 밀어서 제거 (핀셋 사용 금지) 2) 냉찜질로 부기를 줄이세요 3) 얼굴 부종, 호흡곤란, 구토가 나타나면 아나필락시스 위험이므로 즉시 병원으로 이동하세요. 다발성 쏘임도 위험합니다.",
    is_expert: false,
    is_ai: true,
    time: "방금",
  },
  e9: {
    id: "e9-ai",
    nickname: "P.E.T AI",
    content:
      "긴급합니다! 1) 고양이를 평평한 바닥에 조심히 눕히세요 2) 무리하게 움직이지 마세요 (척추 손상 위험) 3) 겉으로 멀쩡해 보여도 즉시 병원에서 X-ray와 초음파를 받으세요. 내부 장기 손상, 기흉, 골절이 있을 수 있습니다. 창문 방충망은 반드시 설치하세요.",
    is_expert: false,
    is_ai: true,
    time: "방금",
  },
  e10: {
    id: "e10-ai",
    nickname: "P.E.T AI",
    content:
      "세제 섭취 대응: 1) 절대 구토를 유도하지 마세요 (부식성 성분 시 식도 재손상) 2) 입 주변을 깨끗한 물로 닦아주세요 3) 세제 용기(성분표)를 가지고 즉시 병원으로 이동하세요. 성분에 따라 치료 방법이 달라지므로 용기를 반드시 지참하세요.",
    is_expert: false,
    is_ai: true,
    time: "방금",
  },

  // PAPERS
  p1: {
    id: "p1-ai",
    nickname: "P.E.T AI",
    content:
      "이 연구의 핵심 결론은 단계적 둔감화와 역조건형성을 병행한 행동학적 치료가 약물 단독 치료보다 장기적으로 더 높은 분리불안 개선 효과를 보인다는 것입니다. 보호자 교육과 일관된 훈련이 치료 성공의 핵심 요인으로 나타났습니다.",
    is_expert: false,
    is_ai: true,
    time: "방금",
  },
  p2: {
    id: "p2-ai",
    nickname: "P.E.T AI",
    content:
      "이 연구는 SDMA가 기존 크레아티닌 수치보다 고양이 만성 신부전을 더 조기에 감지할 수 있는 바이오마커임을 입증합니다. CKD IRIS Stage 1 단계에서도 유의미한 변화를 보여, 정기 검진에 SDMA 포함을 권장하는 근거가 됩니다.",
    is_expert: false,
    is_ai: true,
    time: "방금",
  },
  p3: {
    id: "p3-ai",
    nickname: "P.E.T AI",
    content:
      "이 연구는 AI 영상인식 기술로 반려동물의 행동을 실시간 분류하여 92%의 정확도를 달성했습니다. 펫캠과 연동하면 보호자 부재 시 행동 이상을 감지하고, 질병 조기 발견에도 활용할 수 있는 가능성을 제시합니다.",
    is_expert: false,
    is_ai: true,
    time: "방금",
  },
  p4: {
    id: "p4-ai",
    nickname: "P.E.T AI",
    content:
      "이 연구의 핵심은 슬개골 탈구 수술 후 체계적인 재활 프로토콜이 회복 속도와 재발률에 유의미한 영향을 미친다는 것입니다. 수중 트레드밀과 수동 ROM 운동을 포함한 재활 프로그램이 수술 단독보다 우수한 결과를 보였습니다.",
    is_expert: false,
    is_ai: true,
    time: "방금",
  },
  p5: {
    id: "p5-ai",
    nickname: "P.E.T AI",
    content:
      "이 연구는 증가하는 1인 가구의 반려동물 양육 실태를 조사하여, 경제적 부담과 분리불안 문제가 주요 과제임을 밝혔습니다. 펫시터 서비스 이용률 43%는 돌봄 인프라에 대한 수요를 보여주며, 관련 정책 수립의 근거 자료가 됩니다.",
    is_expert: false,
    is_ai: true,
    time: "방금",
  },

  // EVENTS
  ev1: {
    id: "ev1-ai",
    nickname: "P.E.T AI",
    content:
      "2026 서울 펫쇼는 다양한 반려동물 용품, 식품, 서비스를 한자리에서 만나볼 수 있는 국내 최대 규모의 반려동물 박람회입니다. 사전 등록 시 할인 혜택이 있으니 홈페이지를 확인하시고, 반려동물 동반 시 접종 증명서를 지참하세요.",
    is_expert: false,
    is_ai: true,
    time: "방금",
  },
  ev2: {
    id: "ev2-ai",
    nickname: "P.E.T AI",
    content:
      "고양 반려동물 문화축제는 지역 반려인들을 위한 문화 행사로, 입양 부스, 건강검진, 체험 프로그램 등 다양한 콘텐츠가 제공됩니다. 고양시 거주 반려인이라면 꼭 참석해보시길 추천합니다!",
    is_expert: false,
    is_ai: true,
    time: "방금",
  },
  ev3: {
    id: "ev3-ai",
    nickname: "P.E.T AI",
    content:
      "한양대학교 주최 반려동물 건강 세미나는 예방의학을 중심으로 실용적인 건강 관리 정보를 제공합니다. 수의학 전문가들의 강연을 통해 최신 건강 관리 트렌드를 배울 수 있는 좋은 기회입니다. 사전 신청을 서둘러주세요.",
    is_expert: false,
    is_ai: true,
    time: "방금",
  },
  ev4: {
    id: "ev4-ai",
    nickname: "P.E.T AI",
    content:
      "부산 펫 페스티벌은 해변 도시의 특색을 살린 반려동물 행사로, 반려견 수영 체험 등 독특한 프로그램이 특징입니다. 타 지역에서 방문하시는 분은 반려동물 동반 가능 숙소를 미리 예약하시는 것을 추천합니다.",
    is_expert: false,
    is_ai: true,
    time: "방금",
  },
  ev5: {
    id: "ev5-ai",
    nickname: "P.E.T AI",
    content:
      "세계 동물의 날은 동물 복지에 대한 인식을 높이는 국제 기념일입니다. 유기동물 입양, 보호소 봉사, SNS 캠페인 참여 등 다양한 방법으로 동물 보호에 동참할 수 있습니다. 작은 관심이 큰 변화를 만듭니다.",
    is_expert: false,
    is_ai: true,
    time: "방금",
  },
  ev6: {
    id: "ev6-ai",
    nickname: "P.E.T AI",
    content:
      "크리스마스 펫 마켓은 수제 간식, 수공예 용품, 반려동물 의류 등 특별한 선물을 찾을 수 있는 시즌 행사입니다. 반려동물과 함께 연말 분위기를 즐기며 특별한 추억을 만들어보세요. 산타 의상 촬영 부스도 인기입니다!",
    is_expert: false,
    is_ai: true,
    time: "방금",
  },

  // === 후기 ===
  r1: {
    id: "r1-ai", nickname: "P.E.T AI",
    content: "긴급 돌봄 서비스 이용 후기 감사합니다! P.E.T는 모든 파트너에게 3단계 검증(신원조회→면접→시범케어)을 진행하고 있어 안심하고 맡기실 수 있습니다. 실시간 사진 공유 기능은 보호자의 불안을 줄이는 핵심 서비스입니다.",
    is_expert: false, is_ai: true, time: "방금",
  },
  r2: {
    id: "r2-ai", nickname: "P.E.T AI",
    content: "AI 건강 분석으로 조기 발견하셨다니 정말 다행입니다! P.E.T AI는 22개 증상 카테고리와 300개 이상의 키워드를 기반으로 분석합니다. 다음(多飮) 증상은 신장 질환의 대표적인 초기 징후이므로, 7세 이상 고양이는 정기적으로 SDMA 검사를 받으시길 권합니다.",
    is_expert: false, is_ai: true, time: "방금",
  },
  r3: {
    id: "r3-ai", nickname: "P.E.T AI",
    content: "펫 위키는 28종(고양이 12종 + 강아지 16종)의 품종별 상세 정보를 제공합니다. 말티즈의 경우 슬개골 탈구(발병률 약 30%)가 가장 주의해야 할 질환이며, 체중 관리와 미끄러운 바닥 방지가 예방의 핵심입니다.",
    is_expert: false, is_ai: true, time: "방금",
  },
  r4: {
    id: "r4-ai", nickname: "P.E.T AI",
    content: "장기 돌봄 이용 상세 후기 감사합니다! 다묘 가정의 경우 각 고양이의 식사량과 화장실 상태를 개별 기록하는 것이 중요합니다. P.E.T 파트너는 방문 시마다 체크리스트를 작성하여 보호자에게 공유합니다.",
    is_expert: false, is_ai: true, time: "방금",
  },
  r5: {
    id: "r5-ai", nickname: "P.E.T AI",
    content: "위치 기반 동물병원 검색 기능은 GPS를 활용하여 가장 가까운 병원을 자동으로 찾아드립니다. 현재 전국 55개 이상의 동물병원 정보를 제공하고 있으며, 24시 응급 병원도 포함되어 있습니다.",
    is_expert: false, is_ai: true, time: "방금",
  },

  // === 가이드 ===
  g1: {
    id: "g1-ai", nickname: "P.E.T AI",
    content: "처음 고양이를 맞이하는 초보 집사분들께 핵심 정보를 잘 정리해주셨습니다. 특히 적응 기간 중에는 작은 방 하나에서 시작하여 점차 활동 범위를 넓혀주는 것이 스트레스를 줄이는 데 효과적입니다. 독성 식물(백합, 포인세티아 등)은 반드시 치워주세요.",
    is_expert: false, is_ai: true, time: "방금",
  },
  g2: {
    id: "g2-ai", nickname: "P.E.T AI",
    content: "분리불안 극복은 인내심이 필요한 과정입니다. 핵심은 '혼자 있어도 안전하다'는 긍정적 경험을 반복하는 것입니다. 외출 전후 과도한 인사는 오히려 불안을 강화할 수 있으니, 담담하게 나갔다 돌아오는 것이 좋습니다.",
    is_expert: false, is_ai: true, time: "방금",
  },
  g3: {
    id: "g3-ai", nickname: "P.E.T AI",
    content: "응급상황 대처 매뉴얼은 모든 반려인이 숙지해야 할 필수 정보입니다. 가장 중요한 원칙은 '당황하지 말고, 상태를 기록하고, 즉시 병원에 연락'하는 것입니다. 가까운 24시 동물병원 연락처를 미리 저장해두세요. P.E.T에서 위치 기반으로 검색하실 수 있습니다.",
    is_expert: false, is_ai: true, time: "방금",
  },
  g4: {
    id: "g4-ai", nickname: "P.E.T AI",
    content: "P.E.T 서비스를 최대한 활용하려면 반려동물 프로필을 상세하게 등록해주세요. 품종, 나이, 기저질환, 알러지 정보가 있으면 AI 분석과 펫시터 매칭 시 더 정확한 서비스를 받으실 수 있습니다.",
    is_expert: false, is_ai: true, time: "방금",
  },
  g5: {
    id: "g5-ai", nickname: "P.E.T AI",
    content: "겨울철 산책 시 제설제(염화칼슘) 접촉은 발바닥 화상과 구토를 유발할 수 있습니다. 산책 후 반드시 미지근한 물로 발을 씻겨주시고, 발바닥 보호 밤(balm)을 발라주세요. 영하 10도 이하에서는 실내 운동으로 대체하는 것을 권합니다.",
    is_expert: false, is_ai: true, time: "방금",
  },
};
