gsap.registerPlugin(ScrollTrigger);

window.pageRevealedFlag = false;
window.addEventListener("pageReveal", () => {
  window.pageRevealedFlag = true;
});
  
// Initialize page fade-in for non-homepage pages
const initPageFadeIn = () => {
  const isHomepageLoaderPresent = document.querySelector(".hero-loader-wrap");
  const navbar = document.querySelector(".navbar-overlay");
  const elementsToFade = document.querySelectorAll("main > section, footer");

  if (isHomepageLoaderPresent) {
    gsap.set("main > section, footer", { opacity: 1 });
    return;
  }

  window.addEventListener("pageReveal", () => {
    if (navbar) {
      gsap.to(navbar, { y: "0%", duration: 2, delay: 0.4, ease: "power2.out" });
    }

    if (elementsToFade.length) {
      gsap.fromTo(
        elementsToFade,
        { opacity: 0 },
        { opacity: 1, duration: 2.5, delay: 0.15, stagger: 0.25 }
      );
    }
  });
};

// Page transitions
const initPageTransitions = () => {
  const overlay = document.querySelector('.page-transition-overlay');
  const logo = document.querySelector('.page-transition-logo');
  const logoWrap = document.querySelector('.page-transition-logo-wrap');
  const colors = ['var(--color--yellow)', 'var(--color--pink)', 'var(--color--violet)'];

  if (!overlay) {
    setTimeout(() => window.dispatchEvent(new CustomEvent("pageReveal")), 0);
    return;
  }

  const currentPath = window.location.pathname;
  const isHome = currentPath === '/' || currentPath === '/index.html';
  const navEntries = performance.getEntriesByType("navigation");
  const isBackForward = navEntries.length > 0 && navEntries[0].type === "back_forward";
  const savedColor = sessionStorage.getItem('transitionColor');

  if (isHome || isBackForward || !savedColor) {
    document.documentElement.classList.remove('is-transitioning');
    gsap.set(overlay, { display: 'none' });
    setTimeout(() => window.dispatchEvent(new CustomEvent("pageReveal")), 0);
  } else {
    if (logo) {
      logo.style.color = savedColor;
    }
    gsap.set(overlay, { display: 'flex', opacity: 1, yPercent: 0 });
    if (logoWrap) {
      gsap.set(logoWrap, { yPercent: 0 });
    }

    gsap.delayedCall(0.8, () => {
      window.dispatchEvent(new CustomEvent("pageReveal"));
    });

    gsap.to(overlay, {
      yPercent: -100,
      duration: 0.8,
      ease: 'power3.inOut',
      onComplete: () => {
        document.documentElement.classList.remove('is-transitioning');
        gsap.set(overlay, { display: 'none' });
        sessionStorage.removeItem('transitionColor');
      }
    });

    if (logoWrap) {
      gsap.to(logoWrap, {
        yPercent: 75,
        duration: 0.8,
        ease: 'power3.inOut'
      });
    }
  }

  document.querySelectorAll('a:not(.excluded-class)').forEach(link => {
    link.addEventListener('click', function (e) {
      const targetUrl = this.getAttribute('href');

      if (!targetUrl || targetUrl.startsWith('#')) return;

      if (this.hostname === window.location.hostname && this.target !== '_blank') {
        e.preventDefault();

        const isTargetHome = targetUrl === '/' || targetUrl === '/index.html';

        if (isTargetHome) {
          window.location.href = targetUrl;
          return;
        }

        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        sessionStorage.setItem('transitionColor', randomColor);

        if (logo) {
          logo.style.color = randomColor;
        }

        document.documentElement.classList.add('is-transitioning');
        gsap.set(overlay, { display: 'flex', opacity: 1, yPercent: 100 });
        if (logoWrap) {
          gsap.set(logoWrap, { yPercent: -75 });
        }

        gsap.to(overlay, {
          yPercent: 0,
          duration: 0.8,
          ease: 'power3.inOut',
          onComplete: () => {
            const navOpen = document.querySelector('.nav-open');
            if (navOpen) {
              gsap.set(navOpen, { display: 'none', opacity: 0 });
            }
            document.body.style.overflow = "";
            window.location.href = targetUrl;
          }
        });

        if (logoWrap) {
          gsap.to(logoWrap, {
            yPercent: 0,
            duration: 0.8,
            ease: 'power3.inOut'
          });
        }
      }
    });
  });

  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      document.documentElement.classList.remove('is-transitioning');
      gsap.set(overlay, { display: 'none' });

      const navOpen = document.querySelector('.nav-open');
      if (navOpen) {
        gsap.set(navOpen, { display: 'none', opacity: 0 });
      }
      document.body.style.overflow = "";
    }
  });
};
  
