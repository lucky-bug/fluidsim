const WIDTH = 900;
const HEIGHT = 500;
const SCALE = 5;

let game = new FluidSim.Game(WIDTH, HEIGHT, SCALE);
let canvas = null;

function setup() {
    canvas = createCanvas(WIDTH, HEIGHT).canvas;
    canvas.addEventListener("contextmenu", (e) => e.preventDefault());
    // frameRate(1);
}

function draw() {
    updateStats();
    scale(SCALE);
    noStroke();
    background("#333");
    game.update();
    game.draw();
}

function updateStats() {
    let statusBar = document.querySelector('stats');
    let stats = {
        Adaptation: `${game.adaptation ? "ON" : "OFF"}`,
        Bodies: `${game.bodies.length}`,
        Cursor: `${game.cursor.x},${game.cursor.y} (${game.cursor.size})`,
        Scale: SCALE,
        FPS: Math.round(frameRate())
    };
    let statsHtml = "";

    for (const stat in stats) {
        statsHtml += ` <span><b>${stat}</b>: ${stats[stat]}</span>`;
    }

    statusBar.innerHTML = `<span><b>${game.paused ? "Paused": ""}</b></span><span>${statsHtml}</span>`;
}

function mouseMoved() {
    game.updateCursor(mouseX, mouseY, false, mouseButton);
}

function mouseDragged() {
    game.updateCursor(mouseX, mouseY, true, mouseButton);
}

function mousePressed() {
    game.updateCursor(mouseX, mouseY, true, mouseButton);
}

function mouseReleased() {
    game.updateCursor(mouseX, mouseY, false, mouseButton);
}

function mouseWheel(event) {
    if (event.delta > 0) {
        game.cursor.size++;
    } else {
        game.cursor.size--;
        if (game.cursor.size == 0) {
            game.cursor.size = 1;
        }
    }
}

function keyPressed() {
    if (keyCode == 32) {
        game.paused ^= true;
    } else if (keyCode == 65) {
        game.adaptation ^= true;
    }
}
