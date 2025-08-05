# Security Guidelines

## API Key Security ⚠️

This application requires API keys from external services but handles them securely:

### ✅ What's Secure
- **No API keys in code**: Keys are never hardcoded in the source code
- **Client-side storage**: Keys are stored in browser localStorage only
- **User-provided**: Each user inputs their own API keys
- **No server transmission**: Keys never leave the user's browser
- **Validation**: Basic format validation before storage

### 🔑 Required API Keys

Users need to obtain their own API keys from:

1. **Firecrawl API**: Get at [firecrawl.dev](https://firecrawl.dev)
   - Format: `fc-xxxxxxxxxx`
   - Used for: Website content scraping

2. **Anthropic API**: Get at [console.anthropic.com](https://console.anthropic.com)
   - Format: `sk-ant-xxxxxxxxxx`
   - Used for: AI-powered website analysis

### 🛡️ Security Best Practices

**For Users:**
- Never share your API keys with others
- Use API keys with minimal required permissions
- Monitor your API usage regularly
- Clear keys from browser when done (optional)

**For Developers:**
- Never commit API keys to version control
- Use environment variables for any server-side keys (not applicable here)
- Validate API key formats before storage
- Implement rate limiting if needed

### 🚫 What NOT to Do

- ❌ Never put API keys in the source code
- ❌ Never commit `.env` files with keys
- ❌ Never share keys in public forums
- ❌ Never use production keys in development

### 🔄 Key Management

Users can:
- Add keys through the secure UI
- Clear keys anytime via the interface
- Keys are automatically validated before use
- Keys persist only in browser localStorage

## Deployment Security

This is a client-side application that can be safely deployed to:
- GitHub Pages
- Netlify
- Vercel
- Any static hosting service

No server-side secrets or environment variables needed.