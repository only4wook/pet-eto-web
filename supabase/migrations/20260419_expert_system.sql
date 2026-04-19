-- 펫에토 전문가 시스템 + 피드 전문가 요청 기능
-- 실행 위치: Supabase Dashboard → SQL Editor → New query → 아래 붙여넣고 RUN
-- 2026-04-19

-- ───────────────────────────────
-- 1) users 테이블에 role 컬럼 추가
-- ───────────────────────────────
-- role 가능 값: user / vet(수의사) / vet_student(수의학 전공) / vet_clinic(동물병원) / behaviorist(행동 전문가) / petshop(펫샵) / admin
DO $$ BEGIN
  ALTER TABLE public.users
    ADD COLUMN IF NOT EXISTS role text DEFAULT 'user'
    CHECK (role IN ('user', 'vet', 'vet_student', 'vet_clinic', 'behaviorist', 'petshop', 'admin'));
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

-- 전문가 소속/면허 정보(승인 후 users 레코드에 스냅샷)
DO $$ BEGIN
  ALTER TABLE public.users
    ADD COLUMN IF NOT EXISTS clinic_name text,
    ADD COLUMN IF NOT EXISTS license_no text,
    ADD COLUMN IF NOT EXISTS school_name text,
    ADD COLUMN IF NOT EXISTS specialty text;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

-- ───────────────────────────────
-- 2) feed_posts에 전문가 요청 컬럼 추가
-- ───────────────────────────────
DO $$ BEGIN
  ALTER TABLE public.feed_posts
    ADD COLUMN IF NOT EXISTS request_expert boolean DEFAULT false,
    ADD COLUMN IF NOT EXISTS expert_target text CHECK (expert_target IN ('vet', 'vet_clinic', 'behaviorist') OR expert_target IS NULL),
    ADD COLUMN IF NOT EXISTS expert_status text DEFAULT 'none' CHECK (expert_status IN ('none', 'pending', 'answered'));
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

-- ───────────────────────────────
-- 3) expert_applications 테이블 신규
-- 전문가 계정 신청서 (관리자 승인 전 대기열)
-- ───────────────────────────────
CREATE TABLE IF NOT EXISTS public.expert_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  requested_role text NOT NULL CHECK (requested_role IN ('vet', 'vet_student', 'vet_clinic', 'behaviorist', 'petshop')),
  real_name text NOT NULL,
  clinic_name text,                 -- 병원/기관명
  license_no text,                  -- 수의사 면허번호
  school_name text,                 -- 수의학 전공 학교
  specialty text,                   -- 전문 분야 (내과, 외과, 피부 등)
  experience_years int,
  license_doc_url text,             -- 면허증/재학증명서 이미지 URL
  intro text,                       -- 자기소개
  phone text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewer_id uuid REFERENCES public.users(id),
  reviewer_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz
);

CREATE INDEX IF NOT EXISTS expert_applications_status_idx ON public.expert_applications(status, created_at DESC);
CREATE INDEX IF NOT EXISTS expert_applications_user_idx ON public.expert_applications(user_id);

-- ───────────────────────────────
-- 4) expert_answers 테이블 신규
-- 전문가가 피드 글에 단 답변 (일반 댓글과 분리)
-- ───────────────────────────────
CREATE TABLE IF NOT EXISTS public.expert_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  feed_post_id uuid NOT NULL REFERENCES public.feed_posts(id) ON DELETE CASCADE,
  expert_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  -- 답변 시점의 전문가 정보 스냅샷 (추후 프로필이 바뀌어도 답변엔 당시 정보가 표시됨)
  expert_role text NOT NULL,
  expert_name text,
  expert_clinic text,
  expert_license text,
  severity_opinion text CHECK (severity_opinion IN ('normal','mild','moderate','urgent') OR severity_opinion IS NULL),
  follow_up_recommended boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS expert_answers_feed_idx ON public.expert_answers(feed_post_id, created_at ASC);
