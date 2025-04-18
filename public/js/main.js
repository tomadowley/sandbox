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
            alert('Far out, man! Thanks for your groovy inquiry. Our team will reach out to arrange a consultation soon!');
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

    // Create 60s-style psychedelic background animation in the hero section
    const hero = document.querySelector('.hero');
    
    // Create and add 60s-style decorative elements
    function createPsychedelicElements() {
        // Only add these effects if not on mobile
        if (window.innerWidth > 768) {
            // Add floating bubbles in various sections
            const sections = [document.querySelector('.about'), document.querySelector('.design')];
            
            sections.forEach(section => {
                if (!section) return;
                
                for (let i = 0; i < 5; i++) {
                    const bubble = document.createElement('div');
                    bubble.classList.add('psychedelic-circle');
                    bubble.style.width = `${Math.random() * 150 + 50}px`;
                    bubble.style.height = bubble.style.width;
                    bubble.style.left = `${Math.random() * 100}%`;
                    bubble.style.top = `${Math.random() * 100}%`;
                    bubble.style.opacity = `${Math.random() * 0.07 + 0.03}`;
                    bubble.style.animationDuration = `${Math.random() * 40 + 20}s`;
                    bubble.style.animationDelay = `${Math.random() * 5}s`;
                    
                    section.appendChild(bubble);
                }
            });
        }
    }
    
    createPsychedelicElements();
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
        
        /* Additional 60s-inspired effects */
        @keyframes wave {
            0%, 100% {
                transform: translateY(0);
            }
            50% {
                transform: translateY(-15px);
            }
        }
        
        /* Add psychedelic text effect to headings */
        h1, h2 {
            position: relative;
        }
        
        h1::before, h2::before {
            content: attr(data-text);
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            color: transparent;
            opacity: 0.1;
            mix-blend-mode: difference;
        }
    </style>
`);

// Add cool 60s hover effects to design items
const designItems = document.querySelectorAll('.design-item');
designItems.forEach(item => {
    item.addEventListener('mouseover', function() {
        this.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        
        // Random rotation between -5 and 5 degrees for a groovy effect
        const randomRotation = Math.random() * 10 - 5;
        this.style.transform = `translateY(-15px) rotate(${randomRotation}deg)`;
    });
    
    item.addEventListener('mouseout', function() {
        this.style.transform = 'translateY(0) rotate(0)';
    });
});

// Add trippy color-changing effect to the circular chair image
const chairImage = document.querySelector('.circular');
if (chairImage) {
    chairImage.style.transition = 'all 0.5s ease';
    chairImage.addEventListener('mouseover', function() {
        this.style.boxShadow = `
            0 20px 50px rgba(0, 0, 0, 0.3),
            0 0 0 15px rgba(241, 90, 36, 0.2),
            0 0 0 30px rgba(1, 163, 164, 0.1),
            0 0 0 45px rgba(134, 73, 151, 0.05)
        `;
    });
    
    chairImage.addEventListener('mouseout', function() {
        this.style.boxShadow = `
            0 20px 50px rgba(0, 0, 0, 0.3),
            0 0 0 15px rgba(241, 90, 36, 0.1),
            0 0 0 30px rgba(1, 163, 164, 0.05)
        `;
    });
}