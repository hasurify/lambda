import { red, yellow, blue, green } from 'cli-color';

const LEVEL_INFO = 'INFO';
const LEVEL_WARN = 'WARN';
const LEVEL_ERROR = 'ERROR';
const LEVEL_DEBUG = 'DEBUG';

const KEY_TIME = '@timestamp';
const KEY_LEVEL = 'level';
const KEY_MESSAGE = 'message';

export class AppLogger {
  error(...logs: any) {
    const logString = this.#buildLog(LEVEL_ERROR, logs);
    if (process.env.ENVIRONMENT === 'local') {
      return console.error(red(logString));
    }
    return console.error(logString);
  }

  info(...logs: any) {
    const logString = this.#buildLog(LEVEL_INFO, logs);
    if (process.env.ENVIRONMENT === 'local') {
      return console.info(blue(logString));
    }
    return console.info(logString);
  }

  warn(...logs: any) {
    const logString = this.#buildLog(LEVEL_WARN, logs);
    if (process.env.ENVIRONMENT === 'local') {
      return console.warn(yellow(logString));
    }
    return console.warn(logString);
  }

  success(...logs: any) {
    const logString = this.#buildLog(LEVEL_DEBUG, logs);
    if (process.env.ENVIRONMENT === 'local') {
      return console.log(green(logString));
    }
    return console.log(logString);
  }

  #buildLog(level: string, ...logs: any) {
    return JSON.stringify({
      [KEY_TIME]: new Date().toISOString(),
      [KEY_LEVEL]: level,
      [KEY_MESSAGE]: logs.join('\\n'),
    });
  }
}

export const appLogger = new AppLogger();
