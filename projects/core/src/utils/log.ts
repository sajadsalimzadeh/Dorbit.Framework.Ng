import {StoreDb} from "../stores";
import {md5} from "./md5";

export enum LogLevel {
  TRACE = 1,
  DEBUG = 2,
  INFO = 3,
  WARNING = 4,
  ERROR = 5
}

export interface LogRecord {
  timestamp?: number;
  name: string;
  flags: any;
  level: LogLevel;
  message: string;
  data: any;
}

const logStore = new StoreDb('log', 4, {
  logs: {key: 'timestamp', keyGenerator: () => new Date().getTime()},
});

export const loggerConfigs = {
  lifetime: 30 * 24 * 60 * 60 * 1000,
}

interface Settings {
  level: LogLevel;
  console?: boolean;
  data?: any;
}

interface Options {
  encryptor?: LogEncryptor;
  data?: any;
  console?: boolean;
  force?: boolean;
  padding?: {
    with?: string,
    count?: number,
    dir?: 'left' | 'right' | 'left-and-right'
  };
}

export interface LogEncryptor {
  encrypt: (text: string) => string;
}

export class Logger {

  private logTimeMessages: { [key: string]: number } = {};
  private name = 'root';

  enable: boolean = true;

  settings: Settings = {level: LogLevel.INFO}
  defaultOptions?: Options;
  defaultData?: any;

  private async log(message: string, level: LogLevel, options?: Options) {
    options ??= {};
    try {
      if (!this.enable) return;
      if (this.defaultOptions) options = {...this.defaultOptions, ...options};
      if (!options.force && level < this.settings.level) return;

      if (options.padding) {
        options.padding.with ??= '-';
        options.padding.count ??= 10;
        options.padding.dir ??= 'left-and-right';
        const pad = options.padding.with.repeat(options.padding.count);
        if (options.padding.dir.includes('left')) message = pad + message;
        if (options.padding.dir.includes('right')) message = message + pad;
      }

      //show in console for debugging
      if (options?.console || this.settings.console) {
        if (level == LogLevel.TRACE) console.log(message, options.data ?? []);
        else if (level == LogLevel.DEBUG) console.log(message, options.data ?? []);
        else if (level == LogLevel.INFO) console.log(message, options.data ?? []);
        else if (level == LogLevel.WARNING) console.warn(message, options.data ?? []);
        else if (level == LogLevel.ERROR) console.error(message, options.data ?? []);
      }

      //encrypt message if has encryptor
      if (options.encryptor) {
        message = options.encryptor.encrypt(message);
      }

      const log = {
        name: this.name,
        level: level,
        message: message?.toString(),
        data: {...this.defaultData, ...options.data},
      } as LogRecord;

      //formatter error logs
      if (log.data instanceof Error) {
        log.data = {
          name: log.data.name,
          message: log.data.message,
          stack: log.data.stack,
        };
        console.error(log.data)
      }

      //prevent multiple same log insert
      if (log.message) {
        const logKey = md5(log.message);
        if (this.logTimeMessages[logKey] > new Date().getTime() - 200) return;
        this.logTimeMessages[logKey] = new Date().getTime();
      }

      //prevent insert empty message log
      if (log.message) await logStore.getTable('logs').add(log);
    } catch (e) {
      console.error(e)
    }
  }

  getTable() {
    return logStore.getTable('logs');
  }

  debug(message: string, options?: Options) {
    return this.log(message, LogLevel.DEBUG, options);
  }

  trace(message: string, options?: Options) {
    return this.log(message, LogLevel.TRACE, options);
  }

  info(message: string, options?: Options) {
    return this.log(message, LogLevel.INFO, options);
  }

  warn(message: string, options?: Options) {
    this.log(message, LogLevel.WARNING, options);
  }

  error(message: string, options?: Options) {
    return this.log(message, LogLevel.ERROR, options);
  }

  clone(name: string) {
    const logger = new Logger();
    logger.settings = {...this.settings};
    logger.name = name;
    return logger;
  }
}

export const logger = new Logger();

setInterval(async () => {
  const lifetime = new Date().getTime() - loggerConfigs.lifetime;
  const keys = await logStore.getTable('logs').findAllKey(t => t < lifetime, 1000);
  keys.forEach(x => logStore.getTable('logs').delete(x));
}, 10000);
