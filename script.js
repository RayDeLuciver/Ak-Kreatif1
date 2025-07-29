// Simple JavaScript for Walking Story Photography

// Wait for page to load
document.addEventListener('DOMContentLoaded', function() {
    
    // Get elements
    const categoryCards = document.querySelectorAll('.category-card');
    const mainContent = document.getElementById('main-content');
    const categoryViews = document.querySelectorAll('.category-view');
    const backButtons = document.querySelectorAll('.back-button');
    
    // Slider elements
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slider-dot');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    
    let currentSlide = 0;
    let slideTimer;
    
    // Start slider
    function startSlider() {
        slideTimer = setInterval(nextSlide, 5000);
    }
    
    // Stop slider
    function stopSlider() {
        clearInterval(slideTimer);
    }
    
    // Synchronize mobile caption with active slide
    const mobileCaptions = document.querySelectorAll('.mobile-caption');

    function updateMobileCaption(index) {
        mobileCaptions.forEach((caption, i) => {
            if (i === index) {
                caption.classList.add('active');
            } else {
                caption.classList.remove('active');
            }
        });
    }

    // Show slide
    function showSlide(n) {
        slides.forEach(slide => slide.classList.add('opacity-0'));
        dots.forEach(dot => dot.classList.remove('active-dot'));
        
        slides[n].classList.remove('opacity-0');
        dots[n].classList.add('active-dot');
        currentSlide = n;

        updateMobileCaption(n);
    }
    
    // Next slide
    function nextSlide() {
        let next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }
    
    // Previous slide
    function prevSlide() {
        let prev = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(prev);
    }
    
    // Category navigation
    function showCategory(categoryName) {
        mainContent.style.display = 'none';
        const categoryView = document.getElementById(categoryName + '-view');
        if (categoryView) {
            categoryView.style.display = 'block';
            window.scrollTo(0, 0);
        }
    }
    
    function showMain() {
        categoryViews.forEach(view => view.style.display = 'none');
        mainContent.style.display = 'block';
        window.scrollTo(0, 0);
    }
    
    // Event listeners
    
    // Slider controls
    prevBtn.addEventListener('click', function() {
        stopSlider();
        prevSlide();
        startSlider();
    });
    
    nextBtn.addEventListener('click', function() {
        stopSlider();
        nextSlide();
        startSlider();
    });
    
    // Slider dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            stopSlider();
            showSlide(index);
            startSlider();
        });
    });
    
    // Category cards
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            showCategory(category);
        });
    });
    
    // Footer category links
    const categoryLinks = document.querySelectorAll('.category-link');
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.getAttribute('data-category');
            showCategory(category);
        });
    });
    
    // Back buttons
    backButtons.forEach(button => {
        button.addEventListener('click', showMain);
    });
    
    // Function to check if device is mobile
    function isMobile() {
        return window.innerWidth <= 640;
    }

    // Function to handle overlay visibility based on screen size
    function handleOverlayVisibility() {
        slides.forEach(slide => {
            const caption = slide.querySelector('.caption-overlay');
            if (!caption) return;

            if (isMobile()) {
                // On mobile, always show overlay
                caption.classList.remove('hidden', 'auto-hide');
            } else {
                // On desktop, start with visible overlay
                caption.classList.remove('hidden', 'auto-hide');
            }
        });
    }

    // Caption toggle on image click (desktop only)
    slides.forEach(slide => {
        slide.addEventListener('click', function(event) {
            // Only handle click events on desktop
            if (isMobile()) return;

            const caption = this.querySelector('.caption-overlay');
            if (!caption) return;

            // Toggle caption visibility
            if (caption.classList.contains('hidden') || caption.classList.contains('auto-hide')) {
                caption.classList.remove('hidden', 'auto-hide');
                console.log('Caption shown');
            } else {
                caption.classList.add('hidden');
                console.log('Caption hidden');
            }
            event.stopPropagation();
        });
    });

    // Show caption overlay by default for better visibility
    slides.forEach(slide => {
        const caption = slide.querySelector('.caption-overlay');
        if (caption && !isMobile()) {
            // Show caption for 5 seconds initially, then add auto-hide class
            caption.classList.remove('hidden');
            setTimeout(() => {
                caption.classList.add('auto-hide');
            }, 5000);
        }
    });

    // Hide caption when clicking outside (desktop only)
    document.addEventListener('click', function() {
        // Only handle click events on desktop
        if (isMobile()) return;

        slides.forEach(slide => {
            const caption = slide.querySelector('.caption-overlay');
            if (caption && !caption.classList.contains('hidden')) {
                caption.classList.add('hidden');
            }
        });
    });

    // Handle window resize to adjust overlay behavior
    window.addEventListener('resize', function() {
        handleOverlayVisibility();
    });

    // Initialize overlay visibility on page load
    handleOverlayVisibility();

    // Pause slider on hover
    const sliderContainer = document.querySelector('.slider-container');
    sliderContainer.addEventListener('mouseenter', stopSlider);
    sliderContainer.addEventListener('mouseleave', startSlider);

    // Performance optimizations
    function initializePerformanceOptimizations() {
        // Preload next slide images
        const slides = document.querySelectorAll('.slide');
        slides.forEach((slide, index) => {
            const img = slide.querySelector('img');
            if (img && index <= 1) { // Preload first 2 slides
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'image';
                link.href = img.src;
                document.head.appendChild(link);
            }
        });

        // Add loading states
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.addEventListener('load', function() {
                this.style.opacity = '1';
            });
            img.addEventListener('error', function() {
                this.style.opacity = '0.5';
                console.warn('Failed to load image:', this.src);
            });
        });
    }

    // Accessibility features
    function initializeAccessibilityFeatures() {
        // Add keyboard navigation for slider
        document.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft') {
                stopSlider();
                prevSlide();
                startSlider();
            } else if (e.key === 'ArrowRight') {
                stopSlider();
                nextSlide();
                startSlider();
            } else if (e.key === 'Escape') {
                // Hide caption overlays on desktop
                if (!isMobile()) {
                    const overlays = document.querySelectorAll('.caption-overlay');
                    overlays.forEach(overlay => overlay.classList.add('hidden'));
                }
            }
        });

        // Add ARIA labels
        const sliderContainer = document.querySelector('.slider-container');
        if (sliderContainer) {
            sliderContainer.setAttribute('role', 'region');
            sliderContainer.setAttribute('aria-label', 'Image slider with navigation');
        }

        // Improve button accessibility
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (!button.getAttribute('aria-label')) {
                if (button.classList.contains('slider-prev')) {
                    button.setAttribute('aria-label', 'Previous slide');
                } else if (button.classList.contains('slider-next')) {
                    button.setAttribute('aria-label', 'Next slide');
                } else if (button.classList.contains('slider-dot')) {
                    const index = Array.from(dots).indexOf(button) + 1;
                    button.setAttribute('aria-label', `Go to slide ${index}`);
                } else if (button.classList.contains('back-button')) {
                    button.setAttribute('aria-label', 'Back to main page');
                }
            }
        });
    }

    // Smooth scrolling enhancement
    function initializeSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('click', function(e) {
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
    }

    // Initialize additional features
    initializePerformanceOptimizations();
    initializeAccessibilityFeatures();
    initializeSmoothScrolling();

    // Add loading animation
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        
        // Staggered animation for category cards
        const categoryCards = document.querySelectorAll('.category-card');
        categoryCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    });

    // Add error handling for slider
    function handleSliderError() {
        console.warn('Slider initialization failed, falling back to static display');
        slides.forEach((slide, index) => {
            if (index === 0) {
                slide.classList.remove('opacity-0');
            } else {
                slide.style.display = 'none';
            }
        });
    }

    // Initialize with error handling
    try {
        showSlide(0);
        startSlider();
    } catch (error) {
        console.error('Slider error:', error);
        handleSliderError();
    }
});
