/* =========================
   🐝 BEE ANIMATION SCRIPT
========================= */

const beeContainer = document.getElementById("beeBackground");
const BEE_COUNT = 40;

for (let i = 0; i < BEE_COUNT; i++) {
    const bee = document.createElement("div");
    bee.className = "bee";

    const size = Math.random() * 6 + 8;
    bee.style.width = size + "px";
    bee.style.height = size + "px";

    bee.style.left = Math.random() * 100 + "vw";
    bee.style.top = Math.random() * 100 + "vh";

    bee.style.animationDuration = (Math.random() * 20 + 15) + "s";
    bee.style.animationDelay = (Math.random() * 10) + "s";

    beeContainer.appendChild(bee);
}
