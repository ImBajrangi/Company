(() => {
  //console.log('ðŸ”¥ Ad script initialized');

  // 1. Load sponsor CSS with cache busting
  const cssHref = `https://tympanus.net/codrops/adpacks/cda_sponsor.css?${Date.now()}`;
  const cssLink = document.createElement('link');
  cssLink.rel = 'stylesheet';
  cssLink.type = 'text/css';
  cssLink.href = cssHref;
  document.head.appendChild(cssLink);
  //console.log('ðŸŽ¨ Sponsor CSS appended:', cssHref);

  // 2. Sponsor definitions
  const sponsors = {
    ad1: {
      link: 'https://serpapi.com/?utm_source=tympanusdemo',
      text: 'Get structured search data without fighting captchas and build faster with simple, real-time API calls.',
    },
    ad2: {
      link: 'https://www.qodo.ai/products/qodo-gen/?utm_source=codrops&utm_medium=main-ad',
      text: 'Qodo Gen 1.0: an IDE plugin that writes, tests, and debugs code - with built-in custom tools via MCP',
    },
    ad3: {
      link: 'https://srv.buysellads.com/ads/long/x/TFB2XTZFTTTTTTTFYB6N5TTTTTTVOHAZKATTTTTTC3UV47YTTTTTTB4DCMLFWR4ZV7PCVMZFQQIUTSZLP7IUVLBWPQFT',
      text: 'Join the Agent.ai Challenge: $10,000 in Prizes! Open to All. No-Code to Full-Code. Join for Free.',
    },
    ad4: {
      link: 'https://bit.ly/codrops-diviai',
      text: 'Divi AI: On demand content creation, code writing & image generation.',
    },
  };

  // ðŸ”§ Define which ads are allowed to show
  const cdaSpots = ['ad1']; // ðŸ‘ˆ Edit this to control the selection
  const validKeys = cdaSpots.filter((key) => sponsors.hasOwnProperty(key));

  if (validKeys.length === 0) {
    console.warn('ðŸš« No valid sponsor keys found in cdaSpots');
    return;
  }

  const selectedKey = validKeys[Math.floor(Math.random() * validKeys.length)];
  const { link, text } = sponsors[selectedKey];
  //console.log(`ðŸŽ¯ Selected sponsor: ${selectedKey}`);

  // 3. Build the sponsor DOM element
  const cda = document.createElement('div');
  cda.id = 'cdawrap';
  cda.className = 'cdawrap';
  cda.innerHTML = `
    <a href="${link}" class="cda-sponsor-link" target="_blank" rel="nofollow noopener">
      ${text}
    </a>
  `;
  //console.log('ðŸ“¦ Sponsor element prepared');

  // 4. Detect .frame using MutationObserver
  const insertCda = () => {
    const frame = document.querySelector('.frame');
    if (frame) {
      console.log('âœ… .frame element found, injecting ad');
      frame.appendChild(cda);
      return true;
    } else {
      console.log('â³ Waiting for .frame element...');
      return false;
    }
  };

  if (!insertCda()) {
    const observer = new MutationObserver(() => {
      if (insertCda()) {
        observer.disconnect();
        console.log('ðŸ”Œ Observer disconnected');
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    setTimeout(() => {
      observer.disconnect();
      console.warn('âŒ Frame element never appeared. Giving up.');
    }, 5000);
  }
})();