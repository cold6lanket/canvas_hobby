const canvas = document.getElementById("control");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const lineColor = "rgb(97,99,100)";
const lineWidth = 5;
const backgroundColor = "rgb(210,210,210)";

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

const dialX = canvas.width / 2;
const dialY = canvas.height / 3;

let needleDeg = 90;

let isArrowUp = false;
let isArrowDown = false;

window.addEventListener("keydown", e => {
    if (e.key === "ArrowUp") {
        isArrowUp = true;
    }

    if (e.key === "ArrowDown") {
        isArrowDown = true;
    }
});

window.addEventListener("keyup", e => {
    if (e.key === "ArrowUp") {
        isArrowUp = false;
    }

    if (e.key === "ArrowDown") {
        isArrowDown = false;
    }
});


animate();

function animate() {
    requestAnimationFrame(animate);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (isArrowUp) {
        needleDeg += 0.1 + Math.random();
    }

    if (isArrowDown) {
        needleDeg -= 0.8 + Math.random();
    }

    drawDial();

    drawRect();
}


function drawDial() {
    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = lineColor;

    const x = dialX;
    const y = dialY;

    const dialRadius = 130;

    ctx.arc(x, y, dialRadius, 0, 2 * Math.PI);
    ctx.stroke();

    // background
    ctx.save();

    ctx.fillStyle = backgroundColor;
    ctx.beginPath();

    const startAngle = 20;
    const shift = deg2rad(startAngle);

    ctx.arc(x, y, dialRadius - lineWidth / 2, shift, Math.PI - shift);
    ctx.fill();

    const rad = deg2rad( (180 - (startAngle * 2)) / 2 );

    const chordLength = 2 * dialRadius * Math.sin( rad );
    const yShift = dialRadius * Math.cos( rad );

    const curveStartX = x - (chordLength / 2);
    const curveStartY =  y + yShift;

    ctx.beginPath();
    ctx.moveTo(curveStartX + 2, curveStartY);
    ctx.quadraticCurveTo(x, y - 20, x + dialRadius - 10, curveStartY);
    ctx.fill();
    
    ctx.restore();

    // lines
  
	ctx.lineWidth = 2;

    for (let l = 16; l > 0; l--) {
        ctx.save();
        ctx.beginPath();
        ctx.translate(x, y);
        const angle = (l * 22.5) * Math.PI / 180;
        ctx.rotate(angle);
        ctx.translate(0, -dialRadius + 15);

        if (l === 12) {
            redBall({
                x: 0, 
                y: 5, 
                x0: 4, 
                r0: 5, 
                y0: 5, 
                x1: 0, 
                y1: 5, 
                r1: 15
            });
            ctx.restore();
            continue;
        }

        const lineHeight = 25;

        ctx.moveTo(0, 0);
        ctx.lineTo(0, lineHeight);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    }   

    // needle
    ctx.save();
    
    ctx.beginPath();
    ctx.translate(x, y);
    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";
    ctx.strokeStyle = "rgb(52,51,146)";
    ctx.rotate(needleDeg * Math.PI / 180);
    ctx.moveTo(0, 0);
    ctx.lineTo(0, dialRadius - 15);
    ctx.stroke();
    ctx.closePath();

    ctx.restore();
}

function redBall({x, y, x0, r0, y0, x1, y1, r1}) {
    const gradient = ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);

    // Define color stops for a 3D effect
    gradient.addColorStop(0, "rgb(255, 180, 175)");  // Light color at the center
    gradient.addColorStop(0.5, "rgb(216, 67, 61)");   // Original red color
    gradient.addColorStop(1, "rgb(200, 60, 55)");     // Darker shade on the edge

    // Apply the gradient as fill style
    ctx.fillStyle = gradient;
    ctx.arc(x, y, 15, 0, 2 * Math.PI);
    ctx.fill();
}

function drawRect() {
    ctx.lineWidth = lineWidth;
    ctx.save();
    const width = 500;
    const height = 50;
    const x = (canvas.width / 2) - width / 2;
    const y = dialY + 180;

    // background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(x, y + (height / 2), width, height / 2);

    ctx.restore();

    ctx.strokeRect(x, y, width, height);

    // lines
    const lineCount = 15;
    const lineHeight = height - 20;
    const step = (width - (lineWidth * 2) - 20) / lineCount;
    const lineStartY = y + 10;
    let lineStartX = x + lineWidth + 10;

    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgb(126,125,126)";
    ctx.beginPath();

    for (let i = 0; i < lineCount; i++) {
        if (i === 7) {
            const start = y + height - lineWidth / 2;
            ctx.moveTo(lineStartX, start);
            ctx.lineTo(lineStartX, start - height + lineWidth);
        } else {
            ctx.moveTo(lineStartX, lineStartY);
            ctx.lineTo(lineStartX, lineStartY + lineHeight);
        }

        lineStartX += step + 2;
    }

    ctx.closePath();
    ctx.stroke();

    const bY = y + (height / 2);

    redBall({
        x: centerX, y: bY, 
        x0: centerX, 
        y0: bY - 4, 
        x1: centerX, 
        y1: bY,
        r0: 5,
        r1: 15 
    });

    slipBall(centerX - 50, bY);
}

function slipBall(x, y) {
    ctx.beginPath();
    ctx.fillStyle = "rgb(0,0,255)";
    ctx.arc(x, y, 13, 0, 2 * Math.PI);
    ctx.fill();
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}