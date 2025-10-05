// Initialize GSAP animations
gsap.registerPlugin(ScrollTrigger);

// Content structure
const contentStructure = {
    title: '',
    content: '',
    tags: [],
    metadata: {
        createdAt: '',
        updatedAt: '',
        author: '',
        keywords: [],
        description: '',
        category: '',
        slug: ''
    },
    seo: {
        title: '',
        metaDescription: '',
        ogTitle: '',
        ogDescription: '',
        ogImage: '',
        canonicalUrl: ''
    }
};

// Initialize the editor
document.addEventListener('DOMContentLoaded', function() {
    // Load saved content if exists
    loadSavedContent();
    
    // Initialize formatting tools
    initFormatTools();
    
    // Initialize media tools
    initMediaTools();
    
    // Initialize preview functionality
    initPreview();
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize SEO tools
    initSEOTools();
});

// Load saved content from localStorage
function loadSavedContent() {
    const savedContent = localStorage.getItem('content_data');
    if (savedContent) {
        const content = JSON.parse(savedContent);
        document.querySelector('.content-title').value = content.title || '';
        document.getElementById('content-editor').innerHTML = content.content || '';
        document.querySelector('.content-tags').value = content.tags.join(', ') || '';
        
        // Load SEO data if exists
        if (content.seo) {
            document.getElementById('seo-title').value = content.seo.title || '';
            document.getElementById('meta-description').value = content.seo.metaDescription || '';
            document.getElementById('og-title').value = content.seo.ogTitle || '';
            document.getElementById('og-description').value = content.seo.ogDescription || '';
            document.getElementById('canonical-url').value = content.seo.canonicalUrl || '';
        }
    }
}

// Save content as JSON
function saveContent() {
    const title = document.querySelector('.content-title').value;
    const content = document.getElementById('content-editor').innerHTML;
    const tags = document.querySelector('.content-tags').value.split(',').map(tag => tag.trim());
    
    // Generate slug from title
    const slug = generateSlug(title);
    
    // Get SEO data
    const seoData = {
        title: document.getElementById('seo-title').value,
        metaDescription: document.getElementById('meta-description').value,
        ogTitle: document.getElementById('og-title').value,
        ogDescription: document.getElementById('og-description').value,
        canonicalUrl: document.getElementById('canonical-url').value
    };
    
    // Create content object
    const contentData = {
        ...contentStructure,
        title,
        content,
        tags,
        metadata: {
            ...contentStructure.metadata,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            slug,
            keywords: extractKeywords(content)
        },
        seo: seoData
    };
    
    // Save to localStorage
    localStorage.setItem('content_data', JSON.stringify(contentData));
    
    // Save to server (you would implement this)
    saveToServer(contentData);
    
    if (window.NotificationManager) {
        window.NotificationManager.show('Content saved successfully', 'success');
    }
}

// Generate SEO-friendly slug
function generateSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

// Extract keywords from content
function extractKeywords(content) {
    // Remove HTML tags
    const text = content.replace(/<[^>]*>/g, '');
    
    // Split into words
    const words = text.toLowerCase().split(/\W+/);
    
    // Count word frequency
    const wordFreq = {};
    words.forEach(word => {
        if (word.length > 3) { // Ignore short words
            wordFreq[word] = (wordFreq[word] || 0) + 1;
        }
    });
    
    // Sort by frequency
    const keywords = Object.entries(wordFreq)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10) // Top 10 keywords
        .map(([word]) => word);
    
    return keywords;
}

