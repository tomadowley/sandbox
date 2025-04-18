// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Navigation functionality
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');
    const header = document.querySelector('header');

    // Toggle navigation menu
    burger.addEventListener('click', () => {
        nav.classList.toggle('active');
        
        // Animate links
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `fadeIn 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });
        
        // Burger animation
        burger.classList.toggle('toggle');
    });

    // Close mobile menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('active')) {
                nav.classList.remove('active');
                burger.classList.remove('toggle');
                
                navLinks.forEach(link => {
                    link.style.animation = '';
                });
            }
        });
    });

    // Add scroll effect to header
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Testimonial Slider
    const testimonials = document.querySelectorAll('.testimonial');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    let currentTestimonial = 0;

    // Hide all testimonials except the first one
    function hideAllTestimonials() {
        testimonials.forEach(testimonial => {
            testimonial.style.display = 'none';
        });
    }

    function showTestimonial(index) {
        hideAllTestimonials();
        testimonials[index].style.display = 'block';
        testimonials[index].classList.add('fadeIn');
    }

    // Initialize the slider
    hideAllTestimonials();
    showTestimonial(currentTestimonial);

    // Event listeners for slider controls
    prevBtn.addEventListener('click', () => {
        currentTestimonial--;
        if (currentTestimonial < 0) {
            currentTestimonial = testimonials.length - 1;
        }
        showTestimonial(currentTestimonial);
    });

    nextBtn.addEventListener('click', () => {
        currentTestimonial++;
        if (currentTestimonial >= testimonials.length) {
            currentTestimonial = 0;
        }
        showTestimonial(currentTestimonial);
    });

    // Auto-rotate testimonials every 6 seconds
    setInterval(() => {
        currentTestimonial++;
        if (currentTestimonial >= testimonials.length) {
            currentTestimonial = 0;
        }
        showTestimonial(currentTestimonial);
    }, 6000);

    // Form submission handling
    const contactForm = document.getElementById('inquiry-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const message = document.getElementById('message').value;
            
            // Here you would normally send the data to a server
            // For demonstration, we'll just log it and show a success message
            console.log('Form submitted:', { name, email, phone, message });
            
            // Reset form
            contactForm.reset();
            
            // Show success message
            alert('Thank you for your inquiry. Our team will contact you shortly to arrange a consultation.');
        });
    }

    // Animation on scroll
    // Check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Elements to animate
    const animElements = document.querySelectorAll('.about-content, .product-showcase, .design-grid, .design-item, .contact-content');
    
    // Add animation class when element is in viewport
    function checkAnimations() {
        animElements.forEach(element => {
            if (isInViewport(element) && !element.classList.contains('fadeIn')) {
                element.classList.add('fadeIn');
            }
        });
    }

    // Check animations on scroll
    window.addEventListener('scroll', checkAnimations);
    
    // Initial check
    checkAnimations();
});

// Add burger menu toggle animation
document.querySelector('.burger').addEventListener('click', function() {
    this.classList.toggle('toggle');
});

// Add class for burger menu animation
const burgerMenu = document.querySelector('.burger');
burgerMenu.classList.add('burger-transition');

// Add additional styles for burger menu toggle animation
document.head.insertAdjacentHTML('beforeend', `
    <style>
        .burger-transition div {
            transition: all 0.3s ease;
        }
        .burger.toggle .line1 {
            transform: rotate(-45deg) translate(-5px, 6px);
        }
        .burger.toggle .line2 {
            opacity: 0;
        }
        .burger.toggle .line3 {
            transform: rotate(45deg) translate(-5px, -6px);
        }
    </style>
`);