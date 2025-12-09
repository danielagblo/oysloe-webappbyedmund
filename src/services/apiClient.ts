const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://api.oysloe.com/api-v1";
// Set VITE_API_CREDENTIALS to 'include' when you need cookies; default to 'omit'
// to avoid CORS issues in local development.
const CREDENTIALS_MODE =
  (import.meta.env.VITE_API_CREDENTIALS as string) || "omit";
// Authorization scheme (Bearer by default). Set VITE_API_AUTH_SCHEME if backend expects a different prefix.
const AUTH_SCHEME =
  (import.meta.env.VITE_API_AUTH_SCHEME as string) || "Bearer";

type RequestOptions = Omit<RequestInit, "body"> & { body?: unknown };

async function request<T>(
  url: string,
  options: RequestOptions = {},
): Promise<T> {
  // Remove leading slash from url if API_BASE_URL ends with slash
  const cleanUrl = API_BASE_URL.endsWith("/") ? url.replace(/^\//, "") : url;
  const fullUrl = `${API_BASE_URL}${cleanUrl}`;
  // Build headers and attach Authorization automatically when token is present
  // If body is a FormData, do not set Content-Type so the browser can add the multipart boundary.
  // Use a robust detection for FormData so this works across environments / polyfills.
  const maybeBody = options.body as any;
  const isFormData =
    (typeof FormData !== "undefined" && options.body instanceof FormData) ||
    (maybeBody &&
      typeof maybeBody.append === "function" &&
      typeof maybeBody.get === "function");
  const headers = { ...(options.headers ?? {}) } as Record<string, string>;
  if (!isFormData) headers["Content-Type"] = "application/json";

  try {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("oysloe_token");
      // Only add Authorization if not already provided and we have a token
      if (token && !headers["Authorization"] && !headers["authorization"]) {
        const tokenValue =
          token.startsWith("Bearer ") || token.startsWith("Token ")
            ? token
            : `${AUTH_SCHEME} ${token}`;
        headers["Authorization"] = tokenValue;
      }
    }
  } catch (e) {
    // ignore localStorage errors (e.g., private mode) and continue without auth header
    void e;
  }
  // DEV-only: log the final headers so we can verify Authorization is attached
  if (import.meta.env.DEV) {
    try {
      console.debug("apiClient request:", { fullUrl, headers, isFormData });
    } catch (e) {
      void e;
    }
  }
  const body =
    options.body instanceof FormData
      ? options.body
      : options.body
        ? JSON.stringify(options.body)
        : undefined;

  let response: Response;
  try {
    response = await fetch(fullUrl, {
      ...options,
      headers,
      body,
      credentials: CREDENTIALS_MODE as RequestCredentials,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`Network request failed: ${fullUrl}`, err);
    throw new Error(`Network request failed: ${fullUrl} - ${msg}`);
  }

  if (!response.ok) {
    // Try to read response body for more details (may be empty)
    let text = "";
    try {
      text = await response.text();
    } catch (e) {
      void e;
    }
    // Attempt to parse JSON body to extract a friendly message
    let friendly: string | null = null;
    try {
      const parsed = text ? JSON.parse(text) : null;
      if (parsed && typeof parsed === "object") {
        // Common fields: detail, message, error, errors
        if (typeof parsed.detail === "string") friendly = parsed.detail;
        else if (typeof parsed.message === "string") friendly = parsed.message;
        else if (typeof parsed.error === "string") friendly = parsed.error;
        else if (Array.isArray((parsed as any).errors)) {
          const errs = (parsed as any).errors;
          friendly = errs
            .map((e: any) => (typeof e === "string" ? e : JSON.stringify(e)))
            .join("; ");
        } else {
          // fallback: if object contains simple string values, join them
          const parts: string[] = [];
          for (const k of Object.keys(parsed)) {
            const v = (parsed as any)[k];
            if (typeof v === "string") parts.push(v);
            else if (Array.isArray(v)) parts.push(v.join(", "));
          }
          if (parts.length) friendly = parts.join("; ");
        }
      }
    } catch (e) {
      // not JSON or parsing failed
      void e;
    }

    const logBody = text || null;
    console.error(`Request failed: ${fullUrl}`, {
      status: response.status,
      body: logBody,
    });

    // Use friendly message if available; otherwise fall back to plain text or status
    const message = friendly || text || `Request failed (${response.status})`;
    throw new Error(message);
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
