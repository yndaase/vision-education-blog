// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize markdown-it with highlight.js
    const md = window.markdownit({
        html: true,
        linkify: true,
        typographer: true
    });

    // Function to highlight code blocks after markdown rendering
    function highlightCodeBlocks() {
        document.querySelectorAll('#preview pre code').forEach((block) => {
            window.hljs.highlightElement(block);
        });
    }

    // Editor elements
    const editor = document.getElementById('editor');
    const preview = document.getElementById('preview');
    const wordCountEl = document.getElementById('wordCount');
    const readTimeEl = document.getElementById('readTime');

    // Toolbar buttons
    const boldBtn = document.getElementById('boldBtn');
    const italicBtn = document.getElementById('italicBtn');
    const headerBtn = document.getElementById('headerBtn');
    const listBtn = document.getElementById('listBtn');
    const quoteBtn = document.getElementById('quoteBtn');
    const codeBtn = document.getElementById('codeBtn');
    const linkBtn = document.getElementById('linkBtn');
    const imageBtn = document.getElementById('imageBtn');

    // Action buttons
    const clearBtn = document.getElementById('clearBtn');
    const saveBtn = document.getElementById('saveBtn');

    // State
    let autoSaveTimeout;
    const AUTO_SAVE_DELAY = 30000; // 30 seconds
    const DRAFT_KEY = 'blog-draft-content';

    // Initialize editor content from auto-save if exists
    function initEditor() {
        const savedDraft = localStorage.getItem(DRAFT_KEY);
        if (savedDraft) {
            if (confirm('Restore previously saved draft?')) {
                editor.value = savedDraft;
                updatePreview();
                updateStats();
            } else {
                localStorage.removeItem(DRAFT_KEY);
            }
        }
    }

    // Update preview with markdown rendering
    function updatePreview() {
        const markdownText = editor.value;
        try {
            const html = md.render(markdownText);
            preview.innerHTML = html;
            highlightCodeBlocks();
        } catch (e) {
            preview.innerHTML = '<p class="error">Error rendering markdown: ' + e.message + '</p>';
            console.error(e);
        }
    }

    // Update word count and reading time
    function updateStats() {
        const text = editor.value.trim();
        let wordCount = 0;
        if (text) {
            // Match sequences of non-whitespace characters
            wordCount = text.match(/\S+/g).length;
        }
        const readTime = Math.max(1, Math.ceil(wordCount / 200)); // 200 WPM

        wordCountEl.textContent = wordCount;
        readTimeEl.textContent = `${readTime} min read`;
    }

    // Auto-save to localStorage
    function autoSave() {
        const content = editor.value;
        localStorage.setItem(DRAFT_KEY, content);
        // Optional: show a temporary indicator
        const originalSaveText = saveBtn.textContent;
        saveBtn.textContent = 'Saved!';
        setTimeout(() => {
            saveBtn.textContent = originalSaveText;
        }, 1500);
    }

    // Debounced auto-save
    function scheduleAutoSave() {
        clearTimeout(autoSaveTimeout);
        autoSaveTimeout = setTimeout(autoSave, AUTO_SAVE_DELAY);
    }

    // Insert text at cursor position
    function insertAtCursor(text) {
        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        const selected = editor.value.substring(start, end);
        const before = editor.value.substring(0, start);
        const after = editor.value.substring(end);

        editor.value = before + text + after;
        // Place cursor after inserted text (or preserve selection if replacing)
        const newPos = start + text.length;
        editor.selectionStart = newPos;
        editor.selectionEnd = newPos;
        editor.focus();
    }

    // Toolbar button handlers
    boldBtn.addEventListener('click', () => {
        insertAtCursor('**' + (editor.value.substring(editor.selectionStart, editor.selectionEnd) || 'bold text') + '**');
    });

    italicBtn.addEventListener('click', () => {
        insertAtCursor('*' + (editor.value.substring(editor.selectionStart, editor.selectionEnd) || 'italic text') + '*');
    });

    headerBtn.addEventListener('click', () => {
        const selected = editor.value.substring(editor.selectionStart, editor.selectionEnd);
        if (selected) {
            insertAtCursor('## ' + selected);
        } else {
            insertAtCursor('## ');
            // Position cursor after the space
            const pos = editor.selectionStart;
            editor.selectionStart = pos + 2;
            editor.selectionEnd = pos + 2;
        }
    });

    listBtn.addEventListener('click', () => {
        const selected = editor.value.substring(editor.selectionStart, editor.selectionEnd);
        if (selected) {
            insertAtCursor('- ' + selected);
        } else {
            insertAtCursor('- ');
        }
    });

    quoteBtn.addEventListener('click', () => {
        const selected = editor.value.substring(editor.selectionStart, editor.selectionEnd);
        if (selected) {
            insertAtCursor('> ' + selected);
        } else {
            insertAtCursor('> ');
        }
    });

    codeBtn.addEventListener('click', () => {
        const selected = editor.value.substring(editor.selectionStart, editor.selectionEnd);
        if (selected) {
            insertAtCursor('```\n' + selected + '\n```');
        } else {
            insertAtCursor('```\n\n```');
            // Position cursor inside the code block
            const pos = editor.selectionStart;
            editor.selectionStart = pos + 4;
            editor.selectionEnd = pos + 4;
        }
    });

    linkBtn.addEventListener('click', () => {
        const selected = editor.value.substring(editor.selectionStart, editor.selectionEnd);
        const url = prompt('Enter URL:', 'https://');
        if (url !== null) {
            const text = selected || 'link text';
            insertAtCursor(`[${text}](${url})`);
        }
    });

    imageBtn.addEventListener('click', () => {
        const selected = editor.value.substring(editor.selectionStart, editor.selectionEnd);
        const url = prompt('Enter image URL:', 'https://');
        const alt = prompt('Enter alt text:', selected || 'image description');
        if (url !== null && alt !== null) {
            insertAtCursor(`![${alt}](${url})`);
        }
    });

    // Clear draft
    clearBtn.addEventListener('click', () => {
        if (confirm('Clear the editor and discard any unsaved changes?')) {
            editor.value = '';
            localStorage.removeItem(DRAFT_KEY);
            updatePreview();
            updateStats();
        }
    });

    // Save as markdown file
    saveBtn.addEventListener('click', () => {
        const content = editor.value;
        if (!content.trim()) {
            alert('Cannot save an empty post!');
            return;
        }

        // Extract title from first line if it's a header, otherwise use timestamp
        let filename = 'blog-post';
        const firstLine = content.split('\n')[0];
        if (firstLine.startsWith('# ')) {
            filename = firstLine.substring(2).trim()
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '');
        } else {
            const date = new Date();
            filename = date.toISOString().slice(0,10); // YYYY-MM-DD
        }

        // Create blob and trigger download
        const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.md`;
        a.click();
        URL.revokeObjectURL(url);
    });

    // Event listeners
    editor.addEventListener('input', () => {
        updatePreview();
        updateStats();
        scheduleAutoSave();
    });

    // Initialization
    initEditor();
    updatePreview();
    updateStats();

    // Focus editor on load
    editor.focus();
});