// Navbar fade-in on page load

document.addEventListener("DOMContentLoaded", () => {
  const isHomepageLoaderPresent = document.querySelector(".hero-loader-wrap");
  const navbar = document.querySelector(".navbar-overlay");
  
  if (!isHomepageLoaderPresent && navbar) {
    gsap.to(navbar, {
      opacity: 1,
      duration: 1,
      ease: "power2.out"
    });
  }
});

// Navbar logo interaction
let mm = gsap.matchMedia();

mm.add("(min-width: 1281px)", () => {
  const logoWrap = document.querySelector('.navbar-logo-inner');
  if (!logoWrap) return;

  const logo = logoWrap.querySelector('.navbar-logo');
  const logoHover = logoWrap.querySelector('.navbar-logo-hover');

  const handleMouseEnter = () => {
    gsap.to(logoWrap, { width: '386px', duration: 0.6, ease: 'power1.inOut', overwrite: 'auto' });
    gsap.set(logo, { opacity: 0 });
    gsap.set(logoHover, { opacity: 1 });
  };

  const handleMouseLeave = () => {
    gsap.to(logoWrap, {
      width: '137px',
      duration: 0.6,
      ease: 'power2.inOut',
      overwrite: 'auto',
      onComplete: () => {
        gsap.set(logo, { opacity: 1 });
        gsap.set(logoHover, { opacity: 0 });
      }
    });
  };

  logoWrap.addEventListener('mouseenter', handleMouseEnter);
  logoWrap.addEventListener('mouseleave', handleMouseLeave);

  return () => {
    logoWrap.removeEventListener('mouseenter', handleMouseEnter);
    logoWrap.removeEventListener('mouseleave', handleMouseLeave);
    if (logoWrap) gsap.set(logoWrap, { clearProps: 'width' });
    if (logo) gsap.set(logo, { clearProps: 'opacity' });
    if (logoHover) gsap.set(logoHover, { clearProps: 'opacity' });
  };
});

// Gradient Button Moving Circles
document.querySelectorAll('.button-border-color-wrap').forEach((wrap) => {
  const circles = wrap.querySelectorAll('.button-gradient-circle');
  const spacing = 7;

  circles.forEach((circle, index) => {
    const startPos = index * spacing;
    const proxy = { value: startPos };

    circle.style.offsetDistance = `${startPos}%`;

    const tl = gsap.timeline({ repeat: -1 });

    tl.to(proxy, {
      value: startPos + 50,
      duration: 8,
      ease: 'none',
      onUpdate: () => {
        circle.style.offsetDistance = `${proxy.value % 100}%`;
      }
    })
    .to({}, { duration: 2 })
    .to(proxy, {
      value: startPos + 100,
      duration: 8,
      ease: 'none',
      onUpdate: () => {
        circle.style.offsetDistance = `${proxy.value % 100}%`;
      }
    })
    .to({}, { duration: 2 });
  });
});

// Menu open/close interaction
const menuTimeline = gsap.timeline({ paused: true });
const contentToPush = document.querySelector('main') || document.querySelector('.main-content') || document.body;
let scrollY = 0;
let isMenuOpen = false;

if (contentToPush) {
  gsap.set(contentToPush, { y: 0 });
}

menuTimeline.to('.menu', {
  height: '100dvh',
  duration: 1,
  ease: 'power2.inOut'
}, 0);

menuTimeline.to('.navbar-overlay', {
  height: '100px',
  duration: 0.2
}, 0);

menuTimeline.to(['.button-nav-prueba', '.navbar-list', '.navbar-background'], {
  opacity: 0,
  duration: 0.3
}, 0);

if (contentToPush) {
  menuTimeline.to(contentToPush, {
    y: '100vh',
    duration: 1,
    ease: 'power2.inOut'
  }, 0);
}

const menuTrigger = document.querySelector('.button-nav-menu');
const menuText = document.querySelector('.menu-button-text');
const cerrarText = document.querySelector('.menu-button-text.cerrar');

function lockScroll() {
  scrollY = window.scrollY || window.pageYOffset || 0;
  document.body.style.position = 'fixed';
  document.body.style.top = `-${scrollY}px`;
  document.body.style.left = '0';
  document.body.style.right = '0';
  document.body.style.width = '100%';
  document.documentElement.style.overflow = 'hidden';
}

function unlockScroll() {
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.left = '';
  document.body.style.right = '';
  document.body.style.width = '';
  document.documentElement.style.overflow = '';
  window.scrollTo(0, scrollY);
}

function openMenu() {
  isMenuOpen = true;
  history.pushState({ menuOpen: true }, '');
  menuTimeline.play();
  lockScroll();
  if (menuText && cerrarText) {
    gsap.to(menuText, { opacity: 0, duration: 0.2 });
    gsap.to(cerrarText, { opacity: 1, duration: 0.2 });
  }
}

