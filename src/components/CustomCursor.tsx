import React, { useEffect } from 'react';

export const CustomCursor: React.FC = () => {
  useEffect(() => {
    // Hide default system cursor on non-touch devices
    if (!('ontouchstart' in window)) {
      document.body.style.cursor = 'none';
    }

    const dot = document.querySelector('.cursor-dot') as HTMLElement;
    const circle = document.querySelector('.cursor-circle') as HTMLElement;

    if (!dot || !circle) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let circleX = mouseX;
    let circleY = mouseY;
    let animFrameId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      dot.style.left = `${mouseX}px`;
      dot.style.top = `${mouseY}px`;
    };

    const animateCircle = () => {
      const ease = 0.15;
      circleX += (mouseX - circleX) * ease;
      circleY += (mouseY - circleY) * ease;

      circle.style.left = `${circleX}px`;
      circle.style.top = `${circleY}px`;

      animFrameId = requestAnimationFrame(animateCircle);
    };

    animFrameId = requestAnimationFrame(animateCircle);
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // Event Delegation for hover and text states matching custom-cursor.js
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      // Buttons and Links -> hover state
      const hoverable = target.closest('a, button, .btn, .project-item, .tools-icon, .tree-node, .showcase-card, .bento-card, .value-card, .apps-card');
      if (hoverable) {
        dot.classList.add('hover');
        circle.classList.add('hover');
        dot.classList.remove('text');
        circle.classList.remove('text');
        return;
      }

      // Text elements -> I-beam capsule state
      const textable = target.closest('p, h1, h2, h3, h4, h5, h6, span, li, input, textarea');
      if (textable) {
        dot.classList.add('text');
        circle.classList.add('text');
        dot.classList.remove('hover');
        circle.classList.remove('hover');
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const hoverable = target.closest('a, button, .btn, .project-item, .tools-icon, .tree-node, .showcase-card, .bento-card, .value-card, .apps-card');
      if (hoverable) {
        dot.classList.remove('hover');
        circle.classList.remove('hover');
      }

      const textable = target.closest('p, h1, h2, h3, h4, h5, h6, span, li, input, textarea');
      if (textable) {
        dot.classList.remove('text');
        circle.classList.remove('text');
      }
    };

    const onMouseDown = () => {
      dot.classList.add('click');
      circle.classList.add('click');
    };

    const onMouseUp = () => {
      dot.classList.remove('click');
      circle.classList.remove('click');
    };

    const onMouseLeave = () => {
      dot.style.opacity = '0';
      circle.style.opacity = '0';
    };

    const onMouseEnter = () => {
      dot.style.opacity = '1';
      circle.style.opacity = '1';
    };

    document.addEventListener('mouseover', onMouseOver, { passive: true });
    document.addEventListener('mouseout', onMouseOut, { passive: true });
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      if (animFrameId) cancelAnimationFrame(animFrameId);
      document.body.style.cursor = 'auto';
    };
  }, []);

  return (
    <>
      <div className="cursor-dot"></div>
      <div className="cursor-circle"></div>

      {/* SVG Custom Cursors matching custom-cursor.html */}
      <img
        id="svg-cursor-check"
        src="Vrindopnishad%20Web/class/Custom%20Cursor/check-stroke.svg"
        alt="Check Cursor"
        style={{ display: 'none', position: 'fixed', zIndex: 10002, pointerEvents: 'none', width: '32px', height: '32px', transform: 'translate(-50%,-50%)' }}
      />
      <img
        id="svg-cursor-close"
        src="Vrindopnishad%20Web/class/Custom%20Cursor/close-stroke.svg"
        alt="Close Cursor"
        style={{ display: 'none', position: 'fixed', zIndex: 10002, pointerEvents: 'none', width: '32px', height: '32px', transform: 'translate(-50%,-50%)' }}
      />
      <img
        id="svg-cursor-notallowed"
        src="Vrindopnishad%20Web/class/Custom%20Cursor/not-allowed.svg"
        alt="Not Allowed Cursor"
        style={{ display: 'none', position: 'fixed', zIndex: 10002, pointerEvents: 'none', width: '32px', height: '32px', transform: 'translate(-50%,-50%)' }}
      />
    </>
  );
};
