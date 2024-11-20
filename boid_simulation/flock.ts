import { Boid } from "./boid.js";
import { Vector2 } from "./vector2.js";

const EPSILON = 0.000001;

export class Flock {

    private boids: Boid[] = [];

    private separationWeight: number = 1.50;
    private alignmentWeight: number = 1.0;
    private cohesionWeight: number = 1.0;

    constructor(separation: number, alignment: number, cohesion: number) {
        this.separationWeight = separation;
        this.alignmentWeight = alignment;
        this.cohesionWeight = cohesion;
    }

    /**
     * Adds a boid to the flock
     */
    public addBoid(boid: Boid): void {
        this.boids.push(boid);
    }

    /**
     * Removes the last boid (last element of the array) from the flock
     */
    public removeBoid(): void {
        if (this.boids.length > 0) {
            this.boids.pop();
        }
    } 

    public update(): void {
        for (const boid of this.boids) {
            const cohesion: Vector2 = this.cohere(boid);
            const separation: Vector2 = this.separate(boid);
            const alignment: Vector2 = this.align(boid);

            boid.applyAcceleration(cohesion.multiplyS(this.cohesionWeight));
            boid.applyAcceleration(separation.multiplyS(this.separationWeight));
            boid.applyAcceleration(alignment.multiplyS(this.alignmentWeight));

            boid.update();
        }
    }

    public render(canvasCtx: CanvasRenderingContext2D): void {
        for (const boid of this.boids) {
            boid.render(canvasCtx);
        }
    }

    /**
     * Rule 1: cohesion
     */
    private cohere(targetBoid: Boid): Vector2 {
        const COHERE_DISTANCE: number = 60.0;

        let sum: Vector2 = Vector2.Zero;
        let neighbourCount: number = 0;

        for (const other of this.boids) {
            if (targetBoid === other) {
                continue;
            }

            const distance: number = targetBoid.getPosition().distanceTo(other.getPosition()) + EPSILON;
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
    private separate(targetBoid: Boid): Vector2 {
        const DESIRED_SEPARATION: number = 33.0;

        let steer: Vector2 = Vector2.Zero;
        let neighbourCount: number = 0;

        for (const other of this.boids) {
            if (targetBoid === other) {
                continue;
            }

            const distance: number = targetBoid.getPosition().distanceTo(other.getPosition()) + EPSILON;
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

    private align(targetBoid: Boid): Vector2 {
        const ALIGN_DISTANCE: number = 60.0;

        let sum: Vector2 = Vector2.Zero;
        let neighbourCount: number = 0;

        for (const other of this.boids) {
            if (targetBoid === other) {
                continue;
            }

            const distance: number = targetBoid.getPosition().distanceTo(other.getPosition()) + EPSILON;
            if (distance > 0.0 && distance <= ALIGN_DISTANCE) {
                sum = sum.add(other.getVelocity());
                neighbourCount++;
            }
        }

        if (neighbourCount > 0) {
            const avg: Vector2 = sum.divideS(neighbourCount).normalized().multiplyS(targetBoid.getMaxSpeed());
            return avg.subtract(targetBoid.getVelocity()).normalized().multiplyS(targetBoid.getMaxForce());
        }

        return Vector2.Zero;
    }

}