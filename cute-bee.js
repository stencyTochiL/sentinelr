/* ===============================
   SINGLE CUTE BEE – CARTOON STYLE
   Inspired by reference image
================================= */

const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

canvas.style.position = "fixed";
canvas.style.top = 0;
canvas.style.left = 0;
canvas.style.width = "100vw";
canvas.style.height = "100vh";
canvas.style.pointerEvents = "none";
canvas.style.zIndex = 3;

const ctx = canvas.getContext("2d");

let w, h;
function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

/* ===============================
   MOUSE TRACKING
================================= */
const mouse = { x: w / 2, y: h / 2 };
window.addEventListener("mousemove", e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

/* ===============================
   BEE OBJECT
================================= */
const bee = {
    x: w / 2,
    y: h / 3,
    vx: 0,
    vy: 0,
    size: 46,
    flap: 0,
    hover: 0
};

/* ===============================
   UPDATE
================================= */
function update() {
    /* Smooth follow */
    bee.vx += (mouse.x - bee.x) * 0.0025;
    bee.vy += (mouse.y - bee.y) * 0.0025;

    bee.vx *= 0.88;
    bee.vy *= 0.88;

    bee.x += bee.vx;
    bee.y += bee.vy;

    bee.flap += 0.6;      // wing speed
    bee.hover += 0.04;   // gentle float
}

/* ===============================
   DRAW BEE (CARTOON STYLE)
================================= */
function drawBee() {
    const tilt = Math.atan2(bee.vy, bee.vx) * 0.25;
    const wingFlap = Math.sin(bee.flap) * 1.2;
    const floatY = Math.sin(bee.hover) * 4;

    ctx.save();
    ctx.translate(bee.x, bee.y + floatY);
    ctx.rotate(tilt);

    /* 🪽 WINGS */
    ctx.fillStyle = "rgba(180,220,255,0.85)";
    ctx.filter = "blur(0.6px)";

    // Left wing
    ctx.save();
    ctx.rotate(-wingFlap);
    ctx.beginPath();
    ctx.ellipse(-18, -38, 18, 28, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Right wing
    ctx.save();
    ctx.rotate(wingFlap);
    ctx.beginPath();
    ctx.ellipse(18, -38, 18, 28, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.filter = "none";

    /* 🐝 BODY */
    ctx.fillStyle = "#FFD400";
    ctx.beginPath();
    ctx.ellipse(20, 8, 32, 22, 0, 0, Math.PI * 2);
    ctx.fill();

    /* STRIPES */
    ctx.fillStyle = "#222";
    ctx.beginPath();
    ctx.ellipse(18, 6, 6, 22, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(34, 6, 6, 22, 0, 0, Math.PI * 2);
    ctx.fill();

    /* 🐝 HEAD */
    ctx.fillStyle = "#FFD400";
    ctx.beginPath();
    ctx.arc(-18, 0, 22, 0, Math.PI * 2);
    ctx.fill();

    /* EYES (cute wink) */
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(-24, -4, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(-12, -4, 2, 0, Math.PI);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.stroke();

    /* CHEEKS */
    ctx.fillStyle = "#FF7A7A";
    ctx.beginPath();
    ctx.arc(-26, 6, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(-10, 6, 3, 0, Math.PI * 2);
    ctx.fill();

    /* ANTENNA */
    ctx.strokeStyle = "#222";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-28, -18);
    ctx.lineTo(-34, -28);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-12, -18);
    ctx.lineTo(-6, -28);
    ctx.stroke();

    ctx.fillStyle = "#222";
    ctx.beginPath();
    ctx.arc(-34, -28, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(-6, -28, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}

/* ===============================
   LOOP
================================= */
function animate() {
    ctx.clearRect(0, 0, w, h);
    update();
    drawBee();
    requestAnimationFrame(animate);
}

animate();
