# Interview Reference — What I Built, How, and Why

This is my own prep document for the follow-up discussion. It walks the entire
solution: every layer, every decision, the alternatives I didn't pick and why,
and the questions I'd expect to get.

---

## 1. What the assessment asked for (requirements → where they're met)

| Requirement | Where it lives |
| --- | --- |
| React frontend, modern/modular/scalable components | `frontend/src` — pages + shared components + config-driven reports |
| Java backend, Spring Boot preferred | `backend/` — Spring Boot 3.3, Java 21 |
| Three reports: Users, Departments, Projects | Seeded in `InMemoryReportDataStore`, configured in `reportConfig.tsx` |
| `GET /api/reports` (metadata) | `ReportController.catalog()` → `ReportService.catalog()` |
| `GET /api/reports/{users,departments,projects}` | `ReportController` — three explicit mappings |
| Landing page: browse, search, open reports | `LandingPage.tsx` — card grid + search |
| Table view per report | `ReportPage.tsx` + generic `DataTable.tsx` |
| Loading / empty / error states | `AsyncStates.tsx`, driven by `useApi` |
| Back navigation | `BackLink` in `ReportPage`, plus the brand link in the top bar |
| Single command to build + deploy | `docker compose up --build` |
| README, screenshots, assumptions | `README.md`, `docs/screenshots/`, README's tradeoffs section |
| Required columns per report | Column defs in `reportConfig.tsx` match the spec exactly |

---

## 2. Architecture at a glance

```
Browser
  │  http://localhost:3000
  ▼
┌─────────────────────────────┐
│ enfos-web (nginx container) │
│  • serves React bundle      │
│  • /api/* ──proxy──┐        │
└────────────────────┼────────┘
                     ▼   compose network (backend not exposed to host)
┌─────────────────────────────┐
│ enfos-api (Spring Boot)     │
│  Controller → Service →     │
│  ReportDataStore (interface)│
│        └─ InMemory impl     │
└─────────────────────────────┘
```

Key property: **the browser only ever talks to one origin.** In production
mode nginx proxies `/api` to the backend container; in dev mode the Vite dev
server does the same proxying to `localhost:8080`. Same-origin at all times →
**zero CORS configuration anywhere**, which is one less thing to misconfigure
and mirrors how internal tools typically deploy behind a reverse proxy.

---

## 3. Backend — decisions and reasoning

### Stack: Spring Boot 3.3 on Java 21, built with Maven
- The brief says "Java, Spring Boot preferred" — so Spring Boot.
- **Java 21** because it's the current LTS: records, modern GC, and the
  Temurin images are stable. Nothing exotic is required.
- **Maven over Gradle**: the most widely understood Java build; the
  `spring-boot-starter-parent` gives dependency management, UTF-8 source
  encoding, and the repackaging plugin with almost no configuration.

### Layered structure (controller → service → repository)
- `ReportController` — HTTP concerns only: mappings, query params.
- `ReportService` — owns the report catalog and delegates data access.
- `ReportDataStore` (interface) + `InMemoryReportDataStore` — the data seam.
- **Why an interface for mock data?** It's the swap point. The assessment
  allows in-memory data, but by putting it behind `ReportDataStore`, a
  JDBC/JPA implementation replaces one class and nothing above it changes.
  That's the honest answer to "how would you add a database?" — implement the
  interface, add a `@Profile` or config property to select it.

### DTOs as Java records
- `ReportMeta`, `UserRow`, `DepartmentRow`, `ProjectRow` are records:
  immutable, concise, and Jackson serializes them out of the box.
- Field names were chosen so the JSON keys are already frontend-friendly
  camelCase — no mapping layer needed on either side.

### The catalog endpoint (`/api/reports`)
- Returns `id, name, description, lastUpdated, rowCount, path`.
- **rowCount is computed from the live store** (`store.users().size()`), not
  hardcoded — the landing page can never show a count that disagrees with the
  table. Small thing, but it demonstrates "derive, don't duplicate."
- `lastUpdated` is static because mock data doesn't change; with a real DB it
  would be `MAX(updated_at)` per table. I'd say exactly that if asked.

