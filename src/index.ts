#!/usr/bin/env node

/**
 * Learning Assistant MCP Server
 * 
 * An educational MCP server that helps developers learn, understand code,
 * get feedback on their approaches, and discover best practices.
 * 
 * Tools provided:
 * - explainConcept: Explains programming concepts in simple terms
 * - reviewCode: Reviews code and provides feedback on correctness and improvements
 * - suggestBestPractice: Suggests best practices for a given task or technology
 * - compareApproaches: Compares different approaches to solve a problem
 * - generateLearningPath: Creates a structured learning path for a topic
 * - debugHelper: Helps understand and fix errors/bugs
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

// ============================================================================
// Server Configuration
// ============================================================================

const server = new McpServer({
  name: 'learning-assistant',
  version: '1.0.0',
});

// ============================================================================
// Tool Definitions
// ============================================================================

/**
 * Tool 1: Explain Concept
 * Explains programming concepts in simple, beginner-friendly terms
 */
server.tool(
  'explainConcept',
  'Explains a programming concept in simple, beginner-friendly terms with examples',
  {
    concept: z.string().describe('The programming concept to explain (e.g., "closures", "async/await", "REST API")'),
    level: z.enum(['beginner', 'intermediate', 'advanced']).optional().describe('The complexity level of the explanation'),
    language: z.string().optional().describe('Programming language context (e.g., "JavaScript", "Python")'),
  },
  async ({ concept, level = 'beginner', language }) => {
    const explanation = generateConceptExplanation(concept, level, language);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(explanation, null, 2),
        },
      ],
    };
  }
);

/**
 * Tool 2: Review Code
 * Reviews code snippets and provides constructive feedback
 */
server.tool(
  'reviewCode',
  'Reviews a code snippet and provides feedback on correctness, style, and potential improvements',
  {
    code: z.string().describe('The code snippet to review'),
    language: z.string().describe('The programming language of the code'),
    context: z.string().optional().describe('What the code is supposed to do'),
    focusAreas: z.array(z.enum(['correctness', 'performance', 'readability', 'security', 'best-practices'])).optional()
      .describe('Specific areas to focus the review on'),
  },
  async ({ code, language, context, focusAreas }) => {
    const review = generateCodeReview(code, language, context, focusAreas);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(review, null, 2),
        },
      ],
    };
  }
);

/**
 * Tool 3: Suggest Best Practice
 * Provides best practice recommendations for specific tasks or technologies
 */
server.tool(
  'suggestBestPractice',
  'Suggests best practices for a specific programming task, pattern, or technology',
  {
    task: z.string().describe('The task or area to get best practices for (e.g., "error handling", "API design", "state management")'),
    technology: z.string().optional().describe('The specific technology or framework context'),
    currentApproach: z.string().optional().describe('Your current approach to get specific improvement suggestions'),
  },
  async ({ task, technology, currentApproach }) => {
    const suggestions = generateBestPractices(task, technology, currentApproach);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(suggestions, null, 2),
        },
      ],
    };
  }
);

/**
 * Tool 4: Compare Approaches
 * Compares different approaches to solving a problem
 */
server.tool(
  'compareApproaches',
  'Compares multiple approaches to solve a programming problem, listing pros and cons of each',
  {
    problem: z.string().describe('The problem or task to solve'),
    approaches: z.array(z.string()).min(2).describe('Array of different approaches to compare'),
    criteria: z.array(z.string()).optional().describe('Specific criteria to compare against (e.g., ["performance", "maintainability"])'),
  },
  async ({ problem, approaches, criteria }) => {
    const comparison = generateApproachComparison(problem, approaches, criteria);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(comparison, null, 2),
        },
      ],
    };
  }
);

/**
 * Tool 5: Generate Learning Path
 * Creates a structured learning path for a topic
 */
server.tool(
  'generateLearningPath',
  'Creates a structured learning path with steps, resources, and milestones for learning a topic',
  {
    topic: z.string().describe('The topic or skill to learn (e.g., "React", "System Design", "TypeScript")'),
    currentLevel: z.enum(['complete-beginner', 'some-experience', 'intermediate', 'advanced']).describe('Your current experience level'),
    goalLevel: z.enum(['basic-understanding', 'working-knowledge', 'proficient', 'expert']).describe('Your target proficiency level'),
    timeCommitment: z.enum(['1-hour-daily', '2-3-hours-daily', 'full-time']).optional().describe('How much time you can dedicate'),
  },
  async ({ topic, currentLevel, goalLevel, timeCommitment }) => {
    const learningPath = generateLearningPath(topic, currentLevel, goalLevel, timeCommitment);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(learningPath, null, 2),
        },
      ],
    };
  }
);

/**
 * Tool 6: Debug Helper
 * Helps understand and fix errors or bugs
 */
