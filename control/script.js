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

const rwidth = 500;
const rheight = 50;
const rx = (canvas.width / 2) - rwidth / 2;
const ry = dialY + 180;

let needleDeg = 90;
let ballX = centerX;
let ballV = 0;

let isArrowUp = false;
let isArrowDown = false;

let userDirection = 0; // -1 for left, 1 for right, 0 for no input
const userAcceleration = 0.1; // User acceleration factor

let targetAngle = 0;
let targetBall = ballX;

const maxSpeed = 2.8; // Maximum speed in radians per frame
const accelerationFactor = 0.009; // Controls how quickly the needle accelerates/decelerates
const tolerance = 0.01; // Tolerance range to consider the target as "reached"
const friction = 0.98;

const acceleration = 0.05; // Acceleration rate per frame
const deceleration = 0.06; // Deceleration rate per frame
let currentSpeed = 0;

const ballRadius = 13;
const rxStart = rx + lineWidth + ballRadius;
const rxEnd = rx + rwidth - lineWidth;

window.addEventListener("keydown", e => {
    if (e.code === "ArrowUp") {
        isArrowUp = true;
    }

    if (e.code === "ArrowDown") {
        isArrowDown = true;
    }

    if (e.code === "KeyS") {
        userDirection = 1;
    }

    if (e.code === "KeyA") {
        userDirection = -1;
    }
});

window.addEventListener("keyup", e => {
    if (e.code === "ArrowUp") {
        isArrowUp = false;
    }

    if (e.code === "ArrowDown") {
        isArrowDown = false;
    }

    if (e.code === "KeyS" || e.code === "KeyA") {
        userDirection = 0;
    }
});


animate();

function updateNeedle() {
    let angleDifference = targetAngle - needleDeg;

    // Stop if the current angle is within the tolerance range of the target angle
    if (Math.abs(angleDifference) < tolerance) {
        needleDeg = targetAngle; // Snap to target to avoid small oscillations
    }

    // Calculate the rotation speed based on distance, capped by maxSpeed
    const rotationSpeed = Math.min(maxSpeed, Math.abs(angleDifference) * accelerationFactor);

    // Update the current angle by moving it towards the target angle
    if (angleDifference > 0) {
        needleDeg += rotationSpeed;
    } else {
        needleDeg -= rotationSpeed;
    }

    if (!isArrowDown && !isArrowUp) {
        if (currentSpeed < 0) {
            currentSpeed = -1 * Math.max(Math.abs(currentSpeed) - deceleration, 0);
        } else {
            currentSpeed = Math.max(currentSpeed - deceleration, 0);
        }
    } else {
        currentSpeed = Math.min(Math.abs(currentSpeed) + acceleration, maxSpeed);    
    }

    if (isArrowDown) {
        currentSpeed *= -1;
    }

    needleDeg += currentSpeed;

    if (needleDeg > 180) {
        needleDeg = 180;
    }

    if (needleDeg < 0) {
        needleDeg = 0;
    }

    drawDial();
}

function updateBall() {
    const distance = targetBall - ballX;

    // Apply acceleration towards the target
    if (userDirection !== 0) {       
        ballV += userDirection * userAcceleration;
    } else {
        ballV += acceleration * Math.sign(distance);
    }

    // Apply friction to slow down as the ball nears the target
    ballV *= friction;

    // Cap the ballV at the maximum speed
    if (Math.abs(ballV) > maxSpeed) {
        ballV = Math.sign(ballV) * maxSpeed;
    }

    // Move the ball
    ballX += ballV;

    // Stop the ball when it's close enough to the target
    if (Math.abs(distance) < 0.5 && userDirection === 0) {
        ballX = targetBall;
        ballV = 0;
    }

    if (ballX + ballRadius > rxEnd) {
        ballX = rxEnd - ballRadius;
        ballV = 0;
    }

    if (ballX - ballRadius < rxStart) {
        ballX = rxStart + ballRadius;
        ballV = 0;
    }

    drawRect({
        width: rwidth, 
        height: rheight, 
        x: rx, 
        y: ry,
        bX: ballX
    });
}

function animate() {
    requestAnimationFrame(animate);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    updateNeedle();
    updateBall();
}

setInterval(() => {
    targetAngle = generateRandomNumber(0, 180);    
}, 3000);

setInterval(() => {
    targetBall = generateRandomNumber(rxStart, rxEnd);            
}, 4000);


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

function drawRect({width, height, x, y, bX}) {
    const lineWidth = 5;
    ctx.lineWidth = lineWidth;
    ctx.save();

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

    slipBall(bX, bY);
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

const generateRandomNumber = (min, max, step = 10) => {
    const range = max - min;
    
    const numIncrements = Math.floor(range / step);
    
    const randomIncrement = Math.floor(Math.random() * (numIncrements + 1));
    
    const randomNumber = min + (randomIncrement * step);
    
    return randomNumber;
};
