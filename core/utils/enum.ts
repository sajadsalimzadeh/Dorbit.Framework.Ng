export class EnumUtil {
    static getKeyValues(type: any) {
        const values = Object.values(type).filter(x => Number.isInteger(x)).map((x: any) => +x);
        const result: { key: any, value: string }[] = [];
        for (let i = 0; i < values.length; i++) {
            result.push({
                key: values[i],
                value: type[values[i]],
            });
        }
        return result;
    }

    static getObject<T>(type: T) {
        const result: any = {};
        this.getKeyValues(type).forEach(x => {
            result[x.key] = x.value;
        });
        return result;
    }

    static getNames(type: any) {
        const keys = Object.keys(type);
        const result: string[] = [];
        const half = keys.length / 2;
        for (let i = 0; i < half; i++) {
            result.push(keys[half + i]);
        }
        return result;
    }

    static getName(type: any, key: any) {
        return this.getKeyValues(type).find(x => x.key == key)?.value;
    }
}
