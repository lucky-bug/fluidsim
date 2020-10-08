import { Vector } from "p5";
import Body from "./Body";
import Sand from "./Body/Sand";
import Water from "./Body/Water";

export default class World {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.map = this.createMap();
    }

    createMap() {
        let map = [];

        for (let y = 0; y < this.height; y++) {
            map[y] = [];
            for (let x = 0; x < this.width; x++) {
                map[y][x] = null;
            }
        }

        return map;
    }

    createBody(pos, type) {
        if (type === LEFT) {
            return new Water(this, pos);
        } else if (type === RIGHT) {
            return new Sand(this, pos);
        }
    }

    add(body) {
        for (let i = 0; i < body.height; i++) {
            for (let j = 0; j < body.width; j++) {
                this.map[body.y + i][body.x + j] = body;
            }
        }
    }

    delete(body) {
        for (let i = 0; i < body.height; i++) {
            for (let j = 0; j < body.width; j++) {
                this.map[body.y + i][body.x + j] = null;
            }
        }
    }

    isInside(pos, size) {
        return (
            pos.x >= 0 &&
            pos.x + size.x <= this.width &&
            pos.y >= 0 &&
            pos.y + size.y <= this.height
        );
    }

    isEmpty(pos, size) {
        if (!this.isInside(pos, size)) return false;

        for (let i = 0; i < size.y; i++) {
            for (let j = 0; j < size.x; j++) {
                let body = this.map[pos.y + i][pos.x + j];


                if (body && body.pos !== pos && body.size !== size) {
                    return false;
                }
            }
        }

        return true;
    }

    isFull(pos, size) {
        if (!this.isInside(pos, size)) return true;

        for (let i = 0; i < size.y; i++) {
            for (let j = 0; j < size.x; j++) {
                if (this.map[pos.y + i][pos.x + j] === null) {
                    return false;
                }
            }
        }

        return true;
    }

    isSame(pos, size) {
        if (!this.map[pos.y][pos.x]) {
            return false;
        }

        let type = this.map[pos.y][pos.x].constructor.name;

        for (let i = 0; i < size.y; i++) {
            for (let j = 0; j < size.x; j++) {
                if (!this.map[pos.y + i][pos.x + j] || this.map[pos.y + i][pos.x + j].constructor.name !== type) {
                    return false;
                }
            }
        }

        return true;
    }

    isCircled(body) {
        return (
            this.isFull(new Vector(body.x - 1, body.y - 1), new Vector(body.width + 2, 1)) &&
            this.isFull(new Vector(body.x - 1, body.y), new Vector(1, body.height)) &&
            this.isFull(new Vector(body.x - 1, body.y + body.height), new Vector(body.width + 2, 1)) &&
            this.isFull(new Vector(body.x + body.width, body.y), new Vector(1, body.height))
        );
    }

    adapt() {
        let adaptedMap = this.createMap();

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                let body = this.map[y][x];

                if (body) {
                    body.circled = this.isCircled(body);
                }
            }
        }

        return adaptedMap;
    }

    update() {
        for (let y = this.height - 1; y >= 0; y--) {
            for (let x = 0; x < this.width; x++) {
                let body = this.map[y][x];

                if (body && body.y === y && body.x === x) {
                    let nextPos = body.nextPos;

                    if (this.isEmpty(nextPos, body.size)) {
                        this.delete(body);
                        body.update();
                        this.add(body);
                    }
                }
            }
        }

        this.adapt();
    }

    draw() {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                let body = this.map[y][x];

                if (body && body.y === y && body.x === x) {
                    body.draw();
                }
            }
        }
    }
}
