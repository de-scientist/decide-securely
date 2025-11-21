import { Navbar } from "@/components/Navbar";
import { PollCard } from "@/components/PollCard";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Vote, Users, TrendingUp, Award } from "lucide-react";

const Dashboard = () => {
  // Mock user data
  const userPolls = [
    {
      id: "1",
      title: "My community poll about future direction",
      creator: "You",
      endDate: "2024-12-25T23:59:59",
      totalVotes: 45,
      status: "active" as const,
      category: "Community",
    },
  ];

  const votedPolls = [
    {
      id: "2",
      title: "Should we implement gasless voting?",
      creator: "0x1234...5678",
      endDate: "2024-12-31T23:59:59",
      totalVotes: 1247,
      status: "active" as const,
      category: "Governance",
    },
    {
      id: "4",
      title: "Vote on new partnership with DeFi protocol",
      creator: "0xdef0...1234",
      endDate: "2024-11-20T18:00:00",
      totalVotes: 2341,
      status: "ended" as const,
      category: "Partnerships",
    },
  ];

  const stats = [
    {
      icon: Vote,
      label: "Polls Created",
      value: "3",
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      icon: Users,
      label: "Votes Cast",
      value: "12",
      color: "text-accent",
      bg: "bg-accent/10",
    },
    {
      icon: TrendingUp,
      label: "Participation Rate",
      value: "87%",
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      icon: Award,
      label: "Reputation Score",
      value: "142",
      color: "text-accent",
      bg: "bg-accent/10",
    },
  ];

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
                <p className="text-white/80 font-mono">0x1234567890abcdef1234567890abcdef12345678</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
                <span className="text-sm">Connected</span>
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
              {userPolls.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userPolls.map((poll) => (
                    <PollCard key={poll.id} {...poll} />
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
              {votedPolls.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {votedPolls.map((poll) => (
                    <PollCard key={poll.id} {...poll} />
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
