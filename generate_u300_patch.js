const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType, PageBreak, Header, Footer, PageNumber } = require("docx");
const fs = require("fs");
const path = require("path");

const b = { style: BorderStyle.SINGLE, size: 1, color: "E5E7EB" };
const bs = { top: b, bottom: b, left: b, right: b };
const nb = { top:{style:BorderStyle.NONE},bottom:{style:BorderStyle.NONE},left:{style:BorderStyle.NONE},right:{style:BorderStyle.NONE} };
const cm = { top: 80, bottom: 80, left: 120, right: 120 };

function h1(t) { return new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 360, after: 200 }, border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "FF6B35", space: 1 } }, children: [new TextRun({ text: t, bold: true, size: 30, font: "Arial", color: "1F2937" })] }); }
function h2(t) { return new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 240, after: 120 }, children: [new TextRun({ text: t, bold: true, size: 24, font: "Arial", color: "374151" })] }); }
function p(t, o={}) { return new Paragraph({ spacing: { after: 60, line: 340 }, children: [new TextRun({ text: t, size: 20, font: "Arial", color: "4B5563", ...o })] }); }
function pb(t, c) { return new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: t, size: 20, font: "Arial", bold: true, color: c || "1F2937" })] }); }
function pSmall(t) { return new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: t, size: 16, font: "Arial", color: "9CA3AF", italics: true })] }); }
function spacer() { return new Paragraph({ spacing: { after: 120 }, children: [] }); }
function mc(t,w,bg,tc,bold) { return new TableCell({ borders: bs, width: { size: w, type: WidthType.DXA }, margins: cm, shading: bg ? { fill: bg, type: ShadingType.CLEAR } : undefined, verticalAlign: "center", children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: t, size: 18, font: "Arial", color: tc||"374151", bold: !!bold })] })] }); }
function mcL(t,w,bg) { return new TableCell({ borders: bs, width: { size: w, type: WidthType.DXA }, margins: cm, shading: bg ? { fill: bg, type: ShadingType.CLEAR } : undefined, children: [new Paragraph({ children: [new TextRun({ text: t, size: 18, font: "Arial", color: "4B5563" })] })] }); }
function statCard(i,v,l,w) { return new TableCell({ borders: nb, width: { size: w, type: WidthType.DXA }, margins: { top: 120, bottom: 120, left: 80, right: 80 }, shading: { fill: "FFF7ED", type: ShadingType.CLEAR }, children: [ new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: i, size: 32 })] }), new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 40 }, children: [new TextRun({ text: v, size: 28, font: "Arial", bold: true, color: "FF6B35" })] }), new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: l, size: 16, font: "Arial", color: "6B7280" })] }) ] }); }
function flowCard(s,t,d,w) { return new TableCell({ borders: nb, width: { size: w, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 60, right: 60 }, shading: { fill: "FF6B35", type: ShadingType.CLEAR }, children: [ new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: s, size: 14, font: "Arial", color: "FFFFFF", bold: true })] }), new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 40 }, children: [new TextRun({ text: t, size: 20, font: "Arial", color: "FFFFFF", bold: true })] }), new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 20 }, children: [new TextRun({ text: d, size: 14, font: "Arial", color: "FFE0CC" })] }) ] }); }

const W = 9506;

