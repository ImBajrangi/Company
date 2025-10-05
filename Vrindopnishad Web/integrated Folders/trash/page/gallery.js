document.addEventListener('DOMContentLoaded', function() {
  // Initialize the gallery view
  initGallery();
  initThemeToggle();
  setupLightbox();
  setupNavigation();
  setupMusicPlayer();
});

// Gallery content data - maps to the sections in book.html
const galleryContentData = {
  "vertical-section-0": {
    title: "Wildlife in Action",
    description: "Witness the fascinating lives of animals in their natural habitats, from playful cubs to stealthy predators. This immersive gallery showcases the dynamic and often surprising behaviors of wildlife across different ecosystems.",
    videoUrl: "https://videos.pexels.com/video-files/4763824/4763824-uhd_2560_1440_24fps.mp4",
    imageUrl: "https://images.pexels.com/photos/2361/nature-animal-wolf-wilderness.jpg",
    audioUrl: "https://cdn.pixabay.com/download/audio/2023/05/18/audio_eb24c03b07.mp3?filename=cinematic-wildlife-11122.mp3",
    additionalImages: [
      "https://images.pexels.com/photos/41315/africa-african-animal-cat-41315.jpeg",
      "https://images.pexels.com/photos/145939/pexels-photo-145939.jpeg",
      "https://images.pexels.com/photos/247431/pexels-photo-247431.jpeg"
    ]
  },
  "vertical-section-1": {
    title: "The Changing Seasons",
    description: "Experience the beauty of nature's transitions, from blooming spring flowers to snowy winter landscapes. This collection highlights how landscapes transform throughout the year, showcasing the stunning color palettes unique to each season.",
    videoUrl: "https://videos.pexels.com/video-files/3214448/3214448-uhd_2560_1440_25fps.mp4",
    imageUrl: "https://images.pexels.com/photos/36478/amazing-beautiful-beauty-blue.jpg",
    audioUrl: "https://cdn.pixabay.com/download/audio/2023/05/23/audio_8f9242dfd7.mp3?filename=natural-atmosphere-11227.mp3",
    additionalImages: [
      "https://images.pexels.com/photos/1366909/pexels-photo-1366909.jpeg",
      "https://images.pexels.com/photos/355321/pexels-photo-355321.jpeg",
      "https://images.pexels.com/photos/1165991/pexels-photo-1165991.jpeg"
    ]
  },
  "vertical-section-2": {
    title: "Guardians of Nature",
    description: "Learn about the importance of conservation and how we can work together to preserve the beauty of nature for generations to come. This gallery honors the people and initiatives dedicated to protecting our planet's precious ecosystems.",
    videoUrl: "https://videos.pexels.com/video-files/4328514/4328514-uhd_2560_1440_30fps.mp4",
    imageUrl: "https://images.pexels.com/photos/2146109/pexels-photo-2146109.jpeg",
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_bbf1f8c58d.mp3?filename=birds-in-spring-6897.mp3",
    additionalImages: [
      "https://images.pexels.com/photos/691637/pexels-photo-691637.jpeg",
      "https://images.pexels.com/photos/904807/pexels-photo-904807.jpeg",
      "https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg"
    ]
  },
  "vertical-section-3": {
    title: "Astral Aesthetics",
    description: "Experience the boundless beauty of the cosmos through striking images that capture its infinite aesthetic appeal. This celestial gallery showcases the wonders of our universe, from swirling galaxies to perfect planetary alignments.",
    videoUrl: "https://videos.pexels.com/video-files/2871916/2871916-hd_1920_1080_30fps.mp4",
    imageUrl: "https://images.pexels.com/photos/1169754/pexels-photo-1169754.jpeg",
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/08/23/audio_c83e6cc303.mp3?filename=space-atmospheric-background-124841.mp3",
    additionalImages: [
      "https://images.pexels.com/photos/1146134/pexels-photo-1146134.jpeg",
      "https://images.pexels.com/photos/956981/milky-way-starry-sky-night-sky-star-956981.jpeg",
      "https://images.pexels.com/photos/1252890/pexels-photo-1252890.jpeg"
    ]
  },
  "horizontal-section-0": {
    title: "Wildlife Landscapes",
    description: "Explore the untouched beauty of forests, mountains, and rivers as we uncover the hidden secrets of nature's most breathtaking landscapes. This collection presents pristine environments where wildlife thrives in harmony with their surroundings.",
    videoUrl: "https://videos.pexels.com/video-files/10178127/10178127-uhd_2560_1440_30fps.mp4",
    imageUrl: "https://images.pexels.com/photos/158063/bellingrath-gardens-alabama-landscape-scenic-158063.jpeg",
    additionalImages: [
      "https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg",
      "https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg",
      "https://images.pexels.com/photos/235621/pexels-photo-235621.jpeg"
    ]
  },
  "horizontal-section-1": {
    title: "Nature's Symphony",
    description: "Immerse yourself in the soothing sounds of chirping birds, rustling leaves, and flowing streams – nature's music for peace and tranquility. This visual symphony captures the scenes behind nature's most calming and harmonious sounds.",
    videoUrl: "https://videos.pexels.com/video-files/15708463/15708463-uhd_2560_1440_24fps.mp4",
    imageUrl: "https://images.pexels.com/photos/572780/pexels-photo-572780.jpeg",
    additionalImages: [
      "https://images.pexels.com/photos/158651/news-lake-constance-sheep-blue-158651.jpeg",
      "https://images.pexels.com/photos/814499/pexels-photo-814499.jpeg",
      "https://images.pexels.com/photos/1671325/pexels-photo-1671325.jpeg"
    ]
  },
  "horizontal-section-2": {
    title: "Nature's Masterpieces",
    description: "Discover stunning views of majestic mountains, endless oceans, and golden sunsets that remind us of nature's artistic brilliance. This gallery showcases Mother Nature's most magnificent creations, each a masterpiece in its own right.",
    videoUrl: "https://videos.pexels.com/video-files/15708462/15708462-uhd_2560_1440_24fps.mp4",
    imageUrl: "https://images.pexels.com/photos/1619317/pexels-photo-1619317.jpeg",
    additionalImages: [
      "https://images.pexels.com/photos/1671324/pexels-photo-1671324.jpeg",
      "https://images.pexels.com/photos/2365457/pexels-photo-2365457.jpeg",
      "https://images.pexels.com/photos/1486974/pexels-photo-1486974.jpeg"
    ]
  },
  "horizontal-section-3": {
    title: "The Power of Nature",
    description: "Dive into the incredible forces of nature – from roaring waterfalls to mighty hurricanes – and see how they sculpt the earth we live on. This powerful collection demonstrates nature's awesome strength and its ability to shape our world.",
    videoUrl: "https://videos.pexels.com/video-files/5788966/5788966-hd_1920_1080_25fps.mp4",
    imageUrl: "https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg",
    additionalImages: [
      "https://images.pexels.com/photos/1784578/pexels-photo-1784578.jpeg",
      "https://images.pexels.com/photos/247478/pexels-photo-247478.jpeg",
      "https://images.pexels.com/photos/1292115/pexels-photo-1292115.jpeg"
    ]
  }
};

