// src/pages/Index.tsx (Simplified - No API Key Management Needed)
import { WebsiteAnalyzer } from "@/components/WebsiteAnalyzer";
import { PricingSection } from "@/components/PricingSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12 space-y-8">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            AI-Powered Website Growth Analysis
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get instant, professional feedback on your website's growth potential. 
            No signup required - just enter your URL and get AI-powered insights.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              🤖 Claude AI analysis
            </span>
            <span className="flex items-center gap-2">
              🎯 Growth 101 principles
            </span>
            <span className="flex items-center gap-2">
              ⚡ Results in 60 seconds
            </span>
            <span className="flex items-center gap-2">
              🆓 Completely free
            </span>
          </div>
        </div>

        {/* Main Analyzer - No API keys needed! */}
        <WebsiteAnalyzer />
      </div>

      {/* Pricing Section */}
      <div className="bg-background/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <PricingSection />
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>© 2024 AI Website Growth Analyzer. Powered by Claude AI and Growth 101 expertise.</p>
          <p className="mt-2 text-xs">🔒 Privacy-first • No data stored • Professional insights</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;