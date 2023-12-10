
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
}