// Lazy load videos
const initLazyVideos = () => {
  const lazyVideos = Array.from(document.querySelectorAll("video.lazyload-video"));
  if (!lazyVideos.length || !("IntersectionObserver" in window)) return;

  const lazyVideoObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((video) => {
      if (video.isIntersecting) {
        const vidEl = video.target;
        if (vidEl.dataset.src) vidEl.src = vidEl.dataset.src;
        vidEl.load();
        observer.unobserve(vidEl);
      }
    });
  });

  lazyVideos.forEach((lazyVideo) => lazyVideoObserver.observe(lazyVideo));
};

// Navbar logo hover animation
const initNavbarLogo = () => {
  const logoWrap = document.querySelector('.navbar-logo-inner');
  if (!logoWrap) return;

  const mmLogo = gsap.matchMedia();
  mmLogo.add("(min-width: 1281px)", () => {
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
      gsap.set(logoWrap, { clearProps: 'width' });
      if (logo) gsap.set(logo, { clearProps: 'opacity' });
      if (logoHover) gsap.set(logoHover, { clearProps: 'opacity' });
    };
  });
};

// Gradient buttons animation
const initNavGradients = () => {
  const buttons = document.querySelectorAll('.button-nav-gradient');
  if (!buttons.length) return;

  const hasCursor = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  buttons.forEach((button) => {
    const movingElement = button.querySelector('.button-gradient-hover-circles');
    const blackBg = button.querySelector('.button-gradient-black-bg');
    const greyBorder = button.querySelector('.button-gradient-grey-border');

    if (!movingElement) return;

    const proxy = { value: 0 };
    movingElement.style.offsetDistance = '0%';

    const tl = gsap.timeline({ repeat: -1 });
    tl.to(proxy, {
      value: 50,
      duration: 5,
      ease: 'none',
      onUpdate: () => movingElement.style.offsetDistance = `${proxy.value % 100}%`
    })
    .to({}, { duration: 2 })
    .to(proxy, {
      value: 100,
      duration: 5,
      ease: 'none',
      onUpdate: () => movingElement.style.offsetDistance = `${proxy.value % 100}%`
    })
    .to({}, { duration: 2 });

    gsap.to(movingElement, { rotation: '+=360', duration: 12, ease: 'none', repeat: -1 });

    if (hasCursor) {
      let xTo, yTo;
      let rect, pathOffsetX = 0, pathOffsetY = 0;

      button.addEventListener('mouseenter', (e) => {
        gsap.killTweensOf(movingElement, 'x,y');
        gsap.killTweensOf(tl);
        tl.pause();

        rect = button.getBoundingClientRect();
        const elRect = movingElement.getBoundingClientRect();
        const currentX = gsap.getProperty(movingElement, 'x') || 0;
        const currentY = gsap.getProperty(movingElement, 'y') || 0;

        pathOffsetX = (elRect.left + elRect.width / 2 - currentX) - rect.left;
        pathOffsetY = (elRect.top + elRect.height / 2 - currentY) - rect.top;

        xTo = gsap.quickTo(movingElement, 'x', { duration: 1.2, ease: 'sine.out' });
        yTo = gsap.quickTo(movingElement, 'y', { duration: 1.2, ease: 'sine.out' });

        if (blackBg) gsap.to(blackBg, { opacity: 0, duration: 0.5 });
        if (greyBorder) gsap.to(greyBorder, { borderColor: '#3a3a3a', duration: 0.5 });

        xTo(e.clientX - rect.left - pathOffsetX);
        yTo(e.clientY - rect.top - pathOffsetY);
      });

      button.addEventListener('mousemove', (e) => {
        if (xTo && yTo) {
          xTo(e.clientX - rect.left - pathOffsetX);
          yTo(e.clientY - rect.top - pathOffsetY);
        }
      });

      button.addEventListener('mouseleave', () => {
        if (blackBg) gsap.to(blackBg, { opacity: 1, duration: 0.5 });
        if (greyBorder) gsap.to(greyBorder, { borderColor: '#606060', duration: 0.5 });

        gsap.to(movingElement, {
          x: 0,
          y: 0,
          duration: 1.2,
          ease: 'sine.out'
        });

        gsap.to(tl, {
          time: 0,
          duration: 1.2,
          ease: 'sine.out',
          onComplete: () => {
            tl.restart();
          }
        });
      });
    }
  });
};

