// Populate memberships with Momence API. Filter, assign colors, hover effects, and handle draggable behavior

const tokens = {
    "291318": "65c398871e",
    "291319": "8df8f346e1",
    "291317": "50d59e1853",
    "225970": "e13d580bac",
    "291316": "75bf66e4fe"
};

const colorMap = {
    'Lila 1': { bg: '#F4F0FF', border: '#9984DF' },
    'Lila 2': { bg: '#EBE4FF', border: '#9984DF' },
    'Lila 3': { bg: '#D2C4FF', border: '#9984DF' },
    'Amarillo 1': { bg: '#FFF9E6', border: '#CFAB32' },
    'Amarillo 2': { bg: '#FFEEB5', border: '#CFAB32' },
    'Amarillo 3': { bg: '#FFE383', border: '#CFAB32' },
    'Rosado': { bg: '#FFBBDA', border: '#E596BA' }
};

const lang = document.documentElement.lang && document.documentElement.lang.toLowerCase().startsWith('en') ? 'en' : 'es';

const t = {
    es: { buy: "Comprar", book: "Reservar", free: "Gratis" },
    en: { buy: "Buy", book: "Book", free: "Free" }
};

let currentStudioId = "";
let currentStudioName = "";
let currentType = "subscription";
const membershipsCache = {};

let activeCard = null;
let needsFadeIn = true;
let isRendering = false;

function formatPrice(price) {
    const num = parseFloat(price || 0);
    
    if (num === 0) {
        return t[lang].free;
    }
    
    return num.toFixed(2).replace('.', ',') + "€";
}

function getCardTheme(name, counters) {
    const lowerName = (name || "").toLowerCase();
    
    if (lowerName.includes("vip")) {
        return { name: 'Amarillo 3', colors: colorMap['Amarillo 3'] };
    }
    
    if (lowerName.includes("ilimitado") || lowerName.includes("unlimited")) {
        return { name: 'Rosado', colors: colorMap['Rosado'] };
    }
    
    if (lowerName.includes("prueba") || lowerName.includes("trial") || lowerName.includes("weekend")) {
        const index = (counters.trial % 3) + 1;
        counters.trial++;
        const colorName = `Amarillo ${index}`;
        return { name: colorName, colors: colorMap[colorName] };
    }
    
    const index = (counters.pack % 3) + 1;
    counters.pack++;
    const colorName = `Lila ${index}`;
    return { name: colorName, colors: colorMap[colorName] };
}

function attachHoverEffect(link) {
    const buttonTexts = link.querySelectorAll('.button-text');
    const details = link.querySelector('.bono-details');
    const nonlinkButton = link.querySelector('.nonlink-button');

    link.addEventListener('mouseenter', () => {
        gsap.to(buttonTexts, { yPercent: -100, duration: 0.5, ease: "expo.out" });
        gsap.to(details, { color: "#636363", duration: 0.2, ease: "power1.out" });
        gsap.to(nonlinkButton, { color: "#b6b6b6", backgroundColor: "#3d3d3d", duration: 0.2, ease: "power1.out" });
    });

    link.addEventListener('mouseleave', () => {
        gsap.to(buttonTexts, { yPercent: 0, duration: 0.5, ease: "expo.out" });
        gsap.to(details, { color: "#030303", duration: 0.2, ease: "power1.out" });
        gsap.to(nonlinkButton, { color: "#fff", backgroundColor: "#030303", duration: 0.2, ease: "power1.out" });
    });
}

async function fetchMemberships(hostId) {
    if (membershipsCache[hostId]) {
        return membershipsCache[hostId];
    }
    
    const token = tokens[hostId];
    if (!token) throw new Error();

    const url = `https://momence.com/_api/primary/api/v1/Memberships?hostId=${hostId}&token=${token}`;
    
    const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    });

    if (!response.ok) {
        throw new Error();
    }

    const data = await response.json();
    membershipsCache[hostId] = data;
    return data;
}

const handleDraggable = () => {
    if (typeof gsap === 'undefined' || typeof Draggable === 'undefined') return;

    const list = document.getElementById('memberships-grid') || document.querySelector('.bonos-list');
    if (!list) return;

    requestAnimationFrame(() => {
        const visibleItems = Array.from(list.querySelectorAll('.bono-item')).filter(
            (el) => getComputedStyle(el).display !== 'none'
        );
        const existingDraggable = Draggable.get(list);
        const spacer = list.querySelector('.list-spacer');

        if (window.innerWidth < 767) {
            list.classList.remove('draggable-active-list', 'bonos-4-mode');
            if (existingDraggable) {
                existingDraggable.kill();
            }
            gsap.set(list, { clearProps: "x,transform" });
            if (spacer) spacer.style.display = 'none';
        } else {
            const parent = list.parentElement;
            if (parent) {
                const shouldDrag = visibleItems.length > 4;

                if (shouldDrag) {
                    list.classList.remove('bonos-4-mode');
                    list.classList.add('draggable-active-list');
                    if (spacer) spacer.style.display = 'block';

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
                    list.classList.add('bonos-4-mode');
                    if (spacer) spacer.style.display = 'none';

                    if (existingDraggable) {
                        existingDraggable.kill();
                    }
                    gsap.set(list, { clearProps: "x,transform" });
                }
            }
        }

        if (needsFadeIn) {
            needsFadeIn = false;

            gsap.fromTo(
                visibleItems,
                { opacity: 0, y: 20 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.08,
                    ease: "power2.out",
                    overwrite: "auto"
                }
            );
        }
    });
};

