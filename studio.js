// Concepts list
gsap.registerPlugin(ScrollTrigger);

const conceptItems = document.querySelectorAll('.concept-item');
const borderColors = ['#9984DF', '#CFAB32', '#E596BA'];
const textColors = ['#C3B1FF', '#FFE383', '#FFBBDA'];

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

// After
const afterStudiosList = document.querySelector('.after-studios-list');
const conceptsList = document.querySelector('.concepts-list');
const conceptItemsNodeList = document.querySelectorAll('.concept-item');

if (afterStudiosList && conceptsList) {
  conceptsList.appendChild(afterStudiosList);
}

if (conceptItemsNodeList.length > 0) {
  conceptItemsNodeList[conceptItemsNodeList.length - 1].classList.add('last-concept-item');
}