interface TreeIterateOptions<T> {
    prevAction?: (item: T, parent?: T) => void;
    postAction?: (item: T, parent?: T) => void;
}

export class TreeUtil {
    static iterate<T extends { children?: T[] } = any>(items: T[], options: TreeIterateOptions<T>, parent?: T) {

        items?.forEach(x => {
            if (options.prevAction) {
                options.prevAction(x, parent);
            }
            if (x.children) this.iterate(x.children, options, x);
            if (options.postAction) {
                options.postAction(x, parent);
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
}