### The `?delay=` query param
- In-memory data responds in ~1ms, which makes loading states unreviewable.
  The row endpoints accept an optional `delay` in ms (capped at 5000 so a typo
  can't hang requests). It exists purely to demo the loading UX honestly
  instead of faking it with a client-side sleep.

### Error behavior
- Unknown report path (e.g. `/api/reports/payroll`) → Spring's default **404**.
  I kept the three literal mappings rather than a generic `/{reportId}`
  because the spec fixes exactly three endpoints; wildcards would invite
  ambiguity (`/api/reports/users` vs `/{id}`) for zero benefit at this size.

### Tests
- `ReportApiTest` uses **MockMvc** against the full Spring context: catalog
  lists all three reports with positive row counts, each row endpoint returns
  the spec's required columns, unknown reports 404.
- This is contract-level testing — the cheapest tests that would catch the
  regressions that matter here (a renamed field, a broken mapping).

### Serialization detail
- `spring.jackson.serialization.write-dates-as-timestamps=false` so
  `LocalDate` serializes as `"2026-06-15"` instead of `[2026,6,15]`. The
  frontend then owns display formatting.

---

## 4. Frontend — decisions and reasoning

### Stack: React 18 + Vite + TypeScript
- **Vite over Create React App**: CRA is deprecated; Vite is the current
  standard — instant dev server, fast HMR, tiny config.
- **Vite over Next.js**: this is a pure client-rendered internal tool behind
  an API; SSR/file-routing would add machinery without benefit. If SEO or
  server rendering mattered, Next would be the conversation.
- **TypeScript** because typed API responses (`api/types.ts`) catch the most
  common integration bugs (renamed/missing fields) at compile time.

### Data fetching: a small custom hook (`useApi`)
- Discriminated-union state: `loading | error | success` — the UI can't be in
  an impossible state, and TypeScript narrows `data` to only exist on success.
- **AbortController on cleanup**: when the component unmounts or the path
  changes, the in-flight fetch is aborted. This kills two classic bugs: state
  updates on unmounted components, and a slow older response overwriting a
  newer one (race condition).
- **retry()** bumps an attempt counter that re-triggers the effect — that's
  what the error state's "Try again" button calls.
- **Why not TanStack Query?** At three GET endpoints with no caching,
  deduping, or mutations, a ~40-line hook is simpler to read, explain, and
  test. The moment the app needs cache invalidation or optimistic updates,
  TanStack Query is the right upgrade — and the call sites wouldn't change
  shape much.
- **Why not Redux?** All shared state here is *server* data plus two local
  search strings. Redux solves shared *client* state, which this app doesn't
  have. Using it would be architecture theater.
- **Why fetch over axios?** Native fetch does everything needed (JSON, abort
  signals). Axios would be one more dependency for interceptors nobody uses
  here.

### Config-driven reports (`reportConfig.tsx`) — the "scalable" story
- Each report is one config object: `id`, `endpoint`, `searchHint`, and a
  typed `ColumnDef[]` (key, label, numeric?, custom render?).
- `DataTable` is fully generic — it renders whatever columns it's given and
  knows nothing about users/departments/projects.
- **Adding a fourth report = one backend endpoint + one config entry.** No new
  page, no new table, no copy-paste. That's the concrete answer to "how does
  this scale?"

### Component breakdown
- `pages/LandingPage` — owns catalog fetch + report search state.
- `pages/ReportPage` — resolves the URL param against the config, owns the
  row fetch + in-table filter state; renders the four possible bodies
  (loading / error / truly-empty / no-matches) explicitly.
- `components/DataTable` — generic, sortable; memoized sort; nulls sink to
  the bottom; numeric columns sort numerically and right-align.
- `components/AsyncStates` — one home for Loading/Error/Empty so every screen
  fails and waits identically. `role="status"` on loading, `role="alert"` on
  errors for screen readers.
- `components/StatusPill` — maps known statuses to color tones and falls back
  to neutral for unknown values, so a new backend status can't break the UI.
- `components/SearchInput` — controlled input shared by both pages.

### Routing
- React Router: `/` and `/reports/:reportId`. Deep links work (nginx
  `try_files` falls back to `index.html`); unknown report ids render a
  friendly error with a way back; unknown paths hit a catch-all route.
- `<ReportView key={config.id}>` — keying by report id guarantees filter/sort
  state resets if navigation ever goes report-to-report directly.

### Sorting & filtering: client-side, deliberately
- Every report is < 100 rows, so shipping all rows and sorting/filtering in
  the browser is instant and removes a whole class of API complexity.
- The line I'd draw: **thousands of rows or user-generated data** → move
  sort/filter/pagination server-side (query params: `?sort=name&dir=asc&page=2`),
  return a paged envelope (`{rows, total, page}`), and consider row
  virtualization (e.g. TanStack Virtual) on the client.

### Styling: plain CSS with design tokens
- One stylesheet, CSS variables for color/radius/shadow tokens, consistent
  card/table/pill/state components.
- **Why not Tailwind/MUI?** For a take-home judged on "component design and
  effective, consistent styling," hand-rolled CSS shows the actual skill; a
  component library would hide it. Tokens keep it consistent; the file stays
  small.
- Responsive: the card grid is `auto-fill/minmax` (stacks on mobile), the
  table wraps in `overflow-x: auto` so narrow screens scroll the table, not
  the page. Verified with 390px-wide screenshots.

### Dates
- `formatDate` parses `"2026-06-15"` into a *local* date on purpose — naive
  `new Date("2026-06-15")` is parsed as UTC midnight and shows the previous
  day in negative-offset timezones. Small correctness detail worth mentioning.

---

## 5. Build & deploy — decisions and reasoning

### The single command: `docker compose up --build`
- **Why Docker Compose over a shell script or make target?** It's the only
  option of the three that also supplies the runtimes. A reviewer needs no
  JDK, no Maven, no Node — just Docker. A script that shells out to `mvn` and
  `npm` breaks on the first machine missing them (mine, ironically, has no
  local JDK — which is exactly why the containers do the building).
- **Multi-stage builds**:
  - Backend: `maven:3.9-eclipse-temurin-21` builds the jar → copied into a
    slim `eclipse-temurin:21-jre` runtime. Build tools never ship.
  - Frontend: `node:22-alpine` builds the Vite bundle → copied into
    `nginx:1.27-alpine`. The runtime image is nginx + static files, no Node.
  - Dependency layers are cached: `pom.xml`/`package.json` are copied and
    resolved *before* the source, so code edits rebuild in seconds.
- **nginx does two jobs**: serve the SPA (with `try_files` fallback for deep
  links) and proxy `/api/` to `backend:8080` over the compose network.
- **Only port 3000 is published.** The API container is reachable solely
  through the proxy — the same posture you'd want in a real deployment.
- **Healthcheck + `depends_on: condition: service_healthy`**: nginx doesn't
  start until the API socket accepts connections (a bash `/dev/tcp` probe —
  the JRE image has no curl/wget), so the first page load can't 502.
- Container names are pinned (`enfos-api`, `enfos-web`) under project name
  `enfos` so they're unambiguous in Docker Desktop.

---

## 6. Questions I'd expect, with my answers

**Q: Walk me through what happens when I open `/reports/users`.**
Nginx serves `index.html` (try_files fallback), React Router matches
`/reports/:reportId`, `ReportPage` looks up `users` in the report config,
`useApi` fires `GET /api/reports/users` (proxied by nginx to the backend),
the hook renders the loading state, then either success (DataTable with the
config's columns) or the error state with retry.

**Q: How do you prevent race conditions in data fetching?**
The hook aborts the in-flight request on cleanup — any path change or unmount
cancels the old fetch before the new one starts, so a stale response can never
land. Abort errors are swallowed deliberately since they're navigation, not
failure.

**Q: How would you add a database?**
Implement `ReportDataStore` with Spring Data JPA (entities mirroring the
records, or projections straight onto them), select the implementation via a
profile/property, and derive `lastUpdated` from `MAX(updated_at)`. Controller,
service, and the entire frontend are untouched.

**Q: How would this handle 100k rows?**
Server-side pagination and sorting (`?page, size, sort, dir` + a
`{rows,total}` envelope), the table emits sort/page events instead of sorting
locally, debounced server-side search, and row virtualization if we render
long pages. I'd also stream exports rather than shipping everything to the
browser.

**Q: Why is there no CORS config?**
Because there's no cross-origin request anywhere: Vite proxies `/api` in dev,
nginx proxies it in the containerized setup. Same-origin by construction is
simpler and safer than maintaining an allowlist.

**Q: Why not Redux / TanStack Query / axios / Tailwind?**
(See §4 — the shared thread: every dependency has to pay for itself; at this
size each of those adds concept-count without removing real code.)

**Q: What's deliberately out of scope?**
Auth (internal tool slice — would be SSO + API enforcement), persistence
(allowed by the brief; seam exists), frontend unit tests (the API contract
tests cover the riskiest seam; with more time I'd add vitest tests for the
filter/sort logic and a Playwright smoke test), i18n, and export-to-CSV.

**Q: What would you do next with another day?**
CSV export per report (server-generated from the same data), a Playwright
e2e that walks landing → search → open → sort → back, column visibility
toggles, and CI (GitHub Actions: mvn test + tsc + docker build).

**Q: Where did AI tools fit in?**
I used them as an accelerator for scaffolding and boilerplate, the way the
brief encourages. Every decision in this document is one I can defend line by
line — the architecture choices (proxy over CORS, interface seam over
hardcoded store, config-driven tables, abort-based fetch lifecycle) are the
parts I'd write the same way with or without the tooling.

---

## 7. Demo script (2 minutes)

1. `docker compose up --build` → open http://localhost:3000.
2. Landing: three cards, live row counts. Type "proj" → cards filter; type
   gibberish → empty state with guidance.
3. Open Projects: sort by Status (pills group), sort by Start; filter "data"
   → 2 rows; filter gibberish → "no rows match" empty state.
4. Loading state: open `/api/reports/users?delay=1500` in a tab, or throttle
   in devtools → spinner state on the report page.
5. Error state: `docker compose stop backend`, hit refresh on a report →
   error card; `docker compose start backend`, click **Try again** → table
   returns. (This is the retry story end-to-end.)
6. Narrow the window → cards stack, table scrolls horizontally.