CREATE INDEX IF NOT EXISTS expert_answers_expert_idx ON public.expert_answers(expert_id);

-- ───────────────────────────────
-- 5) RLS (행 수준 보안) 정책
-- ───────────────────────────────
ALTER TABLE public.expert_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expert_answers ENABLE ROW LEVEL SECURITY;

-- 본인 신청서는 본인과 관리자만 조회
DROP POLICY IF EXISTS "own_apps_read" ON public.expert_applications;
CREATE POLICY "own_apps_read" ON public.expert_applications
  FOR SELECT USING (
    user_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- 본인만 신청 생성
DROP POLICY IF EXISTS "own_apps_insert" ON public.expert_applications;
CREATE POLICY "own_apps_insert" ON public.expert_applications
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- 관리자만 상태 업데이트
DROP POLICY IF EXISTS "admin_apps_update" ON public.expert_applications;
CREATE POLICY "admin_apps_update" ON public.expert_applications
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- 전문가 답변은 모두 조회 가능
DROP POLICY IF EXISTS "answers_read_all" ON public.expert_answers;
CREATE POLICY "answers_read_all" ON public.expert_answers FOR SELECT USING (true);

-- 전문가만 답변 가능 (role 이 user/admin 제외일 때)
DROP POLICY IF EXISTS "expert_only_insert" ON public.expert_answers;
CREATE POLICY "expert_only_insert" ON public.expert_answers
  FOR INSERT WITH CHECK (
    expert_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
      AND role IN ('vet','vet_student','vet_clinic','behaviorist','admin')
    )
  );

-- 본인 답변만 삭제/수정
DROP POLICY IF EXISTS "own_answer_update" ON public.expert_answers;
CREATE POLICY "own_answer_update" ON public.expert_answers
  FOR UPDATE USING (expert_id = auth.uid());

DROP POLICY IF EXISTS "own_answer_delete" ON public.expert_answers;
CREATE POLICY "own_answer_delete" ON public.expert_answers
  FOR DELETE USING (expert_id = auth.uid());

-- ───────────────────────────────
-- 6) Helper function — 전문가 답변 달리면 feed_posts.expert_status=answered로 자동 갱신
-- ───────────────────────────────
CREATE OR REPLACE FUNCTION public.tg_mark_feed_answered()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.feed_posts
    SET expert_status = 'answered'
    WHERE id = NEW.feed_post_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_mark_feed_answered ON public.expert_answers;
CREATE TRIGGER trg_mark_feed_answered
AFTER INSERT ON public.expert_answers
FOR EACH ROW EXECUTE FUNCTION public.tg_mark_feed_answered();

-- ───────────────────────────────
-- 7) Helper function — 신청서 승인 시 users.role / 부가 정보 자동 업데이트
-- ───────────────────────────────
CREATE OR REPLACE FUNCTION public.tg_apply_expert_approval()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'approved' AND (OLD.status IS DISTINCT FROM 'approved') THEN
    UPDATE public.users
      SET role = NEW.requested_role,
          clinic_name = COALESCE(NEW.clinic_name, public.users.clinic_name),
          license_no = COALESCE(NEW.license_no, public.users.license_no),
          school_name = COALESCE(NEW.school_name, public.users.school_name),
          specialty = COALESCE(NEW.specialty, public.users.specialty)
      WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_apply_expert_approval ON public.expert_applications;
CREATE TRIGGER trg_apply_expert_approval
AFTER UPDATE ON public.expert_applications
FOR EACH ROW EXECUTE FUNCTION public.tg_apply_expert_approval();

-- ───────────────────────────────
-- 8) Storage 버킷 가이드
-- ───────────────────────────────
-- 관리 콘솔에서 수동:
-- Storage → New bucket "expert-docs" (public OFF, read/write authenticated only)
-- 면허증·재학증명서 업로드에 사용
