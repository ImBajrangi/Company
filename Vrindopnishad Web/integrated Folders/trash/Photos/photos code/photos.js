// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Image Array
const images = document.querySelectorAll(".image-gallery img");
const imgGallery = document.querySelector(".image-gallery");

const animation = gsap.timeline();

images.forEach((img, i) => {
    gsap.set(img, { y: `${imgGallery.offsetHeight * i}` });

    animation.to(img, {
        y: `-${imgGallery.offsetHeight + img.offsetHeight * 1.5}`,
        duration: (i + 1) * 5,
        ease: "none"
    }, 0);
});

ScrollTrigger.create({
    animation: animation,
    trigger: ".image-gallery",
    start: "top top",
    end: `+=${(images.length) * imgGallery.offsetHeight}`,
    pin: true,
    scrub: 1,
    markers: false // Remove markers to hide 'scroller-start' and 'end'
});

// Add menu bar functionality
document.addEventListener('DOMContentLoaded', () => {
    const menuItems = document.querySelectorAll('.navigation ul li');
    const searchIcon = document.getElementById('searchIcon');
    const searchBar = document.getElementById('searchBar');
    let previousActive = document.querySelector('.navigation ul li.active');

    function activeLink() {
        menuItems.forEach(item => item.classList.remove('active'));
        this.classList.add('active');
        setTimeout(() => {
            menuItems.forEach(item => item.classList.remove('active'));
            previousActive.classList.add('active');
        }, 5000); // Re-activate the previous active item after 5 seconds
    }
    menuItems.forEach(item => item.addEventListener('click', activeLink));

    // Show search bar on click
    searchIcon.addEventListener('click', (e) => {
        e.preventDefault();
        searchBar.style.display = 'block';
        searchBar.classList.add('fade-in'); // Add fade-in animation
    });

    // Ensure search bar opens correctly when clicking on the search icon
    document.addEventListener('click', (e) => {
        if (e.target.id === 'searchIcon' || e.target.closest('#searchIcon')) {
            searchBar.style.display = 'block';
            searchBar.classList.add('fade-in'); // Add fade-in animation
        }
    });

    // Ensure search bar closes when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchBar.contains(e.target) && e.target.id !== 'searchIcon' && !e.target.closest('#searchIcon')) {
            searchBar.style.display = 'none';
            searchBar.classList.remove('fade-in'); // Remove fade-in animation
            searchIcon.classList.remove('active'); // Remove active class from search icon
        }
    });
});
