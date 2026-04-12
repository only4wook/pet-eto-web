"use client";
import { useState, useRef, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { supabase, storageClient } from "../../lib/supabase";
import { CAT_DATA, DOG_DATA } from "../../lib/wikiData";
import { getGrade } from "../../lib/grades";
import type { User } from "../../types";

type Tab = "users" | "posts" | "pages" | "analytics" | "images";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<Tab>("users");

  const handleLogin = () => {
    if (password === (process.env.NEXT_PUBLIC_ADMIN_PW || "peteto2026")) setAuthed(true);
    else alert("비밀번호가 올바르지 않습니다.");
  };

  if (!authed) {
    return (
      <>
        <Header />
        <main style={{ maxWidth: 400, margin: "0 auto", padding: "60px 16px", textAlign: "center" }}>
          <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 8, padding: 32 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>관리자 페이지</h2>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="관리자 비밀번호" onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: 4, fontSize: 14, marginBottom: 12 }} />
            <button onClick={handleLogin} style={{
              width: "100%", padding: "10px", background: "#FF6B35", color: "#fff",
              border: "none", borderRadius: 4, fontSize: 14, fontWeight: 700, cursor: "pointer",
            }}>로그인</button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main style={{ maxWidth: 900, margin: "0 auto", padding: "20px 16px", flex: 1 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>관리자 대시보드</h2>

        {/* 탭 */}
        <div style={{ display: "flex", gap: 0, marginBottom: 20, borderBottom: "2px solid #333" }}>
          {[
            { key: "users" as Tab, label: "유저 관리" },
            { key: "posts" as Tab, label: "글 관리" },
            { key: "pages" as Tab, label: "📄 페이지 편집" },
            { key: "analytics" as Tab, label: "📊 사업 분석" },
            { key: "images" as Tab, label: "위키 이미지" },
          ].map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              padding: "10px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer",
              background: tab === t.key ? "#FF6B35" : "transparent",
              color: tab === t.key ? "#fff" : "#333",
              border: "none", borderRadius: "4px 4px 0 0",
            }}>{t.label}</button>
          ))}
        </div>

        {tab === "users" && <UserManagement />}
        {tab === "posts" && <PostManagement />}
        {tab === "pages" && <PageEditor />}
        {tab === "analytics" && <AnalyticsDashboard />}
        {tab === "images" && <ImageManagement />}
      </main>
      <Footer />
    </>
  );
}

