-- =====================================================================
-- P.E.T AI 자가강화 학습 루프 — DB 스키마
-- 사용법: Supabase Dashboard → SQL Editor → New query → 전체 복붙 → Run
-- =====================================================================

-- 1) 학습 실행 메타데이터 (한 번의 사이클을 1행으로 기록)
CREATE TABLE IF NOT EXISTS ai_learning_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  finished_at TIMESTAMPTZ,
  cases_generated INT DEFAULT 0,
  cases_graded INT DEFAULT 0,
  avg_score NUMERIC(3,1),
  exemplars_added INT DEFAULT 0,
  status TEXT DEFAULT 'running' CHECK (status IN ('running','done','failed')),
  notes TEXT,
  triggered_by TEXT DEFAULT 'manual' -- 'manual' | 'cron'
);

CREATE INDEX IF NOT EXISTS idx_runs_started_desc
  ON ai_learning_runs (started_at DESC);

-- 2) 개별 케이스 (질문·답변·점수·약점)
CREATE TABLE IF NOT EXISTS ai_learning_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID REFERENCES ai_learning_runs(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('emergency','chronic','behavioral','nutrition','cost','misc')),
  question TEXT NOT NULL,
  ai_response TEXT,
  score INT CHECK (score >= 0 AND score <= 10),
  scoring_breakdown JSONB,           -- {empathy: 1, severity: 2, causes: 1, ...}
  weakness_notes TEXT,                -- grader 가 지적한 부족함 한 줄
  promoted_to_exemplar BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cases_run ON ai_learning_cases (run_id);
CREATE INDEX IF NOT EXISTS idx_cases_score ON ai_learning_cases (score DESC);
CREATE INDEX IF NOT EXISTS idx_cases_category ON ai_learning_cases (category, score DESC);

-- 3) 골든 모범답안 (프롬프트에 동적 주입)
CREATE TABLE IF NOT EXISTS ai_exemplars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID REFERENCES ai_learning_cases(id) ON DELETE SET NULL,
  category TEXT NOT NULL,
  question TEXT NOT NULL,
  exemplar_response TEXT NOT NULL,
  score INT,
  active BOOLEAN DEFAULT TRUE,
  promoted_at TIMESTAMPTZ DEFAULT NOW(),
  retired_at TIMESTAMPTZ
);

-- 자주 조회: active=true, 최신순 → exemplar 주입 시 사용
CREATE INDEX IF NOT EXISTS idx_exemplars_active_recent
  ON ai_exemplars (active, promoted_at DESC);
CREATE INDEX IF NOT EXISTS idx_exemplars_category_active
  ON ai_exemplars (category, active, promoted_at DESC);

-- =====================================================================
-- RLS: 모두 service_role 만 접근 (익명 유저가 학습 데이터 못 보게)
-- =====================================================================
ALTER TABLE ai_learning_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_learning_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_exemplars ENABLE ROW LEVEL SECURITY;

-- service_role 은 RLS 우회 — 별도 정책 불필요
-- 기본적으로 모든 SELECT/INSERT/UPDATE 차단됨 → /api/admin/learning/* 만 작동

-- =====================================================================
-- 검증: 테이블이 생성됐는지 확인
-- =====================================================================
SELECT
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name AND table_schema = 'public') AS columns_count
FROM information_schema.tables t
WHERE table_schema = 'public'
  AND table_name IN ('ai_learning_runs', 'ai_learning_cases', 'ai_exemplars')
ORDER BY table_name;

-- 기대 결과:
--   ai_exemplars       | 9
--   ai_learning_cases  | 10
--   ai_learning_runs   | 9
