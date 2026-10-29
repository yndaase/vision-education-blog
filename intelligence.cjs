const fs = require('fs');
const path = require('path');
require('dotenv').config();
const OpenAI = require('openai');

const groqKey = process.env.GROQ_API_KEY || process.env.AZURE_OPENAI_KEY;
const groqBaseURL = process.env.GROQ_BASE_URL || 'https://api.groq.com/openai/v1';
const groqModel = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

let groqClient = null;
if (groqKey) {
  groqClient = new OpenAI({
    apiKey: groqKey,
    baseURL: groqBaseURL,
  });
}

const articles = ['core-math.html', 'ai-test-prep.html', 'cs-integration.html', 'parent-guide.html'];
const intelligenceData = {};

async function generateIntelligence(file) {
  const content = fs.readFileSync(file, 'utf8');
  const title = content.match(/<title>(.*?)<\/title>/)?.[1] || file;
  const articleText = content.match(/<div id="article-text"[\s\S]*?>([\s\S]*?)<\/div>/)?.[1] || "";
  const cleanText = articleText.replace(/<.*?>/g, ' ').replace(/\s+/g, ' ').trim();

  console.log(`Generating intelligence for: ${file}...`);

  if (!groqClient) {
    console.warn(`No GROQ_API_KEY found. Using mock data for ${file}.`);
    return getMockData(file);
  }

  const prompt = `You are a Senior WASSCE Educational Consultant. Analyze the following article and generate educational intelligence.
  
  Article Title: ${title}
  Content: ${cleanText}
  
  Return exactly this JSON format:
  {
    "insights": ["Point 1", "Point 2", "Point 3"],
    "difficulty": 1-5,
    "frequency": "High" | "Medium" | "Low",
    "quiz": {
      "question": "A specific question from the text?",
      "options": ["A", "B", "C", "D"],
      "answer": 0,
      "explanation": "Why this is correct."
    }
  }
  STRICT JSON ONLY.`;

  try {
    const response = await groqClient.chat.completions.create({
      model: groqModel,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      response_format: { type: "json_object" }
    });
    
    let text = response.choices[0].message.content.trim();
    text = text.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();
    return JSON.parse(text);
  } catch (error) {
    console.error(`Error generating for ${file}:`, error.message);
    return getMockData(file);
  }
}

function getMockData(file) {
  const mocks = {
    'core-math.html': {
      insights: [
        "Focus on Numerical Reasoning: Syllabus Shift.",
        "3D Geometry visualization is now high-priority.",
        "Step-by-step expression is critical for full marks."
      ],
      difficulty: 4,
      frequency: "High",
      quiz: {
        question: "Which topic is seeing a significant shift in focus for the Core Math exam?",
        options: ["Basic Algebra", "Numerical Reasoning", "Circle Theorems", "Quadratic Equations"],
        answer: 1,
        explanation: "The examiners are leaning heavily into interpreting real-world data and applying mathematical models."
      }
    },
    'ai-test-prep.html': {
      insights: [
        "AI models provide objective, instant grading.",
        "Deductive reasoning questions are increasing.",
        "Tech-assisted prep is no longer optional."
      ],
      difficulty: 3,
      frequency: "Medium",
      quiz: {
        question: "What is a primary benefit of using AI for WASSCE test preparation?",
        options: ["Cheating in exams", "Instant, objective grading", "Generating fake news", "Replacing teachers"],
        answer: 1,
        explanation: "AI provides immediate and unbiased feedback on student performance metrics."
      }
    },
    'cs-integration.html': {
      insights: [
        "Algorithmic thinking prepares students for modern computing challenges.",
        "Logic frameworks bridge mathematics and digital problem-solving.",
        "Simulation tools allow hardware-independent learning across Ghana."
      ],
      difficulty: 3,
      frequency: "Medium",
      quiz: {
        question: "Why is computational thinking and logic critical for Ghanaian students in the modern WASSCE curriculum?",
        options: [
          "It replaces the need to learn Core Mathematics",
          "It fosters algorithmic problem-solving for both software and real-world challenges",
          "It guarantees free high-end hardware for every school",
          "It eliminates the need for practical examinations"
        ],
        answer: 1,
        explanation: "Computational thinking equips students to decompose complex challenges into algorithmic steps, bridging theoretical math with global tech readiness."
      }
    },
    'parent-guide.html': {
      insights: [
        "Parental emotional support directly correlates with exam performance.",
        "Establishing consistent study routines prevents last-minute cramming stress.",
        "Monitoring real-time diagnostic scores helps identify weak topics early."
      ],
      difficulty: 2,
      frequency: "High",
      quiz: {
        question: "What is the most effective way parents can support their child preparing for the WASSCE?",
        options: [
          "Encouraging structured study schedules and providing positive academic reinforcement",
          "Forbidding the use of all technology including educational tools",
          "Taking mock exams on behalf of the student",
          "Restricting sleep to fewer than 4 hours a night"
        ],
        answer: 0,
        explanation: "Parents provide the emotional and environmental anchor, balancing disciplined study routines with encouraging guidance."
      }
    }
  };
  return mocks[file] || {
    insights: ["Key syllabus insight 1", "Key syllabus insight 2", "Key syllabus insight 3"],
    difficulty: 3,
    frequency: "Medium",
    quiz: {
      question: "Sample Question?",
      options: ["A", "B", "C", "D"],
      answer: 0,
      explanation: "Sample Explanation."
    }
  };
}

async function run() {
  for (const file of articles) {
    intelligenceData[file] = await generateIntelligence(file);
  }
  fs.writeFileSync('intelligence-data.json', JSON.stringify(intelligenceData, null, 2));
  console.log('Intelligence Data Generation Complete.');
}

run();
