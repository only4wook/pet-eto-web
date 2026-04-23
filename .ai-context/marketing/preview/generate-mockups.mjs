// 펫에토 마케팅 디자인 시안 PPTX 생성기
// 실행: node .ai-context/marketing/preview/generate-mockups.mjs
// 출력: .ai-context/marketing/preview/peteto-marketing-mockups.pptx

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const path = require("path");
const Module = require("module");

const GLOBAL_MODULES = "C:/Users/dnlsd/AppData/Roaming/npm/node_modules";
Module.globalPaths.push(GLOBAL_MODULES);

const pptxgen = require(path.join(GLOBAL_MODULES, "pptxgenjs"));

// ═══════════════════ 브랜드 시스템 컬러 ═══════════════════
const C = {
  terra:    "D97757",   // 주조색
  ink:      "1A1A1A",   // 본문
  cream:    "F5F0E8",   // 배경
  teal:     "0B5D5D",   // 의료 신뢰
  sage:     "7A9B76",   // 건강 지표
  white:    "FFFFFF",
  gray:     "6B7280",
  lightGray:"E5E5E5",
  terraLight: "F5E1D6",
};

const FONT_HEAD = "맑은 고딕";
const FONT_BODY = "맑은 고딕";
const FONT_MONO = "Consolas";
const FONT_SERIF = "Georgia";

// ═══════════════════ 프레젠테이션 ═══════════════════
const pres = new pptxgen();
pres.layout = "LAYOUT_16x9"; // 10" x 5.625"
pres.author = "P.E.T 펫에토";
pres.title = "펫에토 마케팅 디자인 시안 — 대욱님 프리뷰";

// ─────────────── 공통 헬퍼 ───────────────
function addPageFooter(slide, pageNum, total, sectionLabel = "") {
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 5.45, w: 10, h: 0.175,
    fill: { color: C.terra }, line: { color: C.terra, width: 0 },
  });
  slide.addText("P.E.T 펫에토 · 마케팅 시안", {
    x: 0.4, y: 5.3, w: 4, h: 0.18,
    fontSize: 9, fontFace: FONT_BODY, color: C.gray, bold: true,
  });
  if (sectionLabel) {
    slide.addText(sectionLabel, {
      x: 4, y: 5.3, w: 3, h: 0.18,
      fontSize: 9, fontFace: FONT_BODY, color: C.gray, align: "center",
    });
  }
  slide.addText(`${pageNum} / ${total}`, {
    x: 8.6, y: 5.3, w: 1, h: 0.18,
    fontSize: 9, fontFace: FONT_BODY, color: C.gray, align: "right",
  });
}

function sectionHeader(slide, badge, title, desc) {
  // 오렌지 뱃지
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.5, y: 0.4, w: 1.8, h: 0.32,
    fill: { color: C.terraLight }, line: { color: C.terra, width: 1 },
    rectRadius: 0.16,
  });
  slide.addText(badge, {
    x: 0.5, y: 0.4, w: 1.8, h: 0.32,
    fontSize: 10, fontFace: FONT_HEAD, color: C.terra,
    bold: true, align: "center", valign: "middle", margin: 0,
  });
  slide.addText(title, {
    x: 0.5, y: 0.78, w: 9, h: 0.55,
    fontSize: 26, fontFace: FONT_HEAD, color: C.ink, bold: true,
  });
  if (desc) {
    slide.addText(desc, {
      x: 0.5, y: 1.35, w: 9, h: 0.35,
      fontSize: 13, fontFace: FONT_BODY, color: C.gray,
    });
  }
}

// 명함 스케일: PPT에서 90mm × 55mm → 약 3.5" × 2.14"
const CARD_W = 3.5;
const CARD_H = 2.14;

const TOTAL_PAGES = 28; // 전체 페이지 예상치

// ═══════════════════════════════════════════════════════════
// SLIDE 1: COVER
// ═══════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.cream };

  // 상단 주황 바
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.18,
    fill: { color: C.terra }, line: { color: C.terra, width: 0 },
  });

  s.addText("P.E.T · 펫에토", {
    x: 0.8, y: 1.2, w: 8, h: 0.5,
    fontSize: 22, fontFace: FONT_HEAD, color: C.terra, bold: true,
    charSpacing: 2,
  });

  s.addText("마케팅 디자인 시안 프리뷰", {
    x: 0.8, y: 1.9, w: 8, h: 0.95,
    fontSize: 44, fontFace: FONT_HEAD, color: C.ink, bold: true,
  });

  s.addShape(pres.shapes.LINE, {
    x: 0.8, y: 3.0, w: 1.2, h: 0,
    line: { color: C.terra, width: 3 },
  });

  s.addText([
    { text: "• 명함 5종 (대표·영업·수의사·디자이너·제휴)\n", options: { bold: false } },
    { text: "• 리플릿 5컨셉 × 3타겟 (수의사/병원/펫샵)\n", options: { bold: false } },
    { text: "• 영업킷 3레벨 (미니·스탠다드·VIP)\n", options: { bold: false } },
    { text: "• 스티커 5종 (뱃지·QR·로고·캠페인·개인맞춤)\n", options: { bold: false } },
    { text: "• 인쇄소 브리프 & 예산", options: { bold: false } },
  ], {
    x: 0.8, y: 3.2, w: 8.4, h: 1.8,
    fontSize: 15, fontFace: FONT_BODY, color: C.ink,
    lineSpacingMultiple: 1.4,
  });

  s.addText("2026-04-23 · 권은환 대표 프리뷰용", {
    x: 0.8, y: 5.05, w: 6, h: 0.25,
    fontSize: 10, fontFace: FONT_BODY, color: C.gray, charSpacing: 2,
  });
}

// ═══════════════════════════════════════════════════════════
// SLIDE 2: BRAND SYSTEM — 컬러 팔레트 + 서체
// ═══════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  sectionHeader(s, "BRAND SYSTEM", "브랜드 시스템", "모든 인쇄물이 공유하는 단일 기준");

  // 컬러 5개 팔레트
  const palette = [
    { name: "Terra Warm", hex: C.terra, role: "주조색 · 로고", textColor: C.white },
    { name: "Ink Deep",   hex: C.ink,   role: "본문 · 헤드",   textColor: C.white },
    { name: "Cream Paper",hex: C.cream, role: "배경 · 종이",   textColor: C.ink },
    { name: "Teal Clinical", hex: C.teal, role: "의료 신뢰",  textColor: C.white },
    { name: "Sage Health",   hex: C.sage, role: "건강 배지",  textColor: C.white },
  ];
  palette.forEach((p, i) => {
    const x = 0.5 + i * 1.85;
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.95, w: 1.75, h: 1.6,
      fill: { color: p.hex }, line: { color: C.lightGray, width: 0.5 },
    });
    s.addText(p.name, {
      x, y: 2.1, w: 1.75, h: 0.3,
      fontSize: 12, fontFace: FONT_HEAD, color: p.textColor, bold: true,
      align: "center", margin: 0,
    });
    s.addText(`#${p.hex}`, {
      x, y: 2.45, w: 1.75, h: 0.25,
      fontSize: 10, fontFace: FONT_MONO, color: p.textColor,
      align: "center", margin: 0,
    });
    s.addText(p.role, {
      x, y: 3.15, w: 1.75, h: 0.3,
      fontSize: 10, fontFace: FONT_BODY, color: p.textColor,
      align: "center", margin: 0,
    });
  });

  // 비율 규칙
  s.addText("Ratio Rule", {
    x: 0.5, y: 3.75, w: 3, h: 0.3,
    fontSize: 12, fontFace: FONT_HEAD, color: C.terra, bold: true, charSpacing: 2,
  });
  s.addText("60% Cream / 25% Ink / 10% Terra / 5% Teal 또는 Sage", {
    x: 0.5, y: 4.05, w: 9, h: 0.3,
    fontSize: 13, fontFace: FONT_BODY, color: C.ink,
  });

  // 서체
  s.addText("Typography", {
    x: 0.5, y: 4.5, w: 3, h: 0.3,
    fontSize: 12, fontFace: FONT_HEAD, color: C.terra, bold: true, charSpacing: 2,
  });
  s.addText([
    { text: "한글: Pretendard (Bold 700 / Regular 400 / SemiBold 600)\n", options: {} },
    { text: "영문: Söhne 또는 Inter (Semibold / Regular / Italic)", options: {} },
  ], {
    x: 0.5, y: 4.8, w: 9, h: 0.5,
    fontSize: 12, fontFace: FONT_BODY, color: C.ink, lineSpacingMultiple: 1.3,
  });

  addPageFooter(s, 2, TOTAL_PAGES, "브랜드 시스템");
}

// ═══════════════════════════════════════════════════════════
// 명함 렌더링 헬퍼
// ═══════════════════════════════════════════════════════════
function drawCardFrame(slide, x, y, bg, borderColor = null) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w: CARD_W, h: CARD_H,
    fill: { color: bg },
    line: { color: borderColor || C.lightGray, width: 0.5 },
    shadow: { type: "outer", color: "000000", blur: 8, offset: 2, angle: 90, opacity: 0.1 },
  });
}

function drawQrPlaceholder(slide, x, y, size = 0.7) {
  // 체크무늬 QR 대체
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w: size, h: size,
    fill: { color: C.ink }, line: { color: C.ink, width: 0 },
  });
  // 흰 칸 몇 개 찍어 QR 분위기
  const spots = [
    { dx: 0.04, dy: 0.04, dw: 0.18, dh: 0.18 },
    { dx: size - 0.22, dy: 0.04, dw: 0.18, dh: 0.18 },
    { dx: 0.04, dy: size - 0.22, dw: 0.18, dh: 0.18 },
    { dx: 0.35, dy: 0.3, dw: 0.08, dh: 0.08 },
    { dx: 0.28, dy: 0.45, dw: 0.06, dh: 0.06 },
  ];
  spots.forEach((sp) => {
    slide.addShape(pres.shapes.RECTANGLE, {
      x: x + sp.dx, y: y + sp.dy, w: sp.dw, h: sp.dh,
      fill: { color: C.white }, line: { color: C.white, width: 0 },
    });
  });
}

