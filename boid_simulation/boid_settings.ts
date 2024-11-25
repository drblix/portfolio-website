export class BoidSettings {
    private readonly visibleRadius: number = 0.0;
    private readonly protectedRadius: number = 0.0;
    private readonly mouseAvoidRadius: number = 0.0;
    private readonly avoidRepulsionStrength: number = 0.0;

    private readonly separateCoefficent: number = 0.0;
    private readonly alignCoefficient: number = 0.0;
    private readonly cohereCoefficient: number = 0.0;

    constructor(
        visibleRadius: number = 60.0, 
        protectedRadius: number = 20.0, 
        mouseAvoidRadius: number = 160.0, 
        avoidRepulsionStrength: number = 0.275, 
        separateCoefficient: number = 1.0,
        alignCoefficient: number = 0.5,
        cohereCoefficient: number = 0.1,
    ) {
        this.visibleRadius = visibleRadius;
        this.protectedRadius = protectedRadius;
        this.mouseAvoidRadius = mouseAvoidRadius;
        this.avoidRepulsionStrength = avoidRepulsionStrength;
        this.separateCoefficent = separateCoefficient;
        this.alignCoefficient = alignCoefficient;
        this.cohereCoefficient = cohereCoefficient;
    }

    public getVisibleRadius(): number {
        return this.visibleRadius;
    }
    
    public getProtectedRadius(): number {
        return this.protectedRadius;
    }

    public getMouseAvoidRadius(): number {
        return this.mouseAvoidRadius;
    }

    public getAvoidRepulsionStrength(): number {
        return this.avoidRepulsionStrength;
    }

    public getSeparateCoefficient(): number {
        return this.separateCoefficent;
    }

    public getAlignCoefficient(): number {
        return this.alignCoefficient;
    }

    public getCohereCoefficient(): number {
        return this.cohereCoefficient;
    }
}