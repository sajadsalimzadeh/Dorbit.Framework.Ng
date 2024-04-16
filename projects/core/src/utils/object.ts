export class ObjectUtil {

  static assignNotNull(destination: any, source: any) {
    for (const sourceKey in source) {
      const value = source[sourceKey];
      if(value != null) {
        destination[sourceKey] = value;
      }
    }
  }

  static deleteUndefinedProperty(obj: any): any {
    const result: any = {};
    for (const key in obj) {
      const value = obj[key];
      if (typeof value !== 'undefined') result[key] = value;
    }
    return result;
  }
}