const triggerRecalculation = () => {
    needsFadeIn = true;
    let attempts = 0;
    const interval = setInterval(() => {
        handleDraggable();
        attempts++;
        if (attempts >= 5) {
            clearInterval(interval);
        }
    }, 80);
};

async function renderMemberships() {
    if (isRendering) return;
    isRendering = true;

    const container = document.getElementById("memberships-grid");
    if (!container) {
        isRendering = false;
        return;
    }

    const existingItems = container.querySelectorAll('.bono-item');
    if (existingItems.length && typeof gsap !== 'undefined') {
        await new Promise(resolve => {
            gsap.to(existingItems, {
                opacity: 0,
                y: -10,
                duration: 0.15,
                ease: "power1.in",
                onComplete: resolve
            });
        });
    }

    try {
        const data = await fetchMemberships(currentStudioId);
        
        const filtered = data.filter(item => item.type === currentType);
        filtered.sort((a, b) => parseFloat(a.price || 0) - parseFloat(b.price || 0));

        container.innerHTML = "";
        
        const counters = { trial: 0, pack: 0 };

        filtered.forEach(item => {
            const itemDiv = document.createElement("div");
            itemDiv.className = "bono-item";
            itemDiv.setAttribute("role", "listitem");
            itemDiv.style.opacity = "0";
            
            const theme = getCardTheme(item.name, counters);
            itemDiv.style.backgroundColor = theme.colors.bg;
            itemDiv.style.borderColor = theme.colors.border;

            const itemLink = item.link || item.checkoutUrl || "#";
            const ctaText = parseFloat(item.price || 0) === 0 ? t[lang].book : t[lang].buy;

            itemDiv.innerHTML = `
                <a href="${itemLink}" class="bono-wrap">
                    <div class="bono-details">
                        <h2 class="bono-title">${item.name || ''}</h2>
                        <div>${item.validityText || ''}</div>
                        <div class="title-sans-l bono-price">${formatPrice(item.price)}</div>
                        <div class="text-xs text-style-3lines">${item.description || ''}</div>
                    </div>
                    <div class="nonlink-button">
                        <div class="button-text-wrap">
                            <div class="button-text">${ctaText}</div>
                            <div class="button-text">${ctaText}</div>
                        </div>
                    </div>
                </a>
            `;
            container.appendChild(itemDiv);
			attachHoverEffect(itemDiv.querySelector('.bono-wrap'));
        });

        const spacerDiv = document.createElement("div");
        spacerDiv.className = "list-spacer";
        container.appendChild(spacerDiv);

        triggerRecalculation();

    } catch (error) {
        container.innerHTML = "";
    } finally {
        isRendering = false;
    }
}

function initFilters() {
    const studioButtons = document.querySelectorAll("[data-studio-id]");
    const typeButtons = document.querySelectorAll("[data-type]");

    if (studioButtons.length > 0) {
        studioButtons.forEach(b => b.classList.remove("active"));
        studioButtons[0].classList.add("active");
        currentStudioId = studioButtons[0].getAttribute("data-studio-id");
        
        const textEl = studioButtons[0].querySelector(".button-text");
        currentStudioName = textEl ? textEl.textContent.trim() : "";
    }

    if (typeButtons.length > 0) {
        typeButtons.forEach(b => b.classList.remove("active"));
        const subBtn = Array.from(typeButtons).find(b => b.getAttribute("data-type") === "subscription");
        if (subBtn) {
            subBtn.classList.add("active");
            currentType = "subscription";
        }
    }

    studioButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            if (isRendering) return;
            studioButtons.forEach(b => b.classList.remove("active"));
            const target = e.currentTarget;
            target.classList.add("active");
            
            currentStudioId = target.getAttribute("data-studio-id");
            const textEl = target.querySelector(".button-text");
            currentStudioName = textEl ? textEl.textContent.trim() : "";
            
            renderMemberships();
        });
    });

    typeButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            if (isRendering) return;
            typeButtons.forEach(b => b.classList.remove("active"));
            const target = e.currentTarget;
            target.classList.add("active");
            currentType = target.getAttribute("data-type");
            
            renderMemberships();
        });
    });
}

initFilters();
renderMemberships();

document.addEventListener("DOMContentLoaded", () => {
    window.addEventListener('resize', handleDraggable);
});