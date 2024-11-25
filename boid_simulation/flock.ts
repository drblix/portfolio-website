import { Boid } from "./boid";
import { Vector2 } from "./vector2";

export class Flock {
    private readonly maxSpeed: number = 0.0;
    private readonly maxForce: number = 0.0;

    private readonly boidSize: number = 13.5;
    private readonly boidLineWidth: number = 4.0;
    private readonly strokeStyle: string | CanvasGradient | CanvasPattern = "black";
    private readonly fillStyle: string | CanvasGradient | CanvasPattern = "white";

    private boids: Boid[] = [];

    constructor(
        maxSpeed: number = 3.0,
        maxForce: number = 0.055,
        boidSize: number = 13.5,
        boidLineWidth: number = 4.0,
        strokeStyle: string | CanvasGradient | CanvasPattern = "black",
        fillStyle: string | CanvasGradient | CanvasPattern = "white"
    ) {
        this.maxSpeed = maxSpeed;
        this.maxForce = maxForce;
        
        this.boidSize = boidSize;
        this.boidLineWidth = boidLineWidth;
        this.strokeStyle = strokeStyle;
        this.fillStyle = fillStyle;
    }

    public addBoid(boid: Boid): void {
        this.boids.push(boid);
    }

    public removeBoid(): void {
        if (this.boids.length > 0) {
            this.boids.pop();
        }
    }

    public clearBoids(): void {
        while (this.boids.pop() != undefined) {
            continue;
        }
    }

    public update(canvasWidth: number, canvasHeight: number, mousePosition: Vector2): void {
        for (const boid of this.boids) {
            boid.update(this.boids, this.maxSpeed, this.maxForce, canvasWidth, canvasHeight, mousePosition);
        }
    }

    public render(canvasCtx: CanvasRenderingContext2D): void {
        for (const boid of this.boids) {
            boid.render(this, canvasCtx);
        }
    }

    public getMaxSpeed(): number {
        return this.maxSpeed;
    }

    public getMaxForce(): number {
        return this.maxForce;
    }

    public getBoidSize(): number {
        return this.boidSize;
    }

    public getBoidLineWidth(): number {
        return this.boidLineWidth;
    }

    public getStrokeStyle(): string | CanvasGradient | CanvasPattern {
        return this.strokeStyle;
    }

    public getFillStyle(): string | CanvasGradient | CanvasPattern {
        return this.fillStyle;
    }
}