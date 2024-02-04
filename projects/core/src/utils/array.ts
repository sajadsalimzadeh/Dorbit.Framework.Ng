export {};

declare global {
  interface Array<T> {
    distinct(): T[];

    toggle(value: any): T[];
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
