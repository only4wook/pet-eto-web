"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import GradeBadge from "../../components/GradeBadge";
import { useAppStore } from "../../lib/store";
import { supabase } from "../../lib/supabase";
import { getGrade, getNextGrade, GRADE_REQUIREMENTS, POINT_RULES, ROLE_TABLE } from "../../lib/grades";
import type { Pet } from "../../types";

export default function MyPage() {
  const user = useAppStore((s) => s.user);
  const [showExpertForm, setShowExpertForm] = useState(false);
  const [myPets, setMyPets] = useState<Pet[]>([]);
  const [myPostCount, setMyPostCount] = useState(0);
  const [myFeedCount, setMyFeedCount] = useState(0);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [myPosts, setMyPosts] = useState<any[]>([]);
  const [myFeeds, setMyFeeds] = useState<any[]>([]);

  useEffect(() => {
    if (user && user.id !== "demo-user") {
      supabase.from("pets").select("*").eq("owner_id", user.id)
        .order("created_at", { ascending: false })
        .then(({ data }) => { if (data) setMyPets(data); });
      supabase.from("posts").select("id", { count: "exact", head: true })
        .eq("author_id", user.id)
        .then(({ count }) => { if (count) setMyPostCount(count); });
      supabase.from("feed_posts").select("id", { count: "exact", head: true })
        .eq("author_id", user.id)
        .then(({ count }) => { if (count) setMyFeedCount(count); });
    }
  }, [user]);

  const loadMyPosts = async () => {
    if (!user) return;
    const { data } = await supabase.from("posts").select("id,title,category,created_at")
      .eq("author_id", user.id).order("created_at", { ascending: false }).limit(20);
    if (data) setMyPosts(data);
  };
  const loadMyFeeds = async () => {
    if (!user) return;
    const { data } = await supabase.from("feed_posts").select("id,description,created_at")
      .eq("author_id", user.id).order("created_at", { ascending: false }).limit(20);
    if (data) setMyFeeds(data);
  };

  const points = user?.points ?? 0;
  const grade = getGrade(points);
  const { next, remaining } = getNextGrade(points);

  return (
    <>
      <Header />
      <main style={{ maxWidth: 800, margin: "0 auto", padding: "20px 16px", flex: 1, width: "100%" }}>
        {/* 프로필 카드 */}
        <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 4, marginBottom: 16 }}>
          <div style={{ padding: "12px 20px", borderBottom: "1px solid #e0e0e0", fontSize: 15, fontWeight: 700 }}>
            마이페이지
          </div>
          <div style={{ padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, paddingBottom: 20, borderBottom: "1px solid #f0f0f0", marginBottom: 20 }}>
              <div style={{
                width: 64, height: 64, borderRadius: "50%", background: "#FF6B35",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontSize: 24, fontWeight: 700,
              }}>
                {user?.nickname?.charAt(0) ?? "?"}
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 18, fontWeight: 700 }}>{user?.nickname}</span>
                  <GradeBadge points={points} role={(user as any)?.role} />
                </div>
                <div style={{ fontSize: 13, color: "#888", marginTop: 2 }}>{user?.email}</div>
              </div>
            </div>

            {/* 등급 진행도 */}
            <div style={{ background: "#FAFAFA", borderRadius: 8, padding: 16, marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 700 }}>
                  {grade.icon} 현재 등급: <span style={{ color: grade.color }}>{grade.label}</span>
                </span>
                {next && (
                  <span style={{ fontSize: 12, color: "#888" }}>
                    다음 등급까지 <b style={{ color: "#FF6B35" }}>{remaining}P</b>
                  </span>
                )}
              </div>
              {next && (
                <div style={{ background: "#e0e0e0", borderRadius: 99, height: 8, overflow: "hidden" }}>
                  <div style={{
                    background: `linear-gradient(90deg, ${grade.color}, ${next.color})`,
                    height: "100%", borderRadius: 99,
                    width: `${Math.min(100, ((points - grade.minPoints) / (next.minPoints - grade.minPoints)) * 100)}%`,
                    transition: "width 0.3s",
                  }} />
                </div>
              )}
              {!next && (
                <div style={{ fontSize: 13, color: "#F59E0B", fontWeight: 600 }}>
                  최고 등급에 도달했습니다!
                </div>
              )}
            </div>

            {/* 통계 */}
            <div style={{
              display: "flex", gap: 0, textAlign: "center",
              border: "1px solid #e0e0e0", borderRadius: 4, overflow: "hidden", marginBottom: 20,
            }}>
              {[
                { label: "포인트", value: points, color: "#FF6B35" },
                { label: "게시글", value: myPostCount, color: "#333" },
                { label: "피드", value: myFeedCount, color: "#333" },
                { label: "반려동물", value: myPets.length, color: "#2EC4B6" },
              ].map((item, i) => (
                <div key={i} style={{ flex: 1, padding: "16px 0", borderRight: i < 3 ? "1px solid #e0e0e0" : "none" }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: item.color }}>{item.value}</div>
                  <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>{item.label}</div>
                </div>
              ))}
            </div>

            {/* 메뉴 */}
            <div>
              {[
                { label: "내가 쓴 글", key: "posts", action: () => { setActiveMenu(activeMenu === "posts" ? null : "posts"); loadMyPosts(); } },
                { label: "내 피드", key: "feeds", action: () => { setActiveMenu(activeMenu === "feeds" ? null : "feeds"); loadMyFeeds(); } },
                { label: "내 반려동물", key: "pets", action: () => { const el = document.getElementById("my-pets"); el?.scrollIntoView({ behavior: "smooth" }); } },
                { label: "이용 가이드", key: "guide", action: () => { window.location.href = "/guide"; } },
              ].map((item, i) => (
                <div key={i}>
                  <div style={{
                    padding: "12px 0", borderBottom: "1px solid #f0f0f0", fontSize: 14,
                    cursor: "pointer", display: "flex", justifyContent: "space-between",
                    color: activeMenu === item.key ? "#FF6B35" : "#333", fontWeight: activeMenu === item.key ? 700 : 400,
                  }} onClick={item.action}>
                    {item.label}
                    <span style={{ color: "#ccc" }}>{activeMenu === item.key ? "▼" : "›"}</span>
                  </div>
                  {/* 내가 쓴 글 목록 */}
                  {activeMenu === "posts" && item.key === "posts" && (
                    <div style={{ padding: "8px 0 12px" }}>
                      {myPosts.length === 0 ? (
                        <p style={{ fontSize: 13, color: "#9CA3AF", margin: 0 }}>작성한 글이 없습니다.</p>
                      ) : myPosts.map((p) => (
                        <Link key={p.id} href={`/community/${p.id}`} style={{
                          display: "block", padding: "8px 0", borderBottom: "1px solid #F9FAFB",
                          fontSize: 13, color: "#374151", textDecoration: "none",
                        }}>
                          <span style={{ fontSize: 11, fontWeight: 600, color: "#FF6B35", marginRight: 6 }}>[{p.category}]</span>
                          {p.title}
                        </Link>
                      ))}
                    </div>
                  )}
                  {/* 내 피드 목록 */}
                  {activeMenu === "feeds" && item.key === "feeds" && (
                    <div style={{ padding: "8px 0 12px" }}>
                      {myFeeds.length === 0 ? (
                        <p style={{ fontSize: 13, color: "#9CA3AF", margin: 0 }}>올린 피드가 없습니다.</p>
                      ) : myFeeds.map((f) => (
                        <Link key={f.id} href={`/feed/${f.id}`} style={{
                          display: "block", padding: "8px 0", borderBottom: "1px solid #F9FAFB",
                          fontSize: 13, color: "#374151", textDecoration: "none",
                        }}>
                          📸 {f.description?.slice(0, 40)}...
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 등급 안내 */}
        <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 4, marginBottom: 16 }}>
          <div style={{ padding: "12px 20px", borderBottom: "1px solid #e0e0e0", fontSize: 14, fontWeight: 700 }}>
            📊 등급 시스템 안내
          </div>
          <div style={{ padding: 16 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#f8f8f8" }}>
                  <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600 }}>등급</th>
                  <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600 }}>승급 조건</th>
                </tr>
              </thead>
              <tbody>
                {GRADE_REQUIREMENTS.map((g, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #f0f0f0" }}>
                    <td style={{ padding: "8px 12px", fontWeight: grade.label === g.grade ? 700 : 400, color: grade.label === g.grade ? "#FF6B35" : "#333" }}>
                      {grade.label === g.grade ? "▶ " : ""}{g.grade}
                    </td>
                    <td style={{ padding: "8px 12px", color: "#666" }}>{g.condition}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ marginTop: 16, fontSize: 13, fontWeight: 700 }}>포인트 적립 규칙</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
              {POINT_RULES.map((r, i) => (
                <span key={i} style={{
                  background: "#f8f8f8", padding: "4px 10px", borderRadius: 4,
                  fontSize: 12, color: "#555",
                }}>
                  {r.action}: <b style={{ color: "#FF6B35" }}>{r.points}</b>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 내 반려동물 */}
        <div id="my-pets"></div>
        <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 4, marginBottom: 16 }}>
          <div style={{
            padding: "12px 20px", borderBottom: "1px solid #e0e0e0",
            fontSize: 14, fontWeight: 700, display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <span>🐾 내 반려동물</span>
            <Link href="/pet/register" style={{
              background: "#FF6B35", color: "#fff", border: "none", borderRadius: 4,
              padding: "4px 12px", fontSize: 12, fontWeight: 600, textDecoration: "none",
            }}>+ 추가 등록</Link>
          </div>
          <div style={{ padding: "12px 20px" }}>
            {myPets.length === 0 ? (
              <div style={{ textAlign: "center", padding: "20px 0", color: "#888" }}>
                <p style={{ fontSize: 14, margin: "0 0 8px" }}>등록된 반려동물이 없어요</p>
                <Link href="/pet/register" style={{
                  color: "#FF6B35", fontSize: 13, fontWeight: 600,
                }}>반려동물 등록하기 →</Link>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {myPets.map((pet) => (
                  <div key={pet.id} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "12px 14px", background: "#FAFAFA", borderRadius: 8, border: "1px solid #F0F0F0",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 24 }}>
                        {pet.species === "cat" ? "🐱" : pet.species === "dog" ? "🐶" : "🐾"}
                      </span>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14, color: "#1F2937" }}>{pet.name}</div>
                        <div style={{ fontSize: 12, color: "#6B7280" }}>
                          {pet.breed}
                          {pet.gender !== "unknown" && ` · ${pet.gender === "male" ? "♂ 남아" : "♀ 여아"}`}
                          {pet.weight && ` · ${pet.weight}kg`}
                          {pet.birth_date && ` · ${pet.birth_date}`}
                        </div>
                      </div>
                    </div>
                    <button onClick={async () => {
                      if (!confirm(`${pet.name}을(를) 삭제하시겠습니까?`)) return;
                      await supabase.from("pets").delete().eq("id", pet.id);
                      setMyPets((prev) => prev.filter((p) => p.id !== pet.id));
                    }} style={{
                      background: "none", border: "1px solid #E5E7EB", borderRadius: 6,
                      padding: "4px 10px", fontSize: 11, color: "#9CA3AF", cursor: "pointer",
                    }}>삭제</button>
                  </div>
                ))}
                <p style={{ fontSize: 11, color: "#9CA3AF", margin: "4px 0 0", textAlign: "center" }}>
                  여러 마리를 키우신다면 '+ 추가 등록'으로 모두 등록해주세요!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 전문가 인증 신청 */}
        <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 4, marginBottom: 16 }}>
          <div style={{
            padding: "12px 20px", borderBottom: "1px solid #e0e0e0",
            fontSize: 14, fontWeight: 700, display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <span>🩺 전문가 인증 신청</span>
            <button onClick={() => setShowExpertForm(!showExpertForm)} style={{
              background: "#2EC4B6", color: "#fff", border: "none", borderRadius: 4,
              padding: "4px 12px", fontSize: 12, cursor: "pointer", fontWeight: 600,
            }}>
              {showExpertForm ? "닫기" : "신청하기"}
            </button>
          </div>

          <div style={{ padding: 16 }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
              {ROLE_TABLE.map((r) => (
                <span key={r.role} style={{
                  background: r.bgColor, color: r.color,
                  padding: "4px 12px", borderRadius: 4, fontSize: 12, fontWeight: 700,
                }}>
                  {r.icon} {r.label}
                </span>
              ))}
            </div>
            <p style={{ fontSize: 12, color: "#888", margin: 0, lineHeight: 1.6 }}>
              수의사, 의사, 약사, 업체 관계자분은 전문가 인증을 통해 전문가 배지를 받을 수 있습니다.
              인증 후 전문가 답변 작성 시 추가 포인트(+50P)가 지급됩니다.
            </p>
            {/* 카카오톡 문의 버튼 */}
            <a href="https://pf.kakao.com/_giedX/chat" target="_blank" rel="noopener noreferrer" style={{
              display: "inline-flex", alignItems: "center", gap: 8, marginTop: 12,
              background: "#FEE500", color: "#3C1E1E", padding: "10px 20px",
              borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: "none",
            }}>
              💬 관리자에게 카카오톡 문의하기
            </a>

            {showExpertForm && (
              <div style={{ marginTop: 16, padding: 16, background: "#FAFAFA", borderRadius: 8 }}>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 4 }}>전문가 유형</label>
                  <select style={{ width: "100%", padding: "8px 12px", border: "1px solid #ddd", borderRadius: 4, fontSize: 13 }}>
                    <option value="">선택하세요</option>
                    <option value="expert_vet">수의사</option>
                    <option value="expert_doctor">의사</option>
                    <option value="expert_pharma">약사</option>
                    <option value="expert_biz">업체 (동물병원, 펫샵 등)</option>
                  </select>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 4 }}>소속 / 면허번호</label>
                  <input type="text" placeholder="예: OO동물병원 / 수의사 면허 제12345호"
                    style={{ width: "100%", padding: "8px 12px", border: "1px solid #ddd", borderRadius: 4, fontSize: 13 }} />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 4 }}>인증 자료 설명</label>
                  <textarea placeholder="면허증 사본, 사업자등록증 등 인증 가능한 자료를 설명해주세요. 추후 이메일로 자료를 요청드릴 수 있습니다."
                    style={{ width: "100%", padding: "8px 12px", border: "1px solid #ddd", borderRadius: 4, fontSize: 13, minHeight: 80, resize: "vertical", fontFamily: "inherit" }} />
                </div>
                <button
                  onClick={() => { alert("전문가 인증 신청이 접수되었습니다.\n관리자 검토 후 승인 알림을 보내드리겠습니다."); setShowExpertForm(false); }}
                  style={{
                    width: "100%", padding: "10px", background: "#2EC4B6", color: "#fff",
                    border: "none", borderRadius: 4, fontSize: 14, fontWeight: 700, cursor: "pointer",
                  }}>
                  인증 신청하기
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
