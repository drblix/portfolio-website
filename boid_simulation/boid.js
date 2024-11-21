import { Vector2 } from "./vector2.js";
// 2.4, 0.035
const MAX_SPEED = 3.0;
const MAX_FORCE = 0.055;
export class Boid {
    constructor(x, y, visibleRadius, protectedRadius) {
        this.position = Vector2.Zero;
        this.velocity = Vector2.Zero;
        this.acceleration = Vector2.Zero;
        this.visibleRadius = 0.0;
        this.protectedRadius = 0.0;
        const angle = Math.PI * 2.0 * Math.random();
        this.position = new Vector2(x, y);
        this.velocity = new Vector2(Math.cos(angle), Math.sin(angle));
        this.visibleRadius = visibleRadius;
        this.protectedRadius = protectedRadius;
    }
    align(boids) {
        let target = Vector2.Zero;
        let totalNeighbours = 0;
        for (const other of boids) {
            if (other === this) {
                continue;
            }
            const distance = this.position.distanceTo(other.position);
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
        let force = target.subtract(this.velocity);
        force.limitMagnitude(MAX_FORCE);
        force = force.multiplyS(0.5);
        this.acceleration = this.acceleration.add(force);
    }
    separate(boids) {
        let target = Vector2.Zero;
        let totalNeighbours = 0;
        for (const other of boids) {
            if (other === this) {
                continue;
            }
            const distance = this.position.distanceTo(other.getPosition());
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
        let force = target.subtract(this.velocity);
        force.limitMagnitude(MAX_FORCE);
        force = force.multiplyS(1.0);
        this.acceleration = this.acceleration.add(force);
    }
    cohere(boids) {
        let center = Vector2.Zero;
        let totalNeighbours = 0;
        for (const other of boids) {
            if (other === this) {
                continue;
            }
            const distance = this.position.distanceTo(other.getPosition());
            if (distance < this.visibleRadius) {
                center = center.add(other.getPosition());
                totalNeighbours++;
            }
        }
        if (totalNeighbours === 0) {
            return;
        }
        center = center.divideS(totalNeighbours);
        let target = center.subtract(this.position);
        target.setMagnitude(MAX_SPEED);
        let force = target.subtract(this.velocity);
        force.limitMagnitude(MAX_FORCE);
        force = force.multiplyS(0.1);
        this.acceleration.add(force);
    }
    wrapAroundCanvas(canvasWidth, canvasHeight) {
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
    update(boids, canvasWidth, canvasHeight) {
        this.acceleration = Vector2.Zero;
        this.align(boids);
        this.separate(boids);
        this.cohere(boids);
        this.wrapAroundCanvas(canvasWidth, canvasHeight);
        this.position = this.position.add(this.velocity);
        this.velocity = this.velocity.add(this.acceleration);
        this.velocity.limitMagnitude(MAX_SPEED);
    }
    render(canvasCtx) {
        const SIZE = 13.5;
        const RATIO = 4.5;
        let directionVector = this.velocity.normalized().multiplyS(SIZE);
        let invVector1 = new Vector2(-directionVector.y, directionVector.x);
        let invVector2 = new Vector2(directionVector.y, -directionVector.x);
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
    getPosition() {
        return this.position;
    }
    getVelocity() {
        return this.velocity;
    }
}
