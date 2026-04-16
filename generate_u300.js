const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType, PageBreak, Header, Footer, PageNumber, LevelFormat } = require("docx");
const fs = require("fs");
const path = require("path");

const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };
const cellM = { top: 60, bottom: 60, left: 100, right: 100 };

function h1(t) { return new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 300, after: 200 }, children: [new TextRun({ text: t, bold: true, size: 28, font: "Arial" })] }); }
function h2(t) { return new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 120 }, children: [new TextRun({ text: t, bold: true, size: 24, font: "Arial" })] }); }
function p(t, o = {}) { return new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: t, size: 20, font: "Arial", ...o })] }); }
function pb(t) { return p(t, { bold: true }); }
function mc(t, w, s) {
  const c = { borders, width: { size: w, type: WidthType.DXA }, margins: cellM, children: [new Paragraph({ children: [new TextRun({ text: t, size: 18, font: "Arial", color: s ? "FFFFFF" : "333333", bold: !!s })] })] };
  if (s) c.shading = { fill: s, type: ShadingType.CLEAR };
  return new TableCell(c);
}

const doc = new Document({
  styles: { default: { document: { run: { font: "Arial", size: 20 } } } },
  sections: [{
    properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
    headers: { default: new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "P.E.T 펫에토 사업계획서", size: 16, color: "888888" })] })] }) },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "- ", size: 16 }), new TextRun({ children: [PageNumber.CURRENT], size: 16 }), new TextRun({ text: " -", size: 16 })] })] }) },
    children: [
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: "2026 학생 창업유망팀 300+ 사업계획서", bold: true, size: 32, font: "Arial" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 400 }, children: [new TextRun({ text: "P.E.T 펫에토 — 반려동물 긴급 돌봄 O2O 컨시어지 플랫폼", size: 24, color: "FF6B35" })] }),

      h1("0. 사업 아이템 개요"),
      pb("□ 팀명: P.E.T 펫에토 (Pet Ever Total)"),
      p(""),
      pb("□ 아이템 개요 (한줄소개)"),
      p("1~2인 가구 반려인의 긴급 돌봄 공백을 AI 건강 분석과 검증된 펫시터 매칭으로 해결하는 O2O 컨시어지 플랫폼"),
      p(""),
      pb("□ 창업 목표"),
      p("반려동물 긴급 돌봄 시장의 No.1 플랫폼이 되어, 모든 반려인이 안심하고 아이를 맡길 수 있는 세상을 만듭니다."),

      new Paragraph({ children: [new PageBreak()] }),

      h1("1. 문제 인식"),
      h2("□ 창업 배경 및 개발동기"),
      p("대한민국 반려동물 양육 가구는 602만(2025년 기준)을 넘어섰으며, 이 중 1~2인 가구가 절반 이상을 차지합니다. 이들은 갑작스러운 야근, 출장, 질병 시 반려동물을 안전하게 맡길 곳이 없어 극심한 스트레스를 경험합니다."),
      p(""),
      p("대표 권대욱은 한양대학교 대학원 창업학과 재학 중 직접 반려동물(고양이 2마리)을 키우면서 이 '돌봄 공백'을 체감했습니다. 기존 펫시터 앱(도그메이트, 펫플래닛 등)은 예약 중심으로 설계되어 '오늘 당장' 필요한 긴급 돌봄에는 부적합했고, 펫시터의 신원 검증도 불충분하다는 문제를 발견했습니다."),
      p(""),
      p("이에 '10분 안에 검증된 펫시터를 연결하는 긴급 특화 플랫폼'이라는 콘셉트로 P.E.T를 개발하게 되었습니다."),

      p(""),
      h2("□ 창업아이템의 목적 및 필요성"),
      pb("[문제]"), p("1~2인 가구 반려인이 갑작스러운 외출 시 믿을 수 있는 돌봄 서비스를 찾기 어려움"),
      pb("[원인]"), p("기존 서비스는 예약 중심(24시간+ 소요), 펫시터 검증 부족, 긴급 대응 불가"),
      pb("[해결]"), p("P.E.T는 3단계 검증(신원조회→면접→시범케어)을 통과한 파트너를 카카오톡으로 10분 내 매칭"),
      pb("[차별점]"), p("AI 건강 분석(22개 카테고리, 300+ 키워드), 펫-위키(28종 상세 정보), GPS 기반 동물병원 자동 안내"),

      p(""),
      h2("□ 목표시장 분석"),
      pb("TAM(전체 시장)"), p("국내 반려동물 시장 약 10조원, 서비스(돌봄/미용/호텔/훈련) 시장 약 2조원"),
      pb("SAM(접근 가능 시장)"), p("1~2인 가구 반려인 약 250만 가구 중 서울/수도권 150만 가구, 연간 긴급 돌봄 수요 약 60만 가구 = 약 3,000억원"),
      pb("SOM(초기 목표)"), p("고양시+파주+서울 서북권 15만 가구, 초기 1년 500명 고객, 연 매출 7,500만원"),
      p(""),
      p("경쟁사: 도그메이트(15만건+, 인수), 펫플래닛(규제샌드박스), 와요(훈련 특화) → 모두 '예약 중심'. P.E.T는 '긴급 특화 + AI + 커뮤니티'로 차별화"),

      new Paragraph({ children: [new PageBreak()] }),

      h1("2. 실현가능성"),
      h2("□ 사업화 전략"),
      pb("[MVP 현황] pet-eto.vercel.app"),
      p("Next.js + Supabase + Vercel로 웹 플랫폼 개발 완료"),
      p("- AI 증상 분석 엔진 (22개 카테고리, 300+ 키워드, API 비용 0원)"),
      p("- 펫-위키 28종 품종별 상세 정보 (질병 비용, 초보 가이드)"),
      p("- 커뮤니티 (질문/후기/논문/행사 등 9개 카테고리)"),
      p("- 카카오톡 채널 연동, 구글/카카오 소셜 로그인"),
      p("- Google Sheets 자동 거래 기록 연동"),
      p("- 관리자 대시보드 (유저/글/사업분석/위키/페이지 편집)"),
      p(""),
      pb("[로드맵]"),
      p("Phase 1 (1~3개월): 파트너 5명 확보 → 카카오톡 수동 매칭 → 첫 50건"),
      p("Phase 2 (3~6개월): PG 결제 연동 → 자동 매칭 → 월 150건"),
      p("Phase 3 (6~12개월): 서비스 지역 확대 (고양→서울) → PWA 앱 → 월 500건"),
      p("Phase 4 (12개월~): 정기 구독 → 커머스 연계 → 시리즈A 준비"),

      p(""),
      h2("□ 시장분석 및 경쟁력 확보 방안"),
      pb("P.E.T vs 경쟁사 비교"),
      new Table({
        width: { size: 9026, type: WidthType.DXA },
        columnWidths: [1800, 2400, 2400, 2426],
        rows: [
          new TableRow({ children: [mc("항목", 1800, "FF6B35"), mc("도그메이트", 2400, "FF6B35"), mc("펫플래닛", 2400, "FF6B35"), mc("P.E.T", 2426, "FF6B35")] }),
          new TableRow({ children: [mc("핵심", 1800), mc("방문돌봄 예약", 2400), mc("장단기 돌봄", 2400), mc("긴급 10분 매칭", 2426)] }),
          new TableRow({ children: [mc("AI 분석", 1800), mc("없음", 2400), mc("없음", 2400), mc("22개 카테고리", 2426)] }),
          new TableRow({ children: [mc("위키", 1800), mc("없음", 2400), mc("없음", 2400), mc("28종 상세", 2426)] }),
          new TableRow({ children: [mc("커뮤니티", 1800), mc("없음", 2400), mc("없음", 2400), mc("9개 카테고리", 2426)] }),
          new TableRow({ children: [mc("초기 투자", 1800), mc("수억원", 2400), mc("수억원", 2400), mc("0원 (무재고)", 2426)] }),
        ]
      }),
      p(""),
      pb("차별화 전략"),
      p("1. AI 기반 사전 상담 — 경쟁사에 없는 독자 기능"),
      p("2. 콘텐츠 → 트래픽 → 전환 플라이휠"),
      p("3. 무재고 Asset-light 모델 — 재고/물류 비용 0원"),
      p("4. 지역 밀착형 신뢰 — 대표가 직접 면접한 파트너"),

      new Paragraph({ children: [new PageBreak()] }),

      h1("3. 성장 전략"),
      h2("□ 시장진입 및 성과창출 전략"),
      pb("[시장 진입]"),
      p("1. 고양시/일산 집중 → 당근마켓, 인스타그램, 네이버 카페로 0원 마케팅"),
      p("2. 선착순 10명 무료 체험 → 후기 확보 → 입소문 마케팅"),
      p("3. 지역 동물병원/미용실 제휴 → 상호 고객 추천"),
      p(""),
      pb("[수익 모델]"),
      p("- 중개 수수료 21.5% (파트너 75%, PG 3.5%)"),
      p("- 제휴 광고 (동물병원/미용실 우선 노출)"),
      p("- 프리미엄 구독 (월정액 산책+긴급 패키지)"),
      p("- 데이터 기반 커머스 (맞춤형 사료/용품 추천)"),
      p(""),
      pb("[매출 시뮬레이션]"),
      p("1개월차: 10건 x 3만원 = 30만원 (P.E.T 수익 6.5만원)"),
      p("3개월차: 50건 x 3.5만원 = 175만원 (수익 37.6만원)"),
      p("6개월차: 150건 x 4만원 = 600만원 (수익 129만원)"),
      p("12개월차: 500건 x 4.5만원 = 2,250만원 (수익 484만원)"),

      p(""),
      h2("□ 자금조달 계획"),
      pb("[초기 비용] 약 50만원 (배상책임보험 + 도메인)"),
      pb("[사업자등록] 2026년 4월 중 완료 예정"),
      pb("[향후 자금 조달]"),
      p("1단계: 자비 + 정부 지원사업 (U300, NEOs 등)"),
      p("2단계: 엔젤투자 / 액셀러레이터 (월 매출 100만원 달성 시)"),
      p("3단계: 시리즈A (월 매출 1,000만원 달성 시)"),

      new Paragraph({ children: [new PageBreak()] }),

      h1("4. 팀 구성"),
      h2("□ 창업자의 역량"),
      pb("권대욱 (대표)"),
      p("- 한양대학교 대학원 창업학과 재학"),
      p("- 반려동물관리사 1급 취득 중"),
      p("- 반려동물(고양이 2마리) 직접 양육 경험"),
      p("- P.E.T 웹 플랫폼 기획 및 운영 (AI 포함 전 기능 직접 기획)"),
      p("- 기업가정신: 린스타트업 방식으로 MVP를 1주 만에 개발/배포하고, 실제 고객 피드백을 즉시 반영하는 빠른 실행력 보유"),

      p(""),
      h2("□ 팀 구성원 소개 및 역량"),
      p(""),
      p("※ 팀원은 최소 2명 이상 추가 필요 (총 3~5인 필수)", { color: "DC2626", bold: true }),
      p(""),
      pb("팀원 1: (이름) / (학교/학과) / 역할: 마케팅/운영"),
      p("- 담당업무: (작성 필요)"),
      p("- 보유 역량: (작성 필요)"),
      p(""),
      pb("팀원 2: (이름) / (학교/학과) / 역할: 디자인/UX"),
      p("- 담당업무: (작성 필요)"),
      p("- 보유 역량: (작성 필요)"),
    ]
  }]
});

const outPath = path.join("C:", "Users", "dnlsd", "OneDrive", "바탕 화면", "U300", "사업계획서_완료됨.docx");
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outPath, buffer);
  console.log("Created:", outPath, "(" + buffer.length + " bytes)");
});
