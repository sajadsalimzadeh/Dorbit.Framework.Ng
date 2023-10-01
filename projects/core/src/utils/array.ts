export {};

declare global {
  interface Array<T> {
    distinct(): T[];
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
