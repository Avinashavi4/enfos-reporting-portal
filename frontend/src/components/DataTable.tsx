import { useMemo, useState } from "react";
import type { ColumnDef } from "../reports/reportConfig";

type SortDir = "asc" | "desc";

interface SortState {
  key: string;
  dir: SortDir;
}

/**
 * Generic sortable table. It knows nothing about any specific report — the
 * column config tells it what to render, so all three reports (and any future
 * one) share this single component.
 *
 * Sorting is client-side: every report here is well under a hundred rows, so
 * shipping all rows and sorting in the browser is simpler and feels instant.
 * If a report grew into the thousands of rows, sorting and pagination would
 * move behind the API and this component would emit sort-change events instead.
 */
export function DataTable<Row extends object>({
  columns,
  rows,
  rowKey,
}: {
  columns: ColumnDef<Row>[];
  rows: Row[];
  rowKey: (row: Row) => string;
}) {
  const [sort, setSort] = useState<SortState | null>(null);

  const sorted = useMemo(() => {
    if (!sort) return rows;
    const col = columns.find((c) => c.key === sort.key);
    if (!col) return rows;
    const dir = sort.dir === "asc" ? 1 : -1;
    return [...rows].sort((a, b) => {
      const av = a[col.key as keyof Row];
      const bv = b[col.key as keyof Row];
      if (av == null) return 1; // nulls (e.g. open end dates) sink to the bottom
      if (bv == null) return -1;
      if (col.numeric) return (Number(av) - Number(bv)) * dir;
      return String(av).localeCompare(String(bv)) * dir;
    });
  }, [rows, sort, columns]);

  function toggleSort(key: string) {
    setSort((prev) =>
      prev?.key === key
        ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { key, dir: "asc" },
    );
  }

  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            {columns.map((col) => {
              const active = sort?.key === col.key;
              return (
                <th
                  key={col.key}
                  className={col.numeric ? "num" : undefined}
                  aria-sort={
                    active
                      ? sort.dir === "asc"
                        ? "ascending"
                        : "descending"
                      : undefined
                  }
                >
                  <button
                    className="th-btn"
                    onClick={() => toggleSort(col.key)}
                  >
                    {col.label}
                    <span className="th-arrow" aria-hidden="true">
                      {active ? (sort.dir === "asc" ? "↑" : "↓") : "↕"}
                    </span>
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row) => (
            <tr key={rowKey(row)}>
              {columns.map((col) => (
                <td key={col.key} className={col.numeric ? "num" : undefined}>
                  {col.render ? col.render(row) : String(row[col.key as keyof Row] ?? "—")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
