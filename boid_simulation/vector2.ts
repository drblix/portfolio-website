export class Vector2 {
    public static One: Vector2 = new Vector2(1.0, 1.0);
    public static Zero: Vector2 = new Vector2(0.0, 0.0);

    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    /**
     * Returns the sum of this vector with another vector
     */
    public add(other: Vector2): Vector2 {
        return new Vector2(this.x + other.x, this.y + other.y);
    }

    /**
     * Returns the difference of this vector with another vector
     */
    public subtract(other: Vector2): Vector2 {
        return new Vector2(this.x - other.x, this.y - other.y);
    }

    /**
     * Returns the product of this vector with another vector
     */
    public multiplyV(other: Vector2): Vector2 {
        return new Vector2(this.x * other.x, this.y * other.y);
    }

    /**
     * Returns the product of this vector with a scalar
     */
    public multiplyS(scalar: number): Vector2 {
        return new Vector2(this.x * scalar, this.y * scalar);
    }

    /**
     * Returns the quotient of this vector with another vector
     */
    public divideV(other: Vector2): Vector2 {
        return new Vector2(this.x / other.x, this.y / other.y);
    }

    /**
     * Returns the quotient of this vector with a scalar
     */
    public divideS(scalar: number): Vector2 {
        return new Vector2(this.x / scalar, this.y / scalar);
    }

    public setMagnitude(scalar: number): void {
        const newVector = this.normalized().multiplyS(scalar);

        this.x = newVector.x;
        this.y = newVector.y;
    }

    public limitMagnitude(scalar: number): void {
        const magnitude: number = this.magnitude();

        if (magnitude > scalar) {
            this.setMagnitude(scalar);
        }
    }

    /**
     * Calculates the length of this vector
     */
    public magnitude(): number {
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    }

    /**
     * Returns the distance from this vector to the other vector
     */
    public distanceTo(other: Vector2): number {
        return other.subtract(this).magnitude();
    }

    /**
     * Returns this vector so that the direction is preserved, but the magnitude is equal to 1.0
     */
    public normalized(): Vector2 {
        let magnitude: number = this.magnitude();
        if (magnitude != 0.0) {
            return this.divideS(magnitude);
        }
        else {
            return Vector2.Zero;
        }
    }
}