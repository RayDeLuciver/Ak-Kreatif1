"use strict";

// Simple JavaScript for Walking Story Photography

// Wait for page to load
document.addEventListener("DOMContentLoaded", function () {
  // Get elements
  const categoryCards = document.querySelectorAll(".category-card");
  const mainContent = document.getElementById("main-content");
  const categoryViews = document.querySelectorAll(".category-view");
  const backButtons = document.querySelectorAll(".back-button");

  // Slider elements
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".slider-dot");
  const prevBtn = document.querySelector(".slider-prev");
  const nextBtn = document.querySelector(".slider-next");

  let currentSlide = 0;
  let slideTimer;

  // Photo modal elements
  const photoModal = document.getElementById("photo-modal");
  const modalPhotoTitle = document.getElementById("modal-photo-title");
  const modalPhotoImage = document.getElementById("modal-photo-image");
  const modalPhotoLocation = document.getElementById("modal-photo-location");
  const modalPhotoTags = document.getElementById("modal-photo-tags");
  const modalPrevBtn = document.getElementById("modal-prev-btn");
  const modalNextBtn = document.getElementById("modal-next-btn");

  // Article modal elements
  const articleModal = document.getElementById("article-modal");
  const modalArticleTitle = document.getElementById("modal-article-title");
  const modalArticleImage = document.getElementById("modal-article-image");
  const modalArticleAuthor = document.getElementById("modal-article-author");
  const modalArticleLocation = document.getElementById("modal-article-location");
  const modalArticleContent = document.getElementById("modal-article-content");

  // Load photos from localStorage and merge with default photos
  let photos = [];
  
  // Default photos data
  const defaultPhotos = [
    {
      id: 1,
      thumbnail: "img/Tertawa saat boncengan.jpg",
      title: "Tindakan Pencegahan Korupsi Pemerintah Daerah Diakui: KPK Beri Penghargaan Kepada Kabupaten Mahakam Ulu",
      location: "Taman Cerdas Kalimantan Timur",
      category: "human-interest",
      tags: ["#samarinda", "#berita"],
      isUploaded: false
    },
    {
      id: 2,
      thumbnail: "img/Pedagang Jajanan Kaki Lima.jpg",
      title: "Kehidupan Pedagang Kaki Lima di Tengah Pandemi",
      location: "Taman Samarinda",
      category: "culinary",
      tags: ["#kuliner", "#streetfood"],
      isUploaded: false
    },
    {
      id: 3,
      thumbnail: "img/Kumpulan Mahasiswa sedang Menyanyikan Yel-Yel.jpg",
      title: "Semangat Mahasiswa dalam Kegiatan Kampus",
      location: "Islamic Center Samarinda",
      category: "social-activity",
      tags: ["#mahasiswa", "#aktivitas"],
      isUploaded: false
    },
  ];

  // Function to load and merge photos from localStorage
  function loadPhotosFromStorage() {
    try {
      const savedPhotos = localStorage.getItem('walkingStoryPhotos');
      if (savedPhotos) {
        const uploadedPhotos = JSON.parse(savedPhotos).filter(photo => photo.isUploaded);
        // Merge uploaded photos with default photos, uploaded photos first
        photos = [...uploadedPhotos, ...defaultPhotos];
      } else {
        photos = [...defaultPhotos];
      }
    } catch (error) {
      console.error('Error loading photos from localStorage:', error);
      photos = [...defaultPhotos];
    }
  }

  // Initialize photos on page load
  loadPhotosFromStorage();

  // Sample articles data (should be synced with your actual data)
  const articles = [
    {
      id: 1,
      title: "The Magic of City Streets at Sunset",
      image: "https://picsum.photos/400/300?random=301",
      author: "Arif Pratama",
      location: "Jakarta, Indonesia",
      content:
        "Exploring the vibrant colors and lively atmosphere of city streets as the sun sets, capturing moments that tell stories of urban life. The golden hour transforms ordinary streets into magical pathways where every shadow tells a story and every light creates a moment of wonder. Street photography during sunset offers unique opportunities to capture the essence of urban life in its most beautiful form.",
    },
    {
      id: 2,
      title: "Capturing the Soul of Street Music",
      image: "https://picsum.photos/400/300?random=302",
      author: "Sari Dewi",
      location: "Bandung, Indonesia",
      content:
        "A deep dive into the world of street musicians, their passion, and the emotions they evoke through their performances. Music fills the air as talented artists share their gifts with passersby, creating spontaneous concerts that bring communities together. Each musician has a unique story, and their melodies become the soundtrack of city life, touching hearts and inspiring souls.",
    },
    {
      id: 3,
      title: "Urban Graffiti: Stories on Walls",
      image: "https://picsum.photos/400/300?random=303",
      author: "Budi Santoso",
      location: "Yogyakarta, Indonesia",
      content:
        "Discovering the stories behind urban graffiti art and the messages conveyed through colorful murals in city spaces. Street art serves as a powerful medium for social commentary, artistic expression, and cultural identity. These vibrant murals transform blank walls into canvases that speak to the community, reflecting hopes, dreams, and the collective voice of urban society.",
    },
  ];

  // Start slider
  function startSlider() {
    slideTimer = setInterval(nextSlide, 5000);
  }

  // Stop slider
  function stopSlider() {
    clearInterval(slideTimer);
  }

  // Synchronize mobile caption with active slide
  function updateMobileCaption(index) {
    const mobileCaptions = document.querySelectorAll(".mobile-caption");
    mobileCaptions.forEach((caption, i) => {
      if (i === index) {
        caption.classList.add("active");
      } else {
        caption.classList.remove("active");
      }
    });
  }

  // Show slide
  function showSlide(n) {
    slides.forEach((slide) => slide.classList.add("opacity-0"));
    dots.forEach((dot) => dot.classList.remove("active-dot"));

    slides[n].classList.remove("opacity-0");
    dots[n].classList.add("active-dot");
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
    mainContent.style.display = "none";
    const categoryView = document.getElementById(categoryName + "-view");
    if (categoryView) {
      categoryView.style.display = "block";
      window.scrollTo(0, 0);
    }
  }

  function showMain() {
    categoryViews.forEach((view) => (view.style.display = "none"));
    mainContent.style.display = "block";
    window.scrollTo(0, 0);
  }

  // Event listeners

  // Slider controls
  prevBtn.addEventListener("click", function () {
    stopSlider();
    prevSlide();
    startSlider();
  });

  nextBtn.addEventListener("click", function () {
    stopSlider();
    nextSlide();
    startSlider();
  });

  // Slider dots
  dots.forEach((dot, index) => {
    dot.addEventListener("click", function () {
      stopSlider();
      showSlide(index);
      startSlider();
    });
  });

  // Category cards
  categoryCards.forEach((card) => {
    card.addEventListener("click", function () {
      const category = this.getAttribute("data-category");
      showCategory(category);
    });
  });

  // Footer category links
  const categoryLinks = document.querySelectorAll(".category-link");
  categoryLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const category = this.getAttribute("data-category");
      showCategory(category);
    });
  });

  // Back buttons
  backButtons.forEach((button) => {
    button.addEventListener("click", showMain);
  });

  // Function to check if device is mobile
  function isMobile() {
    return window.innerWidth <= 640;
  }

  // Function to handle overlay visibility based on screen size
  function handleOverlayVisibility() {
    slides.forEach((slide) => {
      const caption = slide.querySelector(".caption-overlay");
      if (!caption) return;

      if (isMobile()) {
        // On mobile, always show overlay
        caption.classList.remove("hidden", "auto-hide");
      } else {
        // On desktop, start with visible overlay
        caption.classList.remove("hidden", "auto-hide");
      }
    });
  }

  // Caption toggle on image click (desktop only)
  slides.forEach((slide) => {
    slide.addEventListener("click", function (event) {
      // Only handle click events on desktop
      if (isMobile()) return;

      const caption = this.querySelector(".caption-overlay");
      if (!caption) return;

      // Toggle caption visibility
      if (caption.classList.contains("hidden") || caption.classList.contains("auto-hide")) {
        caption.classList.remove("hidden", "auto-hide");
        console.log("Caption shown");
      } else {
        caption.classList.add("hidden");
        console.log("Caption hidden");
      }
      event.stopPropagation();
    });
  });

  // Show caption overlay by default for better visibility
  slides.forEach((slide) => {
    const caption = slide.querySelector(".caption-overlay");
    if (caption && !isMobile()) {
      // Show caption for 5 seconds initially, then add auto-hide class
      caption.classList.remove("hidden");
      setTimeout(() => {
        caption.classList.add("auto-hide");
      }, 5000);
    }
  });

  // Hide caption when clicking outside (desktop only)
  document.addEventListener("click", function () {
    // Only handle click events on desktop
    if (isMobile()) return;

    slides.forEach((slide) => {
      const caption = slide.querySelector(".caption-overlay");
      if (caption && !caption.classList.contains("hidden")) {
        caption.classList.add("hidden");
      }
    });
  });

  // Handle window resize to adjust overlay behavior
  window.addEventListener("resize", function () {
    handleOverlayVisibility();
  });

  // Initialize overlay visibility on page load
  handleOverlayVisibility();

  // Pause slider on hover
  const sliderContainer = document.querySelector(".slider-container");
  sliderContainer.addEventListener("mouseenter", stopSlider);
  sliderContainer.addEventListener("mouseleave", startSlider);

  // Performance optimizations
  function initializePerformanceOptimizations() {
    // Preload next slide images
    const slides = document.querySelectorAll(".slide");
    slides.forEach((slide, index) => {
      const img = slide.querySelector("img");
      if (img && index <= 1) {
        // Preload first 2 slides
        const link = document.createElement("link");
        link.rel = "preload";
        link.as = "image";
        link.href = img.src;
        document.head.appendChild(link);
      }
    });

    // Add loading states
    const images = document.querySelectorAll("img");
    images.forEach((img) => {
      img.addEventListener("load", function () {
        this.style.opacity = "1";
      });
      img.addEventListener("error", function () {
        this.style.opacity = "0.5";
        console.warn("Failed to load image:", this.src);
      });
    });
  }

  // Accessibility features
  function initializeAccessibilityFeatures() {
    // Add keyboard navigation for slider
    document.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") {
        stopSlider();
        prevSlide();
        startSlider();
      } else if (e.key === "ArrowRight") {
        stopSlider();
        nextSlide();
        startSlider();
      } else if (e.key === "Escape") {
        // Hide caption overlays on desktop
        if (!isMobile()) {
          const overlays = document.querySelectorAll(".caption-overlay");
          overlays.forEach((overlay) => overlay.classList.add("hidden"));
        }
      }
    });

    // Add ARIA labels
    const sliderContainer = document.querySelector(".slider-container");
    if (sliderContainer) {
      sliderContainer.setAttribute("role", "region");
      sliderContainer.setAttribute("aria-label", "Image slider with navigation");
    }

    // Improve button accessibility
    const buttons = document.querySelectorAll("button");
    buttons.forEach((button) => {
      if (!button.getAttribute("aria-label")) {
        if (button.classList.contains("slider-prev")) {
          button.setAttribute("aria-label", "Previous slide");
        } else if (button.classList.contains("slider-next")) {
          button.setAttribute("aria-label", "Next slide");
        } else if (button.classList.contains("slider-dot")) {
          const index = Array.from(dots).indexOf(button) + 1;
          button.setAttribute("aria-label", `Go to slide ${index}`);
        } else if (button.classList.contains("back-button")) {
          button.setAttribute("aria-label", "Back to main page");
        }
      }
    });
  }

  // Smooth scrolling enhancement
  function initializeSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
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
  window.addEventListener("load", function () {
    document.body.classList.add("loaded");

    // Staggered animation for category cards
    const categoryCards = document.querySelectorAll(".category-card");
    categoryCards.forEach((card, index) => {
      setTimeout(() => {
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";
      }, index * 100);
    });
  });

  // Add error handling for slider
  function handleSliderError() {
    console.warn("Slider initialization failed, falling back to static display");
    slides.forEach((slide, index) => {
      if (index === 0) {
        slide.classList.remove("opacity-0");
      } else {
        slide.style.display = "none";
      }
    });
  }

  // Function to refresh photos from localStorage (called when returning from admin)
  window.refreshPhotosFromAdmin = function() {
    loadPhotosFromStorage();
    loadUploadedPhotosIntoCategories();
  };

  // Listen for storage changes (when admin updates photos)
  window.addEventListener('storage', function(e) {
    if (e.key === 'walkingStoryPhotos') {
      loadPhotosFromStorage();
      loadUploadedPhotosIntoCategories();
    }
  });

  // Initialize with error handling
  try {
    showSlide(0);
    startSlider();
  } catch (error) {
    console.error("Slider error:", error);
    handleSliderError();
  }

  // --- Modal Functionality ---

  // Current photo index for modal navigation
  let currentPhotoIndex = -1;

  // Make modal functions globally accessible
  window.openPhotoModal = function(title, imageSrc, location, tags) {
    modalPhotoTitle.textContent = title;
    modalPhotoImage.src = imageSrc;
    modalPhotoImage.alt = title;
    modalPhotoLocation.textContent = location;

    // Clear previous tags
    modalPhotoTags.innerHTML = "";
    tags.forEach((tag) => {
      const tagSpan = document.createElement("span");
      tagSpan.className = "tag";
      tagSpan.textContent = tag;
      modalPhotoTags.appendChild(tagSpan);
    });

    photoModal.style.display = "flex";
  };

  // Close photo modal
  window.closePhotoModal = function() {
    photoModal.style.display = "none";
  };

  // Show previous photo in modal
  window.previousPhoto = function() {
    if (currentPhotoIndex > 0) {
      currentPhotoIndex--;
      const photo = photos[currentPhotoIndex];
      window.openPhotoModal(photo.title, photo.thumbnail, photo.location, photo.tags);
    }
  };

  // Show next photo in modal
  window.nextPhoto = function() {
    if (currentPhotoIndex < photos.length - 1) {
      currentPhotoIndex++;
      const photo = photos[currentPhotoIndex];
      window.openPhotoModal(photo.title, photo.thumbnail, photo.location, photo.tags);
    }
  };

  // Open article modal with article data
  window.openArticleModal = function(title, imageSrc, author, location, content) {
    modalArticleTitle.textContent = title;
    modalArticleImage.src = imageSrc;
    modalArticleImage.alt = title;
    modalArticleAuthor.textContent = author;
    modalArticleLocation.textContent = location;
    modalArticleContent.innerHTML = content;

    articleModal.style.display = "flex";
  };

  // Close article modal
  window.closeArticleModal = function() {
    articleModal.style.display = "none";
  };

  // Function to add click event listeners to photo items for modal
  function initializePhotoItems() {
    const photoItems = document.querySelectorAll(".photo-item");
    photoItems.forEach((item, index) => {
      item.addEventListener("click", () => {
        // Get the current category view to filter photos
        const activeView = document.querySelector('.category-view[style*="block"]');
        let categoryPhotos = photos;
        
        if (activeView) {
          const categoryName = activeView.id.replace('-view', '');
          categoryPhotos = photos.filter(photo => photo.category === categoryName);
        }
        
        currentPhotoIndex = index;
        const photo = categoryPhotos[index] || photos[index];
        if (photo) {
          window.openPhotoModal(photo.title, photo.thumbnail, photo.location, photo.tags || []);
        }
      });
    });
  }

  // Function to dynamically load uploaded photos into category views
  function loadUploadedPhotosIntoCategories() {
    const uploadedPhotos = photos.filter(photo => photo.isUploaded);
    
    uploadedPhotos.forEach(photo => {
      if (photo.category) {
        const categoryView = document.getElementById(`${photo.category}-view`);
        if (categoryView) {
          const photoGrid = categoryView.querySelector('.grid');
          if (photoGrid) {
            // Create new photo item element
            const photoItem = document.createElement('div');
            photoItem.className = 'photo-item relative overflow-hidden rounded-lg shadow-lg group cursor-pointer';
            photoItem.innerHTML = `
              <img src="${photo.thumbnail}" alt="${photo.title}" class="w-full h-64 object-cover" onerror="this.src='https://via.placeholder.com/400x300?text=Image+Not+Found'">
              <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300"></div>
              <div class="photo-tooltip absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h4 class="font-bold text-lg">${photo.title}</h4>
                <p class="text-sm">📍${photo.location}</p>
              </div>
            `;
            
            // Insert at the beginning of the grid (after the first few default photos)
            const firstChild = photoGrid.firstElementChild;
            if (firstChild) {
              photoGrid.insertBefore(photoItem, firstChild);
            } else {
              photoGrid.appendChild(photoItem);
            }
          }
        }
      }
    });
    
    // Re-initialize photo item click handlers after adding new photos
    initializePhotoItems();
  }

  // Initialize photo items on page load
  initializePhotoItems();
  
  // Load uploaded photos into categories
  loadUploadedPhotosIntoCategories();

  // Initialize article click handlers
  function initializeArticleItems() {
    const articleCards = document.querySelectorAll(".article-card");
    articleCards.forEach((card) => {
      card.addEventListener("click", function() {
        // Get article data from onclick attribute or data attributes
        const onclickAttr = this.getAttribute('onclick');
        if (onclickAttr) {
          // Extract parameters from onclick attribute
          const match = onclickAttr.match(/openArticleModal\('([^']+)',\s*'([^']+)',\s*'([^']+)',\s*'([^']+)',\s*'([^']+)'\)/);
          if (match) {
            const [, title, imageSrc, author, location, content] = match;
            window.openArticleModal(title, imageSrc, author, location, content);
          }
        }
      });
    });
  }

  // Initialize article items
  initializeArticleItems();

  // Add event listeners for modal close buttons and overlay clicks
  if (photoModal) {
    photoModal.addEventListener("click", function(e) {
      if (e.target === photoModal) {
        window.closePhotoModal();
      }
    });
  }

  if (articleModal) {
    articleModal.addEventListener("click", function(e) {
      if (e.target === articleModal) {
        window.closeArticleModal();
      }
    });
  }

  // Add keyboard support for modals
  document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") {
      if (photoModal && photoModal.style.display === "flex") {
        window.closePhotoModal();
      }
      if (articleModal && articleModal.style.display === "flex") {
        window.closeArticleModal();
      }
    }
  });
});
