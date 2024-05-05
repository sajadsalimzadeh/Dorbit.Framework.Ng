export {};

declare global {
  interface Array<T> {
    distinct(): T[];

    toggle(value: any): T[];

    groupBy(func: (x: T) => string): {[key: string]: T[]};
  }
}

Array.prototype.distinct = function () {
  let items: any[] = [];
  for (const x of this) {
    if (items.includes(x)) continue;
    items.push(x);
  }
  return items;
}

Array.prototype.toggle = function (value: any) {
  const index = this.indexOf(value);
  if (index > -1) this.splice(index, 1);
  else this.push(value)
  return this;
}

Array.prototype.groupBy = function (func: (x: any) => string) {
  const groups: {[key: string]: any[]} = {};
  this.forEach(item => {
    const key = func(item);
    if(!groups[key]) groups[key] = [];
    groups[key].push(item);
  });
  return groups;
}
