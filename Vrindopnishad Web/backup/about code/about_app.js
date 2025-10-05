const hamburger = document.querySelector('.header .nav-bar .nav-list .hamburger');
const mobile_menu = document.querySelector('.header .nav-bar .nav-list ul');
const menu_item = document.querySelectorAll('.header .nav-bar .nav-list ul li a');
const header = document.querySelector('.header.container');
const sections = document.querySelectorAll('section');
const navLi = document.querySelectorAll('.nav-list ul li');

hamburger.addEventListener('click', () => {
	hamburger.classList.toggle('active');
	mobile_menu.classList.toggle('active');
	hamburger.style.transform = hamburger.classList.contains('active') ? 'rotate(90deg)' : 'rotate(0deg)'; // Enhance animation
});

document.addEventListener('scroll', () => {
	var scroll_position = window.scrollY;
	if (scroll_position > 250) {
		header.style.backgroundColor = 'rgba(218, 158, 7, 0.2)'; // Maintain glass morphic effect
		header.style.backdropFilter = 'blur(10px)';
		header.style.webkitBackdropFilter = 'blur(10px)';
		header.style.borderRadius = '10px'; // Maintain rounded corners
		header.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'; // Maintain box shadow
	} else {
		header.style.backgroundColor = 'rgba(249, 249, 248, 0.05)';
		header.style.backdropFilter = 'blur(10px)';
		header.style.webkitBackdropFilter = 'blur(10px)';
		header.style.borderRadius = '10px'; // Maintain rounded corners
		header.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'; // Maintain box shadow
	}

	sections.forEach((section) => {
		const sectionTop = section.offsetTop;
		const sectionHeight = section.clientHeight;
		if (scroll_position >= sectionTop - sectionHeight / 3 && scroll_position < sectionTop + sectionHeight - sectionHeight / 3) {
			const currentId = section.getAttribute('id');
			navLi.forEach((li) => {
				li.classList.remove('active');
				if (li.querySelector('a').getAttribute('href').includes(currentId)) {
					li.classList.add('active');
				}
			});
		}
	});
});

window.addEventListener('scroll', () => {
  const footer = document.querySelector('footer');
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 50) { // Adjust the threshold
    footer.classList.add('show-footer');
  } else {
    footer.classList.remove('show-footer');
  }
});

// Ensure the first icon is already popped on entering
document.addEventListener('DOMContentLoaded', () => {
	navLi[0].classList.add('active');
});

menu_item.forEach((item) => {
	item.addEventListener('click', () => {
		hamburger.classList.toggle('active');
		mobile_menu.classList.toggle('active');
		hamburger.style.transform = hamburger.classList.contains('active') ? 'rotate(90deg)' : 'rotate(0deg)'; // Enhance animation
	});
});

