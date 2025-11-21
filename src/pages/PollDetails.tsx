import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, Users, Clock, ExternalLink, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const PollDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

  // Mock poll data
  const poll = {
    id,
    title: "Should we implement gasless voting for all future polls?",
    description:
      "This proposal aims to implement meta-transactions for all voting operations, allowing users to vote without paying gas fees. The treasury will cover gas costs to improve accessibility and participation.",
    creator: "0x1234...5678",
    createdAt: "2024-11-15T10:00:00",
    endDate: "2024-12-31T23:59:59",
    totalVotes: 1247,
    status: "active",
    category: "Governance",
    isAnonymous: false,
    options: [
      { id: 1, text: "Yes, implement gasless voting", votes: 847, percentage: 68 },
      { id: 2, text: "No, keep current system", votes: 280, percentage: 22 },
      { id: 3, text: "Need more information", votes: 120, percentage: 10 },
    ],
  };

  const handleVote = () => {
    if (selectedOption === null) {
      toast.error("Please select an option to vote");
      return;
    }
    
    setHasVoted(true);
    toast.success("Vote cast successfully! 🎉", {
      description: "Your vote has been recorded on the blockchain",
    });
  };

  const timeRemaining = () => {
    const end = new Date(poll.endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    
    if (diff < 0) return "Poll ended";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    return `${days} days, ${hours} hours remaining`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <Button
            variant="ghost"
            onClick={() => navigate("/polls")}
            className="mb-6"
          >
            ← Back to Polls
          </Button>

          <Card className="p-8 glass-card">
            {/* Header */}
            <div className="mb-6 pb-6 border-b border-border">
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="text-3xl font-bold">{poll.title}</h1>
                <Badge className="bg-accent/10 text-accent border-accent/20">
                  {poll.status}
                </Badge>
              </div>
              
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>Created by {poll.creator}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(poll.createdAt).toLocaleDateString()}</span>
                </div>
                <Badge variant="secondary">{poll.category}</Badge>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Description</h2>
              <p className="text-muted-foreground leading-relaxed">
                {poll.description}
              </p>
            </div>

            {/* Timer */}
            <Card className="p-4 mb-8 bg-accent/5 border-accent/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-accent">
                  <Clock className="h-5 w-5" />
                  <span className="font-semibold">{timeRemaining()}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Ends {new Date(poll.endDate).toLocaleString()}
                </div>
              </div>
            </Card>

            {/* Voting Options */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Cast Your Vote</h2>
              <div className="space-y-3">
                {poll.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => !hasVoted && setSelectedOption(option.id)}
                    disabled={hasVoted}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      selectedOption === option.id && !hasVoted
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    } ${hasVoted ? "cursor-default" : "cursor-pointer"}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2 flex-1">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedOption === option.id && !hasVoted
                            ? "border-primary bg-primary"
                            : "border-border"
                        }`}>
                          {selectedOption === option.id && !hasVoted && (
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          )}
                          {hasVoted && option.id === selectedOption && (
                            <CheckCircle2 className="h-4 w-4 text-white" />
                          )}
                        </div>
                        <span className="font-medium">{option.text}</span>
                      </div>
                      <span className="text-sm font-semibold">{option.percentage}%</span>
                    </div>
                    <div className="ml-7">
                      <Progress value={option.percentage} className="h-2 mb-1" />
                      <p className="text-xs text-muted-foreground">
                        {option.votes} votes
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Vote Button */}
            {!hasVoted && (
              <Button
                onClick={handleVote}
                disabled={selectedOption === null}
                className="w-full"
                size="lg"
              >
                Cast Vote on Blockchain
              </Button>
            )}

            {hasVoted && (
              <Card className="p-4 bg-accent/10 border-accent/20">
                <div className="flex items-center gap-2 text-accent">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-semibold">Vote successfully recorded!</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Transaction: 0xabcd...ef12
                  <ExternalLink className="inline h-3 w-3 ml-1" />
                </p>
              </Card>
            )}

            {/* Stats */}
            <div className="mt-8 pt-8 border-t border-border">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-2xl font-bold">{poll.totalVotes}</div>
                  <div className="text-sm text-muted-foreground">Total Votes</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {poll.isAnonymous ? "Hidden" : poll.totalVotes}
                  </div>
                  <div className="text-sm text-muted-foreground">Unique Voters</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PollDetails;
