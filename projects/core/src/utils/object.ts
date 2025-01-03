export class ObjectUtil {

  static equals(obj1: any, obj2: any) {

    for (const key in obj1) {
      const value1 = obj1[key];
      const value2 = obj2[key];
      if(value1 != value2) return false;
    }

    return true;
  }

  static assignNotNull(destination: any, source: any) {
    for (const destinationKey in destination) {
      const value = source[destinationKey];
      if(value != null) {
        destination[destinationKey] = value;
      }
    }
  }

  static getObjectWithoutUndefinedProperty(obj: any): any {
    const result: any = {};
    for (const key in obj) {
      const value = obj[key];
      if (typeof value !== 'undefined') result[key] = value;
    }
    return result;
  }

  static getObjectWithoutNullProperty(obj: any): any {
    const result: any = {};
    for (const key in obj) {
      const value = obj[key];
      if (value !== null) result[key] = value;
    }
    return result;
  }

  static getObjectWithFalseResultProperty(obj: any) {
    const result: any = {};
    for (const key in obj) {
      const value = obj[key];
      if (value) result[key] = value;
    }
    return result;
  }
}
