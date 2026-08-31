// Hero loader

document.addEventListener("DOMContentLoaded", () => {
  const loaderWrap = document.querySelector(".hero-loader-wrap");
  const gridContainer = document.querySelector(".hero-grid-container");
  const gridItems = document.querySelectorAll(".hero-grid-item:not(.video-cell)");
  const allItems = document.querySelectorAll(".hero-grid-item");
  const heroImages = document.querySelectorAll(".hero-image");
  const heroContent = document.querySelectorAll(".home-hero-text-wrap > *");
  const navbar = document.querySelector(".navbar-overlay");
  const heroCursor = document.querySelector(".hero-cursor");
  const videoButton = document.querySelector(".play-pause-btn");

  if (!loaderWrap) return;

  gsap.set(gridContainer, {
    scale: 1.5,
    rotation: -15,
    opacity: 0,
    gap: "0.667rem"
  });

  gsap.set(heroImages, {
    scale: 1.2
  });

  gsap.set(allItems, {
    borderRadius: "0.25rem"
  });

  gsap.set([heroContent, heroCursor, videoButton], {
    opacity: 0
  });

  gsap.set(navbar, { y: "-100%" });

  const tl = gsap.timeline({
    defaults: { ease: "power3.inOut" },
    onComplete: () => {
      window.dispatchEvent(new Event("heroLoaderFinished"));
    }
  });

  tl.to(gridContainer, {
    opacity: 1,
    duration: 1.5,
    delay: 0.6,
    ease: "power2.out"
  })
  .to(gridContainer, {
    rotation: 0,
    scale: 1.8,
    gap: "0.556rem",
    duration: 1.5
  }, "-=0.6")
  .to(heroImages, {
    scale: 1.05,
    duration: 1.5
  }, "<")
  .to(allItems, {
    borderRadius: "0.3rem",
    duration: 1.5
  }, "<")
  .to(gridContainer, {
    scale: 5.2,
    gap: "0rem",
    duration: 1.6,
    ease: "expo.inOut"
  })
  .to(allItems, {
    borderRadius: "0rem",
    duration: 1.6,
    ease: "expo.inOut"
  }, "<")
  .to(gridItems, {
    opacity: 0,
    duration: 0.8,
    ease: "power2.in"
  }, "<0.4")
  .set(loaderWrap, {
    pointerEvents: "none"
  })
  .to(navbar, {
    y: "0%",
    duration: 1,
    ease: "power2.out"
  }, "-=0.2")
  .to(heroContent, {
    opacity: 1,
    duration: 1,
    stagger: 0.2
  }, "<0.3")
  .to(videoButton, {
    opacity: 1,
    duration: 0.8
  }, "<0.3")
  .to(heroCursor, {
    opacity: 1,
    duration: 0.5
  }, "<0.5");
});

// Hero interactions

const heroSection = document.querySelector('.section-home-hero');
const heroCursor = document.querySelector('.hero-cursor');
const videoBtn = document.querySelector('.play-pause-btn');
const loaderWrap = document.querySelector('.hero-loader-wrap');
const isHoverable = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

if (heroSection && heroCursor && isHoverable) {
  let isLoaderActive = !!loaderWrap;

  const xTo = gsap.quickTo(heroCursor, "x", { duration: 0.6, ease: "power3.out" });
  const yTo = gsap.quickTo(heroCursor, "y", { duration: 0.6, ease: "power3.out" });

  if (videoBtn && !isLoaderActive) {
    gsap.set(videoBtn, { opacity: 0 });
  }

  window.addEventListener('mousemove', (e) => {
    xTo(e.clientX);
    yTo(e.clientY);
  });

  heroSection.addEventListener('mouseenter', () => {
    heroCursor.classList.add('is-visible');
    if (videoBtn && !isLoaderActive) {
      gsap.to(videoBtn, { opacity: 1, duration: 0.3, ease: "power2.out" });
    }
  });

  heroSection.addEventListener('mouseleave', () => {
    heroCursor.classList.remove('is-visible');
    if (videoBtn && !isLoaderActive) {
      gsap.to(videoBtn, { opacity: 0, duration: 0.3, ease: "power2.out" });
    }
  });

  if (videoBtn) {
    videoBtn.addEventListener('mouseenter', () => {
      heroCursor.classList.remove('is-visible');
    });

    videoBtn.addEventListener('mouseleave', () => {
      heroCursor.classList.add('is-visible');
    });
  }

  window.addEventListener('heroLoaderFinished', () => {
    isLoaderActive = false;
    if (videoBtn) {
      const isHoveringHero = heroSection.matches(':hover');
      if (!isHoveringHero) {
        gsap.to(videoBtn, { opacity: 0, duration: 0.4, ease: "power2.out" });
      }
    }
  });
}

