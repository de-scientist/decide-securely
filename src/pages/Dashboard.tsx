import { useEffect, useMemo, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { PollCard } from "@/components/PollCard";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Vote, Users, TrendingUp, Award } from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";
import { usePoll } from "@/contexts/PollContext";
import { supabase } from "@/integrations/supabase/client";

type DashboardPoll = {
  id: string;
  title: string;
  creator_address: string;
  end_date: string;
  status: string;
  category: string;
};

const Dashboard = () => {
  const { address, isConnected } = useWallet();
  const { getUserPolls, getUserVotes, polls } = usePoll();
  const [userPolls, setUserPolls] = useState<DashboardPoll[]>([]);
  const [votedPolls, setVotedPolls] = useState<DashboardPoll[]>([]);
  const [votesCastCount, setVotesCastCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!address) {
        setUserPolls([]);
        setVotedPolls([]);
        setVotesCastCount(0);
        return;
      }

      setLoading(true);
      try {
        const [userPollsResult, userVotes] = await Promise.all([
          getUserPolls(address),
          getUserVotes(address),
        ]);

        setUserPolls(userPollsResult ?? []);
        setVotesCastCount(userVotes.length);

        const pollIds = Array.from(new Set(userVotes.map((v) => v.poll_id)));
        if (pollIds.length > 0) {
          const { data } = await supabase
            .from("polls")
            .select("*")
            .in("id", pollIds);
          setVotedPolls(data ?? []);
        } else {
          setVotedPolls([]);
        }
      } finally {
        setLoading(false);
      }
    };

    // Recalculate when address changes or polls list updates (e.g. after creating a poll)
    loadData();
  }, [address, getUserPolls, getUserVotes, polls.length]);

  const stats = useMemo(
    () => [
      {
        icon: Vote,
        label: "Polls Created",
        value: userPolls.length.toString(),
        color: "text-primary",
        bg: "bg-primary/10",
      },
      {
        icon: Users,
        label: "Votes Cast",
        value: votesCastCount.toString(),
        color: "text-accent",
        bg: "bg-accent/10",
      },
      {
        icon: TrendingUp,
        label: "Participation Rate",
        value: userPolls.length > 0 ? "100%" : "0%",
        color: "text-primary",
        bg: "bg-primary/10",
      },
      {
        icon: Award,
        label: "Reputation Score",
        value: (userPolls.length * 10 + votesCastCount).toString(),
        color: "text-accent",
        bg: "bg-accent/10",
      },
    ], [userPolls.length, votesCastCount]
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-3">My Dashboard</h1>
            <p className="text-muted-foreground">
              Track your polls, votes, and governance activity
            </p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
              <Card key={index} className="p-6 glass-card">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${stat.bg}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Wallet Info */}
          <Card className="p-6 mb-8 glass-card bg-gradient-primary text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-1">Connected Wallet</h3>
                <p className="text-white/80 font-mono">
                  {address ?? "Not connected"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isConnected ? "bg-accent animate-pulse" : "bg-white/40"
                  }`}
                ></div>
                <span className="text-sm">{isConnected ? "Connected" : "Disconnected"}</span>
              </div>
            </div>
          </Card>

          {/* Polls Tabs */}
          <Tabs defaultValue="created" className="w-full">
            <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-2 mb-6">
              <TabsTrigger value="created">Polls I Created</TabsTrigger>
              <TabsTrigger value="voted">Polls I Voted On</TabsTrigger>
            </TabsList>

            <TabsContent value="created">
              {loading ? (
                <Card className="p-12 text-center glass-card">
                  <p className="text-muted-foreground">Loading your polls...</p>
                </Card>
              ) : userPolls.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userPolls.map((poll) => (
                    <PollCard
                      key={poll.id}
                      id={poll.id}
                      title={poll.title}
                      creator={poll.creator_address}
                      endDate={poll.end_date}
                      totalVotes={0}
                      status={poll.status as "active" | "upcoming" | "ended"}
                      category={poll.category}
                    />
                  ))}
                </div>
              ) : (
                <Card className="p-12 text-center glass-card">
                  <Vote className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No polls created yet</h3>
                  <p className="text-muted-foreground">
                    Start your first poll to see it here
                  </p>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="voted">
              {loading ? (
                <Card className="p-12 text-center glass-card">
                  <p className="text-muted-foreground">Loading your voting history...</p>
                </Card>
              ) : votedPolls.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {votedPolls.map((poll) => (
                    <PollCard
                      key={poll.id}
                      id={poll.id}
                      title={poll.title}
                      creator={poll.creator_address}
                      endDate={poll.end_date}
                      totalVotes={0}
                      status={poll.status as "active" | "upcoming" | "ended"}
                      category={poll.category}
                    />
                  ))}
                </div>
              ) : (
                <Card className="p-12 text-center glass-card">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No votes cast yet</h3>
                  <p className="text-muted-foreground">
                    Browse active polls and make your voice heard
                  </p>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
