import { Vector2 } from "./vector2.js";
export class Boid {
    constructor(x, y, settings) {
        this.position = Vector2.Zero;
        this.velocity = Vector2.Zero;
        this.acceleration = Vector2.Zero;
        this.visibleRadius = 0.0;
        this.protectedRadius = 0.0;
        this.mouseAvoidRadius = 0.0;
        this.mouseAvoidCoefficient = 0.0;
        this.separateCoefficent = 0.0;
        this.alignCoefficient = 0.0;
        this.cohereCoefficient = 0.0;
        const angle = Math.PI * 2.0 * Math.random();
        this.position = new Vector2(x, y);
        this.velocity = new Vector2(Math.cos(angle), Math.sin(angle));
        this.applySettings(settings);
    }
    avoidMouse(mousePosition) {
        const distance = this.position.distanceTo(mousePosition);
        if (distance < this.mouseAvoidRadius) {
            let repulsion = this.position.subtract(mousePosition).normalized();
            repulsion = repulsion.multiplyS((this.mouseAvoidCoefficient * (this.mouseAvoidRadius - distance)) / this.mouseAvoidRadius);
            this.acceleration = this.acceleration.add(repulsion);
        }
    }
    align(maxSpeed, maxForce, flock) {
        let target = Vector2.Zero;
        let totalNeighbours = 0;
        for (const other of flock) {
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
        target.setMagnitude(maxSpeed);
        let force = target.subtract(this.velocity);
        force.limitMagnitude(maxForce);
        force = force.multiplyS(this.alignCoefficient);
        this.acceleration = this.acceleration.add(force);
    }
    separate(maxSpeed, maxForce, flock) {
        let target = Vector2.Zero;
        let totalNeighbours = 0;
        for (const other of flock) {
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
        target.setMagnitude(maxSpeed);
        let force = target.subtract(this.velocity);
        force.limitMagnitude(maxForce);
        force = force.multiplyS(this.separateCoefficent);
        this.acceleration = this.acceleration.add(force);
    }
    cohere(maxSpeed, maxForce, flock) {
        let center = Vector2.Zero;
        let totalNeighbours = 0;
        for (const other of flock) {
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
        target.setMagnitude(maxSpeed);
        let force = target.subtract(this.velocity);
        force.limitMagnitude(maxForce);
        force = force.multiplyS(this.cohereCoefficient);
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
    applySettings(settings) {
        this.visibleRadius = settings.getVisibleRadius();
        this.protectedRadius = settings.getProtectedRadius();
        this.mouseAvoidRadius = settings.getMouseAvoidRadius();
        this.mouseAvoidCoefficient = settings.getAvoidRepulsionStrength();
        this.separateCoefficent = settings.getSeparateCoefficient();
        this.alignCoefficient = settings.getAlignCoefficient();
        this.cohereCoefficient = settings.getCohereCoefficient();
    }
    update(flock, maxSpeed, maxForce, canvasWidth, canvasHeight, mousePosition) {
        this.acceleration = Vector2.Zero;
        this.align(maxSpeed, maxForce, flock);
        this.separate(maxSpeed, maxForce, flock);
        this.cohere(maxSpeed, maxForce, flock);
        this.avoidMouse(mousePosition);
        this.wrapAroundCanvas(canvasWidth, canvasHeight);
        this.position = this.position.add(this.velocity);
        this.velocity = this.velocity.add(this.acceleration);
        this.velocity.limitMagnitude(maxSpeed);
    }
    render(flock, canvasCtx) {
        let directionVector = this.velocity.normalized().multiplyS(flock.getBoidSize());
        let invVector1 = new Vector2(-directionVector.y, directionVector.x);
        let invVector2 = new Vector2(directionVector.y, -directionVector.x);
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
    getPosition() {
        return this.position;
    }
    getVelocity() {
        return this.velocity;
    }
}
