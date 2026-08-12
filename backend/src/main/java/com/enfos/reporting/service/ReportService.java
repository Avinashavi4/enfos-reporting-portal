package com.enfos.reporting.service;

import com.enfos.reporting.model.DepartmentRow;
import com.enfos.reporting.model.ProjectRow;
import com.enfos.reporting.model.ReportMeta;
import com.enfos.reporting.model.UserRow;
import com.enfos.reporting.repository.ReportDataStore;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ReportService {

    private final ReportDataStore store;

    public ReportService(ReportDataStore store) {
        this.store = store;
    }

    /**
     * The report catalog shown on the landing page. Row counts are computed
     * from the store so the catalog can never drift from the detail endpoints.
     * lastUpdated is static here because the mock data doesn't change; with a
     * real database this would come from a MAX(updated_at) per table.
     */
    public List<ReportMeta> catalog() {
        return List.of(
                new ReportMeta(
                        "users",
                        "Users",
                        "People in the system — accounts, roles, and current status.",
                        LocalDate.of(2026, 6, 15),
                        store.users().size(),
                        "/api/reports/users"),
                new ReportMeta(
                        "departments",
                        "Departments",
                        "Org structure — departments, managers, headcount, and locations.",
                        LocalDate.of(2026, 6, 12),
                        store.departments().size(),
                        "/api/reports/departments"),
                new ReportMeta(
                        "projects",
                        "Projects",
                        "Active and past work — ownership, status, and timelines.",
                        LocalDate.of(2026, 6, 17),
                        store.projects().size(),
                        "/api/reports/projects")
        );
    }

    public List<UserRow> users() {
        return store.users();
    }

    public List<DepartmentRow> departments() {
        return store.departments();
    }

    public List<ProjectRow> projects() {
        return store.projects();
    }
}
