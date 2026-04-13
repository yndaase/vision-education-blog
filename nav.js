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
                const roleInput = form.querySelector('input[name="role"]:checked');
                const email = emailInput.value;
                const role = roleInput ? roleInput.value : 'student';
                
                // Loading state
                const originalBtnText = submitBtn.innerText;
                submitBtn.disabled = true;
                submitBtn.innerText = 'Sending...';
                
                try {
                    const response = await fetch('/api/subscribe', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, role })
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

    const handleDailyChallenge = () => {
        const options = document.querySelectorAll('.challenge-option');
        const feedback = document.getElementById('challenge-feedback');
        const optionsContainer = document.getElementById('challenge-options');
        const feedbackBox = document.getElementById('feedback-box');
        const feedbackIcon = document.getElementById('feedback-icon');
        const feedbackTitle = document.getElementById('feedback-title');
        const feedbackText = document.getElementById('feedback-text');

        if (!options.length || !feedback) return;

        options.forEach(option => {
            option.addEventListener('click', () => {
                const isCorrect = option.getAttribute('data-correct') === 'true';
                
                // Hide options
                optionsContainer.classList.add('hidden');
                
                // Show feedback
                feedback.classList.remove('hidden');
                
                if (isCorrect) {
                    feedbackBox.className = 'p-8 rounded-3xl flex flex-col items-center text-center bg-emerald-50 border border-emerald-100';
                    feedbackIcon.className = 'w-16 h-16 rounded-full flex items-center justify-center mb-6 bg-emerald-500 text-white text-2xl';
                    feedbackIcon.innerHTML = '✓';
                    feedbackTitle.innerText = 'Brilliant! Correct Answer.';
                    feedbackTitle.className = 'text-2xl font-black mb-3 text-emerald-700';
                    feedbackText.innerText = 'You definitely have a Vision for excellence. Only 2% of students solve this on their first try.';
                } else {
                    feedbackBox.className = 'p-8 rounded-3xl flex flex-col items-center text-center bg-rose-50 border border-rose-100';
                    feedbackIcon.className = 'w-16 h-16 rounded-full flex items-center justify-center mb-6 bg-rose-500 text-white text-2xl';
                    feedbackIcon.innerHTML = '✕';
                    feedbackTitle.innerText = 'Not quite! Mathematics is about the journey.';
                    feedbackTitle.className = 'text-2xl font-black mb-3 text-rose-700';
                    feedbackText.innerText = 'Don\'t worry, the detailed explanation and 20,000+ similar questions are waiting for you.';
                }
            });
        });
    };

    let globalAudio = null;
    let isGlobalPlaying = false;

    const handlePodcastPlayer = () => {
        const playBtn = document.getElementById('play-btn');
        const tracks = document.querySelectorAll('.podcast-track');
        const progress = document.getElementById('player-progress');
        const timeDisplay = document.getElementById('player-time');
        const durationDisplay = document.getElementById('player-duration');
        const playIcon = document.getElementById('play-icon');
        const pauseIcon = document.getElementById('pause-icon');
        const titleDisplay = document.getElementById('current-track-title');
        const authorDisplay = document.getElementById('current-track-author');
        const disc = document.getElementById('disc-cover');

        if (!playBtn) return;

        const updateUI = () => {
            if (isGlobalPlaying) {
                playIcon.classList.add('hidden');
                pauseIcon.classList.remove('hidden');
                disc.classList.add('animate-[spin_10s_linear_infinite]');
            } else {
                playIcon.classList.remove('hidden');
                pauseIcon.classList.add('hidden');
                disc.classList.remove('animate-[spin_10s_linear_infinite]');
            }
        };

        const formatTime = (secs) => {
            if (isNaN(secs)) return "0:00";
            const mins = Math.floor(secs / 60);
            const s = Math.floor(secs % 60);
            return `${mins}:${s < 10 ? '0' : ''}${s}`;
        };

        const loadTrack = (url, title, author) => {
            if (globalAudio) {
                globalAudio.pause();
                globalAudio = null;
            }
            globalAudio = new Audio(url);
            titleDisplay.innerText = title;
            authorDisplay.innerText = author;
            
            globalAudio.addEventListener('loadedmetadata', () => {
                durationDisplay.innerText = formatTime(globalAudio.duration);
            });

            globalAudio.addEventListener('timeupdate', () => {
                const percent = (globalAudio.currentTime / globalAudio.duration) * 100;
                if (progress) progress.style.width = `${percent}%`;
                if (timeDisplay) timeDisplay.innerText = formatTime(globalAudio.currentTime);
            });

            globalAudio.addEventListener('ended', () => {
                isGlobalPlaying = false;
                updateUI();
                if (progress) progress.style.width = '0%';
            });

            if (isGlobalPlaying) globalAudio.play().catch(e => console.warn("Autoplay blocked"));
        };

        if (!globalAudio && tracks.length > 0) {
            const first = tracks[0];
            loadTrack(first.dataset.url, first.dataset.title, first.dataset.author);
        }

        playBtn.addEventListener('click', () => {
            if (!globalAudio) return;
            if (isGlobalPlaying) {
                globalAudio.pause();
            } else {
                globalAudio.play().catch(e => console.warn("Play failed"));
            }
            isGlobalPlaying = !isGlobalPlaying;
            updateUI();
        });

        tracks.forEach(track => {
            track.addEventListener('click', trackHandler);
        });

        function trackHandler() {
            tracks.forEach(t => t.classList.remove('bg-white/5', 'border-emerald-500/30'));
            this.classList.add('bg-white/5', 'border-emerald-500/30');
            isGlobalPlaying = true;
            loadTrack(this.dataset.url, this.dataset.title, this.dataset.author);
            updateUI();
        }

        updateUI();
    };

    const initApp = () => {
        // Re-attach listeners because document.body.innerHTML was replaced
        const internalLinks = document.querySelectorAll('a[href^="/"], a[href*=".html"], a[href^="about"], a[href^="articles"]');
        internalLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.startsWith('http') || href.startsWith('mailto') || href.includes('visionedu.online')) return;
                
                e.preventDefault();
                const targetUrl = href === '/' ? 'index.html' : (href.endsWith('.html') ? href : `${href}.html`);
                history.pushState(null, '', href);
                loadPage(targetUrl);
            });
        });

        // Re-attach mobile menu listeners
        const newMobileMenuBtn = document.getElementById('mobile-menu-btn');
        if (newMobileMenuBtn) newMobileMenuBtn.addEventListener('click', toggleMenu);
        
        // Handle Newsletter Form
        handleNewsletterForm();
        
        // Handle Daily Challenge
        handleDailyChallenge();
        
        // Handle Podcast Academy
        handlePodcastPlayer();
        
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
