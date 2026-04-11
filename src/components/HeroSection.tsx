"use client";
import { useState, useRef, useEffect } from "react";
import { CAT_DATA, DOG_DATA } from "../lib/wikiData";
import { analyzeSymptoms } from "../lib/symptomAnalyzer";

// 위키 데이터에서 검색
function searchWiki(query: string): string {
  const q = query.toLowerCase();
  const allBreeds = [...CAT_DATA.breeds, ...DOG_DATA.breeds];

  // 품종 이름 매칭
  const matched = allBreeds.find(
    (b) => q.includes(b.name) || q.includes(b.nameEn.toLowerCase()) || q.includes(b.id)
  );
  if (matched) {
    return `📖 **${matched.name}** (${matched.nameEn})\n\n` +
      `원산지: ${matched.origin} | 체중: ${matched.weight} | 수명: ${matched.lifespan}\n\n` +
      `${matched.description.slice(0, 150)}...\n\n` +
      `👉 자세한 정보는 위키에서 확인하세요!`;
  }

  // 증상 키워드 분석
  const analysis = analyzeSymptoms(query, "dog");
  if (analysis.severity !== "normal") {
    return `🔍 **AI 증상 분석 결과**\n\n` +
      `심각도: ${analysis.severity === "urgent" ? "🚨 긴급" : analysis.severity === "moderate" ? "⚠️ 주의" : "💡 관찰"}\n` +
      `감지된 증상: ${analysis.symptoms.join(", ")}\n\n` +
      `${analysis.summary}\n\n` +
      `💡 ${analysis.recommendation}`;
  }

  // 일반 키워드 매칭
  if (q.includes("사료") || q.includes("밥")) return "🍽️ 반려동물 사료는 나이, 체중, 건강 상태에 맞게 선택하세요.\n\n강아지: 퍼피→어덜트→시니어 단계별 사료\n고양이: 습식+건식 병행 권장\n\n👉 펫-위키에서 품종별 관리법을 확인해보세요!";
  if (q.includes("병원") || q.includes("동물병원")) return "🏥 주변 동물병원을 찾으시나요?\n\n피드에 증상을 올리시면 AI가 분석하고 GPS 기반으로 가까운 동물병원을 자동 안내해드립니다.\n\n👉 '피드 > 사진 올리기'에서 이용해보세요!";
  if (q.includes("예방접종") || q.includes("접종")) return "💉 예방접종 스케줄\n\n강아지: DHPPL 5종 + 코로나 + 켄넬코프 + 광견병 (6~16주)\n고양이: FVRCP 3종 + 광견병 (6~16주)\n\n👉 위키 품종 페이지에서 상세 스케줄을 확인하세요!";
  if (q.includes("비용") || q.includes("치료비") || q.includes("얼마")) return "💰 반려동물 의료비가 궁금하시군요!\n\n품종별 주요 질병과 예상 치료비를 위키에 정리해뒀어요.\n슬개골 탈구: 100~350만원\n디스크 수술: 200~600만원\n스케일링: 20~80만원\n\n👉 위키에서 품종별 상세 비용을 확인하세요!";

  return "🐾 P.E.T AI에게 물어보세요!\n\n예시:\n• 말티즈 특징이 뭐야?\n• 강아지가 구토를 해요\n• 예방접종 스케줄\n• 치료비가 궁금해요\n\n품종 이름이나 증상을 입력하면 분석해드려요!";
}

type ChatMsg = { role: "user" | "ai"; text: string };

