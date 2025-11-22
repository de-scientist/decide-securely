import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useWallet } from './WalletContext';
import { toast } from '@/hooks/use-toast';

interface Poll {
  id: string;
  title: string;
  description: string;
  creator_address: string;
  start_date: string;
  end_date: string;
  is_public: boolean;
  is_transparent: boolean;
  status: 'upcoming' | 'active' | 'ended';
  category: string;
  created_at: string;
}

interface PollOption {
  id: string;
  poll_id: string;
  option_text: string;
  vote_count: number;
}

interface Vote {
  id: string;
  poll_id: string;
  option_id: string;
  voter_address: string;
  transaction_hash: string | null;
  created_at: string;
}

interface CreatePollData {
  title: string;
  description: string;
  options: string[];
  startDate: string;
  endDate: string;
  isPublic: boolean;
  isTransparent: boolean;
  category: string;
}

interface PollContextType {
  polls: Poll[];
  loading: boolean;
  createPoll: (data: CreatePollData) => Promise<void>;
  castVote: (pollId: string, optionId: string) => Promise<void>;
  getPollOptions: (pollId: string) => Promise<PollOption[]>;
  getUserVotes: (address: string) => Promise<Vote[]>;
  getUserPolls: (address: string) => Promise<Poll[]>;
  refreshPolls: () => Promise<void>;
}

const PollContext = createContext<PollContextType | undefined>(undefined);

export const usePoll = () => {
  const context = useContext(PollContext);
  if (!context) {
    throw new Error('usePoll must be used within PollProvider');
  }
  return context;
};

interface PollProviderProps {
  children: ReactNode;
}

export const PollProvider = ({ children }: PollProviderProps) => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const { address } = useWallet();

  const fetchPolls = async () => {
    try {
      const { data, error } = await supabase
        .from('polls')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPolls(data || []);
    } catch (error) {
      console.error('Error fetching polls:', error);
      toast({
        title: 'Error',
        description: 'Failed to load polls',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolls();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('polls-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'polls' }, () => {
        fetchPolls();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const createPoll = async (data: CreatePollData) => {
    if (!address) {
      toast({
        title: 'Wallet not connected',
        description: 'Please connect your wallet to create a poll',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Create poll
      const { data: pollData, error: pollError } = await supabase
        .from('polls')
        .insert({
          title: data.title,
          description: data.description,
          creator_address: address,
          start_date: data.startDate,
          end_date: data.endDate,
          is_public: data.isPublic,
          is_transparent: data.isTransparent,
          category: data.category,
          status: new Date(data.startDate) > new Date() ? 'upcoming' : 'active',
        })
        .select()
        .single();

      if (pollError) throw pollError;

      // Create options
      const optionsData = data.options.map((option) => ({
        poll_id: pollData.id,
        option_text: option,
      }));

      const { error: optionsError } = await supabase
        .from('poll_options')
        .insert(optionsData);

      if (optionsError) throw optionsError;

      toast({
        title: 'Success!',
        description: 'Your poll has been created successfully',
      });

      await fetchPolls();
    } catch (error) {
      console.error('Error creating poll:', error);
      toast({
        title: 'Error',
        description: 'Failed to create poll',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const castVote = async (pollId: string, optionId: string) => {
    if (!address) {
      toast({
        title: 'Wallet not connected',
        description: 'Please connect your wallet to vote',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Check if user already voted
      const { data: existingVote } = await supabase
        .from('votes')
        .select('id')
        .eq('poll_id', pollId)
        .eq('voter_address', address)
        .single();

      if (existingVote) {
        toast({
          title: 'Already voted',
          description: 'You have already cast your vote on this poll',
          variant: 'destructive',
        });
        return;
      }

      // Simulate blockchain transaction
      const txHash = `0x${Math.random().toString(16).substring(2, 66)}`;

      const { error } = await supabase.from('votes').insert({
        poll_id: pollId,
        option_id: optionId,
        voter_address: address,
        transaction_hash: txHash,
      });

      if (error) throw error;

      toast({
        title: 'Vote cast successfully!',
        description: `Transaction: ${txHash.substring(0, 10)}...`,
      });

      await fetchPolls();
    } catch (error) {
      console.error('Error casting vote:', error);
      toast({
        title: 'Error',
        description: 'Failed to cast vote',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const getPollOptions = async (pollId: string): Promise<PollOption[]> => {
    const { data, error } = await supabase
      .from('poll_options')
      .select('*')
      .eq('poll_id', pollId);

    if (error) {
      console.error('Error fetching poll options:', error);
      return [];
    }

    return data || [];
  };

  const getUserVotes = async (walletAddress: string): Promise<Vote[]> => {
    const { data, error } = await supabase
      .from('votes')
      .select('*')
      .eq('voter_address', walletAddress);

    if (error) {
      console.error('Error fetching user votes:', error);
      return [];
    }

    return data || [];
  };

  const getUserPolls = async (walletAddress: string): Promise<Poll[]> => {
    const { data, error } = await supabase
      .from('polls')
      .select('*')
      .eq('creator_address', walletAddress)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user polls:', error);
      return [];
    }

    return data || [];
  };

  const refreshPolls = async () => {
    await fetchPolls();
  };

  return (
    <PollContext.Provider
      value={{
        polls,
        loading,
        createPoll,
        castVote,
        getPollOptions,
        getUserVotes,
        getUserPolls,
        refreshPolls,
      }}
    >
      {children}
    </PollContext.Provider>
  );
};
