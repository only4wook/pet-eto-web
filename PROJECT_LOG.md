# P.E.T 펫에토 - 프로젝트 개발 로그

## 프로젝트 개요
- **프로젝트명:** P.E.T (Pet Ever Total)
- **설명:** 반려동물 생애주기 맞춤형 O2O 커뮤니티 슈퍼앱
- **대표:** 권대욱 (한양대학교 대학원)
- **팀:** 펫에토 창업동아리 (4인)
- **시작일:** 2026-04-05
- **라이브 URL:** https://pet-eto.vercel.app
- **GitHub:** https://github.com/only4wook/pet-eto-web

---

## 기술 스택
| 영역 | 기술 | 비고 |
|------|------|------|
| 프론트엔드 | Next.js 16 + TypeScript | DC인사이드 스타일 |
| 스타일링 | Tailwind CSS v4 + Inline Style | 반응형 (PC/모바일) |
| 상태관리 | Zustand | 경량 |
| 백엔드/DB | Supabase (PostgreSQL) | 무료 클라우드, Tokyo 리전 |
| 인증 | Supabase Auth | 이메일/비밀번호 |
| 스토리지 | Supabase Storage | 이미지 업로드 (feed-images, pet-photos) |
| 배포 | Vercel (Hobby Plan) | 무료, 자동 배포 |
| 분석 | Vercel Analytics | 방문자/페이지뷰 추적 |

---

## 프로젝트 구조
```
pet-eto-web/
├── src/
│   ├── app/
│   │   ├── page.tsx              # 홈 (게시판 목록 + CTA 배너)
│   │   ├── layout.tsx            # 루트 레이아웃 + AuthProvider + Analytics
│   │   ├── auth/
│   │   │   ├── login/page.tsx    # 로그인
│   │   │   └── signup/page.tsx   # 회원가입 (닉네임 중복확인 + 이메일 인증)
│   │   ├── community/
│   │   │   ├── page.tsx          # 카테고리별 게시판
│   │   │   ├── write/page.tsx    # 글쓰기 (Supabase 저장 + 포인트)
│   │   │   └── [id]/page.tsx     # 게시글 상세 + 댓글
│   │   ├── feed/
│   │   │   ├── page.tsx          # 숏폼 피드 (인스타 스타일)
│   │   │   ├── upload/page.tsx   # 사진 업로드 + AI 증상 분석
│   │   │   └── [id]/page.tsx     # 피드 상세 (댓글, 분석 결과, 병원 연계)
│   │   ├── wiki/
│   │   │   ├── page.tsx          # 위키 메인 (고양이/강아지 선택)
│   │   │   ├── cat/page.tsx      # 고양이 종합 (12종)
│   │   │   ├── cat/[breed]/      # 묘종별 상세 페이지
│   │   │   ├── dog/page.tsx      # 강아지 종합 (16종)
│   │   │   └── dog/[breed]/      # 견종별 상세 페이지
│   │   ├── mypage/page.tsx       # 마이페이지 (등급, 전문가인증 신청)
│   │   ├── pet/register/page.tsx # 반려동물 등록
│   │   └── admin/page.tsx        # 관리자 대시보드
│   ├── components/
│   │   ├── Header.tsx            # 헤더 (PC/모바일 반응형)
│   │   ├── Footer.tsx            # 푸터
│   │   ├── AuthProvider.tsx      # Supabase 세션 + 일일출석 체크
│   │   ├── GradeBadge.tsx        # 등급/전문가 배지
│   │   ├── FeedCard.tsx          # 피드 카드 UI
│   │   ├── SymptomAlert.tsx      # 긴급 증상 경고 모달
│   │   └── VetClinicList.tsx     # 주변 동물병원 리스트
│   ├── lib/
│   │   ├── supabase.ts           # Supabase 클라이언트
│   │   ├── store.ts              # Zustand 스토어 (40개 데모 데이터)
│   │   ├── grades.ts             # 등급 시스템 (6단계 + 전문가 4종)
│   │   ├── utils.ts              # 유틸 함수
│   │   ├── symptomAnalyzer.ts    # AI 증상 분석 엔진 (50+ 키워드)
│   │   ├── vetSearch.ts          # 위치 기반 동물병원 검색
│   │   ├── wikiData.ts           # 위키 품종 데이터 (고양이 12종 + 강아지 16종)
│   │   ├── useBreedImages.ts     # DB 기반 위키 이미지 관리 훅
│   │   └── demoFeed.ts           # 피드 데모 데이터 (10개)
│   └── types/index.ts            # TypeScript 타입 정의
├── supabase-schema.sql           # DB 스키마 (최초 실행)
├── supabase-feed-tables.sql      # 피드 테이블 스키마
├── supabase-grade-update.sql     # role 컬럼 추가
├── start.bat                     # 서버 실행 파일
├── PET 서버 시작.bat              # 바탕화면 바로가기
└── PROJECT_LOG.md                # 이 파일
```

