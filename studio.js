// Concept item color assignment
const conceptItems = document.querySelectorAll('.concept-item');
const borderColors = ['#9984DF', '#CFAB32', '#E596BA'];
const textColors = ['#C3B1FF', '#FFE383', '#FFBBDA'];

conceptItems.forEach((item, index) => {
  item.style.borderColor = borderColors[index % borderColors.length];
  item.style.top = index === 0 ? '0' : `${index * 3.5}rem`;

  const svgBg = item.querySelector('.concept-svg-bg');
  if (svgBg) svgBg.style.color = textColors[index % textColors.length];
});