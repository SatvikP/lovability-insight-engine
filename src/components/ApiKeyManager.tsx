// src/components/ApiKeyManager.tsx
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Key, Eye, EyeOff } from "lucide-react";
import { FirecrawlService } from '@/utils/FirecrawlService';
import { AnthropicService } from '@/utils/AnthropicService';

interface ApiKeyManagerProps {
  onApiKeySet?: () => void;
}

export const ApiKeyManager = ({ onApiKeySet }: ApiKeyManagerProps) => {
  const { toast } = useToast();
  const [firecrawlKey, setFirecrawlKey] = useState('');
  const [anthropicKey, setAnthropicKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showFirecrawlKey, setShowFirecrawlKey] = useState(false);
  const [showAnthropicKey, setShowAnthropicKey] = useState(false);
  const [firecrawlSet, setFirecrawlSet] = useState(!!FirecrawlService.getApiKey());
  const [anthropicSet, setAnthropicSet] = useState(!!AnthropicService.getApiKey());

  const handleFirecrawlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Basic validation
      if (!firecrawlKey.startsWith('fc-')) {
        toast({
          title: "Invalid Format",
          description: "Firecrawl API key should start with 'fc-'",
          variant: "destructive",
          duration: 3000,
        });
        setIsLoading(false);
        return;
      }

      const isValid = await FirecrawlService.testApiKey(firecrawlKey);
      
      if (isValid) {
        FirecrawlService.saveApiKey(firecrawlKey);
        setFirecrawlSet(true);
        setFirecrawlKey(''); // Clear input for security
        toast({
          title: "Success",
          description: "Firecrawl API key saved securely in browser",
          duration: 3000,
        });
        checkBothKeys();
      } else {
        toast({
          title: "Invalid Firecrawl API Key",
          description: "Please check your API key and try again",
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to validate Firecrawl API key",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnthropicSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Basic validation - Updated for correct Anthropic format
      if (!anthropicKey.startsWith('sk-ant-api03-') && !anthropicKey.startsWith('sk-ant-')) {
        toast({
          title: "Invalid Format",
          description: "Anthropic API key should start with 'sk-ant-api03-'",
          variant: "destructive",
          duration: 3000,
        });
        setIsLoading(false);
        return;
      }

      const isValid = await AnthropicService.testApiKey(anthropicKey);
      
      if (isValid) {
        AnthropicService.saveApiKey(anthropicKey);
        setAnthropicSet(true);
        setAnthropicKey(''); // Clear input for security
        toast({
          title: "Success",
          description: "Anthropic API key saved securely in browser",
          duration: 3000,
        });
        checkBothKeys();
      } else {
        toast({
          title: "Invalid Anthropic API Key",
          description: "Please check your API key and try again",
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to validate Anthropic API key",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const checkBothKeys = () => {
    if (firecrawlSet && anthropicSet) {
      onApiKeySet?.();
    }
  };

  const handleClearFirecrawl = () => {
    localStorage.removeItem('firecrawl_api_key');
    setFirecrawlSet(false);
    setFirecrawlKey('');
    toast({
      title: "Firecrawl API Key Cleared",
      description: "You'll need to enter a new key to scrape websites",
      duration: 3000,
    });
  };

  const handleClearAnthropic = () => {
    localStorage.removeItem('anthropic_api_key');
    setAnthropicSet(false);
    setAnthropicKey('');
    toast({
      title: "Anthropic API Key Cleared",
      description: "You'll need to enter a new key to analyze websites",
      duration: 3000,
    });
  };

  if (firecrawlSet && anthropicSet) {
    return (
      <Card className="border-success/20 bg-success/5">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Key className="h-4 w-4 text-success" />
              <span className="text-sm text-success">Firecrawl API configured</span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleClearFirecrawl}
              className="text-xs"
            >
              Clear
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Key className="h-4 w-4 text-success" />
              <span className="text-sm text-success">Anthropic API configured</span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleClearAnthropic}
              className="text-xs"
            >
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Firecrawl API Key */}
      {!firecrawlSet && (
        <Card className="border-warning/20 bg-warning/5">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Key className="h-4 w-4 text-warning" />
              <CardTitle className="text-sm">Firecrawl API Key Required</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Enter your Firecrawl API key to scrape websites. Get one at{' '}
              <a 
                href="https://firecrawl.dev" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                firecrawl.dev
              </a>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFirecrawlSubmit} className="space-y-3">
              <div className="relative">
                <Input
                  type={showFirecrawlKey ? "text" : "password"}
                  value={firecrawlKey}
                  onChange={(e) => setFirecrawlKey(e.target.value)}
                  placeholder="fc-xxxxxxxxxxxxxxxx"
                  className="pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowFirecrawlKey(!showFirecrawlKey)}
                >
                  {showFirecrawlKey ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <Button
                type="submit"
                disabled={isLoading || !firecrawlKey.trim()}
                className="w-full"
              >
                {isLoading ? "Validating..." : "Save Firecrawl Key"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Anthropic API Key */}
      {!anthropicSet && (
        <Card className="border-warning/20 bg-warning/5">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Key className="h-4 w-4 text-warning" />
              <CardTitle className="text-sm">Anthropic API Key Required</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Enter your Anthropic API key to analyze websites with AI. Get one at{' '}
              <a 
                href="https://console.anthropic.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                console.anthropic.com
              </a>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAnthropicSubmit} className="space-y-3">
              <div className="relative">
                <Input
                  type={showAnthropicKey ? "text" : "password"}
                  value={anthropicKey}
                  onChange={(e) => setAnthropicKey(e.target.value)}
                  placeholder="sk-ant-xxxxxxxxxxxxxxxx"
                  className="pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowAnthropicKey(!showAnthropicKey)}
                >
                  {showAnthropicKey ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <Button
                type="submit"
                disabled={isLoading || !anthropicKey.trim()}
                className="w-full"
              >
                {isLoading ? "Validating..." : "Save Anthropic Key"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};