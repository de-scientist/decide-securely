import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  Shield,
  Vote,
  Lock,
  TrendingUp,
  Users,
  CheckCircle,
  ArrowRight,
  Zap,
} from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: Lock,
      title: "Blockchain Security",
      description: "Votes recorded immutably on-chain with cryptographic verification",
    },
    {
      icon: Shield,
      title: "Transparent & Fair",
      description: "Every vote is traceable and auditable while preserving voter privacy",
    },
    {
      icon: Users,
      title: "Decentralized",
      description: "No central authority controls the voting process or results",
    },
    {
      icon: Zap,
      title: "Instant Results",
      description: "Real-time vote counting with immediate, tamper-proof results",
    },
  ];

  const steps = [
    {
      step: "01",
      title: "Connect Wallet",
      description: "Link your Web3 wallet to verify your identity securely",
    },
    {
      step: "02",
      title: "Browse or Create",
      description: "Explore active polls or create your own voting campaign",
    },
    {
      step: "03",
      title: "Cast Your Vote",
      description: "Vote on-chain with a secure signature—transparent and immutable",
    },
    {
      step: "04",
      title: "Track Results",
      description: "Watch results update in real-time with full transparency",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10"></div>
        <div className="container mx-auto text-center relative z-10">
          <div className="animate-fade-in">
            <div className="inline-block mb-4 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <span className="text-sm font-medium text-primary">
                Powered by Blockchain
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Vote With Trust.
              <br />
              <span className="gradient-text">Govern With Transparency.</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              A decentralized voting platform built on blockchain technology.
              Secure, transparent, and tamper-proof governance for the modern age.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/create">
                <Button size="lg" className="gap-2 group">
                  Create Poll
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/polls">
                <Button size="lg" variant="secondary" className="gap-2">
                  <Vote className="h-4 w-4" />
                  Browse Polls
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose VoteChain?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built on blockchain technology to ensure every vote counts and can't be manipulated
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="p-6 hover-lift glass-card animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="p-3 rounded-lg bg-primary/10 w-fit mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Four simple steps to participate in transparent, decentralized voting
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary text-white font-bold text-xl mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary to-accent"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Military-Grade Security
              </h2>
              <p className="text-muted-foreground mb-8">
                Every vote is encrypted, signed, and recorded on the blockchain.
                Our system ensures complete transparency while protecting voter privacy.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Immutable Records</h4>
                    <p className="text-sm text-muted-foreground">
                      Once cast, votes cannot be altered or deleted by anyone
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">One Wallet, One Vote</h4>
                    <p className="text-sm text-muted-foreground">
                      Smart contracts prevent duplicate voting automatically
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Full Transparency</h4>
                    <p className="text-sm text-muted-foreground">
                      All votes are publicly verifiable on the blockchain
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <Card className="p-8 glass-card">
              <div className="space-y-6">
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="flex items-center gap-3 mb-2">
                    <Lock className="h-5 w-5 text-primary" />
                    <span className="font-semibold">Cryptographic Security</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    256-bit encryption protects all transactions
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
                  <div className="flex items-center gap-3 mb-2">
                    <Shield className="h-5 w-5 text-accent" />
                    <span className="font-semibold">Smart Contract Verified</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    All logic is auditable and transparent
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <span className="font-semibold">Real-Time Verification</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Instant validation of every vote cast
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <Card className="p-12 text-center bg-gradient-primary text-white border-0 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAzMHYySDI0di0yaDF6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-10"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Start Voting?
              </h2>
              <p className="text-white/90 mb-8 max-w-2xl mx-auto">
                Join thousands of users already using VoteChain for transparent, secure governance
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/create">
                  <Button size="lg" variant="secondary" className="gap-2">
                    Create Your First Poll
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border/50">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-primary">
                <Vote className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">VoteChain</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 VoteChain. Decentralized voting for everyone.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
