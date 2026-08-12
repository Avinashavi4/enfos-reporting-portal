import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { EmptyState, ErrorState, LoadingState } from "../components/AsyncStates";
import { DataTable } from "../components/DataTable";
import { SearchInput } from "../components/SearchInput";
import { useApi } from "../hooks/useApi";
import { REPORTS } from "../reports/reportConfig";

/** Detail view for one report: header, filter box, and the sortable table,
 *  with loading / error / empty states for every path the data can take. */
export function ReportPage() {
  const { reportId = "" } = useParams();
  const config = REPORTS[reportId];

  if (!config) {
    return (
      <main className="page">
        <BackLink />
        <ErrorState message={`There's no report called “${reportId}”.`} />
      </main>
    );
  }

  return <ReportView key={config.id} configId={config.id} />;
}

function ReportView({ configId }: { configId: string }) {
  const config = REPORTS[configId];
  const rows = useApi<object[]>(config.endpoint);
  const [filter, setFilter] = useState("");

  // Text filter across every column the table shows.
  const visible = useMemo(() => {
    if (rows.status !== "success") return [];
    const q = filter.trim().toLowerCase();
    if (!q) return rows.data;
    return rows.data.filter((row) =>
      config.columns.some((col) =>
        String((row as Record<string, unknown>)[col.key] ?? "")
          .toLowerCase()
          .includes(q),
      ),
    );
  }, [rows, filter, config]);

  const title = configId.charAt(0).toUpperCase() + configId.slice(1);

  return (
    <main className="page">
      <BackLink />
      <header className="page-head page-head--row">
        <div>
          <h1>{title}</h1>
          {rows.status === "success" && (
            <p className="page-sub">
              {visible.length === rows.data.length
                ? `${rows.data.length} rows`
                : `${visible.length} of ${rows.data.length} rows`}
            </p>
          )}
        </div>
        <SearchInput
          value={filter}
          onChange={setFilter}
          placeholder={config.searchHint}
        />
      </header>

      {rows.status === "loading" && <LoadingState label="Loading report data…" />}

      {rows.status === "error" && (
        <ErrorState message={rows.message} onRetry={rows.retry} />
      )}

      {rows.status === "success" &&
        (rows.data.length === 0 ? (
          <EmptyState
            title="This report has no data yet"
            detail="Rows will appear here once the source system has records."
          />
        ) : visible.length === 0 ? (
          <EmptyState
            title={`No rows match “${filter}”`}
            detail="Try a shorter or different search term."
          />
        ) : (
          <DataTable
            columns={config.columns}
            rows={visible}
            rowKey={(row) =>
              String(Object.values(row as Record<string, unknown>)[0])
            }
          />
        ))}
    </main>
  );
}

function BackLink() {
  return (
    <Link className="back" to="/">
      <span aria-hidden="true">←</span> All reports
    </Link>
  );
}
