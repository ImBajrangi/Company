document.addEventListener('DOMContentLoaded', () => {
  const blocks = document.querySelectorAll('.block');
  const menuItems = document.querySelectorAll('.navigation ul li');
  const footer = document.querySelector('footer');
  let lastScrollTop = 0;
  let defaultActiveItem = document.querySelector('.navigation ul li.active');

  blocks.forEach((block) => {
    block.addEventListener('click', () => {
      const imgSrc = block.querySelector('img').src;
      const textContent = block.querySelector('.text').textContent;

      // Show notification with the image and text
      showNotification(imgSrc, textContent);
    });

    block.addEventListener('mouseenter', function() {
      const actionButton = block.querySelector('.action-button');
      if (actionButton) {
        actionButton.style.opacity = '1';
      }
    });

    block.addEventListener('mouseleave', function() {
      const actionButton = block.querySelector('.action-button');
      if (actionButton) {
        actionButton.style.opacity = '0';
      }
    });
  });

  function showNotification(imgSrc, textContent) {
    // Remove existing notification (if any)
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) existingNotification.remove();

    // Remove existing cross button (if any)
    const existingCrossButton = document.querySelector('.cross-button');
    if (existingCrossButton) existingCrossButton.remove();

    // Create notification container
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background:rgb(213, 240, 243);
      padding: 20px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
      border-radius: 25px;
      text-align: center;
      z-index: 1000;
    `;

    // Add image to the notification
    const img = document.createElement('img');
    img.src = imgSrc;
    img.alt = 'Notification Image';
    img.style.cssText = `
      width: 50%; /* Reduce the size of the image */
      height: auto;
      border-radius: 15px;
    `;

    // Add text to the notification
    const text = document.createElement('div');
    text.classList.add('notification-text');
    text.textContent = textContent;
    text.style.cssText = `
      margin: 15px 0;
      font-size: 1.2rem;
      color: #333;
    `;

    // Add buttons to the notification
    const actionButton = document.createElement('button');
    actionButton.textContent = 'Action';
    actionButton.style.cssText = `
      margin-right: 20px; /* Increase margin to create distance */
      padding: 7.5px 15px; /* Increase padding */
      font-size: 1.1rem; /* Increase font size */
      background:rgb(248, 239, 104);
      color:rgb(3, 90, 114);
      border: none;
      border-radius: 30px;
      cursor: pointer;
      box-shadow: 0 0px 40px rgba(16, 240, 244, 0.9);
      transition: transform 0.6s ease, box-shadow 0.6s ease; /* Add transition for hover effect */
    `;
    actionButton.addEventListener('click', () => {
      window.open('https://heyzine.com/flip-book/f1c121acb6.html', '_blank'); // Open e-book link in a new tab
    });
    actionButton.addEventListener('mouseenter', () => {
      actionButton.style.transform = 'scale(1.2)';
      actionButton.style.boxShadow = '0 0px 100px rgb(255, 243, 107)';
    });
    actionButton.addEventListener('mouseleave', () => {
      actionButton.style.transform = 'scale(1)';
      actionButton.style.boxShadow = '0 0px 60px rgba(250, 240, 151, 0.9)';
    });

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.style.cssText = `
      padding: 7.5px 15px; /* Increase padding */
      font-size: 1.1rem; /* Increase font size */
      background:rgb(42, 42, 1);
      color:rgb(243, 251, 103);
      border: none;
      border-radius: 30px;
      cursor: pointer;
      box-shadow: 0 0px 40px rgba(63, 249, 246, 0.9);
      transition: transform 0.6s ease, box-shadow 0.6s ease; /* Add transition for hover effect */
    `;
    closeButton.addEventListener('click', () => {
      notification.remove();
      overlay.remove(); // Remove overlay when notification is closed
      crossButton.remove(); // Remove cross button when notification is closed
      document.body.classList.remove('no-interaction'); // Re-enable interactions
    });
    closeButton.addEventListener('mouseenter', () => {
      closeButton.style.transform = 'scale(1.2)';
      closeButton.style.boxShadow = '0 0px 50px rgb(255, 224, 47)';
    });
    closeButton.addEventListener('mouseleave', () => {
      closeButton.style.transform = 'scale(1)';
      closeButton.style.boxShadow = '0 0px 30px rgba(24, 72, 114, 0.8)';
    });

    // Add cross button to the notification
    const crossButton = document.createElement('span');
    crossButton.classList.add('cross-button');
    crossButton.textContent = '×';
    crossButton.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      font-size: 40px;
      cursor: pointer;
      z-index: 1001;
      color:rgb(244, 247, 198);
    `;
    crossButton.addEventListener('click', () => {
      notification.remove();
      overlay.remove(); // Remove overlay when notification is closed
      crossButton.remove(); // Remove cross button when notification is closed
      document.body.classList.remove('no-interaction'); // Re-enable interactions
    });

    // Append elements to the notification
    notification.appendChild(img);
    notification.appendChild(text);
    notification.appendChild(actionButton);
    notification.appendChild(closeButton);

    // Append the notification and cross button to the body
    document.body.appendChild(notification);
    document.body.appendChild(crossButton);

    // Add overlay to dim the background
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 999;
      box-shadow: 0 0px 10px rgba(249, 220, 0, 0.5);
    `;
    overlay.addEventListener('click', () => {
      notification.remove();
      crossButton.remove();
      overlay.remove();
      document.body.classList.remove('no-interaction'); // Re-enable interactions
    });
    document.body.appendChild(overlay);

    // Disable interactions on the background
    document.body.classList.add('no-interaction');
  }

  // Show search bar on click
  const searchIcon = document.getElementById('searchIcon');
  const searchBar = document.getElementById('searchBar');
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

  const list = document.querySelectorAll('.navigation ul li');
  function activeLink() {
    list.forEach(item => item.classList.remove('active'));
    this.classList.add('active');
    setTimeout(() => {
      list.forEach(item => item.classList.remove('active'));
      defaultActiveItem.classList.add('active');
    }, 5000); // Re-activate the default item after 5 seconds
  }
  list.forEach(item => item.addEventListener('click', activeLink));

  // Add background motion
  document.addEventListener('mousemove', (e) => {
    if (!document.body.classList.contains('no-interaction')) {
      const moveX = (e.clientX / window.innerWidth) * 10 - 5;
      const moveY = (e.clientY / window.innerHeight) * 10 - 5;
      document.body.style.backgroundPosition = `${moveX}px ${moveY}px`;
    }
  });

  // Ensure picture's movement in desktop mode
  const sliderItems = document.querySelectorAll('.slider .item');
  sliderItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      if (!document.body.classList.contains('no-interaction')) {
        item.querySelector('img').style.transform = 'scale(1.1)';
      }
    });
    item.addEventListener('mouseleave', () => {
      if (!document.body.classList.contains('no-interaction')) {
        item.querySelector('img').style.transform = 'scale(1)';
      }
    });
  });

  // Ensure menu items are reactable when notification is on
  menuItems.forEach(item => {
    item.style.pointerEvents = 'auto';
  });

  // Handle footer scroll effect
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollTop + windowHeight >= documentHeight) {
      // User is at the bottom of the page
      footer.style.bottom = '0';
      document.body.classList.add('show-footer');
    } else {
      // Scrolling up or down
      footer.style.bottom = '-100px';
      document.body.classList.remove('show-footer');
    }
    lastScrollTop = scrollTop;
  });
});