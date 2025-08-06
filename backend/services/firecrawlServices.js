// services/firecrawlService.js
const FirecrawlApp = require('@mendable/firecrawl-js').default;

const firecrawl = new FirecrawlApp({ 
  apiKey: process.env.FIRECRAWL_API_KEY 
});

async function scrapeWebsite(url) {
  try {
    console.log(`Scraping website: ${url}`);
    
    const scrapeResponse = await firecrawl.scrapeUrl(url, {
      formats: ['markdown', 'html'],
      includeTags: ['title', 'meta', 'h1', 'h2', 'h3', 'a', 'button', 'form', 'input'],
      onlyMainContent: true,
      timeout: 30000 // 30 second timeout
    });

    if (!scrapeResponse.success) {
      console.error('Firecrawl scrape failed:', scrapeResponse.error);
      return {
        success: false,
        error: scrapeResponse.error || 'Failed to scrape website'
      };
    }

    console.log('Firecrawl scrape successful');
    return {
      success: true,
      data: {
        markdown: scrapeResponse.markdown || '',
        html: scrapeResponse.html || '',
        metadata: scrapeResponse.metadata || {},
        url: url
      }
    };

  } catch (error) {
    console.error('Error in scrapeWebsite:', error);
    return {
      success: false,
      error: error.message || 'Failed to scrape website'
    };
  }
}

module.exports = {
  scrapeWebsite
};