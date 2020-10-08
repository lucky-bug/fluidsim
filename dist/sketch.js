let game = new FluidSim.Game();
let canvas = null;
let brushSize = 1;

function setup() {
    canvas = createCanvas(game.width, game.height).canvas;
    canvas.addEventListener("contextmenu", (e) => e.preventDefault());
    noStroke();
}

function draw() {
    scale(game.scale);
    background("#333");
    game.update();
    game.draw();

    let statusBar = document.querySelector('stats');
    let stats = game.stats;
    let statsText = "";

    for (const stat in stats) {
        statsText += ` <span><b>${stat}</b>: ${stats[stat]}</span>`;
    }

    statusBar.innerHTML = `<b>${game.paused ? "Paused": ""}</b><span>${statsText}</span>`;
}

function keyPressed() {
    if (keyCode === 32) {
        game.paused ^= true;
    } else if (keyCode === 8) {
        game.world.map = game.world.createMap();
    }
}

function addBody() {
    {
        let cur = createVector(Math.floor(mouseX / game.scale), Math.floor(mouseY / game.scale));

        for (let y = cur.y - brushSize; y <= cur.y + brushSize; y++) {
            for (let x = cur.x - brushSize; x <= cur.x + brushSize; x++) {
                let pos = createVector(x, y);
                let body = game.world.createBody(pos, mouseButton);

                if (Math.random() < 0) {
                    body.size.x = Math.max(1, Math.ceil(Math.random() * 4));
                    body.size.y = Math.max(1, Math.ceil(Math.random() * 4));
                }

                if (game.world.isEmpty(body.pos, body.size)) {
                    game.world.add(body);
                } else if (game.world.isEmpty(body.pos, createVector(1, 1))) {
                    body.size = createVector(1, 1);
                    game.world.add(body);
                }
            }
        }
    }
}

function mouseClicked() {
    addBody();
}

function mouseDragged() {
    addBody();
}
