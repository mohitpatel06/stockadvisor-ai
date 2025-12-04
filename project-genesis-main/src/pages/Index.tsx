import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, BarChart3, Shield, Target, Brain, Zap } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced machine learning models analyze market trends and predict stock movements",
    },
    {
      icon: TrendingUp,
      title: "Price Predictions",
      description: "Get accurate short-term and long-term price forecasts for your stocks",
    },
    {
      icon: BarChart3,
      title: "Technical Indicators",
      description: "Comprehensive technical analysis with RSI, MACD, SMA, and more",
    },
    {
      icon: Shield,
      title: "Risk Management",
      description: "Personalized recommendations based on your risk tolerance and goals",
    },
    {
      icon: Target,
      title: "Smart Alerts",
      description: "Set price alerts and get notified of important market movements",
    },
    {
      icon: Zap,
      title: "Real-Time Data",
      description: "Live market data and instant analysis powered by external APIs",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-20 text-center space-y-8">
        <div className="space-y-4 max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gradient-primary">
            StockAdvisor AI
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground">
            Intelligent Stock Market Predictions & Advisory System
          </p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Make smarter investment decisions with AI-powered predictions, technical analysis, 
            and personalized recommendations tailored to your investment goals.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Button size="lg" onClick={() => navigate("/auth")} className="text-lg">
            Get Started
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate("/auth")} className="text-lg">
            Learn More
          </Button>
        </div>
      </header>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
          <p className="text-muted-foreground">
            Everything you need to make informed investment decisions
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="card-hover">
              <CardHeader>
                <div className="p-3 rounded-lg bg-primary/10 w-fit mb-2">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-gradient-to-br from-primary to-accent text-primary-foreground">
          <CardContent className="py-12 text-center space-y-6">
            <h2 className="text-3xl font-bold">Ready to start investing smarter?</h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              Join thousands of investors who use AI to make better investment decisions
            </p>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate("/auth")}
              className="text-lg"
            >
              Create Your Free Account
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>© 2025 StockAdvisor AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
