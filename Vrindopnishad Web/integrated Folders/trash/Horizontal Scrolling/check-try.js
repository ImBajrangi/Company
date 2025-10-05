document.addEventListener('DOMContentLoaded', () => {
    const imageTrack = document.querySelector('.image-track');
    const scrollSpacer = document.querySelector('.scroll-spacer');
    let currentPos = 0;
    let totalWidth = 0;
  
    // Calculate total width of unique images (before duplication)
    document.querySelectorAll('.image-block').forEach((block, index) => {
      if (index < imageTrack.children.length / 2) {
        totalWidth += block.offsetWidth + parseInt(getComputedStyle(block).marginRight);
      }
    });
  
    // Set spacer height based on content width
    scrollSpacer.style.height = `${totalWidth * 1.5}px`;
  
    // Scroll handler
    let raf;
    window.addEventListener('scroll', () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const maxScroll = scrollSpacer.offsetHeight - window.innerHeight;
        const progress = scrollY / maxScroll;
        
        // Calculate horizontal translation
        const translateX = progress * totalWidth * 2; // Multiply by 2 for duplicated content
        
        // Reset position for infinite loop
        if (translateX >= totalWidth) {
          currentPos = translateX - totalWidth;
        } else {
          currentPos = translateX;
        }
        
        imageTrack.style.transform = `translateX(-${currentPos}px)`;
      });
    });
  
    // Initialize position
    window.dispatchEvent(new Event('scroll'));
  });