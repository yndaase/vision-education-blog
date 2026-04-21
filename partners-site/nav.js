    // Vision AI Chatbot Injection (Global Failsafe)
    function injectChat() {
        if (document.body) {
            const chatScript = document.createElement('script');
            chatScript.src = 'https://www.visionedu.site/assets/js/chat.js';
            chatScript.defer = true;
            document.body.appendChild(chatScript);
        } else {
            setTimeout(injectChat, 10);
        }
    }
    injectChat();

document.addEventListener('DOMContentLoaded', () => {

    // ─────────────────────────────────────────
    // Mobile Menu Toggle
    // ─────────────────────────────────────────
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu    = document.getElementById('mobile-menu');
    const menuIcon      = document.getElementById('menu-icon');
    const closeIcon     = document.getElementById('close-icon');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            const isOpen = !mobileMenu.classList.contains('hidden');
            mobileMenu.classList.toggle('hidden', isOpen);
            menuIcon  && menuIcon.classList.toggle('hidden', !isOpen);
            closeIcon && closeIcon.classList.toggle('hidden', isOpen);
        });
    }

    // ─────────────────────────────────────────
    // Active Nav Link Highlight
    // ─────────────────────────────────────────
    const currentFile = window.location.pathname.split('/').pop() || 'index.html';
    const allNavLinks = document.querySelectorAll('nav a, #mobile-menu a, .fixed.bottom-0 a');
    allNavLinks.forEach(link => {
        const linkHref    = link.getAttribute('href') || '';
        const linkFile    = linkHref.replace('.html', '');
        const currentBase = currentFile.replace('.html', '');
        if (
            linkFile === currentBase ||
            (currentBase === '' && linkFile === '/') ||
            (currentBase === 'index' && linkFile === '/')
        ) {
            link.classList.add('text-vibrantBlue');
            link.classList.remove('text-gray-400', 'text-gray-600');
        }
    });

    // ─────────────────────────────────────────
    // Newsletter Form
    // ─────────────────────────────────────────
    const form           = document.getElementById('newsletter-form');
    const successMessage = document.getElementById('newsletter-success');

    if (form && successMessage) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const emailInput  = form.querySelector('input[type="email"]');
            const submitBtn   = form.querySelector('button[type="submit"]');
            const roleInput   = document.getElementById('newsletter-role'); // Refined for hidden input
            const email       = emailInput ? emailInput.value : '';
            const role        = roleInput  ? roleInput.value  : 'student';

            const originalText  = submitBtn.innerText;
            submitBtn.disabled  = true;
            submitBtn.innerText = 'Sending...';

            try {
                const response = await fetch('/api/subscribe', {
                    method:  'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body:    JSON.stringify({ email, role })
                });

                if (response.ok) {
                    form.style.display = 'none';
                    successMessage.classList.remove('hidden');
                } else {
                    const err = await response.json().catch(() => ({}));
                    throw new Error(err.error || response.statusText);
                }
            } catch (error) {
                console.error('Newsletter error:', error);
                
                // If in a static/dev environment without serverless functions,
                // we'll still show success for the demo, but log the failure
                if (window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1')) {
                    form.style.display = 'none';
                    successMessage.classList.remove('hidden');
                } else {
                    alert(`Submission failed: ${error.message}. Please try again later.`);
                    submitBtn.disabled  = false;
                    submitBtn.innerText = originalText;
                }
            }
        });
    }

    // ─────────────────────────────────────────
    // Daily Challenge
    // ─────────────────────────────────────────
    const options            = document.querySelectorAll('.challenge-option');
    const challengeFeedback  = document.getElementById('challenge-feedback');
    const optionsContainer   = document.getElementById('challenge-options');
    const feedbackBox        = document.getElementById('feedback-box');
    const feedbackIcon       = document.getElementById('feedback-icon');
    const feedbackTitle      = document.getElementById('feedback-title');
    const feedbackText       = document.getElementById('feedback-text');

    if (options.length && challengeFeedback) {
        options.forEach(option => {
            option.addEventListener('click', () => {
                const isCorrect = option.getAttribute('data-correct') === 'true';
                optionsContainer && optionsContainer.classList.add('hidden');
                challengeFeedback.classList.remove('hidden');

                if (isCorrect) {
                    feedbackBox.className   = 'p-8 rounded-3xl flex flex-col items-center text-center bg-emerald-50 border border-emerald-100';
                    feedbackIcon.className  = 'w-16 h-16 rounded-full flex items-center justify-center mb-6 bg-emerald-500 text-white text-2xl';
                    feedbackIcon.innerHTML  = '✓';
                    feedbackTitle.innerText = 'Brilliant! Correct Answer.';
                    feedbackTitle.className = 'text-2xl font-black mb-3 text-emerald-700';
                    feedbackText.innerText  = 'You definitely have a Vision for excellence. Only 2% of students solve this on their first try.';
                } else {
                    feedbackBox.className   = 'p-8 rounded-3xl flex flex-col items-center text-center bg-rose-50 border border-rose-100';
                    feedbackIcon.className  = 'w-16 h-6 rounded-full flex items-center justify-center mb-6 bg-rose-500 text-white text-2xl';
                    feedbackIcon.innerHTML  = '✕';
                    feedbackTitle.innerText = 'Not quite! Mathematics is about the journey.';
                    feedbackTitle.className = 'text-2xl font-black mb-3 text-rose-700';
                    feedbackText.innerText  = "Don't worry, the detailed explanation and 20,000+ similar questions are waiting for you.";
                }
            });
        });
    }

    // ─────────────────────────────────────────
    // Podcast Player
    // ─────────────────────────────────────────
    let globalAudio     = null;
    let isGlobalPlaying = false;

    const playBtn         = document.getElementById('play-btn');
    const tracks          = document.querySelectorAll('.podcast-track');
    const progressBar     = document.getElementById('player-progress');
    const timeDisplay     = document.getElementById('player-time');
    const durationDisplay = document.getElementById('player-duration');
    const playIcon        = document.getElementById('play-icon');
    const pauseIcon       = document.getElementById('pause-icon');
    const titleDisplay    = document.getElementById('current-track-title');
    const authorDisplay   = document.getElementById('current-track-author');
    const disc            = document.getElementById('disc-cover');
    const seeker          = document.getElementById('player-seeker');

    if (playBtn) {
        const formatTime = (secs) => {
            if (isNaN(secs)) return '0:00';
            const m = Math.floor(secs / 60);
            const s = Math.floor(secs % 60);
            return `${m}:${s < 10 ? '0' : ''}${s}`;
        };

        const updatePlayerUI = () => {
            if (isGlobalPlaying) {
                playIcon  && playIcon.classList.add('hidden');
                pauseIcon && pauseIcon.classList.remove('hidden');
                disc      && disc.classList.add('animate-[spin_10s_linear_infinite]');
            } else {
                playIcon  && playIcon.classList.remove('hidden');
                pauseIcon && pauseIcon.classList.add('hidden');
                disc      && disc.classList.remove('animate-[spin_10s_linear_infinite]');
            }
        };

        const loadTrack = (url, title, author) => {
            if (globalAudio) { globalAudio.pause(); globalAudio = null; }
            globalAudio = new Audio(url);
            if (titleDisplay)  titleDisplay.innerText  = title;
            if (authorDisplay) authorDisplay.innerText = author;

            globalAudio.addEventListener('loadedmetadata', () => {
                if (durationDisplay) durationDisplay.innerText = formatTime(globalAudio.duration);
            });
            globalAudio.addEventListener('timeupdate', () => {
                const pct = (globalAudio.currentTime / globalAudio.duration) * 100;
                if (progressBar) progressBar.style.width  = `${pct}%`;
                if (timeDisplay) timeDisplay.innerText    = formatTime(globalAudio.currentTime);
            });
            globalAudio.addEventListener('ended', () => {
                isGlobalPlaying = false;
                updatePlayerUI();
                if (progressBar) progressBar.style.width = '0%';
            });

            if (isGlobalPlaying) globalAudio.play().catch(() => {});
        };

        if (seeker) {
            seeker.addEventListener('click', (e) => {
                if (!globalAudio || !globalAudio.duration) return;
                const rect    = seeker.getBoundingClientRect();
                const percent = (e.clientX - rect.left) / rect.width;
                globalAudio.currentTime = percent * globalAudio.duration;
            });
        }

        if (tracks.length > 0) {
            const first = tracks[0];
            loadTrack(first.dataset.url, first.dataset.title, first.dataset.author);
        }

        playBtn.addEventListener('click', () => {
            if (!globalAudio) return;
            if (isGlobalPlaying) { globalAudio.pause(); } 
            else { globalAudio.play().catch(() => {}); }
            isGlobalPlaying = !isGlobalPlaying;
            updatePlayerUI();
        });

        tracks.forEach(track => {
            track.addEventListener('click', function () {
                tracks.forEach(t => t.classList.remove('bg-white/5', 'border-emerald-500/30'));
                this.classList.add('bg-white/5', 'border-emerald-500/30');
                isGlobalPlaying = true;
                loadTrack(this.dataset.url, this.dataset.title, this.dataset.author);
                updatePlayerUI();
            });
        });

        updatePlayerUI();
    }

    // ─────────────────────────────────────────
    // Native Share Button Logic
    // ─────────────────────────────────────────
    const shareBtn = document.getElementById('share-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', async () => {
            const shareData = {
                title: document.title,
                text: document.querySelector('meta[name="description"]')?.content || 'Check out this article from Vision Education',
                url: window.location.href,
            };

            // 1. Try Native Share (Mobile)
            if (navigator.share) {
                try {
                    await navigator.share(shareData);
                    return; // Success
                } catch (err) {
                    if (err.name !== 'AbortError') console.error('Share failed:', err);
                }
            }

            // 2. Try Clipboard API (Modern Desktop)
            try {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    await navigator.clipboard.writeText(shareData.url);
                    showCopySuccess(shareBtn);
                    return;
                }
            } catch (err) {
                console.warn('Clipboard API failed, trying fallback');
            }

            // 3. Absolute Fallback (Invisible Input)
            try {
                const input = document.createElement('input');
                input.value = shareData.url;
                document.body.appendChild(input);
                input.select();
                document.execCommand('copy');
                document.body.removeChild(input);
                showCopySuccess(shareBtn);
            } catch (err) {
                alert('Please copy the URL to share: ' + shareData.url);
            }
        });
    }

    function showCopySuccess(btn) {
        const originalHTML = btn.innerHTML;
        btn.innerHTML = `<svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Copied!`;
        btn.classList.add('border-emerald-500/50');
        setTimeout(() => { 
            btn.innerHTML = originalHTML; 
            btn.classList.remove('border-emerald-500/50');
        }, 2000);
    }

    // ─────────────────────────────────────────
    // Service Worker (PWA)
    // ─────────────────────────────────────────
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(reg => console.log('SW registered', reg))
                .catch(err => console.warn('SW failed', err));
        });
    }
});


