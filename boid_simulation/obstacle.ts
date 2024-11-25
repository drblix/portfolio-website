import { Vector2 } from "./vector2.js";

export class Obstacle {
    private position: Vector2 = Vector2.Zero;
    private radius: number = 0.0;

    constructor(position: Vector2, radius: number) {
        this.position = position;
        this.radius = radius;
    }

    public setPosition(position: Vector2): void {
        this.position = position;
    }

    public getPosition(): Vector2 {
        return this.position;
    }

    public getRadius(): number {
        return this.radius;
    }
}