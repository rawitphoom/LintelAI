/* ============================================
   LINTELAI WEBSITE - JAVASCRIPT
   ============================================ */

// FAQ Toggle
document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
        const faqItem = button.parentElement;
        const isActive = faqItem.classList.contains('active');
        
        // Close all FAQ items
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Open clicked item if it wasn't already open
        if (!isActive) {
            faqItem.classList.add('active');
        }
    });
});

// Navbar scroll effect - disabled for transparent nav
// window.addEventListener('scroll', () => {
//     const nav = document.querySelector('.nav');
//     if (window.scrollY > 50) {
//         nav.style.background = 'rgba(6, 18, 81, 0.9)';
//         nav.style.backdropFilter = 'blur(10px)';
//     } else {
//         nav.style.background = 'transparent';
//         nav.style.backdropFilter = 'none';
//     }
// });

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Simple fade-in animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply to all sections
document.querySelectorAll('.section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// Glass card hover effect
document.querySelectorAll('.glass-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-8px)';
        card.style.boxShadow = '0 20px 40px rgba(0, 57, 134, 0.15)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = 'none';
    });
});

// ============================================
// DASHBOARD CAROUSEL - INFINITE LOOP WITH PEEK
// ============================================
const carouselTrack = document.querySelector('.carousel-track');
const originalSlides = document.querySelectorAll('.carousel-slide');
const prevBtn = document.querySelector('.carousel-prev');
const nextBtn = document.querySelector('.carousel-next');

if (carouselTrack && originalSlides.length > 0) {
    const totalOriginal = originalSlides.length;
    let currentIndex = 1; // Start at first real slide (after 1 clone)
    let isTransitioning = false;
    
    // Clone last slide and prepend (for left peek)
    const lastClone = originalSlides[totalOriginal - 1].cloneNode(true);
    lastClone.classList.add('clone');
    carouselTrack.insertBefore(lastClone, carouselTrack.firstChild);
    
    // Clone first slide and append (for right peek)
    const firstClone = originalSlides[0].cloneNode(true);
    firstClone.classList.add('clone');
    carouselTrack.appendChild(firstClone);
    
    // Get all slides including clones
    const allSlides = document.querySelectorAll('.carousel-slide');
    const totalSlides = allSlides.length; // original + 2 clones
    
    function updateCarousel(animate = true) {
        const slideWidth = 57; // percentage including gap (55% + gap)
        const offset = 22.5 - (currentIndex * slideWidth); // Center offset: (100 - 55) / 2 = 22.5
        
        if (animate) {
            carouselTrack.style.transition = 'transform 0.5s ease-in-out';
        } else {
            carouselTrack.style.transition = 'none';
        }
        
        carouselTrack.style.transform = `translateX(${offset}%)`;
        
        // Update active states
        allSlides.forEach((slide, index) => {
            slide.classList.remove('active');
            if (index === currentIndex) {
                slide.classList.add('active');
            }
        });
    }
    
    function handleTransitionEnd() {
        // Seamless jump when on clones
        if (currentIndex === 0 || currentIndex === totalSlides - 1) {
            // Disable ALL transitions temporarily
            carouselTrack.style.transition = 'none';
            allSlides.forEach(slide => {
                slide.style.transition = 'none';
            });
            
            // Calculate new index
            if (currentIndex === 0) {
                currentIndex = totalSlides - 2; // Jump to real Legal
            } else {
                currentIndex = 1; // Jump to real Dashboard
            }
            
            // Update position
            const slideWidth = 57;
            const offset = 22.5 - (currentIndex * slideWidth);
            carouselTrack.style.transform = `translateX(${offset}%)`;
            
            // Update active states
            allSlides.forEach((slide, index) => {
                slide.classList.remove('active');
                if (index === currentIndex) {
                    slide.classList.add('active');
                }
            });
            
            // Force reflow
            carouselTrack.offsetHeight;
            
            // Re-enable transitions after a frame
            requestAnimationFrame(() => {
                allSlides.forEach(slide => {
                    slide.style.transition = '';
                });
                carouselTrack.style.transition = '';
                isTransitioning = false;
            });
        } else {
            isTransitioning = false;
        }
    }
    
    function nextSlide() {
        if (isTransitioning) return;
        isTransitioning = true;
        currentIndex++;
        updateCarousel(true);
    }
    
    function prevSlide() {
        if (isTransitioning) return;
        isTransitioning = true;
        currentIndex--;
        updateCarousel(true);
    }
    
    // Event listeners
    carouselTrack.addEventListener('transitionend', handleTransitionEnd);
    
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });
    
    // Initialize
    updateCarousel(false);
}