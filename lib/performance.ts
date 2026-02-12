export const PERFORMANCE_CONFIG = {
  TIMEOUTS: {
    DEFAULT: 10000,
  },
  RETRY: {
    MAX_RETRIES: 2,
    INITIAL_DELAY_MS: 250,
  },
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = PERFORMANCE_CONFIG.RETRY.MAX_RETRIES,
  initialDelayMs = PERFORMANCE_CONFIG.RETRY.INITIAL_DELAY_MS,
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt === maxRetries) {
        break;
      }
      await sleep(initialDelayMs * (attempt + 1));
    }
  }

  throw lastError instanceof Error ? lastError : new Error('Retry failed');
}

export async function measurePerformance<T>(
  label: string,
  fn: () => Promise<T>,
): Promise<T> {
  const start = Date.now();
  try {
    return await fn();
  } finally {
    const durationMs = Date.now() - start;
    if (process.env.NODE_ENV !== 'production') {
      console.log(`${label} - ${durationMs}ms`);
    }
  }
}
