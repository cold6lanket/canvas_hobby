const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth-100;
canvas.height = window.innerHeight-100;

ctx.strokeStyle = "blue";

let axisLength = 400;
let offsetX = 0,  offsetY = 0;

drawAxis(axisLength, offsetX, offsetY);

const axisLengthHalf = axisLength / 2;

const circleX = axisLengthHalf + offsetX;
const circleY = axisLengthHalf + offsetY;
const radius = 150;

drawCircle(circleX, circleY, radius);

let deg = 0;
let animationFrameId;

let moveX, moveY;

function animate() {
    deg += 1;

    if (deg > 360) {
        ctx.clearRect(500, 0, canvas.width, canvas.height);
        deg = 0;
    }
   
    let thetaInDeg, x = 1;
   
    if (deg >= 0 && deg <= 90) {
        thetaInDeg = deg;
    }

    if (deg > 90 && deg <= 180) {
        thetaInDeg = (180 - deg) * (-1);
        x = -1;
    }

    if (deg > 180 && deg <= 270) {
        thetaInDeg = Math.abs(180 - deg );
        x = -1;
    }

    if (deg > 270 && deg <= 360) {
        thetaInDeg = (360 - deg )* (-1);
    }

    //thetaInDeg *= -1
    
    ctx.strokeStyle = "blue";
    
    ctx.clearRect(0, 0, 500, canvas.height);
    
    drawAxis(axisLength, offsetX, offsetY);
    
    drawCircle(circleX, circleY, radius);
    
    const rad = deg2rad(thetaInDeg);

    const {cX, cY} = drawTriangle(ctx, rad, x);
    
    drawXaxis(ctx, 500, axisLength / 2, 1000);

    let sineY = Math.sin(deg2rad(deg)) * radius;

    let sineX = deg + 500;

    if (moveX === undefined && moveY === undefined) {
        moveX = 500;
        moveY = axisLength / 2;
    }

    if (sineY < 0) {
        sineY = Math.abs(sineY) + axisLength / 2;
    } else {
        sineY = axisLength / 2 - sineY;
    }

    console.log(sineX, sineY);

    ctx.strokeStyle = "green";
    ctx.beginPath();
    ctx.moveTo(moveX, moveY);
    ctx.lineTo(sineX, sineY);
    ctx.stroke();

    // connecting line
    ctx.strokeStyle = "grey";
    ctx.beginPath();
    ctx.moveTo(cX, cY);
    ctx.lineTo(500, sineY);
    ctx.stroke();


    moveX = sineX;
    moveY = sineY;

    animationFrameId = requestAnimationFrame(animate);
}

animate();

setTimeout(() => {
    cancelAnimationFrame(animationFrameId);
}, 15000);

function drawXaxis(ctx, x, y, length) {
    ctx.strokeStyle = "blue";
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + length, y);
    ctx.stroke();
}

// function drawSineWave(ctx, deg, radius, x, y) {
//     const sineY = Math.sin(deg2rad(deg)) * radius;

// }


function drawTriangle(ctx, rad, x) {
    // adjacent
    let cX = findPoints(rad, radius, "x", x);
    // opposite
    let cY = findPoints(rad, radius, "y", x);

    ctx.strokeStyle = "green";
    ctx.beginPath();

    // opposite
    ctx.moveTo(circleX + cX, circleY);
    ctx.lineTo(circleX + cX, circleY - cY);
    ctx.stroke();

    // adjacent
    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.moveTo(circleX, circleY);
    ctx.lineTo(circleX + cX, circleY);
    ctx.stroke();

    cX = cX + 200;
    cY = -cY + 200;
    
    // radius
    ctx.strokeStyle = "orange";
    ctx.beginPath();
    ctx.moveTo(circleX, circleY);
    ctx.lineTo(cX, cY);
    ctx.stroke();

    return {cX, cY};

    // const end = 2 * Math.PI - deg2rad( toDeg(theta, x, y) );

    // ctx.strokeStyle = "purple";

    // drawCircle(circleX, circleY, 30, 0, 3.14, true);
}

// canvas.addEventListener("mousemove", e => {
//     ctx.strokeStyle = "blue";
//     let x = e.clientX;
//     let y = e.clientY;

//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     drawAxis(axisLength, offsetX, offsetY);

//     drawCircle(circleX, circleY, radius);

//     x = mouseToPoint("x", 200, x);
//     y = mouseToPoint("y", 200, y);
 
//     const theta = getTheta(x, y);

//     drawTriangle(ctx, theta, x);

//     const end = 2 * Math.PI - deg2rad( toDeg(theta, x, y) );

//     ctx.strokeStyle = "purple";

//     drawCircle(circleX, circleY, 30, 0,end, true);
// });

function drawAxis(axisLength, offsetX = 0, offsetY = 0) {
    const start = axisLength / 2;
    const xShift = start + offsetX;
    const yShift = start + offsetY;

    ctx.beginPath();
    // y axis
    ctx.moveTo(xShift, offsetY);
    ctx.lineTo(xShift, axisLength + offsetY);
    ctx.stroke();
    // x axis
    ctx.moveTo(offsetX, yShift);
    ctx.lineTo(axisLength + offsetX, yShift);
    ctx.stroke();
}

function drawCircle(x, y, radius, startAngle = 0, endAngle, counterclockwise) {
    // Set line width
    endAngle ||= 2 * Math.PI;
    counterclockwise ||= false;
  
    // Stroke out circle
    ctx.beginPath();
    ctx.arc(x, y, radius, startAngle, endAngle, counterclockwise);
    ctx.stroke();
}

function calcAngleDegrees(x, y) {
    return (Math.atan2(y, x) * 180) / Math.PI;
  }

function rad2deg(radians) {
    return radians * (180 / Math.PI);
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

function mouseToPoint(axis, radius, point){
    let converted;
    //radius = max height and width of graph
    if(axis == "x"){
        converted = point - radius;
    }
    if(axis == "y"){
        converted = radius - point;
    }
    return converted;
}

function getTheta(x, y){
    return Math.atan(y / x);
}

function toDeg(theta, x, y) {
    theta = rad2deg(theta);
    if (y < 0) {
        if (x < 0) {
            theta += 180;
        } else {
            theta += 360;
        }
    } else {
        if (x < 0) {
            theta += 180;
        }
    }
    return theta;
}

function findPoints(theta, radius, axis, x) {
    let p;
    if (axis == "x") {
        p = radius * Math.cos(theta);
        //H*cosƟ = A
    }
    if (axis == "y") {
        p = radius * Math.sin(theta);
        //H*sinƟ = O;
    }
    if (x < 0) {
        p = p * -1;
    }
    return p;
}