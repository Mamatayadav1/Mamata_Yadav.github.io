/* ============================================
   EFFECTS.JS - Animation & Interactivity
   ============================================ */

(function() {
  'use strict';

  // ===== Configuration =====
  const CONFIG = {
    particles: {
      count: 60,
      maxSpeed: 0.5,
      minSpeed: 0.1,
      size: 2,
      connections: false // Set to true for connected particle network effect
    },
    parallax: {
      enabled: true,
      intensity: 0.03
    },
    tilt: {
      enabled: true,
      maxAngle: 5
    },
    scrollReveal: {
      enabled: true,
      threshold: 0.1
    }
  };

  // ===== Detect Capabilities =====
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  const isLowMemory = navigator.deviceMemory && navigator.deviceMemory < 4;
  const shouldAnimate = !isReducedMotion && !isMobile && !isLowMemory;

  // ===== State =====
  let animationPaused = false;
  let particles = [];
  let canvas, ctx;
  let mouseX = 0, mouseY = 0;

  // ===== Initialization =====
  function init() {
    if (!shouldAnimate) {
      console.log('[Effects] Animations disabled (reduced motion, mobile, or low memory)');
      return;
    }

    createBackgroundOrbs();
    initParticles();
    initScrollReveal();
    initCardTilt();
    initParallax();

    // Listen for edit mode
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const isEditMode = document.body.classList.contains('edit-mode');
          isEditMode ? pauseEffects() : resumeEffects();
        }
      });
    });
    observer.observe(document.body, { attributes: true });

    console.log('[Effects] Initialized');
  }

  // ===== Background Orbs =====
  function createBackgroundOrbs() {
    const orbContainer = document.createElement('div');
    orbContainer.className = 'background-orbs';
    
    for (let i = 1; i <= 3; i++) {
      const orb = document.createElement('div');
      orb.className = `orb orb-${i}`;
      orbContainer.appendChild(orb);
    }
    
    document.body.insertBefore(orbContainer, document.body.firstChild);
  }

  // ===== Particles =====
  function initParticles() {
    canvas = document.createElement('canvas');
    canvas.id = 'particle-canvas';
    document.body.insertBefore(canvas, document.body.firstChild);

    ctx = canvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create particles
    for (let i = 0; i < CONFIG.particles.count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * CONFIG.particles.maxSpeed,
        vy: (Math.random() - 0.5) * CONFIG.particles.maxSpeed,
        size: Math.random() * CONFIG.particles.size + 1
      });
    }

    animateParticles();
  }

  function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function animateParticles() {
    if (!ctx || animationPaused) {
      requestAnimationFrame(animateParticles);
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p) => {
      // Update position
      p.x += p.vx;
      p.y += p.vy;

      // Bounce off edges
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(108, 99, 255, 0.4)';
      ctx.fill();
    });

    requestAnimationFrame(animateParticles);
  }

  // ===== Parallax =====
  function initParallax() {
    if (!CONFIG.parallax.enabled) return;

    document.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
      updateParallax();
    });
  }

  function updateParallax() {
    if (animationPaused) return;
    
    const orbs = document.querySelectorAll('.orb');
    orbs.forEach((orb, index) => {
      const depth = (index + 1) * CONFIG.parallax.intensity;
      const x = mouseX * depth * 50;
      const y = mouseY * depth * 50;
      orb.style.transform = `translate(${x}px, ${y}px)`;
    });
  }

  // ===== Scroll Reveal =====
  function initScrollReveal() {
    if (!CONFIG.scrollReveal.enabled) return;

    const sections = document.querySelectorAll('header, section');
    sections.forEach(el => el.setAttribute('data-scroll-reveal', ''));

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, { threshold: CONFIG.scrollReveal.threshold });

    sections.forEach(section => observer.observe(section));
  }

  // ===== Card Tilt =====
  function initCardTilt() {
    if (!CONFIG.tilt.enabled) return;

    const cards = document.querySelectorAll('header, section');
    cards.forEach(card => {
      card.classList.add('tilt-card');

      card.addEventListener('mousemove', (e) => {
        if (animationPaused) return;

        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * CONFIG.tilt.maxAngle;
        const rotateY = ((x - centerX) / centerX) * CONFIG.tilt.maxAngle;
        
        card.style.setProperty('--tilt-x', `${-rotateX}deg`);
        card.style.setProperty('--tilt-y', `${rotateY}deg`);
      });

      card.addEventListener('mouseleave', () => {
        card.style.setProperty('--tilt-x', '0deg');
        card.style.setProperty('--tilt-y', '0deg');
      });
    });
  }

  // ===== Control Functions =====
  function pauseEffects() {
    animationPaused = true;
    console.log('[Effects] Paused');
  }

  function resumeEffects() {
    animationPaused = false;
    console.log('[Effects] Resumed');
  }

  function destroyEffects() {
    animationPaused = true;
    if (canvas) canvas.remove();
    const orbContainer = document.querySelector('.background-orbs');
    if (orbContainer) orbContainer.remove();
    console.log('[Effects] Destroyed');
  }

  // ===== Public API =====
  window.effects = {
    pause: pauseEffects,
    resume: resumeEffects,
    destroy: destroyEffects
  };

  // ===== Auto-init =====
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
