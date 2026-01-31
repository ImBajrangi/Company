import '../../styles/index.scss';
import '../../styles/pages/index.scss';
import InfiniteGrid from '../components/infinite-grid';

export default class Index {
  constructor() {
    window.addEventListener('resize', this.resize.bind(this));
    this.resize();

    this.sources = [
<<<<<<< HEAD
      {src: 'https://i.postimg.cc/NjGqdx4D/31.avif', caption: '30 knots <br>12 x 16 inch C type hand print <br>Edition of 1 Plus an additional artist Proof <br>2021'},
      {src: 'https://i.postimg.cc/PJHFPtVy/32.avif', caption: 'Sad Mis-Step <br>12 x 16 inch C type hand print <br>Edition of 1 Plus an additional artist Proof <br>2024'},
      {src: 'https://i.postimg.cc/W1x8dNhZ/46.avif', caption: 'Mini Orange <br>12 x 16 inch C type hand print <br>Edition of 1 Plus an additional artist Proof <br>2014'},
      {src: 'https://i.postimg.cc/yx32SQ76/62.avif', caption: 'After Storm <br>12 x 16 inch C type hand print <br>Edition of 1 Plus an additional artist Proof <br>2022'},
      {src: 'https://i.postimg.cc/0QwLzXkk/80.avif', caption: 'Untitled <br>12 x 16 inch C type hand print <br>Edition of 1 Plus an additional artist Proof <br>2016'},
      {src: 'https://i.postimg.cc/c18s3T98/64.avif', caption: 'Toilet Paper <br>12 x 16 inch C type hand print <br>Edition of 1 Plus an additional artist Proof <br>2022'},
      {src: 'https://i.postimg.cc/vBBJG8jV/49.avif', caption: 'Cocoa Eggplant Tomato <br>12 x 16 inch C type hand print <br>Edition of 1 Plus an additional artist Proof <br>2026'},
      {src: 'https://i.postimg.cc/m2wK1HsH/48.avif', caption: 'Toilet Paper <br>12 x 16 inch C type hand print <br>Edition of 1 Plus an additional artist Proof <br>2022'},
      {src: 'https://i.postimg.cc/zXs8phQP/24.avif', caption: 'Production Fun Fact (Eggs) <br>12 x 16 inch C type hand print <br>Edition of 1 Plus an additional artist Proof <br>2024'},
=======
      { src: 'https://i.postimg.cc/NjGqdx4D/31.avif', caption: '30 knots <br>12 x 16 inch C type hand print <br>Edition of 1 Plus an additional artist Proof <br>2021' },
      { src: 'https://i.postimg.cc/PJHFPtVy/32.avif', caption: 'Sad Mis-Step <br>12 x 16 inch C type hand print <br>Edition of 1 Plus an additional artist Proof <br>2026' },
      { src: 'https://i.postimg.cc/W1x8dNhZ/46.avif', caption: 'Mini Orange <br>12 x 16 inch C type hand print <br>Edition of 1 Plus an additional artist Proof <br>2014' },
      { src: 'https://i.postimg.cc/yx32SQ76/62.avif', caption: 'After Storm <br>12 x 16 inch C type hand print <br>Edition of 1 Plus an additional artist Proof <br>2022' },
      { src: 'https://i.postimg.cc/0QwLzXkk/80.avif', caption: 'Untitled <br>12 x 16 inch C type hand print <br>Edition of 1 Plus an additional artist Proof <br>2016' },
      { src: 'https://i.postimg.cc/c18s3T98/64.avif', caption: 'Toilet Paper <br>12 x 16 inch C type hand print <br>Edition of 1 Plus an additional artist Proof <br>2022' },
      { src: 'https://i.postimg.cc/vBBJG8jV/49.avif', caption: 'Cocoa Eggplant Tomato <br>12 x 16 inch C type hand print <br>Edition of 1 Plus an additional artist Proof <br>2026' },
      { src: 'https://i.postimg.cc/m2wK1HsH/48.avif', caption: 'Toilet Paper <br>12 x 16 inch C type hand print <br>Edition of 1 Plus an additional artist Proof <br>2022' },
      { src: 'https://i.postimg.cc/zXs8phQP/24.avif', caption: 'Production Fun Fact (Eggs) <br>12 x 16 inch C type hand print <br>Edition of 1 Plus an additional artist Proof <br>2026' },
>>>>>>> main
    ];

    // Load all images first to get their natural dimensions
    Promise.all(this.sources.map(source => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          source.naturalWidth = img.naturalWidth;
          source.naturalHeight = img.naturalHeight;
          resolve();
        };
        img.src = source.src;
      });
    })).then(() => {
      // Calculate positions and sizes based on natural dimensions
      const baseWidth = 400; // Base width for scaling
      const minSpacing = 100; // Minimum space between images
      const maxSpacing = 500; // Maximum space between images
      let currentX = 71;
      let currentY = 58;
      let rowHeight = 0;

      // Function to get random spacing
      const getRandomSpacing = () => minSpacing + Math.random() * (maxSpacing - minSpacing);

      // Function to add some chaos to position
      const addChaos = (value, range) => {
        return value + (Math.random() - 0.5) * range;
      };

      this.data = this.sources.map((source, i) => {
        // Calculate dimensions while maintaining aspect ratio
        const aspectRatio = source.naturalWidth / source.naturalHeight;
        const width = baseWidth * (0.8 + Math.random() * 0.4); // Random size variation
        const height = width / aspectRatio;

        // Add some randomness to vertical position
        const chaosY = addChaos(currentY, 200); // 200px random vertical shift

        // Create new position data with chaos
        const data = {
          x: currentX,
          y: chaosY,
          w: width,
          h: height
        };

        // Update position for next image with random spacing
        currentX += width + getRandomSpacing();
        rowHeight = Math.max(rowHeight, height);

        // Move to next row if we're running out of space
        if (currentX > 1000) {
          currentX = 51 + Math.random() * 100; // Random start position for each row
          currentY += rowHeight + getRandomSpacing();
          rowHeight = 0;
        }

        return data;
      });

      // Initialize the grid
      this.initGrid();
    });
  }

  initGrid() {
    new InfiniteGrid({
      el: document.querySelector('#images'),
      sources: this.sources,
      data: this.data,
      originalSize: {
        w: Math.max(...this.data.map(d => d.x + d.w)) * 1.2, // Add 20% more space
        h: Math.max(...this.data.map(d => d.y + d.h)) * 1.2  // Add 20% more space
      },
    })
  }
  resize() {
    document.documentElement.style.setProperty('--rvw', `${document.documentElement.clientWidth / 100}px`);
  }
}
window.addEventListener('load', () => {
  new Index();
});