// ═══════════════════════════════════════════════════════════
// SLIDE 3: 명함 컨셉 1 — Apple Minimalist
// ═══════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  sectionHeader(s, "BUSINESS CARD 01 / 05", "Apple Minimalist", "Jony Ive 유산 · 극도의 미니멀 · 촉감이 디자인의 일부");

  // 앞면
  const frontX = 0.7, frontY = 2.1;
  drawCardFrame(s, frontX, frontY, C.cream);
  s.addText("앞면 (Front)", { x: frontX, y: frontY - 0.3, w: CARD_W, h: 0.2, fontSize: 9, fontFace: FONT_BODY, color: C.gray, align: "center" });
  s.addText("pet-eto", { x: frontX + 0.2, y: frontY + 0.15, w: 1.5, h: 0.25, fontSize: 11, fontFace: FONT_HEAD, color: C.ink, bold: true });
  s.addText("권은환", { x: frontX + CARD_W - 1.3, y: frontY + 0.7, w: 1.2, h: 0.3, fontSize: 17, fontFace: FONT_HEAD, color: C.ink, bold: true, align: "right", margin: 0 });
  s.addText("대표", { x: frontX + CARD_W - 1.3, y: frontY + 1.0, w: 1.2, h: 0.2, fontSize: 9, fontFace: FONT_BODY, color: C.gray, align: "right", margin: 0 });
  s.addText("only4wook@gmail.com    010-XXXX-XXXX", { x: frontX + 0.2, y: frontY + CARD_H - 0.35, w: CARD_W - 0.4, h: 0.2, fontSize: 7, fontFace: FONT_BODY, color: C.ink, charSpacing: 3 });

  // 뒷면
  const backX = 5.8, backY = 2.1;
  drawCardFrame(s, backX, backY, C.cream);
  s.addText("뒷면 (Back)", { x: backX, y: backY - 0.3, w: CARD_W, h: 0.2, fontSize: 9, fontFace: FONT_BODY, color: C.gray, align: "center" });
  drawQrPlaceholder(s, backX + (CARD_W - 0.7) / 2, backY + 0.55);
  s.addText("pet-eto.vercel.app", { x: backX, y: backY + CARD_H - 0.35, w: CARD_W, h: 0.2, fontSize: 7, fontFace: FONT_BODY, color: C.ink, align: "center" });

  // 사양 패널
  const specY = 4.6;
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: specY, w: 9, h: 0.7, fill: { color: C.cream }, line: { color: C.cream, width: 0 } });
  s.addText([
    { text: "종이: ", options: { bold: true, color: C.terra } }, { text: "몽블랑 260g  ", options: {} },
    { text: "| 후가공: ", options: { bold: true, color: C.terra } }, { text: "로고만 엠보싱  ", options: {} },
    { text: "| 인쇄: ", options: { bold: true, color: C.terra } }, { text: "양면 1도  ", options: {} },
    { text: "| 단가: ", options: { bold: true, color: C.terra } }, { text: "200장 8~12만원", options: {} },
  ], { x: 0.6, y: specY + 0.1, w: 8.8, h: 0.25, fontSize: 10, fontFace: FONT_BODY, color: C.ink });
  s.addText("💡 수의사에게 주는 느낌: \"디자인에 투자하는 스타트업 = 디테일을 안다\"", {
    x: 0.6, y: specY + 0.38, w: 8.8, h: 0.25,
    fontSize: 10, fontFace: FONT_BODY, color: C.gray,
  });

  addPageFooter(s, 3, TOTAL_PAGES, "명함 · Apple Minimalist");
}

// ═══════════════════════════════════════════════════════════
// SLIDE 4: 명함 컨셉 2 — Google Warm Functional
// ═══════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  sectionHeader(s, "BUSINESS CARD 02 / 05", "Google Warm Functional", "Material You · 따뜻한 기능주의 · 3초 안에 이해되는 컬러");

  // 앞면 (상단 테라 블록 + 하단 크림)
  const frontX = 0.7, frontY = 2.1;
  drawCardFrame(s, frontX, frontY, C.cream);
  s.addShape(pres.shapes.RECTANGLE, {
    x: frontX, y: frontY, w: CARD_W, h: CARD_H * 0.33,
    fill: { color: C.terra }, line: { color: C.terra, width: 0 },
  });
  s.addText("pet-eto", { x: frontX + 0.2, y: frontY + 0.2, w: 2, h: 0.28, fontSize: 14, fontFace: FONT_HEAD, color: C.cream, bold: true });
  s.addText("권은환  Eunhwan Kwon", { x: frontX + 0.2, y: frontY + 0.95, w: CARD_W - 0.4, h: 0.22, fontSize: 12, fontFace: FONT_HEAD, color: C.ink, bold: true });
  s.addText("대표 · Founder", { x: frontX + 0.2, y: frontY + 1.18, w: CARD_W - 0.4, h: 0.2, fontSize: 9, fontFace: FONT_BODY, color: C.gray });
  s.addText("📧 only4wook@gmail.com", { x: frontX + 0.2, y: frontY + 1.48, w: CARD_W - 0.4, h: 0.2, fontSize: 8, fontFace: FONT_BODY, color: C.ink });
  s.addText("📱 010-XXXX-XXXX    🌐 pet-eto.vercel.app", { x: frontX + 0.2, y: frontY + 1.68, w: CARD_W - 0.4, h: 0.2, fontSize: 8, fontFace: FONT_BODY, color: C.ink });

  // 뒷면 (풀 테라)
  const backX = 5.8, backY = 2.1;
  drawCardFrame(s, backX, backY, C.terra);
  s.addText("앞면 (Front)", { x: frontX, y: frontY - 0.3, w: CARD_W, h: 0.2, fontSize: 9, fontFace: FONT_BODY, color: C.gray, align: "center" });
  s.addText("뒷면 (Back)", { x: backX, y: backY - 0.3, w: CARD_W, h: 0.2, fontSize: 9, fontFace: FONT_BODY, color: C.gray, align: "center" });
  s.addText("펫 건강 AI, 1분 체험", { x: backX, y: backY + 0.4, w: CARD_W, h: 0.25, fontSize: 11, fontFace: FONT_HEAD, color: C.cream, bold: true, align: "center" });
  drawQrPlaceholder(s, backX + (CARD_W - 0.7) / 2, backY + 0.85);

  // 사양 패널
  const specY = 4.6;
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: specY, w: 9, h: 0.7, fill: { color: C.cream }, line: { color: C.cream, width: 0 } });
  s.addText([
    { text: "종이: ", options: { bold: true, color: C.terra } }, { text: "펄 아트지 250g  ", options: {} },
    { text: "| 후가공: ", options: { bold: true, color: C.terra } }, { text: "없음  ", options: {} },
    { text: "| 인쇄: ", options: { bold: true, color: C.terra } }, { text: "양면 4도 풀컬러  ", options: {} },
    { text: "| 단가: ", options: { bold: true, color: C.terra } }, { text: "200장 5~8만원", options: {} },
  ], { x: 0.6, y: specY + 0.1, w: 8.8, h: 0.25, fontSize: 10, fontFace: FONT_BODY, color: C.ink });
  s.addText("💡 수의사에게 주는 느낌: \"밝고 자신있네. 요즘 스타트업답다. 스캔해봐야지.\"", {
    x: 0.6, y: specY + 0.38, w: 8.8, h: 0.25, fontSize: 10, fontFace: FONT_BODY, color: C.gray,
  });

  addPageFooter(s, 4, TOTAL_PAGES, "명함 · Google Warm");
}

// ═══════════════════════════════════════════════════════════
// SLIDE 5: 명함 컨셉 3 — Anthropic Editorial
// ═══════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  sectionHeader(s, "BUSINESS CARD 03 / 05", "Anthropic Editorial", "Jenny Wen 감성 · 연구소의 명함 · 세리프 · 레터프레스");

  const frontX = 0.7, frontY = 2.1;
  drawCardFrame(s, frontX, frontY, C.cream);
  s.addText("앞면 (Front)", { x: frontX, y: frontY - 0.3, w: CARD_W, h: 0.2, fontSize: 9, fontFace: FONT_BODY, color: C.gray, align: "center" });
  s.addText("pet-eto", { x: frontX + 0.2, y: frontY + 0.18, w: 1.5, h: 0.25, fontSize: 11, fontFace: FONT_HEAD, color: C.ink, bold: true });
  s.addShape(pres.shapes.LINE, { x: frontX + 0.2, y: frontY + 0.42, w: 0.7, h: 0, line: { color: C.terra, width: 1.5 } });
  s.addText("권 은 환", { x: frontX + 0.3, y: frontY + 0.6, w: CARD_W - 0.4, h: 0.35, fontSize: 18, fontFace: FONT_SERIF, color: C.ink, italic: true, charSpacing: 8 });
  s.addText("Eunhwan Kwon", { x: frontX + 0.3, y: frontY + 0.98, w: CARD_W - 0.4, h: 0.25, fontSize: 10, fontFace: FONT_SERIF, color: C.gray, italic: true });
  s.addText("Founder & CEO", { x: frontX + 0.3, y: frontY + 1.25, w: CARD_W - 0.4, h: 0.2, fontSize: 8, fontFace: FONT_BODY, color: C.ink });
  s.addShape(pres.shapes.LINE, { x: frontX + 0.2, y: frontY + CARD_H - 0.55, w: CARD_W - 0.4, h: 0, line: { color: C.ink, width: 0.3 } });
  s.addText("only4wook@gmail.com    010-XXXX-XXXX", { x: frontX + 0.2, y: frontY + CARD_H - 0.35, w: CARD_W - 0.4, h: 0.2, fontSize: 7, fontFace: FONT_BODY, color: C.ink });

  const backX = 5.8, backY = 2.1;
  drawCardFrame(s, backX, backY, C.cream);
  s.addText("뒷면 (Back)", { x: backX, y: backY - 0.3, w: CARD_W, h: 0.2, fontSize: 9, fontFace: FONT_BODY, color: C.gray, align: "center" });
  s.addText('"흩어진 펫 정보를\n수의사의 언어로 통합합니다."', {
    x: backX + 0.2, y: backY + 0.2, w: CARD_W - 0.4, h: 0.7, fontSize: 10, fontFace: FONT_SERIF, color: C.ink, italic: true, lineSpacingMultiple: 1.3,
  });
  s.addText("— pet-eto manifesto", { x: backX + 0.2, y: backY + 0.95, w: CARD_W - 0.4, h: 0.2, fontSize: 8, fontFace: FONT_SERIF, color: C.gray, italic: true });
  drawQrPlaceholder(s, backX + CARD_W - 0.75, backY + CARD_H - 0.85, 0.55);
  s.addShape(pres.shapes.LINE, { x: backX + 0.2, y: backY + CARD_H - 0.3, w: CARD_W - 0.4, h: 0, line: { color: C.ink, width: 0.3 } });
  s.addText("Scan to experience · pet-eto.app", { x: backX + 0.2, y: backY + CARD_H - 0.22, w: CARD_W - 0.4, h: 0.2, fontSize: 7, fontFace: FONT_BODY, color: C.ink });

  const specY = 4.6;
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: specY, w: 9, h: 0.7, fill: { color: C.cream }, line: { color: C.cream, width: 0 } });
  s.addText([
    { text: "종이: ", options: { bold: true, color: C.terra } }, { text: "빈티지 크림 250g  ", options: {} },
    { text: "| 후가공: ", options: { bold: true, color: C.terra } }, { text: "레터프레스 (압인)  ", options: {} },
    { text: "| 인쇄: ", options: { bold: true, color: C.terra } }, { text: "양면 2도  ", options: {} },
    { text: "| 단가: ", options: { bold: true, color: C.terra } }, { text: "200장 15~25만원", options: {} },
  ], { x: 0.6, y: specY + 0.1, w: 8.8, h: 0.25, fontSize: 10, fontFace: FONT_BODY, color: C.ink });
  s.addText("💡 수의사에게 주는 느낌: \"이 회사, 책 같다. 깊이 있어 보여. 믿음이 간다.\"", {
    x: 0.6, y: specY + 0.38, w: 8.8, h: 0.25, fontSize: 10, fontFace: FONT_BODY, color: C.gray,
  });

  addPageFooter(s, 5, TOTAL_PAGES, "명함 · Anthropic Editorial");
}

