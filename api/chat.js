import { AzureOpenAI } from 'openai';

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages array is required' });
  }

  const azureKey = process.env.AZURE_OPENAI_KEY;
  const azureEndpoint = process.env.AZURE_OPENAI_ENDPOINT || "https://models.inference.ai.azure.com";
  const azureDeployment = process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o";
  const azureVersion = "2025-01-01-preview";

  if (!azureKey) {
    console.error('Missing AZURE_OPENAI_KEY');
    return res.status(500).json({ error: 'AI service configuration missing. Please check back later.' });
  }

  try {
    const client = new AzureOpenAI({
      endpoint: azureEndpoint,
      apiKey: azureKey,
      apiVersion: azureVersion,
    });

    const systemMessage = {
      role: "system",
      content: `You are Vision Intelligence (Pro), the Senior WASSCE Academic Assistant for Vision Education. 
      Your goal is to provide high-accuracy, supportive, and encouraging academic tutoring for Ghanaian students.
      
      EXPERT RULES:
      1. Focus on the WASSCE / WAEC curriculum (Core Mathematics, English, Integrated Science, Social Studies).
      2. Use clear, simple language but remain professional (Senior Mentor tone).
      3. For Mathematics: Always use LaTeX for formulas (e.g., $x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$).
      4. Provide "Visionary Insights": Pro-tips that help students avoid common exam traps.
      5. If asked about non-educational topics, gently steer the conversation back to learning or career guidance.
      6. Always identify as an AI built for Vision Education.
      
      Current Date: ${new Date().toLocaleDateString()}
      Platform: Vision Education (visionedu.site)`
    };

    const response = await client.chat.completions.create({
      model: azureDeployment,
      messages: [systemMessage, ...messages],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const aiMessage = response.choices[0].message;
    return res.status(200).json({ message: aiMessage });

  } catch (error) {
    console.error('AI Chat Error:', error.message);
    return res.status(500).json({ error: 'Vision AI is currently updating. Please try again in a few moments.' });
  }
}
