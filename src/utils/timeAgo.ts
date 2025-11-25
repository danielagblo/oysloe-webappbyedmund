export function timeAgo(dateString: string | Date): string {
  const now = new Date();
  const date =
    typeof dateString === "string" ? new Date(dateString) : dateString;
  const diff = now.getTime() - date.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);
  const weeks = Math.floor(diff / (86_400_000 * 7));
  const months = Math.floor(diff / (86_400_000 * 30.44));
  const years = Math.floor(diff / (86_400_000 * 365.25));

  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes} min${minutes > 1 ? "s" : ""} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (weeks < 4) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;
  if (years < 2) return "last year";
  return date.toLocaleDateString();
}
