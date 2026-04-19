-- Expert answer authority, acceptance reward, notifications, and point cashout
-- 2026-04-20

-- 1) feed_posts: accepted answer / auto-settle markers
DO $$ BEGIN
  ALTER TABLE public.feed_posts
    ADD COLUMN IF NOT EXISTS accepted_expert_answer_id uuid REFERENCES public.expert_answers(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS answer_accepted_at timestamptz,
    ADD COLUMN IF NOT EXISTS expert_auto_settled_at timestamptz;
EXCEPTION WHEN undefined_table THEN NULL; END $$;

-- 2) expert_answers: reward settlement fields
DO $$ BEGIN
  ALTER TABLE public.expert_answers
    ADD COLUMN IF NOT EXISTS reward_status text NOT NULL DEFAULT 'none'
      CHECK (reward_status IN ('none', 'accepted', 'auto_paid')),
    ADD COLUMN IF NOT EXISTS reward_points int NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS rewarded_at timestamptz;
EXCEPTION WHEN undefined_table THEN NULL; END $$;

-- 3) notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  body text,
  link text,
  meta jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS notifications_user_idx
  ON public.notifications(user_id, is_read, created_at DESC);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "notifications_read_own" ON public.notifications;
CREATE POLICY "notifications_read_own" ON public.notifications
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "notifications_update_own" ON public.notifications;
CREATE POLICY "notifications_update_own" ON public.notifications
  FOR UPDATE USING (user_id = auth.uid());

-- direct insert is blocked for clients; server/trigger uses SECURITY DEFINER function
DROP POLICY IF EXISTS "notifications_insert_none" ON public.notifications;
CREATE POLICY "notifications_insert_none" ON public.notifications
  FOR INSERT WITH CHECK (false);

-- 4) point withdraw requests
CREATE TABLE IF NOT EXISTS public.point_withdraw_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  points int NOT NULL CHECK (points >= 5000),
  bank_name text NOT NULL,
  account_no text NOT NULL,
  account_holder text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'paid')),
  admin_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz
);

CREATE INDEX IF NOT EXISTS point_withdraw_requests_user_idx
  ON public.point_withdraw_requests(user_id, created_at DESC);

ALTER TABLE public.point_withdraw_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "withdraw_read_own_or_admin" ON public.point_withdraw_requests;
CREATE POLICY "withdraw_read_own_or_admin" ON public.point_withdraw_requests
  FOR SELECT USING (
    user_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
  );

DROP POLICY IF EXISTS "withdraw_insert_own" ON public.point_withdraw_requests;
CREATE POLICY "withdraw_insert_own" ON public.point_withdraw_requests
  FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "withdraw_admin_update" ON public.point_withdraw_requests;
CREATE POLICY "withdraw_admin_update" ON public.point_withdraw_requests
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
  );

-- 5) helper: create notification
CREATE OR REPLACE FUNCTION public.create_notification(
  p_user_id uuid,
  p_type text,
  p_title text,
  p_body text DEFAULT NULL,
  p_link text DEFAULT NULL,
  p_meta jsonb DEFAULT '{}'::jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF p_user_id IS NULL THEN
    RETURN;
  END IF;
  INSERT INTO public.notifications(user_id, type, title, body, link, meta)
  VALUES (p_user_id, p_type, p_title, p_body, p_link, COALESCE(p_meta, '{}'::jsonb));
END;
$$;

-- 6) enforce expert identity snapshot from users table
CREATE OR REPLACE FUNCTION public.tg_enforce_expert_answer_identity()
RETURNS TRIGGER AS $$
DECLARE
  v_user public.users%ROWTYPE;
BEGIN
  SELECT * INTO v_user FROM public.users WHERE id = NEW.expert_id;
  IF v_user.id IS NULL THEN
    RAISE EXCEPTION 'expert user not found';
  END IF;

  IF v_user.role NOT IN ('vet', 'vet_student', 'vet_clinic', 'behaviorist', 'admin') THEN
    RAISE EXCEPTION 'only verified expert/admin can answer';
  END IF;

  NEW.expert_role := v_user.role;
  NEW.expert_name := v_user.nickname;
  NEW.expert_clinic := v_user.clinic_name;
  NEW.expert_license := v_user.license_no;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_enforce_expert_answer_identity ON public.expert_answers;
