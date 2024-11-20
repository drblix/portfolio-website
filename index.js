import { Boid } from "./boid_simulation/boid.js";
import { Flock } from "./boid_simulation/flock.js";
const canvas = document.getElementById("boids-canvas");
const canvasCtx = canvas.getContext("2d");
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.outerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);
// init boids
const flock = new Flock(1.50, 0.5, 1.0);
for (let i = 0; i < 100; i++) {
    const boid = new Boid(Math.random() * canvas.width, Math.random() * canvas.height, 1.5, 0.025, 50.0);
    flock.addBoid(boid);
}
function animate() {
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    flock.update();
    flock.render(canvasCtx);
    requestAnimationFrame(animate);
}
animate();