// ============ 유저 관리 탭 ============
function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [pointModal, setPointModal] = useState<{ user: User; action: "give" | "take" } | null>(null);
  const [pointAmount, setPointAmount] = useState("");
  const [pointReason, setPointReason] = useState("");
  const [roleModal, setRoleModal] = useState<User | null>(null);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const { data } = await storageClient
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setUsers(data);
    setLoading(false);
  };

  const handlePointAction = async () => {
    if (!pointModal || !pointAmount || !pointReason) { alert("금액과 사유를 입력해주세요."); return; }
    const amount = pointModal.action === "give" ? parseInt(pointAmount) : -parseInt(pointAmount);

    await supabase.from("point_logs").insert({
      user_id: pointModal.user.id,
      amount,
      reason: `[관리자] ${pointReason}`,
    });
    await supabase.rpc("add_points", { uid: pointModal.user.id, pts: amount });

    alert(`${pointModal.user.nickname}님에게 ${amount > 0 ? "+" : ""}${amount}P ${amount > 0 ? "지급" : "차감"} 완료`);
    setPointModal(null);
    setPointAmount("");
    setPointReason("");
    fetchUsers();
  };

  const handleSuspend = async (user: User) => {
    const reason = prompt(`${user.nickname}님 활동정지 사유를 입력하세요:`);
    if (!reason) return;

    await supabase.from("users").update({ role: "suspended" }).eq("id", user.id);
    alert(`${user.nickname}님이 활동정지 처리되었습니다.\n사유: ${reason}`);
    fetchUsers();
  };

  const handleUnsuspend = async (user: User) => {
    await supabase.from("users").update({ role: "user" }).eq("id", user.id);
    alert(`${user.nickname}님의 활동정지가 해제되었습니다.`);
    fetchUsers();
  };

  const handleSetRole = async (user: User, role: string) => {
    await supabase.from("users").update({ role }).eq("id", user.id);
    alert(`${user.nickname}님의 역할이 변경되었습니다.`);
    setRoleModal(null);
    fetchUsers();
  };

  const filtered = search
    ? users.filter((u) => u.nickname?.includes(search) || u.email?.includes(search))
    : users;

  return (
    <div>
      {/* 검색 */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="닉네임 또는 이메일 검색" style={{
            flex: 1, padding: "8px 12px", border: "1px solid #ddd", borderRadius: 4, fontSize: 13,
          }} />
        <button onClick={fetchUsers} style={{
          padding: "8px 16px", background: "#333", color: "#fff", border: "none", borderRadius: 4, fontSize: 13, cursor: "pointer",
        }}>새로고침</button>
      </div>

      {/* 통계 */}
      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        {[
          { label: "전체 유저", value: users.length, color: "#333" },
          { label: "활동정지", value: users.filter((u) => (u as any).role === "suspended").length, color: "#EF4444" },
          { label: "전문가", value: users.filter((u) => (u as any).role?.startsWith("expert")).length, color: "#2EC4B6" },
        ].map((s, i) => (
          <div key={i} style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 6, padding: "12px 16px", textAlign: "center", flex: 1 }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: "#888" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* 유저 목록 */}
      {loading ? <div style={{ textAlign: "center", padding: 40, color: "#888" }}>로딩 중...</div> : (
        <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", border: "1px solid #e0e0e0", borderRadius: 8, overflow: "hidden" }}>
          <thead>
            <tr style={{ background: "#f8f8f8", borderBottom: "1px solid #e0e0e0" }}>
              <th style={th}>닉네임</th>
              <th style={th}>이메일</th>
              <th style={th}>포인트</th>
              <th style={th}>등급</th>
              <th style={th}>역할</th>
              <th style={th}>관리</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: 30, textAlign: "center", color: "#aaa" }}>
                {users.length === 0 ? "등록된 유저가 없습니다." : "검색 결과가 없습니다."}
              </td></tr>
            ) : filtered.map((user) => {
              const grade = getGrade(user.points);
              const role = (user as any).role || "user";
              const isSuspended = role === "suspended";
              return (
                <tr key={user.id} style={{ borderBottom: "1px solid #f0f0f0", background: isSuspended ? "#FEF2F2" : "transparent" }}>
                  <td style={td}>
                    <b>{user.nickname}</b>
                    {isSuspended && <span style={{ color: "#EF4444", fontSize: 10, marginLeft: 4 }}>[정지]</span>}
                  </td>
                  <td style={{ ...td, fontSize: 12, color: "#888" }}>{user.email}</td>
                  <td style={{ ...td, fontWeight: 700, color: "#FF6B35" }}>{user.points}P</td>
                  <td style={td}>{grade.icon} {grade.label}</td>
                  <td style={td}>
                    <span style={{
                      fontSize: 11, padding: "2px 6px", borderRadius: 3,
                      background: role.startsWith("expert") ? "#2EC4B6" : isSuspended ? "#EF4444" : "#f0f0f0",
                      color: role === "user" ? "#666" : "#fff", fontWeight: 600,
                    }}>{role}</span>
                  </td>
                  <td style={td}>
                    <div style={{ display: "flex", gap: 4, justifyContent: "center", flexWrap: "wrap" }}>
                      <button onClick={() => setPointModal({ user, action: "give" })} style={btnStyle("#22C55E")}>+P</button>
                      <button onClick={() => setPointModal({ user, action: "take" })} style={btnStyle("#F59E0B")}>-P</button>
                      {isSuspended ? (
                        <button onClick={() => handleUnsuspend(user)} style={btnStyle("#3B82F6")}>해제</button>
                      ) : (
                        <button onClick={() => handleSuspend(user)} style={btnStyle("#EF4444")}>정지</button>
                      )}
                      <button onClick={() => setRoleModal(user)} style={btnStyle("#8B5CF6")}>역할</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* 포인트 모달 */}
      {pointModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}
          onClick={(e) => { if (e.target === e.currentTarget) setPointModal(null); }}>
          <div style={{ background: "#fff", borderRadius: 12, padding: 24, maxWidth: 380, width: "90%" }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>
              {pointModal.action === "give" ? "포인트 지급" : "포인트 차감"} - {pointModal.user.nickname}
            </h3>
            <div style={{ fontSize: 13, color: "#888", marginBottom: 12 }}>
              현재 포인트: <b style={{ color: "#FF6B35" }}>{pointModal.user.points}P</b>
            </div>
            <input value={pointAmount} onChange={(e) => setPointAmount(e.target.value.replace(/\D/g, ""))}
              placeholder="포인트 금액" type="number" style={{
                width: "100%", padding: "8px 12px", border: "1px solid #ddd", borderRadius: 4, fontSize: 14, marginBottom: 8,
              }} />
            <input value={pointReason} onChange={(e) => setPointReason(e.target.value)}
              placeholder="사유 (예: 이벤트 보상, 규정 위반 차감 등)" style={{
                width: "100%", padding: "8px 12px", border: "1px solid #ddd", borderRadius: 4, fontSize: 14, marginBottom: 12,
              }} />
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setPointModal(null)} style={{
                flex: 1, padding: "10px", border: "1px solid #ddd", borderRadius: 6, background: "#fff", cursor: "pointer",
              }}>취소</button>
              <button onClick={handlePointAction} style={{
                flex: 1, padding: "10px", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 700,
                background: pointModal.action === "give" ? "#22C55E" : "#F59E0B", color: "#fff",
              }}>
                {pointModal.action === "give" ? "지급하기" : "차감하기"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 역할 변경 모달 */}
      {roleModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}
          onClick={(e) => { if (e.target === e.currentTarget) setRoleModal(null); }}>
          <div style={{ background: "#fff", borderRadius: 12, padding: 24, maxWidth: 400, width: "90%" }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>
              역할 변경 - {roleModal.nickname}
            </h3>
            <div style={{ fontSize: 12, color: "#888", marginBottom: 16 }}>
              현재: <b>{(roleModal as any).role || "user"}</b>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { role: "user", label: "일반 유저", icon: "👤", color: "#666", bg: "#f0f0f0" },
                { role: "expert_vet", label: "수의사", icon: "🩺", color: "#fff", bg: "#2EC4B6" },
                { role: "expert_doctor", label: "의사", icon: "⚕️", color: "#fff", bg: "#3B82F6" },
                { role: "expert_pharma", label: "약사", icon: "💊", color: "#fff", bg: "#8B5CF6" },
                { role: "expert_biz", label: "업체", icon: "🏢", color: "#fff", bg: "#F59E0B" },
                { role: "suspended", label: "활동정지", icon: "🚫", color: "#fff", bg: "#EF4444" },
              ].map((r) => {
                const isCurrentRole = ((roleModal as any).role || "user") === r.role;
                return (
                  <button key={r.role} onClick={() => handleSetRole(roleModal, r.role)} style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "12px 16px",
                    border: isCurrentRole ? `2px solid ${r.bg}` : "1px solid #e0e0e0",
                    borderRadius: 8, background: isCurrentRole ? r.bg + "15" : "#fff",
                    cursor: "pointer", textAlign: "left",
                  }}>
                    <span style={{ fontSize: 20 }}>{r.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{r.label}</div>
                      <div style={{ fontSize: 11, color: "#888" }}>{r.role}</div>
                    </div>
                    {isCurrentRole && (
                      <span style={{ background: r.bg, color: r.color, padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 700 }}>현재</span>
                    )}
                  </button>
                );
              })}
            </div>
            <button onClick={() => setRoleModal(null)} style={{
              width: "100%", marginTop: 12, padding: "10px", border: "1px solid #ddd",
              borderRadius: 6, background: "#fff", cursor: "pointer", fontSize: 13,
            }}>닫기</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============ 페이지 편집 탭 ============
function PageEditor() {
  const pages = [
    { key: "about", label: "팀 소개", url: "/about" },
    { key: "terms", label: "이용약관", url: "/terms" },
    { key: "privacy", label: "개인정보처리방침", url: "/privacy" },
    { key: "guide", label: "이용 가이드", url: "/guide" },
    { key: "partner", label: "파트너 신청", url: "/partner" },
  ];
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedContent, setSavedContent] = useState<Record<string, string>>({});

  useEffect(() => {
    // DB에서 페이지 내용 로드
    supabase.from("posts").select("title,content")
      .eq("category", "문의").like("title", "[페이지편집]%")
      .then(({ data }) => {
        if (data) {
          const map: Record<string, string> = {};
          data.forEach((d: any) => {
            const key = d.title.replace("[페이지편집] ", "");
            map[key] = d.content;
          });
          setSavedContent(map);
        }
      });
  }, []);

  const loadPage = (key: string) => {
    setSelectedPage(key);
    setContent(savedContent[key] || "");
  };

  const savePage = async () => {
    if (!selectedPage) return;
    setSaving(true);
    // posts 테이블에 페이지 편집 내용 저장 (upsert 방식)
    const title = `[페이지편집] ${selectedPage}`;
    const existing = await supabase.from("posts").select("id").eq("title", title).maybeSingle();
    if (existing.data) {
      await supabase.from("posts").update({ content }).eq("id", existing.data.id);
    } else {
      await supabase.from("posts").insert({
        category: "문의", title, content,
        tags: ["admin", "page-edit"],
      });
    }
    setSavedContent((prev) => ({ ...prev, [selectedPage]: content }));
    setSaving(false);
    alert("저장 완료! 페이지에 반영하려면 코드 수정이 필요합니다.\n\n저장된 내용은 관리자가 확인할 수 있습니다.");
  };

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 10, marginBottom: 20 }}>
        {pages.map((p) => (
          <button key={p.key} onClick={() => loadPage(p.key)} style={{
            padding: "14px", borderRadius: 12, cursor: "pointer", textAlign: "center",
            border: selectedPage === p.key ? "2px solid #FF6B35" : "1px solid #E5E7EB",
            background: selectedPage === p.key ? "#FFF7ED" : "#fff",
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#1F2937" }}>{p.label}</div>
            <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 4 }}>{p.url}</div>
            <a href={p.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: "#FF6B35" }} onClick={(e) => e.stopPropagation()}>
              미리보기 →
            </a>
          </button>
        ))}
      </div>

      {selectedPage && (
        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 12px", color: "#1F2937" }}>
            📝 {pages.find((p) => p.key === selectedPage)?.label} 편집
          </h3>
          <p style={{ fontSize: 12, color: "#9CA3AF", margin: "0 0 12px" }}>
            여기에 수정할 내용을 작성하세요. 저장하면 DB에 기록되며, 실제 반영은 개발자가 코드에 적용합니다.
          </p>
          <textarea value={content} onChange={(e) => setContent(e.target.value)}
            placeholder="수정할 내용을 자유롭게 작성하세요..."
            style={{
              width: "100%", minHeight: 300, padding: 16, border: "1px solid #E5E7EB",
              borderRadius: 8, fontSize: 14, fontFamily: "inherit", lineHeight: 1.8,
              resize: "vertical", outline: "none",
            }} />
          <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
            <button onClick={savePage} disabled={saving} style={{
              padding: "10px 24px", background: saving ? "#9CA3AF" : "#FF6B35",
              color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: "pointer",
            }}>
              {saving ? "저장 중..." : "💾 저장"}
            </button>
            <a href={pages.find((p) => p.key === selectedPage)?.url} target="_blank" rel="noopener noreferrer" style={{
              padding: "10px 24px", background: "#F3F4F6", color: "#374151",
              border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: "none",
              display: "inline-flex", alignItems: "center",
            }}>
              🔗 현재 페이지 보기
            </a>
          </div>
        </div>
      )}

      {!selectedPage && (
        <div style={{ textAlign: "center", padding: "40px 0", color: "#9CA3AF" }}>
          위에서 편집할 페이지를 선택하세요
        </div>
      )}
    </div>
  );
}

