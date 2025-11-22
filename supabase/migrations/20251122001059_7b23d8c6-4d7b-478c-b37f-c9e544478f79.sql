-- Create polls table
CREATE TABLE public.polls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  creator_address TEXT NOT NULL,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  is_public BOOLEAN NOT NULL DEFAULT true,
  is_transparent BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'upcoming',
  category TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create poll options table
CREATE TABLE public.poll_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id UUID NOT NULL REFERENCES public.polls(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  vote_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create votes table
CREATE TABLE public.votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id UUID NOT NULL REFERENCES public.polls(id) ON DELETE CASCADE,
  option_id UUID NOT NULL REFERENCES public.poll_options(id) ON DELETE CASCADE,
  voter_address TEXT NOT NULL,
  transaction_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(poll_id, voter_address)
);

-- Enable Row Level Security
ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for polls (public read, anyone can create)
CREATE POLICY "Polls are viewable by everyone"
  ON public.polls FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create polls"
  ON public.polls FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Creators can update their own polls"
  ON public.polls FOR UPDATE
  USING (creator_address = current_setting('request.headers')::json->>'x-wallet-address');

-- RLS Policies for poll_options (public read, restricted write)
CREATE POLICY "Poll options are viewable by everyone"
  ON public.poll_options FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create poll options"
  ON public.poll_options FOR INSERT
  WITH CHECK (true);

-- RLS Policies for votes (restricted)
CREATE POLICY "Votes are viewable based on poll transparency"
  ON public.votes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.polls 
      WHERE polls.id = votes.poll_id 
      AND (polls.is_transparent = true OR polls.creator_address = current_setting('request.headers')::json->>'x-wallet-address')
    )
  );

CREATE POLICY "Anyone can vote"
  ON public.votes FOR INSERT
  WITH CHECK (true);

-- Create function to update poll status based on dates
CREATE OR REPLACE FUNCTION update_poll_status()
RETURNS void AS $$
BEGIN
  UPDATE public.polls
  SET status = CASE
    WHEN now() < start_date THEN 'upcoming'
    WHEN now() >= start_date AND now() <= end_date THEN 'active'
    ELSE 'ended'
  END;
END;
$$ LANGUAGE plpgsql;

-- Create function to update vote count
CREATE OR REPLACE FUNCTION increment_vote_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.poll_options
  SET vote_count = vote_count + 1
  WHERE id = NEW.option_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for vote count
CREATE TRIGGER on_vote_cast
  AFTER INSERT ON public.votes
  FOR EACH ROW
  EXECUTE FUNCTION increment_vote_count();

-- Create indexes for better performance
CREATE INDEX idx_polls_status ON public.polls(status);
CREATE INDEX idx_polls_creator ON public.polls(creator_address);
CREATE INDEX idx_votes_poll_id ON public.votes(poll_id);
CREATE INDEX idx_votes_voter ON public.votes(voter_address);
CREATE INDEX idx_poll_options_poll_id ON public.poll_options(poll_id);