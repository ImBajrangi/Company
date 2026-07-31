import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useAnimations = () => {
  useEffect(() => {
    let animFrameId: number;

    // WebGL Canvas Particle Field
    const initParticleCanvas = () => {
      let canvas = document.querySelector('canvas.webgl-background') as HTMLCanvasElement;
      if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.classList.add('webgl-background');
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.zIndex = '-1';
        canvas.style.pointerEvents = 'none';
        document.body.appendChild(canvas);
      }

      const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
      if (!gl) return;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const vsSource = `
        attribute vec4 aVertexPosition;
        attribute vec4 aVertexColor;
        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;
        varying lowp vec4 vColor;
        void main(void) {
          gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
          gl_PointSize = 2.0;
          vColor = aVertexColor;
        }
      `;

      const fsSource = `
        varying lowp vec4 vColor;
        void main(void) {
          gl_FragColor = vColor;
        }
      `;

      const loadShader = (type: number, source: string) => {
        const shader = gl.createShader(type);
        if (!shader) return null;
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        return shader;
      };

      const vertexShader = loadShader(gl.VERTEX_SHADER, vsSource);
      const fragmentShader = loadShader(gl.FRAGMENT_SHADER, fsSource);
      if (!vertexShader || !fragmentShader) return;

      const shaderProgram = gl.createProgram();
      if (!shaderProgram) return;
      gl.attachShader(shaderProgram, vertexShader);
      gl.attachShader(shaderProgram, fragmentShader);
      gl.linkProgram(shaderProgram);

      const render = () => {
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0.05, 0.05, 0.07, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        animFrameId = requestAnimationFrame(render);
      };

      render();
    };

    initParticleCanvas();

    // GSAP ScrollTrigger Typography Animations (ScrollBlurTypography & OnScrollTypographyAnimations)
    const initTypography = () => {
      const windowSplitting = (window as any).Splitting;
      if (windowSplitting) {
        windowSplitting({ target: '.content__title[data-splitting]' });
      }

      requestAnimationFrame(() => {
        // 1. ScrollBlurTypography Animation: Smooth blur-to-focus reveal for labels & subtitles
        const blurElements = document.querySelectorAll('.fade-up-off, .showcase-subtitle, .bento-label, .universe-quote, .values-label');
        blurElements.forEach((el: Element) => {
          gsap.fromTo(
            el,
            { opacity: 0, y: 30, filter: 'blur(12px)' },
            {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              duration: 0.8,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: el,
                start: 'top bottom-=15%',
                end: 'top center+=20%',
                toggleActions: 'play none none reverse'
              }
            }
          );
        });

        // 2. OnScrollTypographyAnimations (OnScrollHeading FX1: Hero Title)
        const fx1Titles = document.querySelectorAll('.content__title[data-splitting][data-effect1]');
        fx1Titles.forEach((title: Element) => {
          const chars = title.querySelectorAll('.char');
          if (!chars.length) return;
          gsap.fromTo(
            chars,
            { opacity: 0, scale: 0.6, rotationZ: () => gsap.utils.random(-20, 20) },
            {
              ease: 'power4.out',
              opacity: 1,
              scale: 1,
              rotationZ: 0,
              stagger: 0.04,
              scrollTrigger: {
                trigger: title,
                start: 'top bottom-=10%',
                end: 'bottom center',
                scrub: 1
              }
            }
          );
        });

        // OnScrollTypographyAnimations (OnScrollHeading FX2: Projects Title)
        const fx2Titles = document.querySelectorAll('.content__title[data-splitting][data-effect2]');
        fx2Titles.forEach((title: Element) => {
          const chars = title.querySelectorAll('.char');
          if (!chars.length) return;
          gsap.fromTo(
            chars,
            { opacity: 0, yPercent: 120, scaleY: 2.3, scaleX: 0.7, transformOrigin: '50% 0%' },
            {
              duration: 1,
              ease: 'back.out(1.7)',
              opacity: 1,
              yPercent: 0,
              scaleY: 1,
              scaleX: 1,
              stagger: 0.03,
              scrollTrigger: {
                trigger: title,
                start: 'top bottom-=15%',
                end: 'bottom center',
                scrub: 1
              }
            }
          );
        });

        // OnScrollTypographyAnimations (OnScrollHeading FX5: Core Values Title)
        const fx5Titles = document.querySelectorAll('.content__title[data-splitting][data-effect5]');
        fx5Titles.forEach((title: Element) => {
          const chars = title.querySelectorAll('.char');
          if (!chars.length) return;
          gsap.fromTo(
            chars,
            { opacity: 0, xPercent: () => gsap.utils.random(-200, 200), yPercent: () => gsap.utils.random(-150, 150) },
            {
              ease: 'power1.out',
              opacity: 1,
              xPercent: 0,
              yPercent: 0,
              stagger: { each: 0.05, grid: 'auto', from: 'random' },
              scrollTrigger: {
                trigger: title,
                start: 'top bottom-=15%',
                end: 'bottom center',
                scrub: 0.9
              }
            }
          );
        });

        // OnScrollTypographyAnimations (OnScrollHeading FX6: Our Story & Get Apps 3D Perspective Flip)
        const fx6Titles = document.querySelectorAll('.content__title[data-splitting][data-effect6]');
        fx6Titles.forEach((title: Element) => {
          const words = title.querySelectorAll('.word');
          words.forEach((word: Element) => {
            const chars = word.querySelectorAll('.char');
            if (!chars.length) return;
            chars.forEach((char: Element) => {
              if (char.parentNode) {
                (char.parentNode as HTMLElement).style.perspective = '2000px';
              }
            });
            gsap.fromTo(
              chars,
              { opacity: 0, rotationX: -90, yPercent: 50 },
              {
                ease: 'power1.out',
                opacity: 1,
                rotationX: 0,
                yPercent: 0,
                stagger: { each: 0.03, from: 0 },
                scrollTrigger: {
                  trigger: word,
                  start: 'top bottom-=15%',
                  end: 'bottom center',
                  scrub: 0.9
                }
              }
            );
          });
        });

        // OnScrollTypographyAnimations (OnScrollHeading FX8: Digital Universe Hacker Decode)
        const lettersAndSymbols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '!', '@', '#', '$', '%', '^', '&', '*', '-', '_', '+', '=', ';', ':', '<', '>', ','];
        const fx8Titles = document.querySelectorAll('.content__title[data-splitting][data-effect8]');
        fx8Titles.forEach((title: Element) => {
          const chars = title.querySelectorAll('.char');
          if (!chars.length) return;
          chars.forEach((char: Element, position: number) => {
            const initialHTML = char.innerHTML;
            gsap.fromTo(
              char,
              { opacity: 0 },
              {
                duration: 0.03,
                innerHTML: () => lettersAndSymbols[Math.floor(Math.random() * lettersAndSymbols.length)],
                repeat: 1,
                repeatRefresh: true,
                opacity: 1,
                repeatDelay: 0.03,
                delay: (position + 1) * 0.18,
                onComplete: () => {
                  gsap.set(char, { innerHTML: initialHTML, delay: 0.03 });
                },
                scrollTrigger: {
                  trigger: title,
                  start: 'top bottom',
                  end: 'bottom center',
                  toggleActions: 'play resume resume reset',
                  onEnter: () => gsap.set(char, { opacity: 0 })
                }
              }
            );
          });
        });

        // OnScrollTypographyAnimations (OnScrollHeading FX10 & ScrollBlurTypography: Bento Grid "For You")
        const fx10Titles = document.querySelectorAll('.content__title[data-splitting][data-effect10]');
        fx10Titles.forEach((title: Element) => {
          const chars = title.querySelectorAll('.char');
          if (!chars.length) return;
          gsap.fromTo(
            chars,
            { opacity: 0, filter: 'blur(20px)' },
            {
              duration: 0.25,
              ease: 'power1.out',
              opacity: 1,
              filter: 'blur(0px)',
              stagger: { each: 0.05, from: 'random' },
              scrollTrigger: {
                trigger: title,
                start: 'top bottom-=10%',
                end: 'bottom center',
                toggleActions: 'play resume resume reset'
              }
            }
          );
        });

        ScrollTrigger.refresh();
      });
    };

    const timer = setTimeout(initTypography, 250);
    return () => {
      clearTimeout(timer);
      if (animFrameId) cancelAnimationFrame(animFrameId);
    };
  }, []);
};
