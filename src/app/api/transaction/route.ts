import { NextRequest, NextResponse } from "next/server";
import { appendToSheet } from "../../../lib/sheets";

// 환경변수 확인용 GET
export async function GET() {
  const hasKey = !!process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  const hasSheet = !!process.env.GOOGLE_SHEET_ID;
  const sheetId = process.env.GOOGLE_SHEET_ID?.slice(0, 10) + "...";
  return NextResponse.json({ hasKey, hasSheet, sheetIdPreview: sheetId });
}

// 거래 기록 API — 거래 발생 시 DB + Google Sheets 동시 기록
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customerName, customerPhone, partnerName,
      serviceType, region, amount, pointDiscount = 0,
      paymentMethod = "카카오페이", memo = "",
    } = body;

    if (!customerName || !partnerName || !amount) {
      return NextResponse.json({ error: "필수 항목 누락" }, { status: 400 });
    }

    const now = new Date();
    const dateStr = now.toLocaleDateString("ko-KR", {
      year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit",
    });

    // Google Sheets에 자동 기록
    const sheetResult: any = await appendToSheet({
      date: dateStr,
      customerName,
      customerPhone: customerPhone || "",
      partnerName,
      serviceType: serviceType || "기본돌봄",
      region: region || "",
      amount: Number(amount),
      pointDiscount: Number(pointDiscount),
      paymentMethod,
      status: "미정산",
      memo,
    });

    return NextResponse.json({
      success: true,
      sheetRecorded: sheetResult.ok,
      sheetError: sheetResult.error || null,
      message: sheetResult.ok
        ? "거래 기록 + 스프레드시트 동기화 완료!"
        : "스프레드시트 연동 실패: " + (sheetResult.error || "알 수 없는 오류"),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "서버 오류" }, { status: 500 });
  }
}