// SEO Tools Functionality
function initSEOTools() {
    const titleInput = document.getElementById('seo-title');
    const descriptionInput = document.getElementById('meta-description');
    const keywordsInput = document.getElementById('seo-keywords');
    const previewTitle = document.querySelector('.preview-title');
    const previewDescription = document.querySelector('.preview-description');
    const keywordTags = document.querySelector('.keyword-tags');
    const contentStats = document.querySelector('.content-stats');

    // Load saved SEO data
    const savedSEO = JSON.parse(localStorage.getItem('seoData') || '{}');
    if (savedSEO.title) titleInput.value = savedSEO.title;
    if (savedSEO.description) descriptionInput.value = savedSEO.description;
    if (savedSEO.keywords) {
        savedSEO.keywords.forEach(keyword => addKeywordTag(keyword));
    }

    // Update preview on input
    titleInput.addEventListener('input', updatePreview);
    descriptionInput.addEventListener('input', updatePreview);

    // Handle keywords
    keywordsInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const keyword = keywordsInput.value.trim();
            if (keyword) {
                addKeywordTag(keyword);
                keywordsInput.value = '';
                saveSEOData();
            }
        }
    });

    // Update content stats
    function updateContentStats() {
        const content = document.getElementById('content-editor').innerText;
        const wordCount = content.trim().split(/\s+/).length;
        const charCount = content.length;
        const readingTime = Math.ceil(wordCount / 200); // Assuming 200 words per minute

        contentStats.innerHTML = `
            <h3>Content Statistics</h3>
            <div class="stat-item">
                <span class="stat-label">Words:</span>
                <span class="stat-value">${wordCount}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Characters:</span>
                <span class="stat-value">${charCount}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Reading Time:</span>
                <span class="stat-value">${readingTime} min</span>
            </div>
        `;
    }

    // Add keyword tag
    function addKeywordTag(keyword) {
        const tag = document.createElement('div');
        tag.className = 'keyword-tag';
        tag.innerHTML = `
            ${keyword}
            <span class="remove-keyword">×</span>
        `;

        tag.querySelector('.remove-keyword').addEventListener('click', () => {
            tag.remove();
            saveSEOData();
        });

        keywordTags.appendChild(tag);
        saveSEOData();
    }

    // Update preview
    function updatePreview() {
        const title = titleInput.value || 'Your Title Here';
        const description = descriptionInput.value || 'Your description here...';

        previewTitle.textContent = title;
        previewDescription.textContent = description;

        // Validate SEO
        validateSEO(title, description);
        saveSEOData();
    }

    // Validate SEO
    function validateSEO(title, description) {
        const titleLength = title.length;
        const descLength = description.length;

        if (titleLength < 30) {
            showNotification('Title is too short. Aim for 30-60 characters.', 'error');
        } else if (titleLength > 60) {
            showNotification('Title is too long. Keep it under 60 characters.', 'error');
        }

        if (descLength < 120) {
            showNotification('Description is too short. Aim for 120-160 characters.', 'error');
        } else if (descLength > 160) {
            showNotification('Description is too long. Keep it under 160 characters.', 'error');
        }
    }

    // Save SEO data
    function saveSEOData() {
        const keywords = Array.from(keywordTags.querySelectorAll('.keyword-tag'))
            .map(tag => tag.textContent.trim().replace('×', ''));

        const seoData = {
            title: titleInput.value,
            description: descriptionInput.value,
            keywords: keywords
        };

        localStorage.setItem('seoData', JSON.stringify(seoData));
    }

    // Update stats when content changes
    document.getElementById('content-editor').addEventListener('input', updateContentStats);
    updateContentStats();
}

// Save to server (implement this based on your backend)
async function saveToServer(contentData) {
    try {
        // Here you would implement the actual server save
        // Example:
        // const response = await fetch('/api/content', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(contentData)
        // });
        
        // For now, we'll just log it
        console.log('Content saved to server:', contentData);
    } catch (error) {
        console.error('Error saving to server:', error);
        if (window.NotificationManager) {
            window.NotificationManager.show('Error saving to server', 'error');
        }
    }
}

// Initialize formatting tools
function initFormatTools() {
    const formatButtons = document.querySelectorAll('.format-btn');
    
    formatButtons.forEach(button => {
        button.addEventListener('click', function() {
            const format = this.dataset.format;
            
            // Remove active class from all buttons
            formatButtons.forEach(btn => btn.classList.remove('active'));
            
            // Apply formatting
            switch(format) {
                case 'bold':
                    document.execCommand('bold', false, null);
                    break;
                case 'italic':
                    document.execCommand('italic', false, null);
                    break;
                case 'underline':
                    document.execCommand('underline', false, null);
                    break;
                case 'heading':
                    document.execCommand('formatBlock', false, 'h2');
                    break;
                case 'list':
                    document.execCommand('insertUnorderedList', false, null);
                    break;
            }
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Show notification
            if (window.NotificationManager) {
                window.NotificationManager.show('Format applied', 'success');
            }
        });
    });
}

