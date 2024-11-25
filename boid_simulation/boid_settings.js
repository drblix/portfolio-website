export class BoidSettings {
    constructor(visibleRadius = 60.0, protectedRadius = 20.0, mouseAvoidRadius = 160.0, avoidRepulsionStrength = 0.275, separateCoefficient = 1.0, alignCoefficient = 0.5, cohereCoefficient = 0.1) {
        this.visibleRadius = 0.0;
        this.protectedRadius = 0.0;
        this.mouseAvoidRadius = 0.0;
        this.avoidRepulsionStrength = 0.0;
        this.separateCoefficent = 0.0;
        this.alignCoefficient = 0.0;
        this.cohereCoefficient = 0.0;
        this.visibleRadius = visibleRadius;
        this.protectedRadius = protectedRadius;
        this.mouseAvoidRadius = mouseAvoidRadius;
        this.avoidRepulsionStrength = avoidRepulsionStrength;
        this.separateCoefficent = separateCoefficient;
        this.alignCoefficient = alignCoefficient;
        this.cohereCoefficient = cohereCoefficient;
    }
    getVisibleRadius() {
        return this.visibleRadius;
    }
    getProtectedRadius() {
        return this.protectedRadius;
    }
    getMouseAvoidRadius() {
        return this.mouseAvoidRadius;
    }
    getAvoidRepulsionStrength() {
        return this.avoidRepulsionStrength;
    }
    getSeparateCoefficient() {
        return this.separateCoefficent;
    }
    getAlignCoefficient() {
        return this.alignCoefficient;
    }
    getCohereCoefficient() {
        return this.cohereCoefficient;
    }
}
