# 🤝 Handoff — Claude Code ↔ Cursor 공유 작업일지

> 이 파일은 **Claude Code와 Cursor가 번갈아 작업할 때** 서로에게 남기는 인수인계서입니다.
> 작업을 시작하기 전에 **맨 위 2~3개 항목**을 반드시 읽고, 작업이 끝나면 맨 위에 새 항목을 추가하세요.

## [2026-04-25 19:05] — Cursor
**작업**: 여러 장 사진 업로드 기능 복구
**상태**: 완료 ✅
**변경 파일**: `src/app/feed/upload/page.tsx`, `src/app/feed/[id]/page.tsx`, `src/types/index.ts`, `.ai-context/handoff.md`
**다음 단계**: 커밋/푸시/Production Promote 후 모바일에서 앨범 다중 선택 테스트
**주의사항**: 최대 5장 선택, 첫 장 대표 이미지, `analysis_result.image_urls`에 전체 URL 저장, 상세 페이지에서 좌우 스와이프 갤러리 표시. AI 분석은 여러 장을 각각 분석해 가장 심각한 등급을 적용. 빌드 통과.

---

## [2026-04-25 18:56] — Cursor
**작업**: 피드 본문 AI 텍스트 제거 수정분 Production Promote
**상태**: 완료 ✅
**변경 파일**: `.ai-context/handoff.md`
**다음 단계**: 모바일에서 `peteto.kr/feed` 또는 해당 상세 페이지 새로고침 후 빨간 표시 영역 제거 확인
**주의사항**: 원인: `design/awwwards-redesign` 푸시는 Preview만 만들고 Production 자동 반영이 아니었음. `vercel promote https://pet-3m2b6h2z3-only4wooks-projects.vercel.app --yes` 실행했고 최신 Production `pet-by1ufh2u4-only4wooks-projects.vercel.app` Ready 확인.

---

## [2026-04-25 18:52] — Cursor
**작업**: 사용자가 표시한 피드 본문 AI 분석 노출 제거 재점검
**상태**: 완료 ✅
**변경 파일**: `src/lib/utils.ts`, `src/components/FeedPreviewStream.tsx`, `.ai-context/handoff.md`
**다음 단계**: 현재 수정은 로컬 워킹트리에만 있음. `peteto.kr` 반영을 위해 커밋/푸시/배포 필요.
**주의사항**: `stripInlineAiAnalysis()`가 `🤖` 단독, `AI 이미지 분석`, `사진 N장 분석 결과`, `[사진 N]` 패턴과 뒤에 남는 구분자까지 제거하도록 강화. `FeedCard`, 상세 페이지, 홈 피드 미리보기 모두 공통 유틸 사용. 빌드 통과.

---

## [2026-04-25 18:47] — Cursor
**작업**: 피드 본문 내 AI 분석 텍스트 제거 로직 강화
**상태**: 완료 ✅
**변경 파일**: `src/lib/utils.ts`, `src/components/FeedCard.tsx`, `src/app/feed/[id]/page.tsx`, `.ai-context/handoff.md`
**다음 단계**: 배포 후 대욱님이 표시한 빨간 원 영역이 `/feed`와 `/feed/[id]` 본문에서 사라졌는지 확인
**주의사항**: `--- AI 이미지 분석`, `🤖 AI 분석`, `사진 3장 분석 결과`, `[사진 1]` 같은 과거 저장 데이터 패턴까지 공통 유틸 `stripInlineAiAnalysis()`로 제거. AI 분석 전문은 상세 분석 카드에서만 유지. 빌드 통과.

---

