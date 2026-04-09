-- 유저 테이블에 role 컬럼 추가 (전문가 구분용)
-- Supabase SQL Editor에서 실행하세요
ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';
