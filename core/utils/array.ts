export {};

declare global {
    interface Array<T> {
        distinct(): T[];

        distinctBy(func: (x: T) => any): T[];

        toggle(value: any): T[];

        groupBy(func: (x: T) => any): { key: string, value: T[] }[];

        remove(x: T): boolean;

        last(func?: (x: T) => boolean): T;

        any(func: (x: T) => boolean): boolean;

        sum(func: (x: T) => number): number;

        average(func: (x: T) => number): number;

        sortBy(func: (x: T) => any): T[];

        sortByDescending(func: (x: T) => any): T[];

        clear(): void;

        selectMany<TR>(func?: (x: T) => TR[]): TR[];
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

Array.prototype.distinctBy = function (func: (x: any) => any) {
    const items: any[] = [];
    for (const item of this) {
        const value = func(item);
        if (!items.find(x => func(x) == value)) {
            items.push(item);
        }
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

Array.prototype.remove = function (x: any) {
    const index = this.indexOf(x);
    if (index > -1) this.splice(index, 1);
    return index > -1;
}

Array.prototype.last = function (func?: (x: any) => boolean) {
    const items = (func ? this.filter(func) : this);
    return items.length > 0 ? items[items.length - 1] : null;
}

Array.prototype.any = function (func: (x: any) => boolean) {
    return this.some(func);
}

Array.prototype.sum = function (func: (x: any) => number) {
    let sum = 0;
    for (let i = 0; i < this.length; i++) {
        sum += func(this[i]);
    }
    return sum;
}

Array.prototype.average = function (func: (x: any) => number) {
    return this.sum(func) / this.length;
}

Array.prototype.sortBy = function (func: (x: any) => any) {
    return this.sort((x1, x2) => {
        const v1 = func(x1);
        const v2 = func(x2);
        return v1 > v2 ? 1 : (v2 > v1 ? -1 : 0);
    });
}

Array.prototype.sortByDescending = function (func: (x: any) => any) {
    return this.sort((x1, x2) => {
        const v1 = func(x1);
        const v2 = func(x2);
        return v1 > v2 ? -1 : (v2 > v1 ? 1 : 0);
    });
}

Array.prototype.clear = function () {
    this.splice(0, this.length);
}

Array.prototype.selectMany = function (func: (x: any) => any[]) {
    const result: any[] = [];
    for (const item of this) {
        result.push(...func(item));
    }
    return result;
}
