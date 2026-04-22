"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import GradeBadge from "../../components/GradeBadge";
import { useAppStore } from "../../lib/store";
import { supabase } from "../../lib/supabase";
import { getGrade, getNextGrade, GRADE_REQUIREMENTS, POINT_RULES, ROLE_TABLE } from "../../lib/grades";
import { useI18n } from "../../components/I18nProvider";
import type { Pet } from "../../types";

// 등급·역할·포인트 규칙의 한글 값을 EN 라벨로 매핑
const GRADE_LABEL_I18N: Record<string, { en: string; key: string }> = {
  "새싹 반려인":   { en: "Sprout",       key: "grades.sprout" },
  "초보 반려인":   { en: "Beginner",     key: "grades.beginner" },
  "중급 반려인":   { en: "Intermediate", key: "grades.intermediate" },
  "고급 반려인":   { en: "Advanced",     key: "grades.advanced" },
  "준전문가":      { en: "Semi-Expert",  key: "grades.semiExpert" },
  "마스터":        { en: "Master",       key: "grades.master" },
};
const CONDITION_I18N: Record<string, string> = {
  "회원가입 시 자동 부여":                          "grades.reqSprout",
  "100P 이상 (글 10개 또는 댓글 20개)":             "grades.reqBeginner",
  "500P 이상":                                       "grades.reqIntermediate",
  "1,500P 이상":                                     "grades.reqAdvanced",
  "5,000P 이상 + 전문가답변 채택 10회 이상":        "grades.reqSemiExpert",
  "15,000P 이상 + 커뮤니티 기여 우수자":            "grades.reqMaster",
};
const ACTION_I18N: Record<string, string> = {
  "회원가입":         "grades.ruleSignup",
  "게시글 작성":      "grades.rulePost",
  "댓글 작성":        "grades.ruleComment",
  "좋아요 받기":      "grades.ruleLike",
  "전문가 답변 채택": "grades.ruleExpertAccept",
  "일일 출석":        "grades.ruleAttend",
};
const ROLE_I18N: Record<string, string> = {
  "수의사": "mypageExtra.roleVet",
  "의사":   "mypageExtra.roleDoctor",
  "약사":   "mypageExtra.rolePharma",
  "업체":   "mypageExtra.roleShop",
};

