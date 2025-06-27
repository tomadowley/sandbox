// Parallax effect for hero background on scroll
const heroBg = document.querySelector('.hero-bg');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  // Parallax: move bg slower than scroll
  if (window.innerWidth > 600) {
    heroBg.style.transform = `translateY(${scrollY * 0.3}px) scale(1.07)`;
  }
});

// Smooth scroll for CTA button if not natively supported
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const hash = this.getAttribute('href');
    const target = document.querySelector(hash);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Scroll-reveal animation using IntersectionObserver
function revealOnScroll() {
  const reveals = document.querySelectorAll('.reveal:not(.revealed)');
  const observer = new window.IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  reveals.forEach(r => observer.observe(r));
}
document.addEventListener('DOMContentLoaded', () => {
  // Add .reveal to all feature cards, gallery images, about text, contact form
  document.querySelectorAll('.feature-card, .gallery-img, .about p, #contact-form').forEach(el => {
    el.classList.add('reveal');
  });
  revealOnScroll();

  // Set current year in footer
  document.getElementById('year').textContent = new Date().getFullYear();
});

// Simple gallery lightbox
const galleryImgs = document.querySelectorAll('.gallery-img');
const lightbox = document.getElementById('lightbox');
const modalImg = document.getElementById('modal-img');
const lightboxClose = document.getElementById('lightbox-close');
galleryImgs.forEach((img, i) => {
  img.addEventListener('click', () => {
    const hiRes = img.getAttribute('data-hires') || img.src;
    modalImg.src = hiRes;
    modalImg.alt = img.alt;
    lightbox.classList.add('active');
    modalImg.focus();
  });
  img.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      img.click();
    }
  });
});
lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', function(e) {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', function(e) {
  if (lightbox.classList.contains('active') && (e.key === 'Escape' || e.key === 'Esc')) {
    closeLightbox();
  }
});
function closeLightbox() {
  lightbox.classList.remove('active');
  modalImg.src = '';
}

// Contact form validation and fake submit
const contactForm = document.getElementById('contact-form');
const thanksModal = document.getElementById('thanks-modal');
const thanksClose = document.getElementById('thanks-close');
contactForm.addEventListener('submit', function(e) {
  e.preventDefault();
  // Simple client-side validation
  let valid = true;
  ['name','email','message'].forEach(field => {
    const input = document.getElementById(field);
    const error = document.getElementById(`${field}-error`);
    if (!input.value.trim()) {
      error.textContent = `Please enter your ${field}.`;
      valid = false;
    } else if (field === 'email' && !/^[^@]+@[^@]+\.[^@]+$/.test(input.value.trim())) {
      error.textContent = 'Please enter a valid email address.';
      valid = false;
    } else {
      error.textContent = '';
    }
  });
  if (!valid) return;
  // Fake successful submit (no backend)
  contactForm.reset();
  thanksModal.classList.add('active');
  thanksClose.focus();
});
thanksClose.addEventListener('click', () => thanksModal.classList.remove('active'));
thanksModal.addEventListener('click', (e) => {
  if (e.target === thanksModal) thanksModal.classList.remove('active');
});
document.addEventListener('keydown', function(e) {
  if (thanksModal.classList.contains('active') && (e.key === 'Escape' || e.key === 'Esc')) {
    thanksModal.classList.remove('active');
  }
});