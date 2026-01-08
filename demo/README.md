# Learning Assistant MCP - Demo UI

A modern web interface to interact with the Learning Assistant MCP Server tools.

## Features

- 8 AI-powered learning tools:
  - 💡 **Explain Concept** - Get clear explanations with examples
  - 🔍 **Review Code** - Get constructive feedback on your code
  - ✨ **Best Practices** - Learn industry best practices
  - ⚖️ **Compare Approaches** - Compare different solutions
  - 🗺️ **Learning Path** - Get structured learning roadmaps
  - 🐛 **Debug Helper** - Understand and fix errors
  - 📖 **Explain Code** - Get detailed code explanations
  - ❓ **Quiz Me** - Test your knowledge with practice questions

## Local Development

### Prerequisites

- Node.js 16+
- Groq API Key (get one at https://console.groq.com)

### Setup

1. Install dependencies:
```bash
cd demo
npm install
```

2. Create a `.env` file:
```bash
cp env.example .env
```

3. Add your Groq API key to `.env`:
```
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile
```

4. Start the development server:
```bash
npm run dev
```

5. Open http://localhost:3456 in your browser

## Deploying to Vercel

### Method 1: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
cd demo
vercel
```

3. Add environment variables in Vercel dashboard:
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add `GROQ_API_KEY` with your API key
   - Add `GROQ_MODEL` with `llama-3.3-70b-versatile` (optional)

### Method 2: Deploy via Vercel Dashboard

1. Push your code to GitHub

2. Go to [Vercel Dashboard](https://vercel.com/dashboard)

3. Click "New Project"

4. Import your GitHub repository

5. Configure the project:
   - **Root Directory**: `demo`
   - **Framework Preset**: Other
   - **Build Command**: Leave empty or use `npm install`
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`

6. Add Environment Variables:
   - Click "Environment Variables"
   - Add `GROQ_API_KEY`: Your Groq API key
   - Add `GROQ_MODEL`: `llama-3.3-70b-versatile` (optional)

7. Click "Deploy"

### Environment Variables Required

| Variable | Description | Required |
|----------|-------------|----------|
| `GROQ_API_KEY` | Your Groq Cloud API key | Yes |
| `GROQ_MODEL` | Model to use (default: llama-3.3-70b-versatile) | No |

### Getting a Groq API Key

1. Go to https://console.groq.com
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and add it to your environment variables

## Tech Stack

- **Frontend**: HTML, CSS (Modern design with Geist font)
- **Backend**: Express.js
- **AI**: Groq Cloud API (llama-3.3-70b-versatile)

## Features

- ✅ Modern white and black theme
- ✅ Responsive design (mobile-friendly)
- ✅ Tab switching with automatic results clearing
- ✅ 8 different learning tools
- ✅ Real-time AI responses
- ✅ Clean, minimal interface

## API Endpoints

- `GET /` - Serves the web interface
- `POST /api/tool` - Processes tool requests

### Example API Request

```javascript
fetch('/api/tool', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    tool: 'explainConcept',
    params: {
      concept: 'closures',
      level: 'beginner',
      language: 'JavaScript'
    }
  })
})
```

## Security Notes

- Never commit `.env` files to version control
- The `.env` file is already in `.gitignore`
- Always use environment variables for API keys
- Rotate your API keys regularly

## Support

For issues or questions, please open an issue on GitHub.

## License

MIT

