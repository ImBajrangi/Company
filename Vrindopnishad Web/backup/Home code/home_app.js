//step 1: get DOM
let nextDom = document.getElementById('next');
let prevDom = document.getElementById('prev');

let carouselDom = document.querySelector('.carousel');
let SliderDom = carouselDom.querySelector('.carousel .list');
let thumbnailBorderDom = document.querySelector('.carousel .thumbnail');
let thumbnailItemsDom = thumbnailBorderDom.querySelectorAll('.item');

thumbnailBorderDom.appendChild(thumbnailItemsDom[0]);
let timeRunning = 600; // Time for the transition effect
let timeAutoNext = 5000; // Change the main picture every 5 seconds

let controlButton = document.getElementById('control');
let isRunning = true;

controlButton.onclick = function() {
    if (isRunning) {
        clearTimeout(runNextAuto);
        controlButton.textContent = 'Start Animation';
    } else {
        runNextAuto = setTimeout(() => {
            next.click();
        }, timeAutoNext);
        controlButton.textContent = 'Stop Animation';
    }
    isRunning = !isRunning;
}

nextDom.onclick = function(){
    showSlider('next');    
}

prevDom.onclick = function(){
    showSlider('prev');    
}

let runTimeOut;
let runNextAuto = setTimeout(() => {
    next.click();
}, timeAutoNext);

window.onload = function() {
    addExistingPictures();
    controlAnimation();
    adjustCarouselForMobile(); // Add this line to adjust the carousel for mobile mode
};

function controlAnimation() {
    const slider = document.querySelector('.banner .slider');
    let loopCount = 0;
    const maxLoops = 20;

    slider.addEventListener('animationiteration', () => {
        loopCount++;
        if (loopCount >= maxLoops) {
            slider.classList.add('stop-animation');
        }
    });
}

function showSlider(type){
    let SliderItemsDom = SliderDom.querySelectorAll('.carousel .list .item');
    let thumbnailItemsDom = document.querySelectorAll('.carousel .thumbnail .item');
    
    if(type === 'next'){
        SliderDom.appendChild(SliderItemsDom[0]);
        thumbnailBorderDom.appendChild(thumbnailItemsDom[0]);
        carouselDom.classList.add('next');
    }else{
        SliderDom.prepend(SliderItemsDom[SliderItemsDom.length - 1]);
        thumbnailBorderDom.prepend(thumbnailItemsDom[thumbnailItemsDom.length - 1]);
        carouselDom.classList.add('prev');
    }

    clearTimeout(runTimeOut);
    runTimeOut = setTimeout(() => {
        carouselDom.classList.remove('next');
        carouselDom.classList.remove('prev');
        // Ensure the photo settles to its right position
        SliderItemsDom.forEach(item => {
            item.style.transform = 'translateX(0)';
            item.style.opacity = '1'; // Ensure full opacity
        });
        // Enable the buttons immediately after the animation
        nextDom.disabled = false;
        prevDom.disabled = false;
    }, timeRunning);

    clearTimeout(runNextAuto);
    runNextAuto = setTimeout(() => {
        nextDom.click();
    }, timeAutoNext);

    // Disable the buttons during the animation
    nextDom.disabled = true;
    prevDom.disabled = true;

    // Simplify and ensure the transition effect
    SliderItemsDom.forEach(item => {
        item.style.transition = 'transform 1s ease-in-out, opacity 1s ease-in-out'; // Smoother transition
        item.style.transform = 'scale(1.02)';
        item.style.opacity = '0.8';
        setTimeout(() => {
            item.style.transform = 'scale(1)';
            item.style.opacity = '1';
        }, 1000); // Adjust timing to match the smoother transition
    });

    // Handle video autoplay and ensure next picture does not appear until video completes
    SliderItemsDom.forEach(item => {
        const video = item.querySelector('video');
        if (video) {
            video.style.width = '100%'; // Ensure video size matches other pictures
            video.style.height = '100%'; // Ensure video size matches other pictures
            video.loop = false; // Ensure the video does not play on loop
            video.addEventListener('ended', () => {
                nextDom.disabled = false;
                prevDom.disabled = false;
                clearTimeout(runNextAuto);
                runNextAuto = setTimeout(() => {
                    nextDom.click();
                }, timeAutoNext);
            });
            if (item === SliderItemsDom[SliderItemsDom.length - 1]) {
                video.currentTime = 0; // Start the video from the beginning
                video.play();
                nextDom.disabled = true;
                prevDom.disabled = true;
            } else {
                video.pause();
                video.currentTime = 0;
            }
        } else {
            nextDom.disabled = false;
            prevDom.disabled = false;
        }
    });
}

