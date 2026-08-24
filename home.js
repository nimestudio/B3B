// Hero loader

document.addEventListener("DOMContentLoaded", () => {
  const loaderWrap = document.querySelector(".hero-loader-wrap");
  const gridContainer = document.querySelector(".hero-grid-container");
  const gridItems = document.querySelectorAll(".hero-grid-item:not(.video-cell)");
  const allItems = document.querySelectorAll(".hero-grid-item");
  const heroImages = document.querySelectorAll(".hero-image");
  const heroContent = document.querySelectorAll(".home-hero-wrap > *");
  const navbar = document.querySelector(".navbar-overlay");

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

  gsap.set(heroContent, {
    opacity: 0
  });

  const tl = gsap.timeline({
    defaults: { ease: "power3.inOut" }
  });

  tl.to(gridContainer, {
    opacity: 1,
    duration: 1.5,
    delay: 1,
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
    opacity: 1,
    duration: 1,
    ease: "power2.out"
  }, "-=0.2")
  .to(heroContent, {
    opacity: 1,
    duration: 0.8,
    stagger: 0.2,
    ease: "power2.out"
  }, "<0.3");
});

// Hero cursor

const heroSection = document.querySelector('.section-home-hero');
const heroCursor = document.querySelector('.hero-cursor');
const isHoverable = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

if (heroSection && heroCursor && isHoverable) {
  const xTo = gsap.quickTo(heroCursor, "x", { duration: 0.6, ease: "power3.out" });
  const yTo = gsap.quickTo(heroCursor, "y", { duration: 0.6, ease: "power3.out" });

  window.addEventListener('mousemove', (e) => {
    xTo(e.clientX);
    yTo(e.clientY);
  });

  heroSection.addEventListener('mouseenter', () => {
    heroCursor.classList.add('is-visible');
  });

  heroSection.addEventListener('mouseleave', () => {
    heroCursor.classList.remove('is-visible');
  });
}

// Video play/pause functionality

const videos = document.querySelectorAll('.custom-video');
const playPauseBtn = document.querySelector('.play-pause-btn');

if (videos.length && playPauseBtn) {
  const pauseIcon = playPauseBtn.querySelector('.video-button-pause');
  const playIcon = playPauseBtn.querySelector('.video-button-play');

  playPauseBtn.addEventListener('click', () => {
    const isPaused = Array.from(videos).some(video => video.paused);

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