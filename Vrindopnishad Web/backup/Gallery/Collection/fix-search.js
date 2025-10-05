/**
 * Fix Search Button Visibility and Functionality
 * This script ensures the search button is visible, properly positioned, and functions correctly
 */

// Function to fix search button visibility and functionality
function fixSearchButtonVisibility() {
    console.log('Fixing search button visibility and functionality...');
    
    // Get the search wrapper
    const searchWrapper = document.getElementById('movableSearch');
    if (!searchWrapper) {
        console.error('Search wrapper not found');
        return;
    }
    
    // Create search overlay if it doesn't exist
    let searchOverlay = document.getElementById('searchOverlay');
    if (!searchOverlay) {
        searchOverlay = document.createElement('div');
        searchOverlay.id = 'searchOverlay';
        document.body.appendChild(searchOverlay);
        console.log('Search overlay created');
    }
    
    // Get other search elements
    const searchIcon = document.getElementById('expandSearchIcon');
    const closeIcon = document.getElementById('collapseSearchIcon');
    const searchInput = document.getElementById('movableSearchInput');
    
    // Fix CSS inconsistencies
    fixSearchStyles();
    
    // Fix positioning
    fixSearchPosition();
    
    // Make sure it's visible
    searchWrapper.style.opacity = '1';
    
    // Remove any existing event listeners to prevent duplicates
    const newSearchIcon = searchIcon.cloneNode(true);
    const newCloseIcon = closeIcon.cloneNode(true);
    
    searchIcon.parentNode.replaceChild(newSearchIcon, searchIcon);
    closeIcon.parentNode.replaceChild(newCloseIcon, closeIcon);
    
    // Add event listeners
    newSearchIcon.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleSearch(true);
    });
    
    newCloseIcon.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleSearch(false);
    });
    
    searchOverlay.addEventListener('click', function() {
        toggleSearch(false);
    });
    
    // Make search draggable
    makeSearchDraggable();
    
    console.log('Search button visibility and functionality fixed');
    
    // Function to fix search styles
    function fixSearchStyles() {
        // Apply consistent styling
        searchWrapper.classList.add('collapsed');
        searchWrapper.classList.remove('expanded');
        
        // Fix theme compatibility
        const isDarkTheme = document.documentElement.getAttribute('data-theme') === 'dark';
        if (isDarkTheme) {
            searchWrapper.classList.add('dark-theme');
        } else {
            searchWrapper.classList.remove('dark-theme');
        }
    }
    
    // Function to fix search position
    function fixSearchPosition() {
        // Get saved position from localStorage
        const savedPosition = localStorage.getItem('searchPosition');
        
        if (savedPosition) {
            try {
                const { x, y } = JSON.parse(savedPosition);
                
                // Validate position - make sure it's within viewport
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;
                const wrapperWidth = searchWrapper.offsetWidth || 60;
                const wrapperHeight = searchWrapper.offsetHeight || 60;
                
                // Ensure position is within viewport bounds
                const validX = Math.max(0, Math.min(x, viewportWidth - wrapperWidth));
                const validY = Math.max(0, Math.min(y, viewportHeight - wrapperHeight));
                
                // Apply position
                searchWrapper.style.transform = `translate(${validX}px, ${validY}px)`;
                console.log(`Search positioned at saved coordinates: (${validX}, ${validY})`);
            } catch (e) {
                console.error('Error parsing saved position:', e);
                setDefaultPosition();
            }
        } else {
            setDefaultPosition();
        }
    }
    
    // Function to set default position
    function setDefaultPosition() {
        const right = 20;
        const top = 80;
        const width = searchWrapper.offsetWidth || 55;
        const x = window.innerWidth - width - right;
        
        searchWrapper.style.transform = `translate(${x}px, ${top}px)`;
        console.log(`Search positioned at default coordinates: (${x}, ${top})`);
        
        // Save this position
        savePosition(x, top);
    }
    
    // Function to save position
    function savePosition(x, y) {
        if (!x || !y) {
            const rect = searchWrapper.getBoundingClientRect();
            x = rect.left;
            y = rect.top;
        }
        
        localStorage.setItem('searchPosition', JSON.stringify({ x, y }));
    }
    
    // Toggle search function
    function toggleSearch(expand) {
        if (expand === undefined) {
            expand = !searchWrapper.classList.contains('expanded');
        }
        
        if (expand) {
            // Store the current position before expanding
            const rect = searchWrapper.getBoundingClientRect();
            searchWrapper.dataset.lastLeft = rect.left + 'px';
            searchWrapper.dataset.lastTop = rect.top + 'px';
            
            // Expand search
            searchWrapper.classList.add('expanded');
            searchWrapper.classList.remove('collapsed');
            
            // Show overlay
            searchOverlay.style.display = 'block';
            setTimeout(() => {
                searchOverlay.classList.add('active');
            }, 10);
            
            // Focus input after transition completes
            setTimeout(() => {
                if (searchInput) {
                    searchInput.focus();
                    searchInput.value = ''; // Clear any previous input
                }
            }, 300);
        } else {
            // Collapse search
            searchWrapper.classList.remove('expanded');
            searchWrapper.classList.add('collapsed');
            
            // Hide overlay
            searchOverlay.classList.remove('active');
            setTimeout(() => {
                searchOverlay.style.display = 'none';
            }, 300);
            
            // Clear input
            if (searchInput) {
                searchInput.value = '';
            }
            
            // Hide results if visible
            const resultsContainer = document.querySelector('.search-results');
            if (resultsContainer) {
                resultsContainer.style.display = 'none';
            }
            
            // Return to previous position with slight delay to allow for transition
            if (searchWrapper.dataset.lastLeft && searchWrapper.dataset.lastTop) {
                const left = parseFloat(searchWrapper.dataset.lastLeft);
                const top = parseFloat(searchWrapper.dataset.lastTop);
                
                setTimeout(() => {
                    searchWrapper.style.transform = `translate(${left}px, ${top}px)`;
                }, 50);
            }
        }
    }
    
    // Make search draggable
    function makeSearchDraggable() {
        let isDragging = false;
        let dragStartX = 0;
        let dragStartY = 0;
        let initialX = 0;
        let initialY = 0;
        let startTime = 0;
        const dragThreshold = 5;
        let hasMoved = false;
        
        // Add event listeners
        searchWrapper.addEventListener('mousedown', onDragStart);
        searchWrapper.addEventListener('touchstart', onDragStart, { passive: false });
        
        document.addEventListener('mousemove', onDragMove);
        document.addEventListener('touchmove', onDragMove, { passive: false });
        
        document.addEventListener('mouseup', onDragEnd);
        document.addEventListener('touchend', onDragEnd);
        
        function onDragStart(e) {
            // Prevent dragging when expanded
            if (searchWrapper.classList.contains('expanded')) {
                return;
            }
            
            let clientX, clientY;
            
            if (e.type === 'touchstart') {
                e.preventDefault(); // Prevent scrolling when starting drag on touch devices
                const touch = e.touches[0];
                clientX = touch.clientX;
                clientY = touch.clientY;
            } else {
                clientX = e.clientX;
                clientY = e.clientY;
            }
            
            // Check if click is on the search icon
            if (e.target.closest('.search-icon') || e.target.closest('.close-icon')) {
                return;
            }
            
            isDragging = true;
            hasMoved = false;
            startTime = Date.now();
            
            searchWrapper.classList.add('grabbing');
            
            // Get current transform matrix
            const style = window.getComputedStyle(searchWrapper);
            const transform = style.getPropertyValue('transform');
            
            if (transform && transform !== 'none') {
                // Parse the matrix values
                const matrix = transform.match(/matrix.*\((.+)\)/);
                if (matrix) {
                    const values = matrix[1].split(', ').map(parseFloat);
                    initialX = values[4] || 0;
                    initialY = values[5] || 0;
                } else {
                    initialX = 0;
                    initialY = 0;
                }
            } else {
                // No transform set yet
                initialX = 0;
                initialY = 0;
            }
            
            dragStartX = clientX - initialX;
            dragStartY = clientY - initialY;
        }
        
        function onDragMove(e) {
            if (!isDragging) return;
            
            let clientX, clientY;
            
            if (e.type === 'touchmove') {
                e.preventDefault(); // Prevent scrolling during drag
                const touch = e.touches[0];
                clientX = touch.clientX;
                clientY = touch.clientY;
            } else {
                e.preventDefault(); // Prevent text selection
                clientX = e.clientX;
                clientY = e.clientY;
            }
            
            const x = clientX - dragStartX;
            const y = clientY - dragStartY;
            
            // Calculate distance moved
            const deltaX = Math.abs(x - initialX);
            const deltaY = Math.abs(y - initialY);
            
            // If moved more than threshold, mark as moved
            if (deltaX > dragThreshold || deltaY > dragThreshold) {
                hasMoved = true;
            }
            
            // Ensure the search wrapper stays within viewport bounds
            const maxX = window.innerWidth - searchWrapper.offsetWidth;
            const maxY = window.innerHeight - searchWrapper.offsetHeight;
            
            const boundedX = Math.max(0, Math.min(x, maxX));
            const boundedY = Math.max(0, Math.min(y, maxY));
            
            // Apply the translation with smooth movement
            searchWrapper.style.transform = `translate(${boundedX}px, ${boundedY}px)`;
        }
        
        function onDragEnd(e) {
            if (!isDragging) return;
            
            isDragging = false;
            searchWrapper.classList.remove('grabbing');
            
            // Save the final position
            savePosition();
            
            // Reset if it was just a short tap/click (not a drag)
            if (!hasMoved && (Date.now() - startTime) < 200) {
                // It was a click/tap, not a drag
                if (!searchWrapper.classList.contains('expanded')) {
                    toggleSearch(true);
                }
            }
            
            // Snap to edge if close to edge
            const rect = searchWrapper.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const snapThreshold = 50; // pixels
            
            if (rect.right > viewportWidth - snapThreshold) {
                // Snap to right edge
                const rightEdgeX = viewportWidth - rect.width;
                searchWrapper.style.transform = `translate(${rightEdgeX}px, ${rect.top}px)`;
                searchWrapper.classList.add('snapping');
                setTimeout(() => {
                    searchWrapper.classList.remove('snapping');
                    // Update saved position after snapping
                    savePosition();
                }, 300);
            } else if (rect.left < snapThreshold) {
                // Snap to left edge
                searchWrapper.style.transform = `translate(0px, ${rect.top}px)`;
                searchWrapper.classList.add('snapping');
                setTimeout(() => {
                    searchWrapper.classList.remove('snapping');
                    // Update saved position after snapping
                    savePosition();
                }, 300);
            }
            
            // Prevent search from being partially off-screen at the bottom
            if (rect.bottom > window.innerHeight - 10) {
                const newY = window.innerHeight - rect.height - 10;
                searchWrapper.style.transform = `translate(${rect.left}px, ${newY}px)`;
                // Update saved position
                savePosition();
            }
        }
    }
}

