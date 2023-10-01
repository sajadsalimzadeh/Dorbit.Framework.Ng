import {Type} from "@angular/core";

export class DorbitConfig {
  private static configs: { [key: string]: any } = {};

  static setConfig<T = any>(type: Type<T>, options: T | {}) {
    this.configs[type.name] = options;
    return this;
  }

  static getConfig<T = any>(type: Type<T>): T {
    return this.configs[type.name] ?? {};
  }
}
