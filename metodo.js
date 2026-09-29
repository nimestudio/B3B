// Circles infography animation

gsap.registerPlugin(ScrollTrigger);

gsap.set('.circle-indicator-dot', { xPercent: -50, yPercent: -50, x: 0, y: 0 });

gsap.to('.dot-pivot-wrapper', {
  rotation: 360,
  duration: 40,
  repeat: -1,
  ease: 'none'
});

const states = [
  { bg: '#D2C4FF', stroke: '#9984DF', dotBg: '#F0EBFF', scale: 1 },
  { bg: '#FFE99C', stroke: '#CFAB32', dotBg: '#FFF4CD', scale: 1.3333 },
  { bg: '#FED3E7', stroke: '#E596BA', dotBg: '#FFEAF4', scale: 1.6666 }
];

const blocks = document.querySelectorAll('.pillar-content-block');
const activeCircle = document.querySelector('.active-circle');
const indicatorDot = document.querySelector('.circle-indicator-dot');
const textElements = document.querySelectorAll('.circle-text');

if (textElements.length > 0) {
  textElements[0].classList.add('is-active');
}

function updateVisualState(index) {
  const currentState = states[index];
  if (!currentState) return;

  activeCircle.style.backgroundColor = currentState.bg;
  activeCircle.style.borderColor = currentState.stroke;
  indicatorDot.style.borderColor = currentState.stroke;
  indicatorDot.style.backgroundColor = currentState.dotBg;

  textElements.forEach((text, i) => {
    if (i === index) {
      text.classList.add('is-active');
    } else {
      text.classList.remove('is-active');
    }
  });
}

const circleMm = gsap.matchMedia();

circleMm.add({
  isDesktop: "(min-width: 768px)",
  isMobile: "(max-width: 767px)"
}, (context) => {
  let { isMobile } = context.conditions;

  const toggleStart = isMobile ? "top 85%" : "top 50%";
  const toggleEnd = isMobile ? "bottom 85%" : "bottom 50%";
  const scrubStart = isMobile ? "top 85%" : "top 85%";
  const scrubEnd = isMobile ? "top 55%" : "top 50%";
  
  blocks.forEach((block, index) => {
    ScrollTrigger.create({
      trigger: block,
      start: toggleStart,
      end: toggleEnd,
      onToggle: (self) => {
        if (self.isActive) {
          updateVisualState(index);
        }
      }
    });

    if (index > 0) {
      gsap.fromTo('.active-circle',
        { scale: states[index - 1].scale },
        {
          scale: states[index].scale,
          ease: 'power3.in',
          immediateRender: false,
          scrollTrigger: {
            trigger: block,
            start: scrubStart,
            end: scrubEnd,
            scrub: true
          }
        }
      );

      gsap.fromTo('.circle-indicator-dot, .circle-text-wrap',
        { scale: 1 / states[index - 1].scale },
        {
          scale: 1 / states[index].scale,
          ease: 'power3.in',
          immediateRender: false,
          scrollTrigger: {
            trigger: block,
            start: scrubStart,
            end: scrubEnd,
            scrub: true
          }
        }
      );
    }
  });
});