// Go4it Sports Academy Landing Page JavaScript
// Handles FAQ accordions, scroll animations, and form enhancements

(function() {
  'use strict';

  // ============================================
  // FAQ ACCORDION
  // ============================================
  function initFAQ() {
    const faqButtons = document.querySelectorAll('.faq-item dt button');
    
    faqButtons.forEach(button => {
      button.addEventListener('click', function() {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        
        // Close all other FAQs
        faqButtons.forEach(btn => {
          btn.setAttribute('aria-expanded', 'false');
        });
        
        // Toggle current FAQ
        this.setAttribute('aria-expanded', !isExpanded);
      });
    });
  }

  // ============================================
  // SCROLL ANIMATIONS
  // ============================================
  function initScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    // Observe all elements with data-scroll attribute
    document.querySelectorAll('[data-scroll]').forEach(el => {
      observer.observe(el);
    });
  }

  // ============================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ============================================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Skip if href is just "#"
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
          const offsetTop = target.offsetTop - 100; // Account for sticky nav
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // ============================================
  // ACTIVE NAV LINK
  // ============================================
  function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__menu a[href^="#"]');

    function setActiveLink() {
      let current = '';
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop - 200) {
          current = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.removeAttribute('aria-current');
        if (link.getAttribute('href') === `#${current}`) {
          link.setAttribute('aria-current', 'page');
        }
      });
    }

    window.addEventListener('scroll', setActiveLink);
    setActiveLink(); // Initial call
  }

  // ============================================
  // UTM PARAMETER CAPTURE
  // ============================================
  function captureUTMParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const utmFields = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'];
    
    utmFields.forEach(field => {
      const value = urlParams.get(field);
      const input = document.getElementById(field);
      
      if (value && input) {
        input.value = value;
      }
    });
  }

  // ============================================
  // FORM VALIDATION ENHANCEMENT
  // ============================================
  function initFormValidation() {
    const form = document.querySelector('.signup-form');
    
    if (form) {
      form.addEventListener('submit', function(e) {
        // Basic validation is handled by HTML5 required attributes
        // You can add custom validation here if needed
        
        const role = document.getElementById('role').value;
        const interest = document.getElementById('interest').value;
        
        if (!role || !interest) {
          e.preventDefault();
          alert('Please select your role and interest.');
          return false;
        }

        // Track conversion
        if (window.dataLayer) {
          window.dataLayer.push({
            event: 'form_submit',
            form_name: 'lead_capture',
            role: role,
            interest: interest
          });
        }
      });
    }
  }

  // ============================================
  // CTA CLICK TRACKING
  // ============================================
  function initCTATracking() {
    document.querySelectorAll('[data-cta]').forEach(button => {
      button.addEventListener('click', function() {
        const ctaName = this.getAttribute('data-cta');
        const isConversion = this.hasAttribute('data-kpi');
        
        // Track with analytics
        if (window.dataLayer) {
          window.dataLayer.push({
            event: isConversion ? 'conversion_cta' : 'cta_click',
            cta_name: ctaName,
            cta_text: this.textContent.trim(),
            cta_url: this.getAttribute('href')
          });
        }
        
        console.log(`CTA clicked: ${ctaName}`);
      });
    });
  }

  // ============================================
  // ATHLETE CAROUSEL
  // ============================================
  function initCarousel() {
    const track = document.querySelector('.athlete-carousel__track');
    const slides = document.querySelectorAll('.athlete-carousel__slide');
    const prevBtn = document.querySelector('.carousel-btn--prev');
    const nextBtn = document.querySelector('.carousel-btn--next');
    
    if (!track || slides.length === 0) return;
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    function goToSlide(index) {
      currentSlide = (index + totalSlides) % totalSlides;
      track.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
    
    function nextSlide() {
      goToSlide(currentSlide + 1);
    }
    
    function prevSlide() {
      goToSlide(currentSlide - 1);
    }
    
    // Auto-advance every 5 seconds
    let autoAdvance = setInterval(nextSlide, 5000);
    
    // Pause on hover
    track.addEventListener('mouseenter', () => {
      clearInterval(autoAdvance);
    });
    
    track.addEventListener('mouseleave', () => {
      autoAdvance = setInterval(nextSlide, 5000);
    });
    
    // Button controls
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
  }

  // ============================================
  // NUMBER COUNTER ANIMATIONS
  // ============================================
  function initCounters() {
    const counters = document.querySelectorAll('[data-counter]');
    
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-counter'));
      const duration = 2000; // 2 seconds
      const increment = target / (duration / 16); // 60fps
      let current = 0;
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && current === 0) {
            const updateCounter = () => {
              current += increment;
              if (current < target) {
                counter.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
              } else {
                counter.textContent = target.toLocaleString();
              }
            };
            updateCounter();
          }
        });
      }, { threshold: 0.5 });
      
      observer.observe(counter);
    });
  }

  // ============================================
  // ATHLETE GRID FILTERING
  // ============================================
  function initAthleteGrid() {
    const grid = document.querySelector('.athlete-grid');
    if (!grid) return;
    
    const cards = grid.querySelectorAll('.athlete-card');
    const sportFilter = document.getElementById('sport-filter');
    const yearFilter = document.getElementById('year-filter');
    const scoreFilter = document.getElementById('score-filter');
    const sortFilter = document.getElementById('sort-filter');
    
    function filterAndSort() {
      const sport = sportFilter?.value || 'all';
      const year = yearFilter?.value || 'all';
      const score = scoreFilter?.value || 'all';
      const sort = sortFilter?.value || 'gar-high';
      
      // Convert NodeList to Array for sorting
      const cardArray = Array.from(cards);
      
      // Filter cards
      cardArray.forEach(card => {
        const cardSport = card.getAttribute('data-sport');
        const cardYear = card.getAttribute('data-year');
        const cardGar = parseInt(card.getAttribute('data-gar'));
        
        let show = true;
        
        if (sport !== 'all' && cardSport !== sport) show = false;
        if (year !== 'all' && cardYear !== year) show = false;
        
        if (score === '90+' && cardGar < 90) show = false;
        if (score === '80-89' && (cardGar < 80 || cardGar >= 90)) show = false;
        if (score === '70-79' && (cardGar < 70 || cardGar >= 80)) show = false;
        
        card.style.display = show ? 'block' : 'none';
      });
      
      // Sort visible cards
      const visibleCards = cardArray.filter(card => card.style.display !== 'none');
      
      visibleCards.sort((a, b) => {
        const garA = parseInt(a.getAttribute('data-gar'));
        const garB = parseInt(b.getAttribute('data-gar'));
        const nameA = a.querySelector('h3').textContent;
        const nameB = b.querySelector('h3').textContent;
        
        if (sort === 'gar-high') return garB - garA;
        if (sort === 'gar-low') return garA - garB;
        if (sort === 'name') return nameA.localeCompare(nameB);
        return 0; // 'recent' would need timestamp data
      });
      
      // Reorder in DOM
      visibleCards.forEach(card => grid.appendChild(card));
    }
    
    // Add event listeners
    [sportFilter, yearFilter, scoreFilter, sortFilter].forEach(filter => {
      if (filter) filter.addEventListener('change', filterAndSort);
    });
  }

  // ============================================
  // GAR CALCULATOR
  // ============================================
  function initGARCalculator() {
    const form = document.getElementById('gar-calculator-form');
    const resultDiv = document.getElementById('calculator-result');
    
    if (!form || !resultDiv) return;
    
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const dash40 = parseFloat(document.getElementById('dash-40').value);
      const vertical = parseFloat(document.getElementById('vertical').value);
      const shuttle = parseFloat(document.getElementById('shuttle').value);
      const gpa = parseFloat(document.getElementById('gpa').value);
      
      // Simple GAR estimation formula (adjust as needed)
      // Lower 40yd time is better, higher vertical is better, lower shuttle is better, higher GPA is better
      let score = 50; // Base score
      
      // 40-yard dash scoring (lower is better)
      if (dash40 < 4.3) score += 20;
      else if (dash40 < 4.5) score += 15;
      else if (dash40 < 4.7) score += 10;
      else if (dash40 < 5.0) score += 5;
      
      // Vertical jump scoring (higher is better)
      if (vertical > 36) score += 20;
      else if (vertical > 32) score += 15;
      else if (vertical > 28) score += 10;
      else if (vertical > 24) score += 5;
      
      // Shuttle scoring (lower is better)
      if (shuttle < 4.0) score += 10;
      else if (shuttle < 4.3) score += 7;
      else if (shuttle < 4.6) score += 4;
      
      // GPA scoring
      if (gpa >= 3.8) score += 10;
      else if (gpa >= 3.5) score += 7;
      else if (gpa >= 3.0) score += 5;
      else if (gpa >= 2.5) score += 2;
      
      // Cap at 100
      score = Math.min(100, Math.round(score));
      
      // Calculate percentile (rough estimate)
      const percentile = Math.min(99, Math.round(score * 0.95));
      
      // Display result
      document.getElementById('estimated-gar').textContent = score;
      document.getElementById('gar-percentile').textContent = `${percentile}th`;
      resultDiv.classList.remove('hidden');
      resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

  // ============================================
  // SPORT TABS
  // ============================================
  function initSportTabs() {
    const tabs = document.querySelectorAll('.sport-tab');
    const contents = document.querySelectorAll('.sport-tab-content');
    
    tabs.forEach(tab => {
      tab.addEventListener('click', function() {
        const targetId = this.getAttribute('data-sport-tab');
        
        // Remove active from all tabs
        tabs.forEach(t => t.setAttribute('aria-selected', 'false'));
        
        // Hide all content panels
        contents.forEach(c => c.classList.add('hidden'));
        
        // Activate clicked tab
        this.setAttribute('aria-selected', 'true');
        
        // Show corresponding content
        const targetContent = document.getElementById(targetId);
        if (targetContent) {
          targetContent.classList.remove('hidden');
        }
      });
    });
  }

  // ============================================
  // SHARE BUTTONS
  // ============================================
  function initShareButtons() {
    const shareButtons = document.querySelectorAll('.share-btn');
    
    shareButtons.forEach(btn => {
      btn.addEventListener('click', function() {
        const platform = this.getAttribute('aria-label').toLowerCase();
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(document.title);
        
        let shareUrl = '';
        
        if (platform.includes('twitter')) {
          shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
        } else if (platform.includes('facebook')) {
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        } else if (platform.includes('instagram')) {
          // Instagram doesn't support direct sharing, copy link instead
          navigator.clipboard.writeText(window.location.href);
          alert('Link copied to clipboard! Share on Instagram.');
          return;
        } else if (platform.includes('copy')) {
          navigator.clipboard.writeText(window.location.href);
          alert('Link copied to clipboard!');
          return;
        }
        
        if (shareUrl) {
          window.open(shareUrl, '_blank', 'width=600,height=400');
        }
      });
    });
  }

  // ============================================
  // INIT ALL ON DOM READY
  // ============================================
  function init() {
    initFAQ();
    initScrollAnimations();
    initSmoothScroll();
    initActiveNav();
    captureUTMParams();
    initFormValidation();
    initCTATracking();
    
    // New feature initializations
    initCarousel();
    initCounters();
    initAthleteGrid();
    initGARCalculator();
    initSportTabs();
    initShareButtons();
    
    console.log('Go4it Sports Academy landing page initialized with all features');
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