export default function MyPage() {
  const user = useAppStore((s) => s.user);
  const [showExpertForm, setShowExpertForm] = useState(false);
  const [myPets, setMyPets] = useState<Pet[]>([]);
  const [myPostCount, setMyPostCount] = useState(0);
  const [myFeedCount, setMyFeedCount] = useState(0);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [myPosts, setMyPosts] = useState<any[]>([]);
  const [myFeeds, setMyFeeds] = useState<any[]>([]);
  const { t, locale } = useI18n();
  const gradeLabel = (ko: string) => locale === "en" ? (GRADE_LABEL_I18N[ko]?.en ?? ko) : ko;

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
            {t("mypage.title")}
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
                  {grade.icon} {t("mypage.currentGrade")}: <span style={{ color: grade.color }}>{gradeLabel(grade.label)}</span>
                </span>
                {next && (
                  <span style={{ fontSize: 12, color: "#888" }}>
                    {t("mypage.toNextGrade")} <b style={{ color: "#FF6B35" }}>{remaining}P</b>
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
                  {locale === "en" ? "You've reached the highest grade!" : "최고 등급에 도달했습니다!"}
                </div>
              )}
            </div>

            {/* 통계 */}
            <div style={{
              display: "flex", gap: 0, textAlign: "center",
              border: "1px solid #e0e0e0", borderRadius: 4, overflow: "hidden", marginBottom: 20,
            }}>
              {[
                { label: t("mypage.points"), value: points, color: "#FF6B35" },
                { label: t("mypage.posts"), value: myPostCount, color: "#333" },
                { label: t("mypage.feeds"), value: myFeedCount, color: "#333" },
                { label: t("mypage.pets"), value: myPets.length, color: "#2EC4B6" },
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
                { label: t("mypage.myPosts"), key: "posts", action: () => { setActiveMenu(activeMenu === "posts" ? null : "posts"); loadMyPosts(); } },
                { label: t("mypage.myFeeds"), key: "feeds", action: () => { setActiveMenu(activeMenu === "feeds" ? null : "feeds"); loadMyFeeds(); } },
                { label: t("mypage.myPets"), key: "pets", action: () => { const el = document.getElementById("my-pets"); el?.scrollIntoView({ behavior: "smooth" }); } },
                { label: t("mypage.guide"), key: "guide", action: () => { window.location.href = "/guide"; } },
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
            📊 {t("mypage.gradeSystem")}
          </div>
          <div style={{ padding: 16 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#f8f8f8" }}>
                  <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600 }}>{t("grades.column1")}</th>
                  <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600 }}>{t("grades.column2")}</th>
                </tr>
              </thead>
              <tbody>
                {GRADE_REQUIREMENTS.map((g, i) => {
                  const condKey = CONDITION_I18N[g.condition];
                  return (
                    <tr key={i} style={{ borderBottom: "1px solid #f0f0f0" }}>
                      <td style={{ padding: "8px 12px", fontWeight: grade.label === g.grade ? 700 : 400, color: grade.label === g.grade ? "#FF6B35" : "#333" }}>
                        {grade.label === g.grade ? "▶ " : ""}{gradeLabel(g.grade)}
                      </td>
                      <td style={{ padding: "8px 12px", color: "#666" }}>{condKey ? t(condKey) : g.condition}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div style={{ marginTop: 16, fontSize: 13, fontWeight: 700 }}>{t("grades.rulesTitle")}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
              {POINT_RULES.map((r, i) => {
                const actKey = ACTION_I18N[r.action];
                return (
                  <span key={i} style={{
                    background: "#f8f8f8", padding: "4px 10px", borderRadius: 4,
                    fontSize: 12, color: "#555",
                  }}>
                    {actKey ? t(actKey) : r.action}: <b style={{ color: "#FF6B35" }}>{r.points}</b>
                  </span>
                );
              })}
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
            <span>🐾 {t("mypage.myPets")}</span>
            <Link href="/pet/register" style={{
              background: "#FF6B35", color: "#fff", border: "none", borderRadius: 4,
              padding: "4px 12px", fontSize: 12, fontWeight: 600, textDecoration: "none",
            }}>{t("mypageExtra.addPet")}</Link>
          </div>
          <div style={{ padding: "12px 20px" }}>
            {myPets.length === 0 ? (
              <div style={{ textAlign: "center", padding: "20px 0", color: "#888" }}>
                <p style={{ fontSize: 14, margin: "0 0 8px" }}>{t("mypageExtra.noPets")}</p>
                <Link href="/pet/register" style={{
                  color: "#FF6B35", fontSize: 13, fontWeight: 600,
                }}>{t("mypageExtra.registerPet")}</Link>
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
            <span>🩺 {t("mypageExtra.expertApplyTitle")}</span>
            <button onClick={() => setShowExpertForm(!showExpertForm)} style={{
              background: "#2EC4B6", color: "#fff", border: "none", borderRadius: 4,
              padding: "4px 12px", fontSize: 12, cursor: "pointer", fontWeight: 600,
            }}>
              {showExpertForm ? t("common2.close") : t("mypageExtra.expertApplyCta")}
            </button>
          </div>

          <div style={{ padding: 16 }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
              {ROLE_TABLE.map((r) => {
                const roleKey = ROLE_I18N[r.label];
                return (
                  <span key={r.role} style={{
                    background: r.bgColor, color: r.color,
                    padding: "4px 12px", borderRadius: 4, fontSize: 12, fontWeight: 700,
                  }}>
                    {roleKey && locale === "en" ? t(roleKey) : `${r.icon} ${r.label}`}
                  </span>
                );
              })}
            </div>
            <p style={{ fontSize: 12, color: "#888", margin: 0, lineHeight: 1.6 }}>
              {t("mypageExtra.expertApplyDesc")}
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
