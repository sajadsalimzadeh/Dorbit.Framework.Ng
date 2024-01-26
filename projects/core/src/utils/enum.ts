
export class EnumUtil {
  static getOptions(type: any) {
    const keys = Object.keys(type);
    const result: {value: any, text: string}[] = [];
    const half = keys.length/2;
    for (let i = 0; i < half; i++) {
      result.push({
        value: +keys[i],
        text: keys[half + i],
      });
    }
    return result;
  }

  static getNames(type: any) {
    const keys = Object.keys(type);
    const result: string[] = [];
    const half = keys.length/2;
    for (let i = 0; i < half; i++) {
      result.push(keys[half + i]);
    }
    return result;
  }

  static getName(type: any, value: any) {
    return this.getOptions(type).find(x => x.value == value)?.text;
  }
}