function closeMenu() {
  isMenuOpen = false;
  menuTimeline.reverse();
  unlockScroll();
  if (menuText && cerrarText) {
    gsap.to(cerrarText, { opacity: 0, duration: 0.2 });
    gsap.to(menuText, { opacity: 1, duration: 0.2 });
  }
}

if (menuTrigger) {
  menuTrigger.addEventListener('click', () => {
    if (!isMenuOpen) {
      openMenu();
    } else {
      history.back();
    }
  });
}

window.addEventListener('popstate', () => {
  if (isMenuOpen) {
    closeMenu();
  }
});

window.addEventListener('pageshow', (event) => {
  if (event.persisted && isMenuOpen) {
    isMenuOpen = false;
    menuTimeline.progress(0).pause();
    unlockScroll();
    if (menuText && cerrarText) {
      gsap.set(cerrarText, { opacity: 0 });
      gsap.set(menuText, { opacity: 1 });
    }
  }
});

// Expandable Menu List

const expandTriggers = document.querySelectorAll('.menu-list-link-expand-trigger');

expandTriggers.forEach(trigger => {
    trigger.addEventListener('click', function() {
        const parentItem = this.closest('.menu-list-item');
        const targetWrap = parentItem.querySelector('.menu-list-expand-wrap');
        const isOpen = targetWrap.classList.contains('is-open');

        const allWraps = document.querySelectorAll('.menu-list-expand-wrap.is-open');
        allWraps.forEach(wrap => {
            wrap.classList.remove('is-open');
            gsap.to(wrap, { height: 0, duration: 0.4, ease: 'power2.out' });
            
            const openParent = wrap.closest('.menu-list-item');
            const openIconV = openParent.querySelector('.menu-list-expand-icon-v');
            if (openIconV) gsap.to(openIconV, { rotation: 0, duration: 0.4, ease: 'power2.out' });
        });

        if (!isOpen) {
            targetWrap.classList.add('is-open');
            gsap.to(targetWrap, { height: 'auto', duration: 0.4, ease: 'power2.out' });
            
            const targetIconV = this.querySelector('.menu-list-expand-icon-v');
            if (targetIconV) gsap.to(targetIconV, { rotation: 90, duration: 0.4, ease: 'power2.out' });
        }
    });
});

// Navbar studios dropdown animation
const dropdownTrigger = document.querySelector('.navbar-list-item.navbar-list-item-dropdown');
const dropdownListWrap = document.querySelector('.navbar-studio-items-wrap');
const dropdownList = dropdownListWrap ? dropdownListWrap.querySelector('.navbar-studio-items') : null;
const dropdownItems = dropdownList
  ? Array.from(dropdownList.querySelectorAll('.navbar-studio-item'))
  : [];

if (dropdownTrigger && dropdownListWrap && dropdownItems.length) {
  gsap.set(dropdownItems, {
    opacity: 0,
    y: 10
  });

  gsap.set(dropdownListWrap, {
    display: 'none'
  });

  let hideTimer;

  const showDropdown = () => {
    clearTimeout(hideTimer);

    gsap.set(dropdownListWrap, {
      display: 'block'
    });

    gsap.to(dropdownItems, {
      opacity: 1,
      y: 0,
      duration: 0.3,
      stagger: { each: 0.03, from: 'start' },
      ease: 'power2.out'
    });
  };

  const hideDropdown = () => {
    clearTimeout(hideTimer);

    hideTimer = setTimeout(() => {
      if (!dropdownTrigger.matches(':hover') && !dropdownListWrap.matches(':hover')) {
        gsap.to(dropdownItems, {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.in',
          overwrite: true,
          onComplete: () => {
            gsap.set(dropdownListWrap, {
              display: 'none'
            });
          }
        });
      }
    }, 40);
  };

  dropdownTrigger.addEventListener('mouseenter', showDropdown);
  dropdownTrigger.addEventListener('mouseleave', hideDropdown);

  dropdownListWrap.addEventListener('mouseenter', showDropdown);
  dropdownListWrap.addEventListener('mouseleave', hideDropdown);
}

// Navbar studios hover
if (window.location.pathname.startsWith('/studios/')) {
    const studioLink = document.querySelector('.navbar-navlink[data-menu-link="studios"]');
    
    if (studioLink) {
        studioLink.classList.add('w--current');
    }
}

// Hero carousel animation
const slides = Array.from(document.querySelectorAll('.hero-carousel-image-wrap'));
const carouselBtn = document.querySelector('.hero-carousel-button');

