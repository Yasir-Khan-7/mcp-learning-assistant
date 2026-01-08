import express from 'express';
import cors from 'cors';
import Groq from 'groq-sdk';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname, 'public')));

// Check for required environment variables
if (!process.env.GROQ_API_KEY) {
  console.error('ERROR: GROQ_API_KEY environment variable is required');
  console.error('Please set it in your .env file or environment variables');
  process.exit(1);
}

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
console.log(`Using Groq model: ${MODEL}`);

// Tool system prompts
const toolPrompts = {
  explainConcept: (concept, level, language) => `You are a programming teacher. Explain the concept of "${concept}" at a ${level} level${language ? ` using ${language} examples` : ''}.

Provide your response in this JSON format:
{
  "summary": "A clear, concise explanation",
  "keyPoints": ["Point 1", "Point 2", "Point 3"],
  "analogy": "A real-world analogy",
  "codeExample": "A simple code example if applicable",
  "commonMistakes": ["Mistake 1", "Mistake 2"],
  "relatedConcepts": ["Related concept 1", "Related concept 2"],
  "practiceExercise": "A simple exercise to practice"
}`,

  reviewCode: (code, language, context, focusAreas) => `You are a senior code reviewer. Review this ${language} code${context ? ` that is supposed to ${context}` : ''}.
${focusAreas?.length ? `Focus on: ${focusAreas.join(', ')}` : ''}

Code to review:
\`\`\`${language}
${code}
\`\`\`

Provide your response in this JSON format:
{
  "overallAssessment": "Brief overall assessment",
  "isCorrect": true/false,
  "strengths": ["Strength 1", "Strength 2"],
  "improvements": ["Improvement 1 with explanation", "Improvement 2"],
  "securityConcerns": ["Security issue if any"],
  "performanceNotes": ["Performance note if any"],
  "refactoredCode": "Improved version of the code",
  "learningResources": ["Resource 1", "Resource 2"]
}`,

  suggestBestPractice: (task, technology, currentApproach) => `You are a software architecture expert. Suggest best practices for "${task}"${technology ? ` using ${technology}` : ''}.
${currentApproach ? `Current approach: ${currentApproach}` : ''}

Provide your response in this JSON format:
{
  "practices": [
    {
      "practice": "Best practice name",
      "why": "Explanation of importance",
      "example": "Code or implementation example"
    }
  ],
  "antiPatterns": ["Anti-pattern 1", "Anti-pattern 2"],
  "resources": ["Learning resource 1", "Learning resource 2"]
}`,

  compareApproaches: (problem, approaches, criteria) => `You are a technical architect. Compare these approaches to solve: "${problem}"
Approaches: ${approaches.join(', ')}
${criteria?.length ? `Criteria: ${criteria.join(', ')}` : ''}

Provide your response in this JSON format:
{
  "comparison": [
    {
      "approach": "Approach name",
      "pros": ["Pro 1", "Pro 2"],
      "cons": ["Con 1", "Con 2"],
      "bestFor": "Best use case scenario",
      "complexity": "low/medium/high"
    }
  ],
  "recommendation": "Your recommendation",
  "tradeoffs": "Key tradeoffs explanation"
}`,

  generateLearningPath: (topic, currentLevel, goalLevel, timeCommitment) => `You are a learning coach. Create a learning path for "${topic}".
Current level: ${currentLevel}
Goal level: ${goalLevel}
${timeCommitment ? `Time commitment: ${timeCommitment}` : ''}

Provide your response in this JSON format:
{
  "estimatedDuration": "Estimated time to complete",
  "phases": [
    {
      "name": "Phase name",
      "duration": "Time for this phase",
      "objectives": ["Objective 1", "Objective 2"],
      "topics": ["Topic 1", "Topic 2"],
      "projects": ["Project 1", "Project 2"],
      "resources": ["Resource 1", "Resource 2"]
    }
  ],
  "milestones": ["Milestone 1", "Milestone 2"],
  "tips": ["Tip 1", "Tip 2"]
}`,

  debugHelper: (error, code, language, context) => `You are a debugging expert. Help debug this error: "${error}"
${language ? `Language: ${language}` : ''}
${context ? `Context: ${context}` : ''}
${code ? `Code:\n\`\`\`\n${code}\n\`\`\`` : ''}

