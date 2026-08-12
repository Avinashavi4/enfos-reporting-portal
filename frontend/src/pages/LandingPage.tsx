import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { ReportMeta } from "../api/types";
import { EmptyState, ErrorState, LoadingState } from "../components/AsyncStates";
import { SearchInput } from "../components/SearchInput";
import { useApi } from "../hooks/useApi";
import { formatDate } from "../lib/format";

/** Reporting home: fetches the catalog and renders a searchable card grid. */
export function LandingPage() {
  const catalog = useApi<ReportMeta[]>("/api/reports");
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    if (catalog.status !== "success") return [];
    const q = query.trim().toLowerCase();
    if (!q) return catalog.data;
    return catalog.data.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q),
    );
  }, [catalog, query]);

  return (
    <main className="page">
      <header className="page-head">
        <h1>Reports</h1>
        <p className="page-sub">
          Browse the available reports and open one to explore its data.
        </p>
      </header>

      <SearchInput
        value={query}
        onChange={setQuery}
        placeholder="Search reports…"
        autoFocus
      />

      {catalog.status === "loading" && <LoadingState label="Loading reports…" />}

      {catalog.status === "error" && (
        <ErrorState message={catalog.message} onRetry={catalog.retry} />
      )}

      {catalog.status === "success" &&
        (visible.length === 0 ? (
          <EmptyState
            title={`No reports match “${query}”`}
            detail="Try a different name — for example Users, Departments, or Projects."
          />
        ) : (
          <ul className="card-grid">
            {visible.map((report) => (
              <li key={report.id}>
                <Link className="card" to={`/reports/${report.id}`}>
                  <div className="card__top">
                    <h2>{report.name}</h2>
                    <span className="card__count">
                      {report.rowCount.toLocaleString()} rows
                    </span>
                  </div>
                  <p className="card__desc">{report.description}</p>
                  <p className="card__meta">
                    Updated {formatDate(report.lastUpdated)}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        ))}
    </main>
  );
}
