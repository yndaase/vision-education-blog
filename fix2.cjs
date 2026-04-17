const fs = require('fs');

const newsletterHtml = `
  <!-- Newsletter Section -->
  <section id="newsletter" class="py-24 bg-navy relative overflow-hidden">
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.1),transparent)] opacity-50"></div>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="bg-[#0a0f1a] rounded-[3rem] p-10 md:p-20 overflow-hidden group border border-white/5 relative shadow-2xl">
        <div class="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-indigo-600/10"></div>
        <div class="relative z-10 max-w-2xl mx-auto text-center">
          <h2 class="text-3xl md:text-5xl font-black text-white mb-6 tracking-tighter">Stay Ahead of the Curve</h2>
          <p class="text-lg md:text-xl text-gray-400 mb-10 font-medium">Join 2,000+ Ghanaian students and parents receiving weekly WASSCE tips and AI-powered study strategies.</p>
          
          <form id="newsletter-form" class="space-y-10">
            <!-- Newsletter Role Slider -->
            <div class="flex justify-center flex-col items-center">
              <span class="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Select Your Role</span>
              <div class="inline-flex p-1.5 bg-white/5 rounded-2xl border border-white/10 relative backdrop-blur-xl">
                  <label class="relative cursor-pointer">
                      <input type="radio" name="role" value="student" checked class="peer sr-only">
                      <div class="px-10 py-3 rounded-xl text-sm font-black transition-all text-gray-400 peer-checked:bg-[#10b981] peer-checked:text-[#05080f] peer-checked:shadow-[0_0_20px_rgba(16,185,129,0.3)]">Student</div>
                  </label>
                  <label class="relative cursor-pointer ml-2">
                      <input type="radio" name="role" value="parent" class="peer sr-only">
                      <div class="px-10 py-3 rounded-xl text-sm font-black transition-all text-gray-400 peer-checked:bg-[#10b981] peer-checked:text-[#05080f] peer-checked:shadow-[0_0_20px_rgba(16,185,129,0.3)]">Parent</div>
                  </label>
              </div>
            </div>

            <div class="flex flex-col sm:flex-row gap-4">
              <input type="email" placeholder="Enter your email" required class="flex-1 px-6 py-4 rounded-2xl border border-white/10 focus:border-[#10b981] focus:outline-none text-lg font-bold transition-all bg-white/5 text-white backdrop-blur-sm" aria-label="Email address">
              <button type="submit" class="px-10 py-4 bg-[#10b981] text-[#05080f] font-black rounded-2xl hover:bg-[#34d399] transition-all shadow-xl shadow-emerald-500/20 active:scale-95 text-lg">
                Subscribe
              </button>
            </div>
          </form>
          <div id="newsletter-success" class="hidden text-emerald-400 font-bold mt-6 animate-fade-in-up flex items-center justify-center gap-2">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
            You're on the list! Welcome to the Circle.
          </div>
        </div>
      </div>
    </div>
  </section>`;

