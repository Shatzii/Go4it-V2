document.addEventListener('DOMContentLoaded', function () {
  // Add smooth scrolling for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();

      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80, // Account for fixed header
          behavior: 'smooth',
        });
      }
    });
  });

  // Add fixed header class on scroll
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Status badge animation
  const statusBadges = document.querySelectorAll('.status-badge');
  statusBadges.forEach((badge) => {
    badge.style.opacity = '0';
    setTimeout(() => {
      badge.style.transition = 'opacity 0.5s ease';
      badge.style.opacity = '1';
    }, 500);
  });

  // Add hover effects to school cards
  const schoolCards = document.querySelectorAll('.school-card');
  schoolCards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-10px)';
      card.style.boxShadow = 'var(--shadow-lg)';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
      card.style.boxShadow = 'var(--shadow-md)';
    });
  });
});
