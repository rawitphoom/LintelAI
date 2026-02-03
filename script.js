/* ============================================
   LINTELAI WEBSITE - JAVASCRIPT
   ============================================ */

// ============================================
// INTRO OVERLAY (plays on every page load)
// ============================================

window.addEventListener("load", () => {
    const intro = document.getElementById("intro");
    if (!intro) return;

    document.body.classList.add("intro-lock");

    const logoZoomMs = 900;   // logo animation
    const overlayOutMs = 800; // must match CSS transition

    setTimeout(() => {
        intro.classList.add("is-hiding");

        setTimeout(() => {
            document.body.classList.remove("intro-lock");
            intro.remove();
        }, overlayOutMs);
    }, logoZoomMs);
});

// ============================================
// HERO SPOTLIGHT EFFECT (follows mouse cursor)
// ============================================
const heroSection = document.querySelector('.hero');

if (heroSection) {
    const spotlightSize = 350; // Size of the reveal circle in pixels

    heroSection.addEventListener('mousemove', (e) => {
        const rect = heroSection.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        heroSection.style.setProperty('--mouse-x', `${x}%`);
        heroSection.style.setProperty('--mouse-y', `${y}%`);
        heroSection.style.setProperty('--spotlight-size', `${spotlightSize}px`);
    });

    heroSection.addEventListener('mouseleave', () => {
        heroSection.style.setProperty('--spotlight-size', '0px');
    });
}

// Navbar hide/show on scroll
let lastScrollY = window.scrollY;
let scrollUpDistance = 0;
const nav = document.querySelector('.nav');
const scrollUpThreshold = 200; // Must scroll up 200px before nav shows
const heroHeight = window.innerHeight; // Height of hero section

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY) {
        // Scrolling down - hide nav and reset scroll up counter
        if (currentScrollY > 100) {
            nav.style.transform = 'translateY(-100%)';
        }
        scrollUpDistance = 0;
    } else {
        // Scrolling up - track distance
        scrollUpDistance += lastScrollY - currentScrollY;

        if (scrollUpDistance >= scrollUpThreshold || currentScrollY < 100) {
            // Show nav after scrolling up 200px or near top
            nav.style.transform = 'translateY(0)';
        }
    }

    // Add/remove scrolled class based on scroll position
    if (currentScrollY > heroHeight) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }

    lastScrollY = currentScrollY;
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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


// ============================================
// WAITLIST FORM SUBMISSION & MOBILE EXPAND
// ============================================
const waitlistForm = document.querySelector('.hero-cta');
const waitlistBtn = waitlistForm?.querySelector('.btn-glass');
const emailInput = waitlistForm?.querySelector('.hero-input');

if (waitlistBtn && emailInput) {
    waitlistBtn.addEventListener('click', (e) => {
        e.preventDefault();

        const isMobile = window.innerWidth <= 768;

        // Mobile: First click expands, second click submits
        if (isMobile && !waitlistForm.classList.contains('expanded')) {
            waitlistForm.classList.add('expanded');
            emailInput.focus();
            return; // Don't validate yet, just expand
        }

        const email = emailInput.value.trim();

        // Check if email is empty
        if (!email) {
            if (!isMobile) {
                alert('Please enter your email address.');
            }
            emailInput.focus();
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            if (!isMobile) {
                alert('Please enter a valid email address.');
            }
            emailInput.focus();
            return;
        }

        // Success
        alert('🎉 You\'re on the waitlist! We\'ll be in touch soon.');
        emailInput.value = '';
    });

    // Close when clicking outside on mobile
    document.addEventListener('click', (e) => {
        const isMobile = window.innerWidth <= 768;
        if (isMobile && waitlistForm.classList.contains('expanded')) {
            if (!waitlistForm.contains(e.target)) {
                waitlistForm.classList.remove('expanded');
            }
        }
    });
}

// ============================================
// MOBILE HERO CTA EXPAND
// ============================================
const heroCta = document.querySelector('.hero-cta');
const heroInputField = document.querySelector('.hero-input');
const joinBtn = document.querySelector('.hero-cta .btn-glass');

if (heroCta && joinBtn && heroInputField) {
    joinBtn.addEventListener('click', (e) => {
        const isMobile = window.innerWidth <= 768;

        if (isMobile && !heroCta.classList.contains('expanded')) {
            e.preventDefault();
            heroCta.classList.add('expanded');
            heroInputField.focus();
        }
    });

    // Close when clicking outside on mobile
    document.addEventListener('click', (e) => {
        const isMobile = window.innerWidth <= 768;
        if (isMobile && heroCta.classList.contains('expanded')) {
            if (!heroCta.contains(e.target)) {
                heroCta.classList.remove('expanded');
            }
        }
    });
}

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

