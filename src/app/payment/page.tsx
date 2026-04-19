"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { supabase } from "../../lib/supabase";
import { useAppStore } from "../../lib/store";

const SERVICE_OPTIONS = [
  { value: "transport", label: "펫택시/이동" },
  { value: "sitter", label: "돌봄/펫시터" },
  { value: "hotel", label: "호텔링" },
];

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useAppStore((s) => s.user);
  const setUser = useAppStore((s) => s.setUser);

  const defaultService = useMemo(() => {
    const s = searchParams.get("service");
    if (s && SERVICE_OPTIONS.some((x) => x.value === s)) return s;
    return "transport";
  }, [searchParams]);

  const [serviceType, setServiceType] = useState(defaultService);
  const [partnerName, setPartnerName] = useState("");
  const [customerName, setCustomerName] = useState(user?.nickname || "");
  const [customerPhone, setCustomerPhone] = useState("");
  const [region, setRegion] = useState("");
  const [amount, setAmount] = useState(50000);
  const [memo, setMemo] = useState("");
  const [usePoints, setUsePoints] = useState(0);
  const [loading, setLoading] = useState(false);

  const ownedPoints = user?.points ?? 0;
  const maxPointDiscount = Math.min(ownedPoints, Math.floor(amount * 0.1)); // 최대 10%
  const safeUsePoints = Math.max(0, Math.min(usePoints, maxPointDiscount));
  const finalPay = Math.max(0, amount - safeUsePoints);

  const submitPayment = async () => {
    if (!user || user.id === "demo-user") {
      alert("로그인 후 결제를 진행해주세요.");
      router.push("/auth/login?next=/payment");
      return;
    }
    if (!partnerName.trim() || !customerName.trim() || !customerPhone.trim() || amount <= 0) {
      alert("필수 정보를 입력해주세요.");
      return;
    }

    setLoading(true);
    try {
      const orderRef = `PET-${Date.now()}`;

      // 1) 거래 기록(운영 정산용)
      const txRes = await fetch("/api/transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          partnerName: partnerName.trim(),
          serviceType,
          region: region.trim(),
          amount,
          pointDiscount: safeUsePoints,
          paymentMethod: "카카오페이",
          memo: memo.trim() || `order_ref=${orderRef}`,
        }),
      });
      const txData = await txRes.json();
      if (!txRes.ok || !txData?.success) {
        throw new Error(txData?.error || "거래 기록 실패");
      }

      // 2) 포인트 할인 차감 (RPC 연결)
      if (safeUsePoints > 0) {
        const { error: pointErr } = await supabase.rpc("use_points_for_service", {
          p_points: safeUsePoints,
          p_service_type: serviceType,
          p_order_ref: orderRef,
        });
        if (pointErr) throw new Error("포인트 사용 실패: " + pointErr.message);
      }

      // 3) 사용자 포인트 갱신
      const { data: refreshedUser } = await supabase.from("users").select("*").eq("id", user.id).single();
      if (refreshedUser) setUser(refreshedUser as any);

      alert(
        `결제 요청이 접수되었습니다.\n` +
        `총 결제금액: ${amount.toLocaleString()}원\n` +
        `포인트 할인: ${safeUsePoints.toLocaleString()}원\n` +
        `최종 결제: ${finalPay.toLocaleString()}원`
      );
      router.push("/mypage");
    } catch (err: any) {
      alert(err?.message || "결제 처리 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main style={{ maxWidth: 640, margin: "0 auto", padding: "20px 16px", flex: 1, width: "100%" }}>
        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: "14px 18px", borderBottom: "1px solid #E5E7EB", fontSize: 16, fontWeight: 800 }}>
            💳 서비스 결제
          </div>
          <div style={{ padding: 18, display: "grid", gap: 12 }}>
            <label style={{ fontSize: 12, fontWeight: 700 }}>
              서비스 종류
              <select value={serviceType} onChange={(e) => setServiceType(e.target.value)} style={inputStyle}>
                {SERVICE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </label>

            <label style={{ fontSize: 12, fontWeight: 700 }}>
              업체/병원명 *
              <input value={partnerName} onChange={(e) => setPartnerName(e.target.value)} style={inputStyle} placeholder="예: 감자 동물병원" />
            </label>

            <label style={{ fontSize: 12, fontWeight: 700 }}>
              보호자 이름 *
              <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} style={inputStyle} placeholder="예: 홍길동" />
            </label>

            <label style={{ fontSize: 12, fontWeight: 700 }}>
              연락처 *
              <input value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} style={inputStyle} placeholder="010-0000-0000" />
            </label>

            <label style={{ fontSize: 12, fontWeight: 700 }}>
              지역
              <input value={region} onChange={(e) => setRegion(e.target.value)} style={inputStyle} placeholder="예: 고양시 일산동구" />
            </label>

            <label style={{ fontSize: 12, fontWeight: 700 }}>
              결제 금액(원) *
              <input type="number" min={1000} step={1000} value={amount} onChange={(e) => setAmount(Number(e.target.value || 0))} style={inputStyle} />
            </label>

            <label style={{ fontSize: 12, fontWeight: 700 }}>
              포인트 할인 (최대 {maxPointDiscount.toLocaleString()}P)
              <input
                type="number"
                min={0}
                step={100}
                value={safeUsePoints}
                onChange={(e) => setUsePoints(Number(e.target.value || 0))}
                style={inputStyle}
              />
            </label>

            <label style={{ fontSize: 12, fontWeight: 700 }}>
              메모
              <textarea value={memo} onChange={(e) => setMemo(e.target.value)} style={{ ...inputStyle, minHeight: 72 }} />
            </label>

            <div style={{
              background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 10,
              padding: "10px 12px", fontSize: 13, lineHeight: 1.7,
            }}>
              <div>보유 포인트: <b>{ownedPoints.toLocaleString()}P</b></div>
              <div>포인트 할인: <b>-{safeUsePoints.toLocaleString()}원</b></div>
              <div>최종 결제금액: <b style={{ color: "#C2410C" }}>{finalPay.toLocaleString()}원</b></div>
            </div>

            <button
              onClick={submitPayment}
              disabled={loading}
              style={{
                border: "none",
                borderRadius: 10,
                padding: "12px 16px",
                background: loading ? "#9CA3AF" : "#FF6B35",
                color: "#fff",
                fontSize: 14,
                fontWeight: 800,
                cursor: loading ? "default" : "pointer",
                fontFamily: "inherit",
              }}
            >
              {loading ? "처리 중..." : "결제 요청하기"}
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  marginTop: 6,
  border: "1px solid #E5E7EB",
  borderRadius: 8,
  padding: "9px 11px",
  fontSize: 13,
  outline: "none",
  fontFamily: "inherit",
};
