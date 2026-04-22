#!/bin/bash
# 펫에토 맥북 원클릭 셋업 스크립트
# 사용법:
#   1. 맥북 터미널 열기
#   2. bash <(curl -fsSL https://raw.githubusercontent.com/only4wook/pet-eto-web/main/scripts/setup-mac.sh)
# 또는 git clone 후:
#   bash scripts/setup-mac.sh

set -e

GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}═══════════════════════════════════════════${NC}"
echo -e "${BLUE}🐾 펫에토 맥북 원클릭 셋업${NC}"
echo -e "${BLUE}═══════════════════════════════════════════${NC}"
echo ""

step() {
  echo ""
  echo -e "${YELLOW}▶ $1${NC}"
}

ok() {
  echo -e "${GREEN}  ✅ $1${NC}"
}

skip() {
  echo -e "${BLUE}  ⏭  $1${NC}"
}

err() {
  echo -e "${RED}  ❌ $1${NC}"
}

# ═══════════════════════════════════════════
# 1. Homebrew
# ═══════════════════════════════════════════
step "1/6 Homebrew 확인"
if command -v brew &> /dev/null; then
  skip "이미 설치됨 ($(brew --version | head -1))"
else
  echo "  Homebrew 설치 시작..."
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

  # Apple Silicon PATH 추가
  if [[ -f /opt/homebrew/bin/brew ]]; then
    echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
    eval "$(/opt/homebrew/bin/brew shellenv)"
  fi
  ok "Homebrew 설치 완료"
fi

# ═══════════════════════════════════════════
# 2. 필수 도구
# ═══════════════════════════════════════════
step "2/6 필수 도구 설치 (git, node, gh)"
for pkg in git node gh; do
  if command -v $pkg &> /dev/null; then
    skip "$pkg 이미 설치됨"
  else
    brew install $pkg
    ok "$pkg 설치 완료"
  fi
done

# ═══════════════════════════════════════════
# 3. 생활 앱
# ═══════════════════════════════════════════
step "3/6 생활 편의 앱 설치 (Raycast, Rectangle, iTerm2)"
for cask in raycast rectangle iterm2; do
  if brew list --cask $cask &> /dev/null; then
    skip "$cask 이미 설치됨"
  else
    brew install --cask $cask || err "$cask 설치 실패 (스킵)"
  fi
done

# ═══════════════════════════════════════════
# 4. GitHub 로그인
# ═══════════════════════════════════════════
step "4/6 GitHub 인증 확인"
if gh auth status &> /dev/null; then
  ok "이미 로그인됨 ($(gh auth status 2>&1 | grep 'Logged in' | head -1))"
else
  echo "  GitHub 로그인 필요 — 브라우저가 열립니다"
  gh auth login --hostname github.com --git-protocol https --web
fi

# ═══════════════════════════════════════════
# 5. 펫에토 프로젝트 clone
# ═══════════════════════════════════════════
step "5/6 펫에토 프로젝트 복원"
DEV_DIR="$HOME/Developer"
PROJECT_DIR="$DEV_DIR/pet-eto-web"

mkdir -p "$DEV_DIR"
if [[ -d "$PROJECT_DIR/.git" ]]; then
  skip "프로젝트 이미 존재 — git pull로 업데이트"
  cd "$PROJECT_DIR" && git pull
else
  cd "$DEV_DIR"
  git clone https://github.com/only4wook/pet-eto-web.git
  cd "$PROJECT_DIR"
  ok "Clone 완료 → $PROJECT_DIR"
fi

# ═══════════════════════════════════════════
# 6. 의존성 설치
# ═══════════════════════════════════════════
step "6/6 npm 의존성 설치"
cd "$PROJECT_DIR"
if [[ -d node_modules ]]; then
  skip "node_modules 이미 존재"
else
  npm install
  ok "의존성 설치 완료"
fi

# ═══════════════════════════════════════════
# .env.local 확인
# ═══════════════════════════════════════════
echo ""
if [[ ! -f .env.local ]]; then
  echo -e "${RED}⚠️  .env.local 파일이 없습니다!${NC}"
  echo ""
  echo "다음 단계를 진행하세요:"
  echo "  1. OneDrive 또는 1Password에서 .env.local 백업 꺼내기"
  echo "  2. 이 경로에 복사: $PROJECT_DIR/.env.local"
  echo "  3. 복사 후 이 명령어로 검증:"
  echo "     cat $PROJECT_DIR/.env.local | grep -c '='"
else
  ok ".env.local 존재 확인"
fi

# ═══════════════════════════════════════════
# Git 기본 설정
# ═══════════════════════════════════════════
echo ""
step "🎨 Git 기본 설정"
if [[ -z "$(git config --global user.name)" ]]; then
  git config --global user.name "권은환"
  git config --global user.email "only4wook@gmail.com"
  git config --global init.defaultBranch main
  ok "Git 사용자 정보 설정"
else
  skip "Git 사용자: $(git config --global user.name)"
fi

# ═══════════════════════════════════════════
# Claude Code
# ═══════════════════════════════════════════
step "🤖 Claude Code 설치 여부 확인"
if command -v claude &> /dev/null; then
  skip "Claude Code 이미 설치됨"
else
  npm install -g @anthropic-ai/claude-code
  ok "Claude Code 설치 완료"
  echo ""
  echo -e "  ${YELLOW}→ 다음 명령어로 로그인하세요: claude login${NC}"
fi

# ═══════════════════════════════════════════
# 완료
# ═══════════════════════════════════════════
echo ""
echo -e "${BLUE}═══════════════════════════════════════════${NC}"
echo -e "${GREEN}🎉 맥북 셋업 완료!${NC}"
echo -e "${BLUE}═══════════════════════════════════════════${NC}"
echo ""
echo "다음 단계:"
echo ""
echo -e "  ${YELLOW}1.${NC} .env.local 복원 (위 안내 참고)"
echo -e "  ${YELLOW}2.${NC} ~/.claude 메모리 폴더 OneDrive에서 복원:"
echo "     cp -r ~/Library/CloudStorage/OneDrive-Personal/Backup/claude-settings-*/* ~/.claude/"
echo -e "  ${YELLOW}3.${NC} Cursor 설치: https://cursor.com/download"
echo -e "  ${YELLOW}4.${NC} 로컬 서버 테스트:"
echo "     cd $PROJECT_DIR && npm run dev"
echo -e "  ${YELLOW}5.${NC} 축하 메시지 전송:"
echo "     cd $PROJECT_DIR && node scripts/celebrate-migration.mjs"
echo ""
echo -e "${BLUE}문서: $PROJECT_DIR/docs/macbook-migration-checklist.md${NC}"
echo ""
