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
    return console.error(logString);
  }

  info(...logs: any) {
    const logString = this.#buildLog(LEVEL_INFO, logs);
    return console.info(logString);
  }

  warn(...logs: any) {
    const logString = this.#buildLog(LEVEL_WARN, logs);
    return console.warn(logString);
  }

  success(...logs: any) {
    const logString = this.#buildLog(LEVEL_DEBUG, logs);
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