// Music track data for the player
const musicTracks = [
  {
    title: "Ambient Piano & Strings",
    artist: "AmbientWorks",
    url: "https://cdn.pixabay.com/download/audio/2023/04/05/audio_68d90fcd9d.mp3?filename=ambient-piano-amp-strings-10711.mp3"
  },
  {
    title: "Forest Ambience",
    artist: "NatureRecords",
    url: "https://cdn.pixabay.com/download/audio/2021/04/07/audio_c8c8a73467.mp3?filename=forest-with-small-river-birds-and-nature-field-recording-6735.mp3"
  },
  {
    title: "Meditation Bells",
    artist: "MeditationSounds",
    url: "https://cdn.pixabay.com/download/audio/2022/03/10/audio_2deaf6fc7c.mp3?filename=tibetan-bells-meditation-music-8487.mp3"
  },
  {
    title: "Ocean Waves",
    artist: "OceanSounds",
    url: "https://cdn.pixabay.com/download/audio/2021/09/06/audio_7b11420d22.mp3?filename=ocean-waves-112762.mp3"
  }
];

// Current state of music player
let playerState = {
  currentTrack: 0,
  isPlaying: false,
  audio: null,
  updateInterval: null
};

/**
 * Initialize the gallery view
 */
function initGallery() {
  // Set up back to book link
  const backBtn = document.getElementById('back-to-book');
  if (backBtn) {
    backBtn.addEventListener('click', function() {
      window.location.href = 'book.html';
    });
  }
  
  // Set up share button
  const shareBtn = document.getElementById('share-gallery');
  if (shareBtn) {
    shareBtn.addEventListener('click', function() {
      shareGallery();
    });
  }
  
  // Load initial section if specified in URL, otherwise load first item
  const urlParams = new URLSearchParams(window.location.search);
  const section = urlParams.get('section');
  const index = urlParams.get('index');
  
  if (section && index) {
    loadContent(section, index);
    
    // Highlight the corresponding navigation item
    const navItem = document.querySelector(`.gallery-nav-item[data-section="${section}"][data-index="${index}"]`);
    if (navItem) {
      document.querySelectorAll('.gallery-nav-item').forEach(item => {
        item.classList.remove('active');
      });
      navItem.classList.add('active');
    }
  } else {
    // Load first item by default
    const firstItem = document.querySelector('.gallery-nav-item');
    if (firstItem) {
      const defaultSection = firstItem.getAttribute('data-section');
      const defaultIndex = firstItem.getAttribute('data-index');
      loadContent(defaultSection, defaultIndex);
      firstItem.classList.add('active');
    }
  }

  // Set up viewing progress
  setupViewingProgress();
}

