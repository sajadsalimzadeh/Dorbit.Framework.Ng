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

    static getOptions(type: any) {
        return this.getKeyValues(type).map(x => ({value: x.key, text: x.value}));
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

    static getName(type: any, value: any) {
        return this.getOptions(type).find(x => x.value == value)?.text;
    }
}
