export class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    /**
     * Returns the sum of this vector with another vector
     */
    add(other) {
        return new Vector2(this.x + other.x, this.y + other.y);
    }
    /**
     * Returns the difference of this vector with another vector
     */
    subtract(other) {
        return new Vector2(this.x - other.x, this.y - other.y);
    }
    /**
     * Returns the product of this vector with another vector
     */
    multiplyV(other) {
        return new Vector2(this.x * other.x, this.y * other.y);
    }
    /**
     * Returns the product of this vector with a scalar
     */
    multiplyS(scalar) {
        return new Vector2(this.x * scalar, this.y * scalar);
    }
    /**
     * Returns the quotient of this vector with another vector
     */
    divideV(other) {
        return new Vector2(this.x / other.x, this.y / other.y);
    }
    /**
     * Returns the quotient of this vector with a scalar
     */
    divideS(scalar) {
        return new Vector2(this.x / scalar, this.y / scalar);
    }
    setMagnitude(scalar) {
        const newVector = this.normalized().multiplyS(scalar);
        this.x = newVector.x;
        this.y = newVector.y;
    }
    limitMagnitude(scalar) {
        const magnitude = this.magnitude();
        if (magnitude > scalar) {
            this.setMagnitude(scalar);
        }
    }
    /**
     * Calculates the length of this vector
     */
    magnitude() {
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    }
    /**
     * Returns the distance from this vector to the other vector
     */
    distanceTo(other) {
        return other.subtract(this).magnitude();
    }
    /**
     * Returns this vector so that the direction is preserved, but the magnitude is equal to 1.0
     */
    normalized() {
        let magnitude = this.magnitude();
        if (magnitude != 0.0) {
            return this.divideS(magnitude);
        }
        else {
            return Vector2.Zero;
        }
    }
}
Vector2.One = new Vector2(1.0, 1.0);
Vector2.Zero = new Vector2(0.0, 0.0);
