// ShatziiOS Landing Page JavaScript

document.addEventListener('DOMContentLoaded', () => {
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();

      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80, // Offset for header
          behavior: 'smooth',
        });
      }
    });
  });

  // Form submission handling
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Collect form data
      const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value,
      };

      // Display form submission feedback
      alert('Thank you for your message! We will get back to you soon.');

      // Reset form
      contactForm.reset();

      // In a real implementation, you would send this data to your server
      console.log('Form submission data:', formData);
    });
  }

  // Add animation to stats when they come into view
  const statsSection = document.querySelector('.stats');
  if (statsSection) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.stat-number').forEach((stat) => {
              stat.classList.add('animate-stat');
            });
          }
        });
      },
      { threshold: 0.5 },
    );

    observer.observe(statsSection);
  }

  // Add scroll animation to reveal elements
  const revealElements = document.querySelectorAll('.school-card, .approach-item');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 },
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });

  // Mobile navigation toggle (for responsive design)
  const createMobileNav = () => {
    const header = document.querySelector('header');

    if (header && window.innerWidth <= 576) {
      // Only create mobile nav if it doesn't exist yet
      if (!document.querySelector('.mobile-nav-toggle')) {
        const navToggle = document.createElement('button');
        navToggle.classList.add('mobile-nav-toggle');
        navToggle.innerHTML = '<i class="fas fa-bars"></i>';

        header.querySelector('.container').appendChild(navToggle);

        navToggle.addEventListener('click', () => {
          const nav = header.querySelector('nav ul');
          nav.classList.toggle('show');

          // Change icon based on state
          if (nav.classList.contains('show')) {
            navToggle.innerHTML = '<i class="fas fa-times"></i>';
          } else {
            navToggle.innerHTML = '<i class="fas fa-bars"></i>';
          }
        });
      }
    }
  };

  // Check window size on load and resize
  createMobileNav();
  window.addEventListener('resize', createMobileNav);

  // Add hover effects to school cards (only if they exist)
  const schoolCards = document.querySelectorAll('.school-card');
  if (schoolCards.length > 0) {
    schoolCards.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        const schoolIcon = card.querySelector('.school-icon');
        if (schoolIcon) {
          schoolIcon.classList.add('pulse');
        }
      });

      card.addEventListener('mouseleave', () => {
        const schoolIcon = card.querySelector('.school-icon');
        if (schoolIcon) {
          schoolIcon.classList.remove('pulse');
        }
      });
    });
  }
});
