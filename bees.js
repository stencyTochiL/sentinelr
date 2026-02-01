/* =========================
   🐝 REALISTIC BEE SYSTEM
========================= */

const beeContainer = document.getElementById("beeBackground");

// Detect mobile for optimization
const isMobile = window.innerWidth < 768;

// Bee count (optimized)
const BEE_COUNT = isMobile ? 18 : 45;

// Hero section focus zone
const hero = document.getElementById("home");
const heroRect = hero.getBoundingClientRect();

for (let i = 0; i < BEE_COUNT; i++) {
    const bee = document.createElement("div");
    bee.className = "bee";

    // Bigger, varied sizes
    const size = Math.random() * 8 + 18;
    bee.style.width = size + "px";
    bee.style.height = size * 0.8 + "px";

    // 🌼 Bees hover more near hero section
    const nearHero = Math.random() < 0.6;

    if (nearHero) {
        bee.style.left = Math.random() * 60 + 20 + "vw";
        bee.style.top = Math.random() * (heroRect.height / 2) + "px";
    } else {
        bee.style.left = Math.random() * 100 + "vw";
        bee.style.top = Math.random() * 100 + "vh";
    }

    // Smooth varied motion
    bee.style.animationDuration =
        (Math.random() * 18 + (isMobile ? 25 : 15)) + "s";

    bee.style.animationDelay = Math.random() * 10 + "s";

    beeContainer.appendChild(bee);
}

}
