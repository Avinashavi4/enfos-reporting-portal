/** The three non-success screens every data view shares. Centralized so
 *  loading/empty/error look and behave the same everywhere. */

export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="state" role="status" aria-live="polite">
      <div className="spinner" aria-hidden="true" />
      <p>{label}</p>
    </div>
  );
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="state state--error" role="alert">
      <p className="state__title">Couldn't load this data</p>
      <p className="state__detail">{message}</p>
      {onRetry && (
        <button className="btn" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({
  title,
  detail,
}: {
  title: string;
  detail?: string;
}) {
  return (
    <div className="state">
      <p className="state__title">{title}</p>
      {detail && <p className="state__detail">{detail}</p>}
    </div>
  );
}
