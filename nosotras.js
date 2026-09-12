
  gsap.registerPlugin(ScrollTrigger, Draggable);

// Photos Marquee
const initPhotosMarquee = () => {
  const marqueeWrapper = document.querySelector('.marquee-wrapper');
  if (!marqueeWrapper) return;

  const loop = gsap.to(marqueeWrapper, {
    xPercent: -50,
    repeat: -1,
    duration: 120,
    ease: 'none'
  });

  const clampVelocity = gsap.utils.clamp(1, 15);

  ScrollTrigger.create({
    onUpdate: (self) => {
      const scrollVelocity = Math.abs(self.getVelocity() / 80);
      const targetScale = clampVelocity(1 + scrollVelocity);

      gsap.to(loop, {
        timeScale: targetScale,
        duration: 0.2,
        overwrite: true,
        onComplete: () => {
          gsap.to(loop, {
            timeScale: 1,
            duration: 1.5,
            ease: 'power2.out'
          });
        }
      });
    }
  });
};

// Interactive Infographic
const initCultureInfographic = () => {
  const cultureSection = document.querySelector('.culture-path-section');
  if (!cultureSection) return;

  const cultureTooltip = document.querySelector('.cursor-tooltip');
  const cultureTooltipWrappers = document.querySelectorAll('.tooltip-content-wrapper');
  const cultureTracks = document.querySelectorAll('.dashed-track');
  const cultureNodes = document.querySelectorAll('.path-node');
  const cultureTriggers = document.querySelectorAll('.trigger');
  const cultureMobileCards = document.querySelectorAll('.mobile-card');
  const cultureArrowLeft = document.querySelector('.arrow-left');
  const cultureArrowRight = document.querySelector('.arrow-right');
  const cultureWrap = document.querySelector('.culture-wrap');

  const cultureStates = [
    { pillBg: '#3A1F90', pillBorder: '#3A1F90', ringBg: '#D7CAFF', ringBorder: '#AB95FF' },
    { pillBg: '#7B651A', pillBorder: '#7B651A', ringBg: '#FFE383', ringBorder: '#F7C03E' },
    { pillBg: '#B84A7C', pillBorder: '#B84A7C', ringBg: '#FFCEE4', ringBorder: '#FF9DC6' }
  ];

  let cultureCurrentIndex = -1;
  let cultureHideTimeout;
  let cultureRingTweens = [];
  const cultureDashTweens = [];

  gsap.set('.track-1', { zIndex: 5 });
  gsap.set('.track-2', { zIndex: 4 });
  gsap.set('.track-3', { zIndex: 3 });
  gsap.set('.path-node', { zIndex: 10, pointerEvents: 'auto' });

  cultureTracks.forEach((track) => {
    const rect = track.querySelector('rect');
    if (rect) {
      const dashTween = gsap.to(rect, {
        strokeDashoffset: -50,
        duration: 3,
        ease: 'none',
        repeat: -1,
        paused: true
      });
      cultureDashTweens.push(dashTween);
    } else {
      cultureDashTweens.push(null);
    }
  });

  const buildCultureRings = (expandAmount) => {
    cultureRingTweens.forEach(tl => tl?.kill());
    cultureRingTweens = [];

    cultureNodes.forEach((node) => {
      const rings = node.querySelectorAll('.ring');
      
      gsap.set(rings, { 
        border: '1px solid transparent', 
        backgroundColor: 'transparent',
        borderRadius: '200px',
        position: 'absolute' 
      });

      const tl = gsap.timeline({ paused: true });
      
      rings.forEach((ring, r) => {
        const ringTl = gsap.timeline({ repeat: -1, delay: r * 1.5 });
        
        ringTl.fromTo(ring,
          { top: 0, bottom: 0, left: 0, right: 0 },
          { top: -expandAmount, bottom: -expandAmount, left: -expandAmount, right: -expandAmount, duration: 4, ease: 'power1.out' },
          0
        )
        .fromTo(ring, { opacity: 0.6 }, { opacity: 0.6, duration: 2, ease: 'none' }, 0)
        .to(ring, { opacity: 0, duration: 2, ease: 'power1.out' }, 2);
        
        tl.add(ringTl, 0);
      });
      
      cultureRingTweens.push(tl);
    });
  };

  const updateCultureState = (index, isMobile = false) => {
    if (cultureCurrentIndex === index) return;
    cultureCurrentIndex = index;

    cultureNodes.forEach((node, i) => {
      const pill = node.querySelector('.node-pill');
      const text = node.querySelector('.node-text');
      const rings = node.querySelectorAll('.ring');
      const rect = cultureTracks[i]?.querySelector('rect');

      const isCurrent = i === index;
      const isPast = i < index;

      gsap.to(pill, { 
        backgroundColor: isCurrent ? cultureStates[i].pillBg : '#F2F2F2', 
        borderColor: isCurrent ? cultureStates[i].pillBorder : '#dcdcdc', 
        duration: 0.4 
      });
      
      gsap.to(text, { 
        color: isCurrent ? '#FFFFFF' : '#636363', 
        duration: 0.15 
      });
      
      gsap.to(rings, { 
        backgroundColor: isCurrent ? cultureStates[i].ringBg : 'transparent', 
        borderColor: isCurrent ? cultureStates[i].ringBorder : 'transparent', 
        duration: 0.4 
      });

      if (rect) gsap.to(rect, { stroke: isCurrent ? '#ababab' : '#d9d9d9', duration: 0.4 });
      if (cultureTracks[i]) gsap.to(cultureTracks[i], { opacity: (isCurrent || isPast) ? 1 : 0, duration: 0.4 });

      if (isCurrent) {
        cultureRingTweens[i]?.play();
        cultureDashTweens[i]?.play();
      } else {
        cultureRingTweens[i]?.pause();
        gsap.set(rings, { opacity: 0 });
        cultureDashTweens[i]?.pause();
      }
    });
    
if (isMobile) {
      const outgoingCards = Array.from(cultureMobileCards).filter((_, i) => i !== index);
      const incomingCard = cultureMobileCards[index];

      gsap.to(outgoingCards, {
        opacity: 0,
        pointerEvents: 'none',
        zIndex: 1,
        duration: 0.15
      });

      if (incomingCard) {
        gsap.to(incomingCard, {
          opacity: 1,
          pointerEvents: 'auto',
          zIndex: 2,
          duration: 0.3,
          delay: 0.1
        });
      }

      cultureMobileCards.forEach((card, i) => {
        card.classList.toggle('is-active', i === index);
      });
      
      if (cultureArrowLeft) {
        const isFirst = index === 0;
        cultureArrowLeft.classList.toggle('is-disabled', isFirst);
        gsap.to(cultureArrowLeft, { opacity: isFirst ? 0.3 : 1, pointerEvents: isFirst ? 'none' : 'auto', duration: 0.3 });
      }
      
      if (cultureArrowRight) {
        const isLast = index === cultureNodes.length - 1;
        cultureArrowRight.classList.toggle('is-disabled', isLast);
        gsap.to(cultureArrowRight, { opacity: isLast ? 0.3 : 1, pointerEvents: isLast ? 'none' : 'auto', duration: 0.3 });
      }
    }
  };

  const cultureMatchMedia = gsap.matchMedia();

  cultureMatchMedia.add("(min-width: 992px)", () => {
    buildCultureRings(45);
    
    cultureCurrentIndex = -1;
    gsap.set(cultureTooltip, { opacity: 0 });
    gsap.set(cultureSection, { x: 0 });
    
    const xTo = gsap.quickTo(cultureTooltip, 'x', { duration: 0.8, ease: 'power3.out' });
    const yTo = gsap.quickTo(cultureTooltip, 'y', { duration: 0.8, ease: 'power3.out' });
    const listeners = [];

    const onLeave = () => {
      cultureHideTimeout = setTimeout(() => {
        gsap.killTweensOf(cultureTooltip, "opacity");
        gsap.to(cultureTooltip, { opacity: 0, duration: 0.3 });
        updateCultureState(0, false);
      }, 50);
    };

    const onMove = (e) => {
      const rect = cultureSection.getBoundingClientRect();
      const tooltipHeight = cultureTooltip.offsetHeight;
      
      xTo(e.clientX - rect.left);
      yTo(e.clientY - rect.top - tooltipHeight - 32);
    };

    const bindEvents = (elements) => {
      elements.forEach((el, i) => {
        const onEnter = () => {
          clearTimeout(cultureHideTimeout);
          gsap.killTweensOf(cultureTooltip, "opacity");
          gsap.to(cultureTooltip, { opacity: 1, duration: 0.3, delay: 0.1 });
          
          cultureTooltipWrappers.forEach(w => w.classList.remove('is-active'));
          if (cultureTooltipWrappers[i]) cultureTooltipWrappers[i].classList.add('is-active');
          
          updateCultureState(i, false);
        };
        
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
        
        listeners.push({ el, type: 'mouseenter', fn: onEnter });
        listeners.push({ el, type: 'mouseleave', fn: onLeave });
      });
    };

    bindEvents(cultureNodes);
    bindEvents(cultureTriggers);

    cultureSection.addEventListener('mousemove', onMove);
    cultureSection.addEventListener('mouseleave', onLeave);

    updateCultureState(0, false);

    return () => {
      listeners.forEach(l => l.el.removeEventListener(l.type, l.fn));
      cultureSection.removeEventListener('mousemove', onMove);
      cultureSection.removeEventListener('mouseleave', onLeave);
    };
  });

  cultureMatchMedia.add("(max-width: 991px)", () => {
    buildCultureRings(25);
    
    cultureCurrentIndex = -1;
    let snapPoints = [];
    
    const calculateSnaps = () => {
      snapPoints = [];
      if (!cultureWrap || !cultureSection) return;
      
      const wrapWidth = cultureWrap.offsetWidth;
      const sectionWidth = cultureSection.scrollWidth;
      const computedStyle = window.getComputedStyle(cultureWrap);
      const paddingLeft = parseFloat(computedStyle.paddingLeft) || 0;
      const paddingRight = parseFloat(computedStyle.paddingRight) || 0;
      const contentWidth = wrapWidth - paddingLeft - paddingRight;
      const maxScroll = Math.min(0, contentWidth - sectionWidth);
      const contentCenter = contentWidth / 2;
      
      cultureNodes.forEach(node => {
        const nodeCenter = node.offsetLeft + (node.offsetWidth / 2);
        let targetX = contentCenter - nodeCenter;
        targetX = Math.max(maxScroll, Math.min(0, targetX));
        snapPoints.push(targetX);
      });
    };
    
    calculateSnaps();
    
    const checkCultureMask = (currentX) => {
      if (!cultureWrap || !snapPoints.length) return;
      const minX = snapPoints[snapPoints.length - 1];
      cultureWrap.classList.toggle('is-at-end', currentX <= minX + 5);
    };

    const moveSlider = (index) => {
      gsap.to(cultureSection, {
        x: snapPoints[index],
        duration: 0.6,
        ease: "power3.out",
        onUpdate: function() {
          checkCultureMask(gsap.getProperty(cultureSection, 'x'));
        }
      });
      updateCultureState(index, true);
    };

    const dragInstance = Draggable.create(cultureSection, {
      type: "x",
      bounds: {
        minX: snapPoints[snapPoints.length - 1],
        maxX: snapPoints[0]
      },
      snap: snapPoints,
      onDrag: function() {
        checkCultureMask(this.x);
      },
      onDragEnd: function() {
        const closest = snapPoints.reduce((prev, curr, i) => {
          return (Math.abs(curr - this.endX) < Math.abs(snapPoints[prev] - this.endX) ? i : prev);
        }, 0);
        moveSlider(closest);
      }
    });

    const handleResize = () => {
      calculateSnaps();
      const targetX = snapPoints[cultureCurrentIndex > -1 ? cultureCurrentIndex : 0];
      gsap.set(cultureSection, { x: targetX });
      checkCultureMask(targetX);
      
      if (dragInstance && dragInstance[0]) {
          dragInstance[0].applyBounds({
            minX: snapPoints[snapPoints.length - 1],
            maxX: snapPoints[0]
          });
      }
    };
    
    window.addEventListener('resize', handleResize);

    const nextSlide = () => {
      if (cultureCurrentIndex < cultureNodes.length - 1) {
        moveSlider(cultureCurrentIndex + 1);
      }
    };

    const prevSlide = () => {
      if (cultureCurrentIndex > 0) {
        moveSlider(cultureCurrentIndex - 1);
      }
    };

    if (cultureArrowRight) cultureArrowRight.addEventListener('click', nextSlide);
    if (cultureArrowLeft) cultureArrowLeft.addEventListener('click', prevSlide);
    
    const initialX = snapPoints[0];
    gsap.set(cultureSection, { x: initialX });
    checkCultureMask(initialX);
    updateCultureState(0, true);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (cultureArrowRight) cultureArrowRight.removeEventListener('click', nextSlide);
      if (cultureArrowLeft) cultureArrowLeft.removeEventListener('click', prevSlide);
      if (dragInstance && dragInstance[0]) dragInstance[0].kill();
    };
  });
};

