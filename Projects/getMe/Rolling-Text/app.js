// original - https://codepen.io/petebarr/pen/oJvVpw

gsap.registerPlugin(SplitText);

console.clear();

// Make container visible
const container = document.querySelector(".container");
gsap.set(container, { visibility: "visible" });

// Grab all lines
const lines = document.querySelectorAll(".line");

// Split characters for all lines
const splitLines = Array.from(lines).map(line => 
  new SplitText(line, { type: "chars", charsClass: "char" })
);

// 3D setup
const width = window.innerWidth;
const height = window.innerHeight;
const depth = -width / 8;
const transformOrigin = `50% 50% ${depth}`;

gsap.set(lines, { perspective: 700, transformStyle: "preserve-3d" });

// Timeline animation
const animTime = 0.9;
const tl = gsap.timeline({repeat: -1});

// Animate each line in a loop
splitLines.forEach((split, index) => {
  tl.fromTo(
    split.chars,
    { rotationX: -90 },
    { rotationX: 90, stagger: 0.08, duration: animTime, ease: "none", transformOrigin },
    index * 0.45 // stagger between lines
  );
});
