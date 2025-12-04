import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, TrendingUp, TrendingDown, User, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/stock/${searchQuery.toUpperCase()}`);
    }
  };

  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You've been successfully logged out.",
    });
    navigate("/");
  };

  const trendingStocks = [
    { symbol: "AAPL", name: "Apple Inc.", price: 178.32, change: 2.34, changePercent: 1.33 },
    { symbol: "GOOGL", name: "Alphabet Inc.", price: 142.65, change: -1.23, changePercent: -0.85 },
    { symbol: "MSFT", name: "Microsoft Corp.", price: 412.45, change: 5.67, changePercent: 1.39 },
    { symbol: "TSLA", name: "Tesla Inc.", price: 242.89, change: 8.12, changePercent: 3.46 },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gradient-primary">StockAdvisor AI</h1>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/profile")}>
              <User className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h2 className="text-3xl font-bold">Welcome back!</h2>
          <p className="text-muted-foreground">
            Search for stocks to get AI-powered predictions and recommendations
          </p>
        </div>

        {/* Search Bar */}
        <Card className="card-hover">
          <CardContent className="pt-6">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Enter stock symbol (e.g., AAPL, GOOGL, TSLA)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit">Analyze</Button>
            </form>
          </CardContent>
        </Card>

        {/* Trending Stocks */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Trending Stocks</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {trendingStocks.map((stock) => (
              <Card
                key={stock.symbol}
                className="card-hover cursor-pointer"
                onClick={() => navigate(`/stock/${stock.symbol}`)}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{stock.symbol}</CardTitle>
                  <CardDescription className="text-xs">{stock.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-2xl font-bold">${stock.price}</p>
                    <div
                      className={`flex items-center gap-1 text-sm font-medium ${
                        stock.change >= 0 ? "text-success" : "text-destructive"
                      }`}
                    >
                      {stock.change >= 0 ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                      <span>
                        {stock.change >= 0 ? "+" : ""}
                        {stock.change} ({stock.changePercent}%)
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Portfolio Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">$124,563</p>
              <p className="text-sm text-success mt-1">+$2,345 (1.92%)</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">12</p>
              <p className="text-sm text-muted-foreground mt-1">3 triggered today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">8</p>
              <p className="text-sm text-muted-foreground mt-1">New this week</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
