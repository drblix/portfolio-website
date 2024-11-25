export class Flock {
    constructor(maxSpeed = 3.0, maxForce = 0.055, boidSize = 13.5, boidLineWidth = 4.0, strokeStyle = "black", fillStyle = "white") {
        this.maxSpeed = 0.0;
        this.maxForce = 0.0;
        this.boidSize = 13.5;
        this.boidLineWidth = 4.0;
        this.strokeStyle = "black";
        this.fillStyle = "white";
        this.boids = [];
        this.maxSpeed = maxSpeed;
        this.maxForce = maxForce;
        this.boidSize = boidSize;
        this.boidLineWidth = boidLineWidth;
        this.strokeStyle = strokeStyle;
        this.fillStyle = fillStyle;
    }
    addBoid(boid) {
        this.boids.push(boid);
    }
    removeBoid() {
        if (this.boids.length > 0) {
            this.boids.pop();
        }
    }
    clearBoids() {
        while (this.boids.pop() != undefined) {
            continue;
        }
    }
    update(canvasWidth, canvasHeight, mousePosition) {
        for (const boid of this.boids) {
            boid.update(this.boids, this.maxSpeed, this.maxForce, canvasWidth, canvasHeight, mousePosition);
        }
    }
    render(canvasCtx) {
        for (const boid of this.boids) {
            boid.render(this, canvasCtx);
        }
    }
    getMaxSpeed() {
        return this.maxSpeed;
    }
    getMaxForce() {
        return this.maxForce;
    }
    getBoidSize() {
        return this.boidSize;
    }
    getBoidLineWidth() {
        return this.boidLineWidth;
    }
    getStrokeStyle() {
        return this.strokeStyle;
    }
    getFillStyle() {
        return this.fillStyle;
    }
}