export default function HeroSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<ChatMsg[]>([
    { role: "ai", text: "안녕하세요! P.E.T AI입니다 🐾\n품종 정보, 증상 분석, 치료비 등 무엇이든 물어보세요!" },
  ]);
  const [thinking, setThinking] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    window.open("https://forms.gle/e5cY46BRkambEjE19", "_blank");
    setSubmitted(true);
  }

  function handleChat(e: React.FormEvent) {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setThinking(true);
    // 짧은 딜레이로 AI 느낌
    setTimeout(() => {
      const reply = searchWiki(userMsg);
      setMessages((prev) => [...prev, { role: "ai", text: reply }]);
      setThinking(false);
    }, 600);
  }

  return (
    <section style={{
      position: "relative", overflow: "hidden",
      background: "linear-gradient(135deg, #FFF7ED, #FEF3C7, #FFFBEB)",
      borderRadius: 16, marginBottom: 24,
    }}>
      <div style={{
        position: "absolute", top: -80, right: -80, width: 300, height: 300,
        background: "rgba(255,107,53,0.08)", borderRadius: "50%", filter: "blur(60px)",
      }} />

      <div style={{
        position: "relative", maxWidth: 1100, margin: "0 auto",
        padding: "28px 24px", display: "flex", gap: 24, alignItems: "stretch",
      }} className="hero-flex">
        {/* 왼쪽: CTA (축소) */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <span style={{
            display: "inline-block", background: "#FFF7ED", border: "1px solid #FDBA74",
            color: "#C2410C", fontSize: 12, fontWeight: 700, padding: "3px 12px",
            borderRadius: 20, marginBottom: 10,
          }}>
            반려동물 긴급케어 플랫폼
          </span>

          <h1 style={{
            fontSize: 22, fontWeight: 900, color: "#1F2937", lineHeight: 1.4,
            margin: "0 0 8px", letterSpacing: "-0.5px",
          }} className="hero-title">
            갑자기 못 돌볼 때,<br />
            <span style={{ color: "#FF6B35" }}>10분 안에</span> 케어러 연결
          </h1>

          <p style={{ color: "#6B7280", fontSize: 13, lineHeight: 1.6, margin: "0 0 14px" }}>
            신원 인증 펫시터 · 수의사 자문 · 에스크로 안전결제<br />
            출시 전 등록 시 <strong style={{ color: "#FF6B35" }}>첫 이용 20% 할인</strong>
          </p>

          {submitted ? (
            <div style={{
              background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 10,
              padding: "10px 16px", color: "#15803D", fontWeight: 600, fontSize: 13,
            }}>
              출시 시 가장 먼저 알려드릴게요!
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8 }} className="hero-form">
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일 주소 입력" required
                style={{
                  flex: 1, padding: "10px 14px", borderRadius: 10,
                  border: "1px solid #E5E7EB", fontSize: 13, outline: "none",
                  background: "#fff", minWidth: 0,
                }}
              />
              <button type="submit" style={{
                background: "#FF6B35", color: "#fff", fontWeight: 700,
                padding: "10px 18px", borderRadius: 10, border: "none",
                fontSize: 13, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
              }}>
                출시 알림
              </button>
            </form>
          )}

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
            {[
              { icon: "🛡️", label: "안전결제" },
              { icon: "👨‍⚕️", label: "수의사 자문" },
              { icon: "✅", label: "신원인증" },
              { icon: "🎓", label: "한양대 창업팀" },
            ].map((item) => (
              <span key={item.label} style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                fontSize: 11, color: "#6B7280", background: "rgba(255,255,255,0.7)",
                borderRadius: 16, padding: "4px 10px",
              }}>
                {item.icon} {item.label}
              </span>
            ))}
          </div>
        </div>

        {/* 오른쪽: AI 검색/상담 */}
        <div style={{
          flex: 1, minWidth: 0, background: "#1F2937", borderRadius: 16,
          display: "flex", flexDirection: "column", overflow: "hidden",
          boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
        }} className="hero-ai-area">
          {/* AI 헤더 */}
          <div style={{
            padding: "14px 18px", borderBottom: "1px solid #374151",
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10,
              background: "linear-gradient(135deg, #FF6B35, #FB923C)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16,
            }}>🤖</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#F9FAFB" }}>P.E.T AI</div>
              <div style={{ fontSize: 11, color: "#9CA3AF" }}>품종 정보 · 증상 분석 · 비용 안내</div>
            </div>
            <span style={{
              marginLeft: "auto", fontSize: 10, fontWeight: 600,
              background: "#059669", color: "#fff", padding: "2px 8px", borderRadius: 8,
            }}>온라인</span>
          </div>

          {/* 채팅 영역 */}
          <div style={{
            flex: 1, padding: "12px 16px", overflowY: "auto",
            display: "flex", flexDirection: "column", gap: 10,
            minHeight: 200, maxHeight: 260,
          }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                maxWidth: "85%",
              }}>
                <div style={{
                  background: msg.role === "user" ? "#FF6B35" : "#374151",
                  color: msg.role === "user" ? "#fff" : "#E5E7EB",
                  padding: "10px 14px", borderRadius: 12,
                  fontSize: 13, lineHeight: 1.6, whiteSpace: "pre-line",
                  borderBottomRightRadius: msg.role === "user" ? 4 : 12,
                  borderBottomLeftRadius: msg.role === "ai" ? 4 : 12,
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            {thinking && (
              <div style={{
                alignSelf: "flex-start", background: "#374151",
                color: "#9CA3AF", padding: "10px 14px", borderRadius: 12,
                fontSize: 13, borderBottomLeftRadius: 4,
              }}>
                분석 중...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* 빠른 질문 버튼 */}
          <div style={{
            padding: "8px 16px", display: "flex", gap: 6,
            overflowX: "auto", borderTop: "1px solid #374151",
          }}>
            {["말티즈 특징", "구토 증상", "치료비 궁금", "예방접종"].map((q) => (
              <button key={q} onClick={() => { setChatInput(q); }}
                style={{
                  flexShrink: 0, background: "#374151", color: "#D1D5DB",
                  border: "1px solid #4B5563", borderRadius: 16,
                  padding: "4px 12px", fontSize: 11, cursor: "pointer", whiteSpace: "nowrap",
                }}>
                {q}
              </button>
            ))}
          </div>

          {/* 입력 */}
          <form onSubmit={handleChat} style={{
            padding: "12px 16px", borderTop: "1px solid #374151",
            display: "flex", gap: 8,
          }}>
            <input
              value={chatInput} onChange={(e) => setChatInput(e.target.value)}
              placeholder="증상, 품종, 비용 등 무엇이든 물어보세요..."
              style={{
                flex: 1, background: "#374151", border: "1px solid #4B5563",
                borderRadius: 10, padding: "10px 14px", color: "#F9FAFB",
                fontSize: 13, outline: "none", minWidth: 0,
              }}
            />
            <button type="submit" disabled={thinking} style={{
              background: "#FF6B35", color: "#fff", border: "none",
              borderRadius: 10, padding: "10px 16px", fontSize: 13,
              fontWeight: 700, cursor: "pointer", flexShrink: 0,
            }}>
              전송
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