// ═══════════════════════════════════════════════════════════
// SLIDE 6: 명함 컨셉 4 — Vet Chart (★추천)
// ═══════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  sectionHeader(s, "BUSINESS CARD 04 / 05 ★", "Vet Chart — 한국적 의료 에디토리얼", "진료 차트 메타포 · 수의사 타겟에 가장 효과적");

  const frontX = 0.7, frontY = 2.1;
  drawCardFrame(s, frontX, frontY, C.cream, C.ink);
  s.addText("앞면 (Front)", { x: frontX, y: frontY - 0.3, w: CARD_W, h: 0.2, fontSize: 9, fontFace: FONT_BODY, color: C.gray, align: "center" });
  // 차트 헤더
  s.addShape(pres.shapes.RECTANGLE, { x: frontX + 0.1, y: frontY + 0.1, w: CARD_W - 0.2, h: 0.25, fill: { color: C.terra }, line: { color: C.terra, width: 0 } });
  s.addText("PET-eto  │  진료 차트 No. 2026-001", {
    x: frontX + 0.15, y: frontY + 0.12, w: CARD_W - 0.3, h: 0.22,
    fontSize: 8, fontFace: FONT_MONO, color: C.cream, bold: true, margin: 0,
  });
  // 차트 행
  const rows = [
    { label: "NAME", value: "권은환  Eunhwan Kwon" },
    { label: "ROLE", value: "대표  Founder" },
    { label: "CONTACT", value: "only4wook@gmail.com  010-XXXX-XXXX" },
    { label: "ISSUED", value: "2026.04.23  │  pet-eto" },
  ];
  rows.forEach((r, i) => {
    const ry = frontY + 0.45 + i * 0.32;
    s.addShape(pres.shapes.LINE, { x: frontX + 0.1, y: ry + 0.28, w: CARD_W - 0.2, h: 0, line: { color: C.ink, width: 0.3, transparency: 70 } });
    s.addShape(pres.shapes.LINE, { x: frontX + 0.85, y: ry, w: 0, h: 0.3, line: { color: C.ink, width: 0.3, transparency: 70 } });
    s.addText(r.label, { x: frontX + 0.15, y: ry, w: 0.7, h: 0.28, fontSize: 7, fontFace: FONT_MONO, color: C.gray, bold: true, valign: "middle", margin: 0 });
    s.addText(r.value, { x: frontX + 0.9, y: ry, w: CARD_W - 1.0, h: 0.28, fontSize: 8.5, fontFace: FONT_BODY, color: C.ink, valign: "middle", margin: 0 });
  });

  // 뒷면
  const backX = 5.8, backY = 2.1;
  drawCardFrame(s, backX, backY, C.cream, C.ink);
  s.addText("뒷면 (Back)", { x: backX, y: backY - 0.3, w: CARD_W, h: 0.2, fontSize: 9, fontFace: FONT_BODY, color: C.gray, align: "center" });
  s.addText("처방 Rx", { x: backX + 0.2, y: backY + 0.2, w: CARD_W - 0.4, h: 0.3, fontSize: 16, fontFace: FONT_SERIF, color: C.terra, italic: true, bold: true });
  s.addText("반려동물 건강 AI 체크\n1분 스캔 처방합니다", { x: backX + 0.2, y: backY + 0.55, w: CARD_W - 0.4, h: 0.5, fontSize: 10, fontFace: FONT_BODY, color: C.ink, lineSpacingMultiple: 1.3 });
  drawQrPlaceholder(s, backX + (CARD_W - 0.7) / 2, backY + 1.1);
  s.addText("Signature ______________", { x: backX + 0.2, y: backY + CARD_H - 0.3, w: CARD_W - 0.4, h: 0.2, fontSize: 8, fontFace: FONT_SERIF, color: C.gray, italic: true });

  const specY = 4.6;
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: specY, w: 9, h: 0.7, fill: { color: C.terraLight }, line: { color: C.terra, width: 1 } });
  s.addText([
    { text: "★ 추천 ★  ", options: { bold: true, color: C.terra } },
    { text: "종이: 아르떼 210g  | 후가공: 없음  | 인쇄: 양면 2도  | 단가: 200장 6~10만원", options: {} },
  ], { x: 0.6, y: specY + 0.1, w: 8.8, h: 0.25, fontSize: 10, fontFace: FONT_BODY, color: C.ink });
  s.addText("💡 수의사에게 주는 느낌: \"재밌다. 우리를 이해하고 있네. 대화 소재가 됨.\"", {
    x: 0.6, y: specY + 0.38, w: 8.8, h: 0.25, fontSize: 10, fontFace: FONT_BODY, color: C.gray,
  });

  addPageFooter(s, 6, TOTAL_PAGES, "명함 · Vet Chart ★");
}

// ═══════════════════════════════════════════════════════════
// SLIDE 7: 명함 컨셉 5 — Premium Tactile
// ═══════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  sectionHeader(s, "BUSINESS CARD 05 / 05", "Premium Tactile", "한국 공예 감성 · 촉감 최대화 · VIP 영업용");

  // 앞면 (극단 미니멀)
  const frontX = 0.7, frontY = 2.1;
  drawCardFrame(s, frontX, frontY, C.cream);
  s.addText("앞면 (Front)", { x: frontX, y: frontY - 0.3, w: CARD_W, h: 0.2, fontSize: 9, fontFace: FONT_BODY, color: C.gray, align: "center" });
  s.addText("pet-eto", { x: frontX, y: frontY + 0.7, w: CARD_W, h: 0.4, fontSize: 22, fontFace: FONT_HEAD, color: C.terra, bold: true, align: "center" });
  s.addShape(pres.shapes.LINE, { x: frontX + CARD_W / 2 - 0.5, y: frontY + 1.2, w: 1.0, h: 0, line: { color: C.gray, width: 0.5, transparency: 60 } });
  s.addText("(Terra Warm 박 처리 + Blind Deboss)", { x: frontX, y: frontY + 1.6, w: CARD_W, h: 0.2, fontSize: 7, fontFace: FONT_BODY, color: C.gray, italic: true, align: "center" });

  // 뒷면
  const backX = 5.8, backY = 2.1;
  drawCardFrame(s, backX, backY, C.cream);
  s.addText("뒷면 (Back)", { x: backX, y: backY - 0.3, w: CARD_W, h: 0.2, fontSize: 9, fontFace: FONT_BODY, color: C.gray, align: "center" });
  s.addText("권은환  │  Eunhwan Kwon", { x: backX + 0.2, y: backY + 0.2, w: CARD_W - 0.4, h: 0.25, fontSize: 13, fontFace: FONT_SERIF, color: C.ink, bold: true });
  s.addText("대표 · Founder", { x: backX + 0.2, y: backY + 0.48, w: CARD_W - 0.4, h: 0.2, fontSize: 9, fontFace: FONT_BODY, color: C.gray });
  s.addText("only4wook@gmail.com", { x: backX + 0.2, y: backY + 0.9, w: CARD_W - 0.4, h: 0.2, fontSize: 8, fontFace: FONT_BODY, color: C.ink });
  s.addText("010-XXXX-XXXX", { x: backX + 0.2, y: backY + 1.1, w: CARD_W - 0.4, h: 0.2, fontSize: 8, fontFace: FONT_BODY, color: C.ink });
  s.addText("pet-eto.vercel.app", { x: backX + 0.2, y: backY + 1.3, w: CARD_W - 0.4, h: 0.2, fontSize: 8, fontFace: FONT_BODY, color: C.ink });
  drawQrPlaceholder(s, backX + CARD_W - 0.75, backY + CARD_H - 0.7, 0.55);

  const specY = 4.6;
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: specY, w: 9, h: 0.7, fill: { color: C.cream }, line: { color: C.cream, width: 0 } });
  s.addText([
    { text: "종이: ", options: { bold: true, color: C.terra } }, { text: "반누보 내추럴 300g  ", options: {} },
    { text: "| 후가공: ", options: { bold: true, color: C.terra } }, { text: "Terra 박 + Emboss  ", options: {} },
    { text: "| 단가: ", options: { bold: true, color: C.terra } }, { text: "200장 25~40만원", options: {} },
  ], { x: 0.6, y: specY + 0.1, w: 8.8, h: 0.25, fontSize: 10, fontFace: FONT_BODY, color: C.ink });
  s.addText("💡 수의사에게 주는 느낌: \"이 명함 받는 것만으로도 기분 좋다. 이 사람 만나야겠다.\"", {
    x: 0.6, y: specY + 0.38, w: 8.8, h: 0.25, fontSize: 10, fontFace: FONT_BODY, color: C.gray,
  });

  addPageFooter(s, 7, TOTAL_PAGES, "명함 · Premium Tactile");
}

