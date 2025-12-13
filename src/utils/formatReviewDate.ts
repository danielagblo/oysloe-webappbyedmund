export function formatReviewDate(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();

  const ms = now.getTime() - date.getTime();

  // If date is in the future, just return the formatted date
  if (ms < 0) {
    const day = date.getDate();
    const monthName = date.toLocaleString("en-US", { month: "long" });
    const year = date.getFullYear();

    const isThisYear = year === now.getFullYear();

    return isThisYear ? `${monthName} ${day}` : `${monthName} ${day} ${year}`;
  }

  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(ms / (1000 * 60));
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);

  if (seconds < 60) return "just now";

  if (minutes < 60)
    return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;

  if (hours < 24) return hours === 1 ? "1 hour ago" : `${hours} hours ago`;

  if (days < 7) return days === 1 ? "1 day ago" : `${days} days ago`;

  if (weeks < 4) return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;

  if (months < 6) return months === 1 ? "1 month ago" : `${months} months ago`;

  const day = date.getDate();
  const monthName = date.toLocaleString("en-US", { month: "long" });
  const year = date.getFullYear();

  const isThisYear = year === now.getFullYear();

  return isThisYear ? `${day} ${monthName}` : `${day} ${monthName} ${year}`;
}
