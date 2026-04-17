const fs = require('fs');

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

['index.html', 'about.html'].forEach(file => {
  if (fs.existsSync(file)) {
    let html = fs.readFileSync(file, 'utf8');
    html = fixNav(html);
    // Extra fix for about.html active state
    if(file === 'about.html') {
      html = html.replace('<a href="about.html" class="text-navy hover:text-vibrantBlue font-semibold text-sm transition-colors cursor-pointer">About</a>', '<a href="about.html" class="text-vibrantBlue font-semibold text-sm transition-colors cursor-pointer">About</a>');
    }
    fs.writeFileSync(file, html);
  }
});

const articlesHtml = `<!DOCTYPE html>
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
<body class="bg-gray-50 font-sans text-navy antialiased">
  
  <!-- Header -->
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

  <!-- Hero Section -->
  <section class="py-20 bg-white text-center border-b border-gray-100">
    <div class="max-w-3xl mx-auto px-4">
      <h1 class="text-4xl md:text-5xl font-extrabold text-navy tracking-tight mb-4">Latest <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-emerald-500">Insights</span></h1>
      <p class="text-lg text-gray-500 leading-relaxed">
        Explore research, syllabus breakdowns, and EdTech innovations shaping the future of Ghanaian education.
      </p>
    </div>
  </section>

  <!-- Article Category Switch -->
  <div class="bg-gray-50 pt-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-6 pb-8 border-b border-gray-200">
        <div class="flex p-1.5 bg-white rounded-2xl shadow-sm border border-gray-100">
          <button onclick="filterArticles('all')" id="tab-all" class="px-6 py-2.5 rounded-xl text-sm font-bold transition-all bg-navy text-white shadow-lg shadow-navy/20">All Articles</button>
          <button onclick="filterArticles('student')" id="tab-student" class="px-6 py-2.5 rounded-xl text-sm font-bold transition-all text-gray-400 hover:text-navy">Student Article</button>
          <button onclick="filterArticles('parent')" id="tab-parent" class="px-6 py-2.5 rounded-xl text-sm font-bold transition-all text-gray-400 hover:text-navy">Parent Article</button>
        </div>
        <p class="text-sm font-semibold text-gray-400">Showing <span id="article-count" class="text-navy">4</span> insights</p>
      </div>
    </div>
  </div>

  <!-- Articles Grid -->
  <section class="py-12 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div id="articles-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        <!-- Article Card 1 -->
        <article data-category="student" onclick="location.href='core-math-2026.html'" class="article-card bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer">
          <div class="h-48 bg-gradient-to-br from-indigo-500/20 to-emerald-500/20 relative flex items-center justify-center overflow-hidden">
            <div class="absolute inset-0 bg-white/10 backdrop-blur-[2px]"></div>
            <span class="relative z-10 font-bold text-indigo-700 text-xl tracking-widest uppercase opacity-30">EDUCATION</span>
          </div>
          <div class="p-8 flex flex-col flex-1">
            <div class="flex items-center gap-3 mb-4">
              <span class="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-wider rounded-full">Pedagogy</span>
              <span class="text-gray-400 text-xs font-semibold">5 min read</span>
            </div>
            <h3 class="text-xl font-bold text-navy mb-3 leading-snug hover:text-vibrantBlue transition-colors">Decoding the 2026 Core Math Syllabus Changes</h3>
            <p class="text-gray-500 text-sm leading-relaxed mb-6 flex-1">An in-depth look at what the Chief Examiner expects from students and how to bypass common algebra pitfalls.</p>
            <div class="flex items-center gap-3 pt-6 border-t border-gray-100">
              <div class="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-md">YN</div>
              <div class="text-sm font-semibold text-navy">Yaw Ndaase Mensuoh</div>
            </div>
          </div>
        </article>

        <!-- Article Card 2 -->
        <article data-category="student" onclick="location.href='ai-test-prep.html'" class="article-card bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer">
          <div class="h-48 bg-gray-900 relative flex items-center justify-center overflow-hidden">
            <div class="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] opacity-10"></div>
            <span class="relative z-10 font-bold text-emerald-500 text-2xl tracking-widest uppercase opacity-70">TECH</span>
          </div>
          <div class="p-8 flex flex-col flex-1">
            <div class="flex items-center gap-3 mb-4">
              <span class="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold uppercase tracking-wider rounded-full">EdTech</span>
              <span class="text-gray-400 text-xs font-semibold">4 min read</span>
            </div>
            <h3 class="text-xl font-bold text-navy mb-3 leading-snug hover:text-vibrantBlue transition-colors">How AI is Flipping the Script on Test Prep</h3>
            <p class="text-gray-500 text-sm leading-relaxed mb-6 flex-1">Exploring how large language models can act as personal tutors and provide objective, instant grading for WASSCE candidates.</p>
            <div class="flex items-center gap-3 pt-6 border-t border-gray-100">
              <div class="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-md">YN</div>
              <div class="text-sm font-semibold text-navy">Yaw Ndaase Mensuoh</div>
            </div>
          </div>
        </article>

        <!-- Article Card 4 (Parent Guide) -->
        <article data-category="parent" onclick="location.href='parent-guide.html'" class="article-card bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer">
          <div class="h-48 bg-gradient-to-br from-orange-500/10 to-pink-500/10 relative flex items-center justify-center overflow-hidden">
            <span class="relative z-10 font-bold text-orange-500 text-xl tracking-widest uppercase opacity-40">GUIDANCE</span>
          </div>
          <div class="p-8 flex flex-col flex-1">
            <div class="flex items-center gap-3 mb-4">
              <span class="px-3 py-1 bg-orange-50 text-orange-600 text-xs font-bold uppercase tracking-wider rounded-full">Parents</span>
              <span class="text-gray-400 text-xs font-semibold">6 min read</span>
            </div>
            <h3 class="text-xl font-bold text-navy mb-3 leading-snug hover:text-vibrantBlue transition-colors">A Parent's Guide to WASSCE Accountability</h3>
            <p class="text-gray-500 text-sm leading-relaxed mb-6 flex-1">How parents can use digital tools to monitor progress and support their child's preparation for the 2026 exams.</p>
            <div class="flex items-center gap-3 pt-6 border-t border-gray-100">
              <div class="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-md">YN</div>
              <div class="text-sm font-semibold text-navy">Yaw Ndaase Mensuoh</div>
            </div>
          </div>
        </article>

        <!-- Article Card 3 -->
        <article data-category="student" onclick="location.href='cs-integration.html'" class="article-card bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer">
          <div class="h-48 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 relative flex items-center justify-center overflow-hidden">
            <span class="relative z-10 font-bold text-blue-500 text-xl tracking-widest uppercase opacity-40">POLICY</span>
          </div>
          <div class="p-8 flex flex-col flex-1">
            <div class="flex items-center gap-3 mb-4">
              <span class="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider rounded-full">Analysis</span>
              <span class="text-gray-400 text-xs font-semibold">7 min read</span>
            </div>
            <h3 class="text-xl font-bold text-navy mb-3 leading-snug hover:text-vibrantBlue transition-colors">The Integration of Computer Science in SHS</h3>
            <p class="text-gray-500 text-sm leading-relaxed mb-6 flex-1">Analyzing the structural shifts in the WAEC curriculum to prioritize early programming fundamentals and logical thinking.</p>
            <div class="flex items-center gap-3 pt-6 border-t border-gray-100">
              <div class="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-md">YN</div>
              <div class="text-sm font-semibold text-navy">Yaw Ndaase Mensuoh</div>
            </div>
          </div>
        </article>

      </div>
    </div>
  </section>

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
            <!-- Newsletter Role Slider Fix -->
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
  </section>

  <!-- Footer -->
  <footer class="bg-navy py-12 border-t border-white/10">
    <div class="max-w-7xl mx-auto px-4 text-center">
      <div class="flex justify-center mb-4">
        <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center text-white font-bold">V</div>
      </div>
      <p class="text-sm text-gray-500">&copy; 2026 Yaw Ndaase Mensuoh. Built for the students of Ghana.</p>
    </div>
  </footer>

  <script src="nav.js" defer></script>
  <script>
    function filterArticles(category) {
      const cards = document.querySelectorAll('.article-card');
      const tabs = {
        all: document.getElementById('tab-all'),
        student: document.getElementById('tab-student'),
        parent: document.getElementById('tab-parent')
      };

      // Update Tabs styling
      Object.keys(tabs).forEach(key => {
        tabs[key].classList.remove('bg-navy', 'text-white', 'shadow-lg', 'shadow-navy/20');
        tabs[key].classList.add('text-gray-400');
      });
      tabs[category].classList.remove('text-gray-400');
      tabs[category].classList.add('bg-navy', 'text-white', 'shadow-lg', 'shadow-navy/20');

      // Filter Cards
      let visibleCount = 0;
      cards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
          card.style.display = 'flex';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      document.getElementById('article-count').innerText = visibleCount;
    }
  </script>
</body>
</html>`;

fs.writeFileSync('articles.html', articlesHtml);
console.log('Successfully updated nav button and created articles.html');