if (slides.length > 1 && carouselBtn) {
  gsap.set(carouselBtn, { display: 'block' });

  const btnSlides = [];
  const progressDivs = [];

  slides.forEach((slide) => {
    const clone = slide.cloneNode(true);
    const img = clone.querySelector('.hero-carousel-image');
    if (img) img.classList.add('is-button-img');
  
    const progress = document.createElement('div');
    progress.classList.add('hero-carousel-progress');
    clone.appendChild(progress);
    carouselBtn.appendChild(clone);

    btnSlides.push(clone);
    progressDivs.push(progress);
  });

  let currentIndex = 0;
  let btnIndex = 1;
  let isAnimating = false;
  let progressTween;

  gsap.set(slides, { height: '0%', zIndex: 1 });
  gsap.set(btnSlides, { height: '0%', zIndex: 1 });

  gsap.set(slides[currentIndex], { height: '100%', zIndex: 2 });
  gsap.set(btnSlides[btnIndex], { height: '100%', zIndex: 2 });
  gsap.set(progressDivs[btnIndex], { xPercent: 0 });

  function startProgress() {
    progressTween = gsap.fromTo(
      progressDivs[btnIndex],
      { xPercent: 0 },
      { xPercent: 100, duration: 5, ease: 'none', onComplete: doTransition }
    );
  }

  function doTransition() {
    if (isAnimating) return;
    isAnimating = true;
    if (progressTween) progressTween.kill();

    const currentMain = slides[currentIndex];
    const nextMainIndex = (currentIndex + 1) % slides.length;
    const nextMain = slides[nextMainIndex];

    const currentBtn = btnSlides[btnIndex];
    const nextBtnIndex = (btnIndex + 1) % btnSlides.length;
    const nextBtn = btnSlides[nextBtnIndex];

    gsap.set(nextMain, { height: '0%', zIndex: 3 });
    gsap.set(currentMain, { zIndex: 2 });

    gsap.set(nextBtn, { height: '0%', zIndex: 3 });
    gsap.set(currentBtn, { zIndex: 2 });
    gsap.set(progressDivs[nextBtnIndex], { xPercent: 0 });

    gsap.to([nextMain, nextBtn], {
      height: '100%',
      duration: 1,
      ease: 'power2.inOut',
      onComplete: () => {
        gsap.set([currentMain, currentBtn], { height: '0%', zIndex: 1 });
        currentIndex = nextMainIndex;
        btnIndex = nextBtnIndex;
        isAnimating = false;
        startProgress();
      }
    });
  }

  startProgress();

  carouselBtn.addEventListener('click', () => {
    if (!isAnimating) doTransition();
  });
}

// Concepts list
gsap.registerPlugin(ScrollTrigger);

const conceptItems = document.querySelectorAll('.concept-item');
const borderColors = ['var(--color--violet-stroke)', 'var(--color--yellow-stroke)', 'var(--color--pink-stroke)'];
const textColors = ['var(--color--violet)', 'var(--color--yellow)', 'var(--color--pink)'];

function setConceptItemsLayout() {
  const isMobile = window.matchMedia('(max-width: 767px)').matches;
  const offsetMultiplier = isMobile ? 1 : 3.5;
  const baseTopSpace = isMobile ? 92 : 96;

  conceptItems.forEach((item, index) => {
    item.style.borderColor = borderColors[index % borderColors.length];
    item.style.top = `calc(${baseTopSpace}px + ${index * offsetMultiplier}rem)`;

    const svgBg = item.querySelector('.concept-svg-bg');
    if (svgBg) {
      svgBg.style.color = '#FFFFFF';
    }
  });
  
  ScrollTrigger.refresh();
}

setConceptItemsLayout();
window.addEventListener('resize', setConceptItemsLayout);

