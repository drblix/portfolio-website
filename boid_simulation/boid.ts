import { Vector2 } from "./vector2.js";

// 2.4, 0.035
const MAX_SPEED: number = 3.0;
const MAX_FORCE: number = 0.055;

export class Boid {
    private position: Vector2 = Vector2.Zero;
    private velocity: Vector2 = Vector2.Zero;
    private acceleration: Vector2 = Vector2.Zero;

    private visibleRadius: number = 0.0;
    private protectedRadius: number = 0.0;
    

    constructor(x: number, y: number, visibleRadius: number, protectedRadius: number) {
        const angle: number = Math.PI * 2.0 * Math.random();
        
        this.position = new Vector2(x, y);
        this.velocity = new Vector2(Math.cos(angle), Math.sin(angle));

        this.visibleRadius = visibleRadius;
        this.protectedRadius = protectedRadius;
    }

    private align(boids: Boid[]): void {
        let target: Vector2 = Vector2.Zero;
        let totalNeighbours: number = 0;

        for (const other of boids) {
            if (other === this) {
                continue;
            }

            const distance: number = this.position.distanceTo(other.position);
            if (distance < this.visibleRadius) {
                target = target.add(other.position);
                totalNeighbours++;
            }
        }

        if (totalNeighbours === 0) {
            return;
        }

        target = target.divideS(totalNeighbours);
        target.setMagnitude(MAX_SPEED);

        let force: Vector2 = target.subtract(this.velocity);
        force.limitMagnitude(MAX_FORCE);
        force = force.multiplyS(0.5);

        this.acceleration = this.acceleration.add(force);
    }

    private separate(boids: Boid[]): void {
        let target: Vector2 = Vector2.Zero;
        let totalNeighbours: number = 0;

        for (const other of boids) {
            if (other === this) {
                continue;
            }
            
            const distance: number = this.position.distanceTo(other.getPosition());
            if (distance < this.protectedRadius) {
                let difference = this.position.subtract(other.getPosition());

                difference = difference.divideS(distance * distance);
                target = target.add(difference);

                totalNeighbours++;
            }
        }

        if (totalNeighbours === 0) {
            return;
        }

        target = target.divideS(totalNeighbours);
        target.setMagnitude(MAX_SPEED);

        let force: Vector2 = target.subtract(this.velocity);
        force.limitMagnitude(MAX_FORCE);
        force = force.multiplyS(1.0);
        
        this.acceleration = this.acceleration.add(force);
    }

    private cohere(boids: Boid[]): void {
        let center: Vector2 = Vector2.Zero;
        let totalNeighbours: number = 0;

        for (const other of boids) {
            if (other === this) {
                continue;
            }

            const distance: number = this.position.distanceTo(other.getPosition());
            if (distance < this.visibleRadius) {
                center = center.add(other.getPosition());
                totalNeighbours++;
            }
        }

        if (totalNeighbours === 0) {
            return;
        }

        center = center.divideS(totalNeighbours);

        let target: Vector2 = center.subtract(this.position);
        target.setMagnitude(MAX_SPEED);

        let force: Vector2 = target.subtract(this.velocity);
        force.limitMagnitude(MAX_FORCE);
        force = force.multiplyS(0.1);

        this.acceleration.add(force);
    }

    private wrapAroundCanvas(canvasWidth: number, canvasHeight: number): void {
        if (this.position.x < 0.0) {
            this.position.x = canvasWidth;
        }
        else if (this.position.x > canvasWidth) {
            this.position.x = 0.0;
        }

        if (this.position.y < 0.0) {
            this.position.y = canvasHeight;
        }
        else if (this.position.y > canvasHeight) {
            this.position.y = 0.0;
        }
    }

    public update(boids: Boid[], canvasWidth: number, canvasHeight: number): void {
        this.acceleration = Vector2.Zero;

        this.align(boids);
        this.separate(boids);
        this.cohere(boids);
        
        this.wrapAroundCanvas(canvasWidth, canvasHeight);

        this.position = this.position.add(this.velocity);
        this.velocity = this.velocity.add(this.acceleration)
        this.velocity.limitMagnitude(MAX_SPEED);
    }

    public render(canvasCtx: CanvasRenderingContext2D): void {
        const SIZE: number = 13.5;
        const RATIO: number = 4.5;

        let directionVector: Vector2 = this.velocity.normalized().multiplyS(SIZE);
		let invVector1: Vector2 = new Vector2(-directionVector.y, directionVector.x);
		let invVector2: Vector2 = new Vector2(directionVector.y, -directionVector.x);
		invVector1 = invVector1.divideS(SIZE / RATIO);
		invVector2 = invVector2.divideS(SIZE / RATIO);

        canvasCtx.beginPath();

        canvasCtx.moveTo(this.position.x, this.position.y);

        canvasCtx.lineTo(this.position.x + invVector1.x, this.position.y + invVector1.y);
        canvasCtx.lineTo(this.position.x + directionVector.x, this.position.y + directionVector.y);
		canvasCtx.lineTo(this.position.x + invVector2.x, this.position.y + invVector2.y);

		canvasCtx.lineTo(this.position.x, this.position.y);

        canvasCtx.lineWidth = 4.0;
        canvasCtx.fillStyle = "black";
		canvasCtx.stroke();

        canvasCtx.fillStyle = "white";
        canvasCtx.fill();
    }

    public getPosition(): Vector2 {
        return this.position;
    }

    public getVelocity(): Vector2 {
        return this.velocity;
    }
}