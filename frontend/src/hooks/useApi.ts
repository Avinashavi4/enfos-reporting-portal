import { useCallback, useEffect, useState } from "react";

interface Loading {
  status: "loading";
}
interface Failed {
  status: "error";
  message: string;
}
interface Loaded<T> {
  status: "success";
  data: T;
}

export type ApiState<T> = Loading | Failed | Loaded<T>;

/**
 * Small fetch hook that owns the loading / error / success lifecycle.
 *
 * - Aborts the in-flight request when the component unmounts or the path
 *   changes, so a slow response can never write state for a screen the user
 *   already left (no race conditions, no "setState on unmounted" warnings).
 * - retry() re-runs the same request, used by the error state's Retry button.
 *
 * For an app of this size a ~40-line hook beats pulling in a query library;
 * if caching, deduping, or mutations showed up, TanStack Query would be the
 * natural upgrade and this hook's call sites wouldn't need to change shape.
 */
export function useApi<T>(path: string): ApiState<T> & { retry: () => void } {
  const [state, setState] = useState<ApiState<T>>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setState({ status: "loading" });

    fetch(path, { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`The server responded with ${res.status}`);
        }
        return (await res.json()) as T;
      })
      .then((data) => setState({ status: "success", data }))
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") {
          return; // navigation/unmount, not a real failure
        }
        const message =
          err instanceof Error ? err.message : "Something went wrong";
        setState({ status: "error", message });
      });

    return () => controller.abort();
  }, [path, attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  return { ...state, retry };
}
