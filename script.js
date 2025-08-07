"use strict";

// Simple JavaScript for Walking Story Photography

// Wait for page to load
document.addEventListener("DOMContentLoaded", function () {
  // Check for photo parameter in URL
  const urlParams = new URLSearchParams(window.location.search);
  const photoId = urlParams.get('photo');
  
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
  
  // Default photos data - comprehensive list for all category views
  const defaultPhotos = [
    // Human Interest Photos
    {
      id: 1,
      thumbnail: "img/Tertawa saat boncengan.jpg",
      title: "Tertawa saat boncengan",
      location: "Mall lembuswana",
      category: "human-interest",
      photographer: "Fahri",
      tags: ["#samarinda", "#humaninterest"],
      isUploaded: false
    },
    {
      id: 4,
      thumbnail: "img/Penjahit Di Tengah Jalan (1).jpg",
      title: "Penjahit Di Tengah Jalan",
      location: "Mall lembuswana",
      category: "human-interest",
      photographer: "Marvel",
      tags: ["#samarinda", "#streetlife"],
      isUploaded: false
    },
    {
      id: 5,
      thumbnail: "img/Seorang Pria Telponan.jpg",
      title: "Seorang Pria Telponan",
      location: "Mall lembuswana",
      category: "human-interest",
      photographer: "Sultan",
      tags: ["#samarinda", "#dailylife"],
      isUploaded: false
    },
    {
      id: 6,
      thumbnail: "img/Petugas Membersihkan Area Mall.jpg",
      title: "Petugas Membersihkan Area Mall",
      location: "Mall lembuswana",
      category: "human-interest",
      photographer: "Fahri",
      tags: ["#samarinda", "#worker"],
      isUploaded: false
    },
    {
      id: 7,
      thumbnail: "img/Bersama Saling Bantu-Membantu.jpg",
      title: "Bersama Saling Bantu-Membantu",
      location: "Mall lembuswana",
      category: "human-interest",
      photographer: "Marvel",
      tags: ["#samarinda", "#community"],
      isUploaded: false
    },
    {
      id: 8,
      thumbnail: "img/Perbincangan 2 pria.jpg",
      title: "Perbincangan 2 pria",
      location: "Mall lembuswana",
      category: "human-interest",
      photographer: "Sultan",
      tags: ["#samarinda", "#conversation"],
      isUploaded: false
    },
    {
      id: 9,
      thumbnail: "img/Bersantai Dalam Kesendirian.jpg",
      title: "Bersantai Dalam Kesendirian",
      location: "Mall lembuswana",
      category: "human-interest",
      photographer: "Fahri",
      tags: ["#samarinda", "#solitude"],
      isUploaded: false
    },
    {
      id: 10,
      thumbnail: "img/Pencari Nafkah.jpg",
      title: "Pencari Nafkah",
      location: "Mall lembuswana",
      category: "human-interest",
      photographer: "Marvel",
      tags: ["#samarinda", "#livelihood"],
      isUploaded: false
    },
    {
      id: 11,
      thumbnail: "img/Menunggu Seseorang.jpg",
      title: "Menunggu Seseorang",
      location: "Mall lembuswana",
      category: "human-interest",
      photographer: "Sultan",
      tags: ["#samarinda", "#waiting"],
      isUploaded: false
    },
    {
      id: 12,
      thumbnail: "img/Restock Mainan.jpg",
      title: "Restock Mainan",
      location: "samarinda square",
      category: "human-interest",
      photographer: "Fahri",
      tags: ["#samarinda", "#business"],
      isUploaded: false
    },
    {
      id: 13,
      thumbnail: "img/Istirahat dari Realita.jpg",
      title: "Istirahat dari Realita",
      location: "taman samarinda",
      category: "human-interest",
      photographer: "Marvel",
      tags: ["#samarinda", "#rest"],
      isUploaded: false
    },
    {
      id: 14,
      thumbnail: "img/Perjalanan Seorang Nenek.jpg",
      title: "Perjalanan Seorang Nenek",
      location: "taman samarinda",
      category: "human-interest",
      photographer: "Sultan",
      tags: ["#samarinda", "#elderly"],
      isUploaded: false
    },
    {
      id: 15,
      thumbnail: "img/Seorang Pelari Di Bawah Pepohonan.jpg",
      title: "Seorang Pelari Di Bawah Pepohonan",
      location: "taman samarinda",
      category: "human-interest",
      photographer: "Fahri",
      tags: ["#samarinda", "#sport"],
      isUploaded: false
    },
    {
      id: 16,
      thumbnail: "img/Seorang penjual keliling yang tak kenal lelah.jpg",
      title: "Seorang penjual keliling yang tak kenal lelah",
      location: "taman samarinda",
      category: "human-interest",
      photographer: "Marvel",
      tags: ["#samarinda", "#vendor"],
      isUploaded: false
    },

    // Culinary Photos
    {
      id: 2,
      thumbnail: "img/Pedagang Jajanan Kaki Lima.jpg",
      title: "Pedagang Jajanan Kaki Lima",
      location: "Taman samarinda",
      category: "culinary",
      photographer: "Marvel",
      tags: ["#kuliner", "#streetfood"],
      isUploaded: false
    },
    {
      id: 38,
      thumbnail: "https://picsum.photos/400/300?random=202",
      title: "Kopi Pagi di Kedai Lokal",
      location: "Bandung",
      category: "culinary",
      photographer: "Fahri",
      tags: ["#kopi", "#kedai"],
      isUploaded: false
    },
    {
      id: 39,
      thumbnail: "https://picsum.photos/400/300?random=203",
      title: "Pedagang Bakso Keliling",
      location: "Jakarta",
      category: "culinary",
      photographer: "Sultan",
      tags: ["#bakso", "#kuliner"],
      isUploaded: false
    },
    {
      id: 40,
      thumbnail: "https://picsum.photos/400/300?random=204",
      title: "Menikmati Soto Lamongan",
      location: "Surabaya",
      category: "culinary",
      photographer: "Marvel",
      tags: ["#soto", "#kuliner"],
      isUploaded: false
    },
    {
      id: 41,
      thumbnail: "https://picsum.photos/400/300?random=205",
      title: "Aneka Rempah Dapur",
      location: "Pasar Tradisional",
      category: "culinary",
      photographer: "Fahri",
      tags: ["#rempah", "#pasar"],
      isUploaded: false
    },
    {
      id: 42,
      thumbnail: "https://picsum.photos/400/300?random=206",
      title: "Suasana Warung Kopi",
      location: "Malang",
      category: "culinary",
      photographer: "Sultan",
      tags: ["#warung", "#kopi"],
      isUploaded: false
    },

    // Social Activity Photos
    {
      id: 3,
      thumbnail: "img/Kumpulan Mahasiswa sedang Menyanyikan Yel-Yel.jpg",
      title: "Kumpulan Mahasiswa sedang Menyanyikan Yel-Yel",
      location: "islamic centre",
      category: "social-activity",
      photographer: "Sultan",
      tags: ["#mahasiswa", "#aktivitas"],
      isUploaded: false
    },
    {
      id: 17,
      thumbnail: "img/Belanja Mingguan sudah di edit.jpg",
      title: "Belanja Mingguan",
      location: "Mall lembuswana",
      category: "social-activity",
      photographer: "Fahri",
      tags: ["#samarinda", "#shopping"],
      isUploaded: false
    },
    {
      id: 18,
      thumbnail: "img/Istirahat Sejenak (1).jpg",
      title: "Istirahat Sejenak",
      location: "Mall lembuswana",
      category: "social-activity",
      photographer: "Marvel",
      tags: ["#samarinda", "#break"],
      isUploaded: false
    },
    {
      id: 19,
      thumbnail: "img/Percakapan di lorong lembuswana edit (1).jpg",
      title: "Percakapan di lorong",
      location: "Mall lembuswana",
      category: "social-activity",
      photographer: "Sultan",
      tags: ["#samarinda", "#conversation"],
      isUploaded: false
    },
    {
      id: 20,
      thumbnail: "img/Tugu Perjuangan Rakyat Kaltim.jpg",
      title: "Tugu Perjuangan Rakyat Kaltim",
      location: "Mall lembuswana",
      category: "social-activity",
      photographer: "Fahri",
      tags: ["#samarinda", "#monument"],
      isUploaded: false
    },
    {
      id: 21,
      thumbnail: "img/Mahasiswi Sedang Makan di Lorong Masjid.jpg",
      title: "Mahasiswi Sedang Makan di Lorong Masjid",
      location: "islamic centre",
      category: "social-activity",
      photographer: "Marvel",
      tags: ["#samarinda", "#student"],
      isUploaded: false
    },

    // Cityscape Photos
    {
      id: 22,
      thumbnail: "img/Arsitektur Gedung Gramedia.jpg",
      title: "Arsitektur Gedung Gramedia",
      location: "Mall lembuswana",
      category: "cityscape",
      photographer: "Sultan",
      tags: ["#samarinda", "#architecture"],
      isUploaded: false
    },
    {
      id: 23,
      thumbnail: "img/Gedung Dinas Kesehatan Kota Samarinda.jpg",
      title: "Gedung Dinas Kesehatan Kota Samarinda",
      location: "Taman samarinda",
      category: "cityscape",
      photographer: "Fahri",
      tags: ["#samarinda", "#government"],
      isUploaded: false
    },
    {
      id: 24,
      thumbnail: "img/Gedung Simbol Tanggap Darurat Kota Samarinda.jpg",
      title: "Gedung Simbol Tanggap Darurat Kota Samarinda",
      location: "Taman samarinda",
      category: "cityscape",
      photographer: "Marvel",
      tags: ["#samarinda", "#emergency"],
      isUploaded: false
    },
    {
      id: 25,
      thumbnail: "img/Lampu Hias Ikonik di Taman Samarendah.jpg",
      title: "Lampu Hias Ikonik di Taman Samarendah",
      location: "Taman samarinda",
      category: "cityscape",
      photographer: "Sultan",
      tags: ["#samarinda", "#decoration"],
      isUploaded: false
    },
    {
      id: 26,
      thumbnail: "img/Mall Lembuswana Samarinda Sudah di edit.jpg",
      title: "Mall Lembuswana Samarinda",
      location: "Mall Lembuswana",
      category: "cityscape",
      photographer: "Fahri",
      tags: ["#samarinda", "#mall"],
      isUploaded: false
    },
    {
      id: 27,
      thumbnail: "img/Masjid Al Jami' Al-Ma'ruf.jpg",
      title: "Masjid Al Jami' Al-Ma'ruf",
      location: "islamic center",
      category: "cityscape",
      photographer: "Marvel",
      tags: ["#samarinda", "#mosque"],
      isUploaded: false
    },
    {
      id: 28,
      thumbnail: "img/Patung Kuda Menjadi Ikon Taman Samarinda.jpg",
      title: "Patung Kuda Menjadi Ikon Taman Samarinda",
      location: "Taman Samarinda",
      category: "cityscape",
      photographer: "Sultan",
      tags: ["#samarinda", "#statue"],
      isUploaded: false
    },
    {
      id: 29,
      thumbnail: "img/Patung Lembuswana.jpg",
      title: "Patung Lembuswana",
      location: "Mall lembuswana",
      category: "cityscape",
      photographer: "Fahri",
      tags: ["#samarinda", "#landmark"],
      isUploaded: false
    },
    {
      id: 30,
      thumbnail: "img/Simpang 4 Lembuswana.jpg",
      title: "Simpang 4 Lembuswana",
      location: "Mall lembuswana",
      category: "cityscape",
      photographer: "Marvel",
      tags: ["#samarinda", "#intersection"],
      isUploaded: false
    },
    {
      id: 31,
      thumbnail: "img/Taman Samarinda.jpg",
      title: "Taman Samarinda",
      location: "Taman Samarinda",
      category: "cityscape",
      photographer: "Sultan",
      tags: ["#samarinda", "#park"],
      isUploaded: false
    },
    {
      id: 32,
      thumbnail: "img/Arsitektur dan Jejak Pejalan Kaki.jpg",
      title: "Arsitektur dan Jejak Pejalan Kaki",
      location: "Teras samarinda",
      category: "cityscape",
      photographer: "Fahri",
      tags: ["#samarinda", "#walkway"],
      isUploaded: false
    },
    {
      id: 33,
      thumbnail: "img/interior Tangga Masjid Islamic Center.jpg",
      title: "interior Tangga Masjid Islamic Center",
      location: "Islamic Center",
      category: "cityscape",
      photographer: "Marvel",
      tags: ["#samarinda", "#interior"],
      isUploaded: false
    },
    {
      id: 34,
      thumbnail: "img/Keindahan Masjid Islamic Center Samarinda.jpg",
      title: "Keindahan Masjid Islamic Center Samarinda",
      location: "Islamic Center",
      category: "cityscape",
      photographer: "Sultan",
      tags: ["#samarinda", "#beauty"],
      isUploaded: false
    },
    {
      id: 35,
      thumbnail: "img/LorongBerpilar DI Masjid Islamic Center.jpg",
      title: "LorongBerpilar DI Masjid Islamic Center",
      location: "Islamic Center",
      category: "cityscape",
      photographer: "Fahri",
      tags: ["#samarinda", "#corridor"],
      isUploaded: false
    },
    {
      id: 36,
      thumbnail: "img/Masjid Baitul Muttaqien Islamic Center Samarinda.jpg",
      title: "Masjid Baitul Muttaqien Islamic Center Samarinda",
      location: "Islamic Center",
      category: "cityscape",
      photographer: "Marvel",
      tags: ["#samarinda", "#worship"],
      isUploaded: false
    },

    // Environment Photos
    {
      id: 37,
      thumbnail: "img/Pemotor di dedaunan.jpg",
      title: "Pemotor di dedaunan",
      location: "Samarinda",
      category: "environment",
      photographer: "Sultan",
      tags: ["#samarinda", "#nature"],
      isUploaded: false
    }
  ];

  // Function to load and merge photos from localStorage with better error handling
  function loadPhotosFromStorage() {
    console.log('Loading photos from localStorage...');
    
    try {
      const savedPhotos = localStorage.getItem('walkingStoryPhotos');
      const deletedPhotos = JSON.parse(localStorage.getItem('deletedDefaultPhotos') || '[]');
      
      if (savedPhotos) {
        const parsedPhotos = JSON.parse(savedPhotos);
        const uploadedPhotos = parsedPhotos.filter(photo => photo.isUploaded === true);
        console.log('Uploaded photos loaded:', uploadedPhotos.length);
        
        // Filter out deleted default photos
        let filteredDefaultPhotos = [...defaultPhotos];
        if (deletedPhotos.length > 0) {
          filteredDefaultPhotos = defaultPhotos.filter(photo => !deletedPhotos.includes(photo.id));
          console.log('Filtered out deleted default photos:', deletedPhotos.length);
        }
        
        // Merge uploaded photos with filtered default photos, uploaded photos first
        photos = [...uploadedPhotos, ...filteredDefaultPhotos];
      } else {
        // Filter out deleted default photos even when no uploaded photos exist
        if (deletedPhotos.length > 0) {
          photos = defaultPhotos.filter(photo => !deletedPhotos.includes(photo.id));
        } else {
          photos = [...defaultPhotos];
        }
      }
      
      console.log('Total photos after loading:', photos.length);
    } catch (error) {
      console.error('Error loading photos from localStorage:', error);
      photos = [...defaultPhotos];
    }
  }

  // Initialize photos on page load
  loadPhotosFromStorage();
  
  // Add test photo for Street Photography demonstration
  const testPhoto = {
    id: Date.now(),
    thumbnail: "img/Pedagang Jajanan Kaki Lima.jpg",
    fileName: "test_street_photo.jpg",
    title: "Street Photography Test - Kuliner Samarinda",
    location: "Pasar Pagi Samarinda",
    category: "culinary",
    photographer: "Ahmad Rizki Pratama (Food Photographer)",
    tags: ["#samarinda", "#streetfood", "#culinary"],
    content: "Testing street photography integration with uploaded photo",
    supertext: "Test Photo",
    createdAt: new Date().toISOString(),
    isUploaded: true
  };
  
  // Add test photo to photos array for demonstration
  photos.unshift(testPhoto);
  
  // Load uploaded photos immediately after loading from storage
  loadUploadedPhotosIntoCategories();
  loadUploadedPhotosIntoStreetPhotography();

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
      // Re-initialize photo items for the category view
      setTimeout(() => {
        initializePhotoItems();
      }, 100);
    }
  }

  function showMain() {
    categoryViews.forEach((view) => (view.style.display = "none"));
    mainContent.style.display = "block";
    window.scrollTo(0, 0);
    // Re-initialize photo items for main view
    setTimeout(() => {
      initializePhotoItems();
    }, 100);
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
    console.log('Refreshing photos from admin...');
    loadPhotosFromStorage();
    loadUploadedPhotosIntoCategories();
    loadUploadedPhotosIntoStreetPhotography();
    initializePhotoItems(); // Re-initialize click handlers
  };

  // Call refresh function when page becomes visible (user returns from admin)
  document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
      console.log('Page became visible, refreshing photos...');
      loadPhotosFromStorage();
      loadUploadedPhotosIntoCategories();
      loadUploadedPhotosIntoStreetPhotography();
      initializePhotoItems();
    }
  });

  // Also refresh when page gains focus
  window.addEventListener('focus', function() {
    console.log('Page gained focus, refreshing photos...');
    loadPhotosFromStorage();
    loadUploadedPhotosIntoCategories();
    loadUploadedPhotosIntoStreetPhotography();
    initializePhotoItems();
  });

  // Listen for storage changes (when admin updates photos)
  window.addEventListener('storage', function(e) {
    if (e.key === 'walkingStoryPhotos' || e.key === 'deletedDefaultPhotos') {
      console.log('Storage changed, refreshing photos...');
      loadPhotosFromStorage();
      loadUploadedPhotosIntoCategories();
      loadUploadedPhotosIntoStreetPhotography();
      initializePhotoItems();
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
  window.openPhotoModal = function(title, imageSrc, location, tags, photographer, category, content, supertext) {
    // Create a modal with the exact design from the provided image
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.id = 'simple-photo-modal';
    
    // Format category display
    const categoryDisplay = category ? category.replace('-', ' ').toUpperCase() : 'STREET PHOTOGRAPHY';
    
    // Use the actual content from TinyMCE editor, or supertext, or fallback to default
    let displayContent = content || supertext || '';
    
    // If content is HTML, strip tags for display in modal (or keep basic formatting)
    if (displayContent.includes('<')) {
      // Keep basic text but remove complex HTML tags
      displayContent = displayContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    }
    
    // Limit content length for modal display
    if (displayContent.length > 150) {
      displayContent = displayContent.substring(0, 150) + '...';
    }
    
    modal.innerHTML = `
      <div class="bg-white rounded-lg max-w-md w-full mx-4 overflow-hidden">
        <!-- Header with logo -->
        <div class="bg-white p-4 border-b">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center mr-2">
                <div class="w-4 h-4 bg-white rounded-full"></div>
              </div>
              <span class="text-sm font-medium text-gray-800">WALKING STORY</span>
            </div>
            <button onclick="closeSimplePhotoModal()" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <div class="mt-1">
            <span class="text-xs text-gray-500">PHOTOGRAPHY</span>
          </div>
        </div>
        
        <!-- Content -->
        <div class="p-4">
          <h2 class="text-lg font-bold text-gray-900 mb-2">${title}</h2>
          <p class="text-sm text-gray-600 mb-3">${displayContent}</p>
          
          <!-- Details -->
          <div class="space-y-1 mb-4">
            <p class="text-sm text-gray-600">Lokasi: ${location}</p>
            <p class="text-sm text-gray-600">Fotografer: ${photographer || 'Unknown'}</p>
            <p class="text-sm text-gray-600">Kategori: ${categoryDisplay}</p>
          </div>
          
          <!-- Image -->
          <div class="mb-4">
            <img src="${imageSrc}" alt="${title}" class="w-full h-48 object-cover rounded-lg">
          </div>
          
          <!-- Bottom section -->
          <div class="text-center border-t pt-4">
            <p class="text-sm text-gray-600 mb-2">Samarinda</p>
            <div class="mb-3">
              <h4 class="text-sm font-semibold text-gray-800 mb-2">Categories</h4>
              <div class="grid grid-cols-3 gap-2">
                <div class="bg-gray-800 text-white text-xs py-1 px-2 rounded text-center">HUMAN INTEREST</div>
                <div class="bg-orange-500 text-white text-xs py-1 px-2 rounded text-center">CULINARY</div>
                <div class="bg-amber-600 text-white text-xs py-1 px-2 rounded text-center">SOCIAL ACTIVITY</div>
                <div class="bg-gray-600 text-white text-xs py-1 px-2 rounded text-center">CITYSCAPE</div>
                <div class="bg-red-500 text-white text-xs py-1 px-2 rounded text-center">PUBLIC SPACE</div>
                <div class="bg-green-600 text-white text-xs py-1 px-2 rounded text-center">ENVIRONMENT</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        closeSimplePhotoModal();
      }
    });
    
    // Close modal with Escape key
    const handleEscape = function(e) {
      if (e.key === 'Escape') {
        closeSimplePhotoModal();
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);
  };
  
  // Function to close simple photo modal
  window.closeSimplePhotoModal = function() {
    const modal = document.getElementById('simple-photo-modal');
    if (modal) {
      modal.remove();
    }
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
      window.openPhotoModal(
        photo.title, 
        photo.thumbnail, 
        photo.location, 
        photo.tags || [], 
        photo.content || photo.supertext || '', 
        photo.supertext || ''
      );
    }
  };

  // Show next photo in modal
  window.nextPhoto = function() {
    if (currentPhotoIndex < photos.length - 1) {
      currentPhotoIndex++;
      const photo = photos[currentPhotoIndex];
      window.openPhotoModal(
        photo.title, 
        photo.thumbnail, 
        photo.location, 
        photo.tags || [], 
        photo.content || photo.supertext || '', 
        photo.supertext || ''
      );
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
      // Remove existing event listeners to prevent duplicates
      item.replaceWith(item.cloneNode(true));
    });
    
    // Re-select photo items after cloning
    const newPhotoItems = document.querySelectorAll(".photo-item");
    newPhotoItems.forEach((item, index) => {
      item.addEventListener("click", () => {
        // Get the current category view to filter photos
        const activeView = document.querySelector('.category-view[style*="block"]');
        let categoryPhotos = photos;
        let photoToShow;
        
        if (activeView) {
          const categoryName = activeView.id.replace('-view', '');
          categoryPhotos = photos.filter(photo => photo.category === categoryName);
          photoToShow = categoryPhotos[index];
        } else {
          // For Street Photography section, use all photos
          photoToShow = photos[index];
        }
        
        if (photoToShow) {
          currentPhotoIndex = index;
          window.openPhotoModal(
            photoToShow.title, 
            photoToShow.thumbnail, 
            photoToShow.location, 
            photoToShow.tags || [], 
            photoToShow.photographer, 
            photoToShow.category,
            photoToShow.content,
            photoToShow.supertext
          );
        }
      });
    });
  }

  // Function to dynamically load uploaded photos into category views
  function loadUploadedPhotosIntoCategories() {
    console.log('Loading uploaded photos into categories...');
    
    // Clear existing uploaded photos first to avoid duplicates
    const uploadedPhotoItems = document.querySelectorAll('.photo-item[data-uploaded="true"]');
    uploadedPhotoItems.forEach(item => item.remove());
    
    const uploadedPhotos = photos.filter(photo => photo.isUploaded);
    console.log('Found uploaded photos for categories:', uploadedPhotos.length);
    
    uploadedPhotos.forEach(photo => {
      if (photo.category) {
        const categoryView = document.getElementById(`${photo.category}-view`);
        if (categoryView) {
          const photoGrid = categoryView.querySelector('.grid');
          if (photoGrid) {
            // Create new photo item element
            const photoItem = document.createElement('div');
            photoItem.className = 'photo-item relative overflow-hidden rounded-lg shadow-lg group cursor-pointer';
            photoItem.setAttribute('data-uploaded', 'true'); // Mark as uploaded for easy removal
            photoItem.innerHTML = `
              <img src="${photo.thumbnail}" alt="${photo.title}" class="w-full h-64 object-cover" onerror="this.src='https://via.placeholder.com/400x300?text=Image+Not+Found'">
              <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300"></div>
              <div class="photo-tooltip absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h4 class="font-bold text-lg">${photo.title}</h4>
                <p class="text-sm">📍${photo.location}</p>
                <p class="text-xs mt-1 bg-green-600 bg-opacity-75 px-2 py-1 rounded">Uploaded</p>
              </div>
            `;
            
            // Insert at the beginning of the grid
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
  }

  // Function to load uploaded photos into Street Photography section
  function loadUploadedPhotosIntoStreetPhotography() {
    console.log('Loading uploaded photos into Street Photography section...');
    
    // Find Street Photography section more specifically
    const streetPhotographySection = document.querySelector('section.py-12.bg-white');
    console.log('Street Photography section found:', !!streetPhotographySection);
    
    if (streetPhotographySection) {
      // Look for the grid within Street Photography section
      const streetGrid = streetPhotographySection.querySelector('.grid');
      console.log('Street grid found:', !!streetGrid);
      
      if (streetGrid) {
        // Clear existing uploaded photos first to avoid duplicates
        const uploadedStreetPhotos = streetGrid.querySelectorAll('.street-photo[data-uploaded="true"]');
        uploadedStreetPhotos.forEach(item => item.remove());
        
        // Get uploaded photos
        const uploadedPhotos = photos.filter(photo => photo.isUploaded);
        console.log('Uploaded photos found:', uploadedPhotos.length);
        
        uploadedPhotos.forEach((photo, index) => {
          console.log(`Processing uploaded photo ${index + 1}:`, photo.title);
          
          // Create new street photo item that matches existing style
          const streetPhotoItem = document.createElement('div');
          streetPhotoItem.className = 'street-photo relative overflow-hidden rounded-lg shadow-lg group cursor-pointer';
          streetPhotoItem.setAttribute('data-uploaded', 'true'); // Mark as uploaded for easy removal
          streetPhotoItem.innerHTML = `
            <div class="aspect-w-3 aspect-h-2 bg-gradient-to-br from-blue-400 to-blue-600 relative h-64">
              <img src="${photo.thumbnail}" alt="${photo.title}" class="absolute inset-0 w-full h-full object-cover" onerror="this.src='https://via.placeholder.com/400x300?text=Image+Not+Found'">
              <div class="absolute inset-0 bg-black bg-opacity-20"></div>
              <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div class="text-center text-white p-4">
                  <h4 class="font-bold text-lg mb-2">${photo.title}</h4>
                  <p class="text-sm">📍${photo.location}</p>
                  <p class="text-xs mt-1">by ${photo.photographer || 'Unknown'}</p>
                  <p class="text-xs mt-1 bg-green-600 bg-opacity-75 px-2 py-1 rounded">${photo.category || 'street-photography'}</p>
                  <p class="text-xs mt-1 bg-blue-600 bg-opacity-75 px-2 py-1 rounded">Uploaded</p>
                </div>
              </div>
            </div>
          `;
          
          // Add click event to open modal
          streetPhotoItem.addEventListener('click', () => {
            window.openPhotoModal(photo.title, photo.thumbnail, photo.location, photo.tags || [], photo.photographer, photo.category, photo.content, photo.supertext);
          });
          
          // Add to the beginning of the grid to show uploaded photos first
          const firstChild = streetGrid.firstElementChild;
          if (firstChild) {
            streetGrid.insertBefore(streetPhotoItem, firstChild);
          } else {
            streetGrid.appendChild(streetPhotoItem);
          }
        });
        
        console.log('Street Photography integration completed');
      } else {
        console.error('Street grid not found');
      }
    } else {
      console.error('Street Photography section not found');
    }
  }

  // Function to handle photo URL parameter
  function handlePhotoUrlParameter() {
    if (photoId) {
      // Find the photo by ID
      const photo = photos.find(p => p.id == photoId);
      if (photo) {
        // Open the photo modal automatically
        setTimeout(() => {
          window.openPhotoModal(photo.title, photo.thumbnail, photo.location, photo.tags || [], photo.photographer, photo.category);
        }, 500); // Small delay to ensure DOM is ready
      }
    }
  }

  // Initialize photo items on page load
  initializePhotoItems();
  
  // Load uploaded photos into categories
  loadUploadedPhotosIntoCategories();
  
  // Load uploaded photos into Street Photography section
  loadUploadedPhotosIntoStreetPhotography();
  
  // Handle photo URL parameter if present
  handlePhotoUrlParameter();

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