interface Context {
  instance: any;
  method: string;
  args: any[];
  result?: any;
  error?: any;
}

interface AspectOptions {
  condition?: (methodName: string) => boolean;
  before?: (ctx: Context) => Promise<void>;
  after?: (ctx: Context) => Promise<void>;
  exception?: (ctx: Context) => Promise<void>;
  methods?: string[]
}

export class AspectUtil {
  private static getAllMethods(obj: any) {
    const props = [];
    let tmp = obj;
    do {
      props.push(...Object.getOwnPropertyNames(tmp));
    } while (tmp = Object.getPrototypeOf(tmp));

    return props.sort().filter((e: string, i: number, arr: string[]) => {
      return (e != arr[i + 1] && typeof obj[e] == 'function');
    });
  }

  static aspect(obj: any, options: AspectOptions) {
    const methods = AspectUtil.getAllMethods(obj);
    for (let i = 0; i < methods.length; i++) {
      const methodName = methods[i];
      if (methodName.startsWith('__')) continue;
      if (options.condition && !options.condition(methodName)) continue;
      if (options.methods && !options.methods.includes(methodName)) continue;
      const originalValue = obj[methodName];
      if (typeof originalValue === 'function') {
        obj[methodName] = async (...args: any[]) => {
          const ctx: Context = {
            instance: obj,
            method: methodName,
            args: args,
          };
          try {
            if (options.before) await options.before(ctx);
            if (!ctx.result) ctx.result = await originalValue.apply(obj, args);
            if (options.after) await options.after(ctx);
            return ctx.result;
          } catch (e) {
            ctx.error = e;
            if (options.exception) await options.exception(ctx);
            throw e;
          }
        }
      }
    }
    return obj;
  }
}
