# 🔑 OPENAI_API_KEY — Vercel 환경변수 등록 가이드

> 대욱님이 직접 해야 하는 작업. 약 3분.

---

## 📋 왜 대문자여야 하는가?

**Vercel + Node.js 표준 관례**:
- 환경변수는 `SCREAMING_SNAKE_CASE` (대문자 + 언더스코어)
- 이전에 `openai_API_KEY` (소문자 시작)으로 등록하셨던 게 있다면 → **대문자로 재등록** 필요
- 코드에서 `process.env.OPENAI_API_KEY`로 정확히 참조해야 인식됨

---

## 🚀 단계별 가이드

### STEP 1. OpenAI API 키 발급 (이미 있으면 스킵)

1. https://platform.openai.com/api-keys 접속
2. **Sign in** (Google 로그인 가능)
3. 우측 상단 **"+ Create new secret key"** 클릭
4. 이름 입력: `peteto-prod-2026-04`
5. **Create secret key** 클릭
6. **`sk-proj-...`로 시작하는 긴 문자열이 나타남** → **즉시 복사**
   - ⚠️ 이 화면 닫으면 다시 볼 수 없음
   - 1Password/Bitwarden에 백업 저장

### STEP 2. Vercel 환경변수 등록

1. https://vercel.com/dashboard 접속
2. **pet-eto-web** 프로젝트 클릭
3. 상단 탭 **"Settings"** 클릭
4. 좌측 메뉴 **"Environment Variables"** 클릭
5. **기존 `openai_API_KEY` (소문자)가 있다면 먼저 삭제**
   - 해당 행 우측 `⋮` → Delete
6. 새로 등록:
   - **Key**: `OPENAI_API_KEY` ← **반드시 이 이름 그대로, 대문자**
   - **Value**: `sk-proj-...` (방금 복사한 키)
   - **Environment**: **Production + Preview + Development** 모두 체크
7. **Save** 클릭

### STEP 3. 재배포 (필수)

환경변수 변경은 **새 배포부터 반영**됩니다:

방법 A (GitHub 자동):
- 다음 Git push 시 자동 반영

방법 B (즉시 적용):
1. Vercel Dashboard → pet-eto-web → **Deployments** 탭
2. 가장 최근 배포 우측 `⋮` 클릭
3. **"Redeploy"** 클릭
4. ✅ "Use existing build cache" 체크
5. **Redeploy** 클릭
6. 약 1~2분 대기

### STEP 4. 동작 확인

배포 완료 후, 다음 중 하나로 테스트:

**테스트 A — 브라우저**:
1. https://www.peteto.kr/ai 접속
2. EN 토글
3. 복잡한 질문: `"My dog has had chronic skin allergies for 2 years"`
4. 응답에 **"GPT-4o mini"** 출처 표시되면 성공 ✅

**테스트 B — 로컬 (Node)**:
```bash
cd C:\pet-eto-web
# .env.local에 OPENAI_API_KEY 추가 (Vercel과 동일한 값)
npm run dev
# http://localhost:3000/ai 에서 테스트
```

---

## 💰 비용 관리

### GPT-4o mini 요금 (2026년 4월 기준)
- 입력: **$0.15 / 1M 토큰**
- 출력: **$0.60 / 1M 토큰**
- 펫에토 평균 1회 대화: ~500 입력 + ~500 출력 = **약 0.00038달러 (0.5원)**

### 월 1만 회 대화 시 예상 비용
- 총 비용: **약 $3.75 (5,000원)**
- Gemini 단독 사용 대비 +5,000원/월

### 비용 제한 설정 (권장)
1. https://platform.openai.com/account/billing/limits
2. **Usage limits** 설정:
   - **Soft limit**: $5/월 → 이메일 경고
   - **Hard limit**: $20/월 → 자동 차단
3. 초기엔 Hard limit $10~20 권장 (폭주 방지)

---

## 🚨 보안 체크리스트

- [ ] OpenAI 키를 GitHub에 커밋한 적 없음 (`.env.local`은 `.gitignore`)
- [ ] 대화방·이메일로 키 전송한 적 없음
- [ ] 1Password/Bitwarden에 백업 저장
- [ ] Vercel 팀 멤버 중 신뢰할 수 있는 사람만 접근 가능
- [ ] OpenAI 대시보드에 **IP 제한** 설정 (선택): `*.vercel.app` + `localhost`

---

## 🆘 문제 해결

### "OPENAI_API_KEY 미설정" 에러
- Vercel에 정확히 `OPENAI_API_KEY` (대문자 9자 + 언더스코어) 이름으로 등록됐는지 확인
- Redeploy 했는지 확인 (환경변수 변경 후 필수)
- Production/Preview/Development 모두 체크했는지

### 401 Unauthorized 에러
- OpenAI 계정에 결제 수단 등록됐는지 확인
- 키가 Revoke 되지 않았는지 확인
- 키 복사 시 공백/줄바꿈이 포함되지 않았는지

### Rate limit (429) 에러
- OpenAI 계정 tier 확인: https://platform.openai.com/account/limits
- 무료 tier는 매우 제한적 → $5 이상 결제 후 tier 1 승격 필요

---

## 📊 모니터링

### OpenAI 사용량 대시보드
- https://platform.openai.com/usage
- 일별/월별 토큰 사용량 + 비용 확인

### Vercel 배포 로그
- Vercel Dashboard → pet-eto-web → Deployments → (최신) → Function logs
- GPT 호출 에러 발생 시 여기서 확인 가능

---

## ✅ 완료 체크

- [ ] OpenAI 키 발급 + 1Password 백업
- [ ] Vercel에 `OPENAI_API_KEY` (대문자) 등록
- [ ] Production/Preview/Development 모두 체크
- [ ] Redeploy 완료
- [ ] 브라우저 테스트 통과 (영문 복잡 질문 → GPT 답변)
- [ ] 비용 Hard limit 설정 ($20/월)

대욱님, 이 체크리스트 다 하시면 바로 말씀해주세요. 제가 테스트 도와드리겠습니다! 🐾
