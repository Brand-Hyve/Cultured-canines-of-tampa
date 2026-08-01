import './style.css';

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollAnimations();
  initBackgroundAnimation();
  initTabs();
  initAccordions();
  initBeforeAfterSlider();
  initModals();
  initBookingWidget();
  initForms();
});

/* ==========================================================================
   Navbar Control
   ========================================================================== */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');

  if (!navbar) return;

  // Add background shadow/blur on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      hamburger.classList.toggle('active');
      // toggle hamburger SVG states (hamburger to close icon)
      const isExpanded = navMenu.classList.contains('active');
      hamburger.innerHTML = isExpanded 
        ? `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>`
        : `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>`;
    });

    // Close mobile menu when nav-link clicked
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
        hamburger.innerHTML = `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>`;
      });
    });
  }
}

/* ==========================================================================
   Intersection Observer for Scroll Animations
   ========================================================================== */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  
  if (animatedElements.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.12 // Trigger when 12% of the element is visible
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // Once visible, we can unobserve if we want one-shot animations
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   Interactive Background Particle Animation
   ========================================================================== */
function initBackgroundAnimation() {
  const canvas = document.getElementById('bg-animation-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId;

  // Resize handler
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Mouse tracking
  const mouse = { x: null, y: null, radius: 130 };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Particle Class
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.baseSize = Math.random() * 24 + 12; // Size of particle
      this.size = this.baseSize;
      
      // Speed & direction
      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = (Math.random() - 0.5) * 0.35;
      
      // Behavior variables
      this.type = Math.random() > 0.45 ? 'paw' : (Math.random() > 0.5 ? 'circle' : 'heart');
      this.opacity = Math.random() * 0.05 + 0.02; // Very faint
      this.angle = Math.random() * Math.PI * 2;
      this.angularVelocity = (Math.random() - 0.5) * 0.002;
    }

    draw() {
      ctx.save();
      this.angle += this.angularVelocity;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);

      if (this.type === 'paw') {
        this.drawPaw(0, 0, this.size, this.opacity);
      } else if (this.type === 'circle') {
        ctx.fillStyle = `rgba(156, 93, 126, ${this.opacity * 0.8})`;
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 0.4, 0, Math.PI * 2);
        ctx.fill();
      } else {
        this.drawHeart(0, 0, this.size, this.opacity);
      }
      ctx.restore();
    }

    drawPaw(x, y, size, opacity) {
      ctx.fillStyle = `rgba(123, 37, 90, ${opacity})`;
      // Main pad
      ctx.beginPath();
      ctx.ellipse(x, y + size * 0.15, size * 0.35, size * 0.28, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Toes
      const toePositions = [
        { dx: -size * 0.28, dy: -size * 0.15, rx: size * 0.11, ry: size * 0.13 },
        { dx: -size * 0.11, dy: -size * 0.32, rx: size * 0.12, ry: size * 0.14 },
        { dx: size * 0.11, dy: -size * 0.32, rx: size * 0.12, ry: size * 0.14 },
        { dx: size * 0.28, dy: -size * 0.15, rx: size * 0.11, ry: size * 0.13 }
      ];
      
      toePositions.forEach(toe => {
        ctx.beginPath();
        ctx.ellipse(x + toe.dx, y + toe.dy, toe.rx, toe.ry, 0, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    drawHeart(x, y, size, opacity) {
      ctx.fillStyle = `rgba(242, 184, 214, ${opacity * 1.5})`;
      ctx.beginPath();
      const topCurveHeight = size * 0.3;
      ctx.moveTo(x, y + topCurveHeight);
      // Top left curve
      ctx.bezierCurveTo(
        x - size / 2, y - size / 2,
        x - size, y + size / 3,
        x, y + size
      );
      // Top right curve
      ctx.bezierCurveTo(
        x + size, y + size / 3,
        x + size / 2, y - size / 2,
        x, y + topCurveHeight
      );
      ctx.closePath();
      ctx.fill();
    }

    update() {
      // Movement
      this.x += this.vx;
      this.y += this.vy;

      // Wrap around edges
      if (this.x < -this.size * 2) this.x = canvas.width + this.size * 2;
      if (this.x > canvas.width + this.size * 2) this.x = -this.size * 2;
      if (this.y < -this.size * 2) this.y = canvas.height + this.size * 2;
      if (this.y > canvas.height + this.size * 2) this.y = -this.size * 2;

      // Mouse interaction (flee behavior)
      if (mouse.x !== null && mouse.y !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius; // 0 to 1
          const angle = Math.atan2(dy, dx);
          
          // Gently push particle away
          this.x += Math.cos(angle) * force * 1.8;
          this.y += Math.sin(angle) * force * 1.8;
          
          // Pulsate size slightly
          this.size = this.baseSize * (1 + force * 0.15);
        } else {
          // Normalize back to base size
          if (this.size > this.baseSize) {
            this.size -= 0.15;
          }
        }
      }
    }
  }

  // Create particle pool
  const particles = [];
  const particleCount = Math.min(Math.floor((canvas.width * canvas.height) / 28000), 45);
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  // Animation Loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Smooth background gradient fallback/overlay on resize
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(1, '#fff4f8');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.update();
      p.draw();
    });
    animationFrameId = requestAnimationFrame(animate);
  }
  animate();

  // Cleanup on unload to prevent leaks
  window.addEventListener('beforeunload', () => {
    cancelAnimationFrame(animationFrameId);
  });
}

