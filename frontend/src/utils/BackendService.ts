// src/utils/BackendService.ts
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

export class BackendService {
  // Update this URL after deploying to Railway
  private static readonly API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? 'lovability-insight-engine-production.up.railway.app' // Update this after deployment
    : 'http://localhost:3001';

  static async analyzeWebsite(url: string): Promise<{ success: boolean; error?: string; data?: WebsiteAnalysis }> {
    try {
      console.log('Sending analysis request to backend:', url);
      
      const response = await fetch(`${this.API_BASE_URL}/api/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Backend API error:', response.status, errorData);
        return {
          success: false,
          error: errorData.error || `Request failed with status ${response.status}`
        };
      }

      const data = await response.json();
      
      if (!data.success) {
        return {
          success: false,
          error: data.error || 'Analysis failed'
        };
      }

      console.log('Backend analysis successful');
      return {
        success: true,
        data: data.data.analysis
      };

    } catch (error) {
      console.error('Error calling backend:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to connect to analysis service'
      };
    }
  }

  static async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/health`);
      return response.ok;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }
}