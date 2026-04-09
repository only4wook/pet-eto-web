# P.E.T 펫에토 - 프로젝트 개발 로그

## 프로젝트 개요
- **프로젝트명:** P.E.T (Pet Ever Total)
- **설명:** 반려동물 생애주기 맞춤형 O2O 커뮤니티 슈퍼앱
- **대표:** 권대욱 (한양대학교 대학원)
- **팀:** 펫에토 창업동아리 (4인)
- **시작일:** 2026-04-05

---

## 기술 스택
| 영역 | 기술 | 비고 |
|------|------|------|
| 프론트엔드 | Next.js 16 + TypeScript | DC인사이드 스타일 |
| 스타일링 | Tailwind CSS + Inline Style | 반응형 (PC/모바일) |
| 상태관리 | Zustand | 경량 |
| 백엔드/DB | Supabase (PostgreSQL) | 무료 클라우드 |
| 인증 | Supabase Auth | 이메일/비밀번호 |
| 스토리지 | Supabase Storage | 이미지 업로드 |
| 배포 | Vercel (예정) | 무료 |

---

## 프로젝트 구조
```
pet-eto-web/
├── src/
│   ├── app/                    # 페이지 (Next.js App Router)
│   │   ├── page.tsx            # 홈 (게시판 목록)
│   │   ├── layout.tsx          # 루트 레이아웃 + AuthProvider
│   │   ├── auth/
│   │   │   ├── login/page.tsx  # 로그인
│   │   │   └── signup/page.tsx # 회원가입 (닉네임 중복확인)
│   │   ├── community/
│   │   │   ├── page.tsx        # 카테고리별 게시판
│   │   │   ├── write/page.tsx  # 글쓰기
│   │   │   └── [id]/page.tsx   # 게시글 상세 + 댓글
│   │   └── mypage/page.tsx     # 마이페이지 (등급, 전문가인증)
│   ├── components/
│   │   ├── Header.tsx          # 헤더 (네비게이션, 로그인 상태)
│   │   ├── Footer.tsx          # 푸터
│   │   ├── AuthProvider.tsx    # Supabase 세션 관리
│   │   └── GradeBadge.tsx      # 등급/전문가 배지
│   ├── lib/
│   │   ├── supabase.ts         # Supabase 클라이언트
│   │   ├── store.ts            # Zustand 스토어 (+ 데모 데이터)
│   │   ├── grades.ts           # 등급 시스템 (6단계 + 전문가 4종)
│   │   └── utils.ts            # 유틸 함수 (날짜 포맷 등)
│   └── types/index.ts          # TypeScript 타입 정의
├── supabase-schema.sql         # DB 스키마 (최초 실행용)
├── supabase-grade-update.sql   # role 컬럼 추가
├── start.bat                   # 서버 실행 파일
└── PROJECT_LOG.md              # 이 파일
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
| 댓글 작성 | +5P |
| 좋아요 받기 | +2P |
| 전문가 답변 채택 | +50P |
| 일일 출석 | +3P |

---

## Supabase 설정 정보
- **Project:** Pet Ever Total (P.E.T)
- **Region:** Northeast Asia (Tokyo)
- **Project ref:** akhtlrcmvftfacaroeiq
- **URL:** https://akhtlrcmvftfacaroeiq.supabase.co
- **이메일 인증:** OFF (테스트 중)

---

## 개발 일지

### 2026-04-05 (Day 1)
**완료:**
- [x] 프로젝트 기획 및 문서 분석 (neos.docx, 사업계획서 등)
- [x] React Native + Expo 프로젝트 시도 → 모바일 전용이라 폐기
- [x] Next.js 웹앱으로 전환 결정 (DC인사이드 스타일)
- [x] Next.js 프로젝트 생성 + Supabase 연동
- [x] DC인사이드 스타일 게시판 UI 완성
- [x] 회원가입/로그인 기능 (Supabase Auth)
- [x] 닉네임 중복확인
- [x] 게시글 작성 (DB 저장 + 포인트 자동 지급)
- [x] 유저 등급 시스템 6단계 구현
- [x] 전문가 인증 신청 폼 (수의사/의사/약사/업체)
- [x] 등급 배지 헤더/게시판/마이페이지 적용
- [x] 바탕화면 서버 실행 파일 (PET 서버 시작.bat)
- [x] 카테고리별 게시판 페이지

**이슈 & 해결:**
- Supabase 무료 티어 메일 발송 한도 초과 → Confirm email OFF로 전환
- React Native AsyncStorage 버전 충돌 → Next.js 전환으로 해결
- 한글 경로 bat 파일 실행 오류 → chcp 65001 + call 명령 적용

---

### 다음 작업 (Phase 2)
- [ ] 숏폼 피드 (인스타/유튜브숏츠 스타일 사진/영상 업로드)
- [ ] AI 증상 분석 (반려동물 사진 → 이상 징후 탐지)
- [ ] 긴급 알림 시스템 (이상 감지 시 보호자에게 알림)
- [ ] 위치 기반 동물병원 연계 (GPS → 가까운 병원 리스트)
- [ ] 실시간 수의사 연결 (증상 요약 → 전문의 알림 → 예약)
- [ ] Vercel 배포 (누구나 접속 가능)
- [ ] 커스텀 SMTP 설정 (이메일 인증 활성화)

---

## 서버 실행 방법
1. 바탕화면 **"PET 서버 시작.bat"** 더블클릭
2. 브라우저에서 **localhost:3000** 접속
3. 종료: cmd 창에서 **Ctrl + C**
