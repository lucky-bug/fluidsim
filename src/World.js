import _ from "lodash";
import { Vector } from "p5";
import Body from "./Body";
import Concrete from "./Body/Concrete";
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
        } else {
            return new Concrete(this, pos);
        }
    }

    add(map, body) {
        for (let i = 0; i < body.height; i++) {
            for (let j = 0; j < body.width; j++) {
                map[body.y + i][body.x + j] = body;
            }
        }
    }

    delete(map, body) {
        for (let i = 0; i < body.height; i++) {
            for (let j = 0; j < body.width; j++) {
                map[body.y + i][body.x + j] = null;
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

    isEmpty(map, pos, size) {
        if (!this.isInside(pos, size)) return false;

        for (let i = 0; i < size.y; i++) {
            for (let j = 0; j < size.x; j++) {
                let body = map[pos.y + i][pos.x + j];


                if (body && body.pos !== pos && body.size !== size) {
                    return false;
                }
            }
        }

        return true;
    }

    isFull(map, pos, size) {
        if (!this.isInside(pos, size)) return false;

        for (let i = 0; i < size.y; i++) {
            for (let j = 0; j < size.x; j++) {
                if (map[pos.y + i][pos.x + j] === null) {
                    return false;
                }
            }
        }

        return true;
    }

    isSame(map, pos, size) {
        if (!map[pos.y][pos.x]) {
            return false;
        }

        let type = map[pos.y][pos.x].constructor.name;

        for (let i = 0; i < size.y; i++) {
            for (let j = 0; j < size.x; j++) {
                if (!map[pos.y + i][pos.x + j] || map[pos.y + i][pos.x + j].constructor.name !== type) {
                    return false;
                }
            }
        }

        return true;
    }

    isCircled(map, body) {
        return (
            this.isFull(map, new Vector(body.x - 1, body.y - 1), new Vector(body.width + 2, 1)) &&
            this.isFull(map, new Vector(body.x - 1, body.y), new Vector(1, body.height)) &&
            this.isFull(map, new Vector(body.x - 1, body.y + body.height), new Vector(body.width + 2, 1)) &&
            this.isFull(map, new Vector(body.x + body.width, body.y), new Vector(1, body.height))
        );
    }

    adapt() {
        let adaptedMap = this.createMap();

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                let body = this.map[y][x];

                if (body) {
                    body.circled = this.isCircled(this.map, body);
                }
            }
        }

        for (let y = 1; y < this.height - 1; y++) {
            for (let x = 1; x < this.width - 1; x++) {
                let body = this.map[y][x];

                if (body && body.x == x && body.y == y && body.circled) {
                    let newBody = new body.constructor(body.world, new Vector(x, y));
                    let adapted = true;

                    while (adapted) {
                        adapted = false;

                        if (
                            this.isInside(new Vector(newBody.x + newBody.width, newBody.y), new Vector(newBody.x + newBody.width, newBody.y + newBody.height - 1)) &&
                            this.isFull(this.map, new Vector(newBody.x + newBody.width, newBody.y), new Vector(newBody.x + newBody.width, newBody.y + newBody.height - 1)) &&
                            this.isSame(this.map, new Vector(newBody.x + newBody.width, newBody.y), new Vector(newBody.x + newBody.width, newBody.y + newBody.height - 1)) &&
                            this.map[newBody.y][newBody.x + newBody.width].constructor.name == newBody.constructor.name
                        ) {
                            newBody.size.x++;
                            adapted = true;
                        }
                    }

                    adaptedMap[y][x] = newBody;
                }
            }
        }

        return adaptedMap;
    }

    update() {
        let map = this.map;

        for (let y = this.height - 1; y >= 0; y--) {
            for (let x = 0; x < this.width; x++) {
                let body = this.map[y][x];

                if (body && !body.updated && body.y === y && body.x === x) {
                    let nextPos = body.nextPos;

                    this.delete(map, body);

                    if (this.isEmpty(map, nextPos, body.size)) {
                        body.update();
                    }

                    body.updated = true;

                    this.add(map, body);
                }
            }
        }

        this.map = map;
    }

    draw() {
        let map = this.map;

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                let body = map[y][x];

                if (body && body.y === y && body.x === x) {
                    body.draw();
                    body.updated = false;
                }
            }
        }
    }
}
