-- =========================================
-- P.E.T 숏폼 피드 테이블 (Supabase SQL Editor에서 실행)
-- =========================================

CREATE TABLE IF NOT EXISTS feed_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  description TEXT DEFAULT '',
  pet_name TEXT DEFAULT '',
  pet_species TEXT DEFAULT '',
  analysis_result JSONB DEFAULT NULL,
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS feed_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feed_post_id UUID NOT NULL REFERENCES feed_posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS feed_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feed_post_id UUID NOT NULL REFERENCES feed_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(feed_post_id, user_id)
);

-- RLS 정책
ALTER TABLE feed_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "feed_posts_select" ON feed_posts FOR SELECT USING (true);
CREATE POLICY "feed_posts_insert" ON feed_posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "feed_posts_update" ON feed_posts FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "feed_posts_delete" ON feed_posts FOR DELETE USING (auth.uid() = author_id);

ALTER TABLE feed_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "feed_comments_select" ON feed_comments FOR SELECT USING (true);
CREATE POLICY "feed_comments_insert" ON feed_comments FOR INSERT WITH CHECK (auth.uid() = author_id);

ALTER TABLE feed_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "feed_likes_select" ON feed_likes FOR SELECT USING (true);
CREATE POLICY "feed_likes_insert" ON feed_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "feed_likes_delete" ON feed_likes FOR DELETE USING (auth.uid() = user_id);