function adjustCarouselForMobile() {
    if (window.innerWidth <= 768) {
        const slider = document.querySelector('.banner .slider');
        slider.style.display = 'none'; // Remove the group of pictures for mobile mode
        const view = document.querySelector('.view');
        view.style.display = 'flex';
        view.style.flexDirection = 'row';
        view.style.overflowX = 'auto';
        view.style.whiteSpace = 'nowrap';
        const blocks = view.querySelectorAll('.block');
        blocks.forEach(block => {
            block.style.flex = '0 0 auto';
            block.style.width = '150px';
            block.style.marginRight = '10px';
            block.style.borderRadius = '15px';
            const img = block.querySelector('img');
            img.style.borderRadius = '15px';
        });
    }
}

// Add click event to thumbnail items
document.querySelectorAll('.thumbnail .item').forEach((item, index) => {
    item.addEventListener('click', () => {
        const links = [
            'link1.html',
            'link2.html',
            'link3.html',
            'link4.html',
            'link5.html',
            'link6.html'
        ];
        window.location.href = links[index];
    });
});

// Add click event to carousel items
document.querySelectorAll('.carousel .list .item').forEach((item, index) => {
    item.addEventListener('click', () => {
        // Do nothing to make the big picture non-reactable
    });
});

// Synchronize vertical scroll with horizontal scroll
window.addEventListener('scroll', () => {
    const softCorneredBlocks = document.querySelector('.soft-cornered-blocks');
    const scrollPosition = window.scrollY;
    softCorneredBlocks.scrollLeft = scrollPosition;
});

// Function to update the website URL
function updateWebsiteURL(newURL) {
    var websiteLink = document.getElementById('website-link');
    websiteLink.href = newURL;
    websiteLink.textContent = newURL;
}

// Example usage: updateWebsiteURL('https://www.new-url.com');

const viewer = document.getElementById('splineViewer');

