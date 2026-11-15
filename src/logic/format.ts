/** Sanani "15.11.2026, 13:45" ko'rinishida chiqaradi. */
export function formatDateTime(timestamp: number): string {
  const d = new Date(timestamp);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}, ${pad(d.getHours())}:${pad(
    d.getMinutes(),
  )}`;
}