// Add enhanced hover effects for team members
document.addEventListener('DOMContentLoaded', function() {
    // Team member hover effects
    const teamMembers = document.querySelectorAll('#Members .project-item');
    
    teamMembers.forEach(member => {
        member.addEventListener('mouseenter', function() {
            // Add 3D tilt effect
            member.addEventListener('mousemove', handleTilt);
        });
        
        member.addEventListener('mouseleave', function() {
            // Remove 3D tilt effect
            member.removeEventListener('mousemove', handleTilt);
            member.style.transform = 'translateX(15px)';
            
            // Reset transition
            setTimeout(() => {
                member.style.transition = 'all 0.5s ease';
            }, 100);
        });
    });
    
    // Function to handle tilt effect
    function handleTilt(e) {
        const member = this;
        const memberRect = member.getBoundingClientRect();
        
        // Calculate mouse position relative to card
        const mouseX = e.clientX - memberRect.left;
        const mouseY = e.clientY - memberRect.top;
        
        // Calculate rotation (reduce intensity for subtle effect)
        const rotateY = ((mouseX / memberRect.width) - 0.5) * 5;
        const rotateX = ((mouseY / memberRect.height) - 0.5) * -5;
        
        // Temporarily disable transition for smooth tilt
        member.style.transition = 'transform 0.1s ease';
        
        // Apply transformations (maintain translateX effect)
        member.style.transform = `translateX(15px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }
    
    // Add image focus effect
    teamMembers.forEach(member => {
        const image = member.querySelector('.project-img img');
        const info = member.querySelector('.project-info');
        
        if (image && info) {
            // Focus on hovered area
            member.addEventListener('mousemove', function(e) {
                const memberRect = member.getBoundingClientRect();
                const mouseX = e.clientX - memberRect.left;
                
                // If mouse is over the image side
                if (mouseX > memberRect.width / 2) {
                    image.style.transform = 'scale(1.15)';
                    info.style.opacity = '0.8';
                } 
                // If mouse is over the info side
                else {
                    image.style.transform = 'scale(1.05)';
                    info.style.opacity = '1';
                }
            });
            
            // Reset on leave
            member.addEventListener('mouseleave', function() {
                image.style.transform = 'scale(1.1)';
                info.style.opacity = '1';
            });
        }
    });
});

// Add horizontal scrolling for team section
document.addEventListener('DOMContentLoaded', function() {
    const teamSection = document.querySelector('.team-section');
    if (!teamSection) return;
    
    const horizontalContent = teamSection.querySelector('.horizontal-content');
    const scrollIndicator = teamSection.querySelector('.scroll-indicator');
    
    let isDown = false;
    let startX;
    let scrollLeft;
    let maxScroll = 0;
    let currentTransform = 0;
    let indicatorTimeout;
    
    // Calculate maximum scroll value
    function calculateMaxScroll() {
        if (!horizontalContent) return 0;
        return horizontalContent.scrollWidth - window.innerWidth + 60; // Add padding
    }
    
    // Update scroll position
    function updateScrollPosition(pos) {
        if (!horizontalContent) return;
        
        // Ensure scroll doesn't exceed limits
        const newPosition = Math.max(Math.min(pos, maxScroll), 0);
        currentTransform = newPosition;
        
        // Apply transform
        horizontalContent.style.transform = `translateX(${-newPosition}px)`;
        
        // Show scroll indicator
        if (scrollIndicator) {
            scrollIndicator.style.opacity = '1';
            clearTimeout(indicatorTimeout);
            indicatorTimeout = setTimeout(() => {
                scrollIndicator.style.opacity = '0';
            }, 3000);
        }
    }
    
    // Initialize
    function init() {
        if (!horizontalContent) return;
        
        maxScroll = calculateMaxScroll();
        
        // Mouse wheel event
        teamSection.addEventListener('wheel', function(e) {
            if (window.innerWidth <= 768) return; // Disable on mobile
            e.preventDefault();
            updateScrollPosition(currentTransform + e.deltaY * 1.5);
        });
        
        // Touch events
        horizontalContent.addEventListener('touchstart', function(e) {
            if (window.innerWidth <= 768) return; // Disable on mobile
            isDown = true;
            startX = e.touches[0].pageX - horizontalContent.offsetLeft;
            scrollLeft = currentTransform;
        });
        
        horizontalContent.addEventListener('touchmove', function(e) {
            if (!isDown || window.innerWidth <= 768) return;
            e.preventDefault();
            const x = e.touches[0].pageX - horizontalContent.offsetLeft;
            const walk = (x - startX) * 1.5;
            updateScrollPosition(scrollLeft - walk);
        });
        
        horizontalContent.addEventListener('touchend', function() {
            isDown = false;
        });
        
        // Mouse drag events
        horizontalContent.addEventListener('mousedown', function(e) {
            if (window.innerWidth <= 768) return; // Disable on mobile
            isDown = true;
            startX = e.pageX - horizontalContent.offsetLeft;
            scrollLeft = currentTransform;
            horizontalContent.style.cursor = 'grabbing';
        });
        
        horizontalContent.addEventListener('mousemove', function(e) {
            if (!isDown || window.innerWidth <= 768) return;
            e.preventDefault();
            const x = e.pageX - horizontalContent.offsetLeft;
            const walk = (x - startX) * 1.5;
            updateScrollPosition(scrollLeft - walk);
        });
        
        horizontalContent.addEventListener('mouseup', function() {
            isDown = false;
            horizontalContent.style.cursor = 'grab';
        });
        
        horizontalContent.addEventListener('mouseleave', function() {
            isDown = false;
            horizontalContent.style.cursor = 'grab';
        });
        
        // Window resize
        window.addEventListener('resize', function() {
            maxScroll = calculateMaxScroll();
            if (window.innerWidth <= 768) {
                // Reset transform on mobile
                horizontalContent.style.transform = 'translateX(0)';
                currentTransform = 0;
            } else {
                // Ensure scroll position is still valid
                updateScrollPosition(Math.min(currentTransform, maxScroll));
            }
        });
        
        // Show scroll indicator initially, then fade it out
        if (scrollIndicator) {
            scrollIndicator.style.opacity = '1';
            indicatorTimeout = setTimeout(() => {
                scrollIndicator.style.opacity = '0';
            }, 3000);
            
            // Show indicator again on hover
            teamSection.addEventListener('mouseenter', function() {
                if (window.innerWidth <= 768) return;
                scrollIndicator.style.opacity = '1';
                clearTimeout(indicatorTimeout);
            });
            
            teamSection.addEventListener('mouseleave', function() {
                if (window.innerWidth <= 768) return;
                indicatorTimeout = setTimeout(() => {
                    scrollIndicator.style.opacity = '0';
                }, 3000);
            });
        }
    }
    
    // Enhanced hover effects for team members
    const teamMembers = document.querySelectorAll('.team-member');
    
    teamMembers.forEach(member => {
        member.addEventListener('mouseenter', function() {
            // Add 3D tilt effect
            if (window.innerWidth <= 768) return;
            member.addEventListener('mousemove', handleTilt);
        });
        
        member.addEventListener('mouseleave', function() {
            // Remove 3D tilt effect
            member.removeEventListener('mousemove', handleTilt);
            
            // Reset transform with transition
            member.style.transition = 'transform 0.5s ease';
            member.style.transform = 'translateY(-10px)';
        });
    });
    
    // Function to handle tilt effect
    function handleTilt(e) {
        const member = this;
        const memberRect = member.getBoundingClientRect();
        
        // Calculate mouse position relative to card
        const mouseX = e.clientX - memberRect.left;
        const mouseY = e.clientY - memberRect.top;
        
        // Calculate rotation (reduce intensity for subtle effect)
        const rotateY = ((mouseX / memberRect.width) - 0.5) * 5;
        const rotateX = ((mouseY / memberRect.height) - 0.5) * -5;
        
        // Temporarily disable transition for smooth tilt
        member.style.transition = 'transform 0.1s ease';
        
        // Apply transformations (maintain translateY effect)
        member.style.transform = `translateY(-10px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }
    
    // Initialize
    init();
});