/* ==========================================================================
   Tabs Component (Services Page)
   ========================================================================== */
function initTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  if (tabButtons.length === 0) return;

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');
      
      // Deactivate all buttons
      tabButtons.forEach(b => b.classList.remove('active'));
      // Hide all contents
      tabContents.forEach(c => c.classList.remove('active'));

      // Activate selected
      btn.classList.add('active');
      const targetContent = document.getElementById(targetId);
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   Accordions (FAQ / Sets Us Apart on About Page)
   ========================================================================== */
function initAccordions() {
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  if (accordionHeaders.length === 0) return;

  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isActive = item.classList.contains('active');

      // Close all items in the accordion group
      const group = item.parentElement;
      const allItems = group.querySelectorAll('.accordion-item');
      allItems.forEach(i => i.classList.remove('active'));

      // If clicked item wasn't active, open it
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   Before/After Walking Slider (Home Page)
   ========================================================================== */
function initBeforeAfterSlider() {
  const container = document.querySelector('.slider-container');
  const bar = document.querySelector('.slider-bar');
  const button = document.querySelector('.slider-button');
  const beforeImg = document.querySelector('.slider-img-before');

  if (!container || !bar || !button || !beforeImg) return;

  let isDragging = false;

  function setSliderPosition(x) {
    const rect = container.getBoundingClientRect();
    let position = ((x - rect.left) / rect.width) * 100;
    
    // Bounds check
    if (position < 0) position = 0;
    if (position > 100) position = 100;

    // Apply styles
    bar.style.left = `${position}%`;
    button.style.left = `${position}%`;
    beforeImg.style.clipPath = `polygon(0 0, ${position}% 0, ${position}% 100%, 0 100%)`;
  }

  // Event Listeners
  button.addEventListener('mousedown', (e) => {
    isDragging = true;
    e.preventDefault();
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    setSliderPosition(e.clientX);
  });

  // Touch support
  button.addEventListener('touchstart', (e) => {
    isDragging = true;
  });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    if (e.touches[0]) {
      setSliderPosition(e.touches[0].clientX);
    }
  });

  // Set default middle position
  setSliderPosition(container.getBoundingClientRect().left + container.clientWidth / 2);
}

/* ==========================================================================
   Modals (Kong Guide / Free consultation popup)
   ========================================================================== */
function initModals() {
  const triggerButtons = document.querySelectorAll('[data-open-modal]');
  const closeButtons = document.querySelectorAll('[data-close-modal]');
  const modals = document.querySelectorAll('.modal');

  if (modals.length === 0) return;

  triggerButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = btn.getAttribute('data-open-modal');
      const targetModal = document.getElementById(modalId);
      if (targetModal) {
        targetModal.classList.add('active');
        document.body.classList.add('disable-scroll');
      }
    });
  });

  closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal');
      if (modal) {
        modal.classList.remove('active');
        document.body.classList.remove('disable-scroll');
      }
    });
  });

  modals.forEach(modal => {
    const backdrop = modal.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.classList.remove('disable-scroll');
      });
    }
  });
}