// ============ 사업 분석 탭 ============
function AnalyticsDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const [
        { count: userCount },
        { count: postCount },
        { count: feedCount },
        { count: reviewCount },
        { count: petCount },
        { data: recentUsers },
        { data: recentPosts },
      ] = await Promise.all([
        storageClient.from("users").select("*", { count: "exact", head: true }),
        storageClient.from("posts").select("*", { count: "exact", head: true }),
        storageClient.from("feed_posts").select("*", { count: "exact", head: true }),
        storageClient.from("posts").select("*", { count: "exact", head: true }).eq("category", "후기"),
        storageClient.from("pets").select("*", { count: "exact", head: true }),
        storageClient.from("users").select("nickname,created_at").order("created_at", { ascending: false }).limit(5),
        storageClient.from("posts").select("title,category,created_at").order("created_at", { ascending: false }).limit(5),
      ]);
      setStats({ userCount, postCount, feedCount, reviewCount, petCount, recentUsers, recentPosts });
      setLoading(false);
    }
    fetchStats();
  }, []);

  if (loading) return <div style={{ padding: 40, textAlign: "center", color: "#888" }}>분석 데이터 로딩 중...</div>;

  return (
    <div>
      {/* 핵심 지표 */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 12, marginBottom: 24 }}>
        {[
          { label: "총 회원", value: stats.userCount || 0, icon: "👥", color: "#2563EB" },
          { label: "커뮤니티 글", value: stats.postCount || 0, icon: "📝", color: "#059669" },
          { label: "피드 게시물", value: stats.feedCount || 0, icon: "📸", color: "#D97706" },
          { label: "후기 글", value: stats.reviewCount || 0, icon: "⭐", color: "#DC2626" },
          { label: "등록 반려동물", value: stats.petCount || 0, icon: "🐾", color: "#7C3AED" },
        ].map((s, i) => (
          <div key={i} style={{
            background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12,
            padding: "20px 16px", textAlign: "center",
          }}>
            <div style={{ fontSize: 24, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "#6B7280" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* 사업 현황 분석 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }} className="trust-grid">
        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 12px", color: "#1F2937" }}>👥 최근 가입 회원</h3>
          {(stats.recentUsers || []).map((u: any, i: number) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #F3F4F6", fontSize: 13 }}>
              <span style={{ fontWeight: 600 }}>{u.nickname}</span>
              <span style={{ color: "#9CA3AF", fontSize: 11 }}>{new Date(u.created_at).toLocaleDateString("ko-KR")}</span>
            </div>
          ))}
        </div>
        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 12px", color: "#1F2937" }}>📝 최근 게시글</h3>
          {(stats.recentPosts || []).map((p: any, i: number) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #F3F4F6", fontSize: 13 }}>
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 200 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#FF6B35", marginRight: 4 }}>[{p.category}]</span>
                {p.title}
              </span>
              <span style={{ color: "#9CA3AF", fontSize: 11, flexShrink: 0 }}>{new Date(p.created_at).toLocaleDateString("ko-KR")}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 조언/개선사항 */}
      <div style={{ background: "#FFF7ED", border: "1px solid #FDBA74", borderRadius: 12, padding: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 12px", color: "#C2410C" }}>💡 AI 사업 분석 조언</h3>
        <div style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.8 }}>
          {(stats.userCount || 0) < 10 && <p style={{ margin: "0 0 8px" }}>👥 회원 수가 10명 미만이에요. SNS 홍보, 커뮤니티 활동으로 초기 유저를 확보하세요.</p>}
          {(stats.reviewCount || 0) < 3 && <p style={{ margin: "0 0 8px" }}>⭐ 후기가 부족해요. 첫 후기 작성자에게 추가 포인트를 제공하는 이벤트를 고려하세요.</p>}
          {(stats.feedCount || 0) < 5 && <p style={{ margin: "0 0 8px" }}>📸 피드 게시물이 적어요. 직접 반려동물 사진을 올려 활성화를 시작하세요.</p>}
          {(stats.petCount || 0) < (stats.userCount || 1) && <p style={{ margin: "0 0 8px" }}>🐾 반려동물 등록률이 낮아요. 등록 시 보너스 포인트 이벤트를 진행해보세요.</p>}
          <p style={{ margin: "0 0 8px" }}>📊 Vercel Analytics에서 방문자 데이터를 확인하세요: vercel.com → 프로젝트 → Analytics</p>
          <p style={{ margin: 0 }}>💬 카카오톡 채널 문의 내용을 분석하면 실제 고객 니즈를 파악할 수 있어요.</p>
        </div>
      </div>
    </div>
  );
}

// ============ 글 관리 탭 ============
function PostManagement() {
  type PostTab = "community" | "feed";
  const [postTab, setPostTab] = useState<PostTab>("community");
  const [posts, setPosts] = useState<any[]>([]);
  const [feedPosts, setFeedPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [catFilter, setCatFilter] = useState("전체");

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    // storageClient(anon key 강제)로 조회 — 로그인 유저의 RLS 우회
    const [{ data: p, error: e1 }, { data: f, error: e2 }] = await Promise.all([
      storageClient.from("posts").select("*").order("created_at", { ascending: false }).limit(100),
      storageClient.from("feed_posts").select("*").order("created_at", { ascending: false }).limit(100),
    ]);
    if (p) setPosts(p);
    if (f) setFeedPosts(f);
    if (e1) console.error("posts fetch error:", e1);
    if (e2) console.error("feeds fetch error:", e2);
    setLoading(false);
  };

  const deletePost = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까? 복구할 수 없습니다.")) return;
    try {
      const res = await fetch("/api/admin-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: "peteto2026", table: "posts", id }),
      });
      const data = await res.json();
      if (!res.ok) { alert("삭제 실패: " + (data.error || "알 수 없는 오류")); return; }
      alert("삭제 완료"); fetchAll();
    } catch (err: any) { alert("삭제 실패: " + err.message); }
  };

  const deleteFeed = async (id: string, imageUrl: string) => {
    if (!confirm("정말 삭제하시겠습니까? 복구할 수 없습니다.")) return;
    try {
      const res = await fetch("/api/admin-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: "peteto2026", table: "feed_posts", id, imageUrl }),
      });
      const data = await res.json();
      if (!res.ok) { alert("삭제 실패: " + (data.error || "알 수 없는 오류")); return; }
      alert("삭제 완료"); fetchAll();
    } catch (err: any) { alert("삭제 실패: " + err.message); }
  };

  const categories = ["전체", "질문", "정보", "일상", "긴급", "후기", "문의", "논문", "행사"];
  const filteredPosts = catFilter === "전체" ? posts : posts.filter((p) => p.category === catFilter);
  const formatDate = (d: string) => d ? new Date(d).toLocaleDateString("ko-KR", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "";

  if (loading) return <div style={{ padding: 40, textAlign: "center", color: "#888" }}>로딩 중...</div>;

  return (
    <div>
      {/* 서브 탭 */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button onClick={() => setPostTab("community")} style={{
          padding: "8px 20px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
          background: postTab === "community" ? "#1F2937" : "#F3F4F6",
          color: postTab === "community" ? "#fff" : "#6B7280", border: "none",
        }}>📝 커뮤니티 ({posts.length})</button>
        <button onClick={() => setPostTab("feed")} style={{
          padding: "8px 20px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
          background: postTab === "feed" ? "#1F2937" : "#F3F4F6",
          color: postTab === "feed" ? "#fff" : "#6B7280", border: "none",
        }}>📸 피드 ({feedPosts.length})</button>
        <button onClick={fetchAll} style={{
          marginLeft: "auto", padding: "8px 16px", background: "#333", color: "#fff",
          border: "none", borderRadius: 8, fontSize: 12, cursor: "pointer",
        }}>새로고침</button>
      </div>

      {postTab === "community" && (
        <>
          {/* 카테고리 필터 */}
          <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
            {categories.map((cat) => (
              <button key={cat} onClick={() => setCatFilter(cat)} style={{
                padding: "4px 14px", borderRadius: 16, fontSize: 12, fontWeight: 600, cursor: "pointer",
                background: catFilter === cat ? "#FF6B35" : "#F3F4F6",
                color: catFilter === cat ? "#fff" : "#6B7280", border: "none",
              }}>{cat}</button>
            ))}
          </div>
          <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 8, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#F9FAFB" }}>
                  <th style={th}>카테고리</th>
                  <th style={{ ...th, textAlign: "left" }}>제목</th>
                  <th style={th}>작성자</th>
                  <th style={th}>날짜</th>
                  <th style={th}>조회</th>
                  <th style={th}>관리</th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts.map((p) => (
                  <tr key={p.id} style={{ borderBottom: "1px solid #F3F4F6" }}>
                    <td style={td}><span style={{
                      fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 8,
                      background: p.category === "긴급" ? "#FEE2E2" : p.category === "질문" ? "#EFF6FF" : "#F3F4F6",
                      color: p.category === "긴급" ? "#DC2626" : p.category === "질문" ? "#2563EB" : "#6B7280",
                    }}>{p.category}</span></td>
                    <td style={{ ...td, textAlign: "left", maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</td>
                    <td style={td}>{(p as any).author?.nickname || p.author_id?.slice(0, 8) || "?"}</td>
                    <td style={{ ...td, fontSize: 11, color: "#9CA3AF" }}>{formatDate(p.created_at)}</td>
                    <td style={td}>{p.view_count}</td>
                    <td style={td}>
                      <button onClick={() => deletePost(p.id)} style={btnStyle("#EF4444")}>삭제</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredPosts.length === 0 && <div style={{ padding: 20, textAlign: "center", color: "#aaa", fontSize: 13 }}>등록된 글이 없습니다.</div>}
          </div>
        </>
      )}

      {postTab === "feed" && (
        <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 8, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#F9FAFB" }}>
                <th style={th}>미리보기</th>
                <th style={{ ...th, textAlign: "left" }}>설명</th>
                <th style={th}>작성자</th>
                <th style={th}>날짜</th>
                <th style={th}>관리</th>
              </tr>
            </thead>
            <tbody>
              {feedPosts.map((f) => (
                <tr key={f.id} style={{ borderBottom: "1px solid #F3F4F6" }}>
                  <td style={td}>
                    {f.image_url?.endsWith(".mp4")
                      ? <span style={{ fontSize: 11, color: "#2563EB" }}>🎥 동영상</span>
                      : <img src={f.image_url} alt="" style={{ width: 40, height: 40, borderRadius: 6, objectFit: "cover" }}
                          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />}
                  </td>
                  <td style={{ ...td, textAlign: "left", maxWidth: 250, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 12 }}>
                    {f.description?.slice(0, 50)}
                  </td>
                  <td style={td}>{(f as any).author?.nickname || f.author_id?.slice(0, 8) || "?"}</td>
                  <td style={{ ...td, fontSize: 11, color: "#9CA3AF" }}>{formatDate(f.created_at)}</td>
                  <td style={td}>
                    <button onClick={() => deleteFeed(f.id, f.image_url)} style={btnStyle("#EF4444")}>삭제</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {feedPosts.length === 0 && <div style={{ padding: 20, textAlign: "center", color: "#aaa", fontSize: 13 }}>등록된 피드가 없습니다.</div>}
        </div>
      )}
    </div>
  );
}

// ============ 이미지 관리 탭 ============
function ImageManagement() {
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [selectedBreed, setSelectedBreed] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const allBreeds = [
    ...CAT_DATA.breeds.map((b) => ({ ...b, species: "cat", speciesLabel: "고양이" })),
    ...DOG_DATA.breeds.map((b) => ({ ...b, species: "dog", speciesLabel: "강아지" })),
  ];

  // 이미지 압축 (최대 800px, JPEG 70%)
  const compressImage = (file: File): Promise<Blob> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxSize = 800;
        let w = img.width, h = img.height;
        if (w > maxSize || h > maxSize) {
          if (w > h) { h = (h / w) * maxSize; w = maxSize; }
          else { w = (w / h) * maxSize; h = maxSize; }
        }
        canvas.width = w;
        canvas.height = h;
        canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
        canvas.toBlob((blob) => resolve(blob!), "image/jpeg", 0.7);
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const handleUpload = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) { alert("파일을 선택해주세요."); return; }
    if (!selectedBreed) { alert("품종을 선택해주세요."); return; }
    setUploading(true);

    // 이미지 압축 후 업로드
    const compressed = await compressImage(file);
    const fileName = `wiki/${selectedBreed}-${Date.now()}.jpg`;
    const { error } = await supabase.storage.from("feed-images").upload(fileName, compressed, { contentType: "image/jpeg" });
    if (error) { alert("업로드 실패: " + error.message); setUploading(false); return; }

    const { data: urlData } = supabase.storage.from("feed-images").getPublicUrl(fileName);
    const publicUrl = urlData.publicUrl;

    // DB에 이미지 URL 저장 (upsert: 있으면 업데이트, 없으면 삽입)
    await supabase.from("breed_images").upsert({
      id: selectedBreed,
      image_url: publicUrl,
      updated_at: new Date().toISOString(),
    });

    setUploadedUrl(publicUrl);
    setUploading(false);
    alert("업로드 완료! 위키 페이지에 자동 반영됩니다.");
  };

  return (
    <div>
      <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 8, padding: 20, marginBottom: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>품종 이미지 업로드</h3>
        <select value={selectedBreed} onChange={(e) => setSelectedBreed(e.target.value)}
          style={{ width: "100%", padding: "8px 12px", border: "1px solid #ddd", borderRadius: 4, fontSize: 13, marginBottom: 12 }}>
          <option value="">-- 품종 선택 --</option>
          <optgroup label="고양이">
            {CAT_DATA.breeds.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </optgroup>
          <optgroup label="강아지">
            {DOG_DATA.breeds.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </optgroup>
        </select>
        <input ref={fileRef} type="file" accept="image/*"
          style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: 4, fontSize: 13, marginBottom: 12 }} />
        <button onClick={handleUpload} disabled={uploading} style={{
          width: "100%", padding: "10px", background: uploading ? "#ccc" : "#FF6B35", color: "#fff",
          border: "none", borderRadius: 4, fontSize: 14, fontWeight: 700, cursor: "pointer",
        }}>{uploading ? "업로드 중..." : "이미지 업로드"}</button>

        {uploadedUrl && (
          <div style={{ marginTop: 12, padding: 12, background: "#F0FFF4", borderRadius: 6 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#16A34A" }}>업로드 완료!</div>
            <img src={uploadedUrl} alt="" style={{ maxWidth: "100%", maxHeight: 200, borderRadius: 4, marginTop: 8 }} />
            <button onClick={() => { navigator.clipboard.writeText(uploadedUrl); alert("URL 복사됨!"); }}
              style={{ marginTop: 8, padding: "6px 12px", background: "#333", color: "#fff", border: "none", borderRadius: 4, fontSize: 12, cursor: "pointer" }}>
              URL 복사
            </button>
          </div>
        )}
      </div>

      <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 8, padding: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>현재 이미지 현황</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 8 }}>
          {allBreeds.map((b) => (
            <div key={b.id} style={{ border: "1px solid #f0f0f0", borderRadius: 6, overflow: "hidden", fontSize: 11 }}>
              <img src={b.image} alt={b.name} style={{ width: "100%", height: 70, objectFit: "cover" }}
                onError={(e) => { (e.target as HTMLImageElement).style.background = "#f0f0f0"; }} />
              <div style={{ padding: "3px 6px", fontWeight: 600 }}>{b.speciesLabel} · {b.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const th: React.CSSProperties = { padding: "8px 6px", fontSize: 12, fontWeight: 600, color: "#666", textAlign: "center", whiteSpace: "nowrap" };
const td: React.CSSProperties = { padding: "8px 6px", fontSize: 13, textAlign: "center" };
const btnStyle = (bg: string): React.CSSProperties => ({
  padding: "3px 8px", background: bg, color: "#fff", border: "none",
  borderRadius: 3, fontSize: 11, cursor: "pointer", fontWeight: 600,
});
