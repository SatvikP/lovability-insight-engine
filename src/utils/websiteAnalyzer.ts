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

export function analyzeWebsiteContent(data: any): WebsiteAnalysis {
  const content = data?.markdown || '';
  const html = data?.html || '';
  const metadata = data?.metadata || {};
  
  // Mock analysis - in a real app, this would use AI/ML
  const onboardingAnalysis = analyzeOnboarding(content, html, metadata);
  const uxAnalysis = analyzeUX(content, html, metadata);
  const growthAnalysis = analyzeGrowth(content, html, metadata);
  
  const overallScore = Math.round((onboardingAnalysis.score + uxAnalysis.score + growthAnalysis.score) / 3);
  
  return {
    onboarding: onboardingAnalysis,
    ux: uxAnalysis,
    growth: growthAnalysis,
    overall: {
      score: overallScore,
      summary: generateOverallSummary(overallScore)
    }
  };
}

function analyzeOnboarding(content: string, html: string, metadata: any) {
  const issues: string[] = [];
  const suggestions: string[] = [];
  let score = 85;

  // Check for clear value proposition
  if (!content.toLowerCase().includes('get started') && !content.toLowerCase().includes('sign up')) {
    issues.push('Missing clear call-to-action above the fold');
    suggestions.push('Add a prominent "Get Started" or "Sign Up" button in the hero section');
    score -= 15;
  }

  // Check for social proof
  if (!content.toLowerCase().includes('customer') && !content.toLowerCase().includes('testimonial')) {
    issues.push('Limited social proof visible');
    suggestions.push('Add customer testimonials or logos to build trust');
    score -= 10;
  }

  // Check for multiple CTAs
  const ctaCount = (content.match(/sign up|get started|try free|start trial/gi) || []).length;
  if (ctaCount < 2) {
    issues.push('Few call-to-action buttons throughout the page');
    suggestions.push('Add multiple CTAs throughout the page journey');
    score -= 10;
  }

  return { score: Math.max(0, score), issues, suggestions };
}

function analyzeUX(content: string, html: string, metadata: any) {
  const issues: string[] = [];
  const suggestions: string[] = [];
  let score = 80;

  // Check for navigation clarity
  if (!html.includes('<nav') && !content.toLowerCase().includes('menu')) {
    issues.push('Navigation structure unclear');
    suggestions.push('Add clear navigation menu with logical hierarchy');
    score -= 15;
  }

  // Check for mobile responsiveness indicators
  if (!html.includes('viewport') && !html.includes('responsive')) {
    issues.push('Mobile optimization concerns');
    suggestions.push('Ensure responsive design for mobile users');
    score -= 20;
  }

  // Check for form complexity
  const formFields = (html.match(/<input/g) || []).length;
  if (formFields > 5) {
    issues.push('Forms may be too complex');
    suggestions.push('Simplify forms to reduce friction');
    score -= 10;
  }

  return { score: Math.max(0, score), issues, suggestions };
}

function analyzeGrowth(content: string, html: string, metadata: any) {
  const issues: string[] = [];
  const suggestions: string[] = [];
  let score = 75;

  // Check for lead magnets
  if (!content.toLowerCase().includes('free') && !content.toLowerCase().includes('download')) {
    issues.push('No visible lead magnets or free offerings');
    suggestions.push('Add lead magnets like free guides, trials, or tools');
    score -= 15;
  }

  // Check for email capture
  if (!html.includes('email') && !content.toLowerCase().includes('newsletter')) {
    issues.push('Limited email capture opportunities');
    suggestions.push('Add newsletter signup or email capture forms');
    score -= 20;
  }

  // Check for urgency/scarcity
  if (!content.toLowerCase().includes('limited') && !content.toLowerCase().includes('exclusive')) {
    issues.push('No urgency or scarcity elements');
    suggestions.push('Add limited-time offers or exclusive access to create urgency');
    score -= 10;
  }

  return { score: Math.max(0, score), issues, suggestions };
}

function generateOverallSummary(score: number): string {
  if (score >= 90) return "Excellent! Your website follows PLG best practices with strong conversion potential.";
  if (score >= 80) return "Good foundation with room for optimization. Focus on the highlighted areas for improvement.";
  if (score >= 70) return "Decent start but several areas need attention to maximize growth potential.";
  return "Significant improvements needed to optimize for product-led growth.";
}