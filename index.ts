import { Boid } from "./boid_simulation/boid.js";
import { BoidSettings } from "./boid_simulation/boid_settings.js";
import { Flock } from "./boid_simulation/flock.js";
import { Obstacle } from "./boid_simulation/obstacle.js";
import { Vector2 } from "./boid_simulation/vector2.js";

const canvas: HTMLCanvasElement = document.getElementById("boids-canvas") as HTMLCanvasElement
const canvasCtx: CanvasRenderingContext2D = canvas.getContext("2d") as CanvasRenderingContext2D;

let mousePosition: Vector2 = Vector2.Zero;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.outerHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);


const flock: Flock = new Flock();
const defaultBoidSettings: BoidSettings = new BoidSettings(60.0, 20.0, 0.175, 0.8, 0.25, 0.25);

for (let i = 0; i < 225; i++) {
    flock.addBoid(new Boid(canvas.width * Math.random(), canvas.height * Math.random(), defaultBoidSettings));
}

const mouseObstacle: Obstacle = new Obstacle(mousePosition, 225.0);
flock.addObstacle(mouseObstacle);

canvas.addEventListener("mousemove", (event: MouseEvent) => {
    const rect: DOMRect = canvas.getBoundingClientRect();
    mousePosition = new Vector2(event.clientX - rect.left, event.clientY - rect.top);
    
    mouseObstacle.setPosition(mousePosition);
});

function animate() {
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    flock.update(canvas.width, canvas.height);
    flock.render(canvasCtx);

    requestAnimationFrame(animate);
}

animate();