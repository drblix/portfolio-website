import { Vector2 } from "./vector2.js";
export class Boid {
    constructor(x, y, maxSpeed = 2.0, maxForce = 0.065, neighbourRadius = 20.0) {
        this.position = Vector2.Zero;
        this.velocity = Vector2.Zero;
        this.acceleration = Vector2.Zero;
        this.maxSpeed = 2.0;
        this.maxForce = 0.065;
        this.neighbourRadius = 40.0;
        const angle = Math.PI * 2.0 * Math.random();
        this.position = new Vector2(x, y);
        this.velocity = new Vector2(Math.cos(angle), Math.sin(angle));
        this.maxSpeed = maxSpeed;
        this.maxForce = maxForce;
        this.neighbourRadius = neighbourRadius;
    }
    wrapEdges(canvasWidth, canvasHeight) {
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
    update() {
        this.velocity = this.velocity.add(this.acceleration.normalized().multiplyS(this.maxSpeed));
        this.position = this.position.add(this.velocity);
        this.acceleration = Vector2.Zero;
        this.wrapEdges(1920, 960);
    }
    applyAcceleration(accel) {
        this.acceleration = this.acceleration.add(accel);
    }
    render(canvasCtx) {
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
    getPosition() {
        return this.position;
    }
    getVelocity() {
        return this.velocity;
    }
    getMaxSpeed() {
        return this.maxSpeed;
    }
    getMaxForce() {
        return this.maxForce;
    }
    getNeighbourRadius() {
        return this.neighbourRadius;
    }
}
