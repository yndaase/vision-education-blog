document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Menu Toggle ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    const closeIcon = document.getElementById('close-icon');

    const toggleMenu = () => {
        const isOpen = !mobileMenu.classList.contains('hidden');
        if (!isOpen) {
            mobileMenu.classList.remove('hidden');
            menuIcon.classList.add('hidden');
            closeIcon.classList.remove('hidden');
        } else {
            mobileMenu.classList.add('hidden');
            menuIcon.classList.remove('hidden');
            closeIcon.classList.add('hidden');
        }
    };

    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', toggleMenu);

    // --- SPA Routing Logic ---
    const loadPage = async (url) => {
        // Show a simple loading state or progress bar if needed
        try {
            const response = await fetch(url);
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // Only update the main body content and title
            // Note: We avoid replacing the header/footer to keep the "App" state
            // However, for a simple static site, replacing the body content is often enough.
            // For a true SPA feel, we'd wrap content in a <main id="app"> tag.
            // Since we don't have that yet, we'll do a full swap of the main body content
            // but keep the scripts running.

            const newContent = doc.body.innerHTML;
            document.body.innerHTML = newContent;
            document.title = doc.title;
            
            // Re-initialize scripts for the new content
            initApp();
            
            // Scroll to top
            window.scrollTo(0, 0);
        } catch (error) {
            console.error('Failed to load page:', error);
            window.location.href = url; // Fallback to normal navigation
        }
    };

    const handleNewsletterForm = () => {
        const form = document.getElementById('newsletter-form');
        const successMessage = document.getElementById('newsletter-success');
        
        if (form && successMessage) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const emailInput = form.querySelector('input[type="email"]');
                const submitBtn = form.querySelector('button[type="submit"]');
                const email = emailInput.value;
                
                // Loading state
                const originalBtnText = submitBtn.innerText;
                submitBtn.disabled = true;
                submitBtn.innerText = 'Sending...';
                
                try {
                    const response = await fetch('/api/subscribe', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email })
                    });
                    
                    if (response.ok) {
                        form.style.display = 'none';
                        successMessage.classList.remove('hidden');
                    } else {
                        const errorBody = await response.json().catch(() => ({}));
                        console.error('API Error Response:', response.status, errorBody);
                        throw new Error(`Subscription failed: ${errorBody.error || response.statusText}`);
                    }
                } catch (error) {
                    console.error('Newsletter error detailed:', error);
                    alert(`Submission failed: ${error.message}. Please check if RESEND_API_KEY is set in Vercel.`);
                    submitBtn.disabled = false;
                    submitBtn.innerText = originalBtnText;
                }
            });
        }
    };

    const initApp = () => {
        // Re-attach listeners because document.body.innerHTML was replaced
        const internalLinks = document.querySelectorAll('a[href^="/"], a[href^="about"], a[href^="articles"]');
        internalLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.startsWith('http') || href.startsWith('mailto') || href.includes('visionedu.online')) return;
                
                e.preventDefault();
                const targetUrl = href === '/' ? 'index.html' : `${href}.html`;
                history.pushState(null, '', href);
                loadPage(targetUrl);
            });
        });

        // Re-attach mobile menu listeners
        const newMobileMenuBtn = document.getElementById('mobile-menu-btn');
        if (newMobileMenuBtn) newMobileMenuBtn.addEventListener('click', toggleMenu);
        
        // Handle Newsletter Form
        handleNewsletterForm();
        
        // Update Active States
        const currentPath = window.location.pathname.replace(/^\/|\/$/g, '') || '/';
        const allNavLinks = document.querySelectorAll('nav a, #mobile-menu a, .fixed.bottom-0 a');
        
        allNavLinks.forEach(link => {
            const linkPath = link.getAttribute('href').replace(/^\/|\/$/g, '') || '/';
            if (currentPath === linkPath) {
                link.classList.add('text-vibrantBlue');
                link.classList.remove('text-gray-400', 'text-gray-600');
            } else {
                link.classList.remove('text-vibrantBlue');
                // link.classList.add('text-gray-400');
            }
        });
    };

    // Initial run
    initApp();

    // Handle back/forward buttons
    window.addEventListener('popstate', () => {
        const path = window.location.pathname;
        const targetUrl = path === '/' ? 'index.html' : `${path.substring(1)}.html`;
        loadPage(targetUrl);
    });

    // --- Service Worker Registration (PWA) ---
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(reg => console.log('SW Registered', reg))
                .catch(err => console.log('SW Failed', err));
        });
    }
});
