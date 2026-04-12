// Google Sheets 자동 거래 기록 연동
// 환경변수: GOOGLE_SERVICE_ACCOUNT_KEY, GOOGLE_SHEET_ID

export interface TransactionRecord {
  date: string;
  customerName: string;
  customerPhone: string;
  partnerName: string;
  serviceType: string;
  region: string;
  amount: number;
  pointDiscount: number;
  paymentMethod: string;
  status: string;
  memo: string;
}

// 서버 사이드에서만 호출 (API Route에서 사용)
export async function appendToSheet(record: TransactionRecord): Promise<{ ok: boolean; error?: string }> {
  try {
    const key = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
    const sheetId = process.env.GOOGLE_SHEET_ID;

    if (!key || !sheetId) {
      return { ok: false, error: "환경변수 미설정" };
    }

    const credentials = JSON.parse(key);

    // JWT 토큰 생성
    const jwt = await createJWT(credentials);

    // 실결제액 등 자동 계산 값
    const actualPayment = record.amount - record.pointDiscount;
    const pgFee = Math.round(actualPayment * 0.035);
    const petFee = Math.round(actualPayment * 0.215);
    const partnerGross = actualPayment - pgFee - petFee;
    const tax = Math.round(partnerGross * 0.033);
    const partnerNet = partnerGross - tax;

    const values = [
      record.date,
      record.customerName,
      record.customerPhone,
      record.partnerName,
      record.serviceType,
      record.region,
      record.amount,
      record.pointDiscount,
      actualPayment,
      pgFee,
      petFee,
      partnerGross,
      tax,
      partnerNet,
      petFee, // P.E.T 순수익
      record.paymentMethod,
      record.status,
      "", // 정산일
      record.memo,
    ];

    // 시트 이름 없이 첫 번째 시트에 추가 (시트 이름 호환성)
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/A:S:append?valueInputOption=USER_ENTERED`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ values: [values] }),
    });

    if (res.ok) {
      return { ok: true };
    } else {
      const errText = await res.text();
      return { ok: false, error: `Sheets API ${res.status}: ${errText.slice(0, 200)}` };
    }
  } catch (err: any) {
    return { ok: false, error: `Exception: ${err?.message || String(err)}`.slice(0, 200) };
  }
}

// JWT 토큰 생성 (Google 서비스 계정용)
async function createJWT(credentials: any): Promise<string> {
  const header = btoa(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const now = Math.floor(Date.now() / 1000);
  const claim = btoa(JSON.stringify({
    iss: credentials.client_email,
    scope: "https://www.googleapis.com/auth/spreadsheets",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  }));

  const signInput = `${header}.${claim}`;

  // Node.js crypto로 RS256 서명
  const crypto = await import("crypto");
  const sign = crypto.createSign("RSA-SHA256");
  sign.update(signInput);
  const signature = sign.sign(credentials.private_key, "base64url");

  const jwt = `${header}.${claim}.${signature}`;

  // JWT로 access_token 교환
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });

  const tokenData = await tokenRes.json();
  return tokenData.access_token;
}
