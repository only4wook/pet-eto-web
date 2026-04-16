const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType, PageBreak, Header, Footer, PageNumber } = require("docx");
const fs = require("fs");
const path = require("path");

const b = { style: BorderStyle.SINGLE, size: 1, color: "E5E7EB" };
const bs = { top: b, bottom: b, left: b, right: b };
const nb = { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } };
const cm = { top: 80, bottom: 80, left: 120, right: 120 };

function h1(t) { return new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 360, after: 200 }, border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "FF6B35", space: 1 } }, children: [new TextRun({ text: t, bold: true, size: 30, font: "Arial", color: "1F2937" })] }); }
function h2(t) { return new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 240, after: 120 }, children: [new TextRun({ text: t, bold: true, size: 24, font: "Arial", color: "374151" })] }); }
function p(t, o = {}) { return new Paragraph({ spacing: { after: 60, line: 360 }, children: [new TextRun({ text: t, size: 20, font: "Arial", color: "4B5563", ...o })] }); }
function pb(t, c) { return new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: t, size: 20, font: "Arial", bold: true, color: c || "1F2937" })] }); }
function spacer() { return new Paragraph({ spacing: { after: 120 }, children: [] }); }

function mc(t, w, bg, tc, bold) {
  return new TableCell({
    borders: bs, width: { size: w, type: WidthType.DXA }, margins: cm,
    shading: bg ? { fill: bg, type: ShadingType.CLEAR } : undefined,
    verticalAlign: "center",
    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: t, size: 18, font: "Arial", color: tc || "374151", bold: !!bold })] })]
  });
}
function mcL(t, w, bg) {
  return new TableCell({
    borders: bs, width: { size: w, type: WidthType.DXA }, margins: cm,
    shading: bg ? { fill: bg, type: ShadingType.CLEAR } : undefined,
    children: [new Paragraph({ children: [new TextRun({ text: t, size: 18, font: "Arial", color: "4B5563" })] })]
  });
}

// 시각화 카드 (아이콘 + 숫자 + 라벨)
function statCard(icon, value, label, w) {
  return new TableCell({
    borders: nb, width: { size: w, type: WidthType.DXA }, margins: { top: 120, bottom: 120, left: 80, right: 80 },
    shading: { fill: "FFF7ED", type: ShadingType.CLEAR },
    children: [
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: icon, size: 32, font: "Arial" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 40 }, children: [new TextRun({ text: value, size: 28, font: "Arial", bold: true, color: "FF6B35" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: label, size: 16, font: "Arial", color: "6B7280" })] }),
    ]
  });
}

// 플로우 화살표 카드
function flowCard(step, title, desc, w, isLast) {
  return new TableCell({
    borders: nb, width: { size: w, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 60, right: 60 },
    shading: { fill: "FF6B35", type: ShadingType.CLEAR },
    children: [
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: step, size: 14, font: "Arial", color: "FFFFFF", bold: true })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 40 }, children: [new TextRun({ text: title, size: 20, font: "Arial", color: "FFFFFF", bold: true })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 20 }, children: [new TextRun({ text: desc, size: 14, font: "Arial", color: "FFE0CC" })] }),
    ]
  });
}

