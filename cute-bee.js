/* ===============================
   CUTE CARTOON BEE (BLURRY STYLE)
================================ */

const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

Object.assign(canvas.style, {
    position: "fixed",
    inset: 0,
    width: "100vw",
    height: "100vh",
    pointerEvents: "none",
    zIndex: 5
});

const ctx = canvas.getContext("2d");

function resize() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
}
addEventListener("resize", resize);
resize();

/* ===============================
   MOUSE FOLLOW
================================ */
const mouse = { x: innerWidth / 2, y: innerHeight / 2 };
addEventListener("mousemove", e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

/* ===============================
   SINGLE BEE STATE
================================ */
const bee = {
    x: innerWidth / 2,
    y: innerHeight / 3,
    vx: 0,
    vy: 0,
    size: 60,
    flap: 0,
    bob: 0
};

/* ===============================
   UPDATE
================================ */
function update() {
    bee.vx += (mouse.x - bee.x) * 0.002;
    bee.vy += (mouse.y - bee.y) * 0.002;

    bee.vx *= 0.85;
    bee.vy *= 0.85;

    bee.x += bee.vx;
    bee.y += bee.vy;

    bee.flap += 0.7;
    bee.bob += 0.05;
}

/* ===============================
   DRAW CARTOON BEE (BLURRY)
================================ */
function drawBee() {
    const floatY = Math.sin(bee.bob) * 6;
    const wing = Math.sin(bee.flap) * 0.9;

    ctx.save();
    ctx.translate(bee.x, bee.y + floatY);

    // Make the bee slightly blurry and blended into the background
    ctx.filter = "blur(3px)";
    ctx.globalAlpha = 0.85; // softens the appearance

    /* 🪽 WINGS */
    ctx.fillStyle = "#9dd9ff";
    ctx.strokeStyle = "#222";
    ctx.lineWidth = 3;

    ctx.save();
    ctx.rotate(-0.6 + wing);
    ctx.beginPath();
    ctx.ellipse(-20, -50, 20, 30, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.rotate(0.6 - wing);
    ctx.beginPath();
    ctx.ellipse(20, -50, 20, 30, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    /* 🐝 BODY */
    ctx.fillStyle = "#FFD400";
    ctx.beginPath();
    ctx.ellipse(30, 10, 28, 20, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    /* STRIPES */
    ctx.fillStyle = "#222";
    ctx.beginPath();
    ctx.ellipse(26, 10, 6, 18, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(38, 10, 6, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    /* 🟡 HEAD */
    ctx.fillStyle = "#FFD400";
    ctx.beginPath();
    ctx.arc(-10, 0, 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    /* 😊 FACE */
    ctx.fillStyle = "#222";
    ctx.beginPath();
    ctx.arc(-18, -4, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(-2, -4, 4, 0, Math.PI);
    ctx.stroke();

    /* BLUSH */
    ctx.fillStyle = "#FF8A8A";
    ctx.beginPath();
    ctx.arc(-22, 8, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(-2, 8, 4, 0, Math.PI * 2);
    ctx.fill();

    /* ANTENNA */
    ctx.strokeStyle = "#222";
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.moveTo(-22, -26);
    ctx.lineTo(-30, -38);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, -26);
    ctx.lineTo(8, -38);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(-30, -38, 4, 0, Math.PI * 2);
    ctx.arc(8, -38, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // Reset filters for future drawings
    ctx.filter = "none";
    ctx.globalAlpha = 1;
}

/* ===============================
   LOOP
================================ */
function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    update();
    drawBee();
    requestAnimationFrame(loop);
}

loop();
