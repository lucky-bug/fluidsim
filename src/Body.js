import { Vector } from "p5";
import WorldObject from "./WorldObject";

export default class Body extends WorldObject {
    constructor(world, pos, vel = new Vector(0, 0), acc = new Vector(0, 0), size = new Vector(1, 1)) {
        super(world);
        this.pos = pos;
        this.vel = vel;
        this.acc = acc;
        this.size = size;
        this.circled = false;
    }

    get key() {
        return `${this.x},${this.y}`;
    }

    get x() {
        return Math.floor(this.pos.x);
    }

    get y() {
        return Math.floor(this.pos.y);
    }

    get width() {
        return this.size.x;
    }

    get height() {
        return this.size.y;
    }

    get nextPos() {
        return new Vector(
            this.pos.x + this.vel.x + this.acc.x,
            this.pos.y + this.vel.y + this.acc.y
        );
    }

    stop() {
        this.acc.set(0, 0);
        this.vel.set(0, 0);
    }

    applyForce(force) {
        this.acc.add(force);
    }

    updateVelocity() {
        this.vel.add(this.acc);
        this.acc.set(0, 0);
    }

    updatePosition() {
        this.pos.add(this.vel);
    }

    update() {
        this.updateVelocity();
        this.updatePosition();
    }

    draw() {
        push();
        stroke("rgba(0, 0, 0, .5)");
        strokeWeight(.1);
        let margin = .05;
        rect(this.x + margin, this.y + margin, this.width - 2 * margin, this.height - 2 * margin);
        pop();
    }
}
