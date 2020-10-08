import { Vector } from "p5";
import Body from "../Body";

export default class Water extends Body {
    get nextPos() {
        let levelDir = Math.random() < .5 ? -1 : 1;
        let bottomDir = Math.random() < .5 ? -1 : 1;

        if (this.world.isEmpty(new Vector(this.x, this.y + 1), this.size) && this.world.map[this.y + 1][this.x] === null) {
            return new Vector(this.x, this.y + 1);
        } else if (this.world.isEmpty(new Vector(this.x + bottomDir, this.y + 1), this.size) && this.world.map[this.y + 1][this.x + bottomDir] === null) {
            return new Vector(this.x + bottomDir, this.y + 1);
        } else if (this.world.isEmpty(new Vector(this.x - bottomDir, this.y + 1), this.size) && this.world.map[this.y + 1][this.x - bottomDir] === null) {
            return new Vector(this.x - bottomDir, this.y + 1);
        } else if (this.world.isEmpty(new Vector(this.x + levelDir, this.y), this.size) && this.world.map[this.y][this.x + levelDir] === null) {
            return new Vector(this.x + levelDir, this.y);
        } else if (this.world.isEmpty(new Vector(this.x - levelDir, this.y), this.size) && this.world.map[this.y][this.x - levelDir] === null) {
            return new Vector(this.x - levelDir, this.y);
        }

        return this.pos;
    }

    updatePosition() {
        this.pos = this.nextPos;
    }

    draw() {
        push();
        fill("rgba(28, 163, 236, .75)");
        super.draw();
        pop();
    }
}
