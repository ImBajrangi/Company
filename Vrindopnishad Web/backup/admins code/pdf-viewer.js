/**
 * PDF Viewer Component
 * This component loads and displays PDFs from the database
 */
class PDFViewer {
    constructor(containerId) {
        this.containerId = containerId;
        this.container = null;
        this.pdfDoc = null;
        this.pageNum = 1;
        this.pageRendering = false;
        this.pageNumPending = null;
        this.scale = 1.0;
        this.canvas = null;
        this.ctx = null;
        this.isBookView = false;
        this.isFullscreen = false;
        this.leftPage = null;
        this.rightPage = null;
        this.currentBookPage = 1;
        this.pdfContainer = null;
        this.controlsContainer = null;
        this.loadingElement = null;
        this.errorElement = null;
        this.isDarkMode = true; // Default to dark mode
        this.transitionSpeed = '0.5s';
        this.emergencyExitBtn = null; // Reference to emergency exit button
        
        // Touch handling variables
        this.lastTouchY = 0;
        this.lastTouchTime = 0;
        this.touchStartY = 0;
        this.touchStartX = 0;
        this.pinchStartDistance = 0;
        this.pinchStartScale = 1.0;
        this.isScrolling = false;
        this.isZooming = false;
        this.zoomCenter = { x: 0, y: 0 };
        this.scrollTimeout = null;
        this.scrollThreshold = 50; // Minimum scroll distance to trigger page change
        this.scrollCooldown = 300; // Cooldown period in ms to prevent accidental multiple page changes
        this.scrollDeltaY = 0; // Added for handleWheel method
        this.zoomAnimationFrame = null; // For smoother pinch zoom
    }

    /**
     * Initialize the PDF viewer
     */
    async initialize() {
        try {
            // Load PDF.js if not already loaded
            await this.loadPDFJS();
            
            // Create UI
            this.createUI();
            
            // Set up event listeners
            this.setupEventListeners();
            
            return true;
        } catch (error) {
            console.error('Error initializing PDF viewer:', error);
            this.showError('Failed to initialize PDF viewer. Please try again later.');
            return false;
        }
    }

    /**
     * Load PDF.js library if not already loaded
     */
    async loadPDFJS() {
        // Check if PDF.js is already loaded
        if (window.pdfjsLib) {
            return;
        }
        
        return new Promise((resolve, reject) => {
            // Load PDF.js script
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js';
            script.onload = () => {
                // Set worker source
                window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
                resolve();
            };
            script.onerror = () => {
                reject(new Error('Failed to load PDF.js library'));
            };
            document.head.appendChild(script);
        });
    }

