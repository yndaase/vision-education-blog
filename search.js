let searchIndex = [];
let selectedIndex = -1;

async function loadSearchIndex() {
    if (searchIndex.length > 0) return;
    try {
        const response = await fetch('search-index.json');
        searchIndex = await response.json();
    } catch (err) {
        console.error('Failed to load search index:', err);
    }
}

function toggleSearch() {
    const modal = document.getElementById('search-modal');
    const input = document.getElementById('search-input');
    
    if (modal.classList.contains('hidden')) {
        modal.classList.remove('hidden');
        loadSearchIndex();
        setTimeout(() => input.focus(), 100);
        document.body.style.overflow = 'hidden';
    } else {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
        input.value = '';
        document.getElementById('search-results').innerHTML = '';
        selectedIndex = -1;
    }
}

document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        toggleSearch();
    }
    if (e.key === 'Escape') {
        const modal = document.getElementById('search-modal');
        if (!modal.classList.contains('hidden')) toggleSearch();
    }

    const modal = document.getElementById('search-modal');
    if (modal.classList.contains('hidden')) return;

    const results = document.querySelectorAll('.search-result-item');
    if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedIndex = Math.min(selectedIndex + 1, results.length - 1);
        updateSelection(results);
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIndex = Math.max(selectedIndex - 1, 0);
        updateSelection(results);
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
        e.preventDefault();
        results[selectedIndex].click();
    }
});

function updateSelection(results) {
    results.forEach((el, idx) => {
        if (idx === selectedIndex) {
            el.classList.add('bg-white/5', 'border-emerald/50');
            el.scrollIntoView({ block: 'nearest' });
        } else {
            el.classList.remove('bg-white/5', 'border-emerald/50');
        }
    });
}

document.getElementById('search-input').addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const resultsContainer = document.getElementById('search-results');
    
    if (!query) {
        resultsContainer.innerHTML = '';
        selectedIndex = -1;
        return;
    }

    const filtered = searchIndex.filter(item => 
        item.title.toLowerCase().includes(query) || 
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
    ).slice(0, 8);

    resultsContainer.innerHTML = filtered.map((item, idx) => `
        <a href="${item.url}" class="search-result-item block p-4 rounded-2xl border border-white/5 transition-all hover:bg-white/5 group">
            <div class="flex items-center justify-between mb-1">
                <span class="text-[10px] font-black uppercase tracking-widest text-emerald">${item.category}</span>
                <svg class="w-4 h-4 text-white/20 group-hover:text-emerald transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" stroke-width="3" stroke-linecap="round"></path></svg>
            </div>
            <h4 class="text-white font-bold group-hover:text-emerald-light transition-colors">${item.title}</h4>
            <p class="text-xs text-gray-500 line-clamp-1">${item.description}</p>
        </a>
    `).join('');

    selectedIndex = filtered.length > 0 ? 0 : -1;
    if (selectedIndex >= 0) {
        setTimeout(() => updateSelection(document.querySelectorAll('.search-result-item')), 10);
    }
});
