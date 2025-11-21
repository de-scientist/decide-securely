import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

interface PollCardProps {
  id: string;
  title: string;
  creator: string;
  endDate: string;
  totalVotes: number;
  status: "active" | "upcoming" | "ended";
  category?: string;
}

export const PollCard = ({
  id,
  title,
  creator,
  endDate,
  totalVotes,
  status,
  category,
}: PollCardProps) => {
  const getStatusColor = () => {
    switch (status) {
      case "active":
        return "bg-accent/10 text-accent border-accent/20";
      case "upcoming":
        return "bg-primary/10 text-primary border-primary/20";
      case "ended":
        return "bg-muted/10 text-muted-foreground border-muted/20";
      default:
        return "";
    }
  };

  const timeRemaining = () => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    
    if (diff < 0) return "Ended";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h left`;
  };

  return (
    <Link to={`/poll/${id}`}>
      <Card className="p-6 hover-lift glass-card cursor-pointer group">
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                {title}
              </h3>
              <p className="text-sm text-muted-foreground truncate">
                by {creator}
              </p>
            </div>
            <Badge className={getStatusColor()}>
              {status}
            </Badge>
          </div>

          {category && (
            <Badge variant="secondary" className="text-xs">
              {category}
            </Badge>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{totalVotes}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{timeRemaining()}</span>
              </div>
            </div>
            {status === "active" && (
              <TrendingUp className="h-4 w-4 text-accent" />
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
};
