import Body from "../Body";

export default class Concrete extends Body {
    get nextPos() {
        return this.pos;
    }

    updatePosition() {
        this.pos = this.nextPos;
    }

    draw() {
        push();
        fill("#fff");
        super.draw();
        pop();
    }
}
