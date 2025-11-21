import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Wallet, Vote, Menu, X } from "lucide-react";
import { useState } from "react";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const handleWalletConnect = () => {
    setIsConnected(!isConnected);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-lg bg-gradient-primary">
              <Vote className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">VoteChain</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/polls" className="text-sm font-medium hover:text-primary transition-colors">
              Browse Polls
            </Link>
            <Link to="/create" className="text-sm font-medium hover:text-primary transition-colors">
              Create Poll
            </Link>
            <Link to="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
              Dashboard
            </Link>
            <Button
              onClick={handleWalletConnect}
              variant={isConnected ? "secondary" : "default"}
              className="gap-2"
            >
              <Wallet className="h-4 w-4" />
              {isConnected ? "0x1234...5678" : "Connect Wallet"}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-3 animate-slide-up">
            <Link
              to="/polls"
              className="block px-4 py-2 text-sm font-medium hover:bg-secondary rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Browse Polls
            </Link>
            <Link
              to="/create"
              className="block px-4 py-2 text-sm font-medium hover:bg-secondary rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Create Poll
            </Link>
            <Link
              to="/dashboard"
              className="block px-4 py-2 text-sm font-medium hover:bg-secondary rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Button
              onClick={handleWalletConnect}
              variant={isConnected ? "secondary" : "default"}
              className="w-full gap-2"
            >
              <Wallet className="h-4 w-4" />
              {isConnected ? "0x1234...5678" : "Connect Wallet"}
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};
