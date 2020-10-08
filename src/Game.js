import World from "./World";

const DEFAULT_WIDTH = 900;
const DEFAULT_HEIGHT = 500;
const DEFAULT_SCALE = 10;

export default class Game {
    constructor(width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT, scale = DEFAULT_SCALE) {
        this.width = width;
        this.height = height;
        this.scale = scale;
        this.paused = false;
        this.world = new World(Math.ceil(width / scale), Math.ceil(height / scale));
    }

    get stats() {
        return {
            Bodies: this.world.map.flat().filter(x => x !== null).length,
            Size: `${this.world.width}x${this.world.height}`,
            Scale: this.scale,
            FPS: Math.round(frameRate())
        };
    }

    update() {
        if (!this.paused) {
            this.world.update();
        }
    }

    draw() {
        this.world.draw();
    }
}
