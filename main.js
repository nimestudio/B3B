  // ELements fade-in on page load
document.addEventListener("DOMContentLoaded", () => {
  const isHomepageLoaderPresent = document.querySelector(".hero-loader-wrap");

  if (isHomepageLoaderPresent) {
    gsap.set("main > section, footer", { opacity: 1 });
    return;
  }

  const navbar = document.querySelector(".navbar-overlay");
  if (navbar) {
    gsap.set(navbar, { y: "-100%" });
    gsap.to(navbar, {
      y: "0%",
      duration: 1,
      delay: 0.25,
      ease: "power2.out"
    });
  }

  const elementsToFade = document.querySelectorAll("main > section, footer");
  if (elementsToFade.length) {
    gsap.fromTo(
      elementsToFade,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1.5,
        ease: "power1.out",
        delay: 0.4,
        stagger: 0.15
      }
    );
  }
});
  
// Lazy load videos
document.addEventListener("DOMContentLoaded", function() {
  let lazyVideos = [].slice.call(document.querySelectorAll("video.concept-video"));

  if ("IntersectionObserver" in window) {
    let lazyVideoObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(video) {
        if (video.isIntersecting) {
          let vidEl = video.target;

          if (vidEl.dataset.src) {
            vidEl.src = vidEl.dataset.src;
          }

          vidEl.load();
          lazyVideoObserver.unobserve(vidEl);
        }
      });
    });

    lazyVideos.forEach(function(lazyVideo) {
      lazyVideoObserver.observe(lazyVideo);
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
  display: 'block',
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
const menuText = document.querySelector('.button-nav-menu > .button-text-wrap');
const cerrarText = document.querySelector('.button-nav-menu > .button-text-wrap.cerrar');

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
      duration: 1,
      stagger: { each: 0.05, from: 'start' },
      ease: 'power2.out'
    });
  };

  const hideDropdown = () => {
    clearTimeout(hideTimer);

    hideTimer = setTimeout(() => {
      if (!dropdownTrigger.matches(':hover') && !dropdownListWrap.matches(':hover')) {
        gsap.to(dropdownItems, {
          opacity: 0,
          y: 10,
          duration: 0.5,
          ease: 'power1.in',
          overwrite: true,
          stagger: { each: 0.05, from: 'end' },
          onComplete: () => {
            gsap.set(dropdownListWrap, {
              display: 'none',
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
    if (img) {
      img.classList.remove('hero-carousel-image');
      img.classList.add('is-button-img');
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
const bgColors = ['var(--color--violet)', 'var(--color--yellow)', 'var(--color--pink)'];
const conceptMedia = gsap.matchMedia();

function setConceptItemsLayout() {
  const isMobile = window.matchMedia('(max-width: 767px)').matches;
  const offsetMultiplier = isMobile ? 1 : 3.5;
  const baseTopSpace = isMobile ? 92 : 96;

  conceptItems.forEach((item, index) => {
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
  
  const colorTl = gsap.timeline({
    scrollTrigger: {
      trigger: item,
      start: () => {
        const itemTop = parseFloat(window.getComputedStyle(item).top);
        const dynamicOffset = window.innerHeight * 0.2;
        return "top " + (itemTop + dynamicOffset) + "px";
      },
      toggleActions: "play none none reverse",
      invalidateOnRefresh: true
    }
  });

  if (svgBg) {
    colorTl.fromTo(svgBg, 
      { color: '#FFFFFF' }, 
      { 
        color: bgColors[index % bgColors.length],
        duration: 0.3,
        ease: "power1.inOut"
      },
      0
    );
  }

  colorTl.to(item, {
    borderColor: borderColors[index % borderColors.length],
    duration: 0.3,
    ease: "power1.inOut"
  }, 0);

  conceptMedia.add("(min-width: 768px)", () => {
    if (infoWrap) gsap.set(infoWrap, { opacity: 0, x: -50 });
    if (videoWrap) gsap.set(videoWrap, { opacity: 0, x: 50 });

    const contentTl = gsap.timeline({
      scrollTrigger: {
        trigger: item,
        start: "top 80%"
      }
    });

    if (infoWrap) {
      contentTl.to(infoWrap, { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" }, 0);
    }

    if (videoWrap) {
      contentTl.to(videoWrap, { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" }, 0);
    }
  });
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
      gsap.set(firstPaths, { yPercent: 120, transformOrigin: '50% 100%' });
      gsap.set(secondPaths, { yPercent: 120, transformOrigin: '50% 100%' });

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
            duration: 1,
            stagger: 0.08
          });

          tl.to(secondPaths, {
            yPercent: 0,
            duration: 1,
            stagger: 0.08
          }, '-=1.5');
        }
      });

      const allPaths = [...firstPaths, ...secondPaths];

      allPaths.forEach(path => {
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

// Concepts fade in animation
document.addEventListener("DOMContentLoaded", () => {
  const filtersSection = document.querySelector('.filtered-studios-list');
  if (!filtersSection) return;

  const studiosMm = gsap.matchMedia();
  let isDesktop = false;

  studiosMm.add("(min-width: 992px)", () => {
    isDesktop = true;
    gsap.set('.filtros-studio-item', { opacity: 0, y: 20 });
    
    return () => {
      isDesktop = false;
      gsap.set('.filtros-studio-item', { opacity: 1, y: 0, clearProps: "all" });
    };
  });

  let hasAnimatedInitially = false;

  function animateItems(container) {
    const items = container.querySelectorAll('.filtros-studio-item');
    if (items.length === 0) return;

    gsap.killTweensOf(items);

    if (isDesktop) {
      gsap.set(items, { opacity: 0, y: 20 });
      gsap.to(items, {
        opacity: 1,
        y: 0,
        duration: 1.5,
        delay: 0.2,
        stagger: 0.2,
        ease: "power2.out",
        clearProps: "opacity,transform"
      });
    } else {
      gsap.set(items, { opacity: 1, y: 0, clearProps: "all" });
    }
  }

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      hasAnimatedInitially = true;
      const activePane = document.querySelector('.w-tab-pane.w--tab-active');
      if (activePane) animateItems(activePane);
      observer.disconnect();
    }
  }, { threshold: 0.15 });

  observer.observe(filtersSection);

  const tabPanes = document.querySelectorAll('.w-tab-pane');
    
  tabPanes.forEach(pane => {
    const mutObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class' && pane.classList.contains('w--tab-active')) {
          if (!hasAnimatedInitially) {
            hasAnimatedInitially = true;
            observer.disconnect();
          }
          animateItems(pane);
        }
      });
    });
    mutObserver.observe(pane, { attributes: true });
  });

  window.fsAttributes = window.fsAttributes || [];
  window.fsAttributes.push([
    'cmsfilter',
    (filterInstances) => {
      filterInstances.forEach(filterInstance => {
        filterInstance.listInstance.on('renderitems', () => {
          const activePane = document.querySelector('.w-tab-pane.w--tab-active');
          if (activePane && activePane.contains(filterInstance.listInstance.list)) {
            if (!hasAnimatedInitially) {
              hasAnimatedInitially = true;
              observer.disconnect();
            }
            animateItems(activePane);
          }
        });
      });
    }
  ]);
});


// Stop fading edge when scrolled till the end

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

const highlightMm = gsap.matchMedia();

highlightMm.add("(min-width: 992px)", () => {
  gsap.set(root, { "--highlight": violet });

  const tl = gsap.timeline({ repeat: -1, defaults: { duration: 1, ease: 'none' } });

  tl.to(root, { "--highlight": yellow })
    .to(root, { "--highlight": pink })
    .to(root, { "--highlight": violet });
});