import { Vector2 } from "./vector2.js";

export class Boid {
    private position: Vector2 = Vector2.Zero;
    private velocity: Vector2 = Vector2.Zero;
    private acceleration: Vector2 = Vector2.Zero;
    
    private maxSpeed: number = 2.0;
    private maxForce: number = 0.065;
    private neighbourRadius: number = 40.0;

    constructor(x: number, y: number, maxSpeed: number = 2.0, maxForce: number = 0.065, neighbourRadius: number = 20.0) {
        const angle: number = Math.PI * 2.0 * Math.random();
        
        this.position = new Vector2(x, y);
        this.velocity = new Vector2(Math.cos(angle), Math.sin(angle));

        this.maxSpeed = maxSpeed;
        this.maxForce = maxForce;
        this.neighbourRadius = neighbourRadius;
    }

    private wrapEdges(canvasWidth: number, canvasHeight: number) {
        if (this.position.x > canvasWidth) {
            this.position.x = 0.0;
        }
        else if (this.position.x < 0.0) {
            this.position.x = canvasWidth;
        }

        if (this.position.y > canvasHeight) {
            this.position.y = 0.0;
        }
        else if (this.position.y < 0.0) {
            this.position.y = canvasHeight;
        }
    }

    public update(): void {
        this.velocity = this.velocity.add(this.acceleration.normalized().multiplyS(this.maxSpeed));
        this.position = this.position.add(this.velocity);
        this.acceleration = Vector2.Zero;

        this.wrapEdges(1920, 960);
    }

    public applyAcceleration(accel: Vector2) {
        this.acceleration = this.acceleration.add(accel);
    }

    public render(canvasCtx: CanvasRenderingContext2D): void {
        let directionVector = this.velocity.normalized().multiplyS(6.0);
		let inverseVector1 = new Vector2(-directionVector.y, directionVector.x);
		let inverseVector2 = new Vector2(directionVector.y, -directionVector.x);
		inverseVector1 = inverseVector1.divideS(3);
		inverseVector2 = inverseVector2.divideS(3);

        canvasCtx.beginPath();

        canvasCtx.moveTo(this.position.x, this.position.y);
        canvasCtx.lineTo(this.position.x + inverseVector1.x, this.position.y + inverseVector1.y);
        canvasCtx.lineTo(this.position.x + directionVector.x, this.position.y + directionVector.y);
		canvasCtx.lineTo(this.position.x + inverseVector2.x, this.position.y + inverseVector2.y);
		canvasCtx.lineTo(this.position.x, this.position.y);
		canvasCtx.strokeStyle = 'rgba(black 1)';
		canvasCtx.stroke();

        canvasCtx.fill();
    }

    public getPosition(): Vector2 {
        return this.position;
    }

    public getVelocity(): Vector2 {
        return this.velocity;
    }

    public getMaxSpeed(): number {
        return this.maxSpeed;
    }

    public getMaxForce(): number {
        return this.maxForce;
    }

    public getNeighbourRadius(): number {
        return this.neighbourRadius;
    }
}