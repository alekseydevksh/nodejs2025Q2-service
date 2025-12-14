export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  LOG = 2,
  DEBUG = 3,
  VERBOSE = 4,
}

export const LOG_LEVEL_NAMES: Record<string, LogLevel> = {
  error: LogLevel.ERROR,
  warn: LogLevel.WARN,
  log: LogLevel.LOG,
  debug: LogLevel.DEBUG,
  verbose: LogLevel.VERBOSE,
};
