// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Import services
const { scrapeWebsite } = require('./services/firecrawlServices.js');
const { analyzeWithAI } = require('./services/anthropicServices.js');

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'Website Analyzer API'
  });
});

// Main analysis endpoint
app.post('/api/analyze', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        error: 'URL is required'
      });
    }

    console.log(`Starting analysis for: ${url}`);

    // Step 1: Scrape the website
    console.log('Step 1: Scraping website...');
    const scrapeResult = await scrapeWebsite(url);
    
    if (!scrapeResult.success) {
      return res.status(400).json({
        success: false,
        error: `Failed to scrape website: ${scrapeResult.error}`
      });
    }

    console.log('Step 2: Analyzing with AI...');
    // Step 2: Analyze with AI
    const analysisResult = await analyzeWithAI(scrapeResult.data);
    
    if (!analysisResult.success) {
      return res.status(500).json({
        success: false,
        error: `AI analysis failed: ${analysisResult.error}`
      });
    }

    console.log('Analysis completed successfully');
    
    // Return the complete analysis
    res.json({
      success: true,
      data: {
        url: url,
        analysis: analysisResult.data,
        scrapedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error in /api/analyze:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Something went wrong!'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  
  // Verify environment variables
  if (!process.env.FIRECRAWL_API_KEY) {
    console.warn('⚠️  FIRECRAWL_API_KEY not found in environment variables');
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn('⚠️  ANTHROPIC_API_KEY not found in environment variables');
  }
});