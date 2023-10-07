export class ObjectUtility {

  static deleteUndefinedProperty(obj: any): any {
    const result: any = {};
    for (const key in obj) {
      const value = obj[key];
      if (typeof value !== 'undefined') result[key] = value;
    }
    return result;
  }
}