Provide your response in this JSON format:
{
  "errorType": "Type of error",
  "likelyCause": "Most likely cause",
  "explanation": "Simple explanation of what went wrong",
  "solutions": [
    {
      "solution": "Step-by-step solution",
      "code": "Fixed code if applicable",
      "explanation": "Why this fix works"
    }
  ],
  "preventionTips": ["Prevention tip 1", "Prevention tip 2"],
  "relatedErrors": ["Similar error 1", "Similar error 2"]
}`,

  explainThisCode: (code, language, detailLevel) => `You are a code explainer. Explain this ${language} code at ${detailLevel} level:

\`\`\`${language}
${code}
\`\`\`

Provide your response in this JSON format:
{
  "overview": "High-level summary",
  "breakdown": [
    {
      "section": "Section name",
      "code": "Relevant code snippet",
      "explanation": "What this does and why"
    }
  ],
  "concepts": ["Concept used 1", "Concept used 2"],
  "keyTakeaways": ["Takeaway 1", "Takeaway 2"]
}`,

  quizMe: (topic, difficulty, questionCount, questionType) => `You are a quiz master. Generate ${questionCount} ${difficulty} ${questionType} questions about "${topic}".

Provide your response in this JSON format:
{
  "questions": [
    {
      "id": 1,
      "type": "multiple-choice/true-false/code-output/fill-blank",
      "question": "The question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "The correct answer",
      "explanation": "Why this is correct"
    }
  ],
  "studyTips": ["Study tip 1", "Study tip 2"]
}`
};

// API endpoint for tool execution
app.post('/api/tool', async (req, res) => {
  try {
    const { tool, params } = req.body;
    
    let systemPrompt;
    switch (tool) {
      case 'explainConcept':
        systemPrompt = toolPrompts.explainConcept(params.concept, params.level || 'beginner', params.language);
        break;
      case 'reviewCode':
        systemPrompt = toolPrompts.reviewCode(params.code, params.language, params.context, params.focusAreas);
        break;
      case 'suggestBestPractice':
        systemPrompt = toolPrompts.suggestBestPractice(params.task, params.technology, params.currentApproach);
        break;
      case 'compareApproaches':
        systemPrompt = toolPrompts.compareApproaches(params.problem, params.approaches, params.criteria);
        break;
      case 'generateLearningPath':
        systemPrompt = toolPrompts.generateLearningPath(params.topic, params.currentLevel, params.goalLevel, params.timeCommitment);
        break;
      case 'debugHelper':
        systemPrompt = toolPrompts.debugHelper(params.error, params.code, params.language, params.context);
        break;
      case 'explainThisCode':
        systemPrompt = toolPrompts.explainThisCode(params.code, params.language, params.detailLevel || 'detailed');
        break;
      case 'quizMe':
        systemPrompt = toolPrompts.quizMe(params.topic, params.difficulty || 'medium', params.questionCount || 5, params.questionType || 'mixed');
        break;
      default:
        return res.status(400).json({ error: 'Unknown tool' });
    }

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: 'Generate the response in the specified JSON format. Only respond with valid JSON, no additional text.' }
      ],
      model: MODEL,
      temperature: 0.7,
      max_tokens: 4096,
      response_format: { type: 'json_object' }
    });

    const content = completion.choices[0]?.message?.content;
    let result;
    try {
      result = JSON.parse(content);
    } catch {
      result = { raw: content };
    }

    res.json({ 
      success: true, 
      result,
      usage: completion.usage
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', model: MODEL });
});

const PORT = process.env.PORT || 3456;
app.listen(PORT, () => {
  console.log(`🚀 Learning Assistant Demo running at http://localhost:${PORT}`);
});

