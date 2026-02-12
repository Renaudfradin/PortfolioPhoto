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
  const {
    method = 'GET',
    body,
    headers,
    timeout = PERFORMANCE_CONFIG.TIMEOUTS.DEFAULT,
    enableRetry = true,
    enablePerformanceLog = true,
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
    const fetchOptions: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(headers || {}),
      },
      // Ajout du cache pour les requêtes GET
      ...(method === 'GET' && {
        next: {
          revalidate: 300, // Cache pendant 5 minutes
          tags: [endpoint], // Tag pour invalidation sélective
        },
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