// Wait for the Spline Viewer to fully load
viewer.addEventListener('load', () => {
  console.log('Spline Viewer Loaded');

  // Get the Spline runtime object
  const runtime = viewer.runtime;

  // Ensure the runtime is ready
  runtime.onReady(() => {
    console.log('Runtime Ready');

    // Find the head object by its name in Spline
    const headObject = runtime.findObjectByName('Head'); // Replace 'Head' with your object's name

    if (headObject) {
      console.log('Head object found:', headObject);

      // Add mousemove event to rotate the head
      window.addEventListener('mousemove', (event) => {
        const mouseX = (event.clientX / window.innerWidth) * 2 - 1; // Normalize X
        const mouseY = -(event.clientY / window.innerHeight) * 2 + 1; // Normalize Y

        // Map the mouse position to rotation values
        headObject.rotation.x = mouseY * 0.5; // Adjust sensitivity
        headObject.rotation.y = mouseX * 0.5; // Adjust sensitivity
      });
    } else {
      console.error('Head object not found. Ensure it is named correctly in the Spline editor.');
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

// Video player logic
const boxes = document.querySelectorAll('.box');
const videoModal = document.getElementById('videoModal');
const videoPlayer = document.getElementById('videoPlayer');
const closeVideoModal = document.getElementById('closeVideoModal'); // Add this line

boxes.forEach(box => {
    box.addEventListener('click', () => {
        const videoSrc = box.getAttribute('data-video');
        if (videoSrc.includes('youtube.com')) {
            videoPlayer.innerHTML = `<iframe width="100%" height="100%" src="${videoSrc}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
        } else {
            videoPlayer.innerHTML = `<video src="${videoSrc}" controls autoplay loop style="width: 100%; height: 100%;"></video>`;
        }
        videoModal.style.display = 'block';
    });
});

closeVideoModal.addEventListener('click', () => {
    videoModal.style.display = 'none';
    videoPlayer.innerHTML = ''; // Clear the video player content
});

window.addEventListener('click', (event) => {
    if (event.target === videoModal) {
        videoModal.style.display = 'none';
        videoPlayer.innerHTML = ''; // Clear the video player content
    }
});

// Ensure the video plays on loop
videoPlayer.loop = true;

// Make video player larger for desktop full-screen mode
window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024) {
        videoPlayer.style.width = '90%';
        videoPlayer.style.height = '90%';
    } else {
        videoPlayer.style.width = '100%';
        videoPlayer.style.height = 'auto';
    }
});

// Initial check
if (window.innerWidth >= 1024) {
    videoPlayer.style.width = '90%';
    videoPlayer.style.height = '90%';
} else {
    videoPlayer.style.width = '100%';
    videoPlayer.style.height = 'auto';
}

// Remove video player mode on scroll
window.addEventListener('scroll', () => {
    if (videoModal.style.display === 'block') {
        videoModal.style.display = 'none';
        videoPlayer.innerHTML = ''; // Clear the video player content
    }
});

// Add click event to heart icons
document.querySelectorAll('.thumbnail .item .icon ion-icon').forEach(icon => {
    icon.addEventListener('click', () => {
        const heart = document.getElementById('animated-heart').cloneNode(true);
        heart.style.display = 'block';
        heart.style.position = 'absolute';
        heart.style.width = `${icon.offsetWidth}px`;
        heart.style.height = `${icon.offsetHeight}px`;
        heart.style.top = `${icon.getBoundingClientRect().top + window.scrollY + icon.offsetHeight / 2 - heart.offsetHeight / 2}px`;
        heart.style.left = `${icon.getBoundingClientRect().left + window.scrollX + icon.offsetWidth / 2 - heart.offsetWidth / 2}px`;
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 1000); // Remove after animation

        // Change icon color to yellow
        icon.style.color = 'yellow';
        icon.setAttribute('name', 'heart'); // Change icon to filled heart
    });
});

// Add hover effect to menu notification items
document.querySelectorAll('.menu-notification').forEach(notification => {
    notification.addEventListener('mouseenter', () => {
        notification.style.transform = 'scale(1.1)';
        notification.style.boxShadow = '0 0 5px rgba(106, 17, 203, 0.3), 0 12px 24px rgba(0, 0, 0, 0.3)';
    });
    notification.addEventListener('mouseleave', () => {
        notification.style.transform = 'scale(1)';
        notification.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.5)';
    });
});

document.querySelectorAll('.menu-notification').forEach(notification => {
    notification.addEventListener('mouseenter', () => {
        const openButton = notification.querySelector('.open-button');
        openButton.style.opacity = '1';
    });

    notification.addEventListener('mouseleave', () => {
        const openButton = notification.querySelector('.open-button');
        openButton.style.opacity = '0';
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const menuItems = document.querySelectorAll('.navigation ul li');
    let delay = 0;
    let activeIndex = 0;
    let intervalId;

    function activateNextItem() {
        // Deactivate the current active item with a fade-out effect
        menuItems[activeIndex].classList.remove('active');
        menuItems[activeIndex].classList.add('fade-out');

        // Calculate the next index
        activeIndex = (activeIndex + 1) % menuItems.length;

        // Activate the next item with a fade-in effect
        menuItems[activeIndex].classList.remove('fade-out');
        menuItems[activeIndex].classList.add('active', 'fade-in');

        // Remove the fade-in class after the animation completes
        setTimeout(() => {
            menuItems[activeIndex].classList.remove('fade-in');
        }, 500); // Match the duration of the fade-in animation
    }

    // Initial activation
    menuItems[activeIndex].classList.add('active');

    // Set interval to activate the next item every 3 seconds
    intervalId = setInterval(activateNextItem, 3000);

    // Stop the activating animation after 2 minutes and activate the Home icon
    setTimeout(() => {
        clearInterval(intervalId);
        menuItems.forEach(item => item.classList.remove('active'));
        menuItems[0].classList.add('active'); // Activate the Home icon
    }, 120000); // 2 minutes in milliseconds

    menuItems.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('hover');
            setTimeout(() => {
                item.classList.remove('hover');
            }, 500);
        }, delay);
        delay += 1000; // Increase delay to ensure visibility
    });

    // Add functionality for the shyam menu
    const shyamMenu = document.querySelector('.shyam-menu');
    const nav = document.querySelector('nav');

    shyamMenu.addEventListener('click', () => {
        shyamMenu.classList.toggle('open');
        nav.classList.toggle('show');
    });
});

// Function to get a random number between min and max (inclusive)
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}