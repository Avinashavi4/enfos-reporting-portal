import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { ReportMeta } from "../api/types";
import { EmptyState, ErrorState, LoadingState } from "../components/AsyncStates";
import { ReportIcon } from "../components/ReportIcon";
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

  const total = catalog.status === "success" ? catalog.data.length : 0;

  return (
    <main className="page landing">
      <div className="landing__body">
        <header className="landing__head">
          <p className="eyebrow">Internal Reporting</p>
          <h1>Reports</h1>
          <p className="page-sub">
            Browse the available reports and open one to explore its data.
          </p>
        </header>

        <div className="landing__tools">
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Search reports…"
            autoFocus
          />
          {catalog.status === "success" && (
            <span className="landing__count">
              {visible.length === total
                ? `${total} ${total === 1 ? "report" : "reports"}`
                : `${visible.length} of ${total}`}
            </span>
          )}
        </div>

        {catalog.status === "loading" && (
          <LoadingState label="Loading reports…" />
        )}

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
                  <Link className="rcard" to={`/reports/${report.id}`}>
                    <div className="rcard__top">
                      <ReportIcon reportId={report.id} />
                      <span className="rcard__go" aria-hidden="true">
                        →
                      </span>
                    </div>
                    <h2 className="rcard__name">{report.name}</h2>
                    <p className="rcard__desc">{report.description}</p>
                    <div className="rcard__foot">
                      <span className="rcard__rows">
                        {report.rowCount.toLocaleString()} rows
                      </span>
                      <span className="rcard__sep" aria-hidden="true">
                        ·
                      </span>
                      <span>Updated {formatDate(report.lastUpdated)}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ))}
      </div>

      <footer className="landing__foot">
        Enfos Reporting · internal tool
      </footer>
    </main>
  );
}
