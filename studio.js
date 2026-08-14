// Concepts list
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
    if (svgBg) svgBg.style.color = textColors[index % textColors.length];
  });
}

setConceptItemsLayout();
window.addEventListener('resize', setConceptItemsLayout);