// ═══════════════════════════════════════════════════════════
// SLIDE 8: 명함 5종 비교표
// ═══════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  sectionHeader(s, "COMPARISON", "명함 5종 비교", "예산·난이도·효과별 비교");

  const rows = [
    ["#", "컨셉",              "종이",            "후가공",        "예산(200장)", "영업 효과", "타겟"],
    ["1", "Apple Minimalist", "몽블랑 260g",     "엠보싱",       "8~12만원",   "★★★★☆",  "VC"],
    ["2", "Google Warm",      "펄 아트지 250g",  "없음",         "5~8만원",    "★★★★☆",  "일반"],
    ["3", "Anthropic Editorial", "빈티지 크림 250g","레터프레스",  "15~25만원",  "★★★★★",  "수의사"],
    ["4", "Vet Chart ★",      "아르떼 210g",     "없음",         "6~10만원",   "★★★★★",  "수의사·병원"],
    ["5", "Premium Tactile",  "반누보 300g",     "Terra 박+Emboss","25~40만원",  "★★★★★",  "VIP·원장"],
  ];

  const colX = [0.5, 0.95, 2.4, 4.0, 5.5, 7.0, 8.3];
  const colW = [0.45, 1.45, 1.6, 1.5, 1.5, 1.3, 1.2];
  const tableY = 1.9;
  const rowH = 0.5;

  rows.forEach((row, ri) => {
    row.forEach((cell, ci) => {
      const isHeader = ri === 0;
      const isRec = ri === 4; // Vet Chart 추천
      const bg = isHeader ? C.ink : (isRec ? C.terraLight : (ri % 2 === 0 ? C.cream : C.white));
      const color = isHeader ? C.white : (isRec ? C.terra : C.ink);
      s.addShape(pres.shapes.RECTANGLE, {
        x: colX[ci], y: tableY + ri * rowH, w: colW[ci], h: rowH,
        fill: { color: bg }, line: { color: C.lightGray, width: 0.5 },
      });
      s.addText(cell, {
        x: colX[ci], y: tableY + ri * rowH, w: colW[ci], h: rowH,
        fontSize: isHeader ? 10 : 10,
        fontFace: FONT_BODY, color, bold: isHeader || isRec,
        align: "center", valign: "middle", margin: 0,
      });
    });
  });

  // 추천 전략
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 4.85, w: 9, h: 0.5, fill: { color: C.teal }, line: { color: C.teal, width: 0 } });
  s.addText("🎯 추천: Concept 4 (Vet Chart) 300장 + Concept 2 (Google Warm) 200장 = 총 15~20만원  ·  수의사용 + 일반용 2종 커버", {
    x: 0.6, y: 4.85, w: 8.8, h: 0.5,
    fontSize: 11, fontFace: FONT_BODY, color: C.white, bold: true,
    valign: "middle", margin: 0,
  });

  addPageFooter(s, 8, TOTAL_PAGES, "명함 비교");
}

// ═══════════════════════════════════════════════════════════
// SLIDE 9~11: 리플릿 컨셉 (대표 3개만 상세, 나머지는 요약)
// ═══════════════════════════════════════════════════════════
const LEAF_W = 2.8;
const LEAF_H = 3.9;

function drawLeafletFrame(slide, x, y, bg) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w: LEAF_W, h: LEAF_H,
    fill: { color: bg }, line: { color: C.lightGray, width: 0.5 },
    shadow: { type: "outer", color: "000000", blur: 6, offset: 2, angle: 90, opacity: 0.1 },
  });
}

// SLIDE 9: 리플릿 Concept 1 — Editorial One-Pager (앞뒤 + 3타겟 카피)
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  sectionHeader(s, "LEAFLET 01 / 05", "Editorial One-Pager", "A5 낱장 · 잡지 한 페이지 느낌 · 세리프 헤드라인");

  // A타겟(수의사) 앞면
  const x1 = 0.5, y1 = 1.95;
  drawLeafletFrame(s, x1, y1, C.cream);
  s.addText("ISSUE 01 · 2026", { x: x1 + 0.15, y: y1 + 0.15, w: LEAF_W - 0.3, h: 0.2, fontSize: 7, fontFace: FONT_MONO, color: C.gray });
  s.addText("수의사의 답은\n어디에 있는가?", { x: x1 + 0.15, y: y1 + 0.45, w: LEAF_W - 0.3, h: 0.9, fontSize: 16, fontFace: FONT_SERIF, color: C.ink, bold: true, lineSpacingMultiple: 1.2 });
  s.addShape(pres.shapes.LINE, { x: x1 + 0.15, y: y1 + 1.4, w: 0.5, h: 0, line: { color: C.terra, width: 1.5 } });
  s.addShape(pres.shapes.RECTANGLE, { x: x1 + 0.3, y: y1 + 1.65, w: LEAF_W - 0.6, h: 1.3, fill: { color: C.terraLight }, line: { color: C.terra, width: 0.5 } });
  s.addText("[일러스트]", { x: x1 + 0.3, y: y1 + 1.65, w: LEAF_W - 0.6, h: 1.3, fontSize: 10, fontFace: FONT_BODY, color: C.terra, italic: true, align: "center", valign: "middle" });
  s.addText("반려인이 묻고\nAI가 분류하고\n수의사가 답한다.", { x: x1 + 0.15, y: y1 + 3.1, w: LEAF_W - 0.3, h: 0.55, fontSize: 9, fontFace: FONT_BODY, color: C.ink, lineSpacingMultiple: 1.3 });
  s.addText("pet-eto", { x: x1 + 0.15, y: y1 + LEAF_H - 0.3, w: LEAF_W - 0.3, h: 0.2, fontSize: 9, fontFace: FONT_HEAD, color: C.terra, bold: true });
  s.addText("수의사용 · 앞면", { x: x1, y: y1 + LEAF_H + 0.05, w: LEAF_W, h: 0.2, fontSize: 9, fontFace: FONT_BODY, color: C.gray, align: "center" });

  // A타겟 뒷면
  const x2 = 3.6, y2 = 1.95;
  drawLeafletFrame(s, x2, y2, C.cream);
  s.addText("3 REASONS", { x: x2 + 0.15, y: y2 + 0.15, w: LEAF_W - 0.3, h: 0.2, fontSize: 8, fontFace: FONT_MONO, color: C.gray, bold: true });
  const reasons = [
    ["01", "증빙된 경력", "면허·학교·전공 인증"],
    ["02", "답변이 자산",  "포인트·현금화·개인 브랜딩"],
    ["03", "AI가 선별",   "유의미한 케이스만 큐레이션"],
  ];
  reasons.forEach((r, i) => {
    const ry = y2 + 0.5 + i * 0.9;
    s.addText(r[0], { x: x2 + 0.15, y: ry, w: 0.4, h: 0.25, fontSize: 14, fontFace: FONT_HEAD, color: C.terra, bold: true });
    s.addShape(pres.shapes.LINE, { x: x2 + 0.5, y: ry + 0.12, w: LEAF_W - 0.65, h: 0, line: { color: C.ink, width: 0.3 } });
    s.addText(r[1], { x: x2 + 0.15, y: ry + 0.3, w: LEAF_W - 0.3, h: 0.25, fontSize: 10, fontFace: FONT_HEAD, color: C.ink, bold: true });
    s.addText(r[2], { x: x2 + 0.15, y: ry + 0.55, w: LEAF_W - 0.3, h: 0.3, fontSize: 8, fontFace: FONT_BODY, color: C.gray });
  });
  drawQrPlaceholder(s, x2 + LEAF_W - 0.9, y2 + LEAF_H - 0.85, 0.6);
  s.addText("지금 등록", { x: x2 + 0.15, y: y2 + LEAF_H - 0.7, w: 1.6, h: 0.25, fontSize: 10, fontFace: FONT_HEAD, color: C.ink, bold: true });
  s.addText("pet-eto.vercel.app", { x: x2 + 0.15, y: y2 + LEAF_H - 0.45, w: 1.6, h: 0.2, fontSize: 7, fontFace: FONT_BODY, color: C.gray });
  s.addText("수의사용 · 뒷면", { x: x2, y: y2 + LEAF_H + 0.05, w: LEAF_W, h: 0.2, fontSize: 9, fontFace: FONT_BODY, color: C.gray, align: "center" });

  // 타겟 B, C 카피 요약 (오른쪽 세로)
  const sideX = 6.85;
  s.addShape(pres.shapes.RECTANGLE, { x: sideX, y: y2, w: 2.7, h: LEAF_H, fill: { color: C.cream }, line: { color: C.cream, width: 0 } });
  s.addText("3타겟 변형 카피", { x: sideX + 0.15, y: y2 + 0.15, w: 2.4, h: 0.25, fontSize: 10, fontFace: FONT_HEAD, color: C.terra, bold: true });

  s.addText("🩺 수의사용", { x: sideX + 0.15, y: y2 + 0.5, w: 2.4, h: 0.2, fontSize: 9, fontFace: FONT_HEAD, color: C.ink, bold: true });
  s.addText("\"수의사의 답은 어디에 있는가?\"", { x: sideX + 0.15, y: y2 + 0.72, w: 2.4, h: 0.5, fontSize: 8, fontFace: FONT_BODY, color: C.gray, italic: true, lineSpacingMultiple: 1.2 });

  s.addText("🏥 원장용", { x: sideX + 0.15, y: y2 + 1.45, w: 2.4, h: 0.2, fontSize: 9, fontFace: FONT_HEAD, color: C.ink, bold: true });
  s.addText("\"병원이 머무는 곳,\n환자가 모이는 곳\"", { x: sideX + 0.15, y: y2 + 1.67, w: 2.4, h: 0.5, fontSize: 8, fontFace: FONT_BODY, color: C.gray, italic: true, lineSpacingMultiple: 1.2 });

  s.addText("🛒 펫샵용", { x: sideX + 0.15, y: y2 + 2.4, w: 2.4, h: 0.2, fontSize: 9, fontFace: FONT_HEAD, color: C.ink, bold: true });
  s.addText("\"믿고 데려가는\n반려동물\"", { x: sideX + 0.15, y: y2 + 2.62, w: 2.4, h: 0.5, fontSize: 8, fontFace: FONT_BODY, color: C.gray, italic: true, lineSpacingMultiple: 1.2 });

  s.addText("판형 A5 낱장 · 스노우화이트 200g · 양면 4도 · 500장 10~15만원",
    { x: sideX + 0.15, y: y2 + LEAF_H - 0.6, w: 2.4, h: 0.5, fontSize: 8, fontFace: FONT_BODY, color: C.ink, lineSpacingMultiple: 1.3 });

  addPageFooter(s, 9, TOTAL_PAGES, "리플릿 · Editorial One-Pager");
}