---

## DB 스키마
| 테이블 | 설명 | 주요 컬럼 |
|--------|------|-----------|
| users | 사용자 | id, email, nickname, points, role, avatar_url |
| pets | 반려동물 | owner_id, name, species, breed, gender, weight |
| posts | 게시글 | author_id, category, title, content, tags[], view/like/comment_count |
| comments | 댓글 | post_id, author_id, content, is_expert |
| likes | 좋아요 | user_id, target_type, target_id |
| point_logs | 포인트 이력 | user_id, amount, reason |
| feed_posts | 숏폼 피드 | author_id, image_url, description, pet_name, analysis_result(JSONB) |
| feed_comments | 피드 댓글 | feed_post_id, author_id, content |
| feed_likes | 피드 좋아요 | feed_post_id, user_id |
| breed_images | 위키 이미지 | id(breed_id), image_url, updated_at |

---

## 등급 시스템
### 일반 유저 (포인트 자동 승급)
| 등급 | 필요 포인트 | 아이콘 |
|------|------------|--------|
| 🌱 새싹 반려인 | 0P | 회색 |
| 🐾 초보 반려인 | 100P | 초록 |
| 💙 중급 반려인 | 500P | 파랑 |
| ⭐ 고급 반려인 | 1,500P | 보라 |
| 🏅 준전문가 | 5,000P | 노랑 |
| 👑 마스터 | 15,000P | 빨강 |

### 전문가 (관리자 인증)
| 배지 | 유형 |
|------|------|
| 🩺 수의사 | 수의사 면허 인증 |
| ⚕️ 의사 | 의사 면허 인증 |
| 💊 약사 | 약사 면허 인증 |
| 🏢 업체 | 동물병원/펫샵 사업자 인증 |

### 포인트 규칙
| 행동 | 포인트 |
|------|--------|
| 회원가입 | +100P |
| 게시글 작성 | +10P |
| 피드 작성 | +10P |
| 댓글 작성 | +5P |
| 좋아요 받기 | +2P |
| 전문가 답변 채택 | +50P |
| 일일 출석 | +3P |

---

## 펫-위키 품종 현황
### 고양이 (12종)
코리안 숏헤어, 브리티시 숏헤어, 러시안 블루, 페르시안, 스코티시 폴드, 뱅갈, 샴, 먼치킨, 랙돌, 노르웨이 숲, 셀커크 렉스, 스핑크스

### 강아지 (16종)
말티즈, 푸들, 골든 리트리버, 포메라니안, 시츄, 웰시 코기, 비숑 프리제, 치와와, 요크셔 테리어, 닥스훈트, 프렌치 불독, 시바견, 보더 콜리, 래브라도 리트리버, 시베리안 허스키, 진돗개

---

## AI 증상 분석 시스템
- **방식:** 클라이언트 키워드 매칭 (API 비용 0원)
- **키워드 수:** 50개+ 한국어 증상 키워드
- **심각도:** 4단계 (정상 → 관찰 → 주의 → 긴급)
- **긴급 키워드:** 경련, 발작, 출혈, 중독, 호흡곤란, 마비 등
- **주의 키워드:** 구토, 설사, 식욕부진, 절뚝거림, 눈충혈 등
- **관찰 키워드:** 기침, 재채기, 눈물, 가려움, 무기력 등
- **동물병원 연계:** 고양시/일산 지역 8개 병원 (GPS 거리 계산)

---

## 관리자 대시보드 (/admin)
- **비밀번호:** peteto2026
- **유저 관리:** 포인트 지급/차감, 활동정지/해제, 역할 변경 (클릭형 UI)
- **위키 이미지:** 품종별 이미지 업로드 → DB 저장 → 위키 자동 반영
- **이미지 압축:** 업로드 시 자동 압축 (800px, JPEG 70%)

---

## Supabase 설정 정보
- **Project:** Pet Ever Total (P.E.T)
- **Region:** Northeast Asia (Tokyo)
- **Project ref:** akhtlrcmvftfacaroeiq
- **URL:** https://akhtlrcmvftfacaroeiq.supabase.co
- **이메일 인증:** OFF (테스트 중)
- **Storage 버킷:** feed-images (Public), pet-photos (Public)

---

