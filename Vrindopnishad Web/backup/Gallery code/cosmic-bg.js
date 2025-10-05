// Create enhanced cosmic background elements
function createCosmicBackground() {
  // Remove any existing cosmic background
  const existingBg = document.querySelector('.cosmic-background');
  if (existingBg) {
    existingBg.remove();
  }

  // Create new cosmic background
  const cosmicBg = document.createElement('div');
  cosmicBg.className = 'cosmic-background';
  document.body.appendChild(cosmicBg);
  
  // Create depth layers for parallax effect
  const layers = ['cosmic-layer-1', 'cosmic-layer-2', 'cosmic-layer-3', 'cosmic-layer-4'];
  const layerElements = {};
  
  layers.forEach(layer => {
    const layerElement = document.createElement('div');
    layerElement.className = layer;
    layerElement.style.position = 'absolute';
    layerElement.style.width = '100%';
    layerElement.style.height = '100%';
    cosmicBg.appendChild(layerElement);
    layerElements[layer] = layerElement;
  });
  
  // Create stars container
  const starsContainer = document.createElement('div');
  starsContainer.className = 'stars-container';
  layerElements['cosmic-layer-1'].appendChild(starsContainer);
  
  // Generate stars with improved distribution
  const starCount = 250;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  // Divide the viewport into sections to ensure good distribution
  const gridSize = Math.ceil(Math.sqrt(starCount));
  const cellWidth = viewportWidth / gridSize;
  const cellHeight = viewportHeight / gridSize;
  
  // Star types and colors
  const starTypes = ['', 'blue', 'yellow', 'red'];
  const starGlowColors = ['rgba(255, 255, 255, 0.8)', 'rgba(114, 186, 255, 0.8)', 
                         'rgba(255, 218, 114, 0.8)', 'rgba(255, 114, 114, 0.8)'];
  
  for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    
    // Calculate position based on grid cell to ensure even distribution
    const gridX = i % gridSize;
    const gridY = Math.floor(i / gridSize);
    
    // Add some randomness within each cell
    const randomOffsetX = Math.random() * cellWidth;
    const randomOffsetY = Math.random() * cellHeight;
    
    const posX = (gridX * cellWidth + randomOffsetX) / viewportWidth * 100;
    const posY = (gridY * cellHeight + randomOffsetY) / viewportHeight * 100;
    
    // Star appearance properties
    const sizeBase = Math.random();
    const sizePower = Math.pow(sizeBase, 3); // More small stars, fewer large ones
    const size = sizePower * 3 + 1; // Size range 1-4px
    
    const typeIndex = Math.floor(Math.random() * starTypes.length);
    const starType = starTypes[typeIndex];
    const glowSize = (size * 1.5) + 'px';
    const glowColor = starGlowColors[typeIndex];
    
    // Randomize twinkling
    const duration = Math.random() * 4 + 3;
    const delay = Math.random() * 5;
    const opacity = Math.random() * 0.3 + 0.7;
    
    // Apply styles
    star.className = `star ${starType}`;
    star.style.setProperty('--duration', `${duration}s`);
    star.style.setProperty('--delay', `${delay}s`);
    star.style.setProperty('--opacity', opacity);
    star.style.setProperty('--glow-size', glowSize);
    star.style.setProperty('--glow-color', glowColor);
    
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.left = `${posX}%`;
    star.style.top = `${posY}%`;
    
    starsContainer.appendChild(star);
  }
  
  // Add star clusters (groups of stars)
  const clusterCount = 4;
  const clusterSizes = [150, 200, 250, 300];
  
  for (let i = 0; i < clusterCount; i++) {
    const cluster = document.createElement('div');
    cluster.className = 'star-cluster';
    
    // Get a random position that's not too close to the edge
    const posX = Math.random() * 60 + 20;
    const posY = Math.random() * 60 + 20;
    const size = clusterSizes[i % clusterSizes.length];
    
    cluster.style.setProperty('--size', `${size}px`);
    cluster.style.left = `${posX}%`;
    cluster.style.top = `${posY}%`;
    
    layerElements['cosmic-layer-2'].appendChild(cluster);
    
    // Add stars to the cluster
    const clusterStarCount = 15 + Math.floor(Math.random() * 10);
    
    for (let j = 0; j < clusterStarCount; j++) {
      const star = document.createElement('div');
      
      // Randomly position within the cluster
      const starPosX = Math.random() * 100;
      const starPosY = Math.random() * 100;
      
      // Star properties
      const starSize = Math.random() * 2.5 + 1;
      const typeIndex = Math.floor(Math.random() * starTypes.length);
      const starType = starTypes[typeIndex];
      const glowSize = (starSize * 1.5) + 'px';
      const glowColor = starGlowColors[typeIndex];
      
      const duration = Math.random() * 4 + 3;
      const delay = Math.random() * 5;
      const opacity = Math.random() * 0.3 + 0.7;
      
      // Apply styles
      star.className = `star ${starType}`;
      star.style.setProperty('--duration', `${duration}s`);
      star.style.setProperty('--delay', `${delay}s`);
      star.style.setProperty('--opacity', opacity);
      star.style.setProperty('--glow-size', glowSize);
      star.style.setProperty('--glow-color', glowColor);
      
      star.style.width = `${starSize}px`;
      star.style.height = `${starSize}px`;
      star.style.left = `${starPosX}%`;
      star.style.top = `${starPosY}%`;
      
      cluster.appendChild(star);
    }
  }
  
  // Generate enhanced nebulae
  const nebulaCount = 4;
  const nebulaPositions = [
    { x: 15, y: 25 },
    { x: 75, y: 20 },
    { x: 25, y: 70 },
    { x: 75, y: 75 }
  ];
  
  // Beautiful nebula color combinations
  const nebulaColors = [
    ['rgba(131, 51, 225, 0.15)', 'rgba(28, 139, 255, 0.05)'],
    ['rgba(255, 91, 91, 0.15)', 'rgba(239, 127, 26, 0.05)'],
    ['rgba(143, 227, 207, 0.15)', 'rgba(62, 128, 255, 0.05)'],
    ['rgba(200, 110, 223, 0.15)', 'rgba(74, 86, 226, 0.05)']
  ];
  
  for (let i = 0; i < nebulaCount; i++) {
    const nebula = document.createElement('div');
    nebula.className = 'nebula';
    
    // Use predefined positions for more intentional placement
    const size = 300 + Math.random() * 200;
    const posX = nebulaPositions[i].x;
    const posY = nebulaPositions[i].y;
    const delay = Math.random() * 10;
    const duration = 60 + Math.random() * 20;
    
    const colorPair = nebulaColors[i % nebulaColors.length];
    
    // Apply styles
    nebula.style.width = `${size}px`;
    nebula.style.height = `${size}px`;
    nebula.style.left = `${posX}%`;
    nebula.style.top = `${posY}%`;
    nebula.style.setProperty('--color1', colorPair[0]);
    nebula.style.setProperty('--color2', colorPair[1]);
    nebula.style.setProperty('--delay', `${delay}s`);
    nebula.style.animationDuration = `${duration}s`;
    
    layerElements['cosmic-layer-3'].appendChild(nebula);
  }
  
  // Generate enhanced galaxies with spiral arms
  const galaxyCount = 3;
  const galaxyPositions = [
    { x: 20, y: 15 },
    { x: 80, y: 30 },
    { x: 50, y: 70 }
  ];
  
  // Galaxy color combinations
  const galaxyColors = [
    {
      core: 'rgba(255, 255, 255, 0.8)',
      arm: 'rgba(151, 70, 255, 0.4)',
      glow: 'rgba(106, 57, 171, 0.2)'
    },
    {
      core: 'rgba(255, 233, 179, 0.8)',
      arm: 'rgba(255, 152, 54, 0.4)',
      glow: 'rgba(204, 88, 32, 0.2)'
    },
    {
      core: 'rgba(179, 217, 255, 0.8)',
      arm: 'rgba(54, 130, 255, 0.4)',
      glow: 'rgba(32, 84, 204, 0.2)'
    }
  ];
  
  for (let i = 0; i < galaxyCount; i++) {
    // Create galaxy container
    const galaxy = document.createElement('div');
    galaxy.className = 'galaxy';
    
    // Use predefined positions
    const size = 200 + Math.random() * 100;
    const posX = galaxyPositions[i].x;
    const posY = galaxyPositions[i].y;
    const delay = Math.random() * 15;
    const duration = 80 + Math.random() * 40;
    
    const colors = galaxyColors[i % galaxyColors.length];
    
    // Apply styles to galaxy core
    galaxy.style.setProperty('--size', `${size}px`);
    galaxy.style.left = `${posX}%`;
    galaxy.style.top = `${posY}%`;
    galaxy.style.setProperty('--core-color', colors.core);
    galaxy.style.setProperty('--glow', colors.glow);
    galaxy.style.setProperty('--delay', `${delay}s`);
    galaxy.style.animationDuration = `${duration}s`;
    
    layerElements['cosmic-layer-4'].appendChild(galaxy);
    
    // Add spiral arms
    const arm = document.createElement('div');
    arm.className = 'galaxy-arm';
    arm.style.setProperty('--arm-color', colors.arm);
    galaxy.appendChild(arm);
    
    // Add varying rotation to arms
    arm.style.transform = `rotate(${Math.random() * 360}deg)`;
  }
  
  // Generate enhanced planets with rings for some
  const planetCount = 4;
  const planetPositions = [
    { x: 10, y: 50, orbitX: [-5, 15], orbitY: [45, 55] },
    { x: 85, y: 25, orbitX: [80, 90], orbitY: [20, 30] },
    { x: 30, y: 80, orbitX: [25, 35], orbitY: [75, 85] },
    { x: 70, y: 60, orbitX: [65, 75], orbitY: [55, 65] }
  ];
  
  // Planet styles
  const planetStyles = [
    {
      gradient: 'radial-gradient(circle at 30% 30%, #4b6cb7, #182848)',
      glow: 'rgba(75, 108, 183, 0.5)',
      surface: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\' viewBox=\'0 0 100 100\'%3E%3Cg fill-opacity=\'0.2\'%3E%3Ccircle fill=\'%23FFFFFF\' cx=\'50\' cy=\'50\' r=\'50\'/%3E%3C/g%3E%3C/svg%3E")',
      hasRing: false
    },
    {
      gradient: 'radial-gradient(circle at 30% 30%, #ff9966, #ff5e62)',
      glow: 'rgba(255, 94, 98, 0.5)',
      surface: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\' viewBox=\'0 0 100 100\'%3E%3Cg fill-opacity=\'0.2\'%3E%3Ccircle fill=\'%23FFFFFF\' cx=\'50\' cy=\'50\' r=\'50\'/%3E%3C/g%3E%3C/svg%3E")',
      hasRing: false
    },
    {
      gradient: 'radial-gradient(circle at 30% 30%, #3a7bd5, #00d2ff)',
      glow: 'rgba(58, 123, 213, 0.5)',
      surface: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\' viewBox=\'0 0 100 100\'%3E%3Cg fill-opacity=\'0.2\'%3E%3Ccircle fill=\'%23FFFFFF\' cx=\'50\' cy=\'50\' r=\'50\'/%3E%3C/g%3E%3C/svg%3E")',
      hasRing: true,
      ringColor: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%)',
      ringGlow: 'rgba(58, 123, 213, 0.3)'
    },
    {
      gradient: 'radial-gradient(circle at 30% 30%, #ffa17f, #9832c4)',
      glow: 'rgba(152, 50, 196, 0.5)',
      surface: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\' viewBox=\'0 0 100 100\'%3E%3Cg fill-opacity=\'0.2\'%3E%3Ccircle fill=\'%23FFFFFF\' cx=\'50\' cy=\'50\' r=\'50\'/%3E%3C/g%3E%3C/svg%3E")',
      hasRing: true,
      ringColor: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,161,127,0.3) 50%, rgba(255,255,255,0) 100%)',
      ringGlow: 'rgba(152, 50, 196, 0.3)'
    }
  ];
  
  for (let i = 0; i < planetCount; i++) {
    const planet = document.createElement('div');
    planet.className = 'planet';
    
    // Use predefined positions and orbit paths
    const size = 20 + Math.random() * 35;
    const posX = planetPositions[i].x;
    const posY = planetPositions[i].y;
    const orbitTime = 40 + Math.random() * 30;
    const delay = Math.random() * 10;
    
    // Define orbit path
    const orbitXFrom = planetPositions[i].orbitX[0];
    const orbitXTo = planetPositions[i].orbitX[1];
    const orbitYFrom = planetPositions[i].orbitY[0];
    const orbitYTo = planetPositions[i].orbitY[1];
    
    const style = planetStyles[i % planetStyles.length];
    
    // Apply styles
    planet.style.setProperty('--size', `${size}px`);
    planet.style.left = `${posX}%`;
    planet.style.top = `${posY}%`;
    planet.style.setProperty('--gradient', style.gradient);
    planet.style.setProperty('--glow', style.glow);
    planet.style.setProperty('--surface-texture', style.surface);
    planet.style.setProperty('--orbit-time', `${orbitTime}s`);
    planet.style.setProperty('--delay', `${delay}s`);
    planet.style.setProperty('--orbit-x-from', `${orbitXFrom - posX}%`);
    planet.style.setProperty('--orbit-x-to', `${orbitXTo - posX}%`);
    planet.style.setProperty('--orbit-y-from', `${orbitYFrom - posY}%`);
    planet.style.setProperty('--orbit-y-to', `${orbitYTo - posY}%`);
    
    layerElements['cosmic-layer-3'].appendChild(planet);
    
    // Add rings to some planets
    if (style.hasRing) {
      const ring = document.createElement('div');
      ring.className = 'planet-ring';
      ring.style.setProperty('--ring-color', style.ringColor);
      ring.style.setProperty('--ring-glow', style.ringGlow);
      planet.appendChild(ring);
    }
  }
  
  // Add shooting stars on a timer
  const createShootingStar = () => {
    const shooter = document.createElement('div');
    shooter.className = 'shooting-star';
    
    // Random angle for direction
    const angle = -45 + (Math.random() * 30);
    
    // Calculate start and end points based on angle
    const startX = -100;
    const startY = Math.random() * window.innerHeight;
    
    // Calculate end position based on angle
    const distance = window.innerWidth + 200;
    const radians = angle * (Math.PI / 180);
    const endX = startX + (distance * Math.cos(radians));
    const endY = startY + (distance * Math.sin(radians));
    
    // Duration and delay
    const duration = 1 + Math.random() * 2;
    
    // Apply styles
    shooter.style.setProperty('--angle', `${angle}deg`);
    shooter.style.setProperty('--start-x', `${startX}px`);
    shooter.style.setProperty('--start-y', `${startY}px`);
    shooter.style.setProperty('--end-x', `${endX}px`);
    shooter.style.setProperty('--end-y', `${endY}px`);
    shooter.style.setProperty('--duration', `${duration}s`);
    
    // Create star head and tail
    const head = document.createElement('div');
    head.className = 'shooting-star-head';
    shooter.appendChild(head);
    
    const tail = document.createElement('div');
    tail.className = 'shooting-star-tail';
    shooter.appendChild(tail);
    
    cosmicBg.appendChild(shooter);
    
    // Remove shooter after animation completes
    setTimeout(() => {
      if (shooter && shooter.parentNode) {
        shooter.parentNode.removeChild(shooter);
      }
    }, duration * 1000 + 100);
  };
  
  // Create shooting stars randomly
  setInterval(() => {
    if (Math.random() > 0.7) { // 30% chance per interval
      createShootingStar();
    }
  }, 3000);
  
  // Initial shooting stars
  for (let i = 0; i < 3; i++) {
    setTimeout(() => {
      createShootingStar();
    }, i * 1500);
  }
  
  // Add occasional comets
  const createComet = () => {
    const comet = document.createElement('div');
    comet.className = 'comet';
    
    // Random angle for direction
    const angle = -20 + (Math.random() * 40);
    
    // Starting position
    const startY = Math.random() * window.innerHeight;
    const endY = startY + (Math.random() * 200 - 100);
    
    // Duration and delay
    const travelTime = 10 + Math.random() * 10;
    
    // Apply styles
    comet.style.setProperty('--angle', `${angle}deg`);
    comet.style.setProperty('--start-y', `${startY}px`);
    comet.style.setProperty('--end-y', `${endY}px`);
    comet.style.setProperty('--travel-time', `${travelTime}s`);
    comet.style.setProperty('--delay', '0s');
    
    // Create comet head and tail
    const head = document.createElement('div');
    head.className = 'comet-head';
    comet.appendChild(head);
    
    const tail = document.createElement('div');
    tail.className = 'comet-tail';
    comet.appendChild(tail);
    
    layerElements['cosmic-layer-2'].appendChild(comet);
    
    // Remove comet after animation completes
    setTimeout(() => {
      if (comet && comet.parentNode) {
        comet.parentNode.removeChild(comet);
      }
    }, travelTime * 1000 + 100);
  };
  
  // Create comets rarely
  setInterval(() => {
    if (Math.random() > 0.85) { // 15% chance
      createComet();
    }
  }, 15000);
  
  // Add initial comet
  setTimeout(createComet, 5000);
  
  // Enhanced parallax effect with depth layers
  document.addEventListener('mousemove', (e) => {
    const moveX = (e.clientX / window.innerWidth) * 20 - 10;
    const moveY = (e.clientY / window.innerHeight) * 20 - 10;
    
    // Apply different parallax strength to each layer
    layerElements['cosmic-layer-1'].style.transform = `translate(${moveX * 0.01}px, ${moveY * 0.01}px)`;
    layerElements['cosmic-layer-2'].style.transform = `translate(${moveX * 0.02}px, ${moveY * 0.02}px)`;
    layerElements['cosmic-layer-3'].style.transform = `translate(${moveX * 0.04}px, ${moveY * 0.04}px)`;
    layerElements['cosmic-layer-4'].style.transform = `translate(${moveX * 0.08}px, ${moveY * 0.08}px)`;
  });
  
  // Handle window resize to reposition elements
  window.addEventListener('resize', () => {
    if (window.resizeTimeout) {
      clearTimeout(window.resizeTimeout);
    }
    window.resizeTimeout = setTimeout(() => {
      createCosmicBackground();
    }, 250);
  });
}

// Call this function to initialize the cosmic background
document.addEventListener('DOMContentLoaded', () => {
  createCosmicBackground();
}); 