const fs = require('fs');
const path = require('path');

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

const globalHeadTags = `
  <style>
    :root { --navy: #05080f; --emerald: #10b981; --indigo: #6366f1; }
    .bg-mesh { background-image: radial-gradient(at 0% 0%, rgba(16,185,129,0.05) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(99,102,241,0.05) 0px, transparent 50%); }
    .grid-pattern { background-image: radial-gradient(rgba(0,0,0,0.05) 1px, transparent 1px); background-size: 32px 32px; }
    .hero-glow { position: absolute; width: 400px; height: 400px; filter: blur(120px); opacity: 0.15; pointer-events: none; }
  </style>
`;

const getHeader = (page) => {
    return `
  <header class="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-100 transition-all duration-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-20">
        <a href="index.html" class="flex items-center gap-3 group">
          <div class="w-10 h-10 bg-gradient-to-br from-emerald-500 to-indigo-500 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg group-hover:scale-110 transition-transform ring-4 ring-white">V</div>
          <span class="font-black text-xl tracking-tighter text-navy group-hover:text-emerald-500 transition-colors">Vision Education</span>
        </a>
        <div class="flex items-center gap-8">
          <nav class="hidden md:flex space-x-8 items-center">
            <a href="index.html" class="text-navy hover:text-emerald-500 font-bold text-sm transition-all \${page === 'index.html' ? 'text-emerald-500' : ''}">Platform</a>
            <a href="about.html" class="text-navy hover:text-emerald-500 font-bold text-sm transition-all \${page === 'about.html' ? 'text-emerald-500' : ''}">About</a>
            <a href="articles.html" class="text-navy hover:text-emerald-500 font-bold text-sm transition-all \${page === 'articles.html' || (page.includes('.html') && page !== 'index.html' && page !== 'news.html' && page !== 'about.html') ? 'text-emerald-500' : ''}">Articles</a>
            <a href="news.html" class="text-navy hover:text-emerald-500 font-bold text-sm transition-all \${page === 'news.html' ? 'text-emerald-500' : ''}">News</a>
          </nav>
          <a href="https://visionedu.online" target="_blank" rel="noopener noreferrer" class="hidden sm:flex px-6 py-2.5 bg-navy text-white text-sm font-black rounded-xl hover:bg-emerald-500 hover:shadow-xl hover:shadow-emerald-500/20 transition-all active:scale-95 items-center gap-2">
            Get Started
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M5 12h14M12 5l7 7-7 7"></path></svg>
          </a>
        </div>
      </div>
    </div>
  </header>`;
};

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
  </div>`;
};

const getPremiumHero = (title, subtitle) => `
  <section class="relative py-28 bg-navy overflow-hidden">
    <div class="hero-glow bg-emerald-500 -top-40 -left-20"></div>
    <div class="hero-glow bg-indigo-600 -bottom-40 -right-20"></div>
    <div class="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]"></div>
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="max-w-3xl">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-emerald-400 font-black text-[10px] uppercase tracking-[0.2em] mb-8">
          Vision Educational Archive
        </div>
        <h1 class="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-[0.9]">
          \${title}
        </h1>
        <p class="text-xl text-gray-400 font-medium leading-relaxed max-w-2xl">
          \${subtitle}
        </p>
      </div>
    </div>
  </section>`;

const articlesGridSection = `
  <section class="py-24 bg-slate-50 relative grid-pattern">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="hidden md:flex items-center justify-between mb-16 px-8 py-4 bg-white rounded-3xl border border-gray-100 shadow-sm">
        <div class="flex items-center gap-8">
          <button onclick="filterArticles('all')" id="tab-all" class="text-sm font-black uppercase tracking-widest text-emerald-500">All Insights</button>
          <button onclick="filterArticles('student')" id="tab-student" class="text-sm font-black uppercase tracking-widest text-gray-400 hover:text-navy transition-colors">Students</button>
          <button onclick="filterArticles('parent')" id="tab-parent" class="text-sm font-black uppercase tracking-widest text-gray-400 hover:text-navy transition-colors">Parents</button>
        </div>
        <div class="text-gray-400 font-mono text-xs">ARCHIVE_V2.0</div>
      </div>

      <div id="articles-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <article data-category="student" onclick="location.href='core-math-2026.html'" class="article-card group bg-white rounded-[2.5rem] border border-gray-100 p-8 hover:shadow-2xl transition-all duration-500 flex flex-col cursor-pointer hover:-translate-y-2 border-b-4 hover:border-b-emerald-500">
          <div class="flex items-center gap-3 mb-8">
            <span class="px-4 py-1.5 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-full">Mathematics</span>
            <span class="text-gray-400 text-[10px] font-black uppercase tracking-widest">5 MIN READ</span>
          </div>
          <h3 class="text-2xl font-black text-navy mb-4 leading-tight group-hover:text-emerald-500 transition-colors">Decoding the 2026 Core Math Syllabus</h3>
          <p class="text-gray-500 text-sm font-medium leading-relaxed mb-8 flex-1">An in-depth look at what the Chief Examiner expects from students in the next cycle.</p>
          <div class="flex items-center justify-between pt-6 border-t border-gray-50 group/link">
            <span class="text-navy font-bold text-sm">Read Insight</span>
            <div class="w-10 h-10 rounded-full bg-navy text-white flex items-center justify-center group-hover/link:bg-emerald-500 group-hover/link:translate-x-1 transition-all">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 8l4 4m0 0l-4 4m4-4H3" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path></svg>
            </div>
          </div>
        </article>

        <article data-category="student" onclick="location.href='ai-test-prep.html'" class="article-card group bg-white rounded-[2.5rem] border border-gray-100 p-8 hover:shadow-2xl transition-all duration-500 flex flex-col cursor-pointer hover:-translate-y-2 border-b-4 hover:border-b-indigo-500">
          <div class="flex items-center gap-3 mb-8">
            <span class="px-4 py-1.5 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full">Technology</span>
            <span class="text-gray-400 text-[10px] font-black uppercase tracking-widest">4 MIN READ</span>
          </div>
          <h3 class="text-2xl font-black text-navy mb-4 leading-tight group-hover:text-indigo-500 transition-colors">How AI is Flipping the Script on Test Prep</h3>
          <p class="text-gray-500 text-sm font-medium leading-relaxed mb-8 flex-1">Exploring how LLMs can act as personal tutors for Ghanaian students preparing for WASSCE.</p>
          <div class="flex items-center justify-between pt-6 border-t border-gray-50 group/link">
            <span class="text-navy font-bold text-sm">Read Insight</span>
            <div class="w-10 h-10 rounded-full bg-navy text-white flex items-center justify-center group-hover/link:bg-indigo-500 group-hover/link:translate-x-1 transition-all">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 8l4 4m0 0l-4 4m4-4H3" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path></svg>
            </div>
          </div>
        </article>

        <article data-category="parent" onclick="location.href='parent-guide.html'" class="article-card group bg-white rounded-[2.5rem] border border-gray-100 p-8 hover:shadow-2xl transition-all duration-500 flex flex-col cursor-pointer hover:-translate-y-2 border-b-4 hover:border-b-orange-500">
          <div class="flex items-center gap-3 mb-8">
            <span class="px-4 py-1.5 bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-widest rounded-full">Guidance</span>
            <span class="text-gray-400 text-[10px] font-black uppercase tracking-widest">6 MIN READ</span>
          </div>
          <h3 class="text-2xl font-black text-navy mb-4 leading-tight group-hover:text-orange-500 transition-colors">A Parent's Guide to WASSCE Accountability</h3>
          <p class="text-gray-500 text-sm font-medium leading-relaxed mb-8 flex-1">How parents can use digital tools to monitor progress without micromanaging.</p>
          <div class="flex items-center justify-between pt-6 border-t border-gray-50 group/link">
            <span class="text-navy font-bold text-sm">Read Insight</span>
            <div class="w-10 h-10 rounded-full bg-navy text-white flex items-center justify-center group-hover/link:bg-orange-500 group-hover/link:translate-x-1 transition-all">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 8l4 4m0 0l-4 4m4-4H3" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path></svg>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>`;

