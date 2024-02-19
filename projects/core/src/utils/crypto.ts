export class CryptoUtil {
  static hashCode(input: string) {
    let hashCode = 0;
    for (let i = 0; i < input.length; i++) {
      hashCode += input.charCodeAt(i);
    }
    return hashCode;
  }
}