// Run the fix when the DOM is loaded
document.addEventListener('DOMContentLoaded', fixSearchButtonVisibility);

// Also run it after a short delay to ensure it works even if DOMContentLoaded has already fired
setTimeout(fixSearchButtonVisibility, 500);

// Run it again after window load to ensure it works
window.addEventListener('load', fixSearchButtonVisibility);

// Run it when theme changes
document.addEventListener('themeChanged', fixSearchButtonVisibility);

// Run it on window resize to ensure proper positioning
window.addEventListener('resize', function() {
    // Debounce the resize event
    clearTimeout(window.resizeTimer);
    window.resizeTimer = setTimeout(function() {
        const searchWrapper = document.getElementById('movableSearch');
        if (searchWrapper && !searchWrapper.classList.contains('expanded')) {
            // Ensure search stays within viewport
            const rect = searchWrapper.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            
            let needsRepositioning = false;
            let newX = rect.left;
            let newY = rect.top;
            
            // Check if search is partially off-screen
            if (rect.right > viewportWidth) {
                newX = viewportWidth - rect.width - 20;
                needsRepositioning = true;
            }
            
            if (rect.bottom > viewportHeight) {
                newY = viewportHeight - rect.height - 20;
                needsRepositioning = true;
            }
            
            if (needsRepositioning) {
                searchWrapper.style.transform = `translate(${newX}px, ${newY}px)`;
                // Save new position
                localStorage.setItem('searchPosition', JSON.stringify({ x: newX, y: newY }));
            }
        }
    }, 250);
});
