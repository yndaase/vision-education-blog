import Parser from 'rss-parser';
import NodeCache from 'node-cache';

const parser = new Parser();
const cache = new NodeCache({ stdTTL: 300 }); // 5 minute cache

export default async function handler(req, res) {
  const query = 'Ghana Education WASSCE WAEC';
  const cacheKey = `gnews:${query}`;

  try {
    // 1. Check Cache
    let cachedNews = cache.get(cacheKey);
    if (cachedNews) {
      return res.status(200).json({ news: cachedNews });
    }

    // 2. Fetch from Google News RSS
    const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`;
    const feed = await parser.parseURL(url);

    // 3. Map RSS items to Vision UI format
    const news = feed.items.slice(0, 6).map(item => {
      // Basic category detection based on title content
      let category = 'NEWS';
      const title = item.title.toUpperCase();
      if (title.includes('TECH') || title.includes('AI') || title.includes('DIGITAL')) category = 'TECH';
      if (title.includes('WASSCE') || title.includes('WAEC') || title.includes('EXAM')) category = 'EXAMS';
      if (title.includes('POLICY') || title.includes('GOVERNMENT') || title.includes('MINISTER')) category = 'POLICY';
      if (title.includes('SYLLABUS') || title.includes('CURRICULUM')) category = 'SYLLABUS';

      return {
        title: item.title.split(' - ')[0], // Remove source from title if present
        summary: item.contentSnippet ? item.contentSnippet.slice(0, 120) + '...' : 'Latest educational updates from Google News.',
        category: category,
        readTime: '2 min',
        link: item.link,
        pubDate: item.pubDate
      };
    });

    // 4. Update Cache and Send
    cache.set(cacheKey, news);
    return res.status(200).json({ news });

  } catch (error) {
    console.error('Google News RSS Error:', error);
    // Fallback static news if everything fails
    return res.status(200).json({ 
      news: [
        {
          title: "Syllabus Update: Upcoming WASSCE Preparations Peak",
          summary: "Examiners suggest a shift towards practical logic applications in Core Mathematics for the next cohort.",
          category: "SYLLABUS",
          readTime: "2 min"
        },
        {
          title: "Digital Integration in SHS Expanding",
          summary: "New initiatives to bring high-speed internet to Rural Senior High Schools in Ghana.",
          category: "TECH",
          readTime: "3 min"
        }
      ]
    });
  }
}
