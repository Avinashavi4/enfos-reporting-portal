const TONE: Record<string, string> = {
  Active: "pill--green",
  Completed: "pill--blue",
  Invited: "pill--amber",
  "On Hold": "pill--amber",
  Suspended: "pill--red",
  Cancelled: "pill--gray",
};

/** Colored status badge. Unknown values fall back to a neutral pill rather
 *  than breaking, so new backend statuses degrade gracefully. */
export function StatusPill({ value }: { value: string }) {
  return <span className={`pill ${TONE[value] ?? "pill--gray"}`}>{value}</span>;
}
