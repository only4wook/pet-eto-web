# 🍎 대욱님 맥북 이전 마스터 체크리스트

**도착 예정일**: 2026-04-22 (IR 발표 다음 날)
**예상 소요**: 약 2시간 (체크리스트 따라하면 누구나 가능)

---

## 🎯 이 문서 사용법

- 맥북에서 **이 파일을 OneDrive로 열어서** 한 줄씩 체크하며 따라하세요
- 각 단계에 **체크박스** 있으니 `[ ]` → `[x]`로 바꾸면서 진행
- 막히면 아래쪽 "자주 겪는 문제 해결" 참고
- 다 끝나면 텔레그램으로 🎉 축하 메시지 받으실 수 있게 마지막 스크립트까지 돌리세요

---

## 📋 Phase 0: 맥북 오기 전 (Windows에서 오늘 밤)

### 0-1. 로컬 변경사항 GitHub에 전부 올리기
```powershell
cd C:\pet-eto-web
git status
# 변경사항 있으면:
git add -A
git commit -m "맥북 이전 전 최종 백업"
git push
```
- [ ] 완료

### 0-2. `.env.local` 파일 안전하게 백업
```powershell
# 펫에토 프로젝트의 env 파일 확인
dir C:\pet-eto-web\.env*
```

**백업 방법 (우선순위 순):**
- [ ] 🥇 **1Password/Bitwarden** — 키 하나씩 복붙 (가장 안전)
- [ ] 🥈 **OneDrive 개인 금고(Personal Vault)** — 파일 통째로 (2FA 필수)
- [ ] 🥉 **비번 걸린 zip** → OneDrive

**⚠️ 절대 금지**: 이메일 첨부, 카톡 전송, 평문 메모, 스크린샷

### 0-3. Claude Code 설정·메모리 폴더 백업
```powershell
# 이 폴더 통째로 OneDrive의 Backup 폴더로 복사
# 원본: C:\Users\dnlsd\.claude\
# 대상: OneDrive\Backup\claude-settings-20260421\
```

포함될 내용:
- `MEMORY.md` (대욱님 프로필, 펫에토 메모리)
- `projects/` (과거 세션 전부 — IR 덱, 429 큐 수정 등)
- `settings.json` (스킬·훅 설정)

- [ ] OneDrive로 복사 완료
- [ ] OneDrive 앱에서 "업로드 완료" 확인

### 0-4. Cursor Settings Sync 활성화
1. Cursor 열기
2. `Ctrl+Shift+P` → **Settings Sync: Turn On**
3. GitHub 계정으로 로그인
4. Settings / Keybindings / Extensions 전부 체크 → Sign In

- [ ] Sync 활성화 확인
- [ ] "모두 동기화됨" 상태 메시지 확인

### 0-5. 필수 계정·비밀번호 한 곳에 정리
1Password 또는 Bitwarden에 저장:
- [ ] Apple ID (+ 2FA 백업 코드)
- [ ] GitHub (only4wook)
- [ ] Vercel
- [ ] Supabase (이메일 + OAuth)
- [ ] Google (Gmail, GA4, Google Cloud)
- [ ] Kakao Developers
- [ ] OpenAI, Google AI Studio
- [ ] Telegram Bot Token (8689419324:AAG...)

---

## 🍎 Phase 1: 맥 첫 부팅 (30분)

### 1-1. macOS 초기 설정
- [ ] 전원 on → 언어 선택: **한국어**
- [ ] Wi-Fi 연결
- [ ] Apple ID 로그인 (2FA 입력)
- [ ] Touch ID 등록
- [ ] iCloud 설정 (사진/연락처만 켜는 게 깔끔)

### 1-2. 한글 입력기 설정
1. 시스템 설정 → 키보드 → 입력 소스
2. **+** 버튼 → 한국어 → **2벌식** 추가 (3벌식이 기본이라 불편)
3. 한영 전환 단축키: `⌘+Space` 또는 `Caps Lock`
- [ ] 한글 타이핑 테스트

### 1-3. OneDrive 설치 & 동기화
1. App Store → **Microsoft OneDrive** 설치
2. 로그인 → 폴더 선택
3. 동기화 완료까지 대기 (백그라운드로 두면 됨)
- [ ] OneDrive 설치
- [ ] `~/Library/CloudStorage/OneDrive-Personal/` 폴더에 파일 보이는지 확인

