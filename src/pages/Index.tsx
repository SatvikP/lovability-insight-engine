// src/pages/Index.tsx
import { ApiKeyManager } from "@/components/ApiKeyManager";
import { WebsiteAnalyzer } from "@/components/WebsiteAnalyzer";
import { PricingSection } from "@/components/PricingSection";
import { FirecrawlService } from "@/utils/FirecrawlService";
import { AnthropicService } from "@/utils/AnthropicService";
import { useState, useEffect } from "react";

const Index = () => {
  const [hasApiKeys, setHasApiKeys] = useState(false);

  useEffect(() => {
    // Check if both API keys are available
    const hasFirecrawl = !!FirecrawlService.getApiKey();
    const hasAnthropic = !!AnthropicService.getApiKey();
    setHasApiKeys(hasFirecrawl && hasAnthropic);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12 space-y-8">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            AI-Powered Website Growth Analysis
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get instant, AI-powered feedback on your onboarding, UX, and growth potential. 
            Powered by Claude AI and Growth 101 principles.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              ⚡ AI analysis in 30 seconds
            </span>
            <span className="flex items-center gap-2">
              🎯 Growth 101 principles
            </span>
            <span className="flex items-center gap-2">
              🤖 Claude AI insights
            </span>
          </div>
        </div>

        {/* API Key Management */}
        {!hasApiKeys && (
          <div className="max-w-md mx-auto">
            <ApiKeyManager onApiKeySet={() => setHasApiKeys(true)} />
          </div>
        )}

        {/* Main Analyzer */}
        {hasApiKeys && <WebsiteAnalyzer />}
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
        </div>
      </footer>
    </div>
  );
};

export default Index;