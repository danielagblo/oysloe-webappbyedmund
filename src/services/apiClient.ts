const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.oysloe.com';

type RequestOptions = Omit<RequestInit, 'body'> & { body?: unknown };

async function request<T>(url: string, options: RequestOptions = {}): Promise<T> {
  // Remove leading slash from url if API_BASE_URL ends with slash
  const cleanUrl = API_BASE_URL.endsWith('/') ? url.replace(/^\//, '') : url;
  const fullUrl = `${API_BASE_URL}${cleanUrl}`;
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  const body = options.body ? JSON.stringify(options.body) : undefined;

  const response = await fetch(fullUrl, { ...options, headers, body, credentials: 'include' });
  if (!response.ok) throw new Error(`${options.method ?? 'GET'} ${url} failed`);
  // Some endpoints (DELETE, mark-all-read) return 204 No Content — handle that safely
  if (response.status === 204) return undefined as unknown as T;
  return response.json();
}

export const apiClient = {
  get: <T>(url: string) => request<T>(url),
  post: <T>(url: string, body: unknown) => request<T>(url, { method: 'POST', body }),
  patch: <T>(url: string, body: unknown) => request<T>(url, { method: 'PATCH', body }),
  put: <T>(url: string, body: unknown) => request<T>(url, { method: 'PUT', body }),
  delete: <T>(url: string) => request<T>(url, { method: "DELETE" }),
};

export const ping = () => apiClient.get<{message: string;}>('/');
