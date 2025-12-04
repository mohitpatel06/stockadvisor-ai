import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";

const StockAnalysis = () => {
  const { symbol } = useParams();
  const navigate = useNavigate();

  // Mock data - in real app, this would come from API
  const stockData = {
    symbol: symbol || "AAPL",
    name: "Apple Inc.",
    currentPrice: 178.32,
    change: 2.34,
    changePercent: 1.33,
    prediction: {
      nextDay: 180.45,
      nextWeek: 185.20,
      confidence: 78,
    },
    recommendation: {
      action: "BUY",
      confidence: 82,
      reasoning: "Strong technical indicators with positive market sentiment. RSI shows the stock is not overbought, and MACD indicates bullish momentum.",
    },
    technicalIndicators: {
      rsi: 62,
      macd: { value: 1.23, signal: 0.98 },
      sma20: 175.45,
      sma50: 170.23,
    },
    fundamentals: {
      peRatio: 28.5,
      eps: 6.25,
      marketCap: "2.85T",
      dividend: 0.96,
    },
    sentiment: {
      score: 0.72,
      positive: 68,
      neutral: 24,
      negative: 8,
    },
  };

  const getRecommendationColor = (action: string) => {
    switch (action) {
      case "BUY":
        return "bg-success text-success-foreground";
      case "HOLD":
        return "bg-warning text-warning-foreground";
      case "SELL":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">{stockData.symbol}</h1>
              <p className="text-muted-foreground">{stockData.name}</p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold">${stockData.currentPrice}</p>
              <div
                className={`flex items-center justify-end gap-1 text-lg font-medium ${
                  stockData.change >= 0 ? "text-success" : "text-destructive"
                }`}
              >
                {stockData.change >= 0 ? (
                  <TrendingUp className="h-5 w-5" />
                ) : (
                  <TrendingDown className="h-5 w-5" />
                )}
                <span>
                  {stockData.change >= 0 ? "+" : ""}
                  {stockData.change} ({stockData.changePercent}%)
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6">
        {/* AI Recommendation */}
        <Card className="border-2 border-primary">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>AI Recommendation</CardTitle>
              <Badge className={getRecommendationColor(stockData.recommendation.action)}>
                {stockData.recommendation.action}
              </Badge>
            </div>
            <CardDescription>
              Confidence Score: {stockData.recommendation.confidence}%
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={stockData.recommendation.confidence} className="h-2" />
            <p className="text-sm">{stockData.recommendation.reasoning}</p>
          </CardContent>
        </Card>

        {/* Price Predictions */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Price Predictions</CardTitle>
              <CardDescription>AI-powered forecasts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Next Day</span>
                <span className="text-2xl font-bold">${stockData.prediction.nextDay}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Next Week</span>
                <span className="text-2xl font-bold">${stockData.prediction.nextWeek}</span>
              </div>
              <div className="pt-2 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <AlertCircle className="h-4 w-4" />
                  <span>Prediction Confidence: {stockData.prediction.confidence}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Market Sentiment</CardTitle>
              <CardDescription>Based on news and social media</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Positive</span>
                  <span className="font-medium">{stockData.sentiment.positive}%</span>
                </div>
                <Progress value={stockData.sentiment.positive} className="h-2 bg-success/20" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Neutral</span>
                  <span className="font-medium">{stockData.sentiment.neutral}%</span>
                </div>
                <Progress value={stockData.sentiment.neutral} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Negative</span>
                  <span className="font-medium">{stockData.sentiment.negative}%</span>
                </div>
                <Progress value={stockData.sentiment.negative} className="h-2 bg-destructive/20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Technical Indicators */}
        <Card>
          <CardHeader>
            <CardTitle>Technical Indicators</CardTitle>
            <CardDescription>Key metrics for technical analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">RSI (14)</p>
                <p className="text-2xl font-bold">{stockData.technicalIndicators.rsi}</p>
                <Badge variant="outline" className="text-xs">
                  {stockData.technicalIndicators.rsi > 70 ? "Overbought" : 
                   stockData.technicalIndicators.rsi < 30 ? "Oversold" : "Neutral"}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">MACD</p>
                <p className="text-2xl font-bold">{stockData.technicalIndicators.macd.value}</p>
                <p className="text-xs text-muted-foreground">Signal: {stockData.technicalIndicators.macd.signal}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">SMA (20)</p>
                <p className="text-2xl font-bold">${stockData.technicalIndicators.sma20}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">SMA (50)</p>
                <p className="text-2xl font-bold">${stockData.technicalIndicators.sma50}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fundamentals */}
        <Card>
          <CardHeader>
            <CardTitle>Fundamental Analysis</CardTitle>
            <CardDescription>Company financials and metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">P/E Ratio</p>
                <p className="text-2xl font-bold">{stockData.fundamentals.peRatio}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">EPS</p>
                <p className="text-2xl font-bold">${stockData.fundamentals.eps}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Market Cap</p>
                <p className="text-2xl font-bold">${stockData.fundamentals.marketCap}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Dividend Yield</p>
                <p className="text-2xl font-bold">{stockData.fundamentals.dividend}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default StockAnalysis;
