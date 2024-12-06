/**
 * Format the elapsed time since a given date in a human-readable way.
 * @param createdDateTime - The ISO date string of the creation time.
 * @returns A human-readable string representing the elapsed time.
 */
export function formatTime(createdDateTime: string): string {
  const elapsed = Date.now() - new Date(createdDateTime).getTime();
  const minutes = Math.floor(elapsed / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 60) return `${minutes} minutes ago`;
  if (hours < 24) return `${hours} hours ago`;
  return `${days} days ago`;
}