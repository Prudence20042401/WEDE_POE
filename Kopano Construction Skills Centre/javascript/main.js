/* javascript/main.js
   Part 3 functionality for Kopano site
   - mobile menu
   - accordion
   - gallery lightbox
   - search filter
   - enquiry response
   - contact form validation + mailto
   - keyboard support (Esc)
   - Leaflet map init (only if #map exists)
*/

/* ========== Mobile menu ========== */
(function () {
  const toggle = document.querySelector('.menu-toggle');
  const navList = document.querySelector('nav ul');

  if (!toggle || !navList) return;

  toggle.addEventListener('click', function () {
    const isShown = navList.classList.toggle('show');
    // set aria-expanded on button for accessibility
    this.setAttribute('aria-expanded', String(isShown));
  });
}());

/* ========== Accordion ========== */
(function () {
  const accs = document.querySelectorAll('.accordion');
  if (!accs.length) return;

  accs.forEach(btn => {
    btn.addEventListener('click', function () {
      const targetId = this.getAttribute('aria-controls');
      const panel = targetId ? document.getElementById(targetId) : this.nextElementSibling;
      const isOpen = this.getAttribute('aria-expanded') === 'true';

      this.setAttribute('aria-expanded', String(!isOpen));
      if (panel) {
        panel.style.display = isOpen ? 'none' : 'block';
        panel.setAttribute('aria-hidden', String(isOpen));
      }
    });
  });
}());

/* ========== Search / Filter ========== */
(function () {
  const input = document.querySelector('#search');
  if (!input) return;

  input.addEventListener('input', function () {
    const q = this.value.trim().toLowerCase();
    const items = document.querySelectorAll('.search-item');

    items.forEach(it => {
      const text = it.textContent.trim().toLowerCase();
      it.style.display = text.indexOf(q) !== -1 ? '' : 'none';
    });
  });
}());

/* ========== Lightbox (dynamic) ========== */
(function () {
  const images = document.querySelectorAll('.gallery-grid img, .gallery img');
  if (!images.length) return;

  // create lightbox element
  let lightbox = document.getElementById('lightbox');
  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.88);z-index:9999;visibility:hidden;opacity:0;transition:opacity 180ms ease';
    document.body.appendChild(lightbox);
  }

  function showImage(src, alt) {
    lightbox.innerHTML = '';
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt || '';
    img.style.maxWidth = '92%';
    img.style.maxHeight = '92%';
    img.tabIndex = 0;
    lightbox.appendChild(img);

    lightbox.style.visibility = 'visible';
    lightbox.style.opacity = '1';
    lightbox.focus && lightbox.focus();
  }

  images.forEach(img => {
    img.tabIndex = 0;
    img.addEventListener('click', function () {
      showImage(this.src, this.alt);
    });
    img.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        showImage(this.src, this.alt);
      }
    });
  });

  lightbox.addEventListener('click', () => {
    lightbox.style.opacity = '0';
    setTimeout(() => { lightbox.style.visibility = 'hidden'; lightbox.innerHTML = ''; }, 200);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.style.visibility === 'visible') {
      lightbox.style.opacity = '0';
      setTimeout(() => { lightbox.style.visibility = 'hidden'; lightbox.innerHTML = ''; }, 200);
    }
  });
}());

/* ========== Enquiry form (cost response) ========== */
(function () {
  const form = document.querySelector('#enquiryForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const sel = document.querySelector('#course');
    const output = document.querySelector('#response');
    if (!sel || !output) return;

    const course = sel.value;
    let price = 'TBA';

    if (course === 'bricklaying') price = 1200;
    else if (course === 'plumbing') price = 1500;
    else if (course === 'painting') price = 1000;
    else if (course === 'carpentry') price = 1300;

    output.textContent = `Estimated cost for ${course}: R${price}`;
    output.style.fontWeight = '700';
  });
}());

/* ========== Contact form validation + mailto ======== */
document.getElementById("contactForm").addEventListener("submit", function (e) {
    e.preventDefault();

    // Get input values
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const type = document.getElementById("messageType").value;
    const message = document.getElementById("message").value.trim();

    // Basic validation
    if (name.length < 3) {
        alert("Please enter your full name (minimum 3 characters).");
        return;
    }

    if (!email.includes("@") || !email.includes(".")) {
        alert("Please enter a valid email address.");
        return;
    }

    if (message.length < 10) {
        alert("Your message should be at least 10 characters long.");
        return;
    }

    // Create email body
    const subject = encodeURIComponent("Website Contact Form: " + type);
    const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\nMessage Type: ${type}\n\nMessage:\n${message}`
    );

    // Send using mailto
    window.location.href = `mailto:kopano@example.com?subject=${subject}&body=${body}`;

    // User feedback on screen
    document.getElementById("formMsg").textContent = "Your email is ready to send!";
});


  // load Leaflet CSS & JS dynamically if L is not defined
  function loadCSS(href) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }
  function loadScript(src, cb) {
    const s = document.createElement('script');
    s.src = src;
    s.onload = cb;
    document.body.appendChild(s);
  }

  if (typeof L === 'undefined') {
    loadCSS('https://unpkg.com/leaflet/dist/leaflet.css');
    loadScript('https://unpkg.com/leaflet/dist/leaflet.js', initMap);
  } else {
    initMap();
  }

  function initMap() {
    // default coordinates - update to your real coords if you have them
    const lat = -26.2041;
    const lng = 28.0473;
    const map = L.map('map').setView([lat, lng], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
    L.marker([lat, lng]).addTo(map).bindPopup('Kopano Construction Skills Centre');
  }
  // Custom Cursor Movement
const cursor = document.querySelector('.custom-cursor');

document.addEventListener('mousemove', (e) => {
  cursor.style.left = `${e.pageX}px`;
  cursor.style.top = `${e.pageY}px`;
});
