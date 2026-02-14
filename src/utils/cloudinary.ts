const CLOUDINARY_HOST = /https?:\/\/res\.cloudinary\.com\//i;

export const isCloudinaryUrl = (url?: string | null): url is string => {
  if (!url) return false;
  return CLOUDINARY_HOST.test(url);
};

const hasTransformSegment = (segment: string) => {
  return /(^|,)(w_|h_|c_|q_|f_)/.test(segment);
};

export const buildCloudinaryUrl = (src: string, transform: string) => {
  try {
    if (!isCloudinaryUrl(src)) return src;
    const parts = src.split("/upload/");
    if (parts.length !== 2) return src;
    const after = parts[1];
    const firstSegment = after.split("/")[0] || "";
    if (hasTransformSegment(firstSegment)) return src;
    return `${parts[0]}/upload/${transform}/${after}`;
  } catch {
    return src;
  }
};

export const buildCloudinarySrcSet = (
  src?: string | null,
  widths: number[] = [320, 480, 640, 768, 1024, 1280],
) => {
  if (!src || !isCloudinaryUrl(src)) return undefined;
  const baseParts = src.split("/upload/");
  if (baseParts.length !== 2) return undefined;
  const after = baseParts[1];
  const firstSegment = after.split("/")[0] || "";
  if (hasTransformSegment(firstSegment)) return undefined;

  return widths
    .map((w) => {
      const url = `${baseParts[0]}/upload/w_${w},c_limit,q_auto,f_auto/${after}`;
      return `${url} ${w}w`;
    })
    .join(", ");
};
