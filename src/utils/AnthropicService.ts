// src/utils/AnthropicService.ts
export interface WebsiteAnalysis {
  onboarding: {
    score: number;
    issues: string[];
    suggestions: string[];
  };
  ux: {
    score: number;
    issues: string[];
    suggestions: string[];
  };
  growth: {
    score: number;
    issues: string[];
    suggestions: string[];
  };
  overall: {
    score: number;
    summary: string;
  };
}

export class AnthropicService {
  private static API_KEY_STORAGE_KEY = 'anthropic_api_key';

  static saveApiKey(apiKey: string): void {
    // Basic validation - Anthropic keys start with sk-ant-api03-
    if (!apiKey.startsWith('sk-ant-api03-') && !apiKey.startsWith('sk-ant-')) {
      throw new Error('Invalid Anthropic API key format');
    }
    
    // Store in localStorage (browser-only, never in code)
    localStorage.setItem(this.API_KEY_STORAGE_KEY, apiKey);
    console.log('Anthropic API key saved securely in browser storage');
  }

  static getApiKey(): string | null {
    return localStorage.getItem(this.API_KEY_STORAGE_KEY);
  }

  static async testApiKey(apiKey: string): Promise<boolean> {
    try {
      console.log('Testing Anthropic API key...');
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
          model: "claude-3-sonnet-20240229",
          max_tokens: 100,
          messages: [{
            role: "user",
            content: "Hello, this is a test message. Please respond with 'API key is working'."
          }]
        })
      });

      console.log('API response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API test failed:', response.status, errorText);
        return false;
      }

      const data = await response.json();
      console.log('API test successful:', data);
      return data.content && data.content[0]?.text;
    } catch (error) {
      console.error('Error testing Anthropic API key:', error);
      return false;
    }
  }

  static async analyzeWebsite(websiteData: any): Promise<{ success: boolean; error?: string; data?: WebsiteAnalysis }> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      return { success: false, error: 'Anthropic API key not found' };
    }

    try {
      const content = websiteData?.markdown || '';
      const html = websiteData?.html || '';
      const metadata = websiteData?.metadata || {};

      const prompt = this.createGrowthAnalysisPrompt(content, html, metadata);

      console.log('Making analysis request to Anthropic API');
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2000,
          messages: [{
            role: "user",
            content: prompt
          }]
        })
      });

      if (!response.ok) {
        console.error('Anthropic API request failed:', response.status);
        return { 
          success: false, 
          error: `API request failed with status ${response.status}` 
        };
      }

      const data = await response.json();
      const analysisText = data.content[0]?.text;

      if (!analysisText) {
        return { success: false, error: 'No analysis content received' };
      }

      // Parse the JSON response from Claude
      const analysis = this.parseAnalysisResponse(analysisText);
      
      console.log('Analysis successful:', analysis);
      return { 
        success: true,
        data: analysis 
      };
    } catch (error) {
      console.error('Error during analysis:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to analyze website' 
      };
    }
  }

  private static createGrowthAnalysisPrompt(content: string, html: string, metadata: any): string {
    return `You are a Growth 101 expert analyzing a website for user acquisition, retention, and conversion optimization. 

WEBSITE DATA:
Content: ${content.slice(0, 3000)}
HTML Structure: ${html.slice(0, 1000)}
Metadata: ${JSON.stringify(metadata)}

Analyze this website based on Growth 101 principles and provide scores (0-100) for:

1. **ONBOARDING** - How easy is it for new users to get started?
   - Clear value proposition above the fold
   - Obvious primary call-to-action
   - Minimal friction in signup/trial process
   - Social proof and trust signals

2. **UX/UI** - How user-friendly is the experience?
   - Navigation clarity and structure
   - Mobile responsiveness indicators
   - Page loading and performance signals
   - Visual hierarchy and readability

3. **GROWTH POTENTIAL** - How well optimized for growth loops?
   - Lead magnets and free value
   - Email capture opportunities
   - Viral/sharing mechanisms
   - Urgency and scarcity elements

RESPOND ONLY WITH VALID JSON in this exact format:
{
  "onboarding": {
    "score": 85,
    "issues": ["Missing clear CTA above fold", "No social proof visible"],
    "suggestions": ["Add prominent signup button in hero", "Include customer testimonials"]
  },
  "ux": {
    "score": 75,
    "issues": ["Navigation unclear", "No mobile optimization"],
    "suggestions": ["Simplify main navigation", "Add responsive design"]
  },
  "growth": {
    "score": 60,
    "issues": ["No lead magnets", "Limited email capture"],
    "suggestions": ["Add free resource download", "Include newsletter signup"]
  },
  "overall": {
    "score": 73,
    "summary": "Good foundation but needs optimization in growth mechanisms and mobile experience."
  }
}

DO NOT include any text outside the JSON structure.`;
  }

  private static parseAnalysisResponse(responseText: string): WebsiteAnalysis {
    try {
      // Clean up the response text to extract JSON
      let jsonText = responseText.trim();
      
      // Remove any markdown code blocks if present
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      
      const analysis = JSON.parse(jsonText);
      
      // Validate the structure and provide defaults if needed
      return {
        onboarding: {
          score: analysis.onboarding?.score || 50,
          issues: analysis.onboarding?.issues || [],
          suggestions: analysis.onboarding?.suggestions || []
        },
        ux: {
          score: analysis.ux?.score || 50,
          issues: analysis.ux?.issues || [],
          suggestions: analysis.ux?.suggestions || []
        },
        growth: {
          score: analysis.growth?.score || 50,
          issues: analysis.growth?.issues || [],
          suggestions: analysis.growth?.suggestions || []
        },
        overall: {
          score: analysis.overall?.score || Math.round((
            (analysis.onboarding?.score || 50) + 
            (analysis.ux?.score || 50) + 
            (analysis.growth?.score || 50)
          ) / 3),
          summary: analysis.overall?.summary || "Analysis completed with basic scoring."
        }
      };
    } catch (error) {
      console.error('Error parsing analysis response:', error);
      // Return fallback analysis
      return {
        onboarding: { score: 50, issues: ["Analysis parsing failed"], suggestions: ["Please try again"] },
        ux: { score: 50, issues: ["Analysis parsing failed"], suggestions: ["Please try again"] },
        growth: { score: 50, issues: ["Analysis parsing failed"], suggestions: ["Please try again"] },
        overall: { score: 50, summary: "Analysis failed to parse. Please try again." }
      };
    }
  }
}