// SLIDE 10: 리플릿 Concept 2 — Prescription Pad
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  sectionHeader(s, "LEAFLET 02 / 05", "Prescription Pad (처방전)", "Vet Chart 명함과 연결되는 시리즈성 · 의료 차트 메타포");

  // 처방전 앞면 미니
  const x1 = 0.5, y1 = 1.95;
  drawLeafletFrame(s, x1, y1, C.cream);
  s.addShape(pres.shapes.RECTANGLE, { x: x1 + 0.1, y: y1 + 0.15, w: LEAF_W - 0.2, h: 0.3, fill: { color: C.ink }, line: { color: C.ink, width: 0 } });
  s.addText("pet-eto  │  PRESCRIPTION No. ○○○○○○○", { x: x1 + 0.15, y: y1 + 0.15, w: LEAF_W - 0.3, h: 0.3, fontSize: 7, fontFace: FONT_MONO, color: C.cream, bold: true, valign: "middle", margin: 0 });

  const rxRows = [
    { label: "PATIENT",   value: "[타겟명 수기감]" },
    { label: "DIAGNOSIS", value: "[현재 고민]" },
    { label: "Rx",        value: "펫에토 처방\n\n[솔루션 3줄]" },
  ];
  let ry = y1 + 0.6;
  rxRows.forEach((r, i) => {
    const h = i === 2 ? 1.3 : 0.5;
    s.addShape(pres.shapes.LINE, { x: x1 + 0.15, y: ry + h - 0.02, w: LEAF_W - 0.3, h: 0, line: { color: C.ink, width: 0.3, transparency: 70 } });
    s.addShape(pres.shapes.LINE, { x: x1 + 0.85, y: ry, w: 0, h: h, line: { color: C.ink, width: 0.3, transparency: 70 } });
    s.addText(r.label, { x: x1 + 0.15, y: ry, w: 0.65, h: h, fontSize: 7, fontFace: FONT_MONO, color: C.gray, bold: true, valign: "middle", margin: 0 });
    s.addText(r.value, { x: x1 + 0.95, y: ry, w: LEAF_W - 1.1, h: h, fontSize: 8, fontFace: FONT_BODY, color: C.ink, valign: "middle", lineSpacingMultiple: 1.3, margin: 0 });
    ry += h;
  });

  s.addText("ISSUED  │  pet-eto, 2026", { x: x1 + 0.15, y: y1 + LEAF_H - 0.3, w: LEAF_W - 0.3, h: 0.2, fontSize: 7, fontFace: FONT_MONO, color: C.gray });
  s.addText("앞면 · 처방전 구조", { x: x1, y: y1 + LEAF_H + 0.05, w: LEAF_W, h: 0.2, fontSize: 9, fontFace: FONT_BODY, color: C.gray, align: "center" });

  // 뒷면 복용법
  const x2 = 3.6, y2 = 1.95;
  drawLeafletFrame(s, x2, y2, C.cream);
  s.addText("복용법 (How to use)", { x: x2 + 0.15, y: y2 + 0.2, w: LEAF_W - 0.3, h: 0.3, fontSize: 13, fontFace: FONT_SERIF, color: C.terra, bold: true, italic: true });
  const steps = [
    "1. 펫에토 앱에 사진 1장 업로드",
    "2. AI가 증상 자동 분류",
    "3. 수의사 답변 (당일~3일)",
    "4. 포인트 적립 · 필요 시 병원 연결",
  ];
  steps.forEach((st, i) => {
    s.addText(st, { x: x2 + 0.15, y: y2 + 0.7 + i * 0.4, w: LEAF_W - 0.3, h: 0.3, fontSize: 10, fontFace: FONT_BODY, color: C.ink });
  });

  drawQrPlaceholder(s, x2 + (LEAF_W - 0.8) / 2, y2 + 2.45, 0.8);
  s.addText("Scan · pet-eto.vercel.app", { x: x2 + 0.15, y: y2 + LEAF_H - 0.3, w: LEAF_W - 0.3, h: 0.2, fontSize: 8, fontFace: FONT_BODY, color: C.gray, align: "center" });
  s.addText("뒷면 · 복용법 안내", { x: x2, y: y2 + LEAF_H + 0.05, w: LEAF_W, h: 0.2, fontSize: 9, fontFace: FONT_BODY, color: C.gray, align: "center" });

  // 설명 패널
  const sideX = 6.85;
  s.addShape(pres.shapes.RECTANGLE, { x: sideX, y: y2, w: 2.7, h: LEAF_H, fill: { color: C.cream }, line: { color: C.cream, width: 0 } });
  s.addText("시리즈성 강점", { x: sideX + 0.15, y: y2 + 0.15, w: 2.4, h: 0.25, fontSize: 10, fontFace: FONT_HEAD, color: C.terra, bold: true });
  s.addText("Vet Chart 명함과 같은\n메타포 공유 → 명함 받은\n수의사가 리플릿도 받으면\n\"같은 팀 같이 생각함\"을 느낌", {
    x: sideX + 0.15, y: y2 + 0.5, w: 2.4, h: 1.3,
    fontSize: 9, fontFace: FONT_BODY, color: C.ink, lineSpacingMultiple: 1.4,
  });
  s.addText("판형", { x: sideX + 0.15, y: y2 + 2.0, w: 2.4, h: 0.2, fontSize: 9, fontFace: FONT_HEAD, color: C.terra, bold: true });
  s.addText("A5 · 상단 스프링 철\n또는 접지 없음", { x: sideX + 0.15, y: y2 + 2.25, w: 2.4, h: 0.4, fontSize: 9, fontFace: FONT_BODY, color: C.ink });
  s.addText("단가(500장)", { x: sideX + 0.15, y: y2 + 2.85, w: 2.4, h: 0.2, fontSize: 9, fontFace: FONT_HEAD, color: C.terra, bold: true });
  s.addText("12~18만원", { x: sideX + 0.15, y: y2 + 3.1, w: 2.4, h: 0.25, fontSize: 11, fontFace: FONT_HEAD, color: C.ink, bold: true });

  addPageFooter(s, 10, TOTAL_PAGES, "리플릿 · Prescription");
}

// SLIDE 11: 리플릿 3타겟 변형 요약
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  sectionHeader(s, "LEAFLET TARGETS", "3타겟 × 3 컨셉 변형", "타겟별 메시지 · CTA · 가치 제안");

  const targets = [
    { emoji: "🩺", name: "수의사 (개인)",    hook: "환자 케이스 답변하고\n포인트·뱃지 받는 네트워크", cta: "전문가 등록", color: C.terra },
    { emoji: "🏥", name: "동물병원 원장",    hook: "병원 브랜딩 + 전국\n반려인 리드 = 신환 채널",    cta: "병원 계정 등록", color: C.teal },
    { emoji: "🛒", name: "펫샵",            hook: "반려동물 올리면 AI 체크,\n피드 노출로 바이럴",      cta: "펫샵 파트너 신청", color: C.sage },
  ];

  targets.forEach((t, i) => {
    const x = 0.5 + i * 3.1;
    s.addShape(pres.shapes.RECTANGLE, { x, y: 2.0, w: 2.9, h: 3.1, fill: { color: C.white }, line: { color: C.lightGray, width: 1 } });
    // 상단 컬러 바
    s.addShape(pres.shapes.RECTANGLE, { x, y: 2.0, w: 2.9, h: 0.4, fill: { color: t.color }, line: { color: t.color, width: 0 } });
    s.addText(`${t.emoji}  ${t.name}`, { x: x + 0.15, y: 2.05, w: 2.6, h: 0.3, fontSize: 11, fontFace: FONT_HEAD, color: C.white, bold: true, valign: "middle", margin: 0 });
    // Pain
    s.addText("PAIN", { x: x + 0.2, y: 2.55, w: 2, h: 0.2, fontSize: 8, fontFace: FONT_MONO, color: C.gray, bold: true, charSpacing: 2 });
    s.addText([
      { text: "", options: {} },
      { text: t.name.includes("수의사") ? "오진 위험 SNS 글이 안타깝다.\n답하고 싶어도 플랫폼이 없다." :
             t.name.includes("원장") ? "SNS 마케팅은 한계.\n전환율 낮은 광고비만 소진." :
             "블로그·인스타뿐.\n신뢰성 떨어져 경쟁 열세.", options: {} },
    ], { x: x + 0.2, y: 2.75, w: 2.5, h: 0.55, fontSize: 9, fontFace: FONT_BODY, color: C.ink, lineSpacingMultiple: 1.25 });
    // Hook
    s.addText("HOOK", { x: x + 0.2, y: 3.4, w: 2, h: 0.2, fontSize: 8, fontFace: FONT_MONO, color: t.color, bold: true, charSpacing: 2 });
    s.addText(t.hook, { x: x + 0.2, y: 3.6, w: 2.5, h: 0.6, fontSize: 10, fontFace: FONT_BODY, color: C.ink, bold: true, lineSpacingMultiple: 1.2 });
    // CTA
    s.addShape(pres.shapes.RECTANGLE, { x: x + 0.2, y: 4.55, w: 2.5, h: 0.4, fill: { color: t.color }, line: { color: t.color, width: 0 } });
    s.addText(`→ ${t.cta}`, { x: x + 0.2, y: 4.55, w: 2.5, h: 0.4, fontSize: 10, fontFace: FONT_BODY, color: C.white, bold: true, align: "center", valign: "middle", margin: 0 });
  });

  addPageFooter(s, 11, TOTAL_PAGES, "리플릿 3타겟");
}

