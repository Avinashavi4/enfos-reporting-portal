/** Shapes returned by the reporting API. Kept in one place so the whole app
 *  shares a single source of truth for what the backend sends. */

export interface ReportMeta {
  id: string;
  name: string;
  description: string;
  lastUpdated: string; // ISO date
  rowCount: number;
  path: string;
}

export interface UserRow {
  userId: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdDate: string;
}

export interface DepartmentRow {
  departmentId: string;
  departmentName: string;
  manager: string;
  employeeCount: number;
  location: string;
}

export interface ProjectRow {
  projectId: string;
  projectName: string;
  department: string;
  owner: string;
  status: string;
  startDate: string;
  endDate: string | null;
}

export type ReportRow = UserRow | DepartmentRow | ProjectRow;
