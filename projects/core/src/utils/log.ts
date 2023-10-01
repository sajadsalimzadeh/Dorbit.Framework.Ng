import {isDevMode} from "@angular/core";
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
  console: isDevMode(),
  lifetime: 30 * 24 * 60 * 60 * 1000,
}

interface Flags {
  channel?: boolean;
  inMemory?: boolean;
}

export class Logger {

  flags: Flags = {};
  name = 'root';
  enable: boolean = true;
  inMemoryLogs: LogRecord[] = [];

  private log(options: { message: string, data: any, level: LogLevel, flags?: Flags }) {
    try {
      if (!this.enable) return;
      if (options.level < loggerConfigs.level) return;
      if (loggerConfigs.console) {
        if (options.level == LogLevel.TRACE) console.info(options.message, options.data);
        else if (options.level == LogLevel.DEBUG) console.info(options.message, options.data);
        else if (options.level == LogLevel.INFO) console.info(options.message, options.data);
        else if (options.level == LogLevel.WARNING) console.warn(options.message, options.data);
        else if (options.level == LogLevel.ERROR) console.error(options.message, options.data);
      }
      const flags = {...this.flags, ...options.flags};
      const log = {
        name: this.name,
        data: options.data,
        level: options.level,
        message: options.message,
        flags: flags
      } as LogRecord;
      if (log.data instanceof Error) {
        log.data = {
          name: log.data.name,
          message: log.data.message,
          stack: log.data.stack,
        };
        console.log('error', log)
      }

      if (flags.inMemory) {
        this.inMemoryLogs.push(log);
      } else {
        persistLogs?.add(log);
      }
    } catch (e) {
      console.error(e)
    }
  }

  debug(message: string, data?: any, flags?: Flags) {
    this.log({
      level: LogLevel.DEBUG,
      message: message,
      data: data,
      flags: flags,
    });
  }

  trace(message: string, data?: any, flags?: Flags) {
    this.log({
      level: LogLevel.TRACE,
      message: message,
      data: data,
      flags: flags,
    });
  }

  info(message: string, data?: any, flags?: Flags) {
    this.log({
      level: LogLevel.INFO,
      message: message,
      data: data,
      flags: flags,
    });
  }

  warn(message: string, data?: any, flags?: Flags) {
    this.log({
      level: LogLevel.WARNING,
      message: message,
      data: data,
      flags: flags,
    });
  }

  error(message: string, data?: any, flags?: Flags) {
    this.log({
      level: LogLevel.ERROR,
      message: message,
      data: data,
      flags: flags,
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