## [2026-04-25 18:43] — Cursor
**작업**: 피드 목록에서 AI 분석 전문 중복 노출 제거
**상태**: 완료 ✅
**변경 파일**: `src/components/FeedCard.tsx`, `src/app/feed/[id]/page.tsx`, `.ai-context/handoff.md`
**다음 단계**: 배포 후 `/feed` 목록에서 사용자 본문만 보이고, `/feed/[id]` 상세에서만 AI 상세 분석이 보이는지 모바일 QA
**주의사항**: 과거 데이터처럼 `description`에 `---` 또는 `🤖 AI 이미지 분석:`이 섞인 글도 사용자 작성 부분만 표시하도록 방어 처리. `npm --prefix "/Users/wook/Developer/pet-eto-web" run build` 통과.

---

## [2026-04-25 18:38] — Cursor
**작업**: `/feed/upload` 사진 업로드 무한로딩 방지
**상태**: 완료 ✅
**변경 파일**: `src/app/feed/upload/page.tsx`, `src/app/api/analyze-image/route.ts`, `.ai-context/handoff.md`
**다음 단계**: 배포 후 갤럭시 앨범 사진/아이폰 사진 각각 실제 업로드 QA
**주의사항**: 원본 대용량 사진을 그대로 보내던 흐름을 압축본 업로드/분석으로 변경했고, 업로드·AI 분석·DB 저장에 타임아웃을 추가. AI 분석이 늦거나 실패해도 피드는 `pending` 분석 상태로 저장되도록 유지.

---

## [2026-04-25 18:30] — Cursor
**작업**: GPT 앙상블 운영 검수 + AI 답변 참고 출처 표시 1차 구현
**상태**: 완료 ✅
**변경 파일**: `src/lib/medicalSources.ts`, `src/lib/openaiClient.ts`, `src/app/api/ai-chat/route.ts`, `src/app/api/analyze-image/route.ts`, `src/components/HeroSection.tsx`, `src/app/feed/[id]/page.tsx`, `src/app/feed/upload/page.tsx`, `src/types/index.ts`, `.ai-context/handoff.md`
**다음 단계**: 배포 후 Vercel Function 로그에서 `[ai-chat] OpenAI fallback` / `[OpenAI]` 항목 확인, 긴급 질문에서 `meta.sources`가 Gemini+GPT로 바뀌는지 재검수
**주의사항**: 라이브 검수 결과 normal=Gemini 단일, complex=GPT 실패 후 Gemini 폴백, critical=ensemble 진입 후 Gemini만 성공. 로컬 Vercel 프로젝트 링크가 없어 env 목록 직접 조회는 불가했고, `npm --prefix "/Users/wook/Developer/pet-eto-web" run build` 통과 확인.

---

## [2026-04-25 18:20] — Cursor
**작업**: `peteto.kr` 라이브 AI 기능 및 Claude Code 개선 내용 평가
**상태**: 완료 ✅
**변경 파일**: `.ai-context/handoff.md`
**다음 단계**: 운영 환경에서 GPT/OpenAI 키 연결 상태 확인 시 앙상블 완성도 검증
**주의사항**: 라이브 `/api/ai-chat` 테스트에서 critical 질문은 ensemble 경로로 분류됐지만 응답 sources는 Gemini만 표시됨

---

## [2026-04-25 18:18] — Cursor
**작업**: `pet-eto-web` 프로젝트 폴더 위치 확인
**상태**: 완료 ✅
**변경 파일**: `.ai-context/handoff.md`
**다음 단계**: 실제 코드 작업 필요 시 `/Users/wook/Developer/pet-eto-web`에서 이어서 진행
**주의사항**: 단순 위치 확인 작업이며 코드 변경 없음

---

## 📝 형식
```markdown
## [YYYY-MM-DD HH:MM] — [AI 이름: Claude Code / Cursor]
**작업**: 한 줄 요약
**상태**: 완료 ✅ / 진행중 🔄 / 막힘 ⚠️
**변경 파일**: `path/to/file.tsx`
**다음 단계**: 다음에 해야 할 일
**주의사항**: 상대 AI가 알아야 할 특이점
```

---

