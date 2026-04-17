const fs = require('fs');
const path = require('path');

const newsletterHtml = '<section id="newsletter" class="py-24 bg-navy px-4"><div class="max-w-4xl mx-auto bg-[#0a0f1a] rounded-[3rem] p-12 text-center border border-white/10 shadow-2xl relative overflow-hidden"><div class="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-indigo-500/10"></div><div class="relative z-10"><h2 class="text-3xl md:text-4xl font-black text-white mb-6">Stay Ahead of the Curve</h2><p class="text-gray-400 mb-10">Join 2,000+ students and parents receiving weekly WASSCE tips.</p><div id="newsletter-success" class="hidden animate-fade-in"><div class="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 text-navy shadow-xl shadow-emerald-500/40"><svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path></svg></div><h3 class="text-2xl font-black text-white mb-2">You\'re on the list!</h3><p class="text-gray-400">Welcome to the future of Ghanaian education.</p></div><form id="newsletter-form" class="max-w-xl mx-auto"><input type="hidden" name="role" id="newsletter-role" value="student"><div class="flex justify-center mb-10"><div class="relative inline-flex p-1 bg-white/5 rounded-2xl border border-white/10"><div id="role-slider" class="absolute inset-y-1 left-1 w-[calc(50%-4px)] bg-emerald-500 rounded-xl transition-all duration-300 ease-in-out"></div><button type="button" onclick="setRole(\'student\', this)" class="relative z-10 px-10 py-3 text-[10px] font-black uppercase tracking-widest text-white transition-colors">Student</button><button type="button" onclick="setRole(\'parent\', this)" class="relative z-10 px-10 py-3 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">Parent</button></div></div><div class="flex flex-col sm:flex-row gap-4"><input type="email" placeholder="Email address" required class="flex-1 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-emerald-500 outline-none transition-all"><button type="submit" class="px-10 py-4 bg-emerald-500 text-white font-black rounded-2xl hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/20">Subscribe</button></div></form></div></div><script>function setRole(role, btn){const slider = document.getElementById(\'role-slider\');const input = document.getElementById(\'newsletter-role\');const buttons = btn.parentElement.querySelectorAll(\'button\');input.value = role;if(role === \'student\'){slider.style.transform = \'translateX(0)\';}else{slider.style.transform = \'translateX(100%)\';}buttons.forEach(b => {b.classList.remove(\'text-white\');b.classList.add(\'text-white/40\');});btn.classList.add(\'text-white\');btn.classList.remove(\'text-white/40\');}</script></section>';

const searchModalHtml = '<div id="search-modal" class="fixed inset-0 z-[100] hidden overflow-y-auto"><div class="fixed inset-0 bg-navy/60 backdrop-blur-xl transition-opacity" onclick="toggleSearch()"></div><div class="flex min-h-full items-start justify-center p-4 sm:p-6 lg:p-20"><div class="relative w-full max-w-2xl transform rounded-[2rem] bg-[#0a0f1a] border border-white/10 shadow-2xl transition-all"><div class="p-6 border-b border-white/10 flex items-center gap-4"><svg class="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-width="2.5" stroke-linecap="round"></path></svg><input type="text" id="search-input" placeholder="Search insights, news, or guides..." class="flex-1 bg-transparent border-none text-white text-xl focus:ring-0 placeholder-gray-500 py-2 outline-none" autocomplete="off"><div class="px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-gray-400 hidden sm:block">ESC</div></div><div id="search-results" class="max-h-[60vh] overflow-y-auto p-4 space-y-2"></div><div class="p-4 border-t border-white/10 bg-white/[0.02] flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-500"><div><span class="text-white px-1.5 py-0.5 bg-white/5 rounded border border-white/10 mr-1">↑↓</span> to navigate <span class="text-white px-1.5 py-0.5 bg-white/5 rounded border border-white/10 ml-4 mr-1">ENTER</span> to select</div><div>VISION GLOBAL SEARCH</div></div></div></div></div>';

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
        '<div class="flex items-center gap-6 md:gap-8">' +
          '<nav class="hidden md:flex space-x-8 items-center">' +
            '<a href="index.html" class="' + isPlatformActive + ' hover:text-emerald-500 font-bold text-sm transition-all">Platform</a>' +
            '<a href="about.html" class="' + isAboutActive + ' hover:text-emerald-500 font-bold text-sm transition-all">About</a>' +
            '<a href="articles.html" class="' + isArticlesActive + ' hover:text-emerald-500 font-bold text-sm transition-all">Articles</a>' +
            '<a href="news.html" class="' + isNewsActive + ' hover:text-emerald-500 font-bold text-sm transition-all">News</a>' +
          '</nav>' +
          '<div class="flex items-center gap-4">' +
            '<button onclick="toggleSearch()" class="p-2.5 bg-gray-50 text-navy hover:text-emerald-500 rounded-xl border border-gray-100 transition-all group relative" title="Search (Ctrl+K)">' +
              '<svg class="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-width="2.5" stroke-linecap="round"></path></svg>' +
              '<span class="absolute -top-1 -right-1 flex h-2 w-2"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span></span>' +
            '</button>' +
            '<a href="https://visionedu.online" target="_blank" rel="noopener noreferrer" class="hidden sm:flex px-6 py-2.5 bg-navy text-white text-sm font-black rounded-xl hover:bg-emerald-500 hover:shadow-xl hover:shadow-emerald-500/20 transition-all active:scale-95 items-center gap-2">' +
              'Get Started' +
              '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M5 12h14M12 5l7 7-7 7"></path></svg>' +
            '</a>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>' +
  '</header>';
};