// Slide-in animation for carousel section (repeats on each scroll)
const slideInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
        } else {
            // Remove class when out of view so animation can repeat
            entry.target.classList.remove('in-view');
        }
    });
}, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
});

// Apply to carousel section and header
const carouselSection = document.querySelector('.carousel-section');
const carouselHeader = document.querySelector('.carousel-header');
if (carouselSection) {
    slideInObserver.observe(carouselSection);
}
if (carouselHeader) {
    slideInObserver.observe(carouselHeader);
}

// Apply to all sections (except special scroll-driven sections)
document.querySelectorAll('.section').forEach(section => {
    // Skip sections that have their own scroll logic
    if (section.classList.contains('lintel-for-section') ||
        section.classList.contains('made-for-section') ||
        section.classList.contains('one-place-section')) {
        return;
    }
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
        const isMobile = window.innerWidth <= 768;

        let offset;

        if (isMobile) {
            // Pixel-based for mobile
            const containerWidth = carouselTrack.parentElement.offsetWidth;
            const slideElement = allSlides[0];
            const slideWidth = slideElement.offsetWidth;
            const gap = 32;
            const centerOffset = (containerWidth - slideWidth) / 2;
            const slidePosition = currentIndex * (slideWidth + gap);
            offset = centerOffset - slidePosition - 20;

            carouselTrack.style.transform = `translateX(${offset}px)`;
        } else {
            // Percentage-based for desktop (your original working code)
            const slideWidth = 47;
            offset = 27.5 - (currentIndex * slideWidth);

            carouselTrack.style.transform = `translateX(${offset}%)`;
        }

        if (animate) {
            carouselTrack.style.transition = 'transform 0.5s ease-in-out';
        } else {
            carouselTrack.style.transition = 'none';
        }

        // Update active states
        allSlides.forEach((slide, index) => {
            slide.classList.remove('active');
            if (index === currentIndex) {
                slide.classList.add('active');
            }
        });
    }

    function handleTransitionEnd() {
        if (currentIndex === 0 || currentIndex === totalSlides - 1) {
            carouselTrack.style.transition = 'none';
            allSlides.forEach(slide => {
                slide.style.transition = 'none';
            });

            if (currentIndex === 0) {
                currentIndex = totalSlides - 2;
            } else {
                currentIndex = 1;
            }

            const isMobile = window.innerWidth <= 768;

            if (isMobile) {
                const containerWidth = carouselTrack.parentElement.offsetWidth;
                const slideElement = allSlides[0];
                const slideWidth = slideElement.offsetWidth;
                const gap = 32;
                const centerOffset = (containerWidth - slideWidth) / 2;
                const slidePosition = currentIndex * (slideWidth + gap);
                const offset = centerOffset - slidePosition - 20;
                carouselTrack.style.transform = `translateX(${offset}px)`;
            } else {
                const slideWidth = 47;
                const offset = 27.5 - (currentIndex * slideWidth);
                carouselTrack.style.transform = `translateX(${offset}%)`;
            }

            allSlides.forEach((slide, index) => {
                slide.classList.remove('active');
                if (index === currentIndex) {
                    slide.classList.add('active');
                }
            });

            carouselTrack.offsetHeight;

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

// ============================================
// FAMILIAR SECTION ANIMATION
// ============================================
const familiarSection = document.querySelector('.familiar-section');

if (familiarSection) {
    const familiarObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            } else {
                entry.target.classList.remove('in-view');
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    familiarObserver.observe(familiarSection);

    // Cursor-following gradient effect on familiar items
    const familiarItems = document.querySelectorAll('.familiar-item');
    familiarItems.forEach(item => {
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            item.style.setProperty('--mouse-x', `${x}%`);
            item.style.setProperty('--mouse-y', `${y}%`);
        });
    });
}

// ============================================
// AUTOPILOT SECTION ANIMATION
// ============================================
const autopilotSection = document.querySelector('.autopilot-section');

if (autopilotSection) {
    const autopilotObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            } else {
                entry.target.classList.remove('in-view');
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    });

    autopilotObserver.observe(autopilotSection);
}

