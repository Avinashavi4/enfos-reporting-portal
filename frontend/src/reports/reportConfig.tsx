import type { ReactNode } from "react";
import type { DepartmentRow, ProjectRow, UserRow } from "../api/types";
import { StatusPill } from "../components/StatusPill";
import { formatDate } from "../lib/format";

/** One column of a report table: which field it reads, how it's labeled, and
 *  (optionally) how the cell renders and whether it sorts as a number. */
export interface ColumnDef<Row> {
  key: keyof Row & string;
  label: string;
  numeric?: boolean;
  render?: (row: Row) => ReactNode;
}

/** Everything the UI needs to know about one report. The landing page's cards
 *  come from the API catalog; this config supplies the table shape once a
 *  report is opened. Adding a report = one new entry here + a backend endpoint. */
export interface ReportConfig<Row> {
  id: string;
  endpoint: string;
  columns: ColumnDef<Row>[];
  searchHint: string;
}

const users: ReportConfig<UserRow> = {
  id: "users",
  endpoint: "/api/reports/users",
  searchHint: "Search by name, email, role…",
  columns: [
    { key: "userId", label: "User ID" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
    { key: "status", label: "Status", render: (r) => <StatusPill value={r.status} /> },
    { key: "createdDate", label: "Created", render: (r) => formatDate(r.createdDate) },
  ],
};

const departments: ReportConfig<DepartmentRow> = {
  id: "departments",
  endpoint: "/api/reports/departments",
  searchHint: "Search by department, manager, location…",
  columns: [
    { key: "departmentId", label: "Department ID" },
    { key: "departmentName", label: "Department" },
    { key: "manager", label: "Manager" },
    { key: "employeeCount", label: "Employees", numeric: true },
    { key: "location", label: "Location" },
  ],
};

const projects: ReportConfig<ProjectRow> = {
  id: "projects",
  endpoint: "/api/reports/projects",
  searchHint: "Search by project, owner, department…",
  columns: [
    { key: "projectId", label: "Project ID" },
    { key: "projectName", label: "Project" },
    { key: "department", label: "Department" },
    { key: "owner", label: "Owner" },
    { key: "status", label: "Status", render: (r) => <StatusPill value={r.status} /> },
    { key: "startDate", label: "Start", render: (r) => formatDate(r.startDate) },
    { key: "endDate", label: "End", render: (r) => (r.endDate ? formatDate(r.endDate) : "—") },
  ],
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const REPORTS: Record<string, ReportConfig<any>> = {
  users,
  departments,
  projects,
};
