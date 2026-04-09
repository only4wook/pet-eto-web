"use client";
import { useState, useRef, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { supabase } from "../../lib/supabase";
import { CAT_DATA, DOG_DATA } from "../../lib/wikiData";
import { getGrade } from "../../lib/grades";
import type { User } from "../../types";

type Tab = "users" | "images";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<Tab>("users");

  const handleLogin = () => {
    if (password === "peteto2026") setAuthed(true);
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

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const { data } = await supabase
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

  const handleSetRole = async (user: User) => {
    const role = prompt(
      `${user.nickname}님의 역할을 변경합니다.\n입력: user, expert_vet, expert_doctor, expert_pharma, expert_biz, suspended`,
      (user as any).role || "user"
    );
    if (!role) return;

    await supabase.from("users").update({ role }).eq("id", user.id);
    alert(`${user.nickname}님의 역할이 "${role}"로 변경되었습니다.`);
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
                      <button onClick={() => handleSetRole(user)} style={btnStyle("#8B5CF6")}>역할</button>
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

  const handleUpload = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) { alert("파일을 선택해주세요."); return; }
    if (!selectedBreed) { alert("품종을 선택해주세요."); return; }
    setUploading(true);

    const fileName = `wiki/${selectedBreed}-${Date.now()}.${file.name.split(".").pop()}`;
    const { error } = await supabase.storage.from("feed-images").upload(fileName, file, { contentType: file.type });
    if (error) { alert("업로드 실패: " + error.message); setUploading(false); return; }

    const { data: urlData } = supabase.storage.from("feed-images").getPublicUrl(fileName);
    setUploadedUrl(urlData.publicUrl);
    setUploading(false);
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