CREATE TRIGGER trg_enforce_expert_answer_identity
BEFORE INSERT ON public.expert_answers
FOR EACH ROW EXECUTE FUNCTION public.tg_enforce_expert_answer_identity();

-- 7) notify feed author when expert answer inserted
CREATE OR REPLACE FUNCTION public.tg_notify_feed_author_on_expert_answer()
RETURNS TRIGGER AS $$
DECLARE
  v_author uuid;
BEGIN
  SELECT author_id INTO v_author FROM public.feed_posts WHERE id = NEW.feed_post_id;
  IF v_author IS NOT NULL AND v_author <> NEW.expert_id THEN
    PERFORM public.create_notification(
      v_author,
      'expert_answer',
      '전문가 답변이 도착했습니다',
      '피드에 전문가 답변이 등록되었습니다. 확인 후 채택할 수 있습니다.',
      '/feed/' || NEW.feed_post_id,
      jsonb_build_object('feed_post_id', NEW.feed_post_id, 'expert_answer_id', NEW.id)
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_notify_feed_author_on_expert_answer ON public.expert_answers;
CREATE TRIGGER trg_notify_feed_author_on_expert_answer
AFTER INSERT ON public.expert_answers
FOR EACH ROW EXECUTE FUNCTION public.tg_notify_feed_author_on_expert_answer();

-- 8) accept expert answer (owner pays points)
CREATE OR REPLACE FUNCTION public.accept_expert_answer(
  p_answer_id uuid,
  p_reward_points int DEFAULT 50
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_answer public.expert_answers%ROWTYPE;
  v_post public.feed_posts%ROWTYPE;
  v_owner public.users%ROWTYPE;
BEGIN
  IF p_reward_points IS NULL OR p_reward_points < 1 THEN
    RAISE EXCEPTION 'invalid reward points';
  END IF;

  SELECT * INTO v_answer FROM public.expert_answers WHERE id = p_answer_id;
  IF v_answer.id IS NULL THEN
    RAISE EXCEPTION 'answer not found';
  END IF;

  SELECT * INTO v_post FROM public.feed_posts WHERE id = v_answer.feed_post_id;
  IF v_post.id IS NULL THEN
    RAISE EXCEPTION 'feed post not found';
  END IF;

  IF v_post.author_id <> auth.uid() THEN
    RAISE EXCEPTION 'only post owner can accept';
  END IF;

  IF v_post.accepted_expert_answer_id IS NOT NULL THEN
    RAISE EXCEPTION 'already accepted';
  END IF;

  SELECT * INTO v_owner FROM public.users WHERE id = auth.uid() FOR UPDATE;
  IF v_owner.points < p_reward_points THEN
    RAISE EXCEPTION 'not enough points';
  END IF;

  UPDATE public.users SET points = points - p_reward_points WHERE id = v_owner.id;
  UPDATE public.users SET points = points + p_reward_points WHERE id = v_answer.expert_id;

  INSERT INTO public.point_logs(user_id, amount, reason)
  VALUES (v_owner.id, -p_reward_points, '전문가 답변 채택 보상 지급');

  INSERT INTO public.point_logs(user_id, amount, reason)
  VALUES (v_answer.expert_id, p_reward_points, '전문가 답변 채택 보상 수령');

  UPDATE public.expert_answers
    SET reward_status = 'accepted',
        reward_points = p_reward_points,
        rewarded_at = now()
    WHERE id = p_answer_id;

  UPDATE public.feed_posts
    SET accepted_expert_answer_id = p_answer_id,
        answer_accepted_at = now(),
        expert_status = 'answered'
    WHERE id = v_post.id;

  PERFORM public.create_notification(
    v_answer.expert_id,
    'expert_answer_accepted',
    '답변이 채택되었습니다',
    '작성한 전문가 답변이 채택되어 포인트가 지급되었습니다.',
    '/feed/' || v_post.id,
    jsonb_build_object('feed_post_id', v_post.id, 'reward_points', p_reward_points)
  );

  RETURN jsonb_build_object('ok', true, 'reward_points', p_reward_points);
END;
$$;

-- 9) auto settle after 7 days (platform-sponsored points)
CREATE OR REPLACE FUNCTION public.settle_expired_expert_rewards(
  p_limit int DEFAULT 100,
  p_auto_points int DEFAULT 20
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_post record;
  v_answer record;
  v_settled int := 0;
BEGIN
  FOR v_post IN
    SELECT fp.id
    FROM public.feed_posts fp
    WHERE fp.request_expert = true
      AND fp.accepted_expert_answer_id IS NULL
      AND fp.expert_auto_settled_at IS NULL
      AND fp.created_at <= now() - interval '7 days'
      AND EXISTS (SELECT 1 FROM public.expert_answers ea WHERE ea.feed_post_id = fp.id)
    ORDER BY fp.created_at ASC
    LIMIT GREATEST(COALESCE(p_limit, 100), 1)
  LOOP
    FOR v_answer IN
      SELECT ea.id, ea.expert_id
      FROM public.expert_answers ea
      WHERE ea.feed_post_id = v_post.id
        AND ea.reward_status = 'none'
    LOOP
      UPDATE public.users SET points = points + p_auto_points WHERE id = v_answer.expert_id;
      INSERT INTO public.point_logs(user_id, amount, reason)
      VALUES (v_answer.expert_id, p_auto_points, '전문가 자동 보상(7일 미채택)');

      UPDATE public.expert_answers
        SET reward_status = 'auto_paid',
            reward_points = p_auto_points,
            rewarded_at = now()
        WHERE id = v_answer.id;

      PERFORM public.create_notification(
        v_answer.expert_id,
        'expert_auto_reward',
        '7일 자동 보상 지급',
        '채택이 없었지만 자동 보상 포인트가 지급되었습니다.',
        '/feed/' || v_post.id,
        jsonb_build_object('feed_post_id', v_post.id, 'reward_points', p_auto_points)
      );

      v_settled := v_settled + 1;
    END LOOP;

    UPDATE public.feed_posts
      SET expert_auto_settled_at = now(),
          expert_status = CASE WHEN expert_status = 'none' THEN 'answered' ELSE expert_status END
      WHERE id = v_post.id;
  END LOOP;

  RETURN jsonb_build_object('ok', true, 'settled_answers', v_settled);
END;
$$;

-- 10) point withdrawal request (>=5000)
CREATE OR REPLACE FUNCTION public.request_point_withdrawal(
  p_points int,
  p_bank_name text,
  p_account_no text,
  p_account_holder text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user public.users%ROWTYPE;
  v_req_id uuid;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'login required';
  END IF;

  IF p_points < 5000 THEN
    RAISE EXCEPTION 'minimum withdrawal is 5000 points';
  END IF;

  IF coalesce(trim(p_bank_name), '') = '' OR coalesce(trim(p_account_no), '') = '' OR coalesce(trim(p_account_holder), '') = '' THEN
    RAISE EXCEPTION 'bank info required';
  END IF;

  SELECT * INTO v_user FROM public.users WHERE id = auth.uid() FOR UPDATE;
  IF v_user.id IS NULL THEN
    RAISE EXCEPTION 'user not found';
  END IF;

  IF v_user.points < p_points THEN
    RAISE EXCEPTION 'not enough points';
  END IF;

  UPDATE public.users SET points = points - p_points WHERE id = v_user.id;
  INSERT INTO public.point_logs(user_id, amount, reason)
  VALUES (v_user.id, -p_points, '포인트 출금 신청');

  INSERT INTO public.point_withdraw_requests(user_id, points, bank_name, account_no, account_holder)
  VALUES (v_user.id, p_points, p_bank_name, p_account_no, p_account_holder)
  RETURNING id INTO v_req_id;

  RETURN jsonb_build_object('ok', true, 'request_id', v_req_id, 'points', p_points);
END;
$$;

-- 11) point usage for service payment discount
CREATE OR REPLACE FUNCTION public.use_points_for_service(
  p_points int,
  p_service_type text,
  p_order_ref text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user public.users%ROWTYPE;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'login required';
  END IF;
  IF p_points < 1 THEN
    RAISE EXCEPTION 'invalid points';
  END IF;

  SELECT * INTO v_user FROM public.users WHERE id = auth.uid() FOR UPDATE;
  IF v_user.points < p_points THEN
    RAISE EXCEPTION 'not enough points';
  END IF;

  UPDATE public.users SET points = points - p_points WHERE id = v_user.id;
  INSERT INTO public.point_logs(user_id, amount, reason)
  VALUES (v_user.id, -p_points, '서비스 결제 포인트 사용: ' || COALESCE(p_service_type, '기타'));

  RETURN jsonb_build_object(
    'ok', true,
    'used_points', p_points,
    'discount_krw', p_points,
    'order_ref', p_order_ref
  );
END;
$$;
