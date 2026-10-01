const updateBookLinks = () => {
  const currentPath = window.location.pathname.replace(/\/$/, "");
  const studioSlug = currentPath.substring(currentPath.lastIndexOf('/') + 1);

  if (studioSlug) {
    const bookButtons = document.querySelectorAll('a[href*="/clase-de-prueba"], a[data-dynamic-link]');
    
    bookButtons.forEach(link => {
      const href = link.getAttribute('href');
      if (href) {
        const baseUrl = href.split('?')[0];
        link.setAttribute('href', `${baseUrl}?studio=${studioSlug}`);
      }
    });
  }
};

const initFiltersAnimation = () => {
  const wrapper = document.querySelector('.studios-city-filter') || document.querySelector('.w-tabs');
  if (!wrapper) return;

  const studiosMm = gsap.matchMedia();
  let isDesktop = false;

  studiosMm.add("(min-width: 992px)", () => {
    isDesktop = true;
    gsap.set(wrapper.querySelectorAll('.filtros-studio-item'), { opacity: 0, y: 20 });
    return () => {
      isDesktop = false;
      gsap.set(wrapper.querySelectorAll('.filtros-studio-item'), { opacity: 1, y: 0, clearProps: "all" });
    };
  });

  const getActivePane = () => wrapper.querySelector('.w-tab-pane.w--tab-active') || wrapper;

  const runStagger = (container) => {
    if (!container || !isDesktop) return;
    const items = container.querySelectorAll('.filtros-studio-item');
    if (!items.length) return;

    gsap.killTweensOf(items);
    gsap.to(items, {
      opacity: 1,
      y: 0,
      duration: 1.5,
      stagger: 0.15,
      ease: "power2.out",
      clearProps: "transform"
    });
  };

  const hideActiveItems = () => {
    if (!isDesktop) return;
    const items = wrapper.querySelectorAll('.filtros-studio-item');
    gsap.killTweensOf(items);
    gsap.set(items, { opacity: 0, y: 20 });
  };

  let clickTimer = null;
  const triggerDelayedAnimation = (delay = 300) => {
    if (clickTimer) clearTimeout(clickTimer);
    clickTimer = setTimeout(() => {
      runStagger(getActivePane());
    }, delay);
  };

  wrapper.querySelectorAll('.w-tab-link, .filter-button, input[type="radio"], label[fs-cmsfilter-element]').forEach((btn) => {
    btn.addEventListener('click', () => {
      hideActiveItems();
      triggerDelayedAnimation(300);
    });
  });

  const scrollObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      runStagger(getActivePane());
      scrollObserver.disconnect();
    }
  }, { threshold: 0.15 });

  scrollObserver.observe(wrapper);
};

const initAll = () => {
  updateBookLinks();
  initFiltersAnimation();
};

document.addEventListener('DOMContentLoaded', initAll);