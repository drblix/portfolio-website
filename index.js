import { Boid } from "./boid_simulation/boid.js";
const canvas = document.getElementById("boids-canvas");
const canvasCtx = canvas.getContext("2d");
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.outerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);
const boids = [];
for (let i = 0; i < 200; i++) {
    // good values ive found
    // 40, 13
    // 60, 20
    const newBoid = new Boid(canvas.width * Math.random(), canvas.height * Math.random(), 60.0, 19.0);
    boids.push(newBoid);
}
function animate() {
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    for (const boid of boids) {
        boid.update(boids, canvas.width, canvas.height);
        boid.render(canvasCtx);
    }
    requestAnimationFrame(animate);
}
animate();