// 빠진 5개 섹션만 별도 파일로 생성 (대욱님이 복사 붙여넣기 용)
const doc = new Document({
  styles: { default: { document: { run: { font: "Arial", size: 20 } } } },
  sections: [{
    properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1200, right: 1200, bottom: 1200, left: 1200 } } },
    children: [
      // ===== 1. 창업아이템의 목적 및 필요성 =====
      h2("\u25A1 \uCC3D\uC5C5\uC544\uC774\uD15C\uC758 \uBAA9\uC801 \uBC0F \uD544\uC694\uC131"),
      spacer(),
      pb("[\uBB38\uC81C] \uACE0\uAC1D\uC758 \uD575\uC2EC \uACE0\uCDA9 (Pain Point)"),
      p("\u2022 1~2\uC778 \uAC00\uAD6C \uBC18\uB824\uC778\uC774 \uAC11\uC791\uC2A4\uB7EC\uC6B4 \uC57C\uADFC/\uCD9C\uC7A5/\uC9C8\uBCD1 \uC2DC \uBC18\uB824\uB3D9\uBB3C\uC744 \uC548\uC804\uD558\uAC8C \uB9E1\uAE38 \uACF3\uC774 \uC5C6\uC74C"),
      p("\u2022 \uAE30\uC874 \uD3AB\uC2DC\uD130 \uC571(\uB3C4\uADF8\uBA54\uC774\uD2B8, \uD3AB\uD50C\uB798\uB2DB)\uC740 \uC608\uC57D\uC5D0 24\uC2DC\uAC04+ \uC18C\uC694 \u2192 '\uC624\uB298 \uB2F9\uC7A5' \uAE34\uAE09 \uB3CC\uBD04 \uBD88\uAC00\uB2A5"),
      p("\u2022 \uD3AB\uC2DC\uD130 \uC2E0\uC6D0 \uAC80\uC99D \uBD80\uC871 \u2192 \uC9D1 \uC5F4\uC1E0\uB97C \uB0A8\uC5D0\uAC8C \uB9E1\uAE30\uB294 \uBD88\uC548"),
      p("\u2022 \uBC18\uB824\uB3D9\uBB3C \uC720\uAE30 \uC5F0 10.7\uB9CC \uB9C8\uB9AC \uC911 \uC0C1\uB2F9\uC218\uAC00 '\uB3CC\uBD04 \uACF5\uBC31'\uC73C\uB85C \uC778\uD55C \uC720\uAE30 (\uB3D9\uBB3C\uBCF4\uD638\uAD00\uB9AC\uC2DC\uC2A4\uD15C, 2024)"),
      spacer(),
      pb("[\uD574\uACB0] P.E.T\uC758 \uD575\uC2EC \uC194\uB8E8\uC158"),
      // 문제→솔루션 대응 표
      new Table({ width: { size: W, type: WidthType.DXA }, columnWidths: [4753, 4753],
        rows: [
          new TableRow({ children: [mc("\uACE0\uAC1D\uC758 \uACE0\uCDA9 (Pain Point)", 4753, "FEF2F2", "DC2626", true), mc("P.E.T\uC758 \uD574\uACB0\uCC45 (Solution)", 4753, "ECFDF5", "059669", true)] }),
          new TableRow({ children: [mcL("\uAE34\uAE09 \uC0C1\uD669\uC5D0 \uD3AB\uC2DC\uD130\uB97C \uCC3E\uC744 \uC218 \uC5C6\uC74C (24\uC2DC\uAC04+ \uC18C\uC694)", 4753), mcL("\uCE74\uCE74\uC624\uD1A1 \uAE30\uBC18 10\uBD84 \uB0B4 \uAE34\uAE09 \uB9E4\uCE6D", 4753)] }),
          new TableRow({ children: [mcL("\uD3AB\uC2DC\uD130 \uC2E0\uBB38\uC131 \uBD88\uC548 (\uC9D1 \uC5F4\uC1E0 \uB9E1\uAE30\uAE30 \uD798\uB4EC)", 4753), mcL("3\uB2E8\uACC4 \uAC80\uC99D (\uC2E0\uC6D0\uC870\uD68C \u2192 \uBA74\uC811 \u2192 \uC2DC\uBC94\uCF00\uC5B4) + \uC2E4\uC2DC\uAC04 \uC0AC\uC9C4 \uBCF4\uACE0", 4753)] }),
          new TableRow({ children: [mcL("\uBC18\uB824\uB3D9\uBB3C \uAC74\uAC15 \uBB38\uC81C \uC2DC \uC989\uAC01 \uB300\uCC98 \uBAA8\uB984", 4753), mcL("AI \uC99D\uC0C1 \uBD84\uC11D (22\uAC1C \uCE74\uD14C\uACE0\uB9AC) + GPS \uAE30\uBC18 \uB3D9\uBB3C\uBCD1\uC6D0 \uC790\uB3D9 \uC548\uB0B4", 4753)] }),
          new TableRow({ children: [mcL("\uD488\uC885\uBCC4 \uAC74\uAC15 \uC815\uBCF4/\uBE44\uC6A9 \uD30C\uC545 \uC5B4\uB824\uC6C0", 4753), mcL("\uD3AB-\uC704\uD0A4 28\uC885 \uC0C1\uC138 \uC815\uBCF4 (\uC9C8\uBCD1 \uBE44\uC6A9, \uCD08\uBCF4 \uAC00\uC774\uB4DC)", 4753)] }),
        ] }),
      spacer(),
      pb("[\uC815\uB7C9\uC801 \uD0C0\uB2F9\uC131]"),
      p("\u2022 \uAE34\uAE09 \uB3CC\uBD04 1\uD68C \uBE44\uC6A9: 30,000\uC6D0/1\uC2DC\uAC04 \u2014 \uC57C\uADFC \uC218\uB2F9(\uC2DC\uAC04\uB2F9 \uC57D 25,000\uC6D0) \uB300\uBE44 \uD569\uB9AC\uC801"),
      p("\u2022 \uACE0\uAC1D \uC2DC\uAC04 \uC808\uAC10: \uAE30\uC874 24\uC2DC\uAC04+ \u2192 10\uBD84 (\uC2DC\uAC04 \uC808\uAC10 99.3%)"),
      p("\u2022 \uC2E0\uB8B0\uB3C4 \uD5A5\uC0C1: 3\uB2E8\uACC4 \uAC80\uC99D\uC73C\uB85C \uAE30\uC874 \uB2F9\uADFC\uB9C8\uCF13 \uC218\uC900 \u2192 \uC804\uBB38 \uD50C\uB7AB\uD3FC \uC218\uC900\uC73C\uB85C \uAC80\uC99D \uAC15\uD654"),

      new Paragraph({ children: [new PageBreak()] }),

      // ===== 2. 사업화 전략 =====
      h2("\u25A1 \uC0AC\uC5C5\uD654 \uC804\uB7B5"),
      spacer(),
      pb("[\uBE44\uC988\uB2C8\uC2A4 \uBAA8\uB378 \u2014 \uD55C \uBB38\uC7A5 \uC694\uC57D]"),
      p("'\uAC80\uC99D\uB41C \uD3AB\uC2DC\uD130'\uB97C '\uAE34\uAE09 \uBC18\uB824\uC778'\uC5D0\uAC8C \uC5F0\uACB0\uD558\uACE0, \uAC74\uB2F9 21.5% \uC911\uAC1C \uC218\uC218\uB8CC\uB97C \uBC1B\uB294 O2O \uD50C\uB7AB\uD3FC \uBE44\uC988\uB2C8\uC2A4", { bold: true, color: "FF6B35" }),
      spacer(),
      pb("[\uC218\uC775 \uAD6C\uC870 \u2014 \uB3C8\uC744 \uC9C0\uBD88\uD558\uB294 \uC8FC\uCCB4\uC640 \uC774\uC720]"),
      new Table({ width: { size: W, type: WidthType.DXA }, columnWidths: [2400, 2400, 2400, 2306],
        rows: [
          new TableRow({ children: [mc("\uC218\uC775\uC6D0", 2400, "1F2937", "FFFFFF", true), mc("\uC9C0\uBD88 \uC8FC\uCCB4", 2400, "1F2937", "FFFFFF", true), mc("\uACFC\uAE08 \uBC29\uC2DD", 2400, "1F2937", "FFFFFF", true), mc("\uAE30\uB300 \uBE44\uC911", 2306, "1F2937", "FFFFFF", true)] }),
          new TableRow({ children: [mc("\uC911\uAC1C \uC218\uC218\uB8CC", 2400), mc("\uACE0\uAC1D (\uBC18\uB824\uC778)", 2400), mc("\uAC74\uB2F9 21.5%", 2400), mc("70%", 2306, "FF6B35", "FFFFFF", true)] }),
          new TableRow({ children: [mc("\uC81C\uD734 \uAD11\uACE0", 2400), mc("\uB3D9\uBB3C\uBCD1\uC6D0/\uBBF8\uC6A9\uC2E4", 2400), mc("\uC6D4\uC815\uC561 5~20\uB9CC\uC6D0", 2400), mc("15%", 2306, "FFF7ED")] }),
          new TableRow({ children: [mc("\uD504\uB9AC\uBBF8\uC5C4 \uAD6C\uB3C5", 2400), mc("\uACE0\uAC1D (\uBC18\uB824\uC778)", 2400), mc("\uC6D4 15\uB9CC\uC6D0 (\uC0B0\uCC45+\uAE34\uAE09)", 2400), mc("10%", 2306, "FFF7ED")] }),
          new TableRow({ children: [mc("\uCEE4\uBA38\uC2A4 \uC5F0\uACC4", 2400), mc("\uACE0\uAC1D (\uBC18\uB824\uC778)", 2400), mc("\uB9DE\uCDA4\uD615 \uC0AC\uB8CC/\uC6A9\uD488 \uD310\uB9E4", 2400), mc("5%", 2306, "FFF7ED")] }),
        ] }),
      pSmall("Tip: \uBCF5\uC7A1\uD55C \uAD6C\uC870\uB3C4\uB97C \uD53C\uD558\uACE0, \uB3C8\uC744 \uC9C0\uBD88\uD558\uB294 \uC8FC\uCCB4\uC640 \uADF8\uB4E4\uC774 \uC9C0\uBD88\uD558\uB294 \uC774\uC720\uAC00 \uC9C1\uAD00\uC801\uC73C\uB85C \uBCF4\uC5EC\uC57C \uD568 (\uC774\uAD11\uD5CC \uAD50\uC218\uB2D8)"),
      spacer(),
      pb("[\uC0AC\uC5C5\uD654 \uB85C\uB4DC\uB9F5 \u2014 \uB2E8\uACC4\uBCC4 \uCD94\uC9C4\uC77C\uC815]"),
      new Table({ width: { size: W, type: WidthType.DXA }, columnWidths: [1200, 2800, 2800, 2706],
        rows: [
          new TableRow({ children: [mc("\uC2DC\uAE30", 1200, "1F2937", "FFFFFF", true), mc("\uCD94\uC9C4 \uB0B4\uC6A9", 2800, "1F2937", "FFFFFF", true), mc("\uC131\uACFC \uC9C0\uD45C (KPI)", 2800, "1F2937", "FFFFFF", true), mc("\uC18C\uC694 \uC790\uAE08", 2706, "1F2937", "FFFFFF", true)] }),
          new TableRow({ children: [mc("1~2\uC6D4", 1200, "FFF7ED"), mcL("\uD30C\uD2B8\uB108 5\uBA85 \uD655\uBCF4, \uCE74\uCE74\uC624\uD1A1 \uC218\uB3D9 \uB9E4\uCE6D \uC2DC\uC791, \uBB34\uB8CC \uCCB4\uD5D8 10\uAC74", 2800), mcL("\uB204\uC801 \uB9E4\uCE6D 10\uAC74, \uD6C4\uAE30 5\uAC74", 2800), mcL("0\uC6D0 (\uC790\uBE44)", 2706)] }),
          new TableRow({ children: [mc("3~4\uC6D4", 1200, "FFF7ED"), mcL("\uD30C\uD2B8\uB108 10\uBA85, \uB2F9\uADFC\uB9C8\uCF13/SNS \uB9C8\uCF00\uD305, \uC81C\uD734 \uBCD1\uC6D0 1\uACF3", 2800), mcL("\uB204\uC801 50\uAC74, MAU 200, \uD6C4\uAE30 20\uAC74", 2800), mcL("\uC57D 30\uB9CC\uC6D0", 2706)] }),
          new TableRow({ children: [mc("5~6\uC6D4", 1200, "FFF7ED"), mcL("PG \uACB0\uC81C \uC5F0\uB3D9, \uC790\uB3D9 \uB9E4\uCE6D \uC2DC\uC2A4\uD15C, \uC11C\uC6B8 \uD655\uB300 \uC2DC\uC791", 2800), mcL("\uB204\uC801 200\uAC74, MAU 500", 2800), mcL("\uC57D 100\uB9CC\uC6D0", 2706)] }),
          new TableRow({ children: [mc("7~12\uC6D4", 1200, "FFF7ED"), mcL("PWA \uC571 \uC804\uD658, \uAD6C\uB3C5 \uBAA8\uB378, \uCEE4\uBA38\uC2A4 \uC5F0\uACC4 \uC900\uBE44", 2800), mcL("\uB204\uC801 500\uAC74, MAU 1,000, \uC6D4 \uB9E4\uCD9C 600\uB9CC+", 2800), mcL("\uC57D 500\uB9CC\uC6D0", 2706)] }),
        ] }),

      new Paragraph({ children: [new PageBreak()] }),

      // ===== 3. 시장분석 및 경쟁력 확보 방안 (보강) =====
      h2("\u25A1 \uC2DC\uC7A5\uBD84\uC11D \uBC0F \uACBD\uC7C1\uB825 \uD655\uBCF4 \uBC29\uC548 (\uBCF4\uAC15)"),
      spacer(),
      pb("\u2460 \uD3EC\uC9C0\uC154\uB2DD \uBF44 (Positioning Map)"),
      p("\uAC00\uB85C\uCD95: \uC11C\uBE44\uC2A4 \uC18D\uB3C4 (\uC608\uC57D\uD615 \u2190 \u2192 \uAE34\uAE09\uD615)"),
      p("\uC138\uB85C\uCD95: \uBD80\uAC00\uAC00\uCE58 (\uB2E8\uC21C \uB3CC\uBD04 \u2190 \u2192 AI+\uCF58\uD150\uCE20 \uD1B5\uD569)"),
      new Table({ width: { size: W, type: WidthType.DXA }, columnWidths: [4753, 4753],
        rows: [
          new TableRow({ children: [mc("", 4753, "F9FAFB"), mc("AI+\uCF58\uD150\uCE20 \uD1B5\uD569 \u2191", 4753, "F9FAFB")] }),
          new TableRow({ children: [mc("\uB3C4\uADF8\uBA54\uC774\uD2B8\n(\uC608\uC57D\uD615 + \uB2E8\uC21C \uB3CC\uBD04)", 4753, "EFF6FF"), mc("P.E.T \u2B50\n(\uAE34\uAE09\uD615 + AI+\uCF58\uD150\uCE20)", 4753, "FFF7ED", "FF6B35", true)] }),
          new TableRow({ children: [mc("\uD3AB\uD50C\uB798\uB2DB\n(\uC608\uC57D\uD615 + \uC7A5\uB2E8\uAE30 \uB3CC\uBD04)", 4753, "EFF6FF"), mc("\uC640\uC694\n(\uD6C8\uB828 \uD2B9\uD654 + \uB2E8\uC21C \uB3CC\uBD04)", 4753, "ECFDF5")] }),
          new TableRow({ children: [mc("\uC608\uC57D\uD615 \u2190", 4753, "F9FAFB"), mc("\u2192 \uAE34\uAE09\uD615", 4753, "F9FAFB")] }),
        ] }),
      pSmall("P.E.T\uB294 \uC6B0\uCE21 \uC0C1\uB2E8(\uAE34\uAE09+AI\uD1B5\uD569) \uC601\uC5ED\uC5D0\uC11C \uACBD\uC7C1\uC0AC\uC640 \uCC28\uBCC4\uD654\uB41C \uD3EC\uC9C0\uC158 \uD655\uBCF4"),
      spacer(),
      pb("\u2461 \uBCA4\uCE58\uB9C8\uD0B9 \uC2EC\uD654 \uBD84\uC11D"),
      p("\u2022 \uB3C4\uADF8\uBA54\uC774\uD2B8\uC758 \uAC15\uC810(\uC2E4\uC801 15\uB9CC\uAC74)\uC744 \uC778\uC815\uD558\uB418, \u2018\uC608\uC57D \uC911\uC2EC\u2019\uC774\uB77C\uB294 \uD55C\uACC4\uC810\uC744 \uD30C\uACE0\uB4E4\uC5B4 \u2018\uAE34\uAE09 \uD2B9\uD654\u2019\uB85C \uCC28\uBCC4\uD654"),
      p("\u2022 \uD3AB\uD50C\uB798\uB2DB\uC758 \uAC15\uC810(\uADDC\uC81C\uC0CC\uB4DC\uBC15\uC2A4 \uC778\uC99D)\uC744 \uCC38\uACE0\uD558\uC5EC, P.E.T\uB3C4 \uD5A5\uD6C4 \uADDC\uC81C \uD2B9\uB840 \uC2E0\uCCAD \uAC80\uD1A0"),
      p("\u2022 P.E.T\uB9CC\uC758 \uBB34\uAE30: AI \uC99D\uC0C1 \uBD84\uC11D + \uD3AB-\uC704\uD0A4 \uCF58\uD150\uCE20 \u2192 \uACBD\uC7C1\uC0AC\uAC00 \uBAA8\uBC29\uD558\uAE30 \uC5B4\uB824\uC6B4 \uC720\uAE30\uC801 \uD2B8\uB798\uD53D \uD655\uBCF4"),

      new Paragraph({ children: [new PageBreak()] }),

      // ===== 4. 자금조달 계획 (보강) =====
      h2("\u25A1 \uC790\uAE08\uC870\uB2EC \uACC4\uD68D (\uBCF4\uAC15)"),
      spacer(),
      pb("[\uB2E8\uACC4\uBCC4 \uC18C\uC694 \uC790\uAE08 \uBC0F \uC6A9\uB3C4]"),
      new Table({ width: { size: W, type: WidthType.DXA }, columnWidths: [1500, 2000, 3000, 3006],
        rows: [
          new TableRow({ children: [mc("\uB2E8\uACC4", 1500, "1F2937", "FFFFFF", true), mc("\uAE08\uC561", 2000, "1F2937", "FFFFFF", true), mc("\uC6A9\uB3C4", 3000, "1F2937", "FFFFFF", true), mc("\uC870\uB2EC\uCC98", 3006, "1F2937", "FFFFFF", true)] }),
          new TableRow({ children: [mc("Seed", 1500, "FFF7ED"), mc("50\uB9CC\uC6D0", 2000), mcL("\uBC30\uC0C1\uCC45\uC784\uBCF4\uD5D8, \uB3C4\uBA54\uC778, \uCD08\uAE30 \uB9C8\uCF00\uD305", 3000), mcL("\uC790\uBE44 (\uBE44\uD76C\uC11D\uC801)", 3006)] }),
          new TableRow({ children: [mc("Pre-A", 1500, "FFF7ED"), mc("1,000~2,000\uB9CC", 2000), mcL("PG \uC5F0\uB3D9, \uC571 \uAC1C\uBC1C(PWA), \uC778\uAC74\uBE44(1\uBA85)", 3000), mcL("\uC815\uBD80\uC9C0\uC6D0\uC0AC\uC5C5 (U300, NEOs, \uCC3D\uC5C5\uC120\uB3C4\uB300\uD559)", 3006)] }),
          new TableRow({ children: [mc("Series A", 1500, "FFF7ED"), mc("1~3\uC5B5\uC6D0", 2000), mcL("\uC11C\uBE44\uC2A4 \uC804\uAD6D \uD655\uB300, \uCEE4\uBA38\uC2A4 \uAD6C\uCD95, \uC778\uB825 \uD655\uCDA9", 3000), mcL("\uC561\uC140\uB7EC\uB808\uC774\uD130/\uC5D4\uC824\uD22C\uC790 (\uC6D4 \uB9E4\uCD9C 1,000\uB9CC \uB2EC\uC131 \uC2DC)", 3006)] }),
        ] }),
      spacer(),
      pb("[\uBE44\uD76C\uC11D\uC801 \uC790\uAE08 \uC870\uB2EC \uC804\uB7B5]"),
      p("\u2022 \uC815\uBD80 \uC9C0\uC6D0\uC0AC\uC5C5: U300, NEOs, \uCC3D\uC5C5\uC120\uB3C4\uB300\uD559, \uC608\uBE44\uCC3D\uC5C5\uD328\uD0A4\uC9C0 \uB4F1 \uC9C0\uC6D0\uAE08 \uD655\uBCF4"),
      p("\u2022 \uB9E4\uCD9C \uAE30\uBC18: \uC11C\uBE44\uC2A4 \uC218\uC218\uB8CC(21.5%)\uB85C \uC6B4\uC601\uBE44 \uC790\uCCB4 \uCDA9\uB2F9 (3\uAC1C\uC6D4\uCC28\uBD80\uD130 \uC190\uC775\uBD84\uAE30\uC810 \uBAA9\uD45C)"),
      p("\u2022 \uACBD\uC9C4\uB300\uD68C \uC0C1\uAE08: U300 \uD398\uC2A4\uD2F0\uBC8C \uB300\uC0C1 800\uB9CC\uC6D0 \uB4F1 \uACBD\uC9C4\uB300\uD68C \uC0C1\uAE08 \uD65C\uC6A9"),
      p("\u2022 \uC8FC\uAD00\uAE30\uAD00 \uC5F0\uACC4: KDB \uC2A4\uD0C0\uD2B8\uC5C5 \uD504\uB85C\uADF8\uB7A8, IP\uB514\uB51C\uB3CC \uB4F1 \uD6C4\uC18D\uC9C0\uC6D0"),
      pSmall("\uC774\uAD11\uD5CC \uAD50\uC218\uB2D8: '\uB2E8\uACC4\uBCC4\uB85C \uACC4\uD68D \uC138\uC6B4 \uBE44\uC6A9\uC744 \uC791\uC131\uD558\uB294 \uAC8C \uAC00\uC7A5 \uC88B\uB2E4'"),

      new Paragraph({ children: [new PageBreak()] }),

      // ===== 5. 창업자의 역량 (보강) =====
      h2("\u25A1 \uCC3D\uC5C5\uC790\uC758 \uC5ED\uB7C9 (\uBCF4\uAC15)"),
      spacer(),
      pb("[\uCC3D\uC5C5\uC790\uC758 \uC5ED\uB7C9\uC774 \uC544\uC774\uD15C \uC2E4\uD604\uC73C\uB85C \uC5F0\uACB0\uB418\uB294 \uAD6C\uC870]"),
      new Table({ width: { size: W, type: WidthType.DXA }, columnWidths: [3168, 3168, 3170],
        rows: [
          new TableRow({ children: [mc("\uBCF4\uC720 \uC5ED\uB7C9", 3168, "FF6B35", "FFFFFF", true), mc("\uC801\uC6A9 \uBC29\uBC95", 3168, "FF6B35", "FFFFFF", true), mc("\uAE30\uB300 \uC131\uACFC", 3170, "FF6B35", "FFFFFF", true)] }),
          new TableRow({ children: [mc("\uBC18\uB824\uB3D9\uBB3C\uAD00\uB9AC\uC0AC 1\uAE09\n(\uCDE8\uB4DD \uC911)", 3168), mc("\uD3AB\uC2DC\uD130 \uD488\uC9C8 \uAC80\uC99D\n(\uBA74\uC811/\uC2DC\uBC94\uCF00\uC5B4)", 3168), mc("\uD30C\uD2B8\uB108 \uC2E0\uB8B0\uB3C4 \u2191\n\uACE0\uAC1D \uBD88\uC548 \uD574\uC18C", 3170)] }),
          new TableRow({ children: [mc("\uACE0\uC591\uC774 3\uB9C8\uB9AC\n\uC9C1\uC811 \uC591\uC721 \uACBD\uD5D8", 3168), mc("AI \uC99D\uC0C1 \uBD84\uC11D \uD0A4\uC6CC\uB4DC\n\uC9C1\uC811 \uC124\uACC4 (300+)", 3168), mc("\uC2E4\uC81C \uC591\uC721\uC790 \uAD00\uC810\uC758\nAI \uC815\uD655\uB3C4 \u2191", 3170)] }),
          new TableRow({ children: [mc("\uAE08\uC735 \uC601\uC5C5 \uACBD\uB825\n(\uC0BC\uC131\uC0DD\uBA85 \uD300\uC7A5/\uC9C0\uC810\uC7A5)", 3168), mc("B2C \uACE0\uAC1D \uC0C1\uB2F4/\uB9E4\uCE6D\n\uC601\uC5C5 \uD504\uB85C\uC138\uC2A4 \uC124\uACC4", 3168), mc("\uACE0\uAC1D \uC804\uD658\uC728 \u2191\n\uD30C\uD2B8\uB108 \uAD00\uB9AC \uC5ED\uB7C9", 3170)] }),
          new TableRow({ children: [mc("\uB9B0\uC2A4\uD0C0\uD2B8\uC5C5 \uC2E4\uD589\uB825\n(MVP 1\uC8FC \uAC1C\uBC1C/\uBC30\uD3EC)", 3168), mc("\uBE60\uB978 \uC2DC\uC7A5 \uAC80\uC99D\n\uACE0\uAC1D \uD53C\uB4DC\uBC31 \uC989\uC2DC \uBC18\uC601", 3168), mc("PMF \uBE60\uB978 \uB2EC\uC131\n\uAC1C\uBC1C \uBE44\uC6A9 \uCD5C\uC18C\uD654", 3170)] }),
          new TableRow({ children: [mc("CFO \uACBD\uD5D8\n(\uB808\uC778\uC5E0\uC528\uC5D4, R&D\uC0AC\uC5C5)", 3168), mc("\uC0AC\uC5C5 \uC7AC\uBB34/\uC138\uBB34 \uAD00\uB9AC\n\uD22C\uC790\uC720\uCE58 IR \uC5ED\uB7C9", 3168), mc("\uC7AC\uBB34 \uAC74\uC804\uC131 \uD655\uBCF4\n\uD22C\uC790\uC790 \uC2E0\uB8B0\uB3C4 \u2191", 3170)] }),
        ] }),
      pSmall("\uC774\uAD11\uD5CC \uAD50\uC218\uB2D8: '\uB2E8\uC21C \uC18C\uAC1C\uAC00 \uC544\uB2C8\uB77C, \uB0B4 \uC5ED\uB7C9\uC774 \uC0AC\uC5C5\uD654\uC5D0 \uC5B4\uB5BB\uAC8C \uC5F0\uACB0\uB418\uB294\uC9C0\uB97C \uBCF4\uC5EC\uC918\uB77C'"),
    ]
  }]
});

const outPath = path.join("C:", "Users", "dnlsd", "OneDrive", "\uBC14\uD0D5 \uD654\uBA74", "U300", "\uC0AC\uC5C5\uACC4\uD68D\uC11C_\uBCF4\uAC15\uBD80\uBD84.docx");
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outPath, buffer);
  console.log("Created:", outPath, "(" + buffer.length + " bytes)");
});