const videos = document.querySelectorAll('.custom-video');
const playPauseBtn = document.querySelector('.play-pause-btn');

if (videos.length && playPauseBtn) {
  const pauseIcon = playPauseBtn.querySelector('.video-button-pause');
  const playIcon = playPauseBtn.querySelector('.video-button-play');

  playPauseBtn.addEventListener('click', () => {
    const activeVideo = Array.from(videos).find(video => video.offsetWidth > 0) || videos[0];
    const isPaused = activeVideo.paused;

    videos.forEach((video) => {
      if (isPaused) {
        video.play();
      } else {
        video.pause();
      }
    });

    if (isPaused) {
      if (pauseIcon) pauseIcon.style.opacity = '1';
      if (playIcon) playIcon.style.opacity = '0';
      playPauseBtn.classList.remove('is-paused');
    } else {
      if (pauseIcon) pauseIcon.style.opacity = '0';
      if (playIcon) playIcon.style.opacity = '1';
      playPauseBtn.classList.add('is-paused');
    }
  });
}

// Sort and filter blog posts
function parseCustomDate(dateStr) {
  const parts = dateStr.trim().split('.');
  if (parts.length === 3) {
    return new Date(2000 + parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10)).getTime();
  }
  return 0;
}

function processFeaturedPosts() {
  const container = document.querySelector('.blog-posts-list');
  if (!container) return;

  const postItems = Array.from(container.querySelectorAll('.blog-post-item-wrap'));
  const topPerCategory = {};

  postItems.forEach(item => {
    item.style.display = '';
    
    const categoryLabel = item.querySelector('.blog-post-item-category');
    const dateLabel = item.querySelector('.blog-post-item-date');
    const category = categoryLabel ? categoryLabel.textContent.trim() : '';
    const timestamp = dateLabel ? parseCustomDate(dateLabel.textContent) : 0;

    if (!topPerCategory[category] || timestamp > topPerCategory[category].timestamp) {
      topPerCategory[category] = { item, timestamp };
    }
  });

  postItems.forEach(item => {
    const categoryLabel = item.querySelector('.blog-post-item-category');
    const category = categoryLabel ? categoryLabel.textContent.trim() : '';

    if (topPerCategory[category].item !== item) {
      item.style.display = 'none';
    }
  });
}

document.addEventListener('DOMContentLoaded', processFeaturedPosts);

window.fsAttributes = window.fsAttributes || [];
window.fsAttributes.push([
  'cmsfilter',
  (filterInstances) => {
    filterInstances[0].listInstance.on('renderitems', processFeaturedPosts);
  }
]);

// News popup

const noticias = document.querySelector('.noticias');

if (noticias) {
  const noticiaItem = noticias.querySelector('.noticia-item');

  if (!noticiaItem) {
    noticias.style.display = 'none';
  } else {
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
    };

    const setCookie = (name, value, days) => {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`;
    };

    if (getCookie('popupClosed')) {
      noticias.style.display = 'none';
    } else {
      noticias.style.opacity = '0';
      noticias.style.display = 'none';
      noticias.style.transition = 'opacity 0.4s ease';

      window.addEventListener('load', () => {
        setTimeout(() => {
          noticias.style.display = 'block';
          noticias.offsetHeight; 
          noticias.style.opacity = '1';
        }, 8000);
      });

      const closeBtn = noticias.querySelector('.noticia-close-button');
      
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          noticias.style.opacity = '0';
          
          setTimeout(() => {
            noticias.style.display = 'none';
            setCookie('popupClosed', 'true', 30);
          }, 400);
        });
      }
    }
  }
}