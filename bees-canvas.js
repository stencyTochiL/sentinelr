/* =================================
   🐝 CINEMATIC CANVAS BEE SYSTEM
================================= */

const canvas = document.getElementById("beeCanvas");
const ctx = canvas.getContext("2d");

let w, h;
function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

/* -------------------------
   🌐 SEASONAL THEMES
-------------------------- */
const SEASON = "auto"; // auto | day | rain | sunset | harmattan

function getTheme() {
    if (SEASON !== "auto") return SEASON;
    const hour = new Date().getHours();
    if (hour < 7) return "harmattan";
    if (hour < 12) return "day";
    if (hour < 18) return "sunset";
    return "rain";
}

const theme = getTheme();

/* -------------------------
   🎯 Mouse interaction
-------------------------- */
const mouse = { x: w / 2, y: h / 2 };
window.addEventListener("mousemove", e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

/* -------------------------
   🌻 Invisible flowers
-------------------------- */
const flowers = Array.from({ length: 4 }, () => ({
    x: Math.random() * w * 0.8 + w * 0.1,
    y: Math.random() * h * 0.4 + h * 0.2
}));

/* -------------------------
   🐝 Bee Class
-------------------------- */
class Bee {
    constructor(isQueen = false) {
        this.isQueen = isQueen;
        this.size = isQueen ? 26 : 18 + Math.random() * 6;
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.vx = Math.random() * 0.6 - 0.3;
        this.vy = Math.random() * 0.6 - 0.3;
        this.flower = flowers[Math.floor(Math.random() * flowers.length)];
    }

    update() {
        // Hover around flower
        this.vx += (this.flower.x - this.x) * 0.0003;
        this.vy += (this.flower.y - this.y) * 0.0003;

        // Mouse reaction
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
            this.vx += dx * 0.002;
            this.vy += dy * 0.002;
        }

        this.x += this.vx;
        this.y += this.vy;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);

        // Blur depth
        ctx.globalAlpha = this.isQueen ? 0.9 : 0.65;

        // Body
        ctx.fillStyle = "#ffcc00";
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size, this.size * 0.7, 0, 0, Math.PI * 2);
        ctx.fill();

        // Stripes
        ctx.fillStyle = "#000";
        ctx.fillRect(-this.size * 0.4, -this.size * 0.3, this.size * 0.15, this.size * 0.6);
        ctx.fillRect(this.size * 0.1, -this.size * 0.3, this.size * 0.15, this.size * 0.6);

        // Wings
        ctx.fillStyle = "rgba(255,255,255,0.7)";
        ctx.beginPath();
        ctx.ellipse(-this.size * 0.5, -this.size * 0.6, this.size * 0.5, this.size * 0.3, 0, 0, Math.PI * 2);
        ctx.ellipse(this.size * 0.5, -this.size * 0.6, this.size * 0.5, this.size * 0.3, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}

/* -------------------------
   🐝 Bee Population
-------------------------- */
const isMobile = window.innerWidth < 768;
const bees = [];

const BEE_COUNT = isMobile ? 5 : 8;
for (let i = 0; i < BEE_COUNT; i++) bees.push(new Bee());

// 👑 Queen bee near logo
const queen = new Bee(true);
queen.x = w * 0.15;
queen.y = 80;
bees.push(queen);

/* -------------------------
   🌐 Atmospheric Effects
-------------------------- */
function atmosphere() {
    if (theme === "harmattan") {
        ctx.fillStyle = "rgba(240,230,200,0.03)";
        ctx.fillRect(0, 0, w, h);
    }
    if (theme === "sunset") {
        ctx.fillStyle = "rgba(255,140,80,0.02)";
        ctx.fillRect(0, 0, w, h);
    }
    if (theme === "rain") {
        ctx.strokeStyle = "rgba(200,200,255,0.08)";
        for (let i = 0; i < 40; i++) {
            const x = Math.random() * w;
            const y = Math.random() * h;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + 3, y + 12);
            ctx.stroke();
        }
    }
}

/* -------------------------
   ⚡ Animation Loop
-------------------------- */
function animate() {
    ctx.clearRect(0, 0, w, h);
    atmosphere();
    bees.forEach(b => {
        b.update();
        b.draw();
    });
    requestAnimationFrame(animate);
}

animate();
