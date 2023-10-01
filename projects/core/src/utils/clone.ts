export function clone(obj: any, level: number = 6) {
  if (level < 0) return null;

  if (!obj || typeof obj !== 'object') {
    return obj;
  }


  if (Array.isArray(obj)) {
    return cloneArray(obj, level - 1);
  }

  return cloneObject(obj, level - 1);
}

export function cloneArray(arr: any[], level: number) {
  const res = new Array(arr.length);
  for (let i = 0; i < arr.length; i++) {
    res[i] = clone(arr[i], level);
  }
  return res;
}

export function cloneObject(obj: any, level: number) {
  const res: any = {};
  for (const key in obj) {
    res[key] = clone(obj[key], level);
  }
  return res;
}
