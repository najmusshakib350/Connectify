import { Injectable, OnModuleInit } from '@nestjs/common';
import { mkdir, appendFile } from 'fs/promises';
import { dirname, join } from 'path';

@Injectable()
export class FileLoggerService implements OnModuleInit {
  private readonly logFilePath = join(process.cwd(), 'logs', 'app.log');
  private dirEnsured = false;

  async onModuleInit(): Promise<void> {
    await this.ensureLogDir();
  }

  private async ensureLogDir(): Promise<void> {
    if (this.dirEnsured) return;
    await mkdir(dirname(this.logFilePath), { recursive: true });
    this.dirEnsured = true;
  }

  /**
   * Appends one structured JSON line to logs/app.log (non-blocking for the HTTP chain).
   */
  appendLine(entry: Record<string, unknown>): void {
    const line = `${JSON.stringify(entry)}\n`;
    void this.writeLine(line);
  }

  private async writeLine(line: string): Promise<void> {
    try {
      await this.ensureLogDir();
      await appendFile(this.logFilePath, line, { encoding: 'utf8' });
    } catch (err) {
      console.error('[FileLoggerService] Failed to write log file', err);
    }
  }
}