// Filter buttons hover
const filterButtonsStates = () => {
  const hasCursor = window.matchMedia(
    '(hover: hover) and (pointer: fine)'
  ).matches;

  const filterButtons = document.querySelectorAll('.filter-button');

  filterButtons.forEach((button) => {
    const buttonTexts = button.querySelectorAll('.button-text');

    if (!buttonTexts.length) return;

    if (hasCursor) {
      button.addEventListener('mouseenter', () => {
        gsap.to(buttonTexts, {
          yPercent: -100,
          duration: 0.5,
          ease: 'expo.out',
        });
        gsap.to(button, {
          backgroundColor: '#e1e1e1',
          duration: 0.2,
          overwrite: 'auto',
        });
      });

      button.addEventListener('mouseleave', () => {
        gsap.to(buttonTexts, {
          yPercent: 0,
          duration: 0.5,
          ease: 'expo.out',
        });
        gsap.to(button, {
          backgroundColor: '',
          duration: 0.2,
          overwrite: 'auto',
        });
      });
    }
  });
};

// Lines Reveal Animation
const initLinesReveal = (isResize = false) => {
  const allElements = document.querySelectorAll('[data-animation="lines"], [data-animation="line"]');
  if (!allElements.length) return;

  const targetElements = isResize 
    ? document.querySelectorAll('[data-animation="lines"]') 
    : allElements;

  if (!window.linesResizeAdded) {
    window.linesResizeAdded = true;
    let lastWidth = window.innerWidth;
    let resizeTimer;

    window.addEventListener('resize', () => {
      if (window.innerWidth < 768 || window.innerWidth === lastWidth) return;
      lastWidth = window.innerWidth;

      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const multiLines = document.querySelectorAll('[data-animation="lines"]');
        
        if (typeof ScrollTrigger !== 'undefined') {
          ScrollTrigger.getAll()
            .filter(st => Array.from(multiLines).some(el => st.trigger === el || st.trigger === el.parentNode))
            .forEach(st => st.kill());
        }

        multiLines.forEach(el => {
          if (el.dataset.initialHtml) {
            el.innerHTML = el.dataset.initialHtml;
          }
          gsap.set(el, { clearProps: "all" });
        });

        initLinesReveal(true);
        setTimeout(() => window.dispatchEvent(new Event("pageReveal")), 100);
      }, 250);
    });
  }

  targetElements.forEach(el => {
    if (!el.dataset.initialHtml && el.getAttribute('data-animation') === 'lines') {
      el.dataset.initialHtml = el.innerHTML;
    }

    gsap.set(el, { visibility: 'visible' });

    const isSingleLine = el.getAttribute('data-animation') === 'line';
    let targets = [];
    let triggerEl = el;

    if (isSingleLine) {
      const mask = document.createElement('div');
      mask.className = 'single-line-mask';
      gsap.set(mask, { position: 'relative', display: 'block', overflow: 'hidden' });
      el.parentNode.insertBefore(mask, el);
      mask.appendChild(el);
      targets = [el];
      triggerEl = mask;
      gsap.set(targets, { yPercent: 100, opacity: 0 });
    } else {
      if (typeof SplitText === 'undefined') return;
      const split = new SplitText(el, { type: 'lines', linesClass: 'single-line-inner' });
      split.lines.forEach(line => {
        const mask = document.createElement('div');
        mask.className = 'single-line';
        gsap.set(mask, { position: 'relative', display: 'block', overflow: 'hidden' });
        line.parentNode.insertBefore(mask, line);
        mask.appendChild(line);
      });
      targets = split.lines;
      gsap.set(targets, { display: 'block', yPercent: 100, opacity: 0 });
    }

    const isLoadTrigger = el.getAttribute('data-trigger') === 'load';

    if (isLoadTrigger) {
      if (!isResize) {
        if (window.pageRevealedFlag) {
          gsap.to(targets, { yPercent: 0, opacity: 1, duration: 1.5, stagger: 0.1, ease: 'power3.out' });
        } else {
          window.addEventListener("pageReveal", () => {
            gsap.to(targets, { yPercent: 0, opacity: 1, duration: 1.5, stagger: 0.1, ease: 'power3.out' });
          });
        }
      } else {
        gsap.to(targets, { yPercent: 0, opacity: 1, duration: 1.5, stagger: 0.1, ease: 'power3.out' });
      }
    } else {
      gsap.to(targets, {
        yPercent: 0,
        opacity: 1,
        duration: 1.5,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: triggerEl,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    }
  });
};

// Menu open/close animation
const initMenu = () => {
  const menuTrigger = document.querySelector('.button-nav-menu');
  if (!menuTrigger) return;

  const menuTimeline = gsap.timeline({ paused: true });
  const contentToPush = document.querySelector('main') || document.querySelector('.main-content') || document.body;
  const menuText = document.querySelector('.button-nav-menu > .button-text-wrap');
  const cerrarText = document.querySelector('.button-nav-menu > .button-text-wrap.cerrar');
  
  let scrollY = 0;
  let isMenuOpen = false;

  if (contentToPush) gsap.set(contentToPush, { y: 0 });

  menuTimeline.to('.menu', { height: '100dvh', display: 'block', duration: 1, ease: 'power2.inOut' }, 0)
              .to('.navbar-overlay', { height: '100px', duration: 0.2 }, 0)
              .to(['.button-nav-prueba', '.navbar-list', '.navbar-background'], { opacity: 0, duration: 0.3 }, 0);

  if (contentToPush) {
    menuTimeline.to(contentToPush, { y: '100vh', duration: 1, ease: 'power2.inOut' }, 0);
  }

  const lockScroll = () => {
    scrollY = window.scrollY || window.pageYOffset || 0;
    Object.assign(document.body.style, {
      position: 'fixed', top: `-${scrollY}px`, left: '0', right: '0', width: '100%'
    });
    document.documentElement.style.overflow = 'hidden';
  };

  const unlockScroll = () => {
    Object.assign(document.body.style, {
      position: '', top: '', left: '', right: '', width: ''
    });
    document.documentElement.style.overflow = '';
    window.scrollTo(0, scrollY);
  };

  const openMenu = () => {
    isMenuOpen = true;
    history.pushState({ menuOpen: true }, '');
    menuTimeline.play();
    lockScroll();
    if (menuText && cerrarText) {
      gsap.to(menuText, { opacity: 0, duration: 0.2 });
      gsap.to(cerrarText, { opacity: 1, duration: 0.2 });
    }
  };

  const closeMenu = () => {
    isMenuOpen = false;
    menuTimeline.reverse();
    unlockScroll();
    if (menuText && cerrarText) {
      gsap.to(cerrarText, { opacity: 0, duration: 0.2 });
      gsap.to(menuText, { opacity: 1, duration: 0.2 });
    }
  };

  menuTrigger.addEventListener('click', () => isMenuOpen ? history.back() : openMenu());
  window.addEventListener('popstate', () => { if (isMenuOpen) closeMenu(); });
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
};

// Menu expandable items
const initExpandableMenu = () => {
  const expandTriggers = document.querySelectorAll('.menu-list-link-expand-trigger');
  if (!expandTriggers.length) return;

  expandTriggers.forEach(trigger => {
    trigger.addEventListener('click', function() {
      const parentItem = this.closest('.menu-list-item');
      const targetWrap = parentItem.querySelector('.menu-list-expand-wrap');
      const isOpen = targetWrap.classList.contains('is-open');
      const allWraps = document.querySelectorAll('.menu-list-expand-wrap.is-open');
      
      allWraps.forEach(wrap => {
        wrap.classList.remove('is-open');
        gsap.to(wrap, { height: 0, duration: 0.4, ease: 'power2.out' });
        const openIconV = wrap.closest('.menu-list-item').querySelector('.menu-list-expand-icon-v');
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
};

// Navbar dropdown list animation (studios and language)
const initNavbarDropdown = () => {
  const dropdownTriggers = document.querySelectorAll('.navbar-dropdown');

  dropdownTriggers.forEach(dropdownTrigger => {
    const dropdownListWrap = dropdownTrigger.querySelector('.navbar-dropdown-content') || dropdownTrigger.parentNode.querySelector('.navbar-dropdown-content');
    if (!dropdownListWrap) return;

    const dropdownList = dropdownListWrap.querySelector('.navbar-dropdown-items');
    const dropdownItems = dropdownList ? Array.from(dropdownList.querySelectorAll('.navbar-dropdown-item')) : [];
    if (!dropdownItems.length) return;

    gsap.set(dropdownItems, { opacity: 0, y: 10 });
    gsap.set(dropdownListWrap, { display: 'none' });

    let hideTimer;

    const showDropdown = () => {
      clearTimeout(hideTimer);
      gsap.set(dropdownListWrap, { display: 'block' });
      gsap.to(dropdownItems, {
        opacity: 1, y: 0, duration: 1, stagger: { each: 0.05, from: 'start' }, ease: 'power2.out', overwrite: true
      });
    };

    const hideDropdown = () => {
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => {
        if (!dropdownTrigger.matches(':hover') && !dropdownListWrap.matches(':hover')) {
          gsap.to(dropdownItems, {
            opacity: 0, y: 10, duration: 0.5, ease: 'power1.in', overwrite: true, stagger: { each: 0.05, from: 'end' },
            onComplete: () => gsap.set(dropdownListWrap, { display: 'none' })
          });
        }
      }, 40);
    };

    dropdownTrigger.addEventListener('mouseenter', showDropdown);
    dropdownTrigger.addEventListener('mouseleave', hideDropdown);
    dropdownListWrap.addEventListener('mouseenter', showDropdown);
    dropdownListWrap.addEventListener('mouseleave', hideDropdown);
  });
};

// Navbar studios current link highlight
const initCurrentLink = () => {
  if (window.location.pathname.startsWith('/studios/')) {
    const studioLink = document.querySelector('.navbar-navlink[data-menu-link="studios"]');
    if (studioLink) studioLink.classList.add('w--current');
  }
};

// Hero carousel
const initHeroCarousel = () => {
  const slides = Array.from(document.querySelectorAll('.hero-carousel-image-wrap'));
  const carouselBtn = document.querySelector('.hero-carousel-button');

  const heroCarouselMm = gsap.matchMedia();
  heroCarouselMm.add("(max-width: 767px)", () => {
    const mainImages = document.querySelectorAll('.hero-carousel-image:not(.is-button-img)');
    mainImages.forEach(img => img.style.height = '380px');
    return () => mainImages.forEach(img => img.style.height = '');
  });

  if (slides.length <= 1 || !carouselBtn) return;
  gsap.set(carouselBtn, { display: 'block' });

  const btnSlides = [];
  const progressDivs = [];

  slides.forEach((slide) => {
    const clone = slide.cloneNode(true);
    const img = clone.querySelector('.hero-carousel-image');
    if (img) {
      img.classList.remove('hero-carousel-image');
      img.classList.add('is-button-img');
      img.style.height = '';
    }
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

  const doTransition = () => {
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
  };

  const startProgress = () => {
    progressTween = gsap.fromTo(
      progressDivs[btnIndex],
      { xPercent: 0 },
      { xPercent: 100, duration: 5, ease: 'none', onComplete: doTransition }
    );
  };

  startProgress();
  carouselBtn.addEventListener('click', () => { if (!isAnimating) doTransition(); });
};

// Concepts list load
const initConceptsList = () => {
  const afterStudiosList = document.querySelector('.after-studios-list');
  const conceptsList = document.querySelector('.concepts-list');
  if (afterStudiosList && conceptsList) conceptsList.appendChild(afterStudiosList);

  const conceptItems = document.querySelectorAll('.concept-item');
  if (!conceptItems.length) return;
  conceptItems[conceptItems.length - 1].classList.add('last-concept-item');

  const borderColors = ['var(--color--violet-stroke)', 'var(--color--yellow-stroke)', 'var(--color--pink-stroke)'];
  const bgColors = ['var(--color--violet)', 'var(--color--yellow)', 'var(--color--pink)'];
  const mm = gsap.matchMedia();

  mm.add({ desktop: "(min-width: 768px)", mobile: "(max-width: 767px)" }, (context) => {
    const { desktop } = context.conditions;
    conceptItems.forEach((item, index) => {
      const svgBg = item.querySelector('.concept-svg-bg');
      const infoWrap = item.querySelector('.concept-info-wrap');
      const videoWrap = item.querySelector('.concept-video-wrap');
      
      item.style.top = desktop ? `calc(96px + ${index * 3.5}rem)` : "auto";

      if (infoWrap) gsap.set(infoWrap, { opacity: 0, x: -50 });
      if (videoWrap) gsap.set(videoWrap, { opacity: 0, x: 50 });
      
      const colorTl = gsap.timeline({
        scrollTrigger: {
          trigger: item,
          start: desktop ? () => `top ${(parseFloat(window.getComputedStyle(item).top) || 0) + (window.innerHeight * 0.2)}px` : "top 50%",
          toggleActions: "play none none reverse",
          invalidateOnRefresh: true
        }
      });

      if (svgBg) colorTl.fromTo(svgBg, { color: '#FFFFFF' }, { color: bgColors[index % bgColors.length], duration: 0.3, ease: "power1.inOut" }, 0);
      colorTl.to(item, { borderColor: borderColors[index % borderColors.length], duration: 0.3, ease: "power1.inOut" }, 0);

      const contentTl = gsap.timeline({ scrollTrigger: { trigger: item, start: "top 80%" } });
      if (infoWrap) contentTl.to(infoWrap, { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" }, 0);
      if (videoWrap) contentTl.to(videoWrap, { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" }, 0);
    });

    return () => conceptItems.forEach(item => item.style.top = "");
  });
};

// Stagger fade-up animation
const initFadeUpStagger = () => {
  const elements = document.querySelectorAll('[data-gsap="fade-up"]');
  
  if (!elements.length) return;

  let mmFadein = gsap.matchMedia();

  mmFadein.add("(min-width: 992px)", () => {
    gsap.set(elements, { opacity: 0 });

    ScrollTrigger.batch(elements, {
      start: 'top 85%',
      onEnter: batchElements => gsap.fromTo(batchElements, 
        {
          y: 50,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 1.5,
          ease: 'power2.out',
          stagger: 0.2,
          overwrite: true
        }
      )
    });
  });
};

// Fade out scroll masks when scrolled to the end of a container
const initScrollMasks = () => {
  const elements = document.querySelectorAll('.filters-scroll-wrap, .filtered-studios-list, .events-cards, .filters-scroll-wrap-blog');
  if (!elements.length) return;

  const checkScrollMask = (el) => {
    if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 5) el.classList.add('is-at-end');
    else el.classList.remove('is-at-end');
  };

  elements.forEach(el => {
    checkScrollMask(el);
    el.addEventListener('scroll', () => checkScrollMask(el), { passive: true });
  });

  window.addEventListener('resize', () => elements.forEach(checkScrollMask), { passive: true });
};

// Footer animations
const initFooterEffects = () => {
  const buttonNavGradient = document.querySelector('.button-nav-gradient');
  const footer = document.querySelector('.footer');
  
  if (buttonNavGradient && footer) {
    const mmAfter = gsap.matchMedia();
    mmAfter.add("(min-width: 768px)", () => {
      ScrollTrigger.create({
        trigger: footer,
        start: 'top 70%',
        end: 'top 30%',
        onEnter: () => gsap.to(buttonNavGradient, { opacity: 0, duration: 0.3 }),
        onEnterBack: () => gsap.to(buttonNavGradient, { opacity: 1, duration: 0.3 })
      });
      return () => {
        gsap.killTweensOf(buttonNavGradient);
        gsap.set(buttonNavGradient, { opacity: 1 });
      };
    });
  }

  const svg = document.querySelector('.footer-claim-svg');
  if (svg) {
    const paths = gsap.utils.toArray(svg.querySelectorAll('path'));
    const firstPaths = paths.slice(0, 9);
    const secondPaths = paths.slice(9);

    if (firstPaths.length && secondPaths.length) {
      gsap.set(paths, { yPercent: 120, opacity: 0, transformOrigin: '50% 100%' });
      ScrollTrigger.create({
        trigger: svg.closest('.footer-claim-wrap') || svg,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
          tl.to(firstPaths, { yPercent: 0, opacity: 1, duration: 1, stagger: 0.08 })
            .to(secondPaths, { yPercent: 0, opacity: 1, duration: 1, stagger: 0.08 }, '-=1.5');
        }
      });

      const mmFooter = gsap.matchMedia();
      mmFooter.add("(hover: hover) and (pointer: fine)", () => {
        paths.forEach(path => {
          path.addEventListener('mouseenter', () => {
            if (!gsap.isTweening(path)) {
              gsap.to(path, {
                keyframes: [
                  { skewX: -15, scaleY: 0.85, scaleX: 1.1, duration: 0.1, ease: 'power1.out' },
                  { skewX: 10, scaleY: 1.15, scaleX: 0.9, duration: 0.15, ease: 'power1.inOut' },
                  { skewX: -5, scaleY: 0.95, scaleX: 1.05, duration: 0.15, ease: 'power1.inOut' },
                  { skewX: 0, scaleY: 1, scaleX: 1, duration: 0.4, ease: 'elastic.out(1, 0.4)' }
                ]
              });
            }
          });
        });
      });
    }
  }

  const footerButton = document.querySelector('.footer-button');
  if (footerButton) {
    const movingElement = footerButton.querySelector('.button-gradient-hover-circles-footer');
    if (movingElement && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      gsap.set(movingElement, { opacity: 0 });
      let rotationTween;
      let rect;
      
      const xTo = gsap.quickTo(movingElement, 'x', { duration: 1.2, ease: 'sine.out' });
      const yTo = gsap.quickTo(movingElement, 'y', { duration: 1.2, ease: 'sine.out' });

      footerButton.addEventListener('mouseenter', (e) => {
        rect = footerButton.getBoundingClientRect();
        const targetX = e.clientX - rect.left - (movingElement.offsetWidth / 2);
        const targetY = e.clientY - rect.top - (movingElement.offsetHeight / 2);
        gsap.set(movingElement, { x: targetX, y: targetY });

        rotationTween = gsap.to(movingElement, { rotation: '+=360', duration: 24, ease: 'none', repeat: -1 });
        gsap.to(movingElement, { opacity: 1, duration: 0.5, ease: 'sine.out' });
        gsap.to(footerButton, { backgroundColor: '#191919', duration: 0.5 });
      });

      footerButton.addEventListener('mousemove', (e) => {
        xTo(e.clientX - rect.left - (movingElement.offsetWidth / 2));
        yTo(e.clientY - rect.top - (movingElement.offsetHeight / 2));
      });

      footerButton.addEventListener('mouseleave', () => {
        if (rotationTween) rotationTween.kill();
        gsap.to(movingElement, { opacity: 0, duration: 0.5, ease: 'sine.in' });
        gsap.to(footerButton, { backgroundColor: '#030303', duration: 0.5 });
      });
    }
  }
};

// Newsletter form
function initNewsletterForm() {
    const form = document.getElementById("momence-webflow-form");
    const successMessage = document.getElementById("momence-success");

    if (form) {
        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            event.stopPropagation();

            const formData = new FormData(form);
            
            const values = {
                sourceId: 265754,
                token: "A3Xzk51EjO",
                email: formData.get("email")
            };

            try {
                const rawResult = await fetch("https://api.momence.com/integrations/customer-leads/291318/collect", {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    method: "POST",
                    body: JSON.stringify(values),
                });

                if (!rawResult.ok) {
                    const result = await rawResult.json();
                    throw new Error(result.error);
                }

                form.style.display = "none";
                if (successMessage) {
                    successMessage.style.display = "block";
                }
            } catch (e) {
                alert(e);
            }
        });
    }
}

// Update year in footer
const initYear = () => {
  document.querySelectorAll('.year').forEach(year => year.textContent = new Date().getFullYear());
};

// Highlight color animation
const initHighlightColor = () => {
  const root = document.documentElement;
  const styles = getComputedStyle(root);
  const violet = styles.getPropertyValue('--color--violet').trim();
  const yellow = styles.getPropertyValue('--color--yellow').trim();
  const pink = styles.getPropertyValue('--color--pink').trim();

  if (!violet || !yellow || !pink) return;

  const highlightMm = gsap.matchMedia();
  highlightMm.add("(min-width: 992px)", () => {
    gsap.set(root, { "--highlight": violet });
    const tl = gsap.timeline({ repeat: -1, defaults: { duration: 1, ease: 'none' } });
    tl.to(root, { "--highlight": yellow }).to(root, { "--highlight": pink }).to(root, { "--highlight": violet });
  });
};

// Initialize all functions
const initApp = () => {
  initPageTransitions();
  initPageFadeIn();
  initLazyVideos();
  initNavbarLogo();
  initNavGradients();
  initLinesRevealWhenFontsReady();
  initMenu();
  initExpandableMenu();
  initNavbarDropdown();
  initCurrentLink();
  initHeroCarousel();
  initConceptsList();
  initFadeUpStagger();
  initScrollMasks();
  initFooterEffects();
  initNewsletterForm();
  initYear();
  initHighlightColor();
  filterButtonsStates();
};

function initLinesRevealWhenFontsReady() {
  const fallback = setTimeout(() => {
    initLinesReveal();
  }, 1000);

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      clearTimeout(fallback);
      initLinesReveal();
    });
  } else {
    clearTimeout(fallback);
    initLinesReveal();
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
