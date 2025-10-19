export class Uint8ArrayUtil {
    static checkSum(buffer: Uint8Array) {
        let checkSum = 0;
        for (let i = 0; i < buffer.length; i++) {
            checkSum += buffer[i];
        }
        return checkSum;
    }

    static fromString(value: string) {
        const encoder = new TextEncoder();
        return encoder.encode(value);
    }

    static concat(buffer: Uint8Array, values: number[]) {
        const result = new Uint8Array(buffer.length + values.length);
        result.set(buffer, 0);
        result.set(values, buffer.length);
        return result;
    }
}
