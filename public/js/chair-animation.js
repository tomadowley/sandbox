// Bowl Chair Animation and Interaction Scripts
document.addEventListener('DOMContentLoaded', function() {
    // Chair 3D rotation controls
    const chair3D = document.querySelector('.chair-3d');
    const pauseBtn = document.getElementById('view-pause');
    const playBtn = document.getElementById('view-play');
    
    if (chair3D) {
        let isRotating = true;
        
        // Pause rotation
        pauseBtn.addEventListener('click', function() {
            chair3D.style.animationPlayState = 'paused';
            isRotating = false;
        });
        
        // Resume rotation
        playBtn.addEventListener('click', function() {
            chair3D.style.animationPlayState = 'running';
            isRotating = true;
        });
        
        // Manual rotation with mouse drag
        let isDragging = false;
        let previousMousePosition = 0;
        let chairRotation = 0;
        
        chair3D.addEventListener('mousedown', function(e) {
            isDragging = true;
            previousMousePosition = e.clientX;
            
            // Pause the animation while dragging
            if (isRotating) {
                chair3D.style.animationPlayState = 'paused';
                
                // Get computed rotation
                const computedStyle = window.getComputedStyle(chair3D);
                const transform = computedStyle.getPropertyValue('transform');
                if (transform !== 'none') {
                    const values = transform.split('(')[1].split(')')[0].split(',');
                    const a = values[0];
                    const b = values[1];
                    chairRotation = Math.round(Math.atan2(b, a) * (180/Math.PI));
                }
            }
        });
        
        document.addEventListener('mousemove', function(e) {
            if (isDragging) {
                const currentPosition = e.clientX;
                const diff = currentPosition - previousMousePosition;
                previousMousePosition = currentPosition;
                
                chairRotation += diff / 2;
                chair3D.style.transform = `rotateY(${chairRotation}deg)`;
            }
        });
        
        document.addEventListener('mouseup', function() {
            isDragging = false;
            
            // Resume the animation if it was playing before
            if (isRotating) {
                chair3D.style.animation = 'none';
                chair3D.offsetHeight; // Trigger reflow
                chair3D.style.animation = 'chair-rotate 30s infinite linear';
            }
        });
    }
    
    // Material swatches interaction
    const materialSwatches = document.querySelectorAll('.material-swatch');
    const chairBase = document.querySelector('.chair-base');
    const chairBack = document.querySelector('.chair-back');
    const chairSeat = document.querySelector('.chair-seat');
    
    materialSwatches.forEach(swatch => {
        swatch.addEventListener('click', function() {
            // Remove active class from all swatches
            materialSwatches.forEach(s => s.classList.remove('active'));
            
            // Add active class to clicked swatch
            this.classList.add('active');
            
            // Get material type
            const material = this.getAttribute('data-material');
            
            // Update chair colors based on material
            if (chairBase && chairBack && chairSeat) {
                switch(material) {
                    case 'velvet':
                        chairBase.style.background = 'linear-gradient(135deg, #ff5400, #ff00aa, #04d9ff, #7e00ff)';
                        chairBack.style.background = 'linear-gradient(135deg, #ff00aa, #04d9ff)';
                        chairSeat.style.background = 'linear-gradient(135deg, #04d9ff, #ffcb00)';
                        break;
                    case 'leather':
                        chairBase.style.background = 'linear-gradient(135deg, #7a3b00, #351d00)';
                        chairBack.style.background = 'linear-gradient(135deg, #5a2a00, #3e2200)';
                        chairSeat.style.background = 'linear-gradient(135deg, #4c2100, #2d1600)';
                        break;
                    case 'wool':
                        chairBase.style.background = 'linear-gradient(135deg, #04d9ff, #0487c2)';
                        chairBack.style.background = 'linear-gradient(135deg, #03b2d4, #0371a3)';
                        chairSeat.style.background = 'linear-gradient(135deg, #025e85, #0295c0)';
                        break;
                    case 'psychedelic':
                        chairBase.style.background = 'linear-gradient(135deg, #ffcb00, #7e00ff, #04d9ff, #ff5400)';
                        chairBase.style.backgroundSize = '400% 400%';
                        chairBase.style.animation = 'gradient-shift 5s infinite linear';
                        
                        chairBack.style.background = 'linear-gradient(135deg, #ff5400, #7e00ff)';
                        chairBack.style.backgroundSize = '400% 400%';
                        chairBack.style.animation = 'gradient-shift 6s infinite linear reverse';
                        
                        chairSeat.style.background = 'linear-gradient(135deg, #04d9ff, #ff00aa)';
                        chairSeat.style.backgroundSize = '400% 400%';
                        chairSeat.style.animation = 'gradient-shift 4s infinite linear';
                        break;
                }
            }
            
            // Update SVG chair colors if present
            const svgChair = document.querySelector('.bowl-chair-svg');
            if (svgChair) {
                const chairGradient = document.getElementById('chair-gradient');
                const pillowGradient = document.getElementById('pillow-gradient');
                const rimGradient = document.getElementById('rim-gradient');
                
                if (chairGradient && pillowGradient && rimGradient) {
                    // Clear existing gradient stops
                    while (chairGradient.firstChild) {
                        chairGradient.removeChild(chairGradient.firstChild);
                    }
                    while (pillowGradient.firstChild) {
                        pillowGradient.removeChild(pillowGradient.firstChild);
                    }
                    while (rimGradient.firstChild) {
                        rimGradient.removeChild(rimGradient.firstChild);
                    }
                    
                    // Add new gradient stops based on material
                    switch(material) {
                        case 'velvet':
                            // Create chair gradient stops
                            let stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
                            stop1.setAttribute("offset", "0%");
                            stop1.setAttribute("stop-color", "#ff5400");
                            chairGradient.appendChild(stop1);
                            
                            let stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
                            stop2.setAttribute("offset", "50%");
                            stop2.setAttribute("stop-color", "#ff00aa");
                            chairGradient.appendChild(stop2);
                            
                            let stop3 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
                            stop3.setAttribute("offset", "100%");
                            stop3.setAttribute("stop-color", "#04d9ff");
                            chairGradient.appendChild(stop3);
                            
                            // Create pillow gradient
                            let pstop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
                            pstop1.setAttribute("offset", "0%");
                            pstop1.setAttribute("stop-color", "#04d9ff");
                            pillowGradient.appendChild(pstop1);
                            
                            let pstop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
                            pstop2.setAttribute("offset", "100%");
                            pstop2.setAttribute("stop-color", "#7e00ff");
                            pillowGradient.appendChild(pstop2);
                            
                            // Create rim gradient
                            let rstop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
                            rstop1.setAttribute("offset", "0%");
                            rstop1.setAttribute("stop-color", "#ffcb00");
                            rimGradient.appendChild(rstop1);
                            
                            let rstop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
                            rstop2.setAttribute("offset", "100%");
                            rstop2.setAttribute("stop-color", "#ff5400");
                            rimGradient.appendChild(rstop2);
                            break;
                            
                        case 'leather':
                            // Create chair gradient stops for leather
                            let lstop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
                            lstop1.setAttribute("offset", "0%");
                            lstop1.setAttribute("stop-color", "#7a3b00");
                            chairGradient.appendChild(lstop1);
                            
                            let lstop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
                            lstop2.setAttribute("offset", "100%");
                            lstop2.setAttribute("stop-color", "#351d00");
                            chairGradient.appendChild(lstop2);
                            
                            // Create pillow gradient for leather
                            let lpstop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
                            lpstop1.setAttribute("offset", "0%");
                            lpstop1.setAttribute("stop-color", "#5a2a00");
                            pillowGradient.appendChild(lpstop1);
                            
                            let lpstop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
                            lpstop2.setAttribute("offset", "100%");
                            lpstop2.setAttribute("stop-color", "#3e2200");
                            pillowGradient.appendChild(lpstop2);
                            
                            // Create rim gradient for leather
                            let lrstop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
                            lrstop1.setAttribute("offset", "0%");
                            lrstop1.setAttribute("stop-color", "#7a3b00");
                            rimGradient.appendChild(lrstop1);
                            
                            let lrstop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
                            lrstop2.setAttribute("offset", "100%");
                            lrstop2.setAttribute("stop-color", "#4c2100");
                            rimGradient.appendChild(lrstop2);
                            break;
                            
                        case 'wool':
                            // Create chair gradient stops for wool
                            let wstop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
                            wstop1.setAttribute("offset", "0%");
                            wstop1.setAttribute("stop-color", "#04d9ff");
                            chairGradient.appendChild(wstop1);
                            
                            let wstop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
                            wstop2.setAttribute("offset", "100%");
                            wstop2.setAttribute("stop-color", "#0487c2");
                            chairGradient.appendChild(wstop2);
                            
                            // Create pillow gradient for wool
                            let wpstop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
                            wpstop1.setAttribute("offset", "0%");
                            wpstop1.setAttribute("stop-color", "#03b2d4");
                            pillowGradient.appendChild(wpstop1);
                            
                            let wpstop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
                            wpstop2.setAttribute("offset", "100%");
                            wpstop2.setAttribute("stop-color", "#0371a3");
                            pillowGradient.appendChild(wpstop2);
                            
                            // Create rim gradient for wool
                            let wrstop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
                            wrstop1.setAttribute("offset", "0%");
                            wrstop1.setAttribute("stop-color", "#025e85");
                            rimGradient.appendChild(wrstop1);
                            
                            let wrstop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
                            wrstop2.setAttribute("offset", "100%");
                            wrstop2.setAttribute("stop-color", "#0295c0");
                            rimGradient.appendChild(wrstop2);
                            break;
                            
                        case 'psychedelic':
                            // Create chair gradient stops for psychedelic
                            let psstop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
                            psstop1.setAttribute("offset", "0%");
                            psstop1.setAttribute("stop-color", "#ffcb00");
                            chairGradient.appendChild(psstop1);
                            
                            let psstop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
                            psstop2.setAttribute("offset", "33%");
                            psstop2.setAttribute("stop-color", "#7e00ff");
                            chairGradient.appendChild(psstop2);
                            
                            let psstop3 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
                            psstop3.setAttribute("offset", "66%");
                            psstop3.setAttribute("stop-color", "#04d9ff");
                            chairGradient.appendChild(psstop3);
                            
                            let psstop4 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
                            psstop4.setAttribute("offset", "100%");
                            psstop4.setAttribute("stop-color", "#ff5400");
                            chairGradient.appendChild(psstop4);
                            
                            // Create pillow gradient for psychedelic
                            let ppstop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
                            ppstop1.setAttribute("offset", "0%");
                            ppstop1.setAttribute("stop-color", "#ff5400");
                            pillowGradient.appendChild(ppstop1);
                            
                            let ppstop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
                            ppstop2.setAttribute("offset", "50%");
                            ppstop2.setAttribute("stop-color", "#7e00ff");
                            pillowGradient.appendChild(ppstop2);
                            
                            let ppstop3 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
                            ppstop3.setAttribute("offset", "100%");
                            ppstop3.setAttribute("stop-color", "#04d9ff");
                            pillowGradient.appendChild(ppstop3);
                            
                            // Create rim gradient for psychedelic
                            let prstop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
                            prstop1.setAttribute("offset", "0%");
                            prstop1.setAttribute("stop-color", "#04d9ff");
                            rimGradient.appendChild(prstop1);
                            
                            let prstop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
                            prstop2.setAttribute("offset", "50%");
                            prstop2.setAttribute("stop-color", "#ff00aa");
                            rimGradient.appendChild(prstop2);
                            
                            let prstop3 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
                            prstop3.setAttribute("offset", "100%");
                            prstop3.setAttribute("stop-color", "#ffcb00");
                            rimGradient.appendChild(prstop3);
                            
                            // Add animation to SVG chair for psychedelic material
                            svgChair.classList.add('chair-color-shift');
                            break;
                    }
                    
                    // Remove animation for non-psychedelic materials
                    if (material !== 'psychedelic') {
                        svgChair.classList.remove('chair-color-shift');
                    }
                }
            }
        });
    });

    // Add interactive shadow effect to chairs
    const chairElements = document.querySelectorAll('.chair-3d, .chair-cutaway, .bowl-chair-svg');
    
    chairElements.forEach(chair => {
        chair.addEventListener('mousemove', function(e) {
            const bounds = this.getBoundingClientRect();
            const mouseX = e.clientX - bounds.left;
            const mouseY = e.clientY - bounds.top;
            
            const centerX = bounds.width / 2;
            const centerY = bounds.height / 2;
            
            const deltaX = (mouseX - centerX) / 20;
            const deltaY = (mouseY - centerY) / 20;
            
            // Apply shadow based on mouse position
            if (this.classList.contains('chair-3d')) {
                const chairBase = this.querySelector('.chair-base');
                if (chairBase) {
                    chairBase.style.boxShadow = `
                        ${-deltaX}px ${-deltaY}px 50px rgba(0, 0, 0, 0.3),
                        0 0 0 15px rgba(255, 84, 0, 0.2),
                        0 0 30px rgba(255, 0, 170, 0.4),
                        0 0 60px rgba(4, 217, 255, 0.3)
                    `;
                }
            } else if (this.classList.contains('chair-cutaway')) {
                this.style.transform = `rotateX(${deltaY}deg) rotateY(${deltaX}deg)`;
            } else if (this.classList.contains('bowl-chair-svg')) {
                this.style.filter = `drop-shadow(${-deltaX}px ${-deltaY}px 15px rgba(0,0,0,0.3))`;
            }
        });
        
        chair.addEventListener('mouseleave', function() {
            // Reset shadow on mouse leave
            if (this.classList.contains('chair-3d')) {
                const chairBase = this.querySelector('.chair-base');
                if (chairBase) {
                    chairBase.style.boxShadow = `
                        0 20px 50px rgba(0, 0, 0, 0.3),
                        0 0 0 15px rgba(255, 84, 0, 0.2),
                        0 0 30px rgba(255, 0, 170, 0.4),
                        0 0 60px rgba(4, 217, 255, 0.3)
                    `;
                }
            } else if (this.classList.contains('chair-cutaway')) {
                this.style.transform = 'rotateX(0deg) rotateY(0deg)';
            } else if (this.classList.contains('bowl-chair-svg')) {
                this.style.filter = 'none';
            }
        });
    });
    
    // Create animated pattern on chairs
    function createChairPattern() {
        const chairs = document.querySelectorAll('.chair-pattern');
        
        chairs.forEach(chair => {
            // Create animated dots
            for (let i = 0; i < 15; i++) {
                const dot = document.createElement('div');
                const size = Math.random() * 10 + 5;
                
                dot.style.position = 'absolute';
                dot.style.width = `${size}px`;
                dot.style.height = `${size}px`;
                dot.style.borderRadius = '50%';
                dot.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                dot.style.left = `${Math.random() * 100}%`;
                dot.style.top = `${Math.random() * 100}%`;
                dot.style.animation = `float ${Math.random() * 5 + 5}s infinite alternate ease-in-out`;
                dot.style.animationDelay = `${Math.random() * 2}s`;
                
                chair.appendChild(dot);
            }
        });
    }
    
    createChairPattern();
    
    // Create visual hover effect for the chair image
    const chairImage = document.querySelector('.circular');
    if (chairImage) {
        chairImage.addEventListener('mouseover', function() {
            this.style.transform = 'translateY(-20px) scale(1.05)';
            this.style.boxShadow = `
                0 30px 60px rgba(0, 0, 0, 0.4),
                0 0 0 25px rgba(255, 84, 0, 0.3),
                0 0 50px rgba(255, 0, 170, 0.6),
                0 0 80px rgba(4, 217, 255, 0.5)
            `;
        });
        
        chairImage.addEventListener('mouseout', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    }
});

// Animate gradient for psychedelic option
const gradientElements = document.querySelectorAll('.chair-color-shift');
let hue = 0;

function animateGradients() {
    hue = (hue + 0.5) % 360;
    
    gradientElements.forEach(element => {
        if (element.style.filter) {
            element.style.filter = `hue-rotate(${hue}deg)`;
        }
    });
    
    requestAnimationFrame(animateGradients);
}

animateGradients();