    /**
     * Create UI elements for the PDF viewer
     */
    createUI() {
        // Get container element
        this.container = document.getElementById(this.containerId);
        if (!this.container) {
            throw new Error(`Container element with ID "${this.containerId}" not found`);
        }
        
        // Create PDF container
        this.pdfContainer = document.createElement('div');
        this.pdfContainer.className = 'pdf-reader no-animations'; // Add no-animations class
        this.pdfContainer.style.transition = `all ${this.transitionSpeed} ease`;
        
        // Create canvas element
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'pdf-canvas';
        this.ctx = this.canvas.getContext('2d');
        
        // Create book view container
        this.bookViewContainer = document.createElement('div');
        this.bookViewContainer.className = 'book-view-container';
        this.bookViewContainer.style.display = 'none';
        this.bookViewContainer.style.transition = `all ${this.transitionSpeed} ease`;
        
        // Create controls container
        this.controlsContainer = document.createElement('div');
        this.controlsContainer.className = 'pdf-controls';
        this.controlsContainer.style.transition = `all ${this.transitionSpeed} ease`;
        
        // Create navigation controls
        const navigationControls = document.createElement('div');
        navigationControls.className = 'navigation-controls';
        
        // Previous page button
        const prevBtn = document.createElement('button');
        prevBtn.className = 'nav-btn prev-btn';
        prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i> <span class="btn-text">Previous</span>';
        prevBtn.title = 'Previous Page';
        prevBtn.addEventListener('click', () => this.onPrevPage());
        
        // Page info
        this.pageInfo = document.createElement('div');
        this.pageInfo.className = 'page-info';
        this.pageInfo.textContent = 'Page: 0 / 0';
        
        // Next page button
        const nextBtn = document.createElement('button');
        nextBtn.className = 'nav-btn next-btn';
        nextBtn.innerHTML = '<span class="btn-text">Next</span> <i class="fas fa-chevron-right"></i>';
        nextBtn.title = 'Next Page';
        nextBtn.addEventListener('click', () => this.onNextPage());
        
        navigationControls.appendChild(prevBtn);
        navigationControls.appendChild(this.pageInfo);
        navigationControls.appendChild(nextBtn);
        
        // Create view controls
        const viewControls = document.createElement('div');
        viewControls.className = 'view-controls';
        
        // Toggle view mode button
        const toggleViewBtn = document.createElement('button');
        toggleViewBtn.className = 'view-btn';
        toggleViewBtn.innerHTML = '<i class="fas fa-book-open"></i> <span class="btn-text">Book View</span>';
        toggleViewBtn.title = 'Toggle Book View';
        toggleViewBtn.addEventListener('click', () => this.toggleViewMode());
        
        // Fullscreen button
        const fullscreenBtn = document.createElement('button');
        fullscreenBtn.className = 'view-btn fullscreen-btn';
        fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i> <span class="btn-text">Fullscreen</span>';
        fullscreenBtn.title = 'Toggle Fullscreen';
        fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        
        viewControls.appendChild(toggleViewBtn);
        viewControls.appendChild(fullscreenBtn);
        
        // Create zoom controls
        const zoomControls = document.createElement('div');
        zoomControls.className = 'zoom-controls';
        
        // Zoom out button
        const zoomOutBtn = document.createElement('button');
        zoomOutBtn.className = 'zoom-btn';
        zoomOutBtn.innerHTML = '<i class="fas fa-search-minus"></i>';
        zoomOutBtn.title = 'Zoom Out';
        zoomOutBtn.addEventListener('click', () => this.changeZoom(-0.1));
        
        // Zoom level
        this.zoomLevel = document.createElement('span');
        this.zoomLevel.id = 'zoomLevel';
        this.zoomLevel.textContent = '100%';
        
        // Zoom in button
        const zoomInBtn = document.createElement('button');
        zoomInBtn.className = 'zoom-btn';
        zoomInBtn.innerHTML = '<i class="fas fa-search-plus"></i>';
        zoomInBtn.title = 'Zoom In';
        zoomInBtn.addEventListener('click', () => this.changeZoom(0.1));
        
        zoomControls.appendChild(zoomOutBtn);
        zoomControls.appendChild(this.zoomLevel);
        zoomControls.appendChild(zoomInBtn);
        
        // Add controls to container
        this.controlsContainer.appendChild(navigationControls);
        this.controlsContainer.appendChild(viewControls);
        this.controlsContainer.appendChild(zoomControls);
        
        // Create loading element
        this.loadingElement = document.createElement('div');
        this.loadingElement.className = 'loading-container';
        this.loadingElement.innerHTML = `
            <div class="loading-spinner"></div>
            <p>Loading PDF...</p>
        `;
        this.loadingElement.style.display = 'none';
        
        // Create error element
        this.errorElement = document.createElement('div');
        this.errorElement.className = 'error-container';
        this.errorElement.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <h2>Error</h2>
            <p class="error-message">An error occurred while loading the PDF.</p>
        `;
        this.errorElement.style.display = 'none';
        
        // Create emergency exit button
        this.emergencyExitBtn = document.createElement('button');
        this.emergencyExitBtn.className = 'emergency-exit-fixed'; // Use the new class
        this.emergencyExitBtn.innerHTML = '<i class="fas fa-times"></i>';
        this.emergencyExitBtn.title = 'Exit Fullscreen';
        this.emergencyExitBtn.style.display = 'none'; // Hide by default
        this.emergencyExitBtn.addEventListener('click', () => this.exitFullscreen());
        
        // Add elements to container
        this.pdfContainer.appendChild(this.canvas);
        this.pdfContainer.appendChild(this.bookViewContainer);
        this.pdfContainer.appendChild(this.controlsContainer);
        this.pdfContainer.appendChild(this.loadingElement);
        this.pdfContainer.appendChild(this.errorElement);
        this.pdfContainer.appendChild(this.emergencyExitBtn);
        
        // Add PDF container to main container
        this.container.appendChild(this.pdfContainer);
        
        // Apply dark mode if enabled
        this.applyTheme();
        
        // Add custom CSS for emergency exit button if not already in the stylesheet
        this.addEmergencyExitStyles();
    }

    // Add custom CSS for emergency exit button
    addEmergencyExitStyles() {
        // Check if the style already exists
        const styleId = 'pdf-viewer-emergency-exit-styles';
        if (document.getElementById(styleId)) {
            return;
        }
        
        // Create style element
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .emergency-exit-fixed {
                position: fixed;
                top: 20px;
                right: 20px;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background-color: rgba(220, 53, 69, 0.9);
                color: white;
                border: 2px solid rgba(255, 255, 255, 0.8);
                display: none; /* Hidden by default */
                justify-content: center;
                align-items: center;
                cursor: pointer;
                z-index: 9999;
                font-size: 24px;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
                transition: all 0.3s ease;
                opacity: 0.9;
                transform: translateZ(0); /* Force hardware acceleration */
            }
            
            .emergency-exit-fixed:hover {
                opacity: 1;
                transform: scale(1.1) translateZ(0);
                background-color: rgba(220, 53, 69, 1);
                box-shadow: 0 6px 20px rgba(0, 0, 0, 0.6);
            }
            
            .emergency-exit-fixed i {
                font-size: 24px;
                color: white;
                text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
            }
            
            @media (max-width: 768px) {
                .emergency-exit-fixed {
                    top: 15px;
                    right: 15px;
                    width: 45px;
                    height: 45px;
                }
                
                .emergency-exit-fixed i {
                    font-size: 22px;
                }
            }
        `;
        
        // Add style to document head
        document.head.appendChild(style);
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Listen for theme changes
        window.addEventListener('storage', (event) => {
            if (event.key === 'theme') {
                this.isDarkMode = event.newValue === 'dark';
                this.applyTheme();
            }
        });
        
        // Check for theme changes in the document
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
                    this.isDarkMode = document.body.getAttribute('data-theme') === 'dark';
                    this.applyTheme();
                }
            });
        });
        
        observer.observe(document.body, { attributes: true });
        
        // Initial theme check
        this.isDarkMode = document.body.getAttribute('data-theme') === 'dark';
        this.applyTheme();
        
        // Add keyboard event listener for Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isFullscreen) {
                this.exitFullscreen();
            }
        });
        
        // Add touch event listeners for mobile gestures
        if (this.canvas) {
            this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
            this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
            this.canvas.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });
            
            // Add wheel event for scroll to change page
            this.canvas.addEventListener('wheel', this.handleWheel.bind(this), { passive: false });
        }
        
        if (this.bookViewContainer) {
            this.bookViewContainer.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
            this.bookViewContainer.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
            this.bookViewContainer.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });
            
            // Add wheel event for scroll to change page
            this.bookViewContainer.addEventListener('wheel', this.handleWheel.bind(this), { passive: false });
        }
    }

    applyTheme() {
        if (this.pdfContainer) {
            if (this.isDarkMode) {
                this.pdfContainer.classList.add('dark-theme');
            } else {
                this.pdfContainer.classList.remove('dark-theme');
            }
        }
    }

    /**
     * Load PDF by ID from the database
     * @param {string} pdfId - The ID of the PDF to load
     */
    async loadPDFById(pdfId) {
        try {
            this.showLoading(true);
            
            // Fetch PDF details
            const response = await fetch(`/api/pdfs/${pdfId}`, {
                headers: {
                    'Authorization': `Bearer ${this.getToken()}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch PDF details');
            }
            
            const pdfData = await response.json();
            
            // Load PDF from URL
            const success = await this.loadPDFFromUrl(pdfData.fileUrl, pdfId);
            
            if (!success) {
                throw new Error('Failed to load PDF');
            }
            
            return true;
        } catch (error) {
            console.error('Error loading PDF by ID:', error);
            this.showError(error.message || 'Failed to load PDF');
            return false;
        } finally {
            this.showLoading(false);
        }
    }
    
    /**
     * Load PDF from URL
     * @param {string} url - The URL of the PDF to load
     * @param {string} pdfId - The ID of the PDF (optional)
     */
    async loadPDFFromUrl(url, pdfId = null) {
        try {
            this.showLoading(true);
            
            // Load PDF document
            const loadingTask = pdfjsLib.getDocument(url);
            this.pdfDoc = await loadingTask.promise;
            
            // Update page count
            const numPages = this.pdfDoc.numPages;
            this.pageInfo.textContent = `Page: ${this.pageNum} / ${numPages}`;
            
            // Render first page
            await this.renderCurrentView();
            
            // Enable controls
            this.enableControls(true);
            
            // Update view count if PDF ID is provided
            if (pdfId) {
                this.updateViewCount(pdfId);
            }
            
            return true;
        } catch (error) {
            console.error('Error loading PDF from URL:', error);
            this.showError(error.message || 'Failed to load PDF');
            return false;
        } finally {
            this.showLoading(false);
        }
    }

    /**
     * Load PDF from ArrayBuffer data
     * @param {ArrayBuffer} data - The PDF data
     */
    async loadPDF(data) {
        try {
            this.showLoading(true);
            
            // Load PDF document from data
            const loadingTask = pdfjsLib.getDocument({ data });
            this.pdfDoc = await loadingTask.promise;
            
            // Update page count
            const numPages = this.pdfDoc.numPages;
            this.pageInfo.textContent = `Page: ${this.pageNum} / ${numPages}`;
            
            // Render first page
            await this.renderCurrentView();
            
            // Enable controls
            this.enableControls(true);
            
            return true;
        } catch (error) {
            console.error('Error loading PDF from data:', error);
            this.showError(error.message || 'Failed to load PDF');
            return false;
        } finally {
            this.showLoading(false);
        }
    }

    /**
     * Render the current view (standard or book)
     */
    renderCurrentView() {
        if (this.isBookView) {
            // In book view, we show two pages side by side
            return this.renderBookView(this.currentBookPage);
        } else {
            // In standard view, we show a single page
            return this.renderPage(this.pageNum);
        }
    }

    /**
     * Render a specific page
     * @param {number} num - The page number to render
     */
    async renderPage(num) {
        if (!this.pdfDoc) {
            return;
        }
        
        this.pageRendering = true;
        
        try {
            // Get page
            const page = await this.pdfDoc.getPage(num);
            
            // Determine scale to fit page in viewport
            const viewport = page.getViewport({ scale: this.scale });
            
            // Set canvas dimensions
            this.canvas.height = viewport.height;
            this.canvas.width = viewport.width;
            
            // Render PDF page
            const renderContext = {
                canvasContext: this.ctx,
                viewport: viewport
            };
            
            await page.render(renderContext).promise;
            
            // Update page info
            this.pageInfo.textContent = `Page: ${num} / ${this.pdfDoc.numPages}`;
            
            // Update zoom level display
            this.zoomLevel.textContent = `${Math.round(this.scale * 100)}%`;
            
            // Center canvas
            this.centerCanvas();
            
            // If another page rendering is pending, render that page
            if (this.pageNumPending !== null) {
                const pendingPage = this.pageNumPending;
                this.pageNumPending = null;
                this.renderPage(pendingPage);
                return;
            }
            
            this.pageRendering = false;
            
            // Update current page number
            this.pageNum = num;
        } catch (error) {
            console.error('Error rendering page:', error);
            this.pageRendering = false;
            this.showError(`Failed to render page ${num}`);
        }
    }

    /**
     * Render book view with two pages side by side
     * @param {number} startPage - The starting page number (should be odd)
     */
    async renderBookView(startPage) {
        if (!this.pdfDoc) {
            return;
        }
        
        this.pageRendering = true;
        
        try {
            // Hide canvas and show book view container
            this.canvas.style.display = 'none';
            this.bookViewContainer.style.display = 'flex';
            
            // Clear book view container
            this.bookViewContainer.innerHTML = '';
            
            // Calculate dimensions
            const containerWidth = this.bookViewContainer.clientWidth;
            const containerHeight = this.bookViewContainer.clientHeight;
            
            // Determine pages to show
            let leftPageNum = startPage;
            let rightPageNum = startPage + 1;
            
            // Ensure pages are within bounds
            if (leftPageNum < 1) {
                leftPageNum = 1;
                rightPageNum = 2;
            }
            
            if (rightPageNum > this.pdfDoc.numPages) {
                if (this.pdfDoc.numPages === 1) {
                    leftPageNum = 1;
                    rightPageNum = null;
                } else {
                    leftPageNum = this.pdfDoc.numPages - 1;
                    rightPageNum = this.pdfDoc.numPages;
                }
            }
            
            // Create left page
            this.leftPage = await this.createBookPage(
                leftPageNum,
                'book-page left-page',
                containerWidth / 2,
                containerHeight
            );
            
            this.bookViewContainer.appendChild(this.leftPage);
            
            // Create right page if needed
            if (rightPageNum !== null && rightPageNum <= this.pdfDoc.numPages) {
                this.rightPage = await this.createBookPage(
                    rightPageNum,
                    'book-page right-page',
                    containerWidth / 2,
                    containerHeight
                );
                
                this.bookViewContainer.appendChild(this.rightPage);
            }
            
            // Update current book page
            this.currentBookPage = leftPageNum;
            
            // Update page info
            this.pageInfo.textContent = `Pages: ${leftPageNum}${rightPageNum ? '-' + rightPageNum : ''} / ${this.pdfDoc.numPages}`;
            
            this.pageRendering = false;
        } catch (error) {
            console.error('Error rendering book view:', error);
            this.pageRendering = false;
            this.showError('Failed to render book view');
        }
    }

    /**
     * Create a book page element
     * @param {number} pageNum - The page number
     * @param {string} className - The class name for the page
     * @param {number} containerWidth - The container width
     * @param {number} containerHeight - The container height
     * @returns {HTMLElement} The book page element
     */
    async createBookPage(pageNum, className, containerWidth, containerHeight) {
        // Create page container
        const pageContainer = document.createElement('div');
        pageContainer.className = className;
        pageContainer.dataset.page = pageNum;
        
        try {
            // Get page
            const page = await this.pdfDoc.getPage(pageNum);
            
            // Create canvas for page
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            
            // Calculate scale to fit page in container
            const viewport = page.getViewport({ scale: 1.0 });
            const scale = Math.min(
                containerWidth / viewport.width,
                containerHeight / viewport.height
            ) * 0.9; // Add some margin
            
            // Set canvas dimensions
            const scaledViewport = page.getViewport({ scale });
            canvas.height = scaledViewport.height;
            canvas.width = scaledViewport.width;
            
            // Render PDF page
            const renderContext = {
                canvasContext: context,
                viewport: scaledViewport
            };
            
            await page.render(renderContext).promise;
            
            // Add page number
            const pageNumber = document.createElement('div');
            pageNumber.className = 'page-number';
            pageNumber.textContent = pageNum;
            
            // Add canvas and page number to page container
            pageContainer.appendChild(canvas);
            pageContainer.appendChild(pageNumber);
            
            return pageContainer;
        } catch (error) {
            console.error(`Error creating book page ${pageNum}:`, error);
            
            // Create error page
            const errorPage = document.createElement('div');
            errorPage.className = `${className} error-page`;
            errorPage.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Failed to load page ${pageNum}</p>
                </div>
            `;
            
            return errorPage;
        }
    }

    /**
     * Center the canvas in the container
     */
    centerCanvas() {
        if (this.canvas && this.pdfContainer) {
            const containerWidth = this.pdfContainer.clientWidth;
            const containerHeight = this.pdfContainer.clientHeight - this.controlsContainer.clientHeight;
            
            const canvasWidth = this.canvas.width;
            const canvasHeight = this.canvas.height;
            
            const leftMargin = Math.max(0, (containerWidth - canvasWidth) / 2);
            const topMargin = Math.max(0, (containerHeight - canvasHeight) / 2);
            
            this.canvas.style.marginLeft = `${leftMargin}px`;
            this.canvas.style.marginTop = `${topMargin}px`;
        }
    }

    /**
     * Go to the previous page
     */
    onPrevPage() {
        if (!this.pdfDoc) {
            return;
        }
        
        if (this.isBookView) {
            // In book view, go back two pages
            const newPage = Math.max(1, this.currentBookPage - 2);
            if (newPage !== this.currentBookPage) {
                this.currentBookPage = newPage;
                this.renderBookView(this.currentBookPage);
            }
        } else {
            // In standard view, go back one page
            if (this.pageNum <= 1) {
                return;
            }
            
            this.pageNum--;
            
            if (this.pageRendering) {
                this.pageNumPending = this.pageNum;
            } else {
                this.renderPage(this.pageNum);
            }
        }
    }

    /**
     * Go to the next page
     */
    onNextPage() {
        if (!this.pdfDoc) {
            return;
        }
        
        if (this.isBookView) {
            // In book view, go forward two pages
            const newPage = Math.min(this.pdfDoc.numPages - 1, this.currentBookPage + 2);
            if (newPage !== this.currentBookPage) {
                this.currentBookPage = newPage;
                this.renderBookView(this.currentBookPage);
            }
        } else {
            // In standard view, go forward one page
            if (this.pageNum >= this.pdfDoc.numPages) {
                return;
            }
            
            this.pageNum++;
            
            if (this.pageRendering) {
                this.pageNumPending = this.pageNum;
            } else {
                this.renderPage(this.pageNum);
            }
        }
    }

    /**
     * Change zoom level
     * @param {number} delta - The amount to change zoom by
     */
    changeZoom(delta) {
        if (!this.pdfDoc) {
            return;
        }
        
        this.scale = Math.max(0.5, Math.min(3.0, this.scale + delta));
        this.renderCurrentView();
    }

    /**
     * Toggle between standard and book view
     */
    toggleViewMode() {
        if (!this.pdfDoc) {
            return;
        }
        
        this.isBookView = !this.isBookView;
        
        if (this.isBookView) {
            // Switch to book view
            this.currentBookPage = this.pageNum;
            if (this.currentBookPage % 2 === 0) {
                this.currentBookPage--;
            }
            this.renderBookView(this.currentBookPage);
        } else {
            // Switch to standard view
            this.canvas.style.display = 'block';
            this.bookViewContainer.style.display = 'none';
            this.pageNum = this.currentBookPage;
            this.renderPage(this.pageNum);
        }
    }

    /**
     * Toggle fullscreen mode
     */
    toggleFullscreen() {
        if (this.isFullscreen) {
            this.exitFullscreen();
        } else {
            this.enterFullscreen();
        }
    }

    /**
     * Enter fullscreen mode
     */
    enterFullscreen() {
        if (!this.pdfContainer) {
            return;
        }
        
        // Request fullscreen
        if (this.pdfContainer.requestFullscreen) {
            this.pdfContainer.requestFullscreen();
        } else if (this.pdfContainer.mozRequestFullScreen) { /* Firefox */
            this.pdfContainer.mozRequestFullScreen();
        } else if (this.pdfContainer.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
            this.pdfContainer.webkitRequestFullscreen();
        } else if (this.pdfContainer.msRequestFullscreen) { /* IE/Edge */
            this.pdfContainer.msRequestFullscreen();
        }
        
        this.isFullscreen = true;
        this.pdfContainer.classList.add('fullscreen');
        document.body.classList.add('pdf-fullscreen-mode');
        
        // Show emergency exit button
        if (this.emergencyExitBtn) {
            this.emergencyExitBtn.style.display = 'flex';
        }
        
        // Update button icon and text
        const fullscreenBtn = this.pdfContainer.querySelector('.fullscreen-btn');
        if (fullscreenBtn) {
            fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i> <span class="btn-text">Exit Fullscreen</span>';
            fullscreenBtn.title = 'Exit Fullscreen';
        }
        
        // Add fullscreen change event listener
        document.addEventListener('fullscreenchange', this.handleFullscreenChange.bind(this));
        document.addEventListener('webkitfullscreenchange', this.handleFullscreenChange.bind(this));
        document.addEventListener('mozfullscreenchange', this.handleFullscreenChange.bind(this));
        document.addEventListener('MSFullscreenChange', this.handleFullscreenChange.bind(this));
        
        // Re-attach touch and wheel event listeners
        this.setupEventListeners();
    }
    
    handleFullscreenChange() {
        // Check if we're still in fullscreen mode
        const isInFullscreen = document.fullscreenElement || 
                              document.webkitFullscreenElement || 
                              document.mozFullScreenElement || 
                              document.msFullscreenElement;
                              
        // If we exited fullscreen via browser controls, update our state
        if (!isInFullscreen && this.isFullscreen) {
            this.exitFullscreen();
        }
    }

    exitFullscreen() {
        try {
            // If we're not in fullscreen mode, do nothing
            if (!this.isFullscreen) {
                return;
            }
            
            // Exit browser fullscreen if we're in it
            if (document.fullscreenElement || 
                document.webkitFullscreenElement || 
                document.mozFullScreenElement || 
                document.msFullscreenElement) {
                
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.mozCancelFullScreen) { /* Firefox */
                    document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) { /* Chrome, Safari & Opera */
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) { /* IE/Edge */
                    document.msExitFullscreen();
                }
            }
            
            this.isFullscreen = false;
            
            // Add transition class for smooth animation
            this.pdfContainer.classList.add('transitioning');
            this.pdfContainer.classList.remove('fullscreen');
            document.body.classList.remove('pdf-fullscreen-mode');
            
            // Hide emergency exit button
            if (this.emergencyExitBtn) {
                this.emergencyExitBtn.style.display = 'none';
            }
            
            // Update button icon and text
            const fullscreenBtn = this.pdfContainer.querySelector('.fullscreen-btn');
            if (fullscreenBtn) {
                fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i> <span class="btn-text">Fullscreen</span>';
                fullscreenBtn.title = 'Toggle Fullscreen';
            }
            
            // Remove transition class after animation completes
            setTimeout(() => {
                this.pdfContainer.classList.remove('transitioning');
            }, 500);
            
            // Remove fullscreen change event listeners
            document.removeEventListener('fullscreenchange', this.handleFullscreenChange.bind(this));
            document.removeEventListener('webkitfullscreenchange', this.handleFullscreenChange.bind(this));
            document.removeEventListener('mozfullscreenchange', this.handleFullscreenChange.bind(this));
            document.removeEventListener('MSFullscreenChange', this.handleFullscreenChange.bind(this));
        } catch (error) {
            console.error('Error exiting fullscreen:', error);
        }
    }

    /**
     * Enable or disable controls
     * @param {boolean} enabled - Whether to enable or disable controls
     */
    enableControls(enabled) {
        if (!this.controlsContainer) {
            return;
        }
        
        const buttons = this.controlsContainer.querySelectorAll('button');
        buttons.forEach(button => {
            button.disabled = !enabled;
        });
    }

    /**
     * Show or hide loading indicator
     * @param {boolean} show - Whether to show or hide loading indicator
     */
    showLoading(show) {
        if (this.loadingElement) {
            this.loadingElement.style.display = show ? 'flex' : 'none';
        }
    }

    /**
     * Show error message
     * @param {string} message - The error message to show
     */
    showError(message) {
        if (this.errorElement) {
            const errorMessage = this.errorElement.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.textContent = message;
            }
            this.errorElement.style.display = 'flex';
            this.loadingElement.style.display = 'none';
        }
    }

    /**
     * Update view count for a PDF
     * @param {string} pdfId - The ID of the PDF
     */
    async updateViewCount(pdfId) {
        try {
            await fetch(`/api/pdfs/${pdfId}/view`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.getToken()}`,
                    'Content-Type': 'application/json'
                }
            });
        } catch (error) {
            console.error('Error updating view count:', error);
        }
    }

    /**
     * Get authentication token
     * @returns {string} The authentication token
     */
    getToken() {
        return localStorage.getItem('token') || '';
    }

    // Handle touch start event
    handleTouchStart(e) {
        if (!this.pdfDoc) return;
        
        // Store initial touch position
        if (e.touches.length === 1) {
            // Single touch - for page navigation
            this.touchStartY = e.touches[0].clientY;
            this.touchStartX = e.touches[0].clientX;
            this.lastTouchY = this.touchStartY;
            this.lastTouchTime = Date.now();
            this.isScrolling = false;
        } else if (e.touches.length === 2) {
            // Two touches - for pinch zoom
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            
            // Calculate distance between two points
            const distance = Math.hypot(
                touch2.clientX - touch1.clientX,
                touch2.clientY - touch1.clientY
            );
            
            // Store the initial pinch distance and current scale
            this.pinchStartDistance = distance;
            this.pinchStartScale = this.scale;
            this.isZooming = true;
            
            // Calculate zoom center point
            this.zoomCenter = {
                x: (touch1.clientX + touch2.clientX) / 2,
                y: (touch1.clientY + touch2.clientY) / 2
            };
            
            // Prevent default to avoid page scrolling
            e.preventDefault();
        }
    }
    
    // Handle touch move event
    handleTouchMove(e) {
        if (!this.pdfDoc) return;
        
        if (e.touches.length === 1 && !this.isZooming) {
            // Single touch - for page navigation
            const currentY = e.touches[0].clientY;
            const deltaY = this.lastTouchY - currentY;
            
            // Determine if user is scrolling vertically
            if (Math.abs(deltaY) > 10 && !this.isScrolling) {
                this.isScrolling = true;
            }
            
            this.lastTouchY = currentY;
            
            // If we're in a scrolling state, prevent default to handle our own scrolling
            if (this.isScrolling) {
                e.preventDefault();
            }
        } else if (e.touches.length === 2) {
            // Two touches - for pinch zoom
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            
            // Calculate current distance
            const currentDistance = Math.hypot(
                touch2.clientX - touch1.clientX,
                touch2.clientY - touch1.clientY
            );
            
            // Calculate new scale based on the change in distance
            const scaleFactor = currentDistance / this.pinchStartDistance;
            
            // Apply smoothing to the scale factor
            const smoothScaleFactor = 1 + (scaleFactor - 1) * 0.7; // Dampen the scale change for smoother zooming
            
            // Calculate new scale with limits
            const newScale = Math.max(0.5, Math.min(3.0, this.pinchStartScale * smoothScaleFactor));
            
            // Update zoom center point
            this.zoomCenter = {
                x: (touch1.clientX + touch2.clientX) / 2,
                y: (touch1.clientY + touch2.clientY) / 2
            };
            
            // Apply the new scale only if it's significantly different
            if (Math.abs(this.scale - newScale) > 0.01) {
                // Use requestAnimationFrame for smoother updates
                if (!this.zoomAnimationFrame) {
                    this.zoomAnimationFrame = requestAnimationFrame(() => {
                        this.zoomToPoint(this.zoomCenter.x, this.zoomCenter.y, newScale);
                        this.zoomAnimationFrame = null;
                    });
                }
            }
            
            // Prevent default to avoid page scrolling
            e.preventDefault();
        }
    }
    
    // Handle touch end event
    handleTouchEnd(e) {
        if (!this.pdfDoc) return;
        
        // If we were zooming, reset the zooming state
        if (this.isZooming) {
            this.isZooming = false;
            return;
        }
        
        // If we were scrolling, check if we should change page
        if (this.isScrolling) {
            const deltaY = this.touchStartY - this.lastTouchY;
            const deltaTime = Date.now() - this.lastTouchTime;
            
            // If the scroll was fast enough and long enough, change page
            if (Math.abs(deltaY) > this.scrollThreshold && deltaTime < 300) {
                if (deltaY > 0) {
                    // Scrolled up, go to next page
                    this.onNextPage();
                } else {
                    // Scrolled down, go to previous page
                    this.onPrevPage();
                }
            }
            
            this.isScrolling = false;
        } else {
            // Check for horizontal swipe
            const deltaX = this.touchStartX - e.changedTouches[0].clientX;
            
            if (Math.abs(deltaX) > this.scrollThreshold) {
                if (deltaX > 0) {
                    // Swiped left, go to next page
                    this.onNextPage();
                } else {
                    // Swiped right, go to previous page
                    this.onPrevPage();
                }
            }
        }
    }
    
    // Handle wheel event for scroll to change page
    handleWheel(e) {
        if (!this.pdfDoc) return;
        
        // Clear any existing timeout
        if (this.scrollTimeout) {
            clearTimeout(this.scrollTimeout);
        }
        
        // Accumulate scroll delta
        this.scrollDeltaY = (this.scrollDeltaY || 0) + e.deltaY;
        
        // If user is holding Ctrl key, it's likely they're trying to zoom
        if (e.ctrlKey) {
            // Prevent default to allow our custom zoom
            e.preventDefault();
            
            // Calculate zoom factor based on wheel delta
            const zoomFactor = e.deltaY > 0 ? -0.1 : 0.1;
            this.changeZoom(zoomFactor);
            
            // Reset scroll delta
            this.scrollDeltaY = 0;
            return;
        }
        
        // If the scroll is large enough, change page
        if (Math.abs(this.scrollDeltaY) > this.scrollThreshold) {
            // Prevent default to avoid page scrolling
            e.preventDefault();
            
            // Set a timeout to prevent multiple page changes in quick succession
            this.scrollTimeout = setTimeout(() => {
                if (this.scrollDeltaY > 0) {
                    // Scrolled down, go to next page
                    this.onNextPage();
                } else {
                    // Scrolled up, go to previous page
                    this.onPrevPage();
                }
                
                // Reset scroll delta
                this.scrollDeltaY = 0;
            }, this.scrollCooldown);
        }
    }
    
    // Zoom to a specific point
    zoomToPoint(x, y, newScale) {
        if (!this.pdfDoc || !this.canvas) return;
        
        // Calculate the position of the point in the canvas
        const rect = this.canvas.getBoundingClientRect();
        const offsetX = x - rect.left;
        const offsetY = y - rect.top;
        
        // Calculate the position of the point in the PDF coordinates
        const pdfX = offsetX / this.scale;
        const pdfY = offsetY / this.scale;
        
        // Store old scale for transition calculation
        const oldScale = this.scale;
        
        // Update the scale
        this.scale = newScale;
        
        // Update zoom level display
        this.zoomLevel.textContent = `${Math.round(this.scale * 100)}%`;
        
        // Re-render the current page
        this.renderCurrentView();
        
        // After rendering, adjust the position to keep the zoom point fixed
        // Use requestAnimationFrame to ensure the rendering has completed
        requestAnimationFrame(() => {
            const newRect = this.canvas.getBoundingClientRect();
            const newOffsetX = pdfX * this.scale;
            const newOffsetY = pdfY * this.scale;
            
            // Calculate the scroll position to center the zoom point
            const scrollX = newOffsetX - (x - newRect.left);
            const scrollY = newOffsetY - (y - newRect.top);
            
            // Apply the scroll position with smooth transition
            if (this.pdfContainer) {
                // Add smooth scrolling class if not already present
                if (!this.pdfContainer.classList.contains('smooth-scroll')) {
                    this.pdfContainer.classList.add('smooth-scroll');
                }
                
                this.pdfContainer.scrollLeft += scrollX;
                this.pdfContainer.scrollTop += scrollY;
                
                // Remove smooth scrolling class after transition
                setTimeout(() => {
                    this.pdfContainer.classList.remove('smooth-scroll');
                }, 300);
            }
        });
    }
}

// Export the PDFViewer class
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PDFViewer;
} else {
    window.PDFViewer = PDFViewer;
} 