/* ==========================================================================
   Floating Booking Widget
   ========================================================================== */
function initBookingWidget() {
  const bookingBtn = document.querySelector('.booking-btn');
  const bookingMenu = document.querySelector('.booking-menu');

  if (!bookingBtn || !bookingMenu) return;

  bookingBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    bookingMenu.classList.toggle('active');
  });

  document.addEventListener('click', () => {
    bookingMenu.classList.remove('active');
  });

  bookingMenu.addEventListener('click', (e) => {
    e.stopPropagation();
  });
}

/* ==========================================================================
   Forms & Lead Generation — Kong Guide
   Uses a hidden iframe to POST to Google Forms (reliable cross-origin method),
   then reveals the PDF link inline without any page navigation.
   ========================================================================== */
function initForms() {
  const FORM_ACTION = 'https://docs.google.com/forms/d/e/1FAIpQLSdNihjE1-DNlJGYwjE4EPLsPiqklKzCQUbj_DB8STQRH_-hgg/formResponse';
  const ENTRY_NAME  = 'entry.649581393';
  const ENTRY_EMAIL = 'entry.963881499';
  const PDF_URL     = 'https://assets.cdn.filesafe.space/mzfO1myzszedY3BUAzuB/media/6a6e7311a4c8a1a2c3215cca.pdf';

  function submitToGoogleForms(name, email) {
    // Build a hidden form that targets a hidden iframe.
    // This is the only cross-browser reliable way to POST to Google Forms
    // from a third-party site without CORS issues.
    const iframeName = 'kong-submit-target';

    // Reuse or create iframe
    let iframe = document.getElementById(iframeName);
    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.id   = iframeName;
      iframe.name = iframeName;
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
    }

    // Build a temporary hidden form
    const hiddenForm = document.createElement('form');
    hiddenForm.method = 'POST';
    hiddenForm.action = FORM_ACTION;
    hiddenForm.target = iframeName;
    hiddenForm.style.display = 'none';

    const fields = { [ENTRY_NAME]: name, [ENTRY_EMAIL]: email };
    for (const [key, val] of Object.entries(fields)) {
      const input = document.createElement('input');
      input.type  = 'hidden';
      input.name  = key;
      input.value = val;
      hiddenForm.appendChild(input);
    }

    document.body.appendChild(hiddenForm);
    hiddenForm.submit();

    // Clean up the hidden form after submit (iframe stays for reuse)
    setTimeout(() => hiddenForm.remove(), 2000);
  }

  const kongForms = document.querySelectorAll('#lead-form-home, #lead-form-modal');

  kongForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput  = form.querySelector('input[type="text"]');
      const emailInput = form.querySelector('input[type="email"]');
      const submitBtn  = form.querySelector('[type="submit"]');

      if (!nameInput || !emailInput) return;

      const name  = nameInput.value.trim();
      const email = emailInput.value.trim();

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = 'Sending...';
      }

      // Fire-and-forget submission via hidden iframe
      submitToGoogleForms(name, email);

      // Show inline success + PDF link immediately
      const firstName = name.split(' ')[0];
      const successHTML = `
        <div style="text-align: center; padding: 16px 0 8px;">
          <div style="font-size: 2.4rem; margin-bottom: 12px;">🐾</div>
          <h3 style="margin-bottom: 8px;">You're all set, ${firstName}!</h3>
          <p style="margin-bottom: 24px; color: var(--text-muted);">Here's your free Kong Enrichment Guide — click below to open it:</p>
          <a href="${PDF_URL}" target="_blank" rel="noopener" class="btn btn-primary" style="padding: 14px 36px; font-size: 1rem; display: inline-block;">
            📄 Open Your Kong Guide
          </a>
          <p style="margin-top: 24px; font-size: 0.85rem; color: var(--text-muted);">Happy training! 🐶<br>— Heide at Cultured Canines of Tampa</p>
        </div>`;

      const successEl = document.createElement('div');
      successEl.innerHTML = successHTML;
      form.parentNode.replaceChild(successEl, form);
    });
  });
}