server.tool(
  'debugHelper',
  'Analyzes an error message or bug description and provides debugging guidance',
  {
    error: z.string().describe('The error message or bug description'),
    code: z.string().optional().describe('The relevant code that produced the error'),
    language: z.string().optional().describe('The programming language'),
    context: z.string().optional().describe('What you were trying to do when the error occurred'),
  },
  async ({ error, code, language, context }) => {
    const debugInfo = generateDebugHelp(error, code, language, context);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(debugInfo, null, 2),
        },
      ],
    };
  }
);

/**
 * Tool 7: Explain This Code
 * Provides a detailed explanation of what a piece of code does
 */
server.tool(
  'explainThisCode',
  'Provides a detailed line-by-line or block-by-block explanation of what code does',
  {
    code: z.string().describe('The code to explain'),
    language: z.string().describe('The programming language'),
    detailLevel: z.enum(['overview', 'detailed', 'line-by-line']).optional().describe('How detailed the explanation should be'),
  },
  async ({ code, language, detailLevel = 'detailed' }) => {
    const explanation = generateCodeExplanation(code, language, detailLevel);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(explanation, null, 2),
        },
      ],
    };
  }
);

/**
 * Tool 8: Quiz Me
 * Generates practice questions to test understanding
 */
server.tool(
  'quizMe',
  'Generates practice questions to test your understanding of a programming concept',
  {
    topic: z.string().describe('The topic to be quizzed on'),
    difficulty: z.enum(['easy', 'medium', 'hard']).optional().describe('Difficulty level of questions'),
    questionCount: z.number().min(1).max(10).optional().describe('Number of questions to generate'),
    questionType: z.enum(['multiple-choice', 'true-false', 'code-output', 'fill-blank', 'mixed']).optional()
      .describe('Type of questions to generate'),
  },
  async ({ topic, difficulty = 'medium', questionCount = 5, questionType = 'mixed' }) => {
    const quiz = generateQuiz(topic, difficulty, questionCount, questionType);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(quiz, null, 2),
        },
      ],
    };
  }
);

// ============================================================================
// Helper Functions (These generate structured responses for the AI to process)
// ============================================================================

interface ConceptExplanation {
  concept: string;
  level: string;
  language?: string;
  summary: string;
  keyPoints: string[];
  analogy: string;
  codeExample?: string;
  commonMistakes: string[];
  relatedConcepts: string[];
  practiceExercise: string;
}

function generateConceptExplanation(
  concept: string,
  level: string,
  language?: string
): ConceptExplanation {
  return {
    concept,
    level,
    language,
    summary: `This is a request to explain the concept of "${concept}" at a ${level} level${language ? ` in the context of ${language}` : ''}.`,
    keyPoints: [
      'Provide 3-5 key points that explain the core idea',
      'Use simple language appropriate for the level',
      'Include practical relevance',
    ],
    analogy: 'Provide a real-world analogy to help understand the concept',
    codeExample: language ? `Provide a simple ${language} code example demonstrating the concept` : undefined,
    commonMistakes: [
      'List 2-3 common mistakes beginners make with this concept',
    ],
    relatedConcepts: [
      'List related concepts the learner should explore next',
    ],
    practiceExercise: 'Suggest a simple exercise to practice this concept',
  };
}

interface CodeReview {
  code: string;
  language: string;
  context?: string;
  focusAreas?: string[];
  overallAssessment: string;
  isCorrect: boolean;
  strengths: string[];
  improvements: string[];
  securityConcerns?: string[];
  performanceNotes?: string[];
  refactoredCode?: string;
  learningResources: string[];
}

function generateCodeReview(
  code: string,
  language: string,
  context?: string,
  focusAreas?: string[]
): CodeReview {
  return {
    code,
    language,
    context,
    focusAreas,
    overallAssessment: `Review this ${language} code${context ? ` that is supposed to ${context}` : ''}`,
    isCorrect: true, // AI will determine this
    strengths: [
      'Identify what the code does well',
    ],
    improvements: [
      'Suggest specific improvements with explanations of why',
    ],
    securityConcerns: focusAreas?.includes('security') ? ['Check for security issues'] : undefined,
    performanceNotes: focusAreas?.includes('performance') ? ['Analyze performance implications'] : undefined,
    refactoredCode: 'Provide improved version of the code if applicable',
    learningResources: [
      'Suggest resources to learn more about the improvements suggested',
    ],
  };
}

interface BestPractices {
  task: string;
  technology?: string;
  currentApproach?: string;
  practices: Array<{
    practice: string;
    why: string;
    example: string;
  }>;
  antiPatterns: string[];
  resources: string[];
}

function generateBestPractices(
  task: string,
  technology?: string,
  currentApproach?: string
): BestPractices {
  return {
    task,
    technology,
    currentApproach,
    practices: [
      {
        practice: 'Best practice recommendation',
        why: 'Explanation of why this is important',
        example: 'Code or implementation example',
      },
    ],
    antiPatterns: [
      'Common anti-patterns to avoid for this task',
    ],
    resources: [
      'Links or references to learn more',
    ],
  };
}

