import { Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createWriteStream, WriteStream } from 'node:fs';
import { join } from 'node:path';
import { LogLevel, LOG_LEVEL_NAMES } from './logging.interface';
import { LogRotationUtil } from './log-rotation.util';

@Injectable()
export class LoggingService implements LoggerService {
  private readonly currentLogLevel: LogLevel;
  private readonly maxFileSizeKB: number;
  private readonly logsDir: string;
  private readonly mainLogPath: string;
  private readonly errorLogPath: string;
  private mainLogStream: WriteStream | null = null;
  private errorLogStream: WriteStream | null = null;

  constructor(private readonly configService: ConfigService) {
    const logLevelName = (
      this.configService.get('LOG_LEVEL') || 'log'
    ).toLowerCase();
    this.currentLogLevel = LOG_LEVEL_NAMES[logLevelName] ?? LogLevel.LOG;

    this.maxFileSizeKB =
      Number.parseInt(
        this.configService.get('LOG_MAX_FILE_SIZE_KB', '1024'),
        10,
      ) || 1024;

    this.logsDir = join(process.cwd(), 'logs');
    this.mainLogPath = join(this.logsDir, 'app.log');
    this.errorLogPath = join(this.logsDir, 'error.log');

    LogRotationUtil.ensureDirectoryExists(this.logsDir);
    this.initializeLogStreams();
  }

  private initializeLogStreams(): void {
    if (LogRotationUtil.shouldRotate(this.mainLogPath, this.maxFileSizeKB)) {
      LogRotationUtil.rotateFile(this.mainLogPath);
    }
    this.mainLogStream = createWriteStream(this.mainLogPath, { flags: 'a' });

    if (LogRotationUtil.shouldRotate(this.errorLogPath, this.maxFileSizeKB)) {
      LogRotationUtil.rotateFile(this.errorLogPath);
    }
    this.errorLogStream = createWriteStream(this.errorLogPath, { flags: 'a' });
  }

  private writeToFile(message: string, isError: boolean = false): void {
    if (
      this.mainLogStream &&
      LogRotationUtil.shouldRotate(this.mainLogPath, this.maxFileSizeKB)
    ) {
      this.mainLogStream.end();
      LogRotationUtil.rotateFile(this.mainLogPath);
      this.mainLogStream = createWriteStream(this.mainLogPath, { flags: 'a' });
    }

    if (
      isError &&
      this.errorLogStream &&
      LogRotationUtil.shouldRotate(this.errorLogPath, this.maxFileSizeKB)
    ) {
      this.errorLogStream.end();
      LogRotationUtil.rotateFile(this.errorLogPath);
      this.errorLogStream = createWriteStream(this.errorLogPath, {
        flags: 'a',
      });
    }

    if (this.mainLogStream) {
      this.mainLogStream.write(`${message}\n`);
    }

    if (isError && this.errorLogStream) {
      this.errorLogStream.write(`${message}\n`);
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return level <= this.currentLogLevel;
  }

  private formatMessage(
    level: string,
    message: any,
    ...optionalParams: any[]
  ): string {
    const timestamp = new Date().toISOString();
    const params =
      optionalParams.length > 0 ? ` ${JSON.stringify(optionalParams)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${params}`;
  }

  error(message: any, ...optionalParams: any[]): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      const formatted = this.formatMessage('error', message, ...optionalParams);
      process.stdout.write(`${formatted}\n`);
      this.writeToFile(formatted, true);
    }
  }

  warn(message: any, ...optionalParams: any[]): void {
    if (this.shouldLog(LogLevel.WARN)) {
      const formatted = this.formatMessage('warn', message, ...optionalParams);
      process.stdout.write(`${formatted}\n`);
      this.writeToFile(formatted);
    }
  }

  log(message: any, ...optionalParams: any[]): void {
    if (this.shouldLog(LogLevel.LOG)) {
      const formatted = this.formatMessage('log', message, ...optionalParams);
      process.stdout.write(`${formatted}\n`);
      this.writeToFile(formatted);
    }
  }

  debug(message: any, ...optionalParams: any[]): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      const formatted = this.formatMessage('debug', message, ...optionalParams);
      process.stdout.write(`${formatted}\n`);
      this.writeToFile(formatted);
    }
  }

  verbose(message: any, ...optionalParams: any[]): void {
    if (this.shouldLog(LogLevel.VERBOSE)) {
      const formatted = this.formatMessage(
        'verbose',
        message,
        ...optionalParams,
      );
      process.stdout.write(`${formatted}\n`);
      this.writeToFile(formatted);
    }
  }

  onModuleDestroy(): void {
    if (this.mainLogStream) {
      this.mainLogStream.end();
    }
    if (this.errorLogStream) {
      this.errorLogStream.end();
    }
  }
}