// Initialize media tools
function initMediaTools() {
    // Image upload handling
    const imageUpload = document.getElementById('image-upload');
    if (imageUpload) {
        imageUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                if (file.size > 5 * 1024 * 1024) { // 5MB limit
                    if (window.NotificationManager) {
                        window.NotificationManager.show('Image size should be less than 5MB', 'error');
                    }
                    return;
                }
                
                const reader = new FileReader();
                reader.onload = function(e) {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.className = 'content-image';
                    
                    // Add image controls
                    const wrapper = document.createElement('div');
                    wrapper.className = 'image-wrapper';
                    wrapper.appendChild(img);
                    
                    // Add image controls
                    const controls = document.createElement('div');
                    controls.className = 'image-controls';
                    controls.innerHTML = `
                        <button class="image-control" data-action="align-left" title="Align Left">
                            <i class="fas fa-align-left"></i>
                        </button>
                        <button class="image-control" data-action="align-center" title="Align Center">
                            <i class="fas fa-align-center"></i>
                        </button>
                        <button class="image-control" data-action="align-right" title="Align Right">
                            <i class="fas fa-align-right"></i>
                        </button>
                        <button class="image-control" data-action="remove" title="Remove Image">
                            <i class="fas fa-trash"></i>
                        </button>
                    `;
                    wrapper.appendChild(controls);
                    
                    // Insert at cursor position
                    const selection = window.getSelection();
                    const range = selection.getRangeAt(0);
                    range.insertNode(wrapper);
                    
                    if (window.NotificationManager) {
                        window.NotificationManager.show('Image added', 'success');
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Video handling
    const addVideoBtn = document.getElementById('add-video');
    if (addVideoBtn) {
        addVideoBtn.addEventListener('click', function() {
            const videoUrl = prompt('Enter video URL (YouTube or Vimeo):');
            if (videoUrl) {
                let embedUrl;
                if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
                    const videoId = videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i)[1];
                    embedUrl = `https://www.youtube.com/embed/${videoId}`;
                } else if (videoUrl.includes('vimeo.com')) {
                    const videoId = videoUrl.match(/vimeo\.com\/([0-9]+)/i)[1];
                    embedUrl = `https://player.vimeo.com/video/${videoId}`;
                }
                
                if (embedUrl) {
                    const iframe = document.createElement('iframe');
                    iframe.src = embedUrl;
                    iframe.width = '100%';
                    iframe.height = '400';
                    iframe.frameBorder = '0';
                    iframe.allowFullscreen = true;
                    
                    const wrapper = document.createElement('div');
                    wrapper.className = 'video-wrapper';
                    wrapper.appendChild(iframe);
                    
                    // Insert at cursor position
                    const selection = window.getSelection();
                    const range = selection.getRangeAt(0);
                    range.insertNode(wrapper);
                    
                    if (window.NotificationManager) {
                        window.NotificationManager.show('Video added', 'success');
                    }
                } else {
                    if (window.NotificationManager) {
                        window.NotificationManager.show('Invalid video URL', 'error');
                    }
                }
            }
        });
    }
}

// Initialize preview functionality
function initPreview() {
    const previewBtn = document.getElementById('preview-content');
    if (previewBtn) {
        previewBtn.addEventListener('click', function() {
            const title = document.querySelector('.content-title').value;
            const content = document.getElementById('content-editor').innerHTML;
            
            // Create preview window
            const previewWindow = window.open('', '_blank');
            previewWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Preview: ${title}</title>
                    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
                    <style>
                        body {
                            font-family: 'Inter', sans-serif;
                            line-height: 1.6;
                            max-width: 800px;
                            margin: 0 auto;
                            padding: 2rem;
                        }
                        h1 { font-size: 2.5rem; margin-bottom: 1rem; }
                        img { max-width: 100%; height: auto; }
                        .video-wrapper { position: relative; padding-bottom: 56.25%; height: 0; }
                        .video-wrapper iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
                    </style>
                </head>
                <body>
                    <h1>${title}</h1>
                    ${content}
                </body>
                </html>
            `);
            previewWindow.document.close();
        });
    }
}

// Initialize mobile menu
function initMobileMenu() {
    const menuBtn = document.createElement('button');
    menuBtn.className = 'mobile-menu-btn';
    menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    document.querySelector('.header-content').appendChild(menuBtn);
    
    menuBtn.addEventListener('click', function() {
        const controls = document.querySelector('.write-controls');
        controls.classList.toggle('active');
    });
}

// Handle image controls
document.addEventListener('click', function(e) {
    if (e.target.closest('.image-control')) {
        const control = e.target.closest('.image-control');
        const action = control.dataset.action;
        const wrapper = control.closest('.image-wrapper');
        
        switch(action) {
            case 'align-left':
                wrapper.style.textAlign = 'left';
                break;
            case 'align-center':
                wrapper.style.textAlign = 'center';
                break;
            case 'align-right':
                wrapper.style.textAlign = 'right';
                break;
            case 'remove':
                wrapper.remove();
                if (window.NotificationManager) {
                    window.NotificationManager.show('Image removed', 'info');
                }
                break;
        }
    }
}); 