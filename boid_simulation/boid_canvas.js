import { Boid } from "./boid.js";
import { BoidSettings } from "./boid_settings.js";
import { Flock } from "./flock.js";
import { Obstacle } from "./obstacle.js";
import { Vector2 } from "./vector2.js";
const canvas = document.getElementById("boids-canvas");
const canvasCtx = canvas.getContext("2d");
let mousePosition = Vector2.Zero;
const flock = new Flock(3.0 * 5, 0.075 * 5, 10.0);
const defaultBoidSettings = new BoidSettings(60.0, 20.0, 0.4, 0.8, 0.4, 0.45);
for (let i = 0; i < 225; i++) {
    flock.addBoid(new Boid(canvas.width * Math.random(), canvas.height * Math.random(), defaultBoidSettings));
}
const mouseObstacle = new Obstacle(mousePosition, 200.0);
flock.addObstacle(mouseObstacle);
document.addEventListener("mousemove", (event) => {
    const rect = canvas.getBoundingClientRect();
    mousePosition = new Vector2(event.clientX - rect.left, event.clientY - rect.top);
    mouseObstacle.setPosition(mousePosition);
});
window.addEventListener("resize", () => {
    canvas.width = document.documentElement.scrollWidth;
    canvas.height = document.documentElement.scrollHeight;
});
canvas.width = document.documentElement.scrollWidth;
canvas.height = document.documentElement.scrollHeight;
let lastTime = performance.now();
function animate() {
    const currentTime = performance.now();
    const deltaTime = (currentTime - lastTime) / 1000.0;
    lastTime = currentTime;
    canvas.width = document.documentElement.scrollWidth;
    canvas.height = document.documentElement.scrollHeight;
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    flock.update(canvas.width, canvas.height, deltaTime);
    flock.updateScaleFactor(canvas.width, canvas.height);
    flock.render(canvasCtx);
    requestAnimationFrame(animate);
}
animate();
