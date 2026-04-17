
export default async function handler(req, res) {
  const NEWS_API_KEY = process.env.NEWS_API_KEY;
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

  try {
    // 1. Fetch real headlines from NewsAPI
    // Target: Education in Ghana / WASSCE / WAEC
    const newsResponse = await fetch(`https://newsapi.org/v2/everything?q=Ghana+education+OR+WASSCE+OR+WAEC&sortBy=publishedAt&pageSize=5&apiKey=${NEWS_API_KEY}`);
    const newsData = await newsResponse.json();

    if (!newsData.articles || newsData.articles.length === 0) {
      return res.status(200).json({ 
        news: [
          {
            title: "Syllabus Update: 2026 WASSCE Preparations Peak",
            summary: "Examiners suggest a shift towards practical logic applications in Core Mathematics and integrated Science for the upcoming 2026 cohort.",
            category: "SYLLABUS",
            readTime: "2 min"
          },
          {
            title: "Digital Integration in SHS Expanding",
            summary: "New initiatives to bring high-speed internet to Rural Senior High Schools are expected to launch by Q3 2024.",
            category: "TECH",
            readTime: "3 min"
          }
        ]
      });
    }

    // 2. Format articles for the AI
    const headlines = newsData.articles.map(a => `- ${a.title}: ${a.description}`).join('\n');

    // 3. Use OpenRouter Free Model to summarize and "Vision-ify" the news
    const aiResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3-8b-instruct:free',
        messages: [
          {
            role: 'system',
            content: 'You are a professional educational news curator for Vision Education. Your goal is to summarize news into a "Core Insight" format for Ghanaian students. Use a premium, interstellar, and encouraging tone. Return ONLY a JSON array of objects.'
          },
          {
            role: 'user',
            content: `Summarize these headlines into 3-4 news items. Each object should have: "title", "summary" (max 120 chars), "category" (one word like TECH, POLICY, or EXAMS), and "readTime" (e.g. "2 min").\n\nHeadlines:\n${headlines}`
          }
        ],
        response_format: { type: 'json_object' }
      })
    });

    const aiData = await aiResponse.json();
    let finalNews;

    try {
        // Handle potential different response formats from open-source models
        const content = aiData.choices[0].message.content;
        const parsed = JSON.parse(content);
        finalNews = parsed.news || parsed.articles || parsed;
        if (!Array.isArray(finalNews)) finalNews = [finalNews];
    } catch (e) {
        // Fallback if AI output is messy
        finalNews = newsData.articles.slice(0, 3).map(a => ({
            title: a.title.slice(0, 60),
            summary: a.description ? a.description.slice(0, 100) : "Latest educational updates from the field.",
            category: "NEWS",
            readTime: "2 min"
        }));
    }

    return res.status(200).json({ news: finalNews });

  } catch (error) {
    console.error('News API Error:', error);
    return res.status(500).json({ error: 'Failed to fetch neural news' });
  }
}
