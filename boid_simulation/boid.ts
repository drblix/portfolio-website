import { BoidSettings } from "./boid_settings.js";
import { Flock } from "./flock.js";
import { Obstacle } from "./obstacle.js";
import { Vector2 } from "./vector2.js";

export class Boid {
    private position: Vector2 = Vector2.Zero;
    private velocity: Vector2 = Vector2.Zero;
    private acceleration: Vector2 = Vector2.Zero;

    private visibleRadius: number = 0.0;
    private protectedRadius: number = 0.0;
    
    private avoidCoefficient: number = 0.0;

    private separateCoefficent: number = 0.0;
    private alignCoefficient: number = 0.0;
    private cohereCoefficient: number = 0.0;    

    constructor(x: number, y: number, settings: BoidSettings) {
        const angle: number = Math.PI * 2.0 * Math.random();
        
        this.position = new Vector2(x, y);
        this.velocity = new Vector2(Math.cos(angle), Math.sin(angle));

        this.applySettings(settings);
    }

    private avoidObstacles(obstacles: Obstacle[]): void {
        const viewDistance: number = 180.0;
        const futurePosition: Vector2 = this.position.add(this.velocity.normalized().multiplyS(viewDistance));

        for (const obstacle of obstacles) {
            const obstaclePosition: Vector2 = obstacle.getPosition();
            const obstacleRadius: number = obstacle.getRadius();

            const distanceToObstacle: number = futurePosition.distanceTo(obstaclePosition);
            const distanceToObstacle2: number = this.position.distanceTo(obstaclePosition);
            
            if (distanceToObstacle < obstacleRadius) {
                const avoidDirection: Vector2 = futurePosition.subtract(obstaclePosition).normalized();
                const avoidStrength: number = (obstacleRadius - distanceToObstacle) / obstacleRadius;
                const avoidanceForce: Vector2 = avoidDirection.multiplyS(avoidStrength * this.avoidCoefficient);

                this.acceleration = this.acceleration.add(avoidanceForce);
            }
            else if (distanceToObstacle2 < obstacleRadius) {
                const avoidDirection: Vector2 = this.position.subtract(obstaclePosition).normalized();
                const avoidStrength: number = (obstacleRadius - distanceToObstacle2) / obstacleRadius;
                const avoidanceForce: Vector2 = avoidDirection.multiplyS(avoidStrength * this.avoidCoefficient);

                this.acceleration = this.acceleration.add(avoidanceForce);
            }
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
        this.avoidCoefficient = settings.getAvoidRepulsionStrength();

        this.separateCoefficent = settings.getSeparateCoefficient();
        this.alignCoefficient = settings.getAlignCoefficient();
        this.cohereCoefficient = settings.getCohereCoefficient();
    }

    public update(deltaTime: number, flock: Boid[], obstacles: Obstacle[], maxSpeed: number, maxForce: number, canvasWidth: number, canvasHeight: number): void {
        // normalizing these speeds to 60 FPS
        const adjustedMaxSpeed: number = maxSpeed * deltaTime * 60.0;
        const adjustedMaxForce: number = maxForce * deltaTime * 60.0;
        
        this.acceleration = Vector2.Zero;

        this.align(adjustedMaxSpeed, adjustedMaxForce, flock);
        this.separate(adjustedMaxSpeed, adjustedMaxForce, flock);
        this.cohere(adjustedMaxSpeed, adjustedMaxForce, flock);
        this.avoidObstacles(obstacles);
        
        this.wrapAroundCanvas(canvasWidth, canvasHeight);

        this.position = this.position.add(this.velocity.multiplyS(deltaTime * 60.0));
        this.velocity = this.velocity.add(this.acceleration.multiplyS(deltaTime * 60.0))
        this.velocity.limitMagnitude(adjustedMaxSpeed);
    }

    public render(flock: Flock, canvasCtx: CanvasRenderingContext2D, scaleFactor: number): void {
        let directionVector: Vector2 = this.velocity.normalized().multiplyS(flock.getBoidSize() * scaleFactor);
        let invVector1: Vector2 = new Vector2(-directionVector.y, directionVector.x);
        let invVector2: Vector2 = new Vector2(directionVector.y, -directionVector.x);
        invVector1 = invVector1.divideS((flock.getBoidSize()) / (3.0));
        invVector2 = invVector2.divideS((flock.getBoidSize()) / (3.0));

        canvasCtx.beginPath();

        canvasCtx.moveTo(this.position.x, this.position.y);

        canvasCtx.lineTo(this.position.x + invVector1.x, this.position.y + invVector1.y);
        canvasCtx.lineTo(this.position.x + directionVector.x, this.position.y + directionVector.y);
        canvasCtx.lineTo(this.position.x + invVector2.x, this.position.y + invVector2.y);

        canvasCtx.lineTo(this.position.x, this.position.y);

        canvasCtx.lineWidth = flock.getBoidLineWidth() * scaleFactor;
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