/**
 * Set up the navigation
 */
function setupNavigation() {
  const navItems = document.querySelectorAll('.gallery-nav-item');
  
  navItems.forEach(item => {
    item.addEventListener('click', function() {
      const section = this.getAttribute('data-section');
      const index = this.getAttribute('data-index');
      
      // Update active state
      navItems.forEach(item => item.classList.remove('active'));
      this.classList.add('active');
      
      // Load content
      loadContent(section, index);
      
      // Update URL
      updateURL(section, index);
    });
  });
}

/**
 * Set up viewing progress indicator
 */
function setupViewingProgress() {
  const progressBar = document.getElementById('viewing-progress');
  if (!progressBar) return;

  // Calculate progress based on scrolling
  const updateProgress = () => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const scrollPosition = window.scrollY;
    
    const progress = (scrollPosition / documentHeight) * 100;
    progressBar.style.width = `${Math.min(progress, 100)}%`;
  };

  // Update progress on scroll
  window.addEventListener('scroll', updateProgress);
  
  // Initial update
  updateProgress();
}

/**
 * Load content based on section and index
 */
function loadContent(section, index) {
  const contentKey = `${section}-${index}`;
  const contentData = galleryContentData[contentKey];
  
  if (!contentData) {
    showNotification('Content not found!', 'error');
    return;
  }
  
  const galleryContainer = document.querySelector('.gallery-container');
  if (!galleryContainer) return;
  
  let html = '';
  
  // Main content
  html += `
    <div class="gallery-item">
      <div class="gallery-image-container" data-url="${contentData.imageUrl || contentData.videoUrl}">
        ${contentData.videoUrl ? 
          `<video autoplay loop muted playsinline>
            <source src="${contentData.videoUrl}" type="video/mp4">
          </video>` : 
          `<img src="${contentData.imageUrl}" alt="${contentData.title}">`
        }
        <button class="gallery-expand-btn" data-url="${contentData.imageUrl || contentData.videoUrl.replace('.mp4', '.jpg')}">
          <i class="fas fa-expand"></i>
        </button>
      </div>
      <div class="gallery-content-container">
        <h2>${contentData.title}</h2>
        <p>${contentData.description}</p>
        <div class="gallery-actions">
          <button class="gallery-action-btn" id="view-in-book" data-section="${section}" data-index="${index}">
            <i class="fas fa-book"></i> View in Book
          </button>
          <button class="gallery-action-btn" id="share-item" data-section="${section}" data-index="${index}">
            <i class="fas fa-share-alt"></i> Share
          </button>
          ${contentData.audioUrl ? `
          <button class="gallery-action-btn" id="play-audio" data-audio="${contentData.audioUrl}">
            <i class="fas fa-music"></i> Play Theme
          </button>` : ''}
        </div>
      </div>
    </div>
  `;
  
  // Additional images if available
  if (contentData.additionalImages && contentData.additionalImages.length) {
    html += '<div class="gallery-additional-images">';
    contentData.additionalImages.forEach((imgUrl, idx) => {
      html += `
        <div class="gallery-item">
          <div class="gallery-image-container" data-url="${imgUrl}">
            <img src="${imgUrl}" alt="${contentData.title} - Additional Image ${idx + 1}">
            <button class="gallery-expand-btn" data-url="${imgUrl}">
              <i class="fas fa-expand"></i>
            </button>
          </div>
        </div>
      `;
    });
    html += '</div>';
  }
  
  galleryContainer.innerHTML = html;
  
  // Add event listeners to newly created elements
  setupExpandButtons();
  setupActionButtons(section, index);
}