## [2026-04-23 08:30] — Claude Code
**작업**: TTcare 경쟁 대응 — AI 영어 응답 개선 + 31 증상 체크 + 학습 파이프라인 구축
**상태**: 완료 ✅ (커밋 63d9d71)
**변경 파일**:
- `src/lib/aiPromptsEn.ts` (신규, 영어 수의사 페르소나 한국어 동급)
- `src/lib/symptomTaxonomy.ts` (신규, 31개 증상 체크 시스템)
- `src/lib/aiFallbackEn.ts` (신규, 영어 룰 폴백 13개 케이스)
- `src/app/api/ai-chat/route.ts` (locale별 페르소나 분리)
- `src/app/api/analyze-image/route.ts` (31 증상 체크리스트 주입)
- `src/components/HeroSection.tsx` (EN 폴백 연결)
- `supabase/migrations/20260423_training_dataset.sql` (신규, 학습 데이터 파이프라인)
- `docs/ai-strategy-vs-ttcare.md` (신규, 경쟁 전략 4단계 로드맵)
**다음 단계**:
- Vercel 프리뷰 QA (EN 질문 → EN 답변)
- Supabase training_dataset 마이그레이션 실행
- main 승격 PR (i18n + AI 업그레이드 한꺼번에)
- GPT-4o 앙상블 구현 (Q2)
- 수의사 섭외로 전문가 답변 corpus 축적 시작
**주의사항**:
- 대욱님이 "TTcare 경쟁력 필요" 강하게 피력 → 단순 기능 추가가 아니라 4단계 전략 로드맵 문서화
- "기술력 부족" 프레임 재정의: Vision CNN 단일 축 vs 펫에토 하이브리드
- Gemini 쿼터 소진 시에도 EN/KO 모두 품질 폴백 보장
- 학습 데이터 Day 1부터 수집 시작 → 12개월 후 자체 Vision 모델 파인튜닝 목표

---

