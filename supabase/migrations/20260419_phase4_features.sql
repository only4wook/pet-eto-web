-- 펫에토 Phase 4 기능: 단골 동물병원 등록 + 서비스 신청 + 파트너 모집
-- 실행: Supabase SQL Editor → New query → 붙여넣고 RUN
-- 2026-04-19

-- ───────────────────────────────
-- 1) users에 단골 동물병원 컬럼 추가 (JSON으로 유연하게)
-- ───────────────────────────────
DO $$ BEGIN
  ALTER TABLE public.users
    ADD COLUMN IF NOT EXISTS favorite_vet jsonb;
  -- favorite_vet 예시: {"name":"고양시24시동물병원","phone":"031-123-4567","address":"고양시…","lat":37.5,"lng":126.9}
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

-- ───────────────────────────────
-- 2) service_applications — 이동/호텔링/돌봄 서비스 신청
-- ───────────────────────────────
CREATE TABLE IF NOT EXISTS public.service_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  service_type text NOT NULL CHECK (service_type IN ('transport', 'hotel', 'sitter')),
  pet_name text,
  pet_species text,
  pet_weight numeric,
  start_at timestamptz,
  end_at timestamptz,
  pickup_address text,
  dropoff_address text,
  notes text,
  contact_phone text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','matched','completed','cancelled')),
  assigned_partner_id uuid REFERENCES public.users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS service_apps_user_idx ON public.service_applications(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS service_apps_status_idx ON public.service_applications(status, service_type);

-- ───────────────────────────────
-- 3) service_partners — 파트너 업체 등록 (모집)
-- ───────────────────────────────
CREATE TABLE IF NOT EXISTS public.service_partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  service_type text NOT NULL CHECK (service_type IN ('transport', 'hotel', 'sitter')),
  company_name text NOT NULL,
  business_number text,           -- 사업자등록번호
  region text,                    -- 주요 활동 지역 (예: "고양시·파주시")
  price_range text,               -- 가격대 (예: "3~8만원")
  description text,
  image_urls text[],
  verified boolean NOT NULL DEFAULT false,
  license_info jsonb,             -- 면허·자격 정보
  rating_avg numeric DEFAULT 0,
  rating_count int DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS partners_type_verified_idx ON public.service_partners(service_type, verified);
CREATE INDEX IF NOT EXISTS partners_region_idx ON public.service_partners(region);

-- ───────────────────────────────
-- 4) RLS 정책
-- ───────────────────────────────
ALTER TABLE public.service_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_partners ENABLE ROW LEVEL SECURITY;

-- 서비스 신청: 본인만 조회/생성
DROP POLICY IF EXISTS "own_service_apps" ON public.service_applications;
CREATE POLICY "own_service_apps" ON public.service_applications
  FOR SELECT USING (
    user_id = auth.uid()
    OR assigned_partner_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );
DROP POLICY IF EXISTS "insert_service_apps" ON public.service_applications;
CREATE POLICY "insert_service_apps" ON public.service_applications
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- 파트너 업체: 검증된 것만 모두 조회, 본인 미승인 조회 가능
DROP POLICY IF EXISTS "partners_read_verified" ON public.service_partners;
CREATE POLICY "partners_read_verified" ON public.service_partners
  FOR SELECT USING (
    verified = true
    OR user_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );
DROP POLICY IF EXISTS "insert_own_partner" ON public.service_partners;
CREATE POLICY "insert_own_partner" ON public.service_partners
  FOR INSERT WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS "update_own_partner" ON public.service_partners;
CREATE POLICY "update_own_partner" ON public.service_partners
  FOR UPDATE USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));
