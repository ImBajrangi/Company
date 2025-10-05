/**
 * Quick Notes Bar - A simple, lightweight notes widget for any website
 * Version: 1.0.0
 * Author: Vrindopnishad
 */

(function() {
    // Create and inject styles
    function injectStyles() {
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            :root {
                --notes-bg: #ffffff;
                --notes-text: #333333;
                --notes-accent: #4a6cf7;
                --notes-accent-rgb: 74, 108, 247;
                --notes-accent-hover: #3a5ce6;
                --notes-border: #e0e0e0;
                --notes-shadow: rgba(0, 0, 0, 0.1);
            }

            body.dark-mode {
                --notes-bg: #1a1a1a;
                --notes-text: #f0f0f0;
                --notes-accent: #6a8cff;
                --notes-accent-rgb: 106, 140, 255;
                --notes-accent-hover: #5a7cef;
                --notes-border: #333333;
                --notes-shadow: rgba(0, 0, 0, 0.3);
            }

            .quick-notes-bar {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 300px;
                background: var(--notes-bg);
                border-radius: 10px;
                box-shadow: 0 4px 15px var(--notes-shadow);
                z-index: 9999;
                font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                transition: all 0.3s ease;
                border: 1px solid var(--notes-border);
                overflow: hidden;
            }

            .quick-notes-bar.collapsed {
                width: 50px;
                height: 50px;
                border-radius: 50%;
            }

            .quick-notes-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px 15px;
                background: var(--notes-accent);
                color: white;
                cursor: pointer;
            }

            .quick-notes-header h3 {
                margin: 0;
                font-size: 14px;
                font-weight: 500;
            }

            .quick-notes-header .quick-notes-toggle {
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                font-size: 16px;
                padding: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                transition: background 0.2s;
            }

            .quick-notes-header .quick-notes-toggle:hover {
                background: rgba(255, 255, 255, 0.2);
            }

            .quick-notes-content {
                padding: 15px;
                max-height: 300px;
                overflow-y: auto;
            }

            .quick-notes-list {
                margin: 0;
                padding: 0;
                list-style: none;
            }

            .quick-note-item {
                padding: 10px;
                margin-bottom: 8px;
                background: rgba(var(--notes-accent-rgb), 0.05);
                border-radius: 6px;
                border-left: 3px solid var(--notes-accent);
                position: relative;
                transition: all 0.2s;
                animation: quickNotesFadeIn 0.3s ease;
            }

            .quick-note-item:hover {
                background: rgba(var(--notes-accent-rgb), 0.1);
            }

            .quick-note-item .quick-note-delete {
                position: absolute;
                top: 5px;
                right: 5px;
                background: none;
                border: none;
                color: var(--notes-text);
                opacity: 0.5;
                cursor: pointer;
                font-size: 12px;
                padding: 2px;
                border-radius: 3px;
                transition: all 0.2s;
            }

            .quick-note-item .quick-note-delete:hover {
                opacity: 1;
                background: rgba(255, 0, 0, 0.1);
                color: #ff4444;
            }

            .quick-notes-input {
                display: flex;
                margin-top: 10px;
            }

            .quick-notes-input input {
                flex: 1;
                padding: 8px 12px;
                border: 1px solid var(--notes-border);
                border-radius: 6px 0 0 6px;
                background: var(--notes-bg);
                color: var(--notes-text);
                font-family: inherit;
                font-size: 14px;
            }

            .quick-notes-input button {
                padding: 8px 12px;
                background: var(--notes-accent);
                color: white;
                border: none;
                border-radius: 0 6px 6px 0;
                cursor: pointer;
                font-family: inherit;
                font-size: 14px;
                transition: background 0.2s;
            }

            .quick-notes-input button:hover {
                background: var(--notes-accent-hover);
            }

            .quick-notes-empty {
                text-align: center;
                color: var(--notes-text);
                opacity: 0.6;
                font-size: 14px;
                padding: 20px 0;
            }

            /* Scrollbar styling */
            .quick-notes-content::-webkit-scrollbar {
                width: 6px;
            }

            .quick-notes-content::-webkit-scrollbar-track {
                background: transparent;
            }

            .quick-notes-content::-webkit-scrollbar-thumb {
                background: var(--notes-border);
                border-radius: 3px;
            }

            .quick-notes-content::-webkit-scrollbar-thumb:hover {
                background: var(--notes-accent);
            }

            /* Animation for adding/removing notes */
            @keyframes quickNotesFadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }

            /* Mobile responsiveness */
            @media (max-width: 768px) {
                .quick-notes-bar {
                    width: calc(100% - 40px);
                    max-width: 300px;
                }
            }
        `;
        document.head.appendChild(styleElement);
    }

    // Create the notes bar HTML
    function createNotesBar() {
        const notesBar = document.createElement('div');
        notesBar.className = 'quick-notes-bar';
        notesBar.id = 'quickNotesBar';
        
        notesBar.innerHTML = `
            <div class="quick-notes-header">
                <h3>Quick Notes</h3>
                <button class="quick-notes-toggle" id="quickNotesToggle">−</button>
            </div>
            <div class="quick-notes-content" id="quickNotesContent">
                <ul class="quick-notes-list" id="quickNotesList">
                    <!-- Notes will be added here -->
                </ul>
                <div class="quick-notes-input">
                    <input type="text" id="quickNoteInput" placeholder="Add a note...">
                    <button id="quickAddNote">Add</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(notesBar);
        return notesBar;
    }

    // Initialize the notes bar
    function initNotesBar() {
        // Inject styles
        injectStyles();
        
        // Create notes bar
        const notesBar = createNotesBar();
        const notesContent = document.getElementById('quickNotesContent');
        const toggleBtn = document.getElementById('quickNotesToggle');
        const notesList = document.getElementById('quickNotesList');
        const noteInput = document.getElementById('quickNoteInput');
        const addNoteBtn = document.getElementById('quickAddNote');
        
        // Load saved notes from localStorage
        let notes = JSON.parse(localStorage.getItem('quickNotes')) || [];
        
        // Render saved notes
        function renderNotes() {
            notesList.innerHTML = '';
            
            if (notes.length === 0) {
                notesList.innerHTML = '<div class="quick-notes-empty">No notes yet. Add your first note!</div>';
                return;
            }
            
            notes.forEach((note, index) => {
                const noteItem = document.createElement('li');
                noteItem.className = 'quick-note-item';
                noteItem.innerHTML = `
                    ${note}
                    <button class="quick-note-delete" data-index="${index}">×</button>
                `;
                notesList.appendChild(noteItem);
            });
            
            // Add event listeners to delete buttons
            document.querySelectorAll('.quick-note-delete').forEach(btn => {
                btn.addEventListener('click', function() {
                    const index = parseInt(this.getAttribute('data-index'));
                    deleteNote(index);
                });
            });
        }
        
        // Add a new note
        function addNote() {
            const noteText = noteInput.value.trim();
            if (noteText) {
                notes.push(noteText);
                localStorage.setItem('quickNotes', JSON.stringify(notes));
                noteInput.value = '';
                renderNotes();
            }
        }
        
        // Delete a note
        function deleteNote(index) {
            notes.splice(index, 1);
            localStorage.setItem('quickNotes', JSON.stringify(notes));
            renderNotes();
        }
        
        // Toggle notes bar
        toggleBtn.addEventListener('click', function() {
            notesBar.classList.toggle('collapsed');
            if (notesBar.classList.contains('collapsed')) {
                toggleBtn.textContent = '+';
                notesContent.style.display = 'none';
            } else {
                toggleBtn.textContent = '−';
                notesContent.style.display = 'block';
            }
        });
        
        // Add note on button click
        addNoteBtn.addEventListener('click', addNote);
        
        // Add note on Enter key
        noteInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addNote();
            }
        });
        
        // Initial render
        renderNotes();
        
        // Check for dark mode
        function checkDarkMode() {
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.body.classList.add('dark-mode');
            }
        }
        
        // Listen for dark mode changes
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
                if (e.matches) {
                    document.body.classList.add('dark-mode');
                } else {
                    document.body.classList.remove('dark-mode');
                }
            });
        }
        
        // Initial dark mode check
        checkDarkMode();
    }

    // Initialize when DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNotesBar);
    } else {
        initNotesBar();
    }
})(); 