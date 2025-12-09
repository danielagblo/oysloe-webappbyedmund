/**
 * Format reviewer name to show first name and last initial
 * Truncates long names to prevent wrapping
 * @param fullName - The full name to format
 * @param maxLength - Maximum length before truncation (default: 20)
 * @returns Formatted name like "John D." or "Jane Smith" if single name
 */
export function formatReviewerName(fullName: string | undefined, maxLength: number = 20): string {
  if (!fullName || !fullName.trim()) {
    return "User";
  }

  const trimmed = fullName.trim();
  const parts = trimmed.split(/\s+/);

  if (parts.length === 1) {
    // Single name - just truncate if needed
    return trimmed.length > maxLength ? trimmed.substring(0, maxLength - 1) + "." : trimmed;
  }

  // Multiple names - first name + last initial
  const firstName = parts[0];
  const lastName = parts[parts.length - 1];
  const formatted = `${firstName} ${lastName.charAt(0).toUpperCase()}.`;

  // Truncate if the formatted result is too long
  return formatted.length > maxLength ? formatted.substring(0, maxLength - 1) + "." : formatted;
}