// ============================================
// SETUP SECTION - TAB SWITCHING WITH SLIDER
// ============================================
const setupTabs = document.querySelectorAll('.setup-tab');
const setupContents = document.querySelectorAll('.setup-content');
const tabsContainer = document.querySelector('.setup-tabs');

// Create slider element
const tabSlider = document.createElement('div');
tabSlider.classList.add('tab-slider');
if (tabsContainer) {
    tabsContainer.appendChild(tabSlider);
}

function updateSlider(activeTab) {
    if (!activeTab || !tabSlider) return;
    const tabRect = activeTab.getBoundingClientRect();
    const containerRect = tabsContainer.getBoundingClientRect();

    tabSlider.style.width = `${tabRect.width}px`;
    tabSlider.style.left = `${tabRect.left - containerRect.left}px`;
}

// Initialize slider position
const initialActiveTab = document.querySelector('.setup-tab.active');
if (initialActiveTab) {
    // Wait for fonts to load
    setTimeout(() => updateSlider(initialActiveTab), 100);
}

setupTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const targetTab = tab.dataset.tab;

        // Remove active from all tabs
        setupTabs.forEach(t => t.classList.remove('active'));

        // Remove active from all content
        setupContents.forEach(c => c.classList.remove('active'));

        // Add active to clicked tab
        tab.classList.add('active');

        // Update slider position
        updateSlider(tab);

        // Show corresponding content
        const targetContent = document.querySelector(`.setup-content[data-content="${targetTab}"]`);
        if (targetContent) {
            targetContent.classList.add('active');
        }

        // Blur the button to prevent focus scroll
        tab.blur();
    });
});

// Update slider on window resize
window.addEventListener('resize', () => {
    const activeTab = document.querySelector('.setup-tab.active');
    updateSlider(activeTab);
});

// ============================================
// MADE FOR SECTION - SCROLL-DRIVEN WORD ANIMATION
// ============================================
const madeForSection = document.querySelector('.made-for-section');
const madeForWords = document.querySelectorAll('.made-for-word');
const totalWords = madeForWords.length;
let currentWordIndex = 0;

if (madeForSection && madeForWords.length > 0) {
    window.addEventListener('scroll', () => {
        const sectionRect = madeForSection.getBoundingClientRect();
        const sectionTop = sectionRect.top;
        const sectionHeight = sectionRect.height;
        const windowHeight = window.innerHeight;

        // Only process when section is in view
        if (sectionTop > windowHeight || sectionTop < -(sectionHeight - windowHeight)) {
            return;
        }

        // Calculate scroll progress within the section (0 to 1)
        // Progress starts when section top reaches viewport top
        const scrolledIntoSection = -sectionTop;
        const scrollableDistance = sectionHeight - windowHeight;
        const scrollProgress = Math.max(0, Math.min(1, scrolledIntoSection / scrollableDistance));

        // Determine which word should be active based on scroll progress
        const newWordIndex = Math.min(
            totalWords - 1,
            Math.floor(scrollProgress * totalWords)
        );

        // Only update if the word changed
        if (newWordIndex !== currentWordIndex) {
            // Remove active and add exit to current word
            madeForWords[currentWordIndex].classList.remove('active');
            madeForWords[currentWordIndex].classList.add('exit');

            // Remove exit class after animation
            setTimeout(() => {
                madeForWords[currentWordIndex].classList.remove('exit');
            }, 400);

            // Add active to new word
            madeForWords[newWordIndex].classList.add('active');
            madeForWords[newWordIndex].classList.remove('exit');

            currentWordIndex = newWordIndex;
        }
    });
}

// ============================================
// LINTELAI IS FOR SECTION - SCROLL-DRIVEN ANIMATION
// ============================================
const lintelForSection = document.querySelector('.lintel-for-section');
const lintelForUsertype = document.querySelector('.lintel-for-usertype');
const stepperItems = document.querySelectorAll('.stepper-item');
const lintelForContents = document.querySelectorAll('.lintel-for-content');

