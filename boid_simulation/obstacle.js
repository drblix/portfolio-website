import { Vector2 } from "./vector2.js";
export class Obstacle {
    constructor(position, radius) {
        this.position = Vector2.Zero;
        this.radius = 0.0;
        this.position = position;
        this.radius = radius;
    }
    setPosition(position) {
        this.position = position;
    }
    getPosition() {
        return this.position;
    }
    getRadius() {
        return this.radius;
    }
}
