const TYPE_WATER = "water";
const TYPE_STONE = "stone";

export default class Game {
    constructor(width, height, scale) {
        this.width = Math.ceil(width / scale);
        this.height = Math.ceil(height / scale);
        this.scale = scale;
        this.paused = false;
        this.map = this.createMap();
        this.cursor = this.createCursor();
        this.adaptation = true;
    }

    get bodies() {
        return this.map.flat();
    }

    get bodiesToDraw() {
        if (this.adaptation) {
            let bodies = [];

            this.bodies.forEach(body => body.adapted = false);

            this.bodies.forEach(body => {
                if (!this.isEmpty(body.x, body.y) && !body.adapted) {
                    bodies.push(this.createAdaptedBody(body.x, body.y, body.type));
                    body.adapted = true;
                }
            })

            // for (let y = 0; y < this.map.length; y++) {
            //     for (let x = 0; x < this.map[y].length; x++) {
            //         if (!this.isEmpty(x, y) && !this.map[y][x].adapted) {
            //             bodies.push(this.createAdaptedBody(x, y, this.map[y][x].type));
            //             this.map[y][x].adapted = true;
            //         }
            //     }
            // }

            return bodies;
        }

        return this.bodies;
    }

    createMap() {
        let map = [];

        for (let y = 0; y < this.height; y++) {
            map[y] = [];
        }

        return map;
    }

    createCursor() {
        return {
            x: 1,
            y: 1,
            size: 3,
            isPressed: false,
            button: null
        };
    }

    createBody(x, y, type) {
        return {
            x,
            y,
            w: 1,
            h: 1,
            dir: 1,
            type,
            adapted: false
        };
    }

    createAdaptedBody(x, y, type) {
        let body = this.createBody(x, y, type);
        let sideAdaptable = true, bottomAdaptable = true;

        while (sideAdaptable || bottomAdaptable) {
            sideAdaptable = true;
            for (let i = 0; i < body.h; i++) {
                if (!this.isAdaptable(x + body.w, y + i, type)) {
                    sideAdaptable = false;
                    break;
                }
            }

            if (sideAdaptable) {
                for (let i = 0; i < body.h; i++) {
                    this.map[y + i][x + body.w].adapted = true;
                }

                body.w++;
            }

            bottomAdaptable = true;
            for (let i = 0; i < body.w; i++) {
                if (!this.isAdaptable(x + i, y + body.h, type)) {
                    bottomAdaptable = false;
                    break;
                }
            }

            if (bottomAdaptable) {
                for (let i = 0; i < body.w; i++) {
                    this.map[y + body.h][x + i].adapted = true;
                }

                body.h++;
            }
        }

        return body;
    }

    isInside(x, y) {
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
    }

    isEmpty(x, y) {
        return !this.map[y][x];
    }

    isAdaptable(x, y, type) {
        return (
            this.isInside(x, y) &&
            !this.isEmpty(x, y) &&
            !this.map[y][x].adapted &&
            this.map[y][x].type == type
        );
    }

    isAvailable(x, y) {
        return this.isInside(x, y) && this.isEmpty(x, y);
    }

    move(fromX, fromY, toX, toY) {
        if (this.isAvailable(toX, toY)) {
            let body = this.map[fromY][fromX];
            delete this.map[fromY][fromX];
            body.x = toX;
            body.y = toY;
            this.map[toY][toX] = body;

            return true;
        }

        return false;
    }

    update() {
        if (this.cursor.isPressed) {
            for (let i = 0; i < this.cursor.size; i++) {
                for (let j = 0; j < this.cursor.size; j++) {
                    if (this.isInside(this.cursor.x + j, this.cursor.y + i)) {
                        if (this.cursor.button != "center") {
                            let body = this.createBody(
                                this.cursor.x + j,
                                this.cursor.y + i,
                                this.cursor.button == "left" ? TYPE_WATER : TYPE_STONE
                            );

                            if (this.isEmpty(body.x, body.y)) {
                                this.map[body.y][body.x] = body;
                            }
                        } else {
                            delete this.map[this.cursor.y + i][this.cursor.x + j];
                        }
                    }
                }
            }
        }

        if (!this.paused) {
            let bodies = this.bodies;

            bodies.forEach(body => {
                if (body.type == TYPE_WATER) {
                    let moved = (
                        this.move(body.x, body.y, body.x, body.y + 1) ||
                        this.move(body.x, body.y, body.x + body.dir, body.y + 1) ||
                        this.move(body.x, body.y, body.x - body.dir, body.y + 1) ||
                        this.move(body.x, body.y, body.x + body.dir, body.y) ||
                        this.move(body.x, body.y, body.x - body.dir, body.y)
                    );
                }
            });
        }
    }

    updateCursor(x, y, isPressed, button) {
        this.cursor.x = Math.floor(x / this.scale);
        this.cursor.y = Math.floor(y / this.scale);
        this.cursor.isPressed = isPressed;
        this.cursor.button = button;
    }

    draw() {
        let margin = .1;
        let bodies = this.bodiesToDraw;

        bodies.forEach(body => {
            push();

            if (body.type == TYPE_WATER) {
                fill("#1ca3ec");
            } else if (body.type == TYPE_STONE) {
                fill("#f0f0f0");
            }

            rect(body.x + margin, body.y + margin, body.w - 2 * margin, body.h - 2 * margin, margin);
            pop();
        });

        this.drawCursor();
    }

    drawCursor() {
        push();
        let length = .32;
        stroke("rgba(255, 255, 255, .75)");
        strokeWeight(.25);
        line(this.cursor.x, this.cursor.y, this.cursor.x, this.cursor.y + length);
        line(this.cursor.x, this.cursor.y, this.cursor.x + length, this.cursor.y);
        line(this.cursor.x + this.cursor.size, this.cursor.y, this.cursor.x + this.cursor.size, this.cursor.y + length);
        line(this.cursor.x + this.cursor.size, this.cursor.y, this.cursor.x + this.cursor.size - length, this.cursor.y);
        line(this.cursor.x, this.cursor.y + this.cursor.size, this.cursor.x, this.cursor.y + this.cursor.size - length);
        line(this.cursor.x, this.cursor.y + this.cursor.size, this.cursor.x + length, this.cursor.y + this.cursor.size);
        line(this.cursor.x + this.cursor.size, this.cursor.y + this.cursor.size, this.cursor.x + this.cursor.size, this.cursor.y + this.cursor.size - length);
        line(this.cursor.x + this.cursor.size, this.cursor.y + this.cursor.size, this.cursor.x + this.cursor.size - length, this.cursor.y + this.cursor.size);
        pop();
    }
}