/**
 * Set up expand buttons for lightbox view
 */
function setupExpandButtons() {
  const expandButtons = document.querySelectorAll('.gallery-expand-btn');
  const imageContainers = document.querySelectorAll('.gallery-image-container');
  
  expandButtons.forEach(button => {
    button.addEventListener('click', function() {
      const imageUrl = this.getAttribute('data-url');
      openLightbox(imageUrl);
    });
  });
  
  imageContainers.forEach(container => {
    container.addEventListener('click', function(e) {
      // Only expand if the click was on the image, not on buttons
      if (e.target.tagName === 'IMG' || e.target.tagName === 'VIDEO') {
        const imageUrl = this.getAttribute('data-url');
        openLightbox(imageUrl);
      }
    });
  });
}

/**
 * Set up action buttons
 */
function setupActionButtons(section, index) {
  // View in book button
  const viewInBookBtn = document.getElementById('view-in-book');
  if (viewInBookBtn) {
    viewInBookBtn.addEventListener('click', function() {
      const section = this.getAttribute('data-section');
      const index = this.getAttribute('data-index');
      window.location.href = `book.html#${section}-${index}`;
    });
  }
  
  // Share button
  const shareItemBtn = document.getElementById('share-item');
  if (shareItemBtn) {
    shareItemBtn.addEventListener('click', function() {
      const section = this.getAttribute('data-section');
      const index = this.getAttribute('data-index');
      const title = galleryContentData[`${section}-${index}`].title;
      shareItem(title, section, index);
    });
  }

  // Play audio button
  const playAudioBtn = document.getElementById('play-audio');
  if (playAudioBtn) {
    playAudioBtn.addEventListener('click', function() {
      const audioUrl = this.getAttribute('data-audio');
      if (audioUrl) {
        playContentAudio(audioUrl);
      }
    });
  }
}

/**
 * Play content audio in the music player
 */
function playContentAudio(audioUrl) {
  // Stop any playing music
  stopMusic();
  
  // Set the music player to display the current track
  const musicPlayer = document.getElementById('music-player');
  const trackTitle = document.querySelector('.track-title');
  const trackArtist = document.querySelector('.track-artist');
  const playerToggle = document.getElementById('player-toggle');
  
  if (musicPlayer && trackTitle && trackArtist && playerToggle) {
    // Expand the player
    musicPlayer.classList.add('expanded');
    
    // Update track info
    trackTitle.textContent = 'Content Theme Music';
    trackArtist.textContent = 'Playing from content';
    
    // Update toggle button
    playerToggle.innerHTML = '<i class="fas fa-pause"></i>';
    
    // Play the audio
    if (!playerState.audio) {
      playerState.audio = new Audio();
    }
    
    playerState.audio.src = audioUrl;
    playerState.audio.volume = 0.5;
    playerState.isPlaying = true;
    
    // Play audio with promise handling for browser policies
    const playPromise = playerState.audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        // Auto-play was prevented by browser
        showNotification('Click play again. Browser requires user interaction to play audio.', 'info');
        playerToggle.innerHTML = '<i class="fas fa-play"></i>';
        playerState.isPlaying = false;
      });
    }
    
    // Update progress display
    setupProgressUpdates();
    
    // Show notification
    showNotification('Now playing content theme music', 'success');
  }
}

/**
 * Update URL with section and index
 */
function updateURL(section, index) {
  const url = new URL(window.location.href);
  url.searchParams.set('section', section);
  url.searchParams.set('index', index);
  window.history.replaceState({}, '', url);
}

/**
 * Set up lightbox
 */
