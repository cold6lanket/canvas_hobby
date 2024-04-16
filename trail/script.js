const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Block {
    constructor(ctx, x, y) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.initX = x;
        this.initY = y;
    }

    get top() {
        return this.y;
    }

    set top(y) {
        this.y = y;
    }

    get left() {
        return this.x;
    }

    set left(x) {
        this.x = x;
    }

    box(x, y, color) {
        this.ctx.fillStyle = color || "#3370d4";
        this.ctx.beginPath();
        this.ctx.rect(x, y, 20, 20);
        this.ctx.stroke();
        this.ctx.fill();
    }

    draw() {
        this.box(this.x, this.y);
        this.box(this.x + 150, this.y, "red");
    }

    reset() {
        this.x = this.initX;
        this.y = this.initY;
    }
}

const blocks = [];

let setDirection = 0;
let pathCounter = 0;
let rStep = Math.floor(Math.random() * 60) - 30;
let startBlockL = 500;
let plength = 0;
const changeStep1 = 10;
const blockLval = [];
const leftLimit = 1080 / 8;
const rightLimit = 1080 - leftLimit - 190;
const pathStep = 80 * (1080/1100);
const pathLength = 5;

for (let i = 0; i < 100_000; i++) {
    pathCounter++;
    if (pathCounter > plength) {
        setStep();
    }
    if (setDirection == 0) {
        rStep += ((pathCounter * 2) - rStep) / changeStep1;
    } else {
        rStep -= ((pathCounter * 2) - rStep) / changeStep1;
    }
    startBlockL += rStep;
    blockLval.push(startBlockL);
}
function setStep() {
    if (startBlockL < leftLimit) {
        rStep = Math.floor(Math.random() * pathStep);
    } else if (startBlockL > rightLimit) {
        rStep = Math.floor(Math.random() * pathStep) - pathStep;
    } else {
        rStep = Math.floor(Math.random() * pathStep) - (pathStep / 2);
    }
    setDirection = Math.round(Math.random());
    plength = Math.floor(Math.random() * pathLength);
    pathCounter = 0;
}

for (let i = 0; i < 12; i++) {
    blocks.push(new Block(ctx, blockLval[i], -((i * 2) * 20) - 20));
}

const wHeight = window.innerHeight;

let bcMainCount = 0;
const blockSpeed = 1;
let blockBack = 10;

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const planeTop = 300;
    const planeBottom = 350;
    const planeLeft = 400;
    const planeRight = 450;

    // TODO. render plane image
    ctx.beginPath();
    ctx.rect(planeLeft, planeTop, 50, 50);
    ctx.stroke();

    blocks.forEach((b, i) => {
        // 20 = height of block
        if (bcMainCount > (20 * i)) {
            b.top = b.top + blockSpeed;

            const blockLeft = b.left;
            const blockRight = blockLeft + 150;

            if ((b.top + 20) > planeTop && b.top < planeBottom) {
                if (blockLeft < planeLeft && blockRight > planeRight) {
                    // correct
                    console.log("correct");
                } else {
                    // mistake
                    console.log("mistake");
                }
            }

            if (b.top > wHeight) {
                b.top = -20;
                blockBack++;
                b.left = blockLval[blockBack];
            }

            b.draw();

        }
    });

    bcMainCount += blockSpeed;

    requestAnimationFrame(animate);
}

animate();