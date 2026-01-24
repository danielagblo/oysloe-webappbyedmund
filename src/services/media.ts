export function buildMediaUrl(path?: string | null): string | undefined {
  if (!path) return undefined;

  const prodBase = import.meta.env.VITE_MEDIA_URL;

  let cleanPath = path;

  // If this is a blob or data URL created in the browser, return it unchanged.
  // These are object URLs (e.g. "blob:http://localhost:5173/...") or data URIs
  // and cannot/should not be rewritten to the production media host.
  if (/^blob:/i.test(cleanPath) || /^data:/i.test(cleanPath)) {
    return cleanPath;
  }

  // If the URL starts with a localhost origin (any port), remove it.
  // Matches: http://localhost, http://localhost:3000, https://localhost:5173, etc.
  const localhostOriginRegex = /^https?:\/\/localhost(?::\d+)?/i;
  if (localhostOriginRegex.test(cleanPath)) {
    cleanPath = cleanPath.replace(localhostOriginRegex, "");
  }

  // If this is an absolute URL (http/https) after stripping localhost, return it as-is
  if (/^https?:\/\//i.test(cleanPath)) {
    return cleanPath;
  }

  // Ensure clean relative path (remove leading slashes)
  cleanPath = cleanPath.replace(/^\/+/, "");

  // Combine with production URL
  return `${prodBase}/${cleanPath}`;
}

export default buildMediaUrl;