## [2026-04-22 22:45] — Claude Code
**작업**: 위키 품종 상세 페이지 26개 전체 영어 번역 완성 + 가독성 대폭 개선
**상태**: 완료 ✅ (로컬 빌드 통과, 원격 푸시 완료 — 커밋 6ef5f31)
**변경 파일**:
- `src/lib/wikiDataEn.ts` (신규, 26품종 × 5섹션 = 130 텍스트 블록)
- `src/lib/wikiGuideDataEn.ts` (신규, 첫 키우기 가이드 영어판)
- `src/app/wiki/{cat,dog}/[breed]/page.tsx` (완전 재작성)
- `src/app/wiki/{cat,dog}/page.tsx` (EN 배너 개선 + 카드 영어 매핑)
**다음 단계**:
- Vercel 프리뷰 QA (언어 토글 KO↔EN 전체 위키 플로우)
- 문제 없으면 main 승격 PR
- /feed/upload, /auth/*, /guide, /terms 페이지 i18n
- 피드 유저 생성 콘텐츠는 번역 불가 (범위 외)
**주의사항**:
- 대욱님이 "위키가 가독성 떨어진다" 피드백 → 영어 모드 전용 스타일 강화:
  · 섹션 제목 17px, 본문 15px, line-height 1.85
  · letterSpacing -0.003em, wordBreak normal
  · 문단 간 여백 28px
- 원산지/성격태그는 lookup 매핑 (ORIGIN_EN 21개, PERSONALITY_EN 65개)
- 비용 포맷: 한국어 "20만원" ↔ 영어 "₩200K" 자동 변환
- 질병 설명 본문은 의료 정확성 위해 한국어 유지

---

## [2026-04-22 22:05] — Claude Code
**작업**: 한영 전환 전면 완성 (홈/피드/위키/마이/커뮤니티/건강체크) + /ai 페이지 복원 + Hydration 수정
**상태**: 완료 ✅ (로컬 빌드 통과, 원격 푸시 완료)
**변경 파일**:
- `next.config.ts` (devIndicators:false)
- `src/i18n/{ko,en}.ts` (feed/ai/wiki/mypage/community/breed/grades/how/trust 섹션 대량 확장)
- `src/components/I18nProvider.tsx` (Hydration 안전화)
- `src/components/{Header,Footer,BottomTabBar,PremiumHero,PremiumTrustGrid,HowItWorks,HeroSection,FeedCard}.tsx` (i18n 적용)
- `src/app/{page,feed/page,feed/[id]/page,feed/upload 제외,wiki/page,wiki/cat/page,wiki/dog/page,community/page,mypage/page,ai/page}.tsx`
- `src/app/api/ai-chat/route.ts` (locale 파라미터 → Gemini 영어 응답)
- `src/lib/wikiData.ts` (CAT_OVERVIEW_EN, DOG_OVERVIEW_EN 추가)
- 커밋 `ba52ea1` (20 files, +1002 insertions)
**다음 단계**:
- 품종별 상세 본문 (20품종 × 5섹션) EN 번역 — 데이터 양 많음
- 피드 업로드 폼(/feed/upload) i18n 마저
- 회원가입/로그인 페이지 i18n
- 이용가이드/약관/개인정보 정책 페이지 i18n
**주의사항**:
- 대욱님이 "한 번에 다 해달라" 강하게 피드백 → 이번엔 7개 영역 한 번에 처리했음
- 홈 맨 아래 AI 섹션 제거 (/ai 전용 페이지로 완전 분리)
- EN 모드에서 Gemini 실패 시 룰 기반 한국어 폴백 대신 영어 안내 메시지 표시
- 위키 품종 상세 본문은 EN 배너 + 한국어 유지 (데이터 번역 대량 작업이라 별도)
- Production(peteto.kr)은 main 브랜치라 아직 i18n 반영 안 됨. 승격 필요.

---

## [2026-04-23 02:xx] — Claude Code
**작업**: 한양대 창업동아리 지원금(HWP) 분석 + 펫에토 마케팅 도구 전체 설계 패키지 제작
**상태**: 완료 ✅
**변경 파일**:
- `.ai-context/funding_guide.md` (지원금 가이드)
- `.ai-context/marketing/brand_system.md` (브랜드 시스템 기준)
- `.ai-context/marketing/business_cards.md` (명함 5종 디자인)
- `.ai-context/marketing/leaflets.md` (리플릿 5종 × 3타겟 카피)
- `.ai-context/marketing/sales_kit.md` (영업킷 3레벨)
- `.ai-context/marketing/stickers.md` (스티커 5종 디자인)
- `.ai-context/marketing/design_brief_printer.md` (인쇄소 전달 브리프)
- `.ai-context/funding/pre_approval_form_draft.md` (사전승인신청서 초안)
- `.ai-context/funding/result_report_template.md` (결과보고서·검수확인서 템플릿)
**다음 단계**:
- 대욱님: 인쇄소 3곳 견적 요청 → 최저가 선정
- 대욱님: 1차 전담멘토(강창규/이광헌 교수) 예약 · https://bit.ly/41TAKRm
- 대욱님: 2차 담당매니저 멘토링 후 사전승인신청서 제출
- Claude Code: 실제 견적 반영해서 신청서 최종본 완성
- Claude Code: 로고 파일이 확인되면 디자인 브리프 보강
**주의사항**:
- 본 설계는 전부 텍스트/브리프. 실제 디자인은 인쇄소나 디자이너가 이 브리프를 받아 구현
- 전 문서가 `brand_system.md` 하나를 참조하므로 일관성 보장
- QR URL은 전부 `?src=` 트래킹 파라미터 포함 → 채널별 전환율 측정 가능
- 예산 시뮬레이션: 핵심만 약 110만원 / 풀세트 200만원+
- HWP 원본 추출은 Hancom COM 자동화로 성공 (pyhwp 없이도 가능)

---

## [2026-04-22 20:50] — Claude Code
**작업**: 커서가 방치한 스태시(main의 i18n 7파일) 복구 + 누락 의존 파일 복원 + 빌드 검증
**상태**: 완료 ✅ (로컬 빌드 통과, 푸시는 대욱님 컨펌 대기)
**변경 파일**:
- `.cursorrules`, `.ai-context/*` (공유맥락 시스템 커밋, `f63e388`)
- `CLAUDE.md` (main 전체 규칙 + Cursor 공유 규칙 통합 93줄)
- `vercel.json` (main에서 복원: daily-digest 크론 설정)
- `src/app/layout.tsx`, `src/components/{BottomTabBar,Footer,Header,PremiumHero}.tsx` (i18n 적용)
- `src/components/FeedPreviewStream.tsx` (신규, i18n 적용)
- `src/components/{I18nProvider,LanguageToggle}.tsx` (신규, i18n 코어)
- `src/i18n/{en,ko}.ts` (신규, 번역 사전)
- `src/lib/{analytics,contact,analysisSafety}.ts` (main에서 복원: 빌드 의존)
- `src/types/index.ts` (main 기준 확장판: 전문가 답변 메타 필드 포함)
- `3197951`, `86d9c95` 커밋 2개 추가
**다음 단계**:
- 원격 푸시 → Vercel 자동 재배포 확인
- Vercel Promote to Production 버튼으로 design 브랜치 승격 여부 판단
- 언어 토글 KO|EN 실제 동작 QA (PC/모바일)
- 나머지 페이지/섹션 i18n 키 전환 (`todo.md` 참고)
**주의사항**:
- 커서가 `git stash` 후 pop을 안 하고 끝내서 작업 7파일이 스태시에 방치됐었음 → 다음부터 커서에 복잡한 git 작업 맡기지 말 것
- main 브랜치에 있는 `analytics/contact/analysisSafety` 등 lib 파일이 design에 없었음 → 브랜치 간 동기화 상태가 좋지 않으니 병합 시 주의
- 스태시(`temp-i18n-and-deploy-fix`)는 전부 적용 후 drop 완료

---

## [2026-04-22 20:20] — Cursor
**작업**: `design/awwwards-redesign` 배포 실패(TypeScript JSX namespace) 긴급 복구
**상태**: 완료 ✅
**변경 파일**: `src/components/PremiumTrustGrid.tsx`, `.ai-context/handoff.md`
**다음 단계**:
- `design/awwwards-redesign` 브랜치에 커밋/푸시 후 Vercel 재배포 확인
- 배포 성공 확인되면 언어 토글/i18n 작업을 브랜치 전략에 맞춰 정리
**주의사항**:
- 실패 원인 커밋(`d2da63b`)의 `icon: JSX.Element` 타입이 빌드 환경에서 `JSX` 네임스페이스 에러를 유발
- 현재 브랜치에서 `icon: ReactNode`로 교체했고 `npm run build` 통과 확인

---

## [2026-04-22 20:10] — Claude Code
**작업**: Cursor ↔ Claude Code 공유 맥락 시스템 초기 구축
**상태**: 완료 ✅
**변경 파일**: `.cursorrules`, `.ai-context/handoff.md`, `.ai-context/decisions.md`, `.ai-context/todo.md`
**다음 단계**:
- 대욱님이 Cursor에서 실제로 작업해보면서 동작 검증
- 필요하면 Claude Code 쪽 Stop Hook으로 handoff 자동 기록 추가
- Tesla Mode에서 설계한 "라우터AI" 단계로 진화
**주의사항**:
- Cursor는 이 파일을 무조건 읽고 시작해야 함 (`.cursorrules`에 명시됨)
- Claude Code도 이 파일을 읽고 시작하도록 CLAUDE.md에 규칙 추가 예정
- 펫에토 본 프로젝트 작업은 아직 손대지 않음. 다음 작업자가 이어서 진행하면 됨.

---

<!-- 이 아래는 향후 작업이 누적됩니다. 오래된 항목은 월 단위로 아카이브 가능. -->
