export class NumberUtil {
  static round(n: number, decimal: number = 0) {
    const coefficient = Math.pow(10, decimal);
    return Math.round(n * coefficient) / coefficient;
  }
}
