const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

w = canvas.width;
h = canvas.height;

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    w = canvas.width;
    h = canvas.height;
    lines = [];
    createLine();
}

resize();
document.addEventListener("resize", resize);
prevFrameTime = 0;
incrX = 2000;
incrY = 2000;
pathPoints = [];
hitIdx = 0;
var clack = new Audio("src/clack.wav");

function createLine() {
    line = { sX: w / 2, sY: h / 2, eX: 0, eY: h };
}

function drawLine(startX, startY, endX, endY) {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
}

function hit() {
    clack.play();
    hitIdx++;
    var prevX,
        prevY = 0;
    if (pathPoints.length > 0) {
        prevX = pathPoints[pathPoints.length - 1].eX;
        prevY = pathPoints[pathPoints.length - 1].eY;
    }
    pathPoints.push({ sX: prevX, sY: prevY, eX: line.eX, eY: line.eY });
}

function renderLoop(time) {
    dt = (time - prevFrameTime) / 1000;
    ctx.clearRect(0, 0, w, h);

    // drawing
    if (line.eX < 0 || line.eX > w) {
        incrX *= -1;
        hit();
    }
    if (line.eY < 0 || line.eY > h) {
        incrY *= -1;
        hit();
    }

    line.eX += incrX * dt;
    line.eY -= incrY * dt;

    ctx.lineWidth = 8;
    for (var i = 0; i < pathPoints.length; i++) {
        const point = pathPoints[i];
        ctx.strokeStyle = "hsl(" + (360 * i) / pathPoints.length + ",80%,50%)";
        drawLine(point.sX, point.sY, point.eX, point.eY);
    }

    ctx.strokeStyle = "black";
    ctx.lineWidth = 16;
    drawLine(line.sX, line.sY, line.eX, line.eY);

    window.requestAnimationFrame(renderLoop);
    prevFrameTime = time;
}

createLine();
window.requestAnimationFrame(renderLoop);
