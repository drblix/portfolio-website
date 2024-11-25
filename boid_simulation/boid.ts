import { BoidSettings } from "./boid_settings.js";
import { Flock } from "./flock.js";
import { Vector2 } from "./vector2.js";

export class Boid {
    private position: Vector2 = Vector2.Zero;
    private velocity: Vector2 = Vector2.Zero;
    private acceleration: Vector2 = Vector2.Zero;

    private visibleRadius: number = 0.0;
    private protectedRadius: number = 0.0;
    
    private mouseAvoidRadius: number = 0.0;
    private mouseAvoidCoefficient: number = 0.0;

    private separateCoefficent: number = 0.0;
    private alignCoefficient: number = 0.0;
    private cohereCoefficient: number = 0.0;    

    constructor(x: number, y: number, settings: BoidSettings) {
        const angle: number = Math.PI * 2.0 * Math.random();
        
        this.position = new Vector2(x, y);
        this.velocity = new Vector2(Math.cos(angle), Math.sin(angle));

        this.applySettings(settings);
    }

    private avoidMouse(mousePosition: Vector2): void {
        const distance: number = this.position.distanceTo(mousePosition);
        if (distance < this.mouseAvoidRadius) {
            let repulsion: Vector2 = this.position.subtract(mousePosition).normalized();
            repulsion = repulsion.multiplyS((this.mouseAvoidCoefficient * (this.mouseAvoidRadius - distance)) / this.mouseAvoidRadius);

            this.acceleration = this.acceleration.add(repulsion);
        }
    }

    private align(maxSpeed: number, maxForce: number, flock: Boid[]): void {
        let target: Vector2 = Vector2.Zero;
        let totalNeighbours: number = 0;

        for (const other of flock) {
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
        target.setMagnitude(maxSpeed);

        let force: Vector2 = target.subtract(this.velocity);
        force.limitMagnitude(maxForce);
        force = force.multiplyS(this.alignCoefficient);

        this.acceleration = this.acceleration.add(force);
    }

    private separate(maxSpeed: number, maxForce: number, flock: Boid[]): void {
        let target: Vector2 = Vector2.Zero;
        let totalNeighbours: number = 0;

        for (const other of flock) {
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
        target.setMagnitude(maxSpeed);

        let force: Vector2 = target.subtract(this.velocity);
        force.limitMagnitude(maxForce);
        force = force.multiplyS(this.separateCoefficent);
        
        this.acceleration = this.acceleration.add(force);
    }

    private cohere(maxSpeed: number, maxForce: number, flock: Boid[]): void {
        let center: Vector2 = Vector2.Zero;
        let totalNeighbours: number = 0;

        for (const other of flock) {
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
        target.setMagnitude(maxSpeed);

        let force: Vector2 = target.subtract(this.velocity);
        force.limitMagnitude(maxForce);
        force = force.multiplyS(this.cohereCoefficient);

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

    public applySettings(settings: BoidSettings): void {
        this.visibleRadius = settings.getVisibleRadius();
        this.protectedRadius = settings.getProtectedRadius();
        this.mouseAvoidRadius = settings.getMouseAvoidRadius();
        this.mouseAvoidCoefficient = settings.getAvoidRepulsionStrength();

        this.separateCoefficent = settings.getSeparateCoefficient();
        this.alignCoefficient = settings.getAlignCoefficient();
        this.cohereCoefficient = settings.getCohereCoefficient();
    }

    public update(flock: Boid[], maxSpeed: number, maxForce: number, canvasWidth: number, canvasHeight: number, mousePosition: Vector2): void {
        this.acceleration = Vector2.Zero;

        this.align(maxSpeed, maxForce, flock);
        this.separate(maxSpeed, maxForce, flock);
        this.cohere(maxSpeed, maxForce, flock);
        this.avoidMouse(mousePosition);
        
        this.wrapAroundCanvas(canvasWidth, canvasHeight);

        this.position = this.position.add(this.velocity);
        this.velocity = this.velocity.add(this.acceleration)
        this.velocity.limitMagnitude(maxSpeed);
    }

    public render(flock: Flock, canvasCtx: CanvasRenderingContext2D): void {
        let directionVector: Vector2 = this.velocity.normalized().multiplyS(flock.getBoidSize());
		let invVector1: Vector2 = new Vector2(-directionVector.y, directionVector.x);
		let invVector2: Vector2 = new Vector2(directionVector.y, -directionVector.x);
		invVector1 = invVector1.divideS(flock.getBoidSize() / 3.0);
		invVector2 = invVector2.divideS(flock.getBoidSize() / 3.0);

        canvasCtx.beginPath();

        canvasCtx.moveTo(this.position.x, this.position.y);

        canvasCtx.lineTo(this.position.x + invVector1.x, this.position.y + invVector1.y);
        canvasCtx.lineTo(this.position.x + directionVector.x, this.position.y + directionVector.y);
		canvasCtx.lineTo(this.position.x + invVector2.x, this.position.y + invVector2.y);

		canvasCtx.lineTo(this.position.x, this.position.y);

        canvasCtx.lineWidth = flock.getBoidLineWidth();
        canvasCtx.fillStyle = flock.getStrokeStyle();
		canvasCtx.stroke();

        canvasCtx.fillStyle = flock.getFillStyle();
        canvasCtx.fill();
    }

    public getPosition(): Vector2 {
        return this.position;
    }

    public getVelocity(): Vector2 {
        return this.velocity;
    }
}