const doc = new Document({
  styles: { default: { document: { run: { font: "Arial", size: 20 } } } },
  sections: [{
    properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1200, right: 1200, bottom: 1200, left: 1200 } } },
    headers: { default: new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "P.E.T \uD3AB\uC5D0\uD1A0 | 2026 \uD559\uC0DD \uCC3D\uC5C5\uC720\uB9DD\uD300 300+", size: 14, color: "9CA3AF" })] })] }) },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "- ", size: 14, color: "9CA3AF" }), new TextRun({ children: [PageNumber.CURRENT], size: 14, color: "9CA3AF" }), new TextRun({ text: " -", size: 14, color: "9CA3AF" })] })] }) },
    children: [
      // ===== PAGE 1: COVER =====
      spacer(), spacer(), spacer(),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: "2026 \uD559\uC0DD \uCC3D\uC5C5\uC720\uB9DD\uD300 300+", size: 22, color: "9CA3AF" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: "\uC0AC\uC5C5\uACC4\uD68D\uC11C", bold: true, size: 44, color: "1F2937" })] }),
      spacer(),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: "P.E.T \uD3AB\uC5D0\uD1A0", bold: true, size: 36, color: "FF6B35" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: "Pet Ever Total", size: 20, color: "9CA3AF", italics: true })] }),
      spacer(),
      new Paragraph({ alignment: AlignmentType.CENTER, border: { top: { style: BorderStyle.SINGLE, size: 2, color: "E5E7EB", space: 8 }, bottom: { style: BorderStyle.SINGLE, size: 2, color: "E5E7EB", space: 8 } }, spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "AI \uAC74\uAC15 \uBD84\uC11D\uACFC \uAC80\uC99D\uB41C \uD3AB\uC2DC\uD130 \uB9E4\uCE6D\uC73C\uB85C", size: 22, color: "4B5563" })]}),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: "1~2\uC778 \uAC00\uAD6C \uBC18\uB824\uC778\uC758 \uAE34\uAE09 \uB3CC\uBD04 \uACF5\uBC31\uC744 \uD574\uACB0\uD558\uB294 O2O \uCEE8\uC2DC\uC5B4\uC9C0 \uD50C\uB7AB\uD3FC", size: 22, color: "4B5563" })] }),
      spacer(), spacer(),
      // 핵심 수치 4개
      new Table({
        width: { size: 9506, type: WidthType.DXA },
        columnWidths: [2376, 2376, 2376, 2378],
        rows: [new TableRow({ children: [
          statCard("\uD83D\uDCF1", "MVP \uC644\uC131", "pet-eto.vercel.app", 2376),
          statCard("\uD83E\uDD16", "AI 22\uAC1C", "\uC99D\uC0C1 \uBD84\uC11D \uCE74\uD14C\uACE0\uB9AC", 2376),
          statCard("\uD83D\uDCD6", "28\uC885 \uC704\uD0A4", "\uD488\uC885\uBCC4 \uC0C1\uC138 \uC815\uBCF4", 2376),
          statCard("\uD83D\uDCB0", "0\uC6D0 \uCD08\uAE30\uD22C\uC790", "\uBB34\uC7AC\uACE0 \uBAA8\uB378", 2378),
        ]})]
      }),
      spacer(),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "\uD300\uBA85: P.E.T \uD3AB\uC5D0\uD1A0 | \uB300\uD45C: \uAD8C\uB300\uC6B1 | \uD55C\uC591\uB300\uD559\uAD50 \uB300\uD559\uC6D0 \uCC3D\uC5C5\uD559\uACFC", size: 18, color: "6B7280" })] }),

      new Paragraph({ children: [new PageBreak()] }),

      // ===== PAGE 2: SECTION 0 + 1 =====
      h1("0. \uC0AC\uC5C5 \uC544\uC774\uD15C \uAC1C\uC694"),
      new Table({
        width: { size: 9506, type: WidthType.DXA },
        columnWidths: [2000, 7506],
        rows: [
          new TableRow({ children: [mc("\uD300\uBA85", 2000, "FF6B35", "FFFFFF", true), mcL("P.E.T \uD3AB\uC5D0\uD1A0 (Pet Ever Total)", 7506)] }),
          new TableRow({ children: [mc("\uC544\uC774\uD15C", 2000, "FF6B35", "FFFFFF", true), mcL("AI \uAC74\uAC15 \uBD84\uC11D + \uAC80\uC99D\uB41C \uD3AB\uC2DC\uD130 \uB9E4\uCE6D\uC73C\uB85C 1~2\uC778 \uAC00\uAD6C \uBC18\uB824\uC778\uC758 \uAE34\uAE09 \uB3CC\uBD04 \uACF5\uBC31 \uD574\uACB0", 7506)] }),
          new TableRow({ children: [mc("\uCC3D\uC5C5 \uBAA9\uD45C", 2000, "FF6B35", "FFFFFF", true), mcL("\uBC18\uB824\uB3D9\uBB3C \uAE34\uAE09 \uB3CC\uBD04 \uC2DC\uC7A5\uC758 No.1 \uD50C\uB7AB\uD3FC\uC774 \uB418\uC5B4, \uBAA8\uB4E0 \uBC18\uB824\uC778\uC774 \uC548\uC2EC\uD558\uACE0 \uC544\uC774\uB97C \uB9E1\uAE38 \uC218 \uC788\uB294 \uC138\uC0C1\uC744 \uB9CC\uB4ED\uB2C8\uB2E4.", 7506)] }),
          new TableRow({ children: [mc("\uC0AC\uC774\uD2B8", 2000, "FF6B35", "FFFFFF", true), mcL("https://pet-eto.vercel.app", 7506)] }),
        ]
      }),

      spacer(),
      h1("1. \uBB38\uC81C \uC778\uC2DD"),
      h2("\u25A1 \uCC3D\uC5C5 \uBC30\uACBD \uBC0F \uAC1C\uBC1C\uB3D9\uAE30"),
      // 문제→원인→해결 시각화
      new Table({
        width: { size: 9506, type: WidthType.DXA },
        columnWidths: [3168, 3168, 3170],
        rows: [new TableRow({ children: [
          flowCard("STEP 1", "\uBB38\uC81C \uBC1C\uACAC", "1~2\uC778 \uAC00\uAD6C\uC758\n\uAE34\uAE09 \uB3CC\uBD04 \uACF5\uBC31", 3168),
          flowCard("STEP 2", "\uC6D0\uC778 \uBD84\uC11D", "\uAE30\uC874 \uC571\uC740 \uC608\uC57D \uC911\uC2EC\n\uD3AB\uC2DC\uD130 \uAC80\uC99D \uBD80\uC871", 3168),
          flowCard("STEP 3", "\uD574\uACB0 \uBC29\uC548", "10\uBD84 \uAE34\uAE09 \uB9E4\uCE6D\n3\uB2E8\uACC4 \uAC80\uC99D \uD30C\uD2B8\uB108", 3170),
        ]})]
      }),
      spacer(),
      p("\uB300\uD55C\uBBFC\uAD6D \uBC18\uB824\uB3D9\uBB3C \uC591\uC721 \uAC00\uAD6C\uB294 602\uB9CC(\u201925\uB144)\uC744 \uB118\uC5B4\uC130\uC73C\uBA70, 1~2\uC778 \uAC00\uAD6C\uAC00 \uC808\uBC18 \uC774\uC0C1\uC785\uB2C8\uB2E4. \uAC11\uC791\uC2A4\uB7EC\uC6B4 \uC57C\uADFC/\uCD9C\uC7A5 \uC2DC \uBC18\uB824\uB3D9\uBB3C\uC744 \uC548\uC804\uD558\uAC8C \uB9E1\uAE38 \uACF3\uC774 \uC5C6\uC5B4 \uADF9\uC2EC\uD55C \uC2A4\uD2B8\uB808\uC2A4\uB97C \uACBD\uD5D8\uD569\uB2C8\uB2E4."),
      p("\uB300\uD45C \uAD8C\uB300\uC6B1\uC740 \uD55C\uC591\uB300 \uB300\uD559\uC6D0 \uCC3D\uC5C5\uD559\uACFC \uC7AC\uD559 \uC911 \uC9C1\uC811 \uACE0\uC591\uC774 2\uB9C8\uB9AC\uB97C \uD0A4\uC6B0\uBA74\uC11C \uC774 \u2018\uB3CC\uBD04 \uACF5\uBC31\u2019\uC744 \uCCB4\uAC10\uD588\uC2B5\uB2C8\uB2E4. \uAE30\uC874 \uC571\uC740 \uC608\uC57D \uC911\uC2EC\uC73C\uB85C \u2018\uC624\uB298 \uB2F9\uC7A5\u2019 \uAE34\uAE09 \uB3CC\uBD04\uC5D0\uB294 \uBD80\uC801\uD569\uD588\uACE0, \uD3AB\uC2DC\uD130 \uAC80\uC99D\uB3C4 \uBD88\uCDA9\uBD84\uD588\uC2B5\uB2C8\uB2E4."),
      spacer(),
      h2("\u25A1 \uBAA9\uD45C\uC2DC\uC7A5 \uBD84\uC11D"),
      // TAM/SAM/SOM 시각화
      new Table({
        width: { size: 9506, type: WidthType.DXA },
        columnWidths: [3168, 3168, 3170],
        rows: [
          new TableRow({ children: [
            mc("TAM", 3168, "FEF3C7", "92400E", true), mc("SAM", 3168, "FFF7ED", "C2410C", true), mc("SOM", 3170, "FF6B35", "FFFFFF", true),
          ]}),
          new TableRow({ children: [
            mc("\uBC18\uB824\uB3D9\uBB3C \uC11C\uBE44\uC2A4 \uC2DC\uC7A5", 3168), mc("\uC218\uB3C4\uAD8C 1~2\uC778 \uAC00\uAD6C", 3168), mc("\uACE0\uC591\uC2DC+\uC11C\uC6B8 \uC11C\uBD81\uAD8C", 3170),
          ]}),
          new TableRow({ children: [
            mc("\uC57D 2\uC870\uC6D0", 3168, null, "FF6B35", true), mc("\uC57D 3,000\uC5B5\uC6D0", 3168, null, "FF6B35", true), mc("\uCD08\uAE30 1\uB144 7,500\uB9CC\uC6D0", 3170, null, "FF6B35", true),
          ]}),
        ]
      }),

      new Paragraph({ children: [new PageBreak()] }),

      // ===== PAGE 3: SECTION 2 =====
      h1("2. \uC2E4\uD604\uAC00\uB2A5\uC131"),
      h2("\u25A1 MVP \uD604\uD669 \u2014 pet-eto.vercel.app"),
      // MVP 기능 6개 카드
      new Table({
        width: { size: 9506, type: WidthType.DXA },
        columnWidths: [3168, 3168, 3170],
        rows: [
          new TableRow({ children: [
            statCard("\uD83E\uDD16", "AI \uC99D\uC0C1 \uBD84\uC11D", "22\uAC1C \uCE74\uD14C\uACE0\uB9AC\n300+ \uD0A4\uC6CC\uB4DC", 3168),
            statCard("\uD83D\uDCD6", "\uD3AB-\uC704\uD0A4", "28\uC885 \uD488\uC885 \uC815\uBCF4\n\uC9C8\uBCD1 \uBE44\uC6A9 \uD3EC\uD568", 3168),
            statCard("\uD83D\uDCAC", "\uCEE4\uBBA4\uB2C8\uD2F0", "9\uAC1C \uCE74\uD14C\uACE0\uB9AC\n\uD6C4\uAE30/\uB17C\uBB38/\uD589\uC0AC", 3170),
          ]}),
          new TableRow({ children: [
            statCard("\uD83D\uDCF1", "\uCE74\uCE74\uC624\uD1A1 \uC5F0\uB3D9", "1:1 \uAE34\uAE09 \uB9E4\uCE6D\n\uCC44\uD305 \uC0C1\uB2F4", 3168),
            statCard("\uD83D\uDD12", "\uC18C\uC15C \uB85C\uADF8\uC778", "\uAD6C\uAE00/\uCE74\uCE74\uC624\nOAuth \uc5F0\uB3D9", 3168),
            statCard("\uD83D\uDCCA", "\uC790\uB3D9 \uAC70\uB798 \uAE30\uB85D", "Google Sheets\n\uC2E4\uC2DC\uAC04 \uC5F0\uB3D9", 3170),
          ]}),
        ]
      }),
      spacer(),
      h2("\u25A1 \uACBD\uC7C1\uC0AC \uBE44\uAD50"),
      new Table({
        width: { size: 9506, type: WidthType.DXA },
        columnWidths: [1800, 2568, 2568, 2570],
        rows: [
          new TableRow({ children: [mc("\uD56D\uBAA9", 1800, "1F2937", "FFFFFF", true), mc("\uB3C4\uADF8\uBA54\uC774\uD2B8", 2568, "1F2937", "FFFFFF", true), mc("\uD3AB\uD50C\uB798\uB2DB", 2568, "1F2937", "FFFFFF", true), mc("P.E.T \u2B50", 2570, "FF6B35", "FFFFFF", true)] }),
          new TableRow({ children: [mc("\uD575\uC2EC", 1800, "F9FAFB"), mc("\uBC29\uBB38\uB3CC\uBD04 \uC608\uC57D", 2568), mc("\uC7A5\uB2E8\uAE30 \uB3CC\uBD04", 2568), mc("\uAE34\uAE09 10\uBD84 \uB9E4\uCE6D", 2570, "FFF7ED", "FF6B35", true)] }),
          new TableRow({ children: [mc("AI \uBD84\uC11D", 1800, "F9FAFB"), mc("\u274C \uC5C6\uC74C", 2568), mc("\u274C \uC5C6\uC74C", 2568), mc("\u2705 22\uAC1C \uCE74\uD14C\uACE0\uB9AC", 2570, "FFF7ED", "FF6B35", true)] }),
          new TableRow({ children: [mc("\uC704\uD0A4", 1800, "F9FAFB"), mc("\u274C \uC5C6\uC74C", 2568), mc("\u274C \uC5C6\uC74C", 2568), mc("\u2705 28\uC885 \uC0C1\uC138", 2570, "FFF7ED", "FF6B35", true)] }),
          new TableRow({ children: [mc("\uCEE4\uBBA4\uB2C8\uD2F0", 1800, "F9FAFB"), mc("\u274C \uC5C6\uC74C", 2568), mc("\u274C \uC5C6\uC74C", 2568), mc("\u2705 9\uAC1C \uCE74\uD14C\uACE0\uB9AC", 2570, "FFF7ED", "FF6B35", true)] }),
          new TableRow({ children: [mc("\uCD08\uAE30 \uD22C\uC790", 1800, "F9FAFB"), mc("\uC218\uC5B5\uC6D0", 2568), mc("\uC218\uC5B5\uC6D0", 2568), mc("\u2705 0\uC6D0 (\uBB34\uC7AC\uACE0)", 2570, "ECFDF5", "059669", true)] }),
        ]
      }),

      new Paragraph({ children: [new PageBreak()] }),

      // ===== PAGE 4: SECTION 3 =====
      h1("3. \uC131\uC7A5 \uC804\uB7B5"),
      h2("\u25A1 \uBE44\uC988\uB2C8\uC2A4 \uBAA8\uB378 \u2014 \uB3C8\uC758 \uD750\uB984"),
      // 수익 모델 시각화
      new Table({
        width: { size: 9506, type: WidthType.DXA },
        columnWidths: [3168, 3168, 3170],
        rows: [new TableRow({ children: [
          statCard("\uD83D\uDC64", "75%", "\uD30C\uD2B8\uB108 \uC218\uC775", 3168),
          statCard("\uD83C\uDFE2", "21.5%", "P.E.T \uC218\uC218\uB8CC", 3168),
          statCard("\uD83D\uDCB3", "3.5%", "PG \uACB0\uC81C \uC218\uC218\uB8CC", 3170),
        ]})]
      }),
      spacer(),
      h2("\u25A1 \uB9E4\uCD9C \uC2DC\uBBAC\uB808\uC774\uC158"),
      new Table({
        width: { size: 9506, type: WidthType.DXA },
        columnWidths: [2376, 2376, 2376, 2378],
        rows: [
          new TableRow({ children: [mc("\uC2DC\uAE30", 2376, "1F2937", "FFFFFF", true), mc("\uC6D4 \uB9E4\uCE6D", 2376, "1F2937", "FFFFFF", true), mc("\uCD1D \uAC70\uB798\uC561", 2376, "1F2937", "FFFFFF", true), mc("P.E.T \uC218\uC775", 2378, "1F2937", "FFFFFF", true)] }),
          new TableRow({ children: [mc("1\uAC1C\uC6D4\uCC28", 2376), mc("10\uAC74", 2376), mc("30\uB9CC\uC6D0", 2376), mc("6.5\uB9CC\uC6D0", 2378, "FFF7ED", "FF6B35", true)] }),
          new TableRow({ children: [mc("3\uAC1C\uC6D4\uCC28", 2376), mc("50\uAC74", 2376), mc("175\uB9CC\uC6D0", 2376), mc("37.6\uB9CC\uC6D0", 2378, "FFF7ED", "FF6B35", true)] }),
          new TableRow({ children: [mc("6\uAC1C\uC6D4\uCC28", 2376), mc("150\uAC74", 2376), mc("600\uB9CC\uC6D0", 2376), mc("129\uB9CC\uC6D0", 2378, "FFF7ED", "FF6B35", true)] }),
          new TableRow({ children: [mc("12\uAC1C\uC6D4\uCC28", 2376), mc("500\uAC74", 2376), mc("2,250\uB9CC\uC6D0", 2376), mc("484\uB9CC\uC6D0", 2378, "FF6B35", "FFFFFF", true)] }),
        ]
      }),
      spacer(),
      h2("\u25A1 \uB85C\uB4DC\uB9F5"),
      new Table({
        width: { size: 9506, type: WidthType.DXA },
        columnWidths: [2376, 2376, 2376, 2378],
        rows: [new TableRow({ children: [
          flowCard("Phase 1", "1~3\uAC1C\uC6D4", "\uD30C\uD2B8\uB108 5\uBA85\n\uCE74\uD1A1 \uC218\uB3D9 \uB9E4\uCE6D\n\uCCAB 50\uAC74", 2376),
          flowCard("Phase 2", "3~6\uAC1C\uC6D4", "PG \uACB0\uC81C \uC5F0\uB3D9\n\uC790\uB3D9 \uB9E4\uCE6D\n\uC6D4 150\uAC74", 2376),
          flowCard("Phase 3", "6~12\uAC1C\uC6D4", "\uC11C\uC6B8 \uD655\uB300\nPWA \uC571 \uC804\uD658\n\uC6D4 500\uAC74", 2376),
          flowCard("Phase 4", "12\uAC1C\uC6D4~", "\uAD6C\uB3C5 \uBAA8\uB378\n\uCEE4\uBA38\uC2A4 \uC5F0\uACC4\n\uC2DC\uB9AC\uC988A", 2378),
        ]})]
      }),
      spacer(),
      h2("\u25A1 \uC790\uAE08\uC870\uB2EC \uACC4\uD68D"),
      p("\uCD08\uAE30 \uBE44\uC6A9: \uC57D 50\uB9CC\uC6D0 (\uBC30\uC0C1\uCC45\uC784\uBCF4\uD5D8 + \uB3C4\uBA54\uC778)", { bold: true }),
      p("1\uB2E8\uACC4: \uC790\uBE44 + \uC815\uBD80 \uC9C0\uC6D0\uC0AC\uC5C5 (U300, NEOs)"),
      p("2\uB2E8\uACC4: \uC5D4\uC824\uD22C\uC790 / \uC561\uC140\uB7EC\uB808\uC774\uD130 (\uC6D4 \uB9E4\uCD9C 100\uB9CC\uC6D0 \uB2EC\uC131 \uC2DC)"),
      p("3\uB2E8\uACC4: \uC2DC\uB9AC\uC988A (\uC6D4 \uB9E4\uCD9C 1,000\uB9CC\uC6D0 \uB2EC\uC131 \uC2DC)"),

      new Paragraph({ children: [new PageBreak()] }),

      // ===== PAGE 5: SECTION 4 =====
      h1("4. \uD300 \uAD6C\uC131"),
      h2("\u25A1 \uCC3D\uC5C5\uC790\uC758 \uC5ED\uB7C9"),
      new Table({
        width: { size: 9506, type: WidthType.DXA },
        columnWidths: [2500, 7006],
        rows: [
          new TableRow({ children: [mc("\uC774\uB984", 2500, "FF6B35", "FFFFFF", true), mcL("\uAD8C\uB300\uC6B1 (\uB300\uD45C)", 7006)] }),
          new TableRow({ children: [mc("\uC18C\uC18D", 2500, "FFF7ED"), mcL("\uD55C\uC591\uB300\uD559\uAD50 \uB300\uD559\uC6D0 \uCC3D\uC5C5\uD559\uACFC \uC7AC\uD559", 7006)] }),
          new TableRow({ children: [mc("\uC790\uACA9", 2500, "FFF7ED"), mcL("\uBC18\uB824\uB3D9\uBB3C\uAD00\uB9AC\uC0AC 1\uAE09 \uCDE8\uB4DD \uC911", 7006)] }),
          new TableRow({ children: [mc("\uACBD\uD5D8", 2500, "FFF7ED"), mcL("\uBC18\uB824\uB3D9\uBB3C(\uACE0\uC591\uC774 2\uB9C8\uB9AC) \uC9C1\uC811 \uC591\uC721", 7006)] }),
          new TableRow({ children: [mc("\uC5ED\uD560", 2500, "FFF7ED"), mcL("P.E.T \uC6F9 \uD50C\uB7AB\uD3FC \uAE30\uD68D \uBC0F \uC6B4\uC601 (AI \uD3EC\uD568 \uC804 \uAE30\uB2A5 \uC9C1\uC811 \uAE30\uD68D)", 7006)] }),
          new TableRow({ children: [mc("\uAE30\uC5C5\uAC00\uC815\uC2E0", 2500, "FFF7ED"), mcL("\uB9B0\uC2A4\uD0C0\uD2B8\uC5C5 \uBC29\uC2DD MVP 1\uC8FC \uB9CC\uC5D0 \uAC1C\uBC1C/\uBC30\uD3EC, \uACE0\uAC1D \uD53C\uB4DC\uBC31 \uC989\uC2DC \uBC18\uC601", 7006)] }),
        ]
      }),
      spacer(),
      h2("\u25A1 \uD300 \uAD6C\uC131\uC6D0"),
      p("\u26A0\uFE0F \uB300\uC6B1\uB2D8\uC774 \uC9C1\uC811 \uC791\uC131\uD574\uC57C \uD560 \uBD80\uBD84 (\uCD5C\uC18C 2\uBA85 \uCD94\uAC00 \uD544\uC694, \uCD1D 3~5\uC778 \uD544\uC218)", { bold: true, color: "DC2626" }),
      spacer(),
      new Table({
        width: { size: 9506, type: WidthType.DXA },
        columnWidths: [2500, 7006],
        rows: [
          new TableRow({ children: [mc("\uC774\uB984", 2500, "374151", "FFFFFF", true), mcL("(\uC774\uB984 \uC791\uC131 \uD544\uC694)", 7006)] }),
          new TableRow({ children: [mc("\uC18C\uC18D", 2500, "F9FAFB"), mcL("(\uD559\uAD50/\uD559\uACFC \uC791\uC131 \uD544\uC694)", 7006)] }),
          new TableRow({ children: [mc("\uC5ED\uD560", 2500, "F9FAFB"), mcL("\uB9C8\uCF00\uD305/\uC6B4\uC601", 7006)] }),
          new TableRow({ children: [mc("\uC5ED\uB7C9", 2500, "F9FAFB"), mcL("(\uC791\uC131 \uD544\uC694)", 7006)] }),
        ]
      }),
      spacer(),
      new Table({
        width: { size: 9506, type: WidthType.DXA },
        columnWidths: [2500, 7006],
        rows: [
          new TableRow({ children: [mc("\uC774\uB984", 2500, "374151", "FFFFFF", true), mcL("(\uC774\uB984 \uC791\uC131 \uD544\uC694)", 7006)] }),
          new TableRow({ children: [mc("\uC18C\uC18D", 2500, "F9FAFB"), mcL("(\uD559\uAD50/\uD559\uACFC \uC791\uC131 \uD544\uC694)", 7006)] }),
          new TableRow({ children: [mc("\uC5ED\uD560", 2500, "F9FAFB"), mcL("\uB514\uC790\uC778/UX", 7006)] }),
          new TableRow({ children: [mc("\uC5ED\uB7C9", 2500, "F9FAFB"), mcL("(\uC791\uC131 \uD544\uC694)", 7006)] }),
        ]
      }),
    ]
  }]
});

const outPath = path.join("C:", "Users", "dnlsd", "OneDrive", "\uBC14\uD0D5 \uD654\uBA74", "U300", "\uC0AC\uC5C5\uACC4\uD68D\uC11C_\uC644\uB8CC\uB428.docx");
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outPath, buffer);
  console.log("Created:", outPath, "(" + buffer.length + " bytes)");
});
