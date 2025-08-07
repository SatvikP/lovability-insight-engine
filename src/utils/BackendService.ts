// src/utils/BackendService.ts - Fixed version for Lovable frontend
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
  // Fixed Railway URL - no environment check needed
  private static readonly API_BASE_URL = 'https://lovability-insight-engine-production.up.railway.app';

  static async analyzeWebsite(url: string): Promise<{ success: boolean; error?: string; data?: WebsiteAnalysis }> {
    try {
      const apiUrl = `${this.API_BASE_URL}/api/analyze`;
      console.log('🔗 Calling backend:', apiUrl);
      console.log('📝 Analyzing URL:', url);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
        // Add these for better compatibility
        mode: 'cors',
        credentials: 'omit'
      });

      console.log('📡 Response status:', response.status);
      console.log('✅ Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Backend error:', response.status, errorText);
        return {
          success: false,
          error: `Backend returned ${response.status}: ${errorText}`
        };
      }

      const data = await response.json();
      console.log('📊 Backend response:', data);
      
      if (!data.success) {
        return {
          success: false,
          error: data.error || 'Analysis failed'
        };
      }

      return {
        success: true,
        data: data.data.analysis
      };

    } catch (error) {
      console.error('❌ Frontend fetch error:', error);
      
      // More specific error handling
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        return {
          success: false,
          error: 'Unable to connect to analysis service. Please check your internet connection.'
        };
      }
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to connect to analysis service'
      };
    }
  }

  static async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/health`, {
        mode: 'cors',
        credentials: 'omit'
      });
      return response.ok;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }
}