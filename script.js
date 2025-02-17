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

  fetchGitHubData();
});

// Função para buscar dados do GitHub
async function fetchGitHubData() {
  const username = "kellyson71";
  try {
    // Buscar dados do perfil
    const profileResponse = await fetch(
      `https://api.github.com/users/${username}`
    );
    const profile = await profileResponse.json();

    // Buscar repositórios
    const reposResponse = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=6`
    );
    const repos = await reposResponse.json();

    updateGitHubSection(profile, repos);
  } catch (error) {
    console.error("Erro ao buscar dados do GitHub:", error);
  }
}

function updateGitHubSection(profile, repos) {
  const githubContainerEl = document.querySelector(".github-container");

  // Atualizar perfil e contribuições
  const overviewHtml = `
    <div class="github-overview">
      <div class="github-profile">
        <img src="${profile.avatar_url}" alt="Profile" class="github-avatar">
        <div class="github-info">
          <h3>${profile.name || profile.login}</h3>
          <p>${profile.bio || "Desenvolvedor Full Stack"}</p>
          <div class="github-stats">
            <span><i class="fas fa-code-branch"></i> ${
              profile.public_repos
            } repos</span>
            <span><i class="fas fa-users"></i> ${
              profile.followers
            } seguidores</span>
            <span><i class="fas fa-star"></i> ${
              profile.public_gists
            } gists</span>
          </div>
        </div>
      </div>
      <div class="contribution-card">
        <h4>Contribuições</h4>
        <img 
          src="https://ghchart.rshah.org/${profile.login}" 
          alt="Contribution Graph"
          class="contribution-graph"
        >
      </div>
    </div>
  `;

  // Atualizar lista de repositórios
  const reposHtml = `
    <div class="github-repos">
      ${repos
        .map(
          (repo) => `
        <div class="repo-card">
          <div class="repo-header">
            <a href="${repo.html_url}" target="_blank" class="repo-name">
              <i class="fas fa-code-branch"></i> ${repo.name}
            </a>
            <span class="repo-visibility">${
              repo.private ? "Privado" : "Público"
            }</span>
          </div>
          <p class="repo-description">${
            repo.description || "Sem descrição disponível"
          }</p>
          <div class="repo-meta">
            <span><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
            <span><i class="fas fa-code-fork"></i> ${repo.forks_count}</span>
            <span><i class="fas fa-history"></i> ${new Date(
              repo.updated_at
            ).toLocaleDateString()}</span>
          </div>
          ${
            repo.language
              ? `
            <div class="repo-languages">
              <span class="language-tag">
                <span class="language-color" style="background-color: ${getLanguageColor(
                  repo.language
                )}"></span>
                ${repo.language}
              </span>
            </div>
          `
              : ""
          }
        </div>
      `
        )
        .join("")}
    </div>
  `;

  // Inserir conteúdo
  githubContainerEl.innerHTML = `
    <div class="github-header">
      <h2 class="section-title" data-subtitle="Contribuições Open Source">Meu GitHub</h2>
    </div>
    ${overviewHtml}
    ${reposHtml}
  `;
}

// Função auxiliar para cores das linguagens
function getLanguageColor(language) {
  const colors = {
    JavaScript: "#f1e05a",
    Python: "#3572A5",
    PHP: "#4F5D95",
    HTML: "#e34c26",
    CSS: "#563d7c",
    TypeScript: "#2b7489",
    Java: "#b07219",
    "C++": "#f34b7d",
    Ruby: "#701516",
    // Adicione mais cores conforme necessário
  };
  return colors[language] || "#8b8b8b";
}