// SLIDE 12: 리플릿 컨셉 3~5 요약
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  sectionHeader(s, "LEAFLET 03~05", "리플릿 컨셉 3가지 추가", "3단 접지 · DL 사이즈 중심 · 타겟별 세부 변형");

  const concepts = [
    { num: "03", title: "DL 3단 접지 · 비주얼",    desc: "99×210mm × 3면 · 비주얼 스토리텔링 · 무광코팅 아트지", budget: "500부 15~25만원" },
    { num: "04", title: "Kraft Natural · 자연주의", desc: "크라프트 250g · 손글씨 톤 · 펫샵·제품 영업용",          budget: "500부 10~18만원" },
    { num: "05", title: "Poster-Fold · 대형 전개",   desc: "A3 접힘 → A5 펼침 · 전시·학회 부스용",                 budget: "300부 15~25만원" },
  ];

  concepts.forEach((c, i) => {
    const y = 1.95 + i * 1.1;
    s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y, w: 9, h: 0.95, fill: { color: C.cream }, line: { color: C.cream, width: 0 } });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y, w: 0.1, h: 0.95, fill: { color: C.terra }, line: { color: C.terra, width: 0 } });
    s.addText(c.num, { x: 0.7, y: y + 0.15, w: 0.7, h: 0.4, fontSize: 22, fontFace: FONT_HEAD, color: C.terra, bold: true, margin: 0 });
    s.addText(c.title, { x: 1.5, y: y + 0.12, w: 6, h: 0.35, fontSize: 15, fontFace: FONT_HEAD, color: C.ink, bold: true, margin: 0 });
    s.addText(c.desc, { x: 1.5, y: y + 0.5, w: 6, h: 0.4, fontSize: 10, fontFace: FONT_BODY, color: C.gray });
    s.addText(c.budget, { x: 7.7, y: y + 0.3, w: 1.7, h: 0.4, fontSize: 11, fontFace: FONT_HEAD, color: C.terra, bold: true, align: "right" });
  });

  // 합계 안내
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 5.0, w: 9, h: 0.3, fill: { color: C.teal }, line: { color: C.teal, width: 0 } });
  s.addText("💡 추천 조합: Concept 1 (Editorial) + Concept 2 (Prescription) = 시리즈성 확보", {
    x: 0.5, y: 5.0, w: 9, h: 0.3,
    fontSize: 11, fontFace: FONT_BODY, color: C.white, bold: true, align: "center", valign: "middle", margin: 0,
  });

  addPageFooter(s, 12, TOTAL_PAGES, "리플릿 3~5 요약");
}

// ═══════════════════════════════════════════════════════════
// SLIDE 13~15: 영업킷 3레벨
// ═══════════════════════════════════════════════════════════
const kitLevels = [
  {
    level: "LEVEL 1  |  MINI KIT",
    title: "미니킷 (현장 영업용)",
    desc: "3초 안에 건네는 \"인사 패키지\"",
    unit: "₩3,000 / 세트",
    items: [
      ["💳", "명함 1장", "Concept 4 Vet Chart"],
      ["📄", "리플릿 1부", "Prescription or Editorial"],
      ["🏷", "스티커 1장", "파트너 뱃지 1종"],
    ],
    pack: "크라프트 봉투(C5) + 심플 실링",
    color: C.sage,
  },
  {
    level: "LEVEL 2  |  STANDARD KIT",
    title: "스탠다드킷 (관심 고객용)",
    desc: "1차 미팅 후 \"생각해볼 자료 드리겠습니다\"",
    unit: "₩8,000 / 세트",
    items: [
      ["💳", "명함 1장", "Concept 4"],
      ["📄", "리플릿 2부", "전문가용 + 대기실용"],
      ["🏷", "스티커 3장 세트", "뱃지·QR·로고"],
      ["📘", "서비스 안내서 A4 16p", "비전·케이스·FAQ"],
      ["✉", "엽서 1장", "친필 인사 공간"],
    ],
    pack: "고급 크라프트 박스 + 친필 서명",
    color: C.teal,
  },
  {
    level: "LEVEL 3  |  VIP KIT",
    title: "VIP킷 (원장·투자자·교수용)",
    desc: "선물 포지셔닝 · 성사 확률 높은 타겟",
    unit: "₩25,000 / 세트",
    items: [
      ["💎", "Premium Tactile 명함", "박·엠보싱"],
      ["🎴", "Story Card 4장", "벨리밴드 패키징"],
      ["📯", "Poster-Fold 1장", "펼치는 재미"],
      ["📗", "하드커버 미니북 24p", "펫에토 매니페스토"],
      ["✍", "맞춤형 편지", "이름 인쇄 + 친필 서명"],
      ["💾", "QR 카드", "IR 자료·서비스 영상"],
    ],
    pack: "리넨 천 + 크라프트 하드박스 + 왁스실 봉인",
    color: C.terra,
  },
];

kitLevels.forEach((kit, idx) => {
  const s = pres.addSlide();
  s.background = { color: C.white };
  sectionHeader(s, kit.level, kit.title, kit.desc);

  // 좌측: 구성품 리스트
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.95, w: 5, h: 3.3, fill: { color: C.cream }, line: { color: C.cream, width: 0 } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.95, w: 5, h: 0.35, fill: { color: kit.color }, line: { color: kit.color, width: 0 } });
  s.addText(`구성품 ${kit.items.length}종`, { x: 0.6, y: 1.95, w: 4.8, h: 0.35, fontSize: 11, fontFace: FONT_HEAD, color: C.white, bold: true, valign: "middle", margin: 0 });

  kit.items.forEach((it, i) => {
    const y = 2.4 + i * 0.43;
    s.addText(it[0], { x: 0.7, y, w: 0.5, h: 0.35, fontSize: 18, fontFace: FONT_BODY, color: kit.color, align: "center", valign: "middle", margin: 0 });
    s.addText(it[1], { x: 1.2, y, w: 2.1, h: 0.35, fontSize: 11, fontFace: FONT_HEAD, color: C.ink, bold: true, valign: "middle", margin: 0 });
    s.addText(it[2], { x: 3.3, y, w: 2.1, h: 0.35, fontSize: 9, fontFace: FONT_BODY, color: C.gray, valign: "middle", margin: 0 });
  });

  // 우측: 박스 시각화 + 사양
  const rx = 5.8, ry = 1.95;
  s.addShape(pres.shapes.RECTANGLE, { x: rx, y: ry, w: 3.7, h: 2.2, fill: { color: C.ink }, line: { color: C.ink, width: 0 } });
  s.addText("[박스 시각화]", { x: rx, y: ry + 0.3, w: 3.7, h: 0.3, fontSize: 9, fontFace: FONT_BODY, color: "999999", italic: true, align: "center" });
  s.addText("pet-eto", { x: rx, y: ry + 0.7, w: 3.7, h: 0.6, fontSize: 28, fontFace: FONT_HEAD, color: kit.color, bold: true, align: "center" });
  s.addText(kit.title.split(" ")[0], { x: rx, y: ry + 1.3, w: 3.7, h: 0.3, fontSize: 11, fontFace: FONT_BODY, color: C.cream, align: "center", charSpacing: 2 });
  s.addText(`포장: ${kit.pack}`, { x: rx, y: ry + 1.75, w: 3.7, h: 0.3, fontSize: 9, fontFace: FONT_BODY, color: "BBBBBB", align: "center", italic: true });

  // 단가 + 활용 예시
  s.addShape(pres.shapes.RECTANGLE, { x: rx, y: ry + 2.35, w: 3.7, h: 0.95, fill: { color: C.cream }, line: { color: C.cream, width: 0 } });
  s.addText("원가", { x: rx + 0.2, y: ry + 2.4, w: 1.5, h: 0.3, fontSize: 10, fontFace: FONT_HEAD, color: C.gray, bold: true });
  s.addText(kit.unit, { x: rx + 0.2, y: ry + 2.65, w: 1.7, h: 0.4, fontSize: 18, fontFace: FONT_HEAD, color: kit.color, bold: true });
  s.addText("50세트", { x: rx + 2.3, y: ry + 2.4, w: 1, h: 0.25, fontSize: 9, fontFace: FONT_BODY, color: C.gray });
  s.addText(`${(parseInt(kit.unit.replace(/[^0-9]/g, "")) * 50 / 10000).toFixed(0)}만원`, { x: rx + 2.3, y: ry + 2.65, w: 1, h: 0.25, fontSize: 11, fontFace: FONT_HEAD, color: C.ink, bold: true });
  s.addText("100세트", { x: rx + 2.3, y: ry + 2.9, w: 1, h: 0.25, fontSize: 9, fontFace: FONT_BODY, color: C.gray });
  s.addText(`${(parseInt(kit.unit.replace(/[^0-9]/g, "")) * 100 / 10000).toFixed(0)}만원`, { x: rx + 3.0, y: ry + 2.9, w: 0.7, h: 0.25, fontSize: 11, fontFace: FONT_HEAD, color: C.ink, bold: true, align: "right" });

  addPageFooter(s, 13 + idx, TOTAL_PAGES, kit.level);
});

// SLIDE 16: 영업킷 예산 분배 추천
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  sectionHeader(s, "SALES KIT BUDGET", "영업킷 예산 분배 추천", "지원금 한도 110만원 내 최적 조합");

  const rows = [
    ["레벨",       "수량",    "단가",      "합계",      "용도"],
    ["Level 1 (미니)",  "150세트", "₩3,000",  "45만원",   "현장 영업용 · 수의사·펫샵 방문"],
    ["Level 2 (스탠다드)", "50세트",  "₩8,000",  "40만원",   "1차 미팅 후 관심 고객용"],
    ["Level 3 (VIP)",  "10세트",  "₩25,000", "25만원",   "원장·투자자·수의학교 교수용"],
    ["합계",         "210세트", "—",        "110만원",  "전국 수의학교 10곳·대형 병원·VC 포함"],
  ];

  const colX = [0.5, 2.5, 4.0, 5.5, 6.8];
  const colW = [2.0, 1.5, 1.5, 1.3, 2.7];
  rows.forEach((row, ri) => {
    row.forEach((cell, ci) => {
      const isHeader = ri === 0;
      const isTotal = ri === 4;
      const bg = isHeader ? C.ink : (isTotal ? C.teal : (ri % 2 === 0 ? C.cream : C.white));
      const color = isHeader || isTotal ? C.white : C.ink;
      s.addShape(pres.shapes.RECTANGLE, {
        x: colX[ci], y: 2.05 + ri * 0.5, w: colW[ci], h: 0.5,
        fill: { color: bg }, line: { color: C.lightGray, width: 0.5 },
      });
      s.addText(cell, {
        x: colX[ci], y: 2.05 + ri * 0.5, w: colW[ci], h: 0.5,
        fontSize: 11, fontFace: FONT_BODY, color, bold: isHeader || isTotal,
        align: "center", valign: "middle", margin: 0,
      });
    });
  });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 4.85, w: 9, h: 0.5, fill: { color: C.terraLight }, line: { color: C.terra, width: 1 } });
  s.addText("💡 운영 원칙: Level별 QR 트래킹 (src=kit-mini/std/vip) · 수령자 스프레드시트 · 후속 연락 규칙",
    { x: 0.6, y: 4.85, w: 8.8, h: 0.5, fontSize: 10, fontFace: FONT_BODY, color: C.ink, valign: "middle", margin: 0 });

  addPageFooter(s, 16, TOTAL_PAGES, "영업킷 예산");
}