const footerHtml = `
  <footer class="bg-navy py-20 border-t border-white/5">
    <div class="max-w-7xl mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-16">
        <div class="col-span-1 lg:col-span-2">
            <a href="index.html" class="flex items-center gap-3 mb-8">
              <div class="w-10 h-10 bg-gradient-to-br from-emerald-500 to-indigo-500 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg ring-4 ring-white/10">V</div>
              <span class="font-black text-2xl tracking-tighter text-white">Vision Education</span>
            </a>
            <p class="text-gray-400 font-medium leading-relaxed mb-8 max-w-sm">Democratizing world-class WASSCE preparation for every student in Ghana through the power of AI.</p>
        </div>
        <div>
            <h4 class="text-white font-black text-xs uppercase tracking-[0.2em] mb-8">Resources</h4>
            <nav class="flex flex-col gap-4">
                <a href="index.html" class="text-gray-400 hover:text-emerald-500 font-bold transition-colors">Platform</a>
                <a href="articles.html" class="text-gray-400 hover:text-emerald-500 font-bold transition-colors">Archive</a>
                <a href="news.html" class="text-gray-400 hover:text-emerald-500 font-bold transition-colors">News</a>
            </nav>
        </div>
        <div>
            <h4 class="text-white font-black text-xs uppercase tracking-[0.2em] mb-8">Company</h4>
            <nav class="flex flex-col gap-4">
                <a href="about.html" class="text-gray-400 hover:text-emerald-500 font-bold transition-colors">Our Story</a>
                <a href="mailto:mensuohyaw@gmail.com" class="text-gray-400 hover:text-emerald-500 font-bold transition-colors">Contact</a>
            </nav>
        </div>
      </div>
    </div>
  </footer>`;

