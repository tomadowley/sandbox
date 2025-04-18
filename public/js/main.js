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
                link.style.animation = `fadeIn 0.5s cubic-bezier(0.23, 1, 0.32, 1) forwards ${index / 7 + 0.3}s`;
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
            
            // Show success message with psychedelic styling
            const successMsg = document.createElement('div');
            successMsg.style.position = 'fixed';
            successMsg.style.top = '50%';
            successMsg.style.left = '50%';
            successMsg.style.transform = 'translate(-50%, -50%)';
            successMsg.style.background = 'linear-gradient(45deg, #ff5400, #ff00aa, #04d9ff, #7e00ff)';
            successMsg.style.backgroundSize = '400% 400%';
            successMsg.style.animation = 'psychedelic 5s infinite';
            successMsg.style.color = 'white';
            successMsg.style.padding = '2rem';
            successMsg.style.borderRadius = '20px';
            successMsg.style.boxShadow = '0 0 30px rgba(255, 84, 0, 0.5)';
            successMsg.style.fontSize = '1.5rem';
            successMsg.style.textAlign = 'center';
            successMsg.style.zIndex = '10000';
            successMsg.style.maxWidth = '90%';
            successMsg.style.fontWeight = 'bold';
            successMsg.style.textTransform = 'uppercase';
            successMsg.innerHTML = 'Far out! Your cosmic message has been sent to our dimension. We\'ll beam back to you soon!';
            
            document.body.appendChild(successMsg);
            
            // Remove the message after 5 seconds
            setTimeout(() => {
                successMsg.style.opacity = '0';
                successMsg.style.transition = 'opacity 1s ease';
                setTimeout(() => {
                    document.body.removeChild(successMsg);
                }, 1000);
            }, 5000);
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
    const animElements = document.querySelectorAll('.about-content, .product-showcase, .design-grid, .design-item, .contact-content, h1, h2, h3, .btn');
    
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

    // Create cursor trail effect
    function createCursorTrail() {
        const numTrails = 10;
        const trails = [];
        
        // Create trail elements
        for (let i = 0; i < numTrails; i++) {
            const trail = document.createElement('div');
            trail.classList.add('cursor-trail');
            document.body.appendChild(trail);
            trails.push(trail);
        }
        
        // Position variables
        let mouseX = 0, mouseY = 0;
        let trailX = Array(numTrails).fill(0);
        let trailY = Array(numTrails).fill(0);
        
        // Update mouse position
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Show trails when mouse is moving
            trails.forEach(trail => {
                trail.style.opacity = '1';
            });
        });
        
        // Animation loop for smooth trail following
        function animateTrails() {
            // Update each trail position with delay
            for (let i = 0; i < numTrails; i++) {
                // Follow with delay (each trail follows the previous one)
                trailX[i] = i === 0 ? mouseX : trailX[i-1];
                trailY[i] = i === 0 ? mouseY : trailY[i-1];
                
                // Set position
                trails[i].style.left = trailX[i] + 'px';
                trails[i].style.top = trailY[i] + 'px';
                
                // Set size and color based on position in trail
                const size = 20 - i * 1.5;
                trails[i].style.width = size + 'px';
                trails[i].style.height = size + 'px';
                
                // Color based on position
                const hue = (Date.now() / 20 + i * 15) % 360;
                trails[i].style.background = `hsla(${hue}, 100%, 60%, ${1 - i/numTrails})`;
            }
            
            requestAnimationFrame(animateTrails);
        }
        
        // Start animation
        animateTrails();
        
        // Hide trails when mouse is not moving
        let timeout;
        document.addEventListener('mousemove', () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                trails.forEach(trail => {
                    trail.style.opacity = '0';
                });
            }, 500);
        });
    }
    
    // Initialize cursor trail on devices with hover capability
    if (window.matchMedia("(hover: hover)").matches) {
        createCursorTrail();
    }
    
    // Create psychedelic hover effects for elements
    const hoverElements = document.querySelectorAll('.design-item, .circular, .btn');
    
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            
            if (this.classList.contains('design-item')) {
                // Random rotation between -5 and 5 degrees for a groovy effect
                const randomRotationX = Math.random() * 10 - 5;
                const randomRotationY = Math.random() * 10 - 5;
                const randomScale = 1 + Math.random() * 0.1;
                this.style.transform = `translateY(-20px) rotateX(${randomRotationX}deg) rotateY(${randomRotationY}deg) scale(${randomScale})`;
            }
        });
        
        element.addEventListener('mouseleave', function() {
            if (this.classList.contains('design-item')) {
                this.style.transform = 'translateY(0) rotateX(0) rotateY(0) scale(1)';
            }
        });
    });
    
    // Psychedelic background color shift
    const psychedelicBg = document.querySelector('.psychedelic-background');
    
    if (psychedelicBg) {
        let hue = 0;
        
        function animateBg() {
            hue = (hue + 0.1) % 360;
            psychedelicBg.style.filter = `hue-rotate(${hue}deg)`;
            requestAnimationFrame(animateBg);
        }
        
        animateBg();
    }
    
    // Interactive title animation
    const mainTitle = document.querySelector('.hero h1');
    
    if (mainTitle) {
        mainTitle.addEventListener('mouseover', function() {
            this.style.transform = 'skew(-10deg) rotate(-2deg) scale(1.1)';
            this.style.textShadow = `
                0 0 20px rgba(255, 84, 0, 0.8),
                0 0 30px rgba(255, 0, 170, 0.6),
                0 0 40px rgba(4, 217, 255, 0.4),
                0 0 50px rgba(126, 0, 255, 0.3)
            `;
            this.style.transition = 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        });
        
        mainTitle.addEventListener('mouseout', function() {
            this.style.transform = 'skew(-5deg) rotate(-1deg)';
            this.style.textShadow = `
                0 0 10px rgba(255, 84, 0, 0.8),
                0 0 20px rgba(255, 0, 170, 0.5),
                0 0 30px rgba(4, 217, 255, 0.3)
            `;
        });
    }
    
    // Audio visualization animation for chair
    const chairElement = document.querySelector('.circular');
    
    if (chairElement) {
        function pulseChair() {
            const scale = 1 + Math.sin(Date.now() / 1000) * 0.03;
            const hueRotate = Math.sin(Date.now() / 1500) * 15;
            chairElement.style.transform = `scale(${scale})`;
            chairElement.style.filter = `hue-rotate(${hueRotate}deg)`;
            requestAnimationFrame(pulseChair);
        }
        
        pulseChair();
    }
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
        @keyframes psychedelic {
            0% {
                background-position: 0% 50%;
                filter: hue-rotate(0deg);
            }
            50% {
                background-position: 100% 50%;
                filter: hue-rotate(180deg);
            }
            100% {
                background-position: 0% 50%;
                filter: hue-rotate(360deg);
            }
        }
        
        .burger-transition div {
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .burger.toggle .line1 {
            transform: rotate(-45deg) translate(-5px, 6px);
            background: linear-gradient(90deg, #04d9ff, #ff00aa);
        }
        .burger.toggle .line2 {
            opacity: 0;
        }
        .burger.toggle .line3 {
            transform: rotate(45deg) translate(-5px, -6px);
            background: linear-gradient(90deg, #ff00aa, #ffcb00);
        }
        
        /* 3D hover effect for buttons */
        .btn {
            transform-style: preserve-3d;
            perspective: 1000px;
        }
        
        .btn:hover {
            transform: translateY(-7px) rotateX(10deg) scale(1.05);
        }
        
        /* Make headers wiggle slightly */
        h1, h2, h3 {
            display: inline-block;
            animation: wiggle 8s ease-in-out infinite;
        }
        
        /* Make circular elements pulse */
        .circular::after {
            animation: pulse 3s infinite alternate;
        }
        
        @keyframes pulse {
            0% {
                opacity: 0.7;
                transform: translate(-50%, -50%) scale(0.9);
            }
            100% {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1.1);
            }
        }
        
        /* Floating animation for bubbles */
        .bubble {
            animation: float 20s infinite alternate ease-in-out;
        }
        
        /* Create liquid bubble effect */
        .bubble::after {
            content: '';
            position: absolute;
            top: 10%;
            left: 10%;
            width: 80%;
            height: 80%;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.1);
            filter: blur(5px);
        }
    </style>
`);

// Create psychedelic page transitions
window.addEventListener('beforeunload', function() {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = '#ff5400';
    overlay.style.zIndex = '10000';
    overlay.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
    overlay.style.transform = 'scale(0)';
    overlay.style.borderRadius = '50%';
    
    document.body.appendChild(overlay);
    
    setTimeout(() => {
        overlay.style.transform = 'scale(1)';
    }, 10);
});

// Simulated audio visualization for the hero section
function createAudioVisualization() {
    const heroBg = document.querySelector('.hero-background');
    if (!heroBg) return;
    
    const numBars = 5;
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.bottom = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '50px';
    container.style.display = 'flex';
    container.style.justifyContent = 'space-around';
    container.style.alignItems = 'flex-end';
    container.style.padding = '0 20%';
    container.style.zIndex = '0';
    container.style.opacity = '0.5';
    
    // Create individual bars
    for (let i = 0; i < numBars; i++) {
        const bar = document.createElement('div');
        bar.style.width = '20px';
        bar.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
        bar.style.borderRadius = '10px 10px 0 0';
        container.appendChild(bar);
        
        // Animate each bar height
        function animateBar() {
            const height = 10 + Math.random() * 40;
            bar.style.height = `${height}px`;
            const delay = 100 + Math.random() * 200;
            setTimeout(animateBar, delay);
        }
        
        animateBar();
    }
    
    heroBg.appendChild(container);
}

createAudioVisualization();