// ═══════════════════════════════════════════════════════════
// SLIDE 17~21: 스티커 5종
// ═══════════════════════════════════════════════════════════
const stickers = [
  {
    num: "01", title: "파트너 뱃지", role: "병원·펫샵 카운터/출입문", tag: "★ 핵심 영업 무기 ★",
    variants: [
      { shape: "원형", size: "⌀80mm", color: C.cream, ink: C.terra, text: "pet-eto\ncertified\npartner hospital" },
      { shape: "사각", size: "100×50mm", color: C.cream, ink: C.ink, text: "pet-eto · 파트너 펫샵\n──\nAI 건강 검증 완료" },
      { shape: "육각", size: "⌀60mm", color: C.cream, ink: C.terra, text: "pet-eto\nexpert" },
    ],
    material: "리무벌 PVC + UV 코팅",
    budget: "500장 10~20만원",
  },
  {
    num: "02", title: "QR 스티커", role: "영업킷·리플릿 동봉 · 노트북/다이어리용", tag: "명함 보완재",
    variants: [
      { shape: "세로", size: "50×70mm", color: C.cream, ink: C.ink, text: "pet-eto\n────\n[QR]\n스캔하면 바로" },
    ],
    material: "유포지 + 매트 라미네이팅",
    budget: "1000장 10~15만원",
  },
  {
    num: "03", title: "로고 스티커 (심플)", role: "증정용 · 콜렉션용", tag: "브랜드 자산 확장",
    variants: [
      { shape: "원형", size: "⌀30mm", color: C.cream, ink: C.terra, text: "pet-eto\nmini" },
      { shape: "가로", size: "60×20mm", color: C.ink, ink: C.cream, text: "pet-eto" },
      { shape: "투명", size: "⌀25mm", color: C.white, ink: C.terra, text: "🐾" },
    ],
    material: "유포지 + 투명 PVC",
    budget: "1000장 5종 믹스 15~20만원",
  },
  {
    num: "04", title: "캠페인 스티커", role: "수의학교·컨퍼런스 대량 배포", tag: "대화 트리거",
    variants: [
      { shape: "사각", size: "70×70mm", color: C.cream, ink: C.ink, text: "수의사의 답은\n여기에 있다\n\npet-eto" },
      { shape: "사각", size: "70×70mm", color: C.terra, ink: C.cream, text: "AI × Vet\n= pet-eto" },
      { shape: "사각", size: "70×100mm", color: C.cream, ink: C.ink, text: "반려인에게\n수의사가\n한 명씩\n\n— pet-eto" },
    ],
    material: "모조지 또는 유포지",
    budget: "2000장 믹스 20~30만원",
  },
  {
    num: "05", title: "개인 맞춤 뱃지", role: "1:1 영업 무기 · 수의사 이름 가변 인쇄", tag: "심리적 유대 형성",
    variants: [
      { shape: "사각", size: "100×60mm", color: C.cream, ink: C.ink, text: "김수의 수의사\n(답변 수의사 뱃지)\n\npet-eto verified" },
    ],
    material: "유포지 + 매트 라미네이팅 · 가변 인쇄",
    budget: "50장 약 5만원 (30~50장씩 소량)",
  },
];

stickers.forEach((st, idx) => {
  const slide = pres.addSlide();
  slide.background = { color: C.white };
  sectionHeader(slide, `STICKER ${st.num} / 05`, st.title, `${st.role}  ·  ${st.tag}`);

  // 스티커 변형들 배치
  const count = st.variants.length;
  const maxW = 9;
  const gap = 0.3;
  const vW = (maxW - gap * (count - 1)) / count;

  st.variants.forEach((v, i) => {
    const x = 0.5 + i * (vW + gap);
    const y = 2.1;
    const h = 2.4;

    // 바탕 (변형 박스)
    slide.addShape(pres.shapes.RECTANGLE, { x, y, w: vW, h, fill: { color: C.lightGray }, line: { color: C.lightGray, width: 0 } });

    // 스티커 모양 그리기
    const stX = x + 0.3, stY = y + 0.25;
    const stW = vW - 0.6, stH = h - 1.0;
    if (v.shape === "원형" || v.shape === "육각") {
      slide.addShape(pres.shapes.OVAL, { x: stX + (stW - stH) / 2, y: stY, w: stH, h: stH, fill: { color: v.color }, line: { color: v.ink, width: 1 } });
      slide.addText(v.text, { x: stX + (stW - stH) / 2, y: stY, w: stH, h: stH, fontSize: 9, fontFace: FONT_HEAD, color: v.ink, bold: true, align: "center", valign: "middle", lineSpacingMultiple: 1.3, margin: 0 });
    } else if (v.shape === "투명") {
      slide.addShape(pres.shapes.OVAL, { x: stX + (stW - stH) / 2, y: stY, w: stH, h: stH, fill: { color: C.white }, line: { color: v.ink, width: 1, dashType: "dash" } });
      slide.addText(v.text, { x: stX + (stW - stH) / 2, y: stY, w: stH, h: stH, fontSize: 28, fontFace: FONT_HEAD, color: v.ink, align: "center", valign: "middle", margin: 0 });
    } else {
      slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: stX, y: stY, w: stW, h: stH, fill: { color: v.color }, line: { color: v.ink, width: 1 }, rectRadius: 0.05 });
      slide.addText(v.text, { x: stX, y: stY, w: stW, h: stH, fontSize: 9, fontFace: FONT_HEAD, color: v.ink, bold: true, align: "center", valign: "middle", lineSpacingMultiple: 1.3, margin: 0 });
    }

    // 하단 정보
    slide.addText(`${v.shape} · ${v.size}`, { x, y: y + h - 0.5, w: vW, h: 0.2, fontSize: 9, fontFace: FONT_HEAD, color: C.ink, bold: true, align: "center" });
  });

  // 사양 패널
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 4.7, w: 9, h: 0.65, fill: { color: C.cream }, line: { color: C.cream, width: 0 } });
  slide.addText([
    { text: "재료: ", options: { bold: true, color: C.terra } }, { text: st.material + "  ", options: {} },
    { text: "| 예산: ", options: { bold: true, color: C.terra } }, { text: st.budget, options: {} },
  ], { x: 0.6, y: 4.8, w: 8.8, h: 0.25, fontSize: 10, fontFace: FONT_BODY, color: C.ink });
  slide.addText(`💡 활용: ${st.tag}`, { x: 0.6, y: 5.05, w: 8.8, h: 0.2, fontSize: 10, fontFace: FONT_BODY, color: C.gray });

  addPageFooter(slide, 17 + idx, TOTAL_PAGES, `스티커 · ${st.title}`);
});

// ═══════════════════════════════════════════════════════════
// SLIDE 22: 스티커 전체 예산
// ═══════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  sectionHeader(s, "STICKER BUDGET", "스티커 5종 총 예산", "풀세트 107만원 / 압축 60만원");

  const rows = [
    ["#", "항목", "수량", "단가", "합계"],
    ["01", "Type 1 파트너 뱃지 (3종)",   "각 300",  "평균 ₩250", "22만원"],
    ["02", "Type 2 QR 스티커 (4종)",    "각 500",  "평균 ₩130", "26만원"],
    ["03", "Type 3 로고 (3종)",         "각 1,000","평균 ₩80",  "24만원"],
    ["04", "Type 4 캠페인 (3종)",       "각 1,000","평균 ₩100", "30만원"],
    ["05", "Type 5 개인 맞춤",          "50",      "₩1,000",    "5만원"],
    ["",   "합계 (풀세트)",              "",        "",          "107만원"],
  ];

  const colX = [0.5, 1.1, 5.0, 6.3, 7.5];
  const colW = [0.6, 3.9, 1.3, 1.2, 2.0];
  rows.forEach((row, ri) => {
    row.forEach((cell, ci) => {
      const isHeader = ri === 0;
      const isTotal = ri === rows.length - 1;
      const bg = isHeader ? C.ink : (isTotal ? C.terra : (ri % 2 === 0 ? C.cream : C.white));
      const color = isHeader || isTotal ? C.white : C.ink;
      s.addShape(pres.shapes.RECTANGLE, {
        x: colX[ci], y: 2.05 + ri * 0.42, w: colW[ci], h: 0.42,
        fill: { color: bg }, line: { color: C.lightGray, width: 0.5 },
      });
      s.addText(cell, {
        x: colX[ci], y: 2.05 + ri * 0.42, w: colW[ci], h: 0.42,
        fontSize: 10, fontFace: FONT_BODY, color, bold: isHeader || isTotal,
        align: ci === 1 ? "left" : "center", valign: "middle",
        margin: ci === 1 ? 8 : 0,
      });
    });
  });

  // 압축 예산
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 5.0, w: 9, h: 0.4, fill: { color: C.teal }, line: { color: C.teal, width: 0 } });
  s.addText("💡 압축 예산 60만원: Type1A×300 + Type2(3종)×각300 + Type3A×1000 + Type4A×1000 + Type5×30",
    { x: 0.5, y: 5.0, w: 9, h: 0.4, fontSize: 10, fontFace: FONT_BODY, color: C.white, align: "center", valign: "middle", margin: 0 });

  addPageFooter(s, 22, TOTAL_PAGES, "스티커 예산");
}