conceptItems.forEach((item, index) => {
  const svgBg = item.querySelector('.concept-svg-bg');
  const infoWrap = item.querySelector('.concept-info-wrap');
  const videoWrap = item.querySelector('.concept-video-wrap');

  if (svgBg) {
    gsap.fromTo(svgBg, 
      { color: '#FFFFFF' }, 
      { 
        color: textColors[index % textColors.length],
        duration: 0.3,
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: item,
          start: () => "top " + (parseFloat(window.getComputedStyle(item).top) + 150) + "px",
          toggleActions: "play none none reverse",
          invalidateOnRefresh: true
        }
      }
    );
  }

  const contentTl = gsap.timeline({
    scrollTrigger: {
      trigger: item,
      start: "top 80%"
    }
  });

  if (infoWrap) {
    contentTl.fromTo(infoWrap, 
      { opacity: 0, x: -50 }, 
      { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" }, 
      0
    );
  }

  if (videoWrap) {
    contentTl.fromTo(videoWrap, 
      { opacity: 0, x: 50 }, 
      { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" }, 
      0
    );
  }
});

// After studios list
const afterStudiosList = document.querySelector('.after-studios-list');
const conceptsList = document.querySelector('.concepts-list');
const conceptItemsNodeList = document.querySelectorAll('.concept-item');

if (afterStudiosList && conceptsList) {
  conceptsList.appendChild(afterStudiosList);
}

if (conceptItemsNodeList.length > 0) {
  conceptItemsNodeList[conceptItemsNodeList.length - 1].classList.add('last-concept-item');
}

// Hide navbar book button when footer is in view
const buttonNavGradient = document.querySelector('.button-nav-gradient');
const footer = document.querySelector('.footer');

if (buttonNavGradient && footer) {
  ScrollTrigger.create({
    trigger: footer,
    start: 'top 70%',
    end: 'top 30%',
    onEnter: () => {
      gsap.to(buttonNavGradient, { opacity: 0, duration: 0.3 });
    },
    onEnterBack: () => {
      gsap.to(buttonNavGradient, { opacity: 1, duration: 0.3 });
    }
  });
}

// Footer claim reveal
gsap.registerPlugin(ScrollTrigger);

const footerWrap = document.querySelector('.footer-claim-wrap');

if (footerWrap) {
  const firstSvg = footerWrap.querySelector('.footer-claim-svg--first');
  const secondSvg = footerWrap.querySelector('.footer-claim-svg--second');

  if (firstSvg && secondSvg) {
    const firstPaths = gsap.utils.toArray(firstSvg.querySelectorAll('path'));
    const secondPaths = gsap.utils.toArray(secondSvg.querySelectorAll('path'));

    if (firstPaths.length && secondPaths.length) {
      gsap.set(firstPaths, { yPercent: 120 });
      gsap.set(secondPaths, { yPercent: 120 });

      ScrollTrigger.create({
        trigger: footerWrap,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          const tl = gsap.timeline({
            defaults: { ease: 'expo.out' }
          });

          tl.to(firstPaths, {
            yPercent: 0,
            duration: 1.5,
            stagger: 0.1
          });

          tl.to(secondPaths, {
            yPercent: 0,
            duration: 1.5,
            stagger: 0.1
          }, '-=1.5');
        }
      });
    }
  }
}

// Footer Button Gradient Animation
const wrap = document.querySelector('.footer-button-color-wrap');

if (wrap) {
  const circles = [
    wrap.querySelector('.footer-circle-pink'),
    wrap.querySelector('.footer-circle-yellow'),
    wrap.querySelector('.footer-circle-lilac')
  ].filter(Boolean);

  circles.forEach((circle, index) => {
    const width = circle.offsetWidth;
    const radius = width * 0.25;
    const direction = index % 2 === 0 ? 1 : -1;
    const duration = 15 + index * 5;
    const startAngle = index * 120;

    const proxy = { angle: startAngle };

    gsap.to(proxy, {
      angle: `+=${360 * direction}`,
      duration: duration,
      ease: 'none',
      repeat: -1,
      onUpdate: () => {
        const rad = proxy.angle * (Math.PI / 180);
        const x = Math.cos(rad) * radius;
        const y = Math.sin(rad) * radius;
        gsap.set(circle, { x: x, y: y });
      }
    });
  });
}

// Stop fading when scrolled till the end

const scrollMaskElements = document.querySelectorAll('.filters-outer-wrap, .filtered-studios-list, .events-cards, .filters-outer-wrap-blog');

const checkScrollMask = (el) => {
  if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 5) {
    el.classList.add('is-at-end');
  } else {
    el.classList.remove('is-at-end');
  }
};

scrollMaskElements.forEach(el => {
  checkScrollMask(el);
  
  el.addEventListener('scroll', () => {
    checkScrollMask(el);
  }, { passive: true });
  
  window.addEventListener('resize', () => {
    checkScrollMask(el);
  });
});

// Update copyright year
const yearEl = document.querySelectorAll('.year');
if (yearEl) {
  yearEl.forEach(year => {
        year.textContent = new Date().getFullYear();
    });
}

// Highlight color animation
const root = document.documentElement;
const styles = getComputedStyle(root);

const violet = styles.getPropertyValue('--color--violet').trim();
const yellow = styles.getPropertyValue('--color--yellow').trim();
const pink = styles.getPropertyValue('--color--pink').trim();

gsap.set(root, { "--highlight": violet });

const tl = gsap.timeline({ repeat: -1, defaults: { duration: 1, ease: 'none' } });

tl.to(root, { "--highlight": yellow })
  .to(root, { "--highlight": pink })
  .to(root, { "--highlight": violet });