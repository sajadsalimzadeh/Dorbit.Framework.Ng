export class Uint8ArrayUtil {
  static checkSum(buffer: Uint8Array) {
    let checkSum = 0;
    for (let i = 0; i < buffer.length; i++) {
      checkSum += buffer[i];
    }
    return checkSum;
  }
}
