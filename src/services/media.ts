export function buildMediaUrl(path?: string | null): string | undefined {
  if (!path) return undefined;

  const prodBase = import.meta.env.VITE_MEDIA_URL;
  const localBase = "http://localhost:3000";

  let cleanPath = path;

  // If the URL starts with the localhost prefix, remove it
  if (cleanPath.startsWith(localBase)) {
    cleanPath = cleanPath.replace(localBase, "");
  }

  // Ensure clean relative path (remove leading double slashes)
  cleanPath = cleanPath.replace(/^\/+/, "");

  // Combine with production URL
  return `${prodBase}/${cleanPath}`;
}

export default buildMediaUrl;
