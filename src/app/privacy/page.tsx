import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main style={{ maxWidth: 800, margin: "0 auto", padding: "20px 16px", flex: 1 }}>
        <div style={{ background: "#fff", borderRadius: 12, padding: "32px 28px", border: "1px solid #F3F4F6" }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1F2937", margin: "0 0 8px" }}>개인정보처리방침</h1>
          <p style={{ fontSize: 12, color: "#9CA3AF", margin: "0 0 24px" }}>시행일: 2026년 4월 9일</p>

          {[
            {
              title: "1. 개인정보의 수집 및 이용 목적",
              content: "펫에토(이하 '회사')는 다음의 목적을 위하여 개인정보를 수집·이용합니다.\n\n- 회원 가입 및 관리: 회원제 서비스 이용에 따른 본인확인, 개인식별, 불량회원 부정이용 방지, 가입의사 확인\n- 서비스 제공: 반려동물 케어 매칭 서비스, 커뮤니티 운영, 위키 정보 제공\n- 마케팅 활용: 신규 서비스 개발, 이벤트 정보 제공, 서비스 이용 통계"
            },
            {
              title: "2. 수집하는 개인정보 항목",
              content: "- 필수 항목: 이메일 주소, 닉네임, 비밀번호\n- 선택 항목: 반려동물 정보(이름, 종, 품종, 성별, 체중)\n- 자동 수집 항목: 접속 IP 정보, 방문 일시, 서비스 이용 기록"
            },
            {
              title: "3. 개인정보의 보유 및 이용 기간",
              content: "회원 탈퇴 시까지 보유하며, 탈퇴 즉시 파기합니다. 단, 관련 법령에 따라 일정 기간 보존이 필요한 경우 해당 기간 동안 보관합니다.\n\n- 전자상거래 등에서의 소비자보호에 관한 법률: 계약 또는 청약철회에 관한 기록 5년\n- 통신비밀보호법: 접속 로그 기록 3개월"
            },
            {
              title: "4. 개인정보의 제3자 제공",
              content: "회사는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다. 다만, 이용자가 사전에 동의한 경우, 법령의 규정에 의한 경우에 한하여 제공할 수 있습니다."
            },
            {
              title: "5. 개인정보의 파기",
              content: "회사는 개인정보 보유기간의 경과, 처리목적 달성 등으로 개인정보가 불필요하게 되었을 때에는 지체 없이 해당 개인정보를 파기합니다.\n\n- 전자적 파일: 복원이 불가능한 방법으로 영구 삭제\n- 서면 자료: 분쇄기로 분쇄 또는 소각"
            },
            {
              title: "6. 개인정보 보호책임자",
              content: "성명: 권대욱\n직위: 대표\n이메일: peteto2026@gmail.com\n\n기타 개인정보침해에 대한 신고나 상담이 필요하신 경우 아래 기관에 문의하시기 바랍니다.\n- 개인정보침해신고센터 (privacy.kisa.or.kr / 118)\n- 대검찰청 사이버수사과 (www.spo.go.kr / 1301)\n- 경찰청 사이버안전국 (cyberbureau.police.go.kr / 182)"
            },
            {
              title: "7. 개인정보처리방침의 변경",
              content: "이 개인정보처리방침은 2026년 4월 9일부터 적용되며, 법령·정책 또는 보안기술의 변경에 따라 내용이 추가·삭제 및 수정이 있을 시에는 변경사항 시행 7일 전부터 공지사항을 통해 고지합니다."
            },
          ].map((section, i) => (
            <div key={i} style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: "#1F2937", margin: "0 0 8px" }}>{section.title}</h2>
              <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.8, margin: 0, whiteSpace: "pre-line" }}>{section.content}</p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
