export class Base32Util {

    static generate(bytes: Uint8Array) {
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

        let bits = 0;
        let value = 0;
        let output = "";

        for (let i = 0; i < bytes.length; i++) {
            value = (value << 8) | bytes[i];
            bits += 8;

            while (bits >= 5) {
                output += alphabet[(value >>> (bits - 5)) & 31];
                bits -= 5;
            }
        }

        if (bits > 0) {
            output += alphabet[(value << (5 - bits)) & 31];
        }

        return output;
    }
    
    static generateRandom(length: number) {
        const bytes = new Uint8Array(length);
        crypto.getRandomValues(bytes);
        return this.generate(bytes);
    }
}