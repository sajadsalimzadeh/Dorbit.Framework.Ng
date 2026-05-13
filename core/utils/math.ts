export class MathUtil {
    static round(n: number, precision: number = 0) {
        const coefficient = Math.pow(10, precision);
        return Math.round(n / coefficient) * coefficient;
    }
}