// Testimonials
const initTestimonials = () => {
  const testimonials = document.querySelectorAll('.nosotras-testimonial');
  if (!testimonials.length) return;

  const colorCombos = [
    { bg: 'var(--color--violet)', border: 'var(--color--violet-stroke)' },
    { bg: 'var(--color--yellow)', border: 'var(--color--yellow-stroke)' },
    { bg: 'var(--color--pink)', border: 'var(--color--pink-stroke)' }
  ];

  testimonials.forEach((testimonial, index) => {
    const combo = colorCombos[index % 3];
    testimonial.style.backgroundColor = combo.bg;
    testimonial.style.borderColor = combo.border;
  });

  const testimonialsList = document.querySelector('.nosotras-testimonials-list');
  const testimonialsWrap = document.querySelector('.nosotras-testimonials');

  if (testimonialsList && testimonialsWrap) {
    const getBounds = () => ({
      minX: Math.min(0, testimonialsWrap.offsetWidth - testimonialsList.scrollWidth),
      maxX: 0
    });

    let activeCard = null;

    const checkEnd = function() {
      if (this.x <= this.minX + 5) {
        testimonialsWrap.classList.add('is-at-end');
      } else {
        testimonialsWrap.classList.remove('is-at-end');
      }
    };

    const dragInstance = Draggable.create(testimonialsList, {
      type: "x",
      bounds: getBounds(),
      inertia: true,
      throwResistance: 1500,
      onDrag: checkEnd,
      onThrowUpdate: checkEnd,
      onPress: function(e) {
        activeCard = e.target.closest('.nosotras-testimonial');
        if (activeCard) {
          gsap.to(activeCard, { scale: 0.99, duration: 0.2, ease: 'power2.out' });
        }
      },
      onRelease: function() {
        if (activeCard) {
          gsap.to(activeCard, { scale: 1, duration: 0.2, ease: 'power2.out' });
          activeCard = null;
        }
      }
    });

    if (dragInstance && dragInstance[0]) {
      if (dragInstance[0].x <= dragInstance[0].minX + 5) {
        testimonialsWrap.classList.add('is-at-end');
      }
    }

    window.addEventListener('resize', () => {
      if (dragInstance && dragInstance[0]) {
        dragInstance[0].applyBounds(getBounds());
        
        if (dragInstance[0].x <= dragInstance[0].minX + 5) {
          testimonialsWrap.classList.add('is-at-end');
        } else {
          testimonialsWrap.classList.remove('is-at-end');
        }
      }
    });

    let mmFadein = gsap.matchMedia();

    mmFadein.add("(min-width: 992px)", () => {
      gsap.set(testimonials, { opacity: 0 });

      ScrollTrigger.batch(testimonials, {
        start: 'top 85%',
        once: true,
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
            overwrite: 'auto'
          }
        )
      });
    });
  }
};

const initPage = () => {
  initPhotosMarquee();
  initCultureInfographic();
  initTestimonials();
};

// Initialize the page when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPage);
} else {
  initPage();
}