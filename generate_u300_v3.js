const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType, PageBreak, Header, Footer, PageNumber } = require("docx");
const fs = require("fs");
const path = require("path");

const b = { style: BorderStyle.SINGLE, size: 1, color: "E5E7EB" };
const bs = { top: b, bottom: b, left: b, right: b };
const nb = { top: {style:BorderStyle.NONE}, bottom: {style:BorderStyle.NONE}, left: {style:BorderStyle.NONE}, right: {style:BorderStyle.NONE} };
const cm = { top: 80, bottom: 80, left: 120, right: 120 };

function h1(t) { return new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 360, after: 200 }, border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "FF6B35", space: 1 } }, children: [new TextRun({ text: t, bold: true, size: 30, font: "Arial", color: "1F2937" })] }); }
function h2(t) { return new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 240, after: 120 }, children: [new TextRun({ text: t, bold: true, size: 24, font: "Arial", color: "374151" })] }); }
function p(t, o = {}) { return new Paragraph({ spacing: { after: 60, line: 340 }, children: [new TextRun({ text: t, size: 20, font: "Arial", color: "4B5563", ...o })] }); }
function pb(t, c) { return new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: t, size: 20, font: "Arial", bold: true, color: c || "1F2937" })] }); }
function pSmall(t) { return new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: t, size: 16, font: "Arial", color: "9CA3AF", italics: true })] }); }
function spacer() { return new Paragraph({ spacing: { after: 120 }, children: [] }); }

function mc(t, w, bg, tc, bold) {
  return new TableCell({ borders: bs, width: { size: w, type: WidthType.DXA }, margins: cm,
    shading: bg ? { fill: bg, type: ShadingType.CLEAR } : undefined, verticalAlign: "center",
    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: t, size: 18, font: "Arial", color: tc || "374151", bold: !!bold })] })] });
}
function mcL(t, w, bg) {
  return new TableCell({ borders: bs, width: { size: w, type: WidthType.DXA }, margins: cm,
    shading: bg ? { fill: bg, type: ShadingType.CLEAR } : undefined,
    children: [new Paragraph({ children: [new TextRun({ text: t, size: 18, font: "Arial", color: "4B5563" })] })] });
}
function statCard(icon, value, label, w) {
  return new TableCell({ borders: nb, width: { size: w, type: WidthType.DXA }, margins: { top: 120, bottom: 120, left: 80, right: 80 },
    shading: { fill: "FFF7ED", type: ShadingType.CLEAR },
    children: [
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: icon, size: 32 })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 40 }, children: [new TextRun({ text: value, size: 28, font: "Arial", bold: true, color: "FF6B35" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: label, size: 16, font: "Arial", color: "6B7280" })] }),
    ] });
}
function flowCard(step, title, desc, w) {
  return new TableCell({ borders: nb, width: { size: w, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 60, right: 60 },
    shading: { fill: "FF6B35", type: ShadingType.CLEAR },
    children: [
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: step, size: 14, font: "Arial", color: "FFFFFF", bold: true })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 40 }, children: [new TextRun({ text: title, size: 20, font: "Arial", color: "FFFFFF", bold: true })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 20 }, children: [new TextRun({ text: desc, size: 14, font: "Arial", color: "FFE0CC" })] }),
    ] });
}

const W = 9506; // A4 content width with ~1inch margins

