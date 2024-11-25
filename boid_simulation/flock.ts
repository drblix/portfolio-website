import { Boid } from "./boid.js";
import { Obstacle } from "./obstacle.js";

export class Flock {
    private readonly maxSpeed: number = 0.0;
    private readonly maxForce: number = 0.0;

    private readonly boidSize: number = 13.5;
    private readonly boidLineWidth: number = 4.0;
    private readonly strokeStyle: string | CanvasGradient | CanvasPattern = "black";
    private readonly fillStyle: string | CanvasGradient | CanvasPattern = "white";

    private boids: Boid[] = [];
    private obstacles: Obstacle[] = [];

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

    public removeBoid(boid: Boid | null = null): void {
        if (boid) {
            let index: number = this.boids.indexOf(boid);
            if (index != -1) {
                this.obstacles.splice(index, 1);
            }
        }
        else {
            this.obstacles.pop();
        }
    }

    public clearBoids(): void {
        while (this.boids.pop() != undefined) {
            continue;
        }
    }

    public addObstacle(obstacle: Obstacle): void {
        this.obstacles.push(obstacle);
    }

    public removeObstacle(obstacle: Obstacle | null = null): void {
        if (obstacle) {
            let index: number = this.obstacles.indexOf(obstacle);
            if (index != -1) {
                this.obstacles.splice(index, 1);
            }
        }
        else {
            this.obstacles.pop();
        }
    }

    public update(canvasWidth: number, canvasHeight: number): void {
        for (const boid of this.boids) {
            boid.update(this.boids, this.obstacles, this.maxSpeed, this.maxForce, canvasWidth, canvasHeight);
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