function processPage(file) {
  if (!fs.existsSync(file)) return;
  let html = fs.readFileSync(file, 'utf8');
  const basename = path.basename(file);
  
  if (!html.includes('bg-mesh')) {
    html = html.replace('</head>', globalHeadTags + '</head>');
  }

  const headerContent = getHeader(basename);
  html = html.replace(/<header[\s\S]*?<\/header>/, headerContent);

  const mobileNav = getMobileNav(basename);
  if (!html.includes('<!-- Mobile Bottom Navigation -->')) {
    html = html.replace('</body>', mobileNav + '</body>');
  } else {
    html = html.replace(/<!-- Mobile Bottom Navigation -->[\s\S]*?<\/div>\s*<\/div>/, mobileNav);
  }

  if (basename === 'articles.html') {
      const hero = getPremiumHero("Latest Insights", "Explore research, syllabus breakdowns, and EdTech innovations shaping the future of Ghanaian education.");
      html = html.replace(/<section class="py-20[\s\S]*?<\/section>/, hero);
      html = html.replace(/<section class="py-12[\s\S]*?<\/section>/, articlesGridSection);
  }

  if (!html.includes('id="newsletter"')) {
    html = html.replace('</footer>', newsletterHtml + '</footer>');
  } else {
    html = html.replace(/<section id="newsletter"[\s\S]*?<\/section>/, newsletterHtml);
  }

  html = html.replace(/<footer[\s\S]*?<\/footer>/, footerHtml);

  fs.writeFileSync(file, html);
  console.log('Processed ' + file);
}

const filesToProcess = [
  'index.html', 'about.html', 'news.html', 'articles.html',
  'core-math-2026.html', 'ai-test-prep.html', 'cs-integration.html', 'parent-guide.html'
];
filesToProcess.forEach(processPage);
console.log('Site-wide theme overhaul and header fixes complete!');