const getMobileNav = (page) => {
    const isArticles = page === 'articles.html';
    const navItems = isArticles ? 
        '<button onclick="filterArticles(\'all\')" id="m-tab-all" class="flex-1 py-3 px-2 rounded-2xl text-[10px] font-black uppercase tracking-tighter transition-all bg-emerald-500 text-white whitespace-nowrap">All Items</button>' +
        '<button onclick="filterArticles(\'student\')" id="m-tab-student" class="flex-1 py-3 px-2 rounded-2xl text-[10px] font-black uppercase tracking-tighter transition-all text-white/60 whitespace-nowrap">Students</button>' +
        '<button onclick="filterArticles(\'parent\')" id="m-tab-parent" class="flex-1 py-3 px-2 rounded-2xl text-[10px] font-black uppercase tracking-tighter transition-all text-white/60 whitespace-nowrap">Parents</button>' +
        '<div class="w-[1px] h-6 bg-white/10 mx-1"></div>' :
        '<a href="index.html" class="flex-1 py-3 px-2 text-center rounded-2xl text-[10px] font-black uppercase tracking-tighter transition-all ' + (page === 'index.html' ? 'bg-emerald-500 text-white' : 'text-white/60') + '">Home</a>' +
        '<a href="about.html" class="flex-1 py-3 px-2 text-center rounded-2xl text-[10px] font-black uppercase tracking-tighter transition-all ' + (page === 'about.html' ? 'bg-emerald-500 text-white' : 'text-white/60') + '">About</a>' +
        '<a href="articles.html" class="flex-1 py-3 px-2 text-center rounded-2xl text-[10px] font-black uppercase tracking-tighter transition-all ' + (page === 'articles.html' ? 'bg-emerald-500 text-white' : 'text-white/60') + '">Articles</a>' +
        '<a href="news.html" class="flex-1 py-3 px-2 text-center rounded-2xl text-[10px] font-black uppercase tracking-tighter transition-all ' + (page === 'news.html' ? 'bg-emerald-500 text-white' : 'text-white/60') + '">News</a>';

    return '<!-- Mobile Bottom Navigation --><div class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 md:hidden w-[90%] max-sm:w-[95%] max-w-sm"><div class="bg-navy/90 backdrop-blur-xl rounded-[2rem] border border-white/10 p-2 shadow-2xl flex items-center justify-between gap-1">' +
        navItems +
        '<button onclick="toggleSearch()" class="p-3 text-white/40 hover:text-white transition-colors relative"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-width="2.5" stroke-linecap="round"></path></svg><span class="absolute top-2 right-2 flex h-1.5 w-1.5"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span></span></button>' +
        '</div></div>';
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

const seamlessSwitcher = '<div class="hidden md:flex items-center justify-center mb-16"><div class="inline-flex p-1.5 bg-white rounded-[2rem] shadow-xl shadow-navy/5 border border-gray-100 backdrop-blur-xl"><button onclick="filterArticles(\'all\')" id="tab-all" class="px-10 py-3.5 rounded-[1.5rem] text-xs font-black uppercase tracking-widest transition-all bg-navy text-white shadow-lg shadow-navy/20">All Insights</button><button onclick="filterArticles(\'student\')" id="tab-student" class="px-10 py-3.5 rounded-[1.5rem] text-xs font-black uppercase tracking-widest transition-all text-gray-400 hover:text-navy">Student Hub</button><button onclick="filterArticles(\'parent\')" id="tab-parent" class="px-10 py-3.5 rounded-[1.5rem] text-xs font-black uppercase tracking-widest transition-all text-gray-400 hover:text-navy">Parent Hub</button></div></div>';

const footerHtml = '<footer class="bg-navy py-20 border-t border-white/5"><div class="max-w-7xl mx-auto px-4 text-center text-gray-400 font-bold text-sm">&copy; 2026 Vision Education. All rights reserved.</div></footer>';

const searchScriptTag = '<script src="search.js" defer></script>';

function buildSearchIndex() {
    const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.html') && !['404.html'].includes(f));
    const index = [];

    files.forEach(file => {
        const content = fs.readFileSync(file, 'utf8');
        const titleMatch = content.match(/<title>(.*?)<\/title>/);
        const descMatch = content.match(/<meta name="description" content="(.*?)"/);
        const h1Match = content.match(/<h1.*?>(.*?)<\/h1>/s);

        let title = (titleMatch ? titleMatch[1] : (h1Match ? h1Match[1].replace(/<.*?>/g, '').trim() : file)).split('|')[0].trim();
        let description = descMatch ? descMatch[1] : (h1Match ? h1Match[1].replace(/<.*?>/g, '').trim() : '');
        
        let category = 'Resource';
        if (file === 'index.html') category = 'Home';
        else if (file === 'articles.html') category = 'Archive';
        else if (file === 'news.html') category = 'Intelligence';
        else if (file === 'about.html') category = 'About';
        else if (content.includes('Masterclass Episode')) category = 'Podcast';
        else if (content.includes('Mastery Tracker') || content.includes('Daily Practice')) category = 'Practice';
        else category = 'Guide';

        index.push({ title, description, category, url: file });
    });

    fs.writeFileSync(path.join(__dirname, 'search-index.json'), JSON.stringify(index, null, 2));
    console.log('Search Index Rebuilt.');
}

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
  if (html.includes('<!-- Mobile Bottom Navigation -->')) {
    html = html.replace(/<!-- Mobile Bottom Navigation -->[\s\S]*?(?=<header|<section|<footer|<script|<\/body|$)/, mobileNav);
  } else {
    html = html.replace('</body>', mobileNav + '</body>');
  }

  if (basename === 'articles.html') {
      const hero = getPremiumHero("Latest Insights", "Explore research, syllabus breakdowns, and EdTech innovations shaping our future.");
      html = html.replace(/<section[\s\S]*?(?:Latest <span|\${title})[\s\S]*?<\/section>/, hero);
      html = html.replace(/<div class="hidden md:flex items-center (?:justify-between|justify-center) mb-16[\s\S]*?(?:ARCHIVE_V2\.0|<\/div>)[\s\S]*?<\/div>/, seamlessSwitcher);
  }

  html = html.replace(/(?:<!-- Newsletter Section -->\s*)+/g, '');
  if (html.includes('id="newsletter"')) {
    html = html.replace(/<section id="newsletter"[\s\S]*?<\/section>/, newsletterHtml);
  } else {
    html = html.replace('</body>', newsletterHtml + '</body>');
  }

  html = html.replace(/<footer[\s\S]*?<\/footer>/, footerHtml);

  // Search Integration
  if (!html.includes('id="search-modal"')) {
      html = html.replace('</body>', searchModalHtml + searchScriptTag + '</body>');
  } else {
      html = html.replace(/<div id="search-modal"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/, searchModalHtml);
  }

  fs.writeFileSync(file, html);
  console.log('Processed ' + file);
}

const filesToProcess = ['index.html', 'about.html', 'news.html', 'articles.html', 'core-math-2026.html', 'ai-test-prep.html', 'cs-integration.html', 'parent-guide.html'];
buildSearchIndex();
filesToProcess.forEach(processPage);
console.log('Search & Command Center Integration Complete.');
