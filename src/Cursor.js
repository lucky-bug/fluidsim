import Body from "./Body";

export default class Cursor extends Body {
    constructor(world, pos) {
        super(world);
        this.pos = pos;
    }
}