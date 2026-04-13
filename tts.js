/**
 * Vision Education — Article Audio Reader
 * Handles Web Speech API with Chrome-specific bug workarounds:
 *   1. Voices may not be loaded at init time — wait for voiceschanged
 *   2. Chrome silently cancels utterances > ~15s — use a keep-alive interval
 *   3. Chrome on Android may need a slight delay before speak()
 */
(function () {
  const listenBtn    = document.getElementById('listen-btn');
  const ttsPlayer    = document.getElementById('tts-player');
  const ttsPlayPause = document.getElementById('tts-play-pause');
  const ttsStop      = document.getElementById('tts-stop');
  const ttsPlayIcon  = document.getElementById('tts-play-icon');
  const ttsPauseIcon = document.getElementById('tts-pause-icon');
  const ttsProgress  = document.getElementById('tts-progress');
  const ttsLabel     = document.getElementById('tts-label');
  const articleText  = document.getElementById('article-text');

  // Guard: hide button if browser has no TTS support
  if (!('speechSynthesis' in window)) {
    if (listenBtn) listenBtn.style.display = 'none';
    return;
  }

  let isPlaying       = false;
  let keepAliveTimer  = null;
  let currentUtterance = null;
  const totalChars    = articleText ? articleText.innerText.length : 1;

  // Accent color is inherited from the data-attr on the button
  const accentColor = listenBtn ? listenBtn.dataset.accent || '#10b981' : '#10b981';

  function getCleanText() {
    return articleText
      ? articleText.innerText.replace(/\s+/g, ' ').trim()
      : '';
  }

  function setListenBtnState(state) {
    const playIconSvg = `<svg class="w-5 h-5" style="color:${accentColor}" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>`;
    const pauseIconSvg = `<svg class="w-5 h-5" style="color:${accentColor}" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path></svg>`;
    if (state === 'listening') {
      listenBtn.innerHTML = pauseIconSvg + ' Listening...';
    } else if (state === 'done') {
      listenBtn.innerHTML = playIconSvg + ' Listen Again';
    } else {
      listenBtn.innerHTML = playIconSvg + ' Listen to Article';
    }
  }

  function stopKeepAlive() {
    if (keepAliveTimer) {
      clearInterval(keepAliveTimer);
      keepAliveTimer = null;
    }
  }

  function startKeepAlive() {
    stopKeepAlive();
    // Chrome bug: synthesis stops after ~15s of speaking. Pause+resume every 10s to reset it.
    keepAliveTimer = setInterval(() => {
      if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 10000);
  }

  function doSpeak(utterance) {
    // Chrome needs a tiny delay on some platforms
    setTimeout(() => {
      window.speechSynthesis.speak(utterance);
    }, 100);
  }

  function startReading() {
    window.speechSynthesis.cancel();
    stopKeepAlive();

    const text = getCleanText();
    if (!text) return;

    currentUtterance = new SpeechSynthesisUtterance(text);
    currentUtterance.rate  = 0.92;
    currentUtterance.pitch = 1;
    currentUtterance.lang  = 'en-GH';

    // Try to pick an English voice
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => v.lang.startsWith('en') && !v.localService === false)
                   || voices.find(v => v.lang.startsWith('en'))
                   || voices[0];
    if (preferred) currentUtterance.voice = preferred;

    currentUtterance.onboundary = (e) => {
      if (e.name === 'word' && ttsProgress) {
        const pct = Math.min(100, (e.charIndex / totalChars) * 100);
        ttsProgress.style.width = pct + '%';
      }
    };

    currentUtterance.onend = () => {
      isPlaying = false;
      stopKeepAlive();
      if (ttsPlayIcon)  ttsPlayIcon.classList.remove('hidden');
      if (ttsPauseIcon) ttsPauseIcon.classList.add('hidden');
      if (ttsProgress)  ttsProgress.style.width = '100%';
      if (ttsLabel)     ttsLabel.textContent = 'Finished reading';
      setListenBtnState('done');
    };

    currentUtterance.onerror = (e) => {
      if (e.error === 'interrupted' || e.error === 'canceled') return; // expected on stop
      console.warn('[TTS] Error:', e.error);
      isPlaying = false;
      stopKeepAlive();
      if (ttsLabel) ttsLabel.textContent = 'Audio unavailable in this browser';
    };

    isPlaying = true;

    // Wait for voices if not yet loaded (Chrome async loading)
    const voices2 = window.speechSynthesis.getVoices();
    if (voices2.length > 0) {
      doSpeak(currentUtterance);
      startKeepAlive();
    } else {
      window.speechSynthesis.addEventListener('voiceschanged', function onVoicesReady() {
        window.speechSynthesis.removeEventListener('voiceschanged', onVoicesReady);
        const v2 = window.speechSynthesis.getVoices();
        const pref = v2.find(v => v.lang.startsWith('en')) || v2[0];
        if (pref) currentUtterance.voice = pref;
        doSpeak(currentUtterance);
        startKeepAlive();
      });
    }
  }

  // --- Listen Button ---
  listenBtn && listenBtn.addEventListener('click', () => {
    if (isPlaying) {
      // Toggle pause
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        isPlaying = true;
        if (ttsPlayIcon)  ttsPlayIcon.classList.add('hidden');
        if (ttsPauseIcon) ttsPauseIcon.classList.remove('hidden');
        setListenBtnState('listening');
      } else {
        window.speechSynthesis.pause();
        isPlaying = false;
        if (ttsPlayIcon)  ttsPlayIcon.classList.remove('hidden');
        if (ttsPauseIcon) ttsPauseIcon.classList.add('hidden');
        setListenBtnState('idle');
      }
      return;
    }

    ttsPlayer.classList.add('visible');
    if (ttsLabel)    ttsLabel.textContent = 'Reading article…';
    if (ttsProgress) ttsProgress.style.width = '0%';
    if (ttsPlayIcon)  ttsPlayIcon.classList.add('hidden');
    if (ttsPauseIcon) ttsPauseIcon.classList.remove('hidden');
    setListenBtnState('listening');
    startReading();
  });

  // --- Floating Player Play/Pause ---
  ttsPlayPause && ttsPlayPause.addEventListener('click', () => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      isPlaying = true;
      if (ttsPlayIcon)  ttsPlayIcon.classList.add('hidden');
      if (ttsPauseIcon) ttsPauseIcon.classList.remove('hidden');
    } else if (isPlaying) {
      window.speechSynthesis.pause();
      isPlaying = false;
      if (ttsPlayIcon)  ttsPlayIcon.classList.remove('hidden');
      if (ttsPauseIcon) ttsPauseIcon.classList.add('hidden');
    } else {
      // Restart from beginning
      if (ttsProgress) ttsProgress.style.width = '0%';
      if (ttsLabel)    ttsLabel.textContent = 'Reading article…';
      if (ttsPlayIcon)  ttsPlayIcon.classList.add('hidden');
      if (ttsPauseIcon) ttsPauseIcon.classList.remove('hidden');
      setListenBtnState('listening');
      startReading();
    }
  });

  // --- Stop Button ---
  ttsStop && ttsStop.addEventListener('click', () => {
    window.speechSynthesis.cancel();
    isPlaying = false;
    stopKeepAlive();
    ttsPlayer.classList.remove('visible');
    if (ttsProgress) ttsProgress.style.width = '0%';
    setListenBtnState('idle');
  });

  // Cleanup on page navigate
  window.addEventListener('beforeunload', () => {
    window.speechSynthesis.cancel();
    stopKeepAlive();
  });
})();