if (lintelForSection && lintelForUsertype && stepperItems.length > 0 && lintelForContents.length > 0) {
    const userTypes = ['landlords', 'tenants', 'vendors'];
    const stepsPerUserType = 4;
    const totalSteps = userTypes.length * stepsPerUserType; // 12 total steps
    const stepperLabels = {
        landlords: ['Dashboard', 'Payments', 'Leases', 'Reports'],
        tenants: ['Payments', 'Maintenance', 'Documents', 'Messages'],
        vendors: ['Jobs', 'Details', 'Invoicing', 'Schedule']
    };

    let currentUserTypeIndex = 0;
    let currentStep = 1;

    function updateLintelForSection(userTypeIndex, step) {
        const userType = userTypes[userTypeIndex];
        const userTypeCapitalized = userType.charAt(0).toUpperCase() + userType.slice(1);

        // Update user type title
        lintelForUsertype.textContent = userTypeCapitalized;

        // Update stepper labels
        const labels = stepperLabels[userType];
        stepperItems.forEach((item, index) => {
            const label = item.querySelector('.stepper-label');
            if (label && labels[index]) {
                label.textContent = labels[index];
            }

            // Update active state
            item.classList.remove('active');
            if (index + 1 === step) {
                item.classList.add('active');
            }
        });

        // Update content
        lintelForContents.forEach(content => {
            content.classList.remove('active');
            if (content.dataset.usertype === userType && parseInt(content.dataset.step) === step) {
                content.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', () => {
        const sectionRect = lintelForSection.getBoundingClientRect();
        const sectionTop = sectionRect.top;
        const sectionHeight = sectionRect.height;
        const windowHeight = window.innerHeight;

        // Only process when section is in view
        if (sectionTop > windowHeight || sectionTop < -(sectionHeight - windowHeight)) {
            return;
        }

        // Calculate scroll progress within the section (0 to 1)
        const scrolledIntoSection = -sectionTop;
        const scrollableDistance = sectionHeight - windowHeight;
        const scrollProgress = Math.max(0, Math.min(1, scrolledIntoSection / scrollableDistance));

        // Calculate which step we're on (0 to 11 for 12 total steps)
        const totalStepIndex = Math.min(
            totalSteps - 1,
            Math.floor(scrollProgress * totalSteps)
        );

        // Determine user type and step within that user type
        const newUserTypeIndex = Math.floor(totalStepIndex / stepsPerUserType);
        const newStep = (totalStepIndex % stepsPerUserType) + 1;

        // Only update if something changed
        if (newUserTypeIndex !== currentUserTypeIndex || newStep !== currentStep) {
            currentUserTypeIndex = newUserTypeIndex;
            currentStep = newStep;
            updateLintelForSection(currentUserTypeIndex, currentStep);
        }
    });

    // Initialize
    updateLintelForSection(0, 1);
}

// ============================================
// EVERYTHING IN ONE PLACE - SCROLL-DRIVEN NAVIGATION
// ============================================
const onePlaceSection = document.querySelector('.one-place-section');
const onePlaceNavItems = document.querySelectorAll('.one-place-nav-item');
const onePlaceMobileBtns = document.querySelectorAll('.one-place-mobile-btn');
const onePlacePanels = document.querySelectorAll('.one-place-panel');

if (onePlaceSection && onePlaceNavItems.length > 0 && onePlacePanels.length > 0) {
    const tabs = ['overview', 'rent', 'inbox', 'maintenance', 'legal'];
    let currentTabIndex = 0;

    function updateOnePlaceSection(tabIndex) {
        const tabName = tabs[tabIndex];

        // Update desktop nav items
        onePlaceNavItems.forEach((item, index) => {
            item.classList.remove('active');
            if (index === tabIndex) {
                item.classList.add('active');
            }
        });

        // Update mobile buttons
        onePlaceMobileBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.tab === tabName) {
                btn.classList.add('active');
            }
        });

        // Update panels
        onePlacePanels.forEach(panel => {
            panel.classList.remove('active');
            if (panel.dataset.panel === tabName) {
                panel.classList.add('active');
            }
        });
    }

    // Click handler for desktop nav items
    onePlaceNavItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentTabIndex = index;
            updateOnePlaceSection(currentTabIndex);
        });
    });

    // Click handler for mobile buttons
    onePlaceMobileBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.dataset.tab;
            currentTabIndex = tabs.indexOf(tabName);
            updateOnePlaceSection(currentTabIndex);
        });
    });

    // Scroll handler (disabled on mobile)
    window.addEventListener('scroll', () => {
        // Disable scroll effect on mobile (768px or less)
        if (window.innerWidth <= 768) {
            return;
        }

        const sectionRect = onePlaceSection.getBoundingClientRect();
        const sectionTop = sectionRect.top;
        const sectionHeight = sectionRect.height;
        const windowHeight = window.innerHeight;

        // Only process when section is in view
        if (sectionTop > windowHeight || sectionTop < -(sectionHeight - windowHeight)) {
            return;
        }

        // Calculate scroll progress within the section (0 to 1)
        const scrolledIntoSection = -sectionTop;
        const scrollableDistance = sectionHeight - windowHeight;
        const scrollProgress = Math.max(0, Math.min(1, scrolledIntoSection / scrollableDistance));

        // Calculate which tab we're on (0 to 4 for 5 tabs)
        const newTabIndex = Math.min(
            tabs.length - 1,
            Math.floor(scrollProgress * tabs.length)
        );

        // Only update if something changed
        if (newTabIndex !== currentTabIndex) {
            currentTabIndex = newTabIndex;
            updateOnePlaceSection(currentTabIndex);
        }
    });

    // Initialize
    updateOnePlaceSection(0);
}

