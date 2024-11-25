import { Boid } from "./boid_simulation/boid.js";
import { BoidSettings } from "./boid_simulation/boid_settings.js";
import { Flock } from "./boid_simulation/flock.js";
import { Vector2 } from "./boid_simulation/vector2.js";
const canvas = document.getElementById("boids-canvas");
const canvasCtx = canvas.getContext("2d");
let mousePosition = Vector2.Zero;
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.outerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);
canvas.addEventListener("mousemove", (event) => {
    const rect = canvas.getBoundingClientRect();
    mousePosition = new Vector2(event.clientX - rect.left, event.clientY - rect.top);
});
const flock = new Flock();
const defaultBoidSettings = new BoidSettings(60.0, 20.0, 160.0, 0.275, 0.8, 0.25, 0.25);
for (let i = 0; i < 150; i++) {
    flock.addBoid(new Boid(canvas.width * Math.random(), canvas.height * Math.random(), defaultBoidSettings));
}
function animate() {
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    flock.update(canvas.width, canvas.height, mousePosition);
    flock.render(canvasCtx);
    requestAnimationFrame(animate);
}
animate();