---

## 🛠️ Phase 2: 개발 도구 설치 (20분)

맥의 **터미널(Terminal.app)** 열기 — Spotlight(`⌘+Space`) → "terminal" 검색

### 2-1. Homebrew (맥의 앱스토어·패키지 매니저)
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

설치 후 PATH 추가 (M1/M2/M3 맥만):
```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

확인:
```bash
brew --version
```
- [ ] `Homebrew 4.x.x` 같은 버전 표시 확인

### 2-2. 필수 도구 일괄 설치
```bash
brew install git node gh
```

확인:
```bash
git --version    # git version 2.x
node --version   # v20.x 이상
gh --version     # gh version 2.x
```
- [ ] 3개 모두 버전 표시 확인

### 2-3. GitHub 로그인
```bash
gh auth login
```
- GitHub.com 선택 → HTTPS → Yes → **Login with a web browser**
- 표시되는 one-time code 복사 → 브라우저에서 입력
- [ ] "✓ Logged in as only4wook" 확인

### 2-4. 생활 편의 앱 (선택이지만 강력 추천)
```bash
brew install --cask raycast rectangle iterm2 visual-studio-code
```
- **Raycast**: ⌘+Space 대체, 훨씬 강력 (설치 후 단축키 재설정)
- **Rectangle**: 창 분할 (윈도우의 Win+←→ 기능)
- **iTerm2**: Terminal보다 10배 좋은 터미널
- **VS Code**: 가벼운 에디터 (Cursor 메인이어도 백업용)

- [ ] 각 앱 실행해서 정상 작동 확인

---

## 📦 Phase 3: 펫에토 프로젝트 복원 (15분)

### 3-1. 작업 폴더 만들기 (⚠️ OneDrive 밖에!)
```bash
mkdir -p ~/Developer
cd ~/Developer
```
- [ ] `~/Developer` 폴더 확인

### 3-2. 프로젝트 clone
```bash
git clone https://github.com/only4wook/pet-eto-web.git
cd pet-eto-web
```
- [ ] clone 완료 (파일 수십 개 다운로드)

### 3-3. 환경변수 복원 (가장 중요)
1. **Finder** 열기 → OneDrive 금고에서 백업한 `.env.local` 꺼내기
2. 파일을 **프로젝트 폴더로 드래그 앤 드롭**: `~/Developer/pet-eto-web/`

또는 터미널에서:
```bash
# OneDrive 경로는 맥마다 다를 수 있으니 Finder로 찾는 게 안전
cp ~/Library/CloudStorage/OneDrive-Personal/Backup/env-backup/.env.local ~/Developer/pet-eto-web/
```

확인:
```bash
cd ~/Developer/pet-eto-web
ls -la .env*
cat .env.local | head -3  # (키 값 가려지도록 head로만)
```
- [ ] `.env.local` 존재 확인
- [ ] 내용에 GEMINI, SUPABASE 등 키 포함 확인

### 3-4. 의존성 설치 & 실행 테스트
```bash
npm install
```
(1~3분 걸림. sharp, canvas 같은 네이티브 모듈 빌드 중 에러 뜨면 아래 트러블슈팅 참고)

```bash
npm run dev
```
브라우저에서 http://localhost:3000 접속
- [ ] 펫에토 홈페이지 정상 표시
- [ ] 터미널은 `Ctrl+C`로 종료하지 말고 일단 두기

---

## 🤖 Phase 4: Claude Code + Cursor 복원 (15분)

### 4-1. Claude Code 설치
```bash
npm install -g @anthropic-ai/claude-code
```

확인:
```bash
claude --version
```
- [ ] 버전 표시 확인

### 4-2. Claude Code 로그인
```bash
claude login
```
브라우저 열리면 Anthropic 계정으로 로그인
- [ ] 로그인 완료

### 4-3. Claude 메모리/설정 복원 ⭐핵심⭐
```bash
# OneDrive에서 백업해둔 .claude 폴더를 홈으로 복사
cp -r ~/Library/CloudStorage/OneDrive-Personal/Backup/claude-settings-20260421 ~/.claude
```

또는 개별 복사:
```bash
# MEMORY.md만 우선 복원
mkdir -p ~/.claude/projects/pet-eto-web/memory
cp ~/Library/CloudStorage/OneDrive-Personal/Backup/claude-settings-20260421/projects/C--Users-dnlsd-OneDrive*/memory/MEMORY.md \
   ~/.claude/projects/pet-eto-web/memory/MEMORY.md
