/* ===============================
   SENTINELR – CINEMATIC BEE SYSTEM
   FPS-safe | Realistic | Canvas
================================= */

const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
canvas.style.position = "fixed";
canvas.style.top = "0";
canvas.style.left = "0";
canvas.style.width = "100vw";
canvas.style.height = "100vh";
canvas.style.pointerEvents = "none";
canvas.style.zIndex = "2";

const ctx = canvas.getContext("2d");

let w, h;
function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

/* ===============================
   PERFORMANCE CONTROL
================================= */
const isMobile = window.innerWidth < 768;
const BEE_COUNT = isMobile ? 6 : 10;

/* ===============================
   HERO DEPTH ZONE
================================= */
const heroZone = {
    x: w * 0.5,
    y: h * 0.28,
    radius: Math.min(w, h) * 0.35
};

/* ===============================
   MOUSE TRACKING (QUEEN)
================================= */
const mouse = { x: w / 2, y: h / 2 };
window.addEventListener("mousemove", e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

/* ===============================
   INVISIBLE FLOWERS
================================= */
const flowers = Array.from({ length: 8 }, () => ({
    x: Math.random() * w,
    y: heroZone.y + Math.random() * heroZone.radius
}));

/* ===============================
   BEE CLASS
================================= */
class Bee {
    constructor(isQueen = false) {
        this.isQueen = isQueen;

        this.size = isQueen ? 34 : 22 + Math.random() * 6;
        this.x = Math.random() * w;
        this.y = Math.random() * h;

        this.vx = Math.random() * 0.6 - 0.3;
        this.vy = Math.random() * 0.6 - 0.3;

        this.flap = Math.random() * Math.PI * 2;
        this.flapSpeed = isQueen ? 0.25 : 0.55 + Math.random() * 0.35;

        this.vibration = Math.random() * 1000;

        this.flower = flowers[Math.floor(Math.random() * flowers.length)];

        this.landed = false;
        this.landTimer = 600 + Math.random() * 1200;
    }

    update(delta) {
        /* 👑 QUEEN FOLLOWS CURSOR */
        if (this.isQueen) {
            this.vx += (mouse.x - this.x) * 0.0006;
            this.vy += (mouse.y - this.y) * 0.0006;
        } else {
            /* 🌻 FLOWER ATTRACTION */
            this.vx += (this.flower.x - this.x) * 0.00025;
            this.vy += (this.flower.y - this.y) * 0.00025;
        }

        /* 👑 ESCORT BEHAVIOR */
        if (!this.isQueen) {
            const queen = bees[0];
            const dx = queen.x - this.x;
            const dy = queen.y - this.y;
            const dist = Math.hypot(dx, dy);
            if (dist < 200) {
                this.vx += dx * 0.0004;
                this.vy += dy * 0.0004;
            }
        }

        /* 🌻 LANDING LOGIC */
        this.landTimer -= delta;
        if (this.landTimer < 0) {
            this.landed = !this.landed;
            this.landTimer = this.landed ? 600 : 1200 + Math.random() * 1000;
        }

        if (!this.landed) {
            this.x += this.vx;
            this.y += this.vy;
        }

        this.vx *= 0.96;
        this.vy *= 0.96;

        this.flap += this.flapSpeed;
        this.vibration += 50;
    }

    draw() {
        const speed = Math.hypot(this.vx, this.vy);
        const tilt = Math.atan2(this.vy, this.vx);

        /* 🎯 DEPTH OF FIELD */
        const dx = this.x - heroZone.x;
        const dy = this.y - heroZone.y;
        const dist = Math.hypot(dx, dy);
        const focus = Math.max(0, 1 - dist / heroZone.radius);
        const blur = (1 - focus) * 2.4;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(tilt * 0.4);

        ctx.filter = `blur(${blur}px)`;
        ctx.globalAlpha = this.isQueen ? 0.95 : 0.55 + focus * 0.35;

        /* 🪽 REALISTIC WINGS */
        const microJitter = Math.sin(this.vibration) * 0.18;
        const flapAmount = this.landed ? 0 : Math.sin(this.flap) * 0.95;

        if (!this.landed) {
            ctx.fillStyle = "rgba(255,255,255,0.55)";
            ctx.filter += " blur(1.3px)";

            // Left wing
            ctx.save();
            ctx.rotate(-flapAmount + microJitter);
            ctx.beginPath();
            ctx.ellipse(
                -this.size * 0.5,
                -this.size * 0.7,
                this.size * 0.75,
                this.size * 0.35,
                0, 0, Math.PI * 2
            );
            ctx.fill();
            ctx.restore();

            // Right wing
            ctx.save();
            ctx.rotate(flapAmount - microJitter);
            ctx.beginPath();
            ctx.ellipse(
                this.size * 0.5,
                -this.size * 0.7,
                this.size * 0.75,
                this.size * 0.35,
                0, 0, Math.PI * 2
            );
            ctx.fill();
            ctx.restore();
        }

        ctx.filter = "none";

        /* 🐝 BODY */
        ctx.fillStyle = "#ffcc00";
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size, this.size * 0.7, 0, 0, Math.PI * 2);
        ctx.fill();

        /* STRIPES */
        ctx.fillStyle = "#000";
        ctx.fillRect(-this.size * 0.45, -this.size * 0.3, this.size * 0.2, this.size * 0.6);
        ctx.fillRect(this.size * 0.1, -this.size * 0.3, this.size * 0.2, this.size * 0.6);

        ctx.restore();
    }
}

/* ===============================
   CREATE BEES
================================= */
const bees = [];
bees.push(new Bee(true)); // 👑 QUEEN

for (let i = 1; i < BEE_COUNT; i++) {
    bees.push(new Bee());
}

/* ===============================
   ATMOSPHERE (SUN / DUST)
================================= */
function atmosphere() {
    const grad = ctx.createRadialGradient(
        heroZone.x, heroZone.y, 0,
        heroZone.x, heroZone.y, heroZone.radius
    );
    grad.addColorStop(0, "rgba(255,220,150,0.04)");
    grad.addColorStop(1, "rgba(255,255,255,0)");

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
}

/* ===============================
   ANIMATION LOOP (MOTION BLUR)
================================= */
let lastTime = performance.now();
function animate(now) {
    const delta = now - lastTime;
    lastTime = now;

    /* 💨 TRAILS */
    ctx.fillStyle = "rgba(255,255,255,0.06)";
    ctx.fillRect(0, 0, w, h);

    atmosphere();

    bees.forEach(b => {
        b.update(delta);
        b.draw();
    });

    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
