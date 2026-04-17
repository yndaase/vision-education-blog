const fs = require('fs');
const path = require('path');

const newsletterHtml = '<section id="newsletter" class="py-24 bg-navy px-4"><div class="max-w-4xl mx-auto bg-[#0a0f1a] rounded-[3rem] p-12 text-center border border-white/10 shadow-2xl relative overflow-hidden"><div class="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-indigo-500/10"></div><div class="relative z-10"><h2 class="text-3xl md:text-4xl font-black text-white mb-6">Stay Ahead of the Curve</h2><p class="text-gray-400 mb-10">Join 2,000+ students receiving weekly WASSCE tips.</p><form id="newsletter-form" class="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto"><input type="email" placeholder="Email address" required class="flex-1 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-emerald-500 outline-none transition-all"><button type="submit" class="px-10 py-4 bg-emerald-500 text-navy font-black rounded-2xl hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/20">Subscribe</button></form></div></div></section>';

const globalHeadTags = '<style>:root { --navy: #05080f; --emerald: #10b981; --indigo: #6366f1; } .bg-mesh { background-image: radial-gradient(at 0% 0%, rgba(16,185,129,0.05) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(99,102,241,0.05) 0px, transparent 50%); } .grid-pattern { background-image: radial-gradient(rgba(0,0,0,0.05) 1px, transparent 1px); background-size: 32px 32px; } .hero-glow { position: absolute; width: 400px; height: 400px; filter: blur(120px); opacity: 0.15; pointer-events: none; }</style>';

const getHeader = (page) => {
    const isArticlesActive = (page === 'articles.html' || (page.includes('.html') && page !== 'index.html' && page !== 'news.html' && page !== 'about.html')) ? 'text-emerald-500' : 'text-navy';
    const isAboutActive = page === 'about.html' ? 'text-emerald-500' : 'text-navy';
    const isPlatformActive = page === 'index.html' ? 'text-emerald-500' : 'text-navy';
    const isNewsActive = page === 'news.html' ? 'text-emerald-500' : 'text-navy';

    return '<header class="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-100 transition-all duration-300">' +
    '<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">' +
      '<div class="flex justify-between items-center h-20">' +
        '<a href="index.html" class="flex items-center gap-3 group">' +
          '<div class="w-10 h-10 bg-navy rounded-xl flex items-center justify-center text-emerald-500 font-black text-xl shadow-lg ring-4 ring-navy/5 group-hover:scale-110 transition-transform">V</div>' +
          '<span class="font-black text-xl tracking-tighter text-navy group-hover:text-emerald-500 transition-all">Vision Education</span>' +
        '</a>' +
        '<div class="flex items-center gap-8">' +
          '<nav class="hidden md:flex space-x-8 items-center">' +
            '<a href="index.html" class="' + isPlatformActive + ' hover:text-emerald-500 font-bold text-sm transition-all">Platform</a>' +
            '<a href="about.html" class="' + isAboutActive + ' hover:text-emerald-500 font-bold text-sm transition-all">About</a>' +
            '<a href="articles.html" class="' + isArticlesActive + ' hover:text-emerald-500 font-bold text-sm transition-all">Articles</a>' +
            '<a href="news.html" class="' + isNewsActive + ' hover:text-emerald-500 font-bold text-sm transition-all">News</a>' +
          '</nav>' +
          '<a href="https://visionedu.online" target="_blank" rel="noopener noreferrer" class="flex px-6 py-2.5 bg-navy text-white text-sm font-black rounded-xl hover:bg-emerald-500 hover:shadow-xl hover:shadow-emerald-500/20 transition-all active:scale-95 items-center gap-2">' +
            'Get Started' +
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M5 12h14M12 5l7 7-7 7"></path></svg>' +
          '</a>' +
        '</div>' +
      '</div>' +
    '</div>' +
  '</header>';
};

const getPremiumHero = (title, subtitle) => {
    return '<section class="relative py-28 bg-navy overflow-hidden">' +
      '<div class="hero-glow bg-emerald-500 -top-40 -left-20"></div>' +
      '<div class="hero-glow bg-indigo-600 -bottom-40 -right-20"></div>' +
      '<div class="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]"></div>' +
      '<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">' +
        '<div class="max-w-3xl">' +
          '<div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-emerald-400 font-black text-[10px] uppercase tracking-[0.2em] mb-8">Vision Educational Archive</div>' +
          '<h1 class="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-[0.9]">' + title + '</h1>' +
          '<p class="text-xl text-gray-400 font-medium leading-relaxed max-w-2xl">' + subtitle + '</p>' +
        '</div>' +
      '</div>' +
    '</section>';
};

const footerHtml = '<footer class="bg-navy py-20 border-t border-white/5"><div class="max-w-7xl mx-auto px-4 text-center text-gray-400 font-bold text-sm">&copy; 2026 Vision Education. All rights reserved.</div></footer>';

function processPage(file) {
  if (!fs.existsSync(file)) return;
  let html = fs.readFileSync(file, 'utf8');
  const basename = path.basename(file);
  
  if (!html.includes('bg-mesh')) {
    html = html.replace('</head>', globalHeadTags + '</head>');
  }

  const headerContent = getHeader(basename);
  html = html.replace(/<header[\s\S]*?<\/header>/, headerContent);

  if (basename === 'articles.html') {
      const hero = getPremiumHero("Latest Insights", "Explore research, syllabus breakdowns, and EdTech innovations shaping our future.");
      html = html.replace(/<section[\s\S]*?Latest <span[\s\S]*?<\/section>/, hero);
  }

  if (html.includes('</footer>')) {
    html = html.replace(/<footer[\s\S]*?<\/footer>/, footerHtml);
  } else {
    html = html.replace('</body>', footerHtml + '</body>');
  }

  fs.writeFileSync(file, html);
  console.log('Processed ' + file);
}

const filesToProcess = ['index.html', 'about.html', 'news.html', 'articles.html', 'core-math-2026.html', 'ai-test-prep.html', 'cs-integration.html', 'parent-guide.html'];
filesToProcess.forEach(processPage);
console.log('Theme fix executed.');
