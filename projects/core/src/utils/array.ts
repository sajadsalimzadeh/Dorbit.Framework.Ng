export {};

declare global {
  interface Array<T> {
    distinct(): T[];

    toggle(value: any): T[];

    groupBy(func: (x: T) => string): { key: string, value: T[] }[];

    any(func: (x: T) => boolean): boolean;
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
  const groups: { key: string, value: any[] }[] = [];
  this.forEach(item => {
    const key = func(item);
    let group = groups.find(x => x.key == key);
    if (!group) {
      groups.push({key: key, value: []});
      group = groups[groups.length - 1];
    }
    group.value.push(item);
  });
  return groups;
}


Array.prototype.any = function (func: (x: any) => boolean) {
  return this.findIndex(func) > -1;
}
