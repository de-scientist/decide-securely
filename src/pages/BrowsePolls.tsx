import { Navbar } from "@/components/Navbar";
import { PollCard } from "@/components/PollCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, TrendingUp, Clock, Calendar } from "lucide-react";
import { useState } from "react";

// Mock data for demo
const mockPolls = [
  {
    id: "1",
    title: "Should we implement gasless voting for all future polls?",
    creator: "0x1234...5678",
    endDate: "2024-12-31T23:59:59",
    totalVotes: 1247,
    status: "active" as const,
    category: "Governance",
  },
  {
    id: "2",
    title: "Next feature priority: Mobile app vs Advanced analytics",
    creator: "0xabcd...efgh",
    endDate: "2024-12-25T12:00:00",
    totalVotes: 892,
    status: "active" as const,
    category: "Development",
  },
  {
    id: "3",
    title: "Community treasury allocation for Q1 2024",
    creator: "0x9876...4321",
    endDate: "2025-01-15T00:00:00",
    totalVotes: 0,
    status: "upcoming" as const,
    category: "Treasury",
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
  {
    id: "5",
    title: "Should we increase staking rewards by 10%?",
    creator: "0x5555...6666",
    endDate: "2024-12-28T23:59:59",
    totalVotes: 567,
    status: "active" as const,
    category: "Economics",
  },
  {
    id: "6",
    title: "New brand identity and logo design selection",
    creator: "0x7777...8888",
    endDate: "2025-01-01T00:00:00",
    totalVotes: 0,
    status: "upcoming" as const,
    category: "Community",
  },
];

const BrowsePolls = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredPolls = mockPolls.filter((poll) => {
    const matchesSearch = poll.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || poll.status === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-3">Browse Polls</h1>
            <p className="text-muted-foreground">
              Explore active governance votes and make your voice heard
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search polls..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="secondary" className="gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-4 gap-2">
                <TabsTrigger value="all" className="gap-2">
                  <TrendingUp className="h-4 w-4" />
                  All
                </TabsTrigger>
                <TabsTrigger value="active" className="gap-2">
                  <Clock className="h-4 w-4" />
                  Active
                </TabsTrigger>
                <TabsTrigger value="upcoming" className="gap-2">
                  <Calendar className="h-4 w-4" />
                  Upcoming
                </TabsTrigger>
                <TabsTrigger value="ended">
                  Ended
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-6">
                {filteredPolls.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPolls.map((poll) => (
                      <PollCard key={poll.id} {...poll} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      No polls found matching your criteria
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Stats */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg bg-gradient-primary text-white">
              <div className="text-3xl font-bold mb-1">{mockPolls.length}</div>
              <div className="text-white/80">Total Polls</div>
            </div>
            <div className="p-6 rounded-lg bg-accent/10 border border-accent/20">
              <div className="text-3xl font-bold mb-1 text-accent">
                {mockPolls.filter((p) => p.status === "active").length}
              </div>
              <div className="text-muted-foreground">Active Now</div>
            </div>
            <div className="p-6 rounded-lg bg-primary/10 border border-primary/20">
              <div className="text-3xl font-bold mb-1 text-primary">
                {mockPolls.reduce((sum, p) => sum + p.totalVotes, 0)}
              </div>
              <div className="text-muted-foreground">Total Votes Cast</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowsePolls;
