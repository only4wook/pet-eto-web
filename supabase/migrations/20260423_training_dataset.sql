-- P.E.T 학습 데이터 수집 시스템
-- 2026-04-23
-- 목적: TTcare(250만장 학습) 이상을 목표로 유저 업로드 이미지 + AI 분석 + 수의사 피드백을
--       체계적으로 축적하여 향후 자체 Vision 모델 파인튜닝에 사용

CREATE TABLE IF NOT EXISTS public.training_dataset (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 원본 참조
  feed_post_id uuid REFERENCES public.feed_posts(id) ON DELETE SET NULL,
  source text NOT NULL DEFAULT 'feed_upload' CHECK (source IN ('feed_upload','partner_report','expert_upload','ai_reanalysis')),

  -- 이미지 메타
  image_url text NOT NULL,
  image_hash text,                               -- SHA256 (중복 방지)
  species text NOT NULL CHECK (species IN ('dog','cat','other')),
  breed text,

  -- AI 1차 분석 (Gemini)
  ai_severity text CHECK (ai_severity IN ('normal','mild','moderate','urgent')),
  ai_symptoms jsonb,                             -- ["구토","탈모"]
  ai_body_parts jsonb,                           -- ["eye","ear"]
  ai_confidence numeric,                         -- 0.0~1.0 (AI 자기 확신도)

  -- 전문가 검증 (수의사가 채택하거나 수정한 경우)
  expert_verified boolean DEFAULT false,
  expert_severity text CHECK (expert_severity IN ('normal','mild','moderate','urgent')),
  expert_symptoms jsonb,
  expert_notes text,
  expert_user_id uuid REFERENCES public.users(id),
  expert_verified_at timestamptz,

  -- 학습 태그 (자동 라벨링 파이프라인용)
  usable_for_training boolean DEFAULT false,     -- 전문가 검증 완료된 것만 true
  exclude_reason text,                           -- ex: 'low_quality','pii_visible','duplicate'

  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS training_dataset_species_idx ON public.training_dataset(species);
CREATE INDEX IF NOT EXISTS training_dataset_usable_idx ON public.training_dataset(usable_for_training);
CREATE UNIQUE INDEX IF NOT EXISTS training_dataset_image_hash_uniq ON public.training_dataset(image_hash) WHERE image_hash IS NOT NULL;

ALTER TABLE public.training_dataset ENABLE ROW LEVEL SECURITY;

-- 클라이언트 직접 접근 차단 (서비스 롤에서만 insert/select)
DROP POLICY IF EXISTS "training_dataset_no_direct_select" ON public.training_dataset;
CREATE POLICY "training_dataset_no_direct_select" ON public.training_dataset FOR SELECT USING (false);

DROP POLICY IF EXISTS "training_dataset_no_direct_write" ON public.training_dataset;
CREATE POLICY "training_dataset_no_direct_write" ON public.training_dataset FOR ALL USING (false) WITH CHECK (false);


-- ════════════════════════════════════════════════
-- 유틸 함수: feed_post가 올라올 때 training_dataset에 자동 추가
-- ════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION public.enqueue_training_dataset(
  p_feed_post_id uuid,
  p_image_url text,
  p_species text,
  p_breed text DEFAULT NULL,
  p_severity text DEFAULT NULL,
  p_symptoms jsonb DEFAULT NULL,
  p_body_parts jsonb DEFAULT NULL,
  p_confidence numeric DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_id uuid;
BEGIN
  INSERT INTO public.training_dataset(
    feed_post_id, source, image_url, species, breed,
    ai_severity, ai_symptoms, ai_body_parts, ai_confidence
  ) VALUES (
    p_feed_post_id, 'feed_upload', p_image_url, COALESCE(p_species, 'other'), p_breed,
    p_severity, p_symptoms, p_body_parts, p_confidence
  )
  ON CONFLICT DO NOTHING
  RETURNING id INTO v_id;

  RETURN jsonb_build_object('ok', true, 'dataset_id', v_id);
END;
$$;


-- ════════════════════════════════════════════════
-- 전문가가 피드 답변 채택 시 training_dataset에 verified 업데이트
-- ════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION public.verify_training_sample(
  p_feed_post_id uuid,
  p_expert_user_id uuid,
  p_severity text,
  p_symptoms jsonb DEFAULT NULL,
  p_notes text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_updated int;
BEGIN
  UPDATE public.training_dataset
  SET expert_verified = true,
      expert_severity = p_severity,
      expert_symptoms = p_symptoms,
      expert_notes = p_notes,
      expert_user_id = p_expert_user_id,
      expert_verified_at = now(),
      usable_for_training = true
  WHERE feed_post_id = p_feed_post_id;
  GET DIAGNOSTICS v_updated = ROW_COUNT;

  RETURN jsonb_build_object('ok', true, 'updated', v_updated);
END;
$$;


-- ════════════════════════════════════════════════
-- 대시보드: 현재 수집량 (운영 보고서용)
-- ════════════════════════════════════════════════
CREATE OR REPLACE VIEW public.training_dataset_stats AS
SELECT
  species,
  COUNT(*)                                          AS total,
  COUNT(*) FILTER (WHERE expert_verified)           AS verified,
  COUNT(*) FILTER (WHERE usable_for_training)       AS usable,
  COUNT(*) FILTER (WHERE ai_severity = 'normal')    AS normal_count,
  COUNT(*) FILTER (WHERE ai_severity = 'mild')      AS mild_count,
  COUNT(*) FILTER (WHERE ai_severity = 'moderate')  AS moderate_count,
  COUNT(*) FILTER (WHERE ai_severity = 'urgent')    AS urgent_count,
  DATE_TRUNC('day', MIN(created_at))                AS first_sample_at,
  DATE_TRUNC('day', MAX(created_at))                AS last_sample_at
FROM public.training_dataset
GROUP BY species;
