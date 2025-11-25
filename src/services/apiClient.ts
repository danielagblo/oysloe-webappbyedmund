const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.oysloe.com/api-v1';
// Set VITE_API_CREDENTIALS to 'include' when you need cookies; default to 'omit'
// to avoid CORS issues in local development.
const CREDENTIALS_MODE = (import.meta.env.VITE_API_CREDENTIALS as string) || 'omit';

type RequestOptions = Omit<RequestInit, "body"> & { body?: unknown };

async function request<T>(
  url: string,
  options: RequestOptions = {},
): Promise<T> {
  // Remove leading slash from url if API_BASE_URL ends with slash
  const cleanUrl = API_BASE_URL.endsWith("/") ? url.replace(/^\//, "") : url;
  const fullUrl = `${API_BASE_URL}${cleanUrl}`;
  const headers = { "Content-Type": "application/json", ...options.headers };
  const body = options.body ? JSON.stringify(options.body) : undefined;

  let response: Response;
  try {
    response = await fetch(fullUrl, { ...options, headers, body, credentials: CREDENTIALS_MODE as RequestCredentials });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`Network request failed: ${fullUrl}`, err);
    throw new Error(`Network request failed: ${fullUrl} - ${msg}`);
  }

  if (!response.ok) {
    // Try to read response body for more details (may be empty)
    let text = '';
    try {
      text = await response.text();
    } catch (e) {
      void e;
    }
    console.error(`Request failed: ${fullUrl}`, { status: response.status, body: text });
    throw new Error(`${options.method ?? 'GET'} ${fullUrl} failed (${response.status}) ${text}`);
  }
  // Some endpoints (DELETE, mark-all-read) return 204 No Content — handle that safely
  if (response.status === 204) return undefined as unknown as T;
  return response.json();
}

export const apiClient = {
  get: <T>(url: string) => request<T>(url),
  post: <T>(url: string, body: unknown) =>
    request<T>(url, { method: "POST", body }),
  patch: <T>(url: string, body: unknown) =>
    request<T>(url, { method: "PATCH", body }),
  put: <T>(url: string, body: unknown) =>
    request<T>(url, { method: "PUT", body }),
  delete: <T>(url: string) => request<T>(url, { method: "DELETE" }),
};

export const ping = () => apiClient.get<{ message: string }>("/");
