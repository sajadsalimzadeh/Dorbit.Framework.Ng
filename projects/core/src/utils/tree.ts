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
}
