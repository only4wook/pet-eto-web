# 🤝 Handoff — Claude Code ↔ Cursor 공유 작업일지

> 이 파일은 **Claude Code와 Cursor가 번갈아 작업할 때** 서로에게 남기는 인수인계서입니다.
> 작업을 시작하기 전에 **맨 위 2~3개 항목**을 반드시 읽고, 작업이 끝나면 맨 위에 새 항목을 추가하세요.

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

## [2026-04-22 20:20] — Claude Code
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
