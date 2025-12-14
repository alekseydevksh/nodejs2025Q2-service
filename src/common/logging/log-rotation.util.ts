import { existsSync, statSync, renameSync, mkdirSync } from 'node:fs';

export class LogRotationUtil {
  static shouldRotate(filePath: string, maxSizeKB: number): boolean {
    if (!existsSync(filePath)) {
      return false;
    }

    const stats = statSync(filePath);
    const fileSizeKB = stats.size / 1024;
    return fileSizeKB >= maxSizeKB;
  }

  static rotateFile(filePath: string): void {
    if (!existsSync(filePath)) {
      return;
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const rotatedPath = `${filePath}.${timestamp}`;
    renameSync(filePath, rotatedPath);
  }

  static ensureDirectoryExists(dirPath: string): void {
    if (!existsSync(dirPath)) {
      mkdirSync(dirPath, { recursive: true });
    }
  }
}