const getMobileNav = (page) => {
    const isArticles = page === 'articles.html';
    return `
  <!-- Mobile Bottom Navigation -->
  <div class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 md:hidden w-[90%] max-w-sm">
      <div class="bg-navy/90 backdrop-blur-xl rounded-[2rem] border border-white/10 p-2 shadow-2xl flex items-center justify-between gap-1">
          \${isArticles ? \`
          <button onclick="filterArticles('all')" id="m-tab-all" class="flex-1 py-3 px-2 rounded-2xl text-[10px] font-black uppercase tracking-tighter transition-all bg-emerald-500 text-navy whitespace-nowrap">All Items</button>
          <button onclick="filterArticles('student')" id="m-tab-student" class="flex-1 py-3 px-2 rounded-2xl text-[10px] font-black uppercase tracking-tighter transition-all text-white/60 whitespace-nowrap">Students</button>
          <button onclick="filterArticles('parent')" id="m-tab-parent" class="flex-1 py-3 px-2 rounded-2xl text-[10px] font-black uppercase tracking-tighter transition-all text-white/60 whitespace-nowrap">Parents</button>
          <div class="w-[1px] h-6 bg-white/10 mx-1"></div>
          \` : \`
          <a href="index.html" class="flex-1 py-3 px-2 text-center rounded-2xl text-[10px] font-black uppercase tracking-tighter transition-all \${page === 'index.html' ? 'bg-emerald-500 text-navy' : 'text-white/60'}">Home</a>
          <a href="about.html" class="flex-1 py-3 px-2 text-center rounded-2xl text-[10px] font-black uppercase tracking-tighter transition-all \${page === 'about.html' ? 'bg-emerald-500 text-navy' : 'text-white/60'}">About</a>
          <a href="articles.html" class="flex-1 py-3 px-2 text-center rounded-2xl text-[10px] font-black uppercase tracking-tighter transition-all \${page === 'articles.html' ? 'bg-emerald-500 text-navy' : 'text-white/60'}">Articles</a>
          <a href="news.html" class="flex-1 py-3 px-2 text-center rounded-2xl text-[10px] font-black uppercase tracking-tighter transition-all \${page === 'news.html' ? 'bg-emerald-500 text-navy' : 'text-white/60'}">News</a>
          \`}
          <a href="\${page === 'index.html' ? '#top' : 'index.html'}" class="p-3 text-white/40 hover:text-white transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
          </a>
      </div>
  </div>\`;
};

const homepageNewsHtml = `
  <!-- Latest Intelligence Section (Homepage) -->
  <section id="latest-news" class="py-24 bg-gray-50 overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
        <div class="max-w-xl">
          <h2 class="text-4xl md:text-5xl font-black text-navy mb-6 tracking-tighter">Latest <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-indigo-600">Intelligence</span></h2>
          <p class="text-lg text-gray-500 font-medium leading-relaxed">Streaming real-time educational insights from Google News, analyzed for the Ghanaian classroom.</p>
        </div>
        <a href="news.html" class="px-8 py-3 bg-white border border-gray-200 rounded-2xl text-navy font-bold hover:border-emerald-500 transition-all flex items-center gap-2 group">
          View All Intelligence
          <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 8l4 4m0 0l-4 4m4-4H3" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
        </a>
      </div>

      <div id="home-news-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-0 translate-y-10 transition-all duration-1000">
        <!-- News items will be injected here -->
        <div class="animate-pulse bg-white rounded-[2rem] h-[400px] border border-gray-100"></div>
        <div class="animate-pulse bg-white rounded-[2rem] h-[400px] border border-gray-100"></div>
        <div class="animate-pulse bg-white rounded-[2rem] h-[400px] border border-gray-100"></div>
      </div>
    </div>
  </section>

  <script>
    async function fetchHomeNews() {
      try {
        const res = await fetch('/api/news');
        const data = await res.json();
        const grid = document.getElementById('home-news-grid');
        
        if (data.news && data.news.length > 0) {
          grid.innerHTML = data.news.slice(0, 3).map(item => \`
            <article onclick="window.open('\$\{item.link\}', '_blank')" class="group cursor-pointer bg-white rounded-[2rem] border border-gray-100 p-8 hover:shadow-2xl transition-all duration-500 flex flex-col h-full border-b-4 hover:border-b-emerald-500">
              <div class="flex items-center gap-3 mb-6">
                <span class="px-4 py-1.5 bg-gray-50 text-navy text-[10px] font-black uppercase tracking-widest rounded-full">\$\{item.category\}</span>
                <span class="text-gray-400 text-[10px] font-black uppercase tracking-widest">\$\{item.readTime\} READ</span>
              </div>
              <h3 class="text-2xl font-black text-navy mb-4 leading-[1.1] group-hover:text-emerald-600 transition-colors">\$\{item.title\}</h3>
              <p class="text-gray-500 text-sm font-medium leading-relaxed mb-8 flex-1">\$\{item.summary.slice(0, 100)\}...</p>
              <div class="flex items-center justify-between pt-6 border-t border-gray-50 group/link">
                <span class="text-navy font-bold text-sm">Read Full Story</span>
                <div class="w-10 h-10 rounded-full bg-navy text-white flex items-center justify-center group-hover/link:bg-emerald-500 group-hover/link:text-navy transition-all">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 8l4 4m0 0l-4 4m4-4H3" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                </div>
              </div>
            </article>
          \`).join('');
          grid.classList.remove('opacity-0', 'translate-y-10');
        }
      } catch (err) {
        console.error('Failed to fetch home news:', err);
      }
    }
    window.addEventListener('scroll', () => {
        const grid = document.getElementById('home-news-grid');
        const rect = grid.getBoundingClientRect();
        if(rect.top < window.innerHeight - 100) {
            fetchHomeNews();
        }
    }, { once: true });
  </script>
`;

const fixNav = (html) => {
  return html.replace(
    /<nav class="hidden md:flex space-x-8 items-center">[\s\S]*?<\/nav>/,
    `<div class="flex items-center gap-4 md:gap-8">
          <nav class="hidden md:flex space-x-8 items-center">
            <a href="index.html" class="text-navy hover:text-vibrantBlue font-semibold text-sm transition-colors cursor-pointer">Platform</a>
            <a href="about.html" class="text-navy hover:text-vibrantBlue font-semibold text-sm transition-colors cursor-pointer">About</a>
            <a href="articles.html" class="text-navy hover:text-vibrantBlue font-semibold text-sm transition-colors cursor-pointer">Articles</a>
            <a href="news.html" class="text-navy hover:text-vibrantBlue font-semibold text-sm transition-colors cursor-pointer">News</a>
          </nav>
          <a href="https://visionedu.online" target="_blank" rel="noopener noreferrer" class="px-4 py-2 md:px-5 md:py-2.5 bg-gradient-to-r from-emerald-500 to-indigo-500 text-white text-xs md:text-sm font-bold rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2">
            Visit VisionEdu
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg>
          </a>
        </div>`
  );
};

const fixNewsletter = (html) => {
    if (html.includes('id="newsletter"')) {
        return html.replace(/<section id="newsletter"[\s\S]*?<\/section>/, newsletterHtml);
    } 
    return html.replace(/<footer/, newsletterHtml + '\\n\\n<footer');
};

const fixFooter = (html) => {
    return html.replace(/<footer class="bg-navy py-12/, '<footer class="bg-navy py-16');
};

// Process Index, About, News
['index.html', 'about.html', 'news.html'].forEach(file => {
  if (fs.existsSync(file)) {
    let html = fs.readFileSync(file, 'utf8');
    html = fixNav(html);
    
    // Inject News Section on Homepage
    if (file === 'index.html' && !html.includes('id="latest-news"')) {
        html = html.replace(/<section id="newsletter"/, homepageNewsHtml + '\\n\\n<section id="newsletter"');
    }

    html = fixNewsletter(html);
    html = fixFooter(html);
    
    // Add Mobile Bar
    const mobileBar = getMobileNav(file);
    if (!html.includes('<!-- Mobile Bottom Navigation -->')) {
        html = html.replace(/<\\/body>/, mobileBar + '\\n\\n<script src="nav.js" defer></script>\\n<\\/body>');
    }

    if(file === 'about.html') {
      html = html.replace('<a href="about.html" class="text-navy hover:text-vibrantBlue font-semibold text-sm transition-colors cursor-pointer">About</a>', '<a href="about.html" class="text-vibrantBlue font-semibold text-sm transition-colors cursor-pointer">About</a>');
    }
    if(file === 'news.html') {
      html = html.replace('<a href="news.html" class="text-navy hover:text-vibrantBlue font-semibold text-sm transition-colors cursor-pointer">News</a>', '<a href="news.html" class="text-vibrantBlue">News</a>');
    }
    fs.writeFileSync(file, html);
  }
});

// Articles Page (Unified Logic)
const articlesHtml = \`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Articles | Vision Education</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: { sans: ['Outfit', 'sans-serif'], mono: ['JetBrains Mono', 'monospace'], },
          colors: { navy: '#05080f', vibrantBlue: '#6366f1', lightGray: '#f8fafc', darkGray: '#94a3b8', emerald: '#10b981', },
        }
      }
    }
  </script>
</head>
<body class="bg-gray-50 font-sans text-navy antialiased pb-24 md:pb-0">
  
  <header class="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-20">
        <a href="index.html" class="flex items-center gap-3">
          <div class="w-10 h-10 bg-gradient-to-br from-emerald-500 to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">V</div>
          <span class="font-bold text-xl tracking-tight text-navy">Vision Education</span>
        </a>
        <div class="flex items-center gap-4 md:gap-8">
          <nav class="hidden md:flex space-x-8 items-center">
            <a href="index.html" class="text-navy hover:text-vibrantBlue font-semibold text-sm transition-colors cursor-pointer">Platform</a>
            <a href="about.html" class="text-navy hover:text-vibrantBlue font-semibold text-sm transition-colors cursor-pointer">About</a>
            <a href="articles.html" class="text-vibrantBlue font-semibold text-sm transition-colors cursor-pointer">Articles</a>
            <a href="news.html" class="text-navy hover:text-vibrantBlue font-semibold text-sm transition-colors cursor-pointer">News</a>
          </nav>
          <a href="https://visionedu.online" target="_blank" rel="noopener noreferrer" class="px-4 py-2 md:px-5 md:py-2.5 bg-gradient-to-r from-emerald-500 to-indigo-500 text-white text-xs md:text-sm font-bold rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2">
            Visit VisionEdu
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg>
          </a>
        </div>
      </div>
    </div>
  </header>

  <section class="py-20 bg-white text-center border-b border-gray-100">
    <div class="max-w-3xl mx-auto px-4">
      <h1 class="text-4xl md:text-5xl font-extrabold text-navy tracking-tight mb-4">Latest <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-emerald-500">Insights</span></h1>
      <p class="text-lg text-gray-500 leading-relaxed">
        Explore research, syllabus breakdowns, and EdTech innovations shaping the future of Ghanaian education.
      </p>
    </div>
  </section>

  <section class="py-12 bg-gray-50 min-h-[600px]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div id="articles-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <article data-category="student" onclick="location.href='core-math-2026.html'" class="article-card bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer">
          <div class="h-48 bg-gradient-to-br from-indigo-500/20 to-emerald-500/20 relative flex items-center justify-center overflow-hidden">
            <span class="relative z-10 font-bold text-indigo-700 text-xl tracking-widest uppercase opacity-30">EDUCATION</span>
          </div>
          <div class="p-8 flex flex-col flex-1">
             <h3 class="text-xl font-bold text-navy mb-3 leading-snug">Decoding the 2026 Core Math Syllabus Changes</h3>
             <p class="text-gray-500 text-sm leading-relaxed mb-6">An in-depth look at what the Chief Examiner expects from students.</p>
          </div>
        </article>
        <article data-category="student" onclick="location.href='ai-test-prep.html'" class="article-card bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer">
          <div class="h-48 bg-gray-900 relative flex items-center justify-center overflow-hidden">
            <span class="relative z-10 font-bold text-emerald-500 text-2xl tracking-widest uppercase opacity-70">TECH</span>
          </div>
          <div class="p-8 flex flex-col flex-1">
             <h3 class="text-xl font-bold text-navy mb-3 leading-snug">How AI is Flipping the Script on Test Prep</h3>
             <p class="text-gray-500 text-sm leading-relaxed mb-6">Exploring how LLMs can act as personal tutors for WASSCE.</p>
          </div>
        </article>
        <article data-category="parent" onclick="location.href='parent-guide.html'" class="article-card bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer">
          <div class="h-48 bg-gradient-to-br from-orange-500/10 to-pink-500/10 relative flex items-center justify-center overflow-hidden">
            <span class="relative z-10 font-bold text-orange-500 text-xl tracking-widest uppercase opacity-40">GUIDANCE</span>
          </div>
          <div class="p-8 flex flex-col flex-1">
             <h3 class="text-xl font-bold text-navy mb-3 leading-snug">A Parent's Guide to WASSCE Accountability</h3>
             <p class="text-gray-500 text-sm leading-relaxed mb-6">How parents can use digital tools to monitor progress.</p>
          </div>
        </article>
      </div>
    </div>
  </section>

  \${getMobileNav('articles.html')}

  <!-- Desktop Switcher -->
  <div class="hidden md:block bg-gray-50 pb-20">
    <div class="max-w-7xl mx-auto px-8">
      <div class="flex items-center justify-center gap-6 py-10 border-t border-gray-200">
        <div class="flex p-1.5 bg-white rounded-2xl shadow-sm border border-gray-100">
          <button onclick="filterArticles('all')" id="tab-all" class="px-8 py-3 rounded-xl text-sm font-bold transition-all bg-navy text-white shadow-lg shadow-navy/20">All Insights</button>
          <button onclick="filterArticles('student')" id="tab-student" class="px-8 py-3 rounded-xl text-sm font-bold transition-all text-gray-400 hover:text-navy">Student Hub</button>
          <button onclick="filterArticles('parent')" id="tab-parent" class="px-8 py-3 rounded-xl text-sm font-bold transition-all text-gray-400 hover:text-navy">Parent Hub</button>
        </div>
      </div>
    </div>
  </div>

  \${newsletterHtml}

  <footer class="bg-navy py-12 border-t border-white/10">
    <div class="max-w-7xl mx-auto px-4 text-center">
      <div class="flex justify-center mb-4">
        <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center text-white font-bold">V</div>
      </div>
      <nav class="flex justify-center gap-8 mb-8 text-xs font-bold uppercase tracking-widest text-gray-500">
          <a href="index.html" class="hover:text-white transition-colors">Platform</a>
          <a href="about.html" class="hover:text-white transition-colors">About</a>
          <a href="articles.html" class="text-white">Articles</a>
          <a href="news.html" class="hover:text-white transition-colors">News</a>
      </nav>
      <p class="text-sm text-gray-400">&copy; 2026 Yaw Ndaase Mensuoh. Built for the students of Ghana.</p>
    </div>
  </footer>

  <script src="nav.js" defer></script>
  <script>
    function filterArticles(category) {
      const cards = document.querySelectorAll('.article-card');
      const desktopTabs = { all: document.getElementById('tab-all'), student: document.getElementById('tab-student'), parent: document.getElementById('tab-parent') };
      const mobileTabs = { all: document.getElementById('m-tab-all'), student: document.getElementById('m-tab-student'), parent: document.getElementById('m-tab-parent') };
      
      [desktopTabs, mobileTabs].forEach(tabs => {
          Object.keys(tabs).forEach(key => {
            if(!tabs[key]) return;
            tabs[key].classList.remove('bg-navy', 'text-white', 'shadow-lg', 'shadow-navy/20', 'bg-emerald-500', 'text-navy');
            tabs[key].classList.add(tabs === mobileTabs ? 'text-white/60' : 'text-gray-400');
          });
          if(tabs[category]) {
            tabs[category].classList.remove('text-white/60', 'text-gray-400');
            if(tabs === mobileTabs) {
                 tabs[category].classList.add('bg-emerald-500', 'text-navy');
            } else {
                 tabs[category].classList.add('bg-navy', 'text-white', 'shadow-lg', 'shadow-navy/20');
            }
          }
      });
      cards.forEach(card => {
        card.style.display = (category === 'all' || card.getAttribute('data-category') === category) ? 'flex' : 'none';
      });
    }
  </script>
</body>
</html>\`;

fs.writeFileSync('articles.html', articlesHtml);
console.log('Mobile navigation unified across all pages and Homepage news integrated!');