interface ApproachComparison {
  problem: string;
  approaches: string[];
  criteria?: string[];
  comparison: Array<{
    approach: string;
    pros: string[];
    cons: string[];
    bestFor: string;
    complexity: string;
  }>;
  recommendation: string;
  tradeoffs: string;
}

function generateApproachComparison(
  problem: string,
  approaches: string[],
  criteria?: string[]
): ApproachComparison {
  return {
    problem,
    approaches,
    criteria,
    comparison: approaches.map(approach => ({
      approach,
      pros: ['List advantages of this approach'],
      cons: ['List disadvantages of this approach'],
      bestFor: 'Describe scenarios where this approach excels',
      complexity: 'Rate the complexity: low/medium/high',
    })),
    recommendation: 'Provide a recommendation based on common use cases',
    tradeoffs: 'Explain the key tradeoffs between approaches',
  };
}

interface LearningPath {
  topic: string;
  currentLevel: string;
  goalLevel: string;
  timeCommitment?: string;
  estimatedDuration: string;
  phases: Array<{
    name: string;
    duration: string;
    objectives: string[];
    topics: string[];
    projects: string[];
    resources: string[];
  }>;
  milestones: string[];
  tips: string[];
}

function generateLearningPath(
  topic: string,
  currentLevel: string,
  goalLevel: string,
  timeCommitment?: string
): LearningPath {
  return {
    topic,
    currentLevel,
    goalLevel,
    timeCommitment,
    estimatedDuration: 'Calculate based on current/goal levels and time commitment',
    phases: [
      {
        name: 'Phase 1: Foundations',
        duration: '2-4 weeks',
        objectives: ['Learning objectives for this phase'],
        topics: ['Topics to cover'],
        projects: ['Hands-on projects to build'],
        resources: ['Recommended learning resources'],
      },
    ],
    milestones: [
      'Key milestones to track progress',
    ],
    tips: [
      'Tips for effective learning',
    ],
  };
}

interface DebugHelp {
  error: string;
  code?: string;
  language?: string;
  context?: string;
  errorType: string;
  likelyCause: string;
  explanation: string;
  solutions: Array<{
    solution: string;
    code?: string;
    explanation: string;
  }>;
  preventionTips: string[];
  relatedErrors: string[];
}

function generateDebugHelp(
  error: string,
  code?: string,
  language?: string,
  context?: string
): DebugHelp {
  return {
    error,
    code,
    language,
    context,
    errorType: 'Categorize the type of error',
    likelyCause: 'Most likely cause of this error',
    explanation: 'Explain what this error means in simple terms',
    solutions: [
      {
        solution: 'Step-by-step solution',
        code: 'Fixed code if applicable',
        explanation: 'Why this fix works',
      },
    ],
    preventionTips: [
      'How to prevent this error in the future',
    ],
    relatedErrors: [
      'Similar errors the learner might encounter',
    ],
  };
}

interface CodeExplanation {
  code: string;
  language: string;
  detailLevel: string;
  overview: string;
  breakdown: Array<{
    section: string;
    code: string;
    explanation: string;
  }>;
  concepts: string[];
  flowDiagram?: string;
  keyTakeaways: string[];
}

function generateCodeExplanation(
  code: string,
  language: string,
  detailLevel: string
): CodeExplanation {
  return {
    code,
    language,
    detailLevel,
    overview: 'High-level summary of what this code does',
    breakdown: [
      {
        section: 'Section name',
        code: 'Relevant code snippet',
        explanation: 'What this section does and why',
      },
    ],
    concepts: [
      'Programming concepts used in this code',
    ],
    flowDiagram: detailLevel === 'detailed' ? 'ASCII diagram of code flow' : undefined,
    keyTakeaways: [
      'Important lessons from this code',
    ],
  };
}

interface Quiz {
  topic: string;
  difficulty: string;
  questions: Array<{
    id: number;
    type: string;
    question: string;
    options?: string[];
    correctAnswer: string;
    explanation: string;
  }>;
  studyTips: string[];
}

function generateQuiz(
  topic: string,
  difficulty: string,
  questionCount: number,
  questionType: string
): Quiz {
  return {
    topic,
    difficulty,
    questions: Array.from({ length: questionCount }, (_, i) => ({
      id: i + 1,
      type: questionType === 'mixed' ? 'varies' : questionType,
      question: `Question ${i + 1} about ${topic}`,
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctAnswer: 'The correct answer',
      explanation: 'Why this is the correct answer',
    })),
    studyTips: [
      'Tips for studying this topic further',
    ],
  };
}

// ============================================================================
// Server Initialization
// ============================================================================

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  // Log to stderr so it doesn't interfere with MCP protocol on stdout
  console.error('Learning Assistant MCP Server started successfully!');
  console.error('Available tools: explainConcept, reviewCode, suggestBestPractice, compareApproaches, generateLearningPath, debugHelper, explainThisCode, quizMe');
}

main().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

