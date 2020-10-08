import { Vector } from "p5";
import Body from "../Body";

export default class Water extends Body {
    get nextPos() {
        let dir = this.vel.x !== 0 ? this.vel.x : (Math.random() < .5 ? -1 : 1);
        // this.vel.x = dir;

        if (this.world.isEmpty(this.world.map, new Vector(this.x, this.y + 1), this.size) && this.world.map[this.y + 1][this.x] === null) {
            return new Vector(this.x, this.y + 1);
        } else if (this.world.isEmpty(this.world.map, new Vector(this.x + dir, this.y + 1), this.size) && this.world.map[this.y + 1][this.x + dir] === null) {
            return new Vector(this.x + dir, this.y + 1);
        } else if (this.world.isEmpty(this.world.map, new Vector(this.x - dir, this.y + 1), this.size) && this.world.map[this.y + 1][this.x - dir] === null) {
            // this.vel.x *= -1;
            return new Vector(this.x - dir, this.y + 1);
        } else if (this.world.isEmpty(this.world.map, new Vector(this.x + dir, this.y), this.size) && this.world.map[this.y][this.x + dir] === null) {
            return new Vector(this.x + dir, this.y);
        } else if (this.world.isEmpty(this.world.map, new Vector(this.x - dir, this.y), this.size) && this.world.map[this.y][this.x - dir] === null) {
            // this.vel.x *= -1;
            return new Vector(this.x - dir, this.y);
        }

        return this.pos;
    }

    updatePosition() {
        this.pos = this.nextPos;
    }

    draw() {
        push();
        fill("rgba(28, 163, 236, .75)");

        if (this.circled) {
            fill("rgba(28, 163, 236, .25)");
        }

        super.draw();
        pop();
    }
}