function setupLightbox() {
  const lightbox = document.getElementById('gallery-lightbox');
  const closeLightbox = document.getElementById('close-lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const downloadBtn = document.getElementById('download-image');
  const shareBtn = document.getElementById('share-image');
  const toggleProtectBtn = document.getElementById('toggle-protect');
  
  if (closeLightbox) {
    closeLightbox.addEventListener('click', function() {
      lightbox.classList.remove('active');
    });
  }
  
  if (lightbox) {
    lightbox.addEventListener('click', function(e) {
      // Close if the click is directly on the lightbox background, not on its children
      if (e.target === lightbox) {
        lightbox.classList.remove('active');
      }
    });
  }
  
  // Disable download button as part of protection
  if (downloadBtn) {
    downloadBtn.classList.add('disabled');
    downloadBtn.addEventListener('click', function(e) {
      e.preventDefault();
      showNotification('Download is disabled for content protection', 'info');
    });
  }
  
  // Share image button
  if (shareBtn) {
    shareBtn.addEventListener('click', function() {
      const imageUrl = lightboxImage.src;
      if (imageUrl) {
        shareMedia('Check out this amazing image from Vrindopnishad Gallery', imageUrl);
      }
    });
  }
  
  // Toggle protection button
  if (toggleProtectBtn) {
    toggleProtectBtn.addEventListener('click', function() {
      const securityModal = document.getElementById('security-modal');
      if (securityModal) {
        securityModal.classList.add('active');
      }
    });
  }
}

/**
 * Open lightbox with image
 */
function openLightbox(imageUrl) {
  const lightbox = document.getElementById('gallery-lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  
  if (lightbox && lightboxImage) {
    lightboxImage.src = imageUrl;
    lightbox.classList.add('active');
  }
}

/**
 * Share gallery
 */
function shareGallery() {
  const url = window.location.href;
  const title = 'Vrindopnishad Gallery';
  const text = 'Check out this beautiful nature gallery from Vrindopnishad!';
  
  shareMedia(text, url, title);
}

/**
 * Share media (generic function)
 */
function shareMedia(text, url, title = 'Vrindopnishad Gallery') {
  // Use Web Share API if available
  if (navigator.share) {
    navigator.share({
      title: title,
      text: text,
      url: url
    }).catch(err => {
      console.error('Share failed:', err);
      copyLinkToClipboard(url, title);
    });
  } else {
    // Fallback to clipboard
    copyLinkToClipboard(url, title);
  }
}

/**
 * Share specific item
 */
function shareItem(title, section, index) {
  const baseUrl = window.location.href.split('?')[0];
  const shareUrl = `${baseUrl}?section=${section}&index=${index}`;
  const shareText = `Check out "${title}" in the Vrindopnishad Gallery`;
  
  shareMedia(shareText, shareUrl, title);
}

/**
 * Copy link to clipboard with notification
 */
function copyLinkToClipboard(url, title) {
  // Create a temporary input element
  const input = document.createElement('input');
  input.value = url;
  document.body.appendChild(input);
  input.select();
  
  try {
    // Execute copy command
    document.execCommand('copy');
    showNotification('Link copied to clipboard!', 'success');
  } catch (err) {
    console.error('Could not copy link:', err);
    prompt('Copy this link to share:', url);
  }
  
  // Clean up
  document.body.removeChild(input);
}

/**
 * Initialize theme toggle
 */
function initThemeToggle() {
  const toggleBtn = document.getElementById('toggle-theme');
  
  // Check for saved theme preference
  const darkMode = localStorage.getItem('theme') === 'dark';
  
  // Apply theme
  if (darkMode) {
    document.body.classList.add('dark-mode');
    if (toggleBtn) {
      toggleBtn.innerHTML = '<i class="fas fa-sun"></i> Light';
    }
  }
  
  // Add toggle event listener
  if (toggleBtn) {
    toggleBtn.addEventListener('click', function() {
      document.body.classList.toggle('dark-mode');
      
      // Save preference
      if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
        toggleBtn.innerHTML = '<i class="fas fa-sun"></i> Light';
      } else {
        localStorage.setItem('theme', 'light');
        toggleBtn.innerHTML = '<i class="fas fa-moon"></i> Dark';
      }
    });
  }
}

/**
 * Set up music player functionality
 */
function setupMusicPlayer() {
  const musicPlayer = document.getElementById('music-player');
  const playerToggle = document.getElementById('toggle-player');
  const playButton = document.getElementById('player-toggle');
  const nextButton = document.getElementById('player-next');
  const prevButton = document.getElementById('player-previous');
  const trackTitle = document.querySelector('.track-title');
  const trackArtist = document.querySelector('.track-artist');
  const progressFilled = document.querySelector('.progress-filled');
  const currentTime = document.querySelector('.current-time');
  const duration = document.querySelector('.duration');
  const progressBar = document.querySelector('.player-progress .progress-bar');
  
  // Toggle player expansion
  if (playerToggle) {
    playerToggle.addEventListener('click', function() {
      musicPlayer.classList.toggle('expanded');
    });
  }
  
  // Play/Pause
  if (playButton) {
    playButton.addEventListener('click', function() {
      if (playerState.isPlaying) {
        pauseMusic();
      } else {
        playMusic();
      }
    });
  }
  
  // Next track
  if (nextButton) {
    nextButton.addEventListener('click', function() {
      playerState.currentTrack = (playerState.currentTrack + 1) % musicTracks.length;
      playTrack(playerState.currentTrack);
    });
  }
  
  // Previous track
  if (prevButton) {
    prevButton.addEventListener('click', function() {
      playerState.currentTrack = (playerState.currentTrack - 1 + musicTracks.length) % musicTracks.length;
      playTrack(playerState.currentTrack);
    });
  }
  
  // Click on progress bar to seek
  if (progressBar) {
    progressBar.addEventListener('click', function(e) {
      if (!playerState.audio) return;
      
      const percent = e.offsetX / this.offsetWidth;
      playerState.audio.currentTime = percent * playerState.audio.duration;
      progressFilled.style.width = `${percent * 100}%`;
    });
  }
  
  // Initialize first track info
  if (trackTitle && trackArtist) {
    trackTitle.textContent = musicTracks[0].title;
    trackArtist.textContent = musicTracks[0].artist;
  }
  
  // Load the first track
  playerState.audio = new Audio(musicTracks[0].url);
  playerState.audio.volume = 0.5;
  
  // Background music button
  const toggleMusicBtn = document.getElementById('toggle-music');
  if (toggleMusicBtn) {
    toggleMusicBtn.addEventListener('click', function() {
      const backgroundAudio = document.getElementById('gallery-background-music');
      
      if (backgroundAudio) {
        if (backgroundAudio.paused) {
          // Stop player music if playing
          stopMusic();
          
          // Play background music
          const playPromise = backgroundAudio.play();
          if (playPromise !== undefined) {
            playPromise.then(() => {
              toggleMusicBtn.innerHTML = '<i class="fas fa-volume-up"></i><span>Mute</span>';
              toggleMusicBtn.classList.add('active');
              showNotification('Background music playing', 'success');
            }).catch(error => {
              showNotification('Click again to play music', 'info');
            });
          }
        } else {
          // Pause background music
          backgroundAudio.pause();
          toggleMusicBtn.innerHTML = '<i class="fas fa-music"></i><span>Music</span>';
          toggleMusicBtn.classList.remove('active');
          showNotification('Background music paused', 'info');
        }
      }
    });
  }
}

/**
 * Play a specific track in the music player
 */
function playTrack(trackIndex) {
  if (trackIndex < 0 || trackIndex >= musicTracks.length) return;
  
  const track = musicTracks[trackIndex];
  const trackTitle = document.querySelector('.track-title');
  const trackArtist = document.querySelector('.track-artist');
  const playerToggle = document.getElementById('player-toggle');
  
  // Stop any currently playing music
  stopMusic();
  
  // Update track info
  if (trackTitle) trackTitle.textContent = track.title;
  if (trackArtist) trackArtist.textContent = track.artist;
  
  // Create new audio element if needed
  if (!playerState.audio) {
    playerState.audio = new Audio();
  }
  
  // Set up audio
  playerState.audio.src = track.url;
  playerState.audio.volume = 0.5;
  
  // Play the track
  const playPromise = playerState.audio.play();
  if (playPromise !== undefined) {
    playPromise.then(() => {
      playerState.isPlaying = true;
      if (playerToggle) playerToggle.innerHTML = '<i class="fas fa-pause"></i>';
      setupProgressUpdates();
    }).catch(error => {
      playerState.isPlaying = false;
      if (playerToggle) playerToggle.innerHTML = '<i class="fas fa-play"></i>';
      showNotification('Click play again to start music', 'info');
    });
  }
}

/**
 * Play the current track
 */
function playMusic() {
  if (!playerState.audio) {
    playerState.audio = new Audio(musicTracks[playerState.currentTrack].url);
    playerState.audio.volume = 0.5;
  }
  
  // Stop background music if playing
  const backgroundAudio = document.getElementById('gallery-background-music');
  if (backgroundAudio && !backgroundAudio.paused) {
    backgroundAudio.pause();
    
    const toggleMusicBtn = document.getElementById('toggle-music');
    if (toggleMusicBtn) {
      toggleMusicBtn.innerHTML = '<i class="fas fa-music"></i><span>Music</span>';
      toggleMusicBtn.classList.remove('active');
    }
  }
  
  const playerToggle = document.getElementById('player-toggle');
  const playPromise = playerState.audio.play();
  
  if (playPromise !== undefined) {
    playPromise.then(() => {
      playerState.isPlaying = true;
      if (playerToggle) playerToggle.innerHTML = '<i class="fas fa-pause"></i>';
      setupProgressUpdates();
    }).catch(error => {
      showNotification('Click play again. Browser requires user interaction.', 'info');
    });
  }
}

/**
 * Pause the current track
 */
function pauseMusic() {
  if (playerState.audio && playerState.isPlaying) {
    playerState.audio.pause();
    playerState.isPlaying = false;
    
    const playerToggle = document.getElementById('player-toggle');
    if (playerToggle) {
      playerToggle.innerHTML = '<i class="fas fa-play"></i>';
    }
    
    if (playerState.updateInterval) {
      clearInterval(playerState.updateInterval);
      playerState.updateInterval = null;
    }
  }
}

/**
 * Stop music and reset
 */
function stopMusic() {
  if (playerState.audio) {
    playerState.audio.pause();
    playerState.audio.currentTime = 0;
    playerState.isPlaying = false;
    
    const playerToggle = document.getElementById('player-toggle');
    if (playerToggle) {
      playerToggle.innerHTML = '<i class="fas fa-play"></i>';
    }
    
    if (playerState.updateInterval) {
      clearInterval(playerState.updateInterval);
      playerState.updateInterval = null;
    }
  }
}

/**
 * Set up progress updates for audio player
 */
function setupProgressUpdates() {
  if (playerState.updateInterval) {
    clearInterval(playerState.updateInterval);
  }
  
  const progressFilled = document.querySelector('.progress-filled');
  const currentTimeEl = document.querySelector('.current-time');
  const durationEl = document.querySelector('.duration');
  
  // Update time display and progress bar
  const updateProgress = () => {
    if (!playerState.audio) return;
    
    const percent = (playerState.audio.currentTime / playerState.audio.duration) * 100;
    if (progressFilled) progressFilled.style.width = `${percent}%`;
    
    if (currentTimeEl) {
      currentTimeEl.textContent = formatTime(playerState.audio.currentTime);
    }
    
    if (durationEl && !isNaN(playerState.audio.duration)) {
      durationEl.textContent = formatTime(playerState.audio.duration);
    }
    
    // If track ended, play next
    if (playerState.audio.ended) {
      nextTrack();
    }
  };
  
  // Format time in mm:ss
  const formatTime = seconds => {
    if (isNaN(seconds)) return '0:00';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Update immediately and then set interval
  updateProgress();
  playerState.updateInterval = setInterval(updateProgress, 500);
  
  // Set initial duration
  playerState.audio.addEventListener('loadedmetadata', updateProgress);
}

/**
 * Play next track
 */
function nextTrack() {
  playerState.currentTrack = (playerState.currentTrack + 1) % musicTracks.length;
  playTrack(playerState.currentTrack);
}

/**
 * Show notification using the notification manager if available or fallback
 */
function showNotification(message, type = 'info') {
  // Use NotificationManager if available
  if (window.NotificationManager && typeof window.NotificationManager.show === 'function') {
    window.NotificationManager.show(message, type, {
      appName: 'Gallery',
      duration: 3000
    });
    return;
  }
  
  // Fallback notification
  const notificationsContainer = document.getElementById('notifications');
  if (!notificationsContainer) return;
  
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <span>${message}</span>
    </div>
  `;
  
  notificationsContainer.appendChild(notification);
  
  // Auto-remove after 3 seconds
  setTimeout(() => {
    notification.classList.add('hide');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
} 