// src/components/WebsiteAnalyzer.tsx
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Zap, TrendingUp, Users, AlertCircle, CheckCircle, ArrowRight } from "lucide-react";
import { FirecrawlService } from '@/utils/FirecrawlService';
import { AnthropicService, WebsiteAnalysis } from '@/utils/AnthropicService';

export const WebsiteAnalyzer = () => {
  const { toast } = useToast();
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<WebsiteAnalysis | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAnalysis(null);
    
    try {
      // Check if both API keys are available
      const firecrawlKey = FirecrawlService.getApiKey();
      const anthropicKey = AnthropicService.getApiKey();
      
      if (!firecrawlKey || !anthropicKey) {
        toast({
          title: "Error",
          description: "Please set both Firecrawl and Anthropic API keys first",
          variant: "destructive",
          duration: 3000,
        });
        return;
      }

      console.log('Starting analysis for URL:', url);
      
      // Step 1: Scrape the website using Firecrawl
      const scrapeResult = await FirecrawlService.analyzeWebsite(url);
      
      if (!scrapeResult.success) {
        toast({
          title: "Scraping Failed",
          description: scrapeResult.error || "Failed to scrape website",
          variant: "destructive",
          duration: 3000,
        });
        return;
      }

      console.log('Website scraped successfully, now analyzing with AI...');
      
      // Step 2: Analyze the scraped content using Anthropic AI
      const analysisResult = await AnthropicService.analyzeWebsite(scrapeResult.data);
      
      if (analysisResult.success) {
        setAnalysis(analysisResult.data!);
        toast({
          title: "Analysis Complete",
          description: "Your website has been analyzed with AI-powered insights",
          duration: 3000,
        });
      } else {
        toast({
          title: "AI Analysis Failed",
          description: analysisResult.error || "Failed to analyze website with AI",
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Error analyzing website:', error);
      toast({
        title: "Error",
        description: "Failed to analyze website",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreBadgeVariant = (score: number): "default" | "secondary" | "destructive" => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Main Input Form */}
      <Card className="border-2 shadow-elegant">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            AI-Powered Website Growth Analyzer
          </CardTitle>
          <p className="text-muted-foreground">
            Get AI-powered feedback on your onboarding, UX, and growth potential
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://your-website.com"
                className="flex-1 h-12 text-base"
                required
              />
              <Button
                type="submit"
                disabled={isLoading || !url.trim()}
                className="h-12 px-8 bg-gradient-primary hover:shadow-glow transition-all duration-300"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Get AI Feedback
                  </>
                )}
              </Button>
            </div>
            <div className="text-center text-sm text-muted-foreground">
              ✨ <strong>AI-powered Growth 101 analysis in 30 seconds</strong>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <Card>
          <CardContent className="py-8">
            <div className="text-center space-y-4">
              <div className="animate-pulse text-primary">
                <Zap className="h-8 w-8 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold">AI is analyzing your website...</h3>
              <p className="text-muted-foreground">Scraping content and applying Growth 101 principles</p>
              <Progress value={65} className="w-64 mx-auto" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-6">
          {/* Overall Score */}
          <Card className="border-2 shadow-elegant">
            <CardContent className="py-6">
              <div className="text-center space-y-4">
                <div className={`text-4xl font-bold ${getScoreColor(analysis.overall.score)}`}>
                  {analysis.overall.score}/100
                </div>
                <Badge variant={getScoreBadgeVariant(analysis.overall.score)} className="text-sm px-4 py-1">
                  AI Growth Score
                </Badge>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  {analysis.overall.summary}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Category Breakdowns */}
          <div className="grid md:grid-cols-3 gap-4">
            {/* Onboarding Score */}
            <Card className="border shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <CardTitle className="text-lg">Onboarding</CardTitle>
                  </div>
                  <Badge variant={getScoreBadgeVariant(analysis.onboarding.score)}>
                    {analysis.onboarding.score}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {analysis.onboarding.issues.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Issues Found
                    </h4>
                    {analysis.onboarding.issues.map((issue, index) => (
                      <p key={index} className="text-xs text-muted-foreground bg-destructive/5 p-2 rounded">
                        {issue}
                      </p>
                    ))}
                  </div>
                )}
                {analysis.onboarding.suggestions.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-success flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      AI Suggestions
                    </h4>
                    {analysis.onboarding.suggestions.map((suggestion, index) => (
                      <p key={index} className="text-xs text-muted-foreground bg-success/5 p-2 rounded">
                        {suggestion}
                      </p>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* UX Score */}
            <Card className="border shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <CardTitle className="text-lg">UX/UI</CardTitle>
                  </div>
                  <Badge variant={getScoreBadgeVariant(analysis.ux.score)}>
                    {analysis.ux.score}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {analysis.ux.issues.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Issues Found
                    </h4>
                    {analysis.ux.issues.map((issue, index) => (
                      <p key={index} className="text-xs text-muted-foreground bg-destructive/5 p-2 rounded">
                        {issue}
                      </p>
                    ))}
                  </div>
                )}
                {analysis.ux.suggestions.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-success flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      AI Suggestions
                    </h4>
                    {analysis.ux.suggestions.map((suggestion, index) => (
                      <p key={index} className="text-xs text-muted-foreground bg-success/5 p-2 rounded">
                        {suggestion}
                      </p>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Growth Score */}
            <Card className="border shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" />
                    <CardTitle className="text-lg">Growth</CardTitle>
                  </div>
                  <Badge variant={getScoreBadgeVariant(analysis.growth.score)}>
                    {analysis.growth.score}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {analysis.growth.issues.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Issues Found
                    </h4>
                    {analysis.growth.issues.map((issue, index) => (
                      <p key={index} className="text-xs text-muted-foreground bg-destructive/5 p-2 rounded">
                        {issue}
                      </p>
                    ))}
                  </div>
                )}
                {analysis.growth.suggestions.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-success flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      AI Suggestions
                    </h4>
                    {analysis.growth.suggestions.map((suggestion, index) => (
                      <p key={index} className="text-xs text-muted-foreground bg-success/5 p-2 rounded">
                        {suggestion}
                      </p>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Pro CTA */}
          <Card className="border-2 border-primary bg-gradient-subtle">
            <CardContent className="py-6">
              <div className="text-center space-y-4">
                <h3 className="text-xl font-bold">Want deeper AI insights?</h3>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Get industry-specific benchmarks, expert recommendations, and actionable growth playbooks 
                  powered by advanced AI analysis.
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
                  <span>✓ Industry benchmarks</span>
                  <span>✓ Expert playbooks</span>
                  <span>✓ A/B testing suggestions</span>
                  <span>✓ Growth automation tips</span>
                </div>
                <Button className="bg-gradient-primary hover:shadow-glow transition-all duration-300">
                  Try Pro AI Agent
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                <p className="text-xs text-muted-foreground">
                  Powered by Claude AI and Growth 101 expertise
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};