```

확인:
```bash
ls ~/.claude/
cat ~/.claude/projects/*/memory/MEMORY.md | head -5
```
- [ ] 대욱님 프로필, 펫에토 프로젝트 메모 보임

### 4-4. Cursor 설치 & Sync 복원
1. https://cursor.com 접속 → **Download for Mac** (Apple Silicon용 선택)
2. `.dmg` 다운로드 → 설치
3. 실행 → **Sign in with GitHub** (같은 only4wook 계정)
4. Settings Sync가 자동 복원 시작 — 확장/테마/단축키 모두

- [ ] Cursor 실행
- [ ] 설정 동기화 완료 표시
- [ ] `⌘+O` → `~/Developer/pet-eto-web` 폴더 열기

---

## ✅ Phase 5: 검증 테스트 (10분)

### 5-1. 로컬 서버
```bash
cd ~/Developer/pet-eto-web
npm run dev
```
http://localhost:3000 접속
- [ ] 홈페이지 정상
- [ ] 로그인 작동
- [ ] AI 건강체크 페이지 이동 가능

### 5-2. 큐 상태 확인 (env 변수 로드 확인)
```bash
node scripts/queue-status.mjs
```
- [ ] 한글 요약 정상 출력 (env 키 로드 확인)

### 5-3. Git 설정
```bash
git config --global user.name "권은환"
git config --global user.email "only4wook@gmail.com"
git config --global init.defaultBranch main
```
- [ ] 설정 반영 확인: `git config --list`

### 5-4. 맥북 이전 완료 🎉 텔레그램 축하 메시지 받기
```bash
node scripts/celebrate-migration.mjs
```
(이 스크립트는 아래 `Phase 6`에서 함께 만듭니다)

- [ ] 텔레그램으로 🎉 메시지 수신

---

## 🌟 Phase 6: 자동화 세팅 — "매일 아침 일정 + 펫에토 현황"

**목표**: 매일 오전 8시, 텔레그램으로 아래 내용 자동 수신
- 오늘·내일 구글 캘린더 일정
- 펫에토 가입자/피드/AI 분석 일일 요약
- 큐 대기 작업 알림

### 6-1. Google Calendar 비공개 ICS URL 발급
1. https://calendar.google.com 접속
2. 좌측 "내 캘린더" → 대상 캘린더 우측 **⋮** → **설정 및 공유**
3. 스크롤 → **캘린더 통합** 섹션 → **비공개 주소(iCal 형식)** 복사
   (URL이 `https://calendar.google.com/calendar/ical/.../basic.ics` 형태)

- [ ] ICS URL 안전하게 복사 (1Password에 저장)

### 6-2. Vercel 환경변수 추가
https://vercel.com/dashboard → pet-eto-web 프로젝트 → Settings → Environment Variables

추가할 키 3개:
```
GCAL_ICS_URL                = (방금 복사한 ICS URL)
DAILY_DIGEST_TELEGRAM_CHAT  = 1151452616
DAILY_DIGEST_TOKEN          = peteto-digest-secret-2026 (아무 랜덤 문자열)
```
- [ ] 3개 모두 Production 환경에 추가
- [ ] Vercel Redeploy 트리거 (또는 다음 푸시 때 자동)

### 6-3. cron 동작 확인
배포 완료 후 한 번 수동 테스트:
```bash
curl -H "Authorization: Bearer peteto-digest-secret-2026" \
  https://www.peteto.kr/api/cron/daily-digest
```
- [ ] 텔레그램으로 "🐾 오늘의 펫에토 브리핑" 도착

### 6-4. Vercel Cron 스케줄 확인
https://vercel.com/dashboard → pet-eto-web → Crons 탭
- [ ] `/api/cron/daily-digest`가 매일 `0 23 * * *` (UTC 23시 = KST 08시)로 등록됨

---

## 🚨 자주 겪는 문제 해결

### "npm install이 sharp 빌드 실패"
```bash
brew install vips
npm install --legacy-peer-deps
```

### "git clone 시 SSH 키 요구"
gh CLI로 HTTPS 인증이 자동 처리되므로 SSH 키 만들 필요 없음. 그래도 필요하면:
```bash
ssh-keygen -t ed25519 -C "only4wook@gmail.com"
cat ~/.ssh/id_ed25519.pub | pbcopy  # 클립보드 복사
# GitHub → Settings → SSH Keys → New → 붙여넣기
```

### "port 3000 already in use"
```bash
lsof -i :3000
kill -9 [PID]
```

### "한영 전환이 Caps Lock인데 실수로 Caps가 켜짐"
시스템 설정 → 키보드 → 입력 소스 → "Caps Lock으로 입력 소스 전환" 옵션 조정
또는 Karabiner-Elements (`brew install --cask karabiner-elements`)로 커스터마이즈

### "Cursor Settings Sync가 복원 안 됨"
Cursor 종료 후 재시작 → `Ctrl+Shift+P` → "Settings Sync: Show Log" 로 확인

### ".env.local 못 찾겠음"
```bash
find ~/Library/CloudStorage/OneDrive-Personal -name ".env*" 2>/dev/null
```

---

## 📌 이전 후 절대 하지 말 것

- ❌ Windows PC에서 `.env.local` 를 같이 써보기 (키 일관성 유지)
- ❌ `~/Developer/pet-eto-web`을 OneDrive 안에 두기 (동기화 지옥)
- ❌ SSH 키를 OneDrive 공개 폴더에 두기
- ❌ Windows 노트북 포맷 전에 **GitHub push 완료했는지 2번 확인**

---

## ✨ 맥 입문자 꿀팁 모음

### 단축키 치트시트
| 동작 | 단축키 |
|---|---|
| 복사/붙여넣기 | `⌘C` / `⌘V` |
| 앱 전환 | `⌘Tab` |
| 앱 내 창 전환 | `⌘~` (물결) |
| 스크린샷 (전체) | `⌘Shift+3` |
| 스크린샷 (영역) | `⌘Shift+4` |
| Spotlight (검색) | `⌘Space` |
| 강력 새로고침(브라우저) | `⌘Shift+R` |
| 탭 닫기 | `⌘W` |
| 앱 종료 | `⌘Q` |
| 숨기기 | `⌘H` |
| 미니맵 (Mission Control) | `F3` 또는 `Ctrl+↑` |

### 터미널 꿀 명령어
```bash
pwd                    # 현재 위치
ls -la                 # 파일 목록 (숨김 포함)
cd ~/Developer         # 이동
open .                 # 현재 폴더를 Finder로 열기
open -a "Cursor" .     # 현재 폴더를 Cursor로 열기
pbcopy < file.txt      # 파일 내용 클립보드 복사
code ~/Developer/pet-eto-web   # VS Code로 열기
```

### 맥만의 강점 활용
- **Spotlight 계산기**: `⌘Space` → 바로 수식 입력 (예: `1500 * 0.15`)
- **단어 사전**: 어디서든 단어 선택 + `⌃⌘D` → 사전 팝업
- **프리뷰 서명**: PDF 계약서 스캔·서명 Preview.app 하나로 완결
- **사이드카**: iPad를 보조 모니터로 (`시스템 설정 → 디스플레이`)

---

## 🎓 마무리

**축하합니다!** 🎉 이 체크리스트를 다 끝내셨다면 다음 3가지가 세팅된 상태입니다:

1. ✅ **펫에토 개발 환경** 맥북에 완전 복원
2. ✅ **Claude Code + Cursor** 기존 설정·메모리 그대로
3. ✅ **매일 아침 자동 브리핑** (구글 캘린더 + 펫에토 현황)

이제 매일 아침 8시에 텔레그램에서 🐾 브리핑을 받으시면서 펫에토를 빌드하시면 됩니다.

**문제 생기면 언제든 Claude에게**: `claude` 실행 후 이 문서 경로 보여주고 어느 단계에서 막혔는지 알려주면 즉시 해결해드립니다.

화이팅 🔥🐾
— 2026-04-21, Claude
