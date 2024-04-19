export class ObjectUtil {

  static assignNotNull(destination: any, source: any) {
    for (const destinationKey in destination) {
      const value = source[destinationKey];
      if(value != null) {
        destination[destinationKey] = value;
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
