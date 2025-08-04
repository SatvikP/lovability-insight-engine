import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Key, Eye, EyeOff } from "lucide-react";
import { FirecrawlService } from '@/utils/FirecrawlService';

interface ApiKeyManagerProps {
  onApiKeySet?: () => void;
}

export const ApiKeyManager = ({ onApiKeySet }: ApiKeyManagerProps) => {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [isSet, setIsSet] = useState(!!FirecrawlService.getApiKey());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const isValid = await FirecrawlService.testApiKey(apiKey);
      
      if (isValid) {
        FirecrawlService.saveApiKey(apiKey);
        setIsSet(true);
        toast({
          title: "Success",
          description: "API key saved and validated successfully",
          duration: 3000,
        });
        onApiKeySet?.();
      } else {
        toast({
          title: "Invalid API Key",
          description: "Please check your API key and try again",
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to validate API key",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    localStorage.removeItem('firecrawl_api_key');
    setIsSet(false);
    setApiKey('');
    toast({
      title: "API Key Cleared",
      description: "You'll need to enter a new API key to use the service",
      duration: 3000,
    });
  };

  if (isSet) {
    return (
      <Card className="border-success/20 bg-success/5">
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Key className="h-4 w-4 text-success" />
            <span className="text-sm text-success">API key configured</span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleClear}
            className="text-xs"
          >
            Clear
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-warning/20 bg-warning/5">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Key className="h-4 w-4 text-warning" />
          <CardTitle className="text-sm">API Key Required</CardTitle>
        </div>
        <CardDescription className="text-xs">
          Enter your Firecrawl API key to analyze websites. Get one at{' '}
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
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <Input
              type={showApiKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="fc-xxxxxxxxxxxxxxxx"
              className="pr-10"
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
              onClick={() => setShowApiKey(!showApiKey)}
            >
              {showApiKey ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
          <Button
            type="submit"
            disabled={isLoading || !apiKey.trim()}
            className="w-full"
          >
            {isLoading ? "Validating..." : "Save API Key"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};