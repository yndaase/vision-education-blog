const fs = require('fs');
const path = require('path');
require('dotenv').config();
const { AzureOpenAI } = require('openai');

const azureKey = process.env.AZURE_OPENAI_KEY;
const azureEndpoint = process.env.AZURE_OPENAI_ENDPOINT || "https://models.inference.ai.azure.com";
const azureDeployment = process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o";
const azureVersion = "2025-01-01-preview";

let azureClient = null;
if (azureKey) {
  azureClient = new AzureOpenAI({
    endpoint: azureEndpoint,
    apiKey: azureKey,
    apiVersion: azureVersion,
  });
}

const articles = ['core-math-2026.html', 'ai-test-prep.html', 'cs-integration.html', 'parent-guide.html'];
const intelligenceData = {};

async function generateIntelligence(file) {
  const content = fs.readFileSync(file, 'utf8');
  const title = content.match(/<title>(.*?)<\/title>/)?.[1] || file;
  const articleText = content.match(/<div id="article-text"[\s\S]*?>([\s\S]*?)<\/div>/)?.[1] || "";
  const cleanText = articleText.replace(/<.*?>/g, ' ').replace(/\s+/g, ' ').trim();

  console.log(`Generating intelligence for: ${file}...`);

  if (!azureClient) {
    console.warn(`No AZURE_OPENAI_KEY found. Using mock data for ${file}.`);
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
    const response = await azureClient.chat.completions.create({
      model: azureDeployment,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3
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
    'core-math-2026.html': {
      insights: [
        "Focus on Numerical Reasoning: 2026 Shift.",
        "3D Geometry visualization is now high-priority.",
        "Step-by-step expression is critical for full marks."
      ],
      difficulty: 4,
      frequency: "High",
      quiz: {
        question: "Which topic is seeing a significant shift in focus for the 2026 Core Math exam?",
        options: ["Basic Algebra", "Numerical Reasoning", "Circle Theorems", "Quadratic Equations"],
        answer: 1,
        explanation: "The 2026 examiners are leaning heavily into interpreting real-world data and applying mathematical models."
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
    }
  };
  return mocks[file] || {
    insights: ["AI extracted insight 1", "AI extracted insight 2", "AI extracted insight 3"],
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
