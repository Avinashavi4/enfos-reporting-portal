const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

/** "2026-06-15" -> "Jun 15, 2026". Parsed as local midnight to avoid the
 *  classic UTC off-by-one-day bug with bare date strings. */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return dateFormatter.format(new Date(y, m - 1, d));
}
