// HTTP client for World Triathlon API

const API_BASE = 'https://api.triathlon.org/v1';
const API_KEY = process.env.TRIATHLON_API_KEY;

if (!API_KEY) {
  throw new Error(
    'TRIATHLON_API_KEY environment variable is required. ' +
    'Get your free API key at https://developers.triathlon.org'
  );
}

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number>;
}

export async function apiRequest<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { params, ...fetchOptions } = options;

  let url = `${API_BASE}${endpoint}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, String(value));
    });
    url += `?${searchParams.toString()}`;
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers: {
      apikey: API_KEY!,
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

// Simple in-memory cache for API responses
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function cachedApiRequest<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const cacheKey = `${endpoint}${JSON.stringify(options.params || {})}`;
  const cached = cache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data as T;
  }

  const data = await apiRequest<T>(endpoint, options);
  cache.set(cacheKey, { data, timestamp: Date.now() });

  return data;
}