// ═══════════════════════════════════════════════════════════
// SLIDE 23: 인쇄소 브리프 요약
// ═══════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  sectionHeader(s, "PRINTER BRIEF", "인쇄소 전달 브리프", "한 장으로 정리된 전체 사양");

  // 좌측 컬러
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.95, w: 4.4, h: 3.3, fill: { color: C.cream }, line: { color: C.cream, width: 0 } });
  s.addText("컬러 (CMYK / Pantone)", { x: 0.65, y: 2.0, w: 4.2, h: 0.3, fontSize: 12, fontFace: FONT_HEAD, color: C.terra, bold: true });

  const palRows = [
    ["Terra Warm",   "#D97757", "C0 M60 Y60 K0",  "Pantone 7416 C"],
    ["Ink Deep",     "#1A1A1A", "C0 M0 Y0 K95",   "Pantone Black 6 C"],
    ["Cream Paper",  "#F5F0E8", "C2 M5 Y10 K0",   "Pantone 9224 C"],
    ["Teal Clinical","#0B5D5D", "C90 M40 Y50 K40","Pantone 5473 C"],
    ["Sage Health",  "#7A9B76", "C55 M25 Y55 K5", "Pantone 5555 C"],
  ];
  palRows.forEach((r, i) => {
    const y = 2.4 + i * 0.48;
    s.addShape(pres.shapes.RECTANGLE, { x: 0.65, y, w: 0.4, h: 0.4, fill: { color: r[1].replace("#", "") }, line: { color: C.lightGray, width: 0.5 } });
    s.addText(r[0], { x: 1.15, y, w: 1.4, h: 0.2, fontSize: 9, fontFace: FONT_HEAD, color: C.ink, bold: true });
    s.addText(r[1], { x: 1.15, y: y + 0.2, w: 1.4, h: 0.2, fontSize: 8, fontFace: FONT_MONO, color: C.gray });
    s.addText(r[2], { x: 2.6, y, w: 2.2, h: 0.2, fontSize: 8, fontFace: FONT_MONO, color: C.gray });
    s.addText(r[3], { x: 2.6, y: y + 0.2, w: 2.2, h: 0.2, fontSize: 8, fontFace: FONT_MONO, color: C.ink, bold: true });
  });

  // 우측 종이·후가공
  s.addShape(pres.shapes.RECTANGLE, { x: 5.1, y: 1.95, w: 4.4, h: 3.3, fill: { color: C.cream }, line: { color: C.cream, width: 0 } });
  s.addText("종이 & 후가공", { x: 5.25, y: 2.0, w: 4.2, h: 0.3, fontSize: 12, fontFace: FONT_HEAD, color: C.terra, bold: true });

  const paperRows = [
    ["명함(고급)",  "몽블랑 260g / 크림보드 280g"],
    ["명함(표준)",  "아르떼 210g / 레자크 210g"],
    ["명함(특수)",  "펄 아트지 250g · 반누보 300g"],
    ["리플릿 표준", "무광코팅 210g 아트지"],
    ["리플릿 고급", "스노우화이트 200g"],
    ["스티커 옥외", "리무벌 PVC + UV 코팅 (2년 보증)"],
    ["스티커 홍보", "유포지 + 매트 라미네이팅"],
  ];
  paperRows.forEach((r, i) => {
    const y = 2.4 + i * 0.34;
    s.addText(r[0], { x: 5.25, y, w: 1.5, h: 0.3, fontSize: 9, fontFace: FONT_HEAD, color: C.ink, bold: true, valign: "middle", margin: 0 });
    s.addText(r[1], { x: 6.8, y, w: 2.6, h: 0.3, fontSize: 9, fontFace: FONT_BODY, color: C.ink, valign: "middle", margin: 0 });
    if (i < paperRows.length - 1) {
      s.addShape(pres.shapes.LINE, { x: 5.25, y: y + 0.32, w: 4.1, h: 0, line: { color: C.lightGray, width: 0.3 } });
    }
  });

  addPageFooter(s, 23, TOTAL_PAGES, "인쇄소 브리프");
}

// ═══════════════════════════════════════════════════════════
// SLIDE 24: 전체 예산 시뮬레이션
// ═══════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  sectionHeader(s, "TOTAL BUDGET", "전체 예산 시뮬레이션", "핵심 110만원 / 풀세트 200만원+");

  const budgets = [
    { kind: "핵심 패키지 (110만원)",   scope: "바로 영업 시작 가능한 최소 구성", items: [
      ["명함 Concept 4 (Vet Chart)", "300장", "10만원"],
      ["리플릿 Concept 1 (Editorial) 3타겟 × 200부", "600부", "20만원"],
      ["스티커 핵심 5종 압축 세트",    "약 2,500장", "60만원"],
      ["영업킷 Level 1 × 150세트",    "150세트", "45만원"],
      ["소계",                         "",         "135만원"],
    ], color: C.terra },
    { kind: "풀세트 (200만원+)",       scope: "전국 영업 + VIP 타겟 포함",       items: [
      ["명함 Concept 2+4 혼합",        "500장", "15만원"],
      ["리플릿 5컨셉 × 3타겟",          "1,500부", "50만원"],
      ["스티커 풀세트 5종",             "5,000장", "107만원"],
      ["영업킷 Level 1+2+3 혼합",      "210세트", "110만원"],
      ["소계",                         "",         "282만원"],
    ], color: C.teal },
  ];

  budgets.forEach((b, bi) => {
    const y = 1.95 + bi * 1.75;
    s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y, w: 9, h: 1.55, fill: { color: C.cream }, line: { color: C.cream, width: 0 } });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y, w: 9, h: 0.35, fill: { color: b.color }, line: { color: b.color, width: 0 } });
    s.addText(b.kind, { x: 0.6, y, w: 5, h: 0.35, fontSize: 12, fontFace: FONT_HEAD, color: C.white, bold: true, valign: "middle", margin: 0 });
    s.addText(b.scope, { x: 5.6, y, w: 3.8, h: 0.35, fontSize: 9, fontFace: FONT_BODY, color: C.cream, valign: "middle", margin: 0, italic: true });

    // 항목 테이블
    b.items.forEach((it, i) => {
      const ry = y + 0.4 + i * 0.22;
      const isTotal = i === b.items.length - 1;
      s.addText(it[0], { x: 0.6, y: ry, w: 5.5, h: 0.2, fontSize: 9, fontFace: isTotal ? FONT_HEAD : FONT_BODY, color: C.ink, bold: isTotal, margin: 0 });
      s.addText(it[1], { x: 6.2, y: ry, w: 1.5, h: 0.2, fontSize: 9, fontFace: FONT_BODY, color: C.gray, margin: 0 });
      s.addText(it[2], { x: 7.8, y: ry, w: 1.5, h: 0.2, fontSize: 10, fontFace: FONT_HEAD, color: isTotal ? b.color : C.ink, bold: true, align: "right", margin: 0 });
    });
  });

  addPageFooter(s, 24, TOTAL_PAGES, "전체 예산");
}

// ═══════════════════════════════════════════════════════════
// SLIDE 25: 공통 제작 체크리스트
// ═══════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  sectionHeader(s, "CHECKLIST", "인쇄소 발주 체크리스트", "발주 전 반드시 확인할 9가지");

  const checks = [
    "출혈(bleed) 3mm 포함",
    "안전여백(safe area) 5mm 확보",
    "폰트 아웃라인 처리 (깨짐 방지)",
    "CMYK 컬러 모드 (RGB 금지)",
    "해상도 300dpi 이상",
    "QR 실제 스캔 테스트 (인쇄 샘플에서)",
    "종이 샘플 선수령 (무광/유광 비교)",
    "Pantone 넘버 지정",
    "교정지 2회 (컬러 교정 → 최종 교정)",
  ];

  const cols = 3;
  const rows = Math.ceil(checks.length / cols);
  const cardW = 2.9, cardH = 0.85;
  checks.forEach((c, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = 0.5 + col * 3.1;
    const y = 2.1 + row * 1.0;
    s.addShape(pres.shapes.RECTANGLE, { x, y, w: cardW, h: cardH, fill: { color: C.cream }, line: { color: C.cream, width: 0 } });
    s.addShape(pres.shapes.OVAL, { x: x + 0.15, y: y + 0.22, w: 0.4, h: 0.4, fill: { color: C.terra }, line: { color: C.terra, width: 0 } });
    s.addText(String(i + 1), { x: x + 0.15, y: y + 0.22, w: 0.4, h: 0.4, fontSize: 13, fontFace: FONT_HEAD, color: C.white, bold: true, align: "center", valign: "middle", margin: 0 });
    s.addText(c, { x: x + 0.65, y, w: cardW - 0.75, h: cardH, fontSize: 10, fontFace: FONT_BODY, color: C.ink, valign: "middle", lineSpacingMultiple: 1.3, margin: 0 });
  });

  addPageFooter(s, 25, TOTAL_PAGES, "제작 체크리스트");
}

// ═══════════════════════════════════════════════════════════
// SLIDE 26: 다음 액션
// ═══════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.ink };

  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.15, fill: { color: C.terra }, line: { color: C.terra, width: 0 } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 5.45, w: 10, h: 0.175, fill: { color: C.terra }, line: { color: C.terra, width: 0 } });

  s.addText("NEXT STEP", { x: 0.5, y: 0.55, w: 3, h: 0.35, fontSize: 12, fontFace: FONT_HEAD, color: C.terra, bold: true, charSpacing: 4 });
  s.addText("대욱님 다음 할 일", { x: 0.5, y: 0.95, w: 9, h: 0.6, fontSize: 32, fontFace: FONT_HEAD, color: C.white, bold: true });

  const actions = [
    { num: "01", title: "인쇄소 3곳 견적 요청", desc: "한양 인쇄·성원 애드콤·오늘의 프린트 등 추천. 이 PPTX + brand_system.md 전달" },
    { num: "02", title: "전담 멘토 예약",       desc: "https://bit.ly/41TAKRm 에서 강창규/이광헌 교수 상담 (1차 필수)" },
    { num: "03", title: "사전승인신청서 제출",  desc: ".ai-context/funding/pre_approval_form_draft.md 기반 → 담당매니저 제출" },
    { num: "04", title: "Claude에게 요청",      desc: "견적 반영해서 최종 사양 확정 · 로고 파일 받으면 디자인 브리프 보강" },
  ];

  actions.forEach((a, i) => {
    const y = 2.0 + i * 0.75;
    s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y, w: 9, h: 0.62, fill: { color: "2A2A2E" }, line: { color: "2A2A2E", width: 0 } });
    s.addText(a.num, { x: 0.7, y, w: 0.8, h: 0.62, fontSize: 24, fontFace: FONT_HEAD, color: C.terra, bold: true, valign: "middle", margin: 0 });
    s.addText(a.title, { x: 1.6, y: y + 0.05, w: 7.8, h: 0.3, fontSize: 14, fontFace: FONT_HEAD, color: C.white, bold: true, margin: 0 });
    s.addText(a.desc, { x: 1.6, y: y + 0.33, w: 7.8, h: 0.3, fontSize: 10, fontFace: FONT_BODY, color: "BBBBBB", margin: 0 });
  });

  s.addText("pet-eto  ·  권은환  ·  only4wook@gmail.com", { x: 0.5, y: 5.15, w: 9, h: 0.25, fontSize: 10, fontFace: FONT_BODY, color: C.gray });
}

// ═══════════════════════════════════════════════════════════
// 저장
// ═══════════════════════════════════════════════════════════
const outPath = "C:/pet-eto-web/.ai-context/marketing/preview/peteto-marketing-mockups.pptx";
await pres.writeFile({ fileName: outPath });
console.log(`✅ PPTX 생성 완료: ${outPath}`);
console.log(`📊 총 ${TOTAL_PAGES}+ 슬라이드`);
