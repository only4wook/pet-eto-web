-- ============================================
-- 관리자 삭제 기능 V2 (target_id 충돌 수정)
-- Supabase 대시보드 → SQL Editor에서 실행하세요
-- ============================================

DROP FUNCTION IF EXISTS admin_delete_post(text, uuid);

CREATE OR REPLACE FUNCTION admin_delete_post(p_table text, p_id uuid)
RETURNS text AS $$
BEGIN
  IF p_table = 'posts' THEN
    DELETE FROM comments WHERE post_id = p_id;
    DELETE FROM likes WHERE likes.target_id = p_id::text;
    DELETE FROM posts WHERE id = p_id;
    RETURN 'deleted_post';
  ELSIF p_table = 'feed_posts' THEN
    DELETE FROM feed_comments WHERE feed_post_id = p_id;
    DELETE FROM feed_likes WHERE feed_post_id = p_id;
    DELETE FROM feed_posts WHERE id = p_id;
    RETURN 'deleted_feed';
  ELSE
    RETURN 'unknown_table';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION admin_delete_post(text, uuid) TO anon;
GRANT EXECUTE ON FUNCTION admin_delete_post(text, uuid) TO authenticated;
