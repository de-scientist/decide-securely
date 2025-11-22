import { Navbar } from "@/components/Navbar";
import { PollCard } from "@/components/PollCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, TrendingUp, Clock, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import { usePoll } from "@/contexts/PollContext";
import { supabase } from "@/integrations/supabase/client";

const BrowsePolls = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const { polls, loading } = usePoll();
  const [totalVotesCast, setTotalVotesCast] = useState<number | null>(null);

  useEffect(() => {
    const fetchTotalVotes = async () => {
      const { count, error } = await supabase
        .from("votes")
        .select("id", { count: "exact", head: true });

      if (!error) {
        setTotalVotesCast(count ?? 0);
      }
    };

    fetchTotalVotes();
  }, []);

  const filteredPolls = polls.filter((poll) => {
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
                {loading ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">Loading polls...</p>
                  </div>
                ) : filteredPolls.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPolls.map((poll) => (
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
              <div className="text-3xl font-bold mb-1">{polls.length}</div>
              <div className="text-white/80">Total Polls</div>
            </div>
            <div className="p-6 rounded-lg bg-accent/10 border border-accent/20">
              <div className="text-3xl font-bold mb-1 text-accent">
                {polls.filter((p) => p.status === "active").length}
              </div>
              <div className="text-muted-foreground">Active Now</div>
            </div>
            <div className="p-6 rounded-lg bg-primary/10 border border-primary/20">
              <div className="text-3xl font-bold mb-1 text-primary">
                {totalVotesCast ?? "-"}
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
