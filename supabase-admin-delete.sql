-- ============================================
-- 관리자 삭제 기능을 위한 SQL
-- Supabase 대시보드 → SQL Editor에서 실행하세요
-- ============================================

-- 1. 관리자 삭제 RPC 함수 (RLS 우회)
CREATE OR REPLACE FUNCTION admin_delete_post(target_table text, target_id uuid)
RETURNS text AS $$
BEGIN
  IF target_table = 'posts' THEN
    DELETE FROM comments WHERE post_id = target_id;
    DELETE FROM likes WHERE target_id = target_id::text;
    DELETE FROM posts WHERE id = target_id;
    RETURN 'deleted_post';
  ELSIF target_table = 'feed_posts' THEN
    DELETE FROM feed_comments WHERE feed_post_id = target_id;
    DELETE FROM feed_likes WHERE feed_post_id = target_id;
    DELETE FROM feed_posts WHERE id = target_id;
    RETURN 'deleted_feed';
  ELSE
    RETURN 'unknown_table';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. 함수 실행 권한 부여
GRANT EXECUTE ON FUNCTION admin_delete_post(text, uuid) TO anon;
GRANT EXECUTE ON FUNCTION admin_delete_post(text, uuid) TO authenticated;
