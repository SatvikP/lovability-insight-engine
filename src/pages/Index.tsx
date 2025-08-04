import { ApiKeyManager } from "@/components/ApiKeyManager";
import { WebsiteAnalyzer } from "@/components/WebsiteAnalyzer";
import { PricingSection } from "@/components/PricingSection";
import { FirecrawlService } from "@/utils/FirecrawlService";
import { useState, useEffect } from "react";

const Index = () => {
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    setHasApiKey(!!FirecrawlService.getApiKey());
  }, []);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12 space-y-8">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Fix Your Website's Growth
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get instant, expert feedback on your onboarding, UX, and growth potential. 
            Like Grammarly, but for websites built with AI tools.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              ⚡ Results in 30 seconds
            </span>
            <span className="flex items-center gap-2">
              🎯 Industry-specific insights
            </span>
            <span className="flex items-center gap-2">
              📈 PLG expert recommendations
            </span>
          </div>
        </div>

        {/* API Key Management */}
        {!hasApiKey && (
          <div className="max-w-md mx-auto">
            <ApiKeyManager onApiKeySet={() => setHasApiKey(true)} />
          </div>
        )}

        {/* Main Analyzer */}
        {hasApiKey && <WebsiteAnalyzer />}
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
          <p>© 2024 Website Growth Analyzer. Powered by expert PLG insights.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