## 외부 연동
| 서비스 | 용도 | URL |
|--------|------|-----|
| Vercel | 배포 | https://pet-eto.vercel.app |
| GitHub | 코드 저장소 | https://github.com/only4wook/pet-eto-web |
| Vercel Analytics | 방문자 추적 | Vercel 대시보드 → Analytics |
| 구글폼 (출시 알림) | 사전예약 수집 | https://forms.gle/e5cY46BRkambEjE19 |
| 구글폼 (견종 요청) | 품종 추가 요청 | https://forms.gle/ekF9CxYZkoEbAvgC9 |

---

## 개발 일지

### 2026-04-05 (Day 1)
**완료:**
- [x] 프로젝트 기획 및 문서 분석 (neos.docx, 사업계획서 등)
- [x] React Native + Expo 시도 → 모바일 전용이라 폐기
- [x] Next.js 웹앱으로 전환 (DC인사이드 스타일)
- [x] Supabase 연동 (Auth + DB + Storage)
- [x] 회원가입/로그인 + 닉네임 중복확인
- [x] 게시글 작성 (DB 저장 + 포인트)
- [x] 유저 등급 6단계 + 전문가 인증 4종
- [x] 바탕화면 서버 실행 파일

**이슈 & 해결:**
- Supabase 메일 발송 한도 초과 → Confirm email OFF
- React Native AsyncStorage 충돌 → Next.js 전환
- 한글 경로 bat 오류 → junction 링크 (C:\pet-eto-web)

### 2026-04-09 (Day 2)
**완료:**
- [x] 일일 출석 포인트 (+3P)
- [x] Vercel 무료 배포 (pet-eto.vercel.app)
- [x] Vercel Deployment Protection OFF (외부 접속 허용)
- [x] 숏폼 피드 (인스타 스타일 카드형, 10개 데모)
- [x] AI 증상 분석 엔진 (50+ 한국어 키워드, 4단계)
- [x] 긴급 알림 모달 (증상 요약 + 권장사항)
- [x] 주변 동물병원 검색 (GPS + 고양시/일산 8개 병원)
- [x] 데모 데이터 확충 (게시판 40개 + 피드 10개)
- [x] 모바일 반응형 UI (헤더, 테이블, 네비 스크롤)
- [x] CTA "출시 알림 받기" 배너 + 구글폼 연동
- [x] Vercel Analytics 추가
- [x] 펫-위키 구축 (고양이 12종 + 강아지 16종)
- [x] 종별 상세 페이지 (개요/특징/건강/관리법/역사)
- [x] 견종/묘종 추가 요청 버튼 + 구글폼
- [x] 관리자 대시보드 (/admin)
- [x] 유저 관리 (포인트 지급/차감, 활동정지, 역할변경)
- [x] 위키 이미지 관리 (업로드 → DB → 자동 반영)
- [x] 이미지 자동 압축 (800px, JPEG 70%)
- [x] 반려동물 등록 페이지
- [x] 카테고리 중복 탭 제거 (네비바 통일)
- [x] 로그인/로그아웃 버그 수정
- [x] 게시판 카테고리 404 수정
- [x] GitHub → Vercel 자동 배포 연결

**이슈 & 해결:**
- Vercel Authentication 켜져있어 외부 접속 불가 → Disabled
- Wikipedia 이미지 핫링크 차단 → Pixabay CDN으로 교체
- 관리자 이미지 업로드 Lock 에러 → 로그인 상태 필수
- 모바일 CSS 미적용 → globals.css @layer + pc-only/mobile-only 클래스
- 피드 데모 미표시 → 초기값 DEMO_FEED로 설정

---

## 다음 작업 (Phase 3)
- [ ] 견종/묘종 나머지 상세 정보 업데이트 (네이버 지식백과 수준)
- [ ] 논문 카테고리 + 행사 카테고리
- [ ] 검색 기능 실제 동작
- [ ] 게시글 상세 데모 데이터 지원
- [ ] 커스텀 SMTP (이메일 인증 활성화)
- [ ] 컨시어지 MVP (카톡 오픈채팅 연동)
- [ ] 커스텀 도메인 (www.peteto.kr)

---

## 서버 운영
| 항목 | 상태 |
|------|------|
| Vercel (pet-eto.vercel.app) | 24시간 자동 운영 |
| GitHub (코드 저장소) | 24시간 자동 |
| Supabase (DB/Auth/Storage) | 24시간 자동 |
| bat 파일 (localhost) | 개발 시에만 수동 실행 |

### 서버 실행
1. 바탕화면 **"PET 서버 시작.bat"** 더블클릭
2. 브라우저에서 **localhost:3000** 접속
3. 종료: cmd 창에서 **Ctrl + C**

### 코드 수정 → 배포
1. 코드 수정
2. `git add -A && git commit -m "메시지" && git push origin main`
3. Vercel이 1~2분 내 자동 배포
