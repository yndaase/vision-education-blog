(function() {
    // ──────────────────────────────────────────────────────────────────────────
    // Vision Intelligence Pro Chatbot
    // ──────────────────────────────────────────────────────────────────────────

    // 1. Inject Styles
    const styles = `
        #vision-chat-container {
            position: fixed !important;
            bottom: 2rem !important;
            right: 2rem !important;
            z-index: 2147483647 !important;
            font-family: 'Outfit', sans-serif;
        }

        #chat-fab {
            width: 60px;
            height: 60px;
            background: #10b981;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 10px 25px rgba(16, 185, 129, 0.4);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
        }

        #chat-fab:hover {
            transform: scale(1.1) translateY(-5px);
            box-shadow: 0 15px 30px rgba(16, 185, 129, 0.6);
        }

        #chat-fab .pulse {
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background: #10b981;
            opacity: 0.5;
            animation: fab-pulse 2s infinite;
        }

        @keyframes fab-pulse {
            0% { transform: scale(1); opacity: 0.5; }
            100% { transform: scale(1.5); opacity: 0; }
        }

        #chat-window {
            position: absolute;
            bottom: 80px;
            right: 0;
            width: 380px;
            height: 550px;
            max-height: calc(100vh - 120px);
            background: rgba(10, 15, 26, 0.95);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 2rem;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            box-shadow: 0 25px 50px rgba(0,0,0,0.5);
            transform: translateY(20px) scale(0.9);
            opacity: 0;
            pointer-events: none;
            transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        #chat-window.open {
            transform: translateY(0) scale(1);
            opacity: 1;
            pointer-events: auto;
        }

        #chat-header {
            padding: 1.5rem;
            background: linear-gradient(to right, rgba(16, 185, 129, 0.1), rgba(99, 102, 241, 0.1));
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        #chat-header h3 {
            margin: 0;
            font-size: 1.1rem;
            font-weight: 800;
            color: #fff;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .pro-badge {
            font-size: 0.6rem;
            background: #6366f1;
            color: white;
            padding: 2px 6px;
            border-radius: 4px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        #chat-messages {
            flex: 1;
            padding: 1.5rem;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 1rem;
            scrollbar-width: thin;
            scrollbar-color: rgba(255,255,255,0.1) transparent;
        }

        .message {
            max-width: 85%;
            padding: 0.8rem 1.2rem;
            border-radius: 1.2rem;
            font-size: 0.9rem;
            line-height: 1.5;
            animation: msg-in 0.3s ease-out forwards;
        }

        @keyframes msg-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .message.user {
            align-self: flex-end;
            background: #6366f1;
            color: white;
            border-bottom-right-radius: 4px;
        }

        .message.ai {
            align-self: flex-start;
            background: rgba(255, 255, 255, 0.05);
            color: #e2e8f0;
            border-bottom-left-radius: 4px;
            border: 1px solid rgba(255,255,255,0.05);
        }

        #chat-input-area {
            padding: 1.2rem;
            background: rgba(255,255,255,0.02);
            border-top: 1px solid rgba(255,255,255,0.05);
        }

        #chat-form {
            display: flex;
            gap: 0.8rem;
        }

        #chat-input {
            flex: 1;
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 1rem;
            padding: 0.7rem 1rem;
            color: white;
            outline: none;
            font-size: 0.9rem;
            transition: border-color 0.3s;
        }

        #chat-input:focus {
            border-color: #10b981;
        }

        #chat-submit {
            background: #10b981;
            border: none;
            color: #05080f;
            width: 40px;
            height: 40px;
            border-radius: 0.8rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
        }

        #chat-submit:hover {
            transform: scale(1.05);
            background: #34d399;
        }

        #chat-submit:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        /* Thinking animation */
        .typing-dot {
            width: 6px;
            height: 6px;
            background: #aaa;
            border-radius: 50%;
            display: inline-block;
            margin: 0 1px;
            animation: typing 1.4s infinite;
        }
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes typing {
            0%, 60%, 100% { transform: translateY(0); }
            30% { transform: translateY(-4px); }
        }

        @media (max-width: 500px) {
            #vision-chat-container {
                bottom: 6rem !important;
            }
            #chat-window {
                width: calc(100vw - 40px);
                right: -20px;
                bottom: 80px;
            }
        }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.appendChild(document.createTextNode(styles));
    document.head.appendChild(styleSheet);

    console.log("Vision Intelligence Pro Chatbot Initializing...");

    // 2. Create UI Elements
    if (document.getElementById('vision-chat-container')) return;
    
    const container = document.createElement('div');
    container.id = 'vision-chat-container';
    container.innerHTML = `
        <div id="chat-window">
            <div id="chat-header">
                <h3>V <span class="pro-badge">Pro AI</span></h3>
                <button id="close-chat" style="background:transparent; border:none; color:#666; cursor:pointer;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"></path></svg>
                </button>
            </div>
            <div id="chat-messages">
                <div class="message ai">
                    Hello! I'm Vision AI, your Senior WASSCE Academic Assistant. How can I help you excel today?
                </div>
            </div>
            <div id="chat-input-area">
                <form id="chat-form">
                    <input type="text" id="chat-input" placeholder="Ask anything about WASSCE..." autocomplete="off">
                    <button type="submit" id="chat-submit">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"></path></svg>
                    </button>
                </form>
            </div>
        </div>
        <div id="chat-fab">
            <div class="pulse"></div>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
        </div>
    `;
    if (document.body) {
        document.body.appendChild(container);
    } else {
        window.addEventListener('DOMContentLoaded', () => document.body.appendChild(container));
    }

    // 3. Logic
    const fab = document.getElementById('chat-fab');
    const windowEl = document.getElementById('chat-window');
    const closeBtn = document.getElementById('close-chat');
    const form = document.getElementById('chat-form');
    const input = document.getElementById('chat-input');
    const messageContainer = document.getElementById('chat-messages');
    const submitBtn = document.getElementById('chat-submit');

    let history = []; // To maintain conversation context

    fab.addEventListener('click', () => {
        windowEl.classList.toggle('open');
        if (windowEl.classList.contains('open')) input.focus();
    });

    closeBtn.addEventListener('click', () => {
        windowEl.classList.remove('open');
    });

    const addMessage = (text, sender) => {
        const msg = document.createElement('div');
        msg.className = `message ${sender}`;
        msg.innerText = text;
        messageContainer.appendChild(msg);
        messageContainer.scrollTop = messageContainer.scrollHeight;
    };

    const showTyping = () => {
        const typing = document.createElement('div');
        typing.id = 'typing-indicator';
        typing.className = 'message ai';
        typing.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
        messageContainer.appendChild(typing);
        messageContainer.scrollTop = messageContainer.scrollHeight;
        return typing;
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const text = input.value.trim();
        if (!text) return;

        input.value = '';
        addMessage(text, 'user');
        history.push({ role: 'user', content: text });

        const typingIndicator = showTyping();
        submitBtn.disabled = true;

        try {
            const response = await fetch('https://www.visionedu.site/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: history })
            });

            const data = await response.json();
            typingIndicator.remove();

            if (data.message) {
                addMessage(data.message.content, 'ai');
                history.push(data.message);
            } else {
                addMessage("I'm having trouble connecting right now. Please try again later.", 'ai');
            }
        } catch (error) {
            console.error('Chat error:', error);
            typingIndicator.remove();
            addMessage("Something went wrong. Please check your connection.", 'ai');
        } finally {
            submitBtn.disabled = false;
        }
    });

})();
