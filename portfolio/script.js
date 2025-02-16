document.addEventListener("DOMContentLoaded", function () {
  // Inicializar AOS
  AOS.init({
    duration: 800,
    offset: 100,
    once: true,
  });

  // Menu mobile
  const menuBtn = document.querySelector(".menu-btn");
  const navLinks = document.querySelector(".nav-links");

  menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute("href")).scrollIntoView({
        behavior: "smooth",
      });
    });
  });

  // Animação do texto na hero section
  const heroTitle = document.querySelector(".hero-content h1");
  const heroSubtitle = document.querySelector(".hero-content h2");

  heroTitle.style.opacity = "0";
  heroSubtitle.style.opacity = "0";

  setTimeout(() => {
    heroTitle.style.transition = "opacity 1s";
    heroTitle.style.opacity = "1";
  }, 500);

  setTimeout(() => {
    heroSubtitle.style.transition = "opacity 1s";
    heroSubtitle.style.opacity = "1";
  }, 1000);

  // Configuração do Swiper
  const swiper = new Swiper(".projectSwiper", {
    effect: "fade",
    loop: true,
    autoplay: {
      delay: 5000, // Aumentado para 5 segundos
      disableOnInteraction: false,
    },
    fadeEffect: {
      crossFade: true,
    },
    speed: 1000, // Transição mais suave
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });

  // Animação de scroll mais suave para todos os elementos
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        }
      });
    },
    {
      threshold: 0.1,
    }
  );

  document.querySelectorAll(".project-card, .skill-card").forEach((el) => {
    observer.observe(el);
  });

  // Animação dos números nas métricas
  function animateMetrics() {
    const metrics = document.querySelectorAll(".metric-value");
    metrics.forEach((metric) => {
      const target = parseInt(metric.textContent);
      let current = 0;
      const increment = target / 50;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          metric.textContent =
            target + (metric.textContent.includes("+") ? "+" : "");
          clearInterval(timer);
        } else {
          metric.textContent = Math.round(current);
        }
      }, 30);
    });
  }

  // Observador para iniciar animação quando visível
  const metricsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateMetrics();
          metricsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  document
    .querySelectorAll(".project-impact, .project-metrics")
    .forEach((el) => {
      metricsObserver.observe(el);
    });
});
