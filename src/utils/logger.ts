import { env } from '../config/env.config';

type LogLevel = 'error' | 'warn' | 'info' | 'debug';

const LEVELS: Record<LogLevel, number> = { error: 0, warn: 1, info: 2, debug: 3 };

/**
 * Tiny leveled logger. Keeps the surface small so tests can `import { log }`
 * and not pull in a heavyweight logger.
 */
export const log = {
  error(msg: string, ...rest: unknown[]) {
    if (LEVELS[env.logLevel as LogLevel] >= 0) console.error(`[ERROR] ${msg}`, ...rest);
  },
  warn(msg: string, ...rest: unknown[]) {
    if (LEVELS[env.logLevel as LogLevel] >= 1) console.warn(`[WARN]  ${msg}`, ...rest);
  },
  info(msg: string, ...rest: unknown[]) {
    if (LEVELS[env.logLevel as LogLevel] >= 2) console.log(`[INFO]  ${msg}`, ...rest);
  },
  debug(msg: string, ...rest: unknown[]) {
    if (LEVELS[env.logLevel as LogLevel] >= 3) console.log(`[DEBUG] ${msg}`, ...rest);
  },
};
