// Bonos: color, sort and load animation

let needsFadeIn = true;
let activeCard = null;

const initBonos = () => {
  const collections = document.querySelectorAll('.bonos-collection');
  if (!collections.length) return;

  const colorMap = {
    'Lila 1': { bg: '#F4F0FF', border: '#9984DF' },
    'Lila 2': { bg: '#EBE4FF', border: '#9984DF' },
    'Lila 3': { bg: '#D2C4FF', border: '#9984DF' },
    'Amarillo 1': { bg: '#FFF9E6', border: '#CFAB32' },
    'Amarillo 2': { bg: '#FFEEB5', border: '#CFAB32' },
    'Amarillo 3': { bg: '#FFE383', border: '#CFAB32' },
    'Rosado': { bg: '#FFBBDA', border: '#E596BA' }
  };

  collections.forEach((collection) => {
    const list = collection.querySelector('.bonos-list');
    if (!list) return;

    const items = Array.from(list.querySelectorAll('.bono-item'));

    const getPrice = (item) => {
      const priceEl = item.querySelector('.bono-price');
      if (!priceEl) return 0;

      const match = priceEl.textContent.match(/\d+([.,]\d+)?/);
      if (!match) return 0;

      return parseFloat(match[0].replace(',', '.'));
    };

    items.sort((a, b) => getPrice(a) - getPrice(b));

    items.forEach((item) => {
      const colorEl = item.querySelector('.bono-color');

      if (colorEl) {
        const colorText = colorEl.textContent.trim();

        if (colorMap[colorText]) {
          item.style.backgroundColor = colorMap[colorText].bg;
          item.style.borderColor = colorMap[colorText].border;
        }
      }

      list.appendChild(item);
    });
  });
};

const handleDraggable = () => {
  if (typeof gsap === 'undefined' || typeof Draggable === 'undefined') return;

  const list = document.querySelector('.bonos-list');
  if (!list) return;

  const existingDraggable = Draggable.get(list);

  if (window.innerWidth < 991) {
    list.classList.remove('draggable-active-list', 'grid-4-mode');
    if (existingDraggable) {
      existingDraggable.kill();
    }
    gsap.set(list, { clearProps: "x,transform" });
    gsap.set('.bono-item', { clearProps: "opacity,transform,y,scale" });
    return;
  }

  const parent = list.parentElement;
  if (!parent) return;

  requestAnimationFrame(() => {
    const visibleItems = Array.from(list.querySelectorAll('.bono-item')).filter(
      (el) => getComputedStyle(el).display !== 'none'
    );

    const shouldDrag = visibleItems.length > 4;

    if (shouldDrag) {
      list.classList.remove('grid-4-mode');
      list.classList.add('draggable-active-list');

      const parentWidth = parent.clientWidth;
      const listWidth = list.scrollWidth;
      const minX = parentWidth - listWidth;

      if (existingDraggable) {
        existingDraggable.applyBounds({ minX: minX, maxX: 0 });
        existingDraggable.update(true);
      } else {
        Draggable.create(list, {
          type: "x",
          bounds: { minX: minX, maxX: 0 },
          inertia: typeof InertiaPlugin !== 'undefined',
          throwResistance: 1500,
          onPress: function (e) {
            activeCard = e.target.closest('.bono-item');
            if (activeCard) {
              gsap.to(activeCard, { scale: 0.99, duration: 0.2, ease: "power2.out", overwrite: "auto" });
            }
          },
          onRelease: function () {
            if (activeCard) {
              gsap.to(activeCard, { scale: 1, duration: 0.2, ease: "power2.out", overwrite: "auto" });
              activeCard = null;
            }
          }
        });
      }
    } else {
      list.classList.remove('draggable-active-list');
      list.classList.add('grid-4-mode');

      if (existingDraggable) {
        existingDraggable.kill();
      }
      gsap.set(list, { clearProps: "x,transform" });
    }

    if (needsFadeIn) {
      needsFadeIn = false;

      gsap.fromTo(
        visibleItems,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.08,
          ease: "power2.out",
          overwrite: "auto"
        }
      );
    }
  });
};

const triggerRecalculation = () => {
  if (window.innerWidth < 991) return;

  needsFadeIn = true;
  const items = document.querySelectorAll('.bono-item');
  if (items.length && typeof gsap !== 'undefined') {
    gsap.to(items, { opacity: 0, y: 15, duration: 0.1, ease: "power1.in", overwrite: "auto" });
  }

  let attempts = 0;
  const interval = setInterval(() => {
    handleDraggable();
    attempts++;
    if (attempts >= 5) {
      clearInterval(interval);
    }
  }, 80);
};

document.addEventListener('DOMContentLoaded', () => {
  initBonos();
  if (window.innerWidth >= 991) {
    triggerRecalculation();
  }
});

window.addEventListener('resize', handleDraggable);

document.addEventListener('click', (e) => {
  if (e.target.closest('.filter-button') || e.target.closest('[fs-cmsfilter-element]')) {
    triggerRecalculation();
  }
});

document.addEventListener('change', (e) => {
  if (e.target.closest('.filter-button') || e.target.closest('[fs-cmsfilter-element]')) {
    triggerRecalculation();
  }
});