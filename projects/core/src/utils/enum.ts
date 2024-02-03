export class EnumUtil {
  static getOptions(type: any) {
    const values = Object.values(type).filter(x => Number.isInteger(x)).map((x: any) => +x);
    const result: { value: any, text: string }[] = [];
    for (let i = 0; i < values.length; i++) {
      result.push({
        value: values[i],
        text: type[values[i]],
      });
    }
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

  static getName(type: any, value: any) {
    return this.getOptions(type).find(x => x.value == value)?.text;
  }
}
