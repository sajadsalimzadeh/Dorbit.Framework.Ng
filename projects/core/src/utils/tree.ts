
interface TreeIterateOptions<T> {
  prevAction?: (item: T) => void;
  postAction?: (item: T) => void;
}

export class TreeUtil {
  static iterate<T extends {children?: T[]} = any>(items: T[], options: TreeIterateOptions<T>) {

    items?.forEach(x => {
      if(options.prevAction) {
        options.prevAction(x);
      }
      this.iterate(x.children, options);
      if(options.postAction) {
        options.postAction(x);
      }
    })
  }
}
