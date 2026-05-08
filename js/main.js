document.addEventListener("DOMContentLoaded", () => {
  // 1. Navigation Scroll Effect
  const navbar = document.getElementById("navbar");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // 2. Mobile Menu Toggle
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  const links = document.querySelectorAll(".nav-links li");

  hamburger.addEventListener("click", () => {
    // Toggle Nav
    navLinks.classList.toggle("active");
    hamburger.classList.toggle("active");

    // Animate Links
    links.forEach((link, index) => {
      if (link.style.animation) {
        link.style.animation = "";
      } else {
        link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
      }
    });
  });

  // Close mobile menu when a link is clicked
  links.forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
      hamburger.classList.remove("active");
    });
  });

  // 3. Smooth Scrolling
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        // Account for fixed header height
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // 4. Reveal Animations on Scroll
  const observerOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, observerOptions);

  const animatedElements = document.querySelectorAll(
    ".fade-in, .fade-in-up, .fade-in-left, .fade-in-right, .hero-content > *",
  );
  animatedElements.forEach((el) => observer.observe(el));

  // 5. Form Handling
  const quoteForm = document.getElementById("quoteForm");
  const submitBtn = quoteForm.querySelector('button[type="submit"]');
  const btnText = submitBtn.querySelector(".btn-text");
  const loader = submitBtn.querySelector(".loader");
  const feedback = quoteForm.querySelector(".form-feedback");

  const WHATSAPP_NUMBER = "263780570390"; // Bite & Bloom WhatsApp number

  quoteForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Simple Validation
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const eventType = document.getElementById("event-type").value;
    const guests = document.getElementById("guests").value;
    const date = document.getElementById("date").value;
    const message = document.getElementById("message").value;

    if (name.trim() === "" || phone.trim() === "") {
      showFeedback("Please fill in all required fields.", "error");
      return;
    }

    // Simulate Loading
    setLoading(true);

    // Build WhatsApp Message
    let waMessage = `*New Inquiry from Bite & Bloom Catering Website*\n\n`;
    waMessage += `*Name:* ${name}\n`;
    waMessage += `*Phone:* ${phone}\n`;
    if(eventType) waMessage += `*Event Type:* ${eventType}\n`;
    if(guests) waMessage += `*Guests:* ${guests}\n`;
    if(date) waMessage += `*Date:* ${date}\n`;
    if(message) waMessage += `*Message:* ${message}\n`;

    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMessage)}`;

    // Simulate API call / Email sending then redirect
    setTimeout(() => {
      setLoading(false);
      showFeedback(
        "Redirecting to WhatsApp...",
        "success",
      );
      
      // Open WhatsApp
      window.open(waUrl, '_blank');

      quoteForm.reset();

      // Clear success message after 5 seconds
      setTimeout(() => {
        feedback.textContent = "";
        feedback.className = "form-feedback";
      }, 5000);
    }, 1000);
  });

  function setLoading(isLoading) {
    if (isLoading) {
      submitBtn.disabled = true;
      btnText.style.display = "none";
      // Add simple CSS loader if not present, or toggle visibility
      if (!loader.innerHTML) {
        loader.style.width = "20px";
        loader.style.height = "20px";
        loader.style.border = "3px solid #ffffff";
        loader.style.borderTop = "3px solid transparent";
        loader.style.borderRadius = "50%";
        loader.style.animation = "spin 1s linear infinite";
        loader.style.margin = "0 auto";

        // Add keyframes for spin if not in CSS
        if (!document.getElementById("loader-style")) {
          const style = document.createElement("style");
          style.id = "loader-style";
          style.innerHTML = `
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                    `;
          document.head.appendChild(style);
        }
      }
      loader.style.display = "block";
    } else {
      submitBtn.disabled = false;
      btnText.style.display = "block";
      loader.style.display = "none";
    }
  }

  function showFeedback(message, type) {
    feedback.textContent = message;
    feedback.className = `form-feedback ${type}`;

    if (type === "error") {
      feedback.style.color = "#e74c3c";
    } else {
      feedback.style.color = "#27ae60";
    }
    feedback.style.marginTop = "10px";
    feedback.style.fontWeight = "500";
  }

  // 6. Menu Item Click to WhatsApp
  const menuItems = document.querySelectorAll('.menu-item');
  menuItems.forEach(item => {
    item.style.cursor = 'pointer'; // Make it look clickable
    item.addEventListener('click', () => {
        const title = item.querySelector('h3').innerText;
        const price = item.querySelector('.price').innerText;
        
        let waMessage = `Hi Bite & Bloom!\nI'm interested in:\n\n*${title}* - ${price}\n\nPlease let me know availability.`;
        const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMessage)}`;
        
        window.open(waUrl, '_blank');
    });
  });
  // 6. Services Carousel
  const track = document.querySelector(".services-track");
  const slides = Array.from(track.children);
  const nextButton = document.querySelector(".next-btn");
  const prevButton = document.querySelector(".prev-btn");
  const dotsNav = document.querySelector(".carousel-dots");

  if (track && slides.length > 0) {
    let slideWidth = slides[0].getBoundingClientRect().width;
    
    // Function to update slide width on resize
    const updateSlideWidth = () => {
      slideWidth = slides[0].getBoundingClientRect().width;
      // Also need to account for gap in translation logic potentially, 
      // but for simplicity we rely on percentage movements or re-calculating position
      moveToSlide(currentSlideIndex);
    };

    window.addEventListener('resize', () => {
        // Debounce resize
        clearTimeout(window.resizeTimer);
        window.resizeTimer = setTimeout(updateSlideWidth, 200);
    });

    // Create dots
    const cardsPerView = () => {
        if(window.innerWidth >= 1024) return 3;
        if(window.innerWidth >= 768) return 2;
        return 1;
    }
    
    // We need to group dots based on how many "pages" of slides we have 
    // OR just one dot per slide and we handle the bounds.
    // Let's go simple: One dot per slide, but we stop sliding when we hit the end.
    
    slides.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.classList.add("dot");
      if (index === 0) dot.classList.add("active");
      dotsNav.appendChild(dot);
      
      dot.addEventListener('click', () => {
        currentSlideIndex = index;
        moveToSlide(currentSlideIndex);
      });
    });

    const dots = Array.from(dotsNav.children);
    let currentSlideIndex = 0;

    const moveToSlide = (index) => {
      // Bounds check
      const viewCount = cardsPerView();
      const maxIndex = slides.length - viewCount;
      
      if(index < 0) index = 0;
      if(index > maxIndex) index = maxIndex;
      
      currentSlideIndex = index;

      // Calculate move amount
      // We use gap = 20px. 
      // It's easier to move by percentage of the container or calculating exact pixels.
      // Since specific flex-basis is used, let's use the card width + gap.
      const gap = 20;
      const amountToMove = (slideWidth + gap) * currentSlideIndex;
      
      track.style.transform = `translateX(-${amountToMove}px)`;

      // Update dots
      dots.forEach(d => d.classList.remove('active'));
      if(dots[currentSlideIndex]) dots[currentSlideIndex].classList.add('active'); // Highlight the leader dot
      
      // Update arrows state
      prevButton.disabled = currentSlideIndex === 0;
      nextButton.disabled = currentSlideIndex >= maxIndex;
    };

    // Initial check
    moveToSlide(0);

    // Event Listeners
    nextButton.addEventListener("click", () => {
      moveToSlide(currentSlideIndex + 1);
    });

    prevButton.addEventListener("click", () => {
      moveToSlide(currentSlideIndex - 1);
    });
    
    // Initial width set
    updateSlideWidth();
  }
});
