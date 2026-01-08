# Learning Assistant MCP Server 🎓

An educational MCP (Model Context Protocol) server that helps developers learn, understand code, and improve their programming skills through AI-powered tools.

## Features 🚀

This MCP server provides 8 powerful learning tools:

1. **explainConcept** - Get simple explanations of programming concepts with examples
2. **reviewCode** - Get constructive feedback on your code with improvement suggestions
3. **suggestBestPractice** - Learn industry best practices for any programming task
4. **compareApproaches** - Compare different solutions and understand tradeoffs
5. **generateLearningPath** - Get a structured roadmap to learn any technology
6. **debugHelper** - Understand and fix errors with guided debugging help
7. **explainThisCode** - Get detailed explanations of how code works
8. **quizMe** - Test your knowledge with auto-generated practice questions

## Installation 📦

### Prerequisites

- Node.js 18.0.0 or higher
- Cursor IDE or any MCP-compatible client

### Setup

1. Clone this repository:
```bash
git clone https://github.com/YOUR_USERNAME/learning-assistant-mcp.git
cd learning-assistant-mcp
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

4. Configure your MCP client (e.g., Cursor IDE):

Add to your `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "learning-assistant": {
      "command": "node",
      "args": [
        "/absolute/path/to/learning-assistant-mcp/dist/index.js"
      ]
    }
  }
}
```

Replace `/absolute/path/to/learning-assistant-mcp` with the actual path where you cloned the repository.

5. Restart Cursor IDE

## Usage 💡

Once installed, you can use the tools in Cursor Chat:

### Example Prompts

- "Explain what closures are in JavaScript for a beginner"
- "Review this code and suggest improvements"
- "What are the best practices for error handling in React?"
- "Compare REST API vs GraphQL"
- "Create a learning path to master TypeScript"
- "Help me debug this error: Cannot read property 'map' of undefined"
- "Explain what this regex pattern does: /^[a-z]+$/i"
- "Quiz me on JavaScript async/await with 5 questions"

## Development 🛠️

```bash
# Run in development mode
npm run dev

# Build TypeScript
npm run build

# Run the built server
npm start
```

## Project Structure 📁

```
learning-assistant-mcp/
├── src/
│   └── index.ts          # Main server implementation
├── dist/                 # Compiled JavaScript (generated)
├── package.json
├── tsconfig.json
└── README.md
```

## Tools Reference 📚

### explainConcept
Explains programming concepts in beginner-friendly terms.

**Parameters:**
- `concept` (string): The concept to explain
- `level` (optional): "beginner" | "intermediate" | "advanced"
- `language` (optional): Programming language context

### reviewCode
Reviews code and provides constructive feedback.

**Parameters:**
- `code` (string): Code to review
- `language` (string): Programming language
- `context` (optional): What the code should do
- `focusAreas` (optional): Array of focus areas

### suggestBestPractice
Suggests best practices for programming tasks.

**Parameters:**
- `task` (string): The task or area
- `technology` (optional): Specific framework/library
- `currentApproach` (optional): Your current approach

### compareApproaches
Compares different programming approaches.

**Parameters:**
- `problem` (string): The problem to solve
- `approaches` (array): List of approaches to compare
- `criteria` (optional): Comparison criteria

### generateLearningPath
Creates structured learning roadmaps.

**Parameters:**
- `topic` (string): What to learn
- `currentLevel`: Your current level
- `goalLevel`: Target proficiency
- `timeCommitment` (optional): Available time

### debugHelper
Helps debug errors and bugs.

**Parameters:**
- `error` (string): Error message or bug description
- `code` (optional): Relevant code
- `language` (optional): Programming language
- `context` (optional): What you were doing

### explainThisCode
Provides detailed code explanations.

**Parameters:**
- `code` (string): Code to explain
- `language` (string): Programming language
- `detailLevel` (optional): "overview" | "detailed" | "line-by-line"

### quizMe
Generates practice questions.

**Parameters:**
- `topic` (string): Topic to quiz on
- `difficulty` (optional): "easy" | "medium" | "hard"
- `questionCount` (optional): Number of questions (1-10)
- `questionType` (optional): Type of questions

## Contributing 🤝

Contributions are welcome! Please feel free to submit a Pull Request.

## License 📄

MIT License - see LICENSE file for details

## Author ✨

Muhammad Yasir Khan

## Support 💬

If you have questions or need help, please open an issue on GitHub.

