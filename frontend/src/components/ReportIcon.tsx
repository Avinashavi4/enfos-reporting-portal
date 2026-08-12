import type { ReactNode } from "react";

/** Per-report icon + accent tone. Keyed by report id with a neutral fallback,
 *  so a new report renders sensibly even before it gets its own icon. */
interface IconSpec {
  tone: string; // maps to a .icon-tile--<tone> class
  svg: ReactNode;
}

const people = (
  <>
    <circle cx="8" cy="8" r="3" />
    <path d="M2.5 18a5.5 5.5 0 0 1 11 0" />
    <path d="M15 5.2a3 3 0 0 1 0 5.6" />
    <path d="M15.5 13.2A5.5 5.5 0 0 1 19 18" />
  </>
);

const building = (
  <>
    <rect x="4" y="3" width="12" height="16" rx="1" />
    <path d="M8 7h1.5M8 11h1.5M8 15h1.5M13 7h-1.5M13 11h-1.5" />
    <path d="M16 9h3v10h-3" />
  </>
);

const board = (
  <>
    <rect x="3" y="4" width="18" height="15" rx="2" />
    <path d="M8 4v15M8 9h4M8 13h4" />
  </>
);

const SPECS: Record<string, IconSpec> = {
  users: { tone: "blue", svg: people },
  departments: { tone: "violet", svg: building },
  projects: { tone: "teal", svg: board },
};

const FALLBACK: IconSpec = {
  tone: "gray",
  svg: <rect x="4" y="4" width="16" height="16" rx="2" />,
};

export function ReportIcon({ reportId }: { reportId: string }) {
  const spec = SPECS[reportId] ?? FALLBACK;
  return (
    <span className={`icon-tile icon-tile--${spec.tone}`} aria-hidden="true">
      <svg
        viewBox="0 0 22 22"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {spec.svg}
      </svg>
    </span>
  );
}
