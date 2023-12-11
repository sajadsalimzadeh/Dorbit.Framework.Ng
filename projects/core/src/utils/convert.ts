export class ConvertUtil {

  static convertVersionToNumber(version: string, sectionValue = 100) {
    let value = 1;
    let result = 0;
    const sections = version.split('.')
    sections.forEach(x => {
      result += result * value + (+x);
      value *= sectionValue;
    })
    return result;
  }
}
