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
    
    // Show slide
    function showSlide(n) {
        slides.forEach(slide => slide.classList.add('opacity-0'));
        dots.forEach(dot => dot.classList.remove('active-dot'));
        
        slides[n].classList.remove('opacity-0');
        dots[n].classList.add('active-dot');
        currentSlide = n;
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
    
    // Start everything
    showSlide(0);
    startSlider();
    
    // Pause slider on hover
    const sliderContainer = document.querySelector('.slider-container');
    sliderContainer.addEventListener('mouseenter', stopSlider);
    sliderContainer.addEventListener('mouseleave', startSlider);
});
