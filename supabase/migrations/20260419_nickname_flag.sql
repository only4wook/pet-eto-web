-- 닉네임을 사용자가 직접 설정했는지 여부 플래그
-- true: 유저가 명시적으로 입력/변경 → 절대 자동 덮어쓰지 않음
-- false/null: 시스템이 자동 생성 가능 (예: 이메일 로컬파트가 노출되는 경우 익명화)

-- ───────────────────────────────
-- 1) 컬럼 추가
-- ───────────────────────────────
DO $$ BEGIN
  ALTER TABLE public.users
    ADD COLUMN IF NOT EXISTS nickname_set_by_user boolean DEFAULT false;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

-- ───────────────────────────────
-- 2) 기존 유저 보정
-- "닉네임이 이메일 로컬파트(@ 앞부분)와 다르게 설정된 유저" = 직접 설정한 것으로 간주 → true
-- "닉네임이 이메일 로컬파트와 같거나 비어있음" = 자동 생성 가능 상태 유지 → false
-- ───────────────────────────────
UPDATE public.users
  SET nickname_set_by_user = true
  WHERE nickname IS NOT NULL
    AND nickname <> ''
    AND LOWER(nickname) <> LOWER(SPLIT_PART(COALESCE(email, ''), '@', 1));

-- 확인용:
-- SELECT email, nickname, nickname_set_by_user FROM public.users ORDER BY created_at DESC;