// ============================================
// BUILT DIFFERENTLY - CARD INTERACTIONS
// ============================================
const diffCards = document.querySelectorAll('.diff-card');

if (diffCards.length > 0) {
    // Check if mobile
    const isMobile = () => window.innerWidth <= 768;

    diffCards.forEach(card => {
        // Desktop: Hover behavior
        card.addEventListener('mouseenter', () => {
            if (!isMobile()) {
                diffCards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');
            }
        });

        // Mobile: Click/tap behavior
        card.addEventListener('click', () => {
            if (isMobile()) {
                const isActive = card.classList.contains('active');
                diffCards.forEach(c => c.classList.remove('active'));
                if (!isActive) {
                    card.classList.add('active');
                }
            }
        });
    });
}

// Stats Counter Animation
function animateCounter(element, target, duration = 1000) {
    const prefix = element.dataset.prefix || '';
    const suffix = element.dataset.suffix || '';
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth deceleration
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(start + (target - start) * easeOutQuart);

        element.textContent = prefix + current + suffix;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = prefix + target + suffix;
        }
    }

    requestAnimationFrame(update);
}

function resetCounter(element) {
    const prefix = element.dataset.prefix || '';
    const suffix = element.dataset.suffix || '';
    element.textContent = prefix + '0' + suffix;
}

function initStatsCounter() {
    const statsSection = document.querySelector('.about-stats');
    if (!statsSection) return;

    const statValues = document.querySelectorAll('.stat-value[data-value]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate when in view
                statValues.forEach(stat => {
                    const targetValue = parseInt(stat.dataset.value);
                    animateCounter(stat, targetValue, 1000);
                });
            } else {
                // Reset when out of view so it animates again
                statValues.forEach(stat => {
                    resetCounter(stat);
                });
            }
        });
    }, { threshold: 0.3 });

    observer.observe(statsSection);
}

// Initialize stats counter
initStatsCounter();

// FAQ Accordion
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        if (question) {
            question.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                const isActive = item.classList.contains('active');

                // Close all other items
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                });

                // Toggle current item
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });
}

// Initialize FAQ when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFAQ);
} else {
    initFAQ();
}

// ============================================
// FLOATING BOOK A DEMO BUTTON (HIDDEN ON SOME SECTIONS)
// ============================================
const floatingBtn = document.querySelector('.floating-demo-btn');

if (floatingBtn) {
    let lastScrollY = window.scrollY;

    // Function to check if user is inside a scroll-driven section
    function isInScrollDrivenSection() {
        const scrollSections = [
            document.querySelector('.one-place-section'),
            document.querySelector('.lintel-for-section')
        ];

        for (const section of scrollSections) {
            if (section) {
                const rect = section.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                // Check if section is currently in viewport and taking up most of screen
                if (rect.top < windowHeight * 0.5 && rect.bottom > windowHeight * 0.5) {
                    return true;
                }
            }
        }
        return false;
    }

    window.addEventListener('scroll', () => {
        // Show button after scrolling past hero section (100vh)
        const currentScrollY = window.scrollY;
        const pastHero = currentScrollY > window.innerHeight * 0.2;
        const inScrollSection = isInScrollDrivenSection();

        // Slide to right if inside scroll-driven sections, otherwise center
        if (inScrollSection) {
            floatingBtn.classList.add('slide-right');
            if (pastHero) {
                floatingBtn.classList.add('visible');
            }
        } else {
            floatingBtn.classList.remove('slide-right');
            if (pastHero && currentScrollY > lastScrollY) {
                floatingBtn.classList.add('visible');
            } else if (!pastHero) {
                floatingBtn.classList.remove('visible');
            }
        }

        lastScrollY = currentScrollY;
    });
}