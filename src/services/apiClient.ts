type RequestOptions = Omit<RequestInit, 'body'> & { body?: unknown };

async function request<T>(url: string, options: RequestOptions = {}): Promise<T> {
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  const body = options.body ? JSON.stringify(options.body) : undefined;

  const response = await fetch(url, { ...options, headers, body, credentials: 'include' });
  if (!response.ok) throw new Error(`${options.method ?? 'GET'} ${url} failed`);
  return response.json();
}

export const apiClient = {
  get: <T>(url: string) => request<T>(url),
  post: <T>(url: string, body: unknown) => request<T>(url, { method: 'POST', body }),
  patch: <T>(url: string, body: unknown) => request<T>(url, { method: 'PATCH', body }),
  delete: <T>(url: string) => request<T>(url, { method: "DELETE" }),
};

export const ping = () => apiClient.get<{message: string;}>('/');
