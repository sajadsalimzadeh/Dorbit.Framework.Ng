import {IndexedDB} from "./indexed-db";
import {ITable} from "./database";

export enum LogLevel {
  TRACE = 0,
  DEBUG = 1,
  INFO = 2,
  WARNING = 3,
  ERROR = 4
}

export interface LogRecord {
  timestamp?: number;
  name: string;
  flags: any;
  level: LogLevel;
  message: string;
  data: any;
}

const logStore = new IndexedDB({name: 'log', version: 1});
let persistLogs: ITable<LogRecord, number>;
logStore.create('logs', {key: 'timestamp', keyGenerator: () => new Date().getTime()});
logStore.open().then(() => {
  persistLogs = logStore.table<LogRecord>('logs');
});

export const loggerConfigs = {
  level: LogLevel.TRACE,
  lifetime: 30 * 24 * 60 * 60 * 1000,
}

interface Options {
  channel?: boolean;
  encryptor?: LogEncryptor;
  data?: any;
  console?: boolean;
}

export interface LogEncryptor {
  encrypt: (text: string) => string;
}

export class Logger {

  options: Options = {};
  name = 'root';
  enable: boolean = true;

  private log(message: string, level: LogLevel, options: Options) {
    try {
      if (!this.enable) return;
      if (level < loggerConfigs.level) return;
      if (options?.console) {
        if (level == LogLevel.TRACE) console.log(message, options.data ?? []);
        else if (level == LogLevel.DEBUG) console.log(message, options.data ?? []);
        else if (level == LogLevel.INFO) console.log(message, options.data ?? []);
        else if (level == LogLevel.WARNING) console.warn(message, options.data ?? []);
        else if (level == LogLevel.ERROR) console.error(message, options.data ?? []);
      }
      const flags = {...this.options, ...options};
      if (options.encryptor) {
        message = options.encryptor.encrypt(message);
      }
      const log = {
        name: this.name,
        level: level,
        message: message,
        data: options.data,
      } as LogRecord;
      if (log.data instanceof Error) {
        log.data = {
          name: log.data.name,
          message: log.data.message,
          stack: log.data.stack,
        };
        console.log('error', log)
      }

      persistLogs?.add(log);
    } catch (e) {
      console.error(e)
    }
  }

  getTable() {
    return persistLogs;
  }

  debug(message: string, data?: any, options?: Options) {
    this.log(message, LogLevel.DEBUG, {
      ...options,
      data: data,
    });
  }

  trace(message: string, data?: any, options?: Options) {
    this.log(message, LogLevel.TRACE, {
      ...options,
      data: data,
    });
  }

  info(message: string, data?: any, options?: Options) {
    this.log(message, LogLevel.INFO, {
      ...options,
      data: data,
    });
  }

  warn(message: string, data?: any, options?: Options) {
    this.log(message, LogLevel.WARNING, {
      ...options,
      data: data,
    });
  }

  error(message: string, data?: any, options?: Options) {
    this.log(message, LogLevel.ERROR, {
      ...options,
      data: data,
    });
  }

  clone(name: string) {
    const logger = new Logger();
    logger.name = name;
    return logger;
  }
}

export const logger = new Logger();

setInterval(async () => {
  const lifetime = new Date().getTime() - loggerConfigs.lifetime;
  const keys = await persistLogs.findAllKey(t => t < lifetime, 1000);
  keys.forEach(x => persistLogs.delete(x));
}, 10000);
