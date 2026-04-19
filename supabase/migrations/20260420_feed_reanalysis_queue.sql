-- Feed reanalysis queue for historical automatic re-judgement
-- 2026-04-20

CREATE TABLE IF NOT EXISTS public.feed_reanalysis_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  feed_post_id uuid NOT NULL REFERENCES public.feed_posts(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'done', 'failed')),
  priority int NOT NULL DEFAULT 100,
  reason text NOT NULL DEFAULT 'scheduled_reanalysis',
  retry_count int NOT NULL DEFAULT 0,
  last_error text,
  queued_at timestamptz NOT NULL DEFAULT now(),
  started_at timestamptz,
  finished_at timestamptz
);

CREATE UNIQUE INDEX IF NOT EXISTS feed_reanalysis_queue_unique_pending
  ON public.feed_reanalysis_queue(feed_post_id)
  WHERE status IN ('pending', 'processing');

CREATE INDEX IF NOT EXISTS feed_reanalysis_queue_status_priority_idx
  ON public.feed_reanalysis_queue(status, priority ASC, queued_at ASC);

ALTER TABLE public.feed_reanalysis_queue ENABLE ROW LEVEL SECURITY;

-- clients do not directly read/write queue
DROP POLICY IF EXISTS "reanalysis_queue_no_direct_select" ON public.feed_reanalysis_queue;
CREATE POLICY "reanalysis_queue_no_direct_select" ON public.feed_reanalysis_queue
  FOR SELECT USING (false);

DROP POLICY IF EXISTS "reanalysis_queue_no_direct_insert" ON public.feed_reanalysis_queue;
CREATE POLICY "reanalysis_queue_no_direct_insert" ON public.feed_reanalysis_queue
  FOR INSERT WITH CHECK (false);

DROP POLICY IF EXISTS "reanalysis_queue_no_direct_update" ON public.feed_reanalysis_queue;
CREATE POLICY "reanalysis_queue_no_direct_update" ON public.feed_reanalysis_queue
  FOR UPDATE USING (false);

CREATE OR REPLACE FUNCTION public.enqueue_feed_reanalysis(
  p_feed_post_id uuid,
  p_reason text DEFAULT 'manual_reanalysis',
  p_priority int DEFAULT 100
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_id uuid;
BEGIN
  IF p_feed_post_id IS NULL THEN
    RAISE EXCEPTION 'feed_post_id is required';
  END IF;

  INSERT INTO public.feed_reanalysis_queue(feed_post_id, reason, priority, status)
  VALUES (p_feed_post_id, COALESCE(p_reason, 'manual_reanalysis'), COALESCE(p_priority, 100), 'pending')
  ON CONFLICT DO NOTHING
  RETURNING id INTO v_id;

  RETURN jsonb_build_object('ok', true, 'queue_id', v_id);
END;
$$;

CREATE OR REPLACE FUNCTION public.enqueue_recent_feed_reanalysis(
  p_limit int DEFAULT 200,
  p_reason text DEFAULT 'batch_reanalysis',
  p_priority int DEFAULT 100
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_count int := 0;
  v_row record;
  v_inserted int := 0;
BEGIN
  FOR v_row IN
    SELECT fp.id
    FROM public.feed_posts fp
    ORDER BY fp.created_at DESC
    LIMIT GREATEST(COALESCE(p_limit, 200), 1)
  LOOP
    INSERT INTO public.feed_reanalysis_queue(feed_post_id, reason, priority, status)
    VALUES (v_row.id, COALESCE(p_reason, 'batch_reanalysis'), COALESCE(p_priority, 100), 'pending')
    ON CONFLICT DO NOTHING;
    GET DIAGNOSTICS v_inserted = ROW_COUNT;
    v_count := v_count + COALESCE(v_inserted, 0);
  END LOOP;

  RETURN jsonb_build_object('ok', true, 'enqueued', v_count);
END;
$$;
