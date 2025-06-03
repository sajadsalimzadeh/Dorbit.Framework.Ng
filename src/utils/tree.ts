type TreeIterateAction<T> = (item: T, parent?: T) => void;

export class TreeUtil {
    static iterate<T extends { children?: T[] } = any>(items: T[], beforeChildren?: TreeIterateAction<T>, afterChildren?: TreeIterateAction<T>, parent?: T) {

        items?.forEach(x => {
            if (beforeChildren) {
                beforeChildren(x, parent);
            }
            if (x.children) this.iterate(x.children, beforeChildren, afterChildren, x);
            if (afterChildren) {
                afterChildren(x, parent);
            }
        })
    }

    static getByPath<T extends { children?: T[] } = any>(items: T[], path: string, keyField: string = 'id') {
        const keys = path.split('/').filter(x => !!x);
        const result: T[] = [];
        for (const key of keys) {
            const item = items.find(item => (item as any)[keyField] === key);
            if (!item) break;
            result.push(item)
            items = item.children ?? [];
        }
        return result;
    }

    static filterByPath<T extends { children?: T[] } = any>(items: T[], path: string, keyField: string = 'id') {
        const keys = path.split('/').filter(x => !!x);
        for (const key of keys) {
            items = items.find(item => (item as any)[keyField] === key)?.children ?? [];
        }
        return items;
    }

    static find<T extends { children?: T[] } = any>(items: T[], predict: (item: T) => boolean, parents: T[] = [], keyField: string = 'id') {
        for (let item of items) {
            if (predict(item)) {
                parents.push(item);
                return parents;
            }
            if (item.children) {
                const result = this.find(item.children, predict, parents);
                if (result) {
                    parents.unshift(item);
                    return parents;
                }
            }
        }
        return undefined;
    }
}
