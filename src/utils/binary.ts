export class BinaryUtil {
    static and(...params: any[]) {
        let result = params[0];
        for (let i = 1; i < params.length; i++) {
            result = result & params[i];
        }
        return result;
    }
}
