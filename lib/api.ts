import {
  withRetry,
  measurePerformance,
  PERFORMANCE_CONFIG,
} from '@/lib/performance';

export type ApiMethod = 'GET';

export interface CallApiOptions {
  method?: ApiMethod;
  body?: BodyInit | null;
  headers?: Record<string, string>;
  timeout?: number;
  enableRetry?: boolean;
  enablePerformanceLog?: boolean;
  /** Bypass Next.js Data Cache (useful for frequently updated content). */
  cache?: RequestCache;
  /** ISR window in seconds. Use false with cache:'no-store' to disable. */
  revalidate?: number | false;
  /** Extra cache tags for on-demand revalidation via /api/revalidate */
  tags?: string[];
}

// Fonction avec timeout
async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeout: number,
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

export async function callApi<T>(
  endpoint: string,
  options: CallApiOptions = {},
): Promise<T> {
  const isDev = process.env.NODE_ENV === 'development';
  const {
    method = 'GET',
    body,
    headers,
    timeout = PERFORMANCE_CONFIG.TIMEOUTS.DEFAULT,
    enableRetry = true,
    enablePerformanceLog = true,
    // In local dev, always fetch fresh API data so CMS edits show up immediately.
    cache = isDev ? 'no-store' : undefined,
    revalidate = isDev ? false : 3600,
    tags,
    ...rest
  } = options;

  const apiCall = async (): Promise<T> => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!baseUrl) {
      throw new Error(
        "La variable NEXT_PUBLIC_API_BASE_URL n'est pas définie dans .env.local",
      );
    }

    const url = `${baseUrl}${endpoint}`;
    const shouldBypassCache = cache === 'no-store' || revalidate === false;
    // Prefer semantic tags when provided; fall back to endpoint tag.
    const cacheTags = Array.from(
      new Set((tags?.length ? tags : [endpoint]).filter(Boolean)),
    );
    const fetchOptions: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(headers || {}),
      },
      ...(cache ? { cache } : {}),
      ...(method === 'GET' &&
        !shouldBypassCache && {
          next: {
            revalidate: typeof revalidate === 'number' ? revalidate : 300,
            tags: cacheTags,
          },
        }),
      ...(method === 'GET' &&
        shouldBypassCache && {
          cache: 'no-store' as RequestCache,
        }),
      ...rest,
    };

    if (body !== undefined && method !== 'GET') {
      fetchOptions.body =
        typeof body === 'string' ? body : JSON.stringify(body);
    }

    const response = await fetchWithTimeout(url, fetchOptions, timeout);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erreur API (${response.status}): ${errorText}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    return response.text() as unknown as T;
  };

  // Appliquer retry si activé
  const finalCall = enableRetry ? () => withRetry(apiCall) : apiCall;

  // Appliquer mesure de performance si activée
  if (enablePerformanceLog) {
    return measurePerformance(`API ${method} ${endpoint}`, finalCall);
  }

  return finalCall();
}
