// services/anthropicService.js
const fetch = require('node-fetch');

async function analyzeWithAI(websiteData) {
  try {
    const { markdown, html, metadata } = websiteData;
    
    console.log('Creating analysis prompt...');
    const prompt = createGrowthAnalysisPrompt(markdown, html, metadata);
    
    console.log('Calling Anthropic API...');
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 2000,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Anthropic API error:', response.status, errorText);
      return {
        success: false,
        error: `API request failed: ${response.status}`
      };
    }

    const data = await response.json();
    const analysisText = data.content[0]?.text;

    if (!analysisText) {
      return {
        success: false,
        error: 'No analysis content received from AI'
      };
    }

    console.log('Parsing AI response...');
    const analysis = parseAnalysisResponse(analysisText);
    
    return {
      success: true,
      data: analysis
    };

  } catch (error) {
    console.error('Error in analyzeWithAI:', error);
    return {
      success: false,
      error: error.message || 'AI analysis failed'
    };
  }
}

function createGrowthAnalysisPrompt(content, html, metadata) {
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

function parseAnalysisResponse(responseText) {
  try {
    // Clean up the response text to extract JSON
    let jsonText = responseText.trim();
    
    // Remove any markdown code blocks if present
    jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    const analysis = JSON.parse(jsonText);
    
    // Validate and provide defaults
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
        summary: analysis.overall?.summary || "Analysis completed successfully."
      }
    };
  } catch (error) {
    console.error('Error parsing AI response:', error);
    // Return fallback analysis
    return {
      onboarding: { score: 50, issues: ["Analysis parsing failed"], suggestions: ["Please try again"] },
      ux: { score: 50, issues: ["Analysis parsing failed"], suggestions: ["Please try again"] },
      growth: { score: 50, issues: ["Analysis parsing failed"], suggestions: ["Please try again"] },
      overall: { score: 50, summary: "Analysis failed to parse. Please try again." }
    };
  }
}

module.exports = {
  analyzeWithAI
};