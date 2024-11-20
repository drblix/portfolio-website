import { Vector2 } from "./vector2.js";
const EPSILON = 0.000001;
export class Flock {
    constructor(separation, alignment, cohesion) {
        this.boids = [];
        this.separationWeight = 1.50;
        this.alignmentWeight = 1.0;
        this.cohesionWeight = 1.0;
        this.separationWeight = separation;
        this.alignmentWeight = alignment;
        this.cohesionWeight = cohesion;
    }
    /**
     * Adds a boid to the flock
     */
    addBoid(boid) {
        this.boids.push(boid);
    }
    /**
     * Removes the last boid (last element of the array) from the flock
     */
    removeBoid() {
        if (this.boids.length > 0) {
            this.boids.pop();
        }
    }
    update() {
        for (const boid of this.boids) {
            const cohesion = this.cohere(boid);
            const separation = this.separate(boid);
            const alignment = this.align(boid);
            boid.applyAcceleration(cohesion.multiplyS(this.cohesionWeight));
            boid.applyAcceleration(separation.multiplyS(this.separationWeight));
            boid.applyAcceleration(alignment.multiplyS(this.alignmentWeight));
            boid.update();
        }
    }
    render(canvasCtx) {
        for (const boid of this.boids) {
            boid.render(canvasCtx);
        }
    }
    /**
     * Rule 1: cohesion
     */
    cohere(targetBoid) {
        const COHERE_DISTANCE = 60.0;
        let sum = Vector2.Zero;
        let neighbourCount = 0;
        for (const other of this.boids) {
            if (targetBoid === other) {
                continue;
            }
            const distance = targetBoid.getPosition().distanceTo(other.getPosition()) + EPSILON;
            if (distance <= COHERE_DISTANCE) {
                sum = sum.add(other.getPosition());
                neighbourCount++;
            }
        }
        if (neighbourCount > 0) {
            const target = sum.divideS(neighbourCount);
            const desired = target.subtract(targetBoid.getPosition()).normalized().multiplyS(targetBoid.getMaxSpeed());
            return desired.subtract(targetBoid.getVelocity()).normalized().multiplyS(targetBoid.getMaxForce());
        }
        return Vector2.Zero;
    }
    /**
     * Rule 2: separate
     */
    separate(targetBoid) {
        const DESIRED_SEPARATION = 33.0;
        let steer = Vector2.Zero;
        let neighbourCount = 0;
        for (const other of this.boids) {
            if (targetBoid === other) {
                continue;
            }
            const distance = targetBoid.getPosition().distanceTo(other.getPosition()) + EPSILON;
            if (distance > 0.0 && distance <= DESIRED_SEPARATION) {
                const diff = targetBoid.getPosition().subtract(other.getPosition()).normalized().divideS(distance);
                steer = steer.add(diff);
                neighbourCount++;
            }
        }
        if (neighbourCount > 0) {
            steer = steer.divideS(neighbourCount).normalized().multiplyS(targetBoid.getMaxSpeed());
            steer = steer.subtract(targetBoid.getVelocity()).normalized().multiplyS(targetBoid.getMaxForce());
        }
        return steer;
    }
    align(targetBoid) {
        const ALIGN_DISTANCE = 60.0;
        let sum = Vector2.Zero;
        let neighbourCount = 0;
        for (const other of this.boids) {
            if (targetBoid === other) {
                continue;
            }
            const distance = targetBoid.getPosition().distanceTo(other.getPosition()) + EPSILON;
            if (distance > 0.0 && distance <= ALIGN_DISTANCE) {
                sum = sum.add(other.getVelocity());
                neighbourCount++;
            }
        }
        if (neighbourCount > 0) {
            const avg = sum.divideS(neighbourCount).normalized().multiplyS(targetBoid.getMaxSpeed());
            return avg.subtract(targetBoid.getVelocity()).normalized().multiplyS(targetBoid.getMaxForce());
        }
        return Vector2.Zero;
    }
}