const doc = new Document({
  styles: { default: { document: { run: { font: "Arial", size: 20 } } } },
  sections: [{
    properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1200, right: 1200, bottom: 1200, left: 1200 } } },
    headers: { default: new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "P.E.T \uD3AB\uC5D0\uD1A0 | 2026 \uD559\uC0DD \uCC3D\uC5C5\uC720\uB9DD\uD300 300+", size: 14, color: "9CA3AF" })] })] }) },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "- ", size: 14, color: "9CA3AF" }), new TextRun({ children: [PageNumber.CURRENT], size: 14, color: "9CA3AF" }), new TextRun({ text: " -", size: 14, color: "9CA3AF" })] })] }) },
    children: [
      // ===== COVER =====
      spacer(), spacer(), spacer(),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: "2026 \uD559\uC0DD \uCC3D\uC5C5\uC720\uB9DD\uD300 300+", size: 22, color: "9CA3AF" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: "\uC0AC\uC5C5\uACC4\uD68D\uC11C", bold: true, size: 44, color: "1F2937" })] }),
      spacer(),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: "P.E.T \uD3AB\uC5D0\uD1A0", bold: true, size: 36, color: "FF6B35" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: "Pet Ever Total", size: 20, color: "9CA3AF", italics: true })] }),
      spacer(),
      new Paragraph({ alignment: AlignmentType.CENTER, border: { top: { style: BorderStyle.SINGLE, size: 2, color: "E5E7EB", space: 8 }, bottom: { style: BorderStyle.SINGLE, size: 2, color: "E5E7EB", space: 8 } }, spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "AI \uAC74\uAC15 \uBD84\uC11D\uACFC \uAC80\uC99D\uB41C \uD3AB\uC2DC\uD130 \uB9E4\uCE6D\uC73C\uB85C", size: 22, color: "4B5563" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: "1~2\uC778 \uAC00\uAD6C \uBC18\uB824\uC778\uC758 \uAE34\uAE09 \uB3CC\uBD04 \uACF5\uBC31\uC744 \uD574\uACB0\uD558\uB294 O2O \uCEE8\uC2DC\uC5B4\uC9C0 \uD50C\uB7AB\uD3FC", size: 22, color: "4B5563" })] }),
      spacer(), spacer(),
      new Table({ width: { size: W, type: WidthType.DXA }, columnWidths: [2376, 2376, 2376, 2378],
        rows: [new TableRow({ children: [
          statCard("\uD83D\uDCF1", "MVP \uC644\uC131", "pet-eto.vercel.app", 2376),
          statCard("\uD83E\uDD16", "AI 22\uAC1C", "\uC99D\uC0C1 \uBD84\uC11D \uCE74\uD14C\uACE0\uB9AC", 2376),
          statCard("\uD83D\uDCD6", "28\uC885 \uC704\uD0A4", "\uD488\uC885\uBCC4 \uC0C1\uC138 \uC815\uBCF4", 2376),
          statCard("\uD83D\uDCB0", "0\uC6D0 \uCD08\uAE30\uD22C\uC790", "\uBB34\uC7AC\uACE0 Asset-light", 2378),
        ]})] }),
      spacer(),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "\uD300\uBA85: P.E.T \uD3AB\uC5D0\uD1A0 | \uB300\uD45C: \uAD8C\uB300\uC6B1 | \uD55C\uC591\uB300\uD559\uAD50 \uB300\uD559\uC6D0 \uCC3D\uC5C5\uD559\uACFC", size: 18, color: "6B7280" })] }),

      new Paragraph({ children: [new PageBreak()] }),

      // ===== SECTION 0 =====
      h1("0. \uC0AC\uC5C5 \uC544\uC774\uD15C \uAC1C\uC694"),
      new Table({ width: { size: W, type: WidthType.DXA }, columnWidths: [2000, 7506],
        rows: [
          new TableRow({ children: [mc("\uD300\uBA85", 2000, "FF6B35", "FFFFFF", true), mcL("P.E.T \uD3AB\uC5D0\uD1A0 (Pet Ever Total)", 7506)] }),
          new TableRow({ children: [mc("\uC544\uC774\uD15C", 2000, "FF6B35", "FFFFFF", true), mcL("[AI \uAC74\uAC15\uBD84\uC11D] \uAE30\uC220\uB85C [1~2\uC778 \uAC00\uAD6C \uBC18\uB824\uC778]\uC5D0\uAC8C [\uAE34\uAE09 \uB3CC\uBD04 \uACF5\uBC31 \uD574\uACB0]\uC744 \uC81C\uACF5\uD558\uB294 [O2O \uCEE8\uC2DC\uC5B4\uC9C0 \uD50C\uB7AB\uD3FC]", 7506)] }),
          new TableRow({ children: [mc("\uCC3D\uC5C5 \uBAA9\uD45C", 2000, "FF6B35", "FFFFFF", true), mcL("\uD611\uC57D\uAE30\uAC04(6\uAC1C\uC6D4) \uB0B4 \uD30C\uD2B8\uB108 20\uBA85 \uD655\uBCF4, \uB204\uC801 \uB9E4\uCE6D 500\uAC74, MAU 1,000\uBA85 \uB2EC\uC131\uD558\uC5EC \uBC18\uB824\uB3D9\uBB3C \uAE34\uAE09 \uB3CC\uBD04 \uC2DC\uC7A5\uC758 \uAE30\uC900\uC744 \uC138\uC6B0\uACA0\uC2B5\uB2C8\uB2E4.", 7506)] }),
          new TableRow({ children: [mc("\uC0AC\uC774\uD2B8", 2000, "FF6B35", "FFFFFF", true), mcL("https://pet-eto.vercel.app", 7506)] }),
        ] }),

      spacer(),
      h1("1. \uBB38\uC81C \uC778\uC2DD"),
      h2("\u25A1 \uCC3D\uC5C5 \uBC30\uACBD \uBC0F \uAC1C\uBC1C\uB3D9\uAE30"),

      // 문제→원인→해결 플로우
      new Table({ width: { size: W, type: WidthType.DXA }, columnWidths: [3168, 3168, 3170],
        rows: [new TableRow({ children: [
          flowCard("STEP 1", "\uBB38\uC81C \uBC1C\uACAC", "602\uB9CC \uBC18\uB824\uAC00\uAD6C \uC911\n1~2\uC778 \uAC00\uAD6C 52%\uAC00\n\uAE34\uAE09 \uB3CC\uBD04 \uACF5\uBC31 \uACBD\uD5D8", 3168),
          flowCard("STEP 2", "\uC6D0\uC778 \uBD84\uC11D", "\uAE30\uC874 \uC571\uC740 \uC608\uC57D \uC911\uC2EC\n24\uC2DC\uAC04+ \uC18C\uC694\n\uD3AB\uC2DC\uD130 \uAC80\uC99D \uBD80\uC871", 3168),
          flowCard("STEP 3", "\uD574\uACB0 \uBC29\uC548", "10\uBD84 \uAE34\uAE09 \uB9E4\uCE6D\n3\uB2E8\uACC4 \uAC80\uC99D \uD30C\uD2B8\uB108\nAI \uAC74\uAC15 \uBD84\uC11D", 3170),
        ]})] }),
      spacer(),

      pb("[\uC678\uC801 \uB3D9\uAE30 \u2014 \uAC1D\uAD00\uC801 \uB370\uC774\uD130]"),
      p("\u2022 \uAD6D\uB0B4 \uBC18\uB824\uB3D9\uBB3C \uC591\uC721 \uAC00\uAD6C: 602\uB9CC \uAC00\uAD6C (2025, \uB18D\uB9BC\uCD95\uC0B0\uC2DD\uD488\uBD80)"),
      p("\u2022 1\uC778 \uAC00\uAD6C \uBC18\uB824\uC778 \uBE44\uC728: 52.2% (2025, KB\uAE08\uC735 \uBC18\uB824\uB3D9\uBB3C \uBCF4\uACE0\uC11C)"),
      p("\u2022 \uBC18\uB824\uB3D9\uBB3C \uC720\uAE30: \uC5F0\uAC04 10.7\uB9CC \uB9C8\uB9AC (2024, \uB3D9\uBB3C\uBCF4\uD638\uAD00\uB9AC\uC2DC\uC2A4\uD15C) \u2014 \uB3CC\uBD04 \uACF5\uBC31\uC774 \uC720\uAE30\uC758 \uC8FC\uC694 \uC6D0\uC778"),
      p("\u2022 \uD3AB \uCF00\uC5B4 \uC2DC\uC7A5 \uC131\uC7A5\uB960: \uC5F0\uD3C9\uADE0 12.4% (2020~2025, \uD55C\uAD6D\uBC18\uB824\uB3D9\uBB3C\uBB38\uD654\uD611\uD68C)"),
      pSmall("\uCD9C\uCC98: \uB18D\uB9BC\uCD95\uC0B0\uC2DD\uD488\uBD80 2025 \uBC18\uB824\uB3D9\uBB3C \uC591\uC721\uC2E4\uD0DC\uC870\uC0AC, KB\uAE08\uC735\uC9C0\uC8FC\uC5F0\uAD6C\uC18C 2025 \uD55C\uAD6D \uBC18\uB824\uB3D9\uBB3C \uBCF4\uACE0\uC11C"),
      p(""),
      pb("[\uB0B4\uC801 \uB3D9\uAE30 \u2014 \uCC3D\uC5C5\uC790 \uACBD\uD5D8]"),
      p("\uB300\uD45C \uAD8C\uB300\uC6B1\uC740 \uD55C\uC591\uB300 \uB300\uD559\uC6D0 \uCC3D\uC5C5\uD559\uACFC \uC7AC\uD559 \uC911 \uC9C1\uC811 \uACE0\uC591\uC774 3\uB9C8\uB9AC\uB97C \uD0A4\uC6B0\uBA74\uC11C \uC774 \u2018\uB3CC\uBD04 \uACF5\uBC31\u2019\uC744 \uCCB4\uAC10\uD588\uC2B5\uB2C8\uB2E4. \uAC11\uC791\uC2A4\uB7EC\uC6B4 \uC57C\uADFC \uC2DC \uAE30\uC874 \uD3AB\uC2DC\uD130 \uC571\uC740 \uC608\uC57D\uC5D0 24\uC2DC\uAC04+ \uC18C\uC694\uB418\uC5B4 \u2018\uC624\uB298 \uB2F9\uC7A5\u2019 \uBD88\uAC00\uB2A5\uD588\uACE0, \uD3AB\uC2DC\uD130 \uC2E0\uC6D0 \uAC80\uC99D\uB3C4 \uBD88\uCDA9\uBD84\uD558\uC5EC \uC9D1 \uC5F4\uC1E0\uB97C \uB0A8\uC5D0\uAC8C \uB9E1\uAE30\uB294 \uBD88\uC548\uC744 \uB290\uAF08\uC2B5\uB2C8\uB2E4."),
      p("\uC774\uC5D0 \u201810\uBD84 \uC548\uC5D0 \uAC80\uC99D\uB41C \uD3AB\uC2DC\uD130\uB97C \uC5F0\uACB0\uD558\uB294 \uAE34\uAE09 \uD2B9\uD654 \uD50C\uB7AB\uD3FC\u2019\uC774\uB77C\uB294 \uCF58\uC149\uD2B8\uB85C P.E.T\uB97C \uAC1C\uBC1C\uD558\uAC8C \uB418\uC5C8\uC2B5\uB2C8\uB2E4."),

      spacer(),
      h2("\u25A1 \uBAA9\uD45C\uC2DC\uC7A5 \uBD84\uC11D (TAM \u2192 SAM \u2192 SOM)"),
      new Table({ width: { size: W, type: WidthType.DXA }, columnWidths: [3168, 3168, 3170],
        rows: [
          new TableRow({ children: [mc("TAM (\uC804\uCCB4 \uC2DC\uC7A5)", 3168, "FEF3C7", "92400E", true), mc("SAM (\uC811\uADFC \uAC00\uB2A5)", 3168, "FFF7ED", "C2410C", true), mc("SOM (\uCD08\uAE30 \uBAA9\uD45C)", 3170, "FF6B35", "FFFFFF", true)] }),
          new TableRow({ children: [mc("\uBC18\uB824\uB3D9\uBB3C \uC11C\uBE44\uC2A4 \uC2DC\uC7A5", 3168), mc("\uC218\uB3C4\uAD8C 1~2\uC778 \uAC00\uAD6C", 3168), mc("\uACE0\uC591\uC2DC+\uC11C\uC6B8 \uC11C\uBD81\uAD8C", 3170)] }),
          new TableRow({ children: [mc("\uC57D 2\uC870\uC6D0", 3168, null, "FF6B35", true), mc("\uC57D 3,000\uC5B5\uC6D0", 3168, null, "FF6B35", true), mc("\uCD08\uAE30 1\uB144 7,500\uB9CC\uC6D0", 3170, null, "FF6B35", true)] }),
        ] }),
      pSmall("TAM: \uB18D\uB9BC\uCD95\uC0B0\uC2DD\uD488\uBD80 2025 \uBC18\uB824\uB3D9\uBB3C \uC0B0\uC5C5 \uD604\uD669 | SAM: 602\uB9CC \uAC00\uAD6C \u00D7 52% 1~2\uC778 \u00D7 40% \uAE34\uAE09\uC218\uC694 \u00D7 \uD3C9\uADE0 5\uB9CC\uC6D0 | SOM: \uACE0\uC591\uC2DC+\uC11C\uBD81\uAD8C 15\uB9CC \uAC00\uAD6C \u00D7 0.33% \uCDE8\uB4DD\uB960 \u00D7 \uC5F0 3\uD68C \u00D7 5\uB9CC\uC6D0"),

      new Paragraph({ children: [new PageBreak()] }),

      // ===== SECTION 2 =====
      h1("2. \uC2E4\uD604\uAC00\uB2A5\uC131"),
      h2("\u25A1 MVP \uD604\uD669 \u2014 pet-eto.vercel.app"),
      new Table({ width: { size: W, type: WidthType.DXA }, columnWidths: [3168, 3168, 3170],
        rows: [
          new TableRow({ children: [
            statCard("\uD83E\uDD16", "AI \uC99D\uC0C1 \uBD84\uC11D", "22\uAC1C \uCE74\uD14C\uACE0\uB9AC\n300+ \uD0A4\uC6CC\uB4DC", 3168),
            statCard("\uD83D\uDCD6", "\uD3AB-\uC704\uD0A4", "28\uC885 \uD488\uC885 \uC815\uBCF4\n\uC9C8\uBCD1 \uBE44\uC6A9 \uD3EC\uD568", 3168),
            statCard("\uD83D\uDCAC", "\uCEE4\uBBA4\uB2C8\uD2F0", "9\uAC1C \uCE74\uD14C\uACE0\uB9AC\n\uD6C4\uAE30/\uB17C\uBB38/\uD589\uC0AC", 3170),
          ]}),
          new TableRow({ children: [
            statCard("\uD83D\uDCF1", "\uCE74\uCE74\uC624\uD1A1 \uC5F0\uB3D9", "1:1 \uAE34\uAE09 \uB9E4\uCE6D\n\uCC44\uD305 \uC0C1\uB2F4", 3168),
            statCard("\uD83D\uDD12", "\uC18C\uC15C \uB85C\uADF8\uC778", "\uAD6C\uAE00/\uCE74\uCE74\uC624\nOAuth \uC5F0\uB3D9", 3168),
            statCard("\uD83D\uDCCA", "\uC790\uB3D9 \uAC70\uB798 \uAE30\uB85D", "Google Sheets\n\uC2E4\uC2DC\uAC04 \uC5F0\uB3D9", 3170),
          ]}),
        ] }),
      spacer(),
      h2("\u25A1 \uACBD\uC7C1\uC0AC \uBE44\uAD50 \uBC0F \uD3EC\uC9C0\uC154\uB2DD"),
      pb("\u2460 \uACBD\uC7C1\uC0AC \uBE44\uAD50\uD45C"),
      new Table({ width: { size: W, type: WidthType.DXA }, columnWidths: [1800, 2568, 2568, 2570],
        rows: [
          new TableRow({ children: [mc("\uD56D\uBAA9", 1800, "1F2937", "FFFFFF", true), mc("\uB3C4\uADF8\uBA54\uC774\uD2B8", 2568, "1F2937", "FFFFFF", true), mc("\uD3AB\uD50C\uB798\uB2DB", 2568, "1F2937", "FFFFFF", true), mc("P.E.T \u2B50", 2570, "FF6B35", "FFFFFF", true)] }),
          new TableRow({ children: [mc("\uC124\uB9BD", 1800, "F9FAFB"), mc("2015\uB144 (10\uB144)", 2568), mc("2020\uB144 (6\uB144)", 2568), mc("2026\uB144 (\uC2E0\uC0DD)", 2570)] }),
          new TableRow({ children: [mc("\uD575\uC2EC", 1800, "F9FAFB"), mc("\uBC29\uBB38\uB3CC\uBD04 \uC608\uC57D", 2568), mc("\uC7A5\uB2E8\uAE30 \uB3CC\uBD04", 2568), mc("\uAE34\uAE09 10\uBD84 \uB9E4\uCE6D", 2570, "FFF7ED", "FF6B35", true)] }),
          new TableRow({ children: [mc("AI \uBD84\uC11D", 1800, "F9FAFB"), mc("\u274C", 2568), mc("\u274C", 2568), mc("\u2705 22\uAC1C \uCE74\uD14C\uACE0\uB9AC", 2570, "FFF7ED", "FF6B35", true)] }),
          new TableRow({ children: [mc("\uC704\uD0A4/\uCEE4\uBBA4\uB2C8\uD2F0", 1800, "F9FAFB"), mc("\u274C", 2568), mc("\u274C", 2568), mc("\u2705 28\uC885+9\uAC1C", 2570, "FFF7ED", "FF6B35", true)] }),
          new TableRow({ children: [mc("\uCD08\uAE30 \uD22C\uC790", 1800, "F9FAFB"), mc("5\uC5B5+", 2568), mc("\uBE44\uACF5\uAC1C", 2568), mc("0\uC6D0 (\uBB34\uC7AC\uACE0)", 2570, "ECFDF5", "059669", true)] }),
          new TableRow({ children: [mc("\uAC15\uC810", 1800, "F9FAFB"), mc("15\uB9CC\uAC74 \uC2E4\uC801", 2568), mc("\uADDC\uC81C\uC0CC\uB4DC\uBC15\uC2A4", 2568), mc("AI+\uCEE4\uBBA4\uB2C8\uD2F0 \uD1B5\uD569", 2570, "FFF7ED")] }),
        ] }),
      pSmall("\u203B \uACBD\uC7C1\uC0AC \uAC15\uC810\uC744 \uC778\uC815\uD558\uB418, P.E.T\uB9CC\uC758 \uCC28\uBCC4\uD654 \uC601\uC5ED(\uAE34\uAE09 \uD2B9\uD654 + AI + \uCF58\uD150\uCE20 \uD50C\uB77C\uC774\uD720)\uC5D0 \uC9D1\uC911"),
      spacer(),
      pb("\u2461 \uCC28\uBCC4\uD654 \uC804\uB7B5 \u2014 \uCF58\uD150\uCE20 \u2192 \uD2B8\uB798\uD53D \u2192 \uC804\uD658 \uD50C\uB77C\uC774\uD720"),
      p("1. \uD3AB-\uC704\uD0A4(28\uC885 \uC0C1\uC138 \uC815\uBCF4)\uB85C SEO \uC720\uAE30\uC801 \uD2B8\uB798\uD53D \uC720\uC785"),
      p("2. AI \uAC74\uAC15 \uBD84\uC11D\uACFC \uCEE4\uBBA4\uB2C8\uD2F0\uB85C \uC0AC\uC6A9\uC790 \uC815\uCC29"),
      p("3. \uAE34\uAE09 \uB3CC\uBD04 \uD544\uC694 \uC2DC \uC790\uC5F0\uC2A4\uB7FD\uAC8C \uC11C\uBE44\uC2A4 \uC804\uD658 (\uCE74\uCE74\uC624\uD1A1 \uB9E4\uCE6D)"),
      p("4. \uBB34\uC7AC\uACE0 Asset-light \uBAA8\uB378: \uC7AC\uACE0/\uBB3C\uB958 \uBE44\uC6A9 0\uC6D0, \uD30C\uD2B8\uB108 \uD504\uB9AC\uB79C\uC11C \uAD6C\uC870"),

      new Paragraph({ children: [new PageBreak()] }),

      // ===== SECTION 3 =====
      h1("3. \uC131\uC7A5 \uC804\uB7B5"),
      h2("\u25A1 \uC218\uC775 \uBAA8\uB378 \u2014 \uB3C8\uC758 \uD750\uB984"),
      new Table({ width: { size: W, type: WidthType.DXA }, columnWidths: [3168, 3168, 3170],
        rows: [new TableRow({ children: [
          statCard("\uD83D\uDC64", "75%", "\uD30C\uD2B8\uB108 \uC218\uC775", 3168),
          statCard("\uD83C\uDFE2", "21.5%", "P.E.T \uC218\uC218\uB8CC", 3168),
          statCard("\uD83D\uDCB3", "3.5%", "PG \uACB0\uC81C \uC218\uC218\uB8CC", 3170),
        ]})] }),
      pSmall("\uACE0\uAC1D \uACB0\uC81C \u2192 \uC5D0\uC2A4\uD06C\uB85C \uC608\uCE58 \u2192 \uCF00\uC5B4 \uC644\uB8CC \uD655\uC778 \u2192 \uC790\uB3D9 \uC815\uC0B0 (\uD30C\uD2B8\uB108 3.3% \uC6D0\uCC9C\uC9D5\uC218 \uD6C4 \uC9C0\uAE09)"),
      spacer(),
      h2("\u25A1 \uC6D4\uBCC4 \uB9C8\uC77C\uC2A4\uD1A4 \uBC0F KPI"),
      new Table({ width: { size: W, type: WidthType.DXA }, columnWidths: [1200, 1600, 1600, 1600, 1600, 1906],
        rows: [
          new TableRow({ children: [mc("\uC2DC\uAE30", 1200, "1F2937", "FFFFFF", true), mc("\uD30C\uD2B8\uB108", 1600, "1F2937", "FFFFFF", true), mc("\uC6D4 \uB9E4\uCE6D", 1600, "1F2937", "FFFFFF", true), mc("\uCD1D\uAC70\uB798\uC561", 1600, "1F2937", "FFFFFF", true), mc("P.E.T \uC218\uC775", 1600, "1F2937", "FFFFFF", true), mc("KPI", 1906, "1F2937", "FFFFFF", true)] }),
          new TableRow({ children: [mc("1\uAC1C\uC6D4", 1200), mc("5\uBA85", 1600), mc("10\uAC74", 1600), mc("30\uB9CC", 1600), mc("6.5\uB9CC", 1600, "FFF7ED", "FF6B35", true), mc("MAU 50", 1906)] }),
          new TableRow({ children: [mc("3\uAC1C\uC6D4", 1200), mc("10\uBA85", 1600), mc("50\uAC74", 1600), mc("175\uB9CC", 1600), mc("37.6\uB9CC", 1600, "FFF7ED", "FF6B35", true), mc("MAU 200", 1906)] }),
          new TableRow({ children: [mc("6\uAC1C\uC6D4", 1200), mc("20\uBA85", 1600), mc("150\uAC74", 1600), mc("600\uB9CC", 1600), mc("129\uB9CC", 1600, "FFF7ED", "FF6B35", true), mc("MAU 1,000", 1906)] }),
          new TableRow({ children: [mc("12\uAC1C\uC6D4", 1200), mc("50\uBA85", 1600), mc("500\uAC74", 1600), mc("2,250\uB9CC", 1600), mc("484\uB9CC", 1600, "FF6B35", "FFFFFF", true), mc("MAU 5,000", 1906)] }),
        ] }),
      spacer(),
      h2("\u25A1 \uB85C\uB4DC\uB9F5"),
      new Table({ width: { size: W, type: WidthType.DXA }, columnWidths: [2376, 2376, 2376, 2378],
        rows: [new TableRow({ children: [
          flowCard("Phase 1", "1~3\uAC1C\uC6D4", "\uD30C\uD2B8\uB108 5\uBA85 \uD655\uBCF4\n\uCE74\uD1A1 \uC218\uB3D9 \uB9E4\uCE6D\n\uCCAB 50\uAC74 \uB2EC\uC131", 2376),
          flowCard("Phase 2", "3~6\uAC1C\uC6D4", "PG \uACB0\uC81C \uC5F0\uB3D9\n\uC790\uB3D9 \uB9E4\uCE6D \uC2DC\uC2A4\uD15C\n\uC6D4 150\uAC74", 2376),
          flowCard("Phase 3", "6~12\uAC1C\uC6D4", "\uC11C\uC6B8 \uD655\uB300, PWA \uC571\nMAU 5,000\n\uC6D4 \uB9E4\uCD9C 2,000\uB9CC+", 2376),
          flowCard("Phase 4", "12\uAC1C\uC6D4~", "\uAD6C\uB3C5 \uBAA8\uB378\n\uCEE4\uBA38\uC2A4 \uC5F0\uACC4\n\uC2DC\uB9AC\uC988A \uC900\uBE44", 2378),
        ]})] }),
      spacer(),
      h2("\u25A1 \uC790\uAE08\uC870\uB2EC \uACC4\uD68D"),
      new Table({ width: { size: W, type: WidthType.DXA }, columnWidths: [2000, 3000, 4506],
        rows: [
          new TableRow({ children: [mc("\uB2E8\uACC4", 2000, "1F2937", "FFFFFF", true), mc("\uAE08\uC561", 3000, "1F2937", "FFFFFF", true), mc("\uC6A9\uB3C4 \uBC0F \uC870\uB2EC\uCC98", 4506, "1F2937", "FFFFFF", true)] }),
          new TableRow({ children: [mc("Seed", 2000, "FFF7ED"), mc("\uC57D 50\uB9CC\uC6D0", 3000), mcL("\uBC30\uC0C1\uCC45\uC784\uBCF4\uD5D8+\uB3C4\uBA54\uC778 (\uC790\uBE44)", 4506)] }),
          new TableRow({ children: [mc("Pre-A", 2000, "FFF7ED"), mc("\uC57D 2,000\uB9CC\uC6D0", 3000), mcL("\uC815\uBD80 \uC9C0\uC6D0\uC0AC\uC5C5 (U300, NEOs, \uCC3D\uC5C5\uC120\uB3C4\uB300\uD559)", 4506)] }),
          new TableRow({ children: [mc("Series A", 2000, "FFF7ED"), mc("\uC57D 1~3\uC5B5\uC6D0", 3000), mcL("\uC564\uC140\uB7EC\uB808\uC774\uD130 / \uC5D4\uC824\uD22C\uC790 (\uC6D4 \uB9E4\uCD9C 1,000\uB9CC\uC6D0 \uB2EC\uC131 \uC2DC)", 4506)] }),
        ] }),

      new Paragraph({ children: [new PageBreak()] }),

      // ===== SECTION 4 =====
      h1("4. \uD300 \uAD6C\uC131"),
      h2("\u25A1 \uCC3D\uC5C5\uC790\uC758 \uC5ED\uB7C9"),
      new Table({ width: { size: W, type: WidthType.DXA }, columnWidths: [2000, 7506],
        rows: [
          new TableRow({ children: [mc("\uC774\uB984", 2000, "FF6B35", "FFFFFF", true), mcL("\uAD8C\uB300\uC6B1 (\uB300\uD45C)", 7506)] }),
          new TableRow({ children: [mc("\uC18C\uC18D", 2000, "FFF7ED"), mcL("\uD55C\uC591\uB300\uD559\uAD50 \uB300\uD559\uC6D0 \uCC3D\uC5C5\uD559\uACFC \uC7AC\uD559", 7506)] }),
          new TableRow({ children: [mc("\uC790\uACA9", 2000, "FFF7ED"), mcL("\uBC18\uB824\uB3D9\uBB3C\uAD00\uB9AC\uC0AC 1\uAE09 \uCDE8\uB4DD \uC911", 7506)] }),
          new TableRow({ children: [mc("\uACBD\uD5D8", 2000, "FFF7ED"), mcL("\uBC18\uB824\uB3D9\uBB3C(\uACE0\uC591\uC774 3\uB9C8\uB9AC) \uC9C1\uC811 \uC591\uC721 / P.E.T \uC6F9 \uD50C\uB7AB\uD3FC \uC804\uCCB4 \uAE30\uD68D \uBC0F \uC6B4\uC601", 7506)] }),
          new TableRow({ children: [mc("\uD575\uC2EC \uC5ED\uB7C9", 2000, "FFF7ED"), mcL("\uB9B0\uC2A4\uD0C0\uD2B8\uC5C5 \uBC29\uC2DD MVP 1\uC8FC \uB9CC\uC5D0 \uAC1C\uBC1C/\uBC30\uD3EC, \uACE0\uAC1D \uD53C\uB4DC\uBC31 \uC989\uC2DC \uBC18\uC601, AI \uC99D\uC0C1 \uBD84\uC11D \uC2DC\uC2A4\uD15C \uC124\uACC4", 7506)] }),
          new TableRow({ children: [mc("R&R", 2000, "FFF7ED"), mcL("\uC0AC\uC5C5 \uAE30\uD68D / \uD30C\uD2B8\uB108 \uAC80\uC99D(\uBA74\uC811) / \uACE0\uAC1D \uC0C1\uB2F4 / \uC218\uC758\uD559 \uC790\uBB38 \uC5F0\uACC4", 7506)] }),
        ] }),
      spacer(),
      h2("\u25A1 \uD300 \uAD6C\uC131\uC6D0"),
      p("\u26A0\uFE0F \uB300\uC6B1\uB2D8\uC774 \uC9C1\uC811 \uC791\uC131\uD574\uC57C \uD560 \uBD80\uBD84 (\uCD5C\uC18C 2\uBA85 \uCD94\uAC00, \uCD1D 3~5\uC778 \uD544\uC218)", { bold: true, color: "DC2626" }),
      spacer(),
      new Table({ width: { size: W, type: WidthType.DXA }, columnWidths: [2000, 7506],
        rows: [
          new TableRow({ children: [mc("\uC774\uB984", 2000, "374151", "FFFFFF", true), mcL("(\uC774\uB984 \uC791\uC131)", 7506)] }),
          new TableRow({ children: [mc("\uC18C\uC18D", 2000, "F9FAFB"), mcL("(\uD559\uAD50/\uD559\uACFC \uC791\uC131)", 7506)] }),
          new TableRow({ children: [mc("R&R", 2000, "F9FAFB"), mcL("\uB9C8\uCF00\uD305/SNS \uC6B4\uC601 \u2014 (\uC5ED\uB7C9 \uC791\uC131)", 7506)] }),
        ] }),
      spacer(),
      new Table({ width: { size: W, type: WidthType.DXA }, columnWidths: [2000, 7506],
        rows: [
          new TableRow({ children: [mc("\uC774\uB984", 2000, "374151", "FFFFFF", true), mcL("(\uC774\uB984 \uC791\uC131)", 7506)] }),
          new TableRow({ children: [mc("\uC18C\uC18D", 2000, "F9FAFB"), mcL("(\uD559\uAD50/\uD559\uACFC \uC791\uC131)", 7506)] }),
          new TableRow({ children: [mc("R&R", 2000, "F9FAFB"), mcL("\uB514\uC790\uC778/UX \u2014 (\uC5ED\uB7C9 \uC791\uC131)", 7506)] }),
        ] }),
    ]
  }]
});

const outPath = path.join("C:", "Users", "dnlsd", "OneDrive", "\uBC14\uD0D5 \uD654\uBA74", "U300", "\uC0AC\uC5C5\uACC4\uD68D\uC11C_\uC644\uB8CC\uB428.docx");
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outPath, buffer);
  console.log("Created:", outPath, "(" + buffer.length + " bytes)");
});
