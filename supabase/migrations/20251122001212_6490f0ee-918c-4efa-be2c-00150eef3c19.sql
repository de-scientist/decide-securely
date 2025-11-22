-- Fix security warnings by setting search_path on functions
-- Drop trigger first
DROP TRIGGER IF EXISTS on_vote_cast ON public.votes;

-- Recreate functions with proper search_path using CREATE OR REPLACE
CREATE OR REPLACE FUNCTION update_poll_status()
RETURNS void 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.polls
  SET status = CASE
    WHEN now() < start_date THEN 'upcoming'
    WHEN now() >= start_date AND now() <= end_date THEN 'active'
    ELSE 'ended'
  END;
END;
$$;

CREATE OR REPLACE FUNCTION increment_vote_count()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.poll_options
  SET vote_count = vote_count + 1
  WHERE id = NEW.option_id;
  RETURN NEW;
END;
$$;

-- Recreate trigger
CREATE TRIGGER on_vote_cast
  AFTER INSERT ON public.votes
  FOR EACH ROW
  EXECUTE FUNCTION increment_vote_count();