package com.enfos.reporting.repository;

import com.enfos.reporting.model.DepartmentRow;
import com.enfos.reporting.model.ProjectRow;
import com.enfos.reporting.model.UserRow;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * Deterministic seed data. Hardcoded rather than faker-generated so every run
 * (and every screenshot) shows the same rows, and reviewers can diff behavior
 * against a stable dataset.
 */
@Repository
public class InMemoryReportDataStore implements ReportDataStore {

    private static final List<UserRow> USERS = List.of(
            new UserRow("U-1001", "Sarah Mitchell", "sarah.mitchell@enfos.com", "Admin", "Active", LocalDate.of(2023, 2, 14)),
            new UserRow("U-1002", "James Okafor", "james.okafor@enfos.com", "Analyst", "Active", LocalDate.of(2023, 3, 2)),
            new UserRow("U-1003", "Priya Raman", "priya.raman@enfos.com", "Manager", "Active", LocalDate.of(2023, 3, 18)),
            new UserRow("U-1004", "Daniel Alvarez", "daniel.alvarez@enfos.com", "Analyst", "Suspended", LocalDate.of(2023, 5, 9)),
            new UserRow("U-1005", "Emily Chen", "emily.chen@enfos.com", "Viewer", "Active", LocalDate.of(2023, 6, 27)),
            new UserRow("U-1006", "Marcus Webb", "marcus.webb@enfos.com", "Manager", "Active", LocalDate.of(2023, 8, 1)),
            new UserRow("U-1007", "Anna Kowalski", "anna.kowalski@enfos.com", "Analyst", "Active", LocalDate.of(2023, 9, 15)),
            new UserRow("U-1008", "Tom Nguyen", "tom.nguyen@enfos.com", "Viewer", "Invited", LocalDate.of(2023, 11, 4)),
            new UserRow("U-1009", "Rachel Adeyemi", "rachel.adeyemi@enfos.com", "Admin", "Active", LocalDate.of(2024, 1, 8)),
            new UserRow("U-1010", "Kevin O'Brien", "kevin.obrien@enfos.com", "Analyst", "Active", LocalDate.of(2024, 2, 21)),
            new UserRow("U-1011", "Lena Fischer", "lena.fischer@enfos.com", "Manager", "Active", LocalDate.of(2024, 4, 3)),
            new UserRow("U-1012", "Omar Haddad", "omar.haddad@enfos.com", "Viewer", "Active", LocalDate.of(2024, 5, 30)),
            new UserRow("U-1013", "Grace Liu", "grace.liu@enfos.com", "Analyst", "Suspended", LocalDate.of(2024, 7, 12)),
            new UserRow("U-1014", "Peter Novak", "peter.novak@enfos.com", "Viewer", "Active", LocalDate.of(2024, 9, 25)),
            new UserRow("U-1015", "Sofia Reyes", "sofia.reyes@enfos.com", "Analyst", "Active", LocalDate.of(2024, 11, 11)),
            new UserRow("U-1016", "David Kim", "david.kim@enfos.com", "Manager", "Active", LocalDate.of(2025, 1, 16)),
            new UserRow("U-1017", "Ingrid Larsen", "ingrid.larsen@enfos.com", "Viewer", "Invited", LocalDate.of(2025, 3, 5)),
            new UserRow("U-1018", "Hassan Ali", "hassan.ali@enfos.com", "Analyst", "Active", LocalDate.of(2025, 5, 22)),
            new UserRow("U-1019", "Maria Santos", "maria.santos@enfos.com", "Admin", "Active", LocalDate.of(2025, 8, 7)),
            new UserRow("U-1020", "Jack Thompson", "jack.thompson@enfos.com", "Viewer", "Active", LocalDate.of(2025, 10, 19)),
            new UserRow("U-1021", "Yuki Tanaka", "yuki.tanaka@enfos.com", "Analyst", "Active", LocalDate.of(2026, 1, 12)),
            new UserRow("U-1022", "Claire Dubois", "claire.dubois@enfos.com", "Viewer", "Invited", LocalDate.of(2026, 3, 28))
    );

    private static final List<DepartmentRow> DEPARTMENTS = List.of(
            new DepartmentRow("D-01", "Engineering", "Priya Raman", 34, "Austin, TX"),
            new DepartmentRow("D-02", "Finance", "Marcus Webb", 12, "Chicago, IL"),
            new DepartmentRow("D-03", "Operations", "Lena Fischer", 21, "Denver, CO"),
            new DepartmentRow("D-04", "Sales", "David Kim", 18, "New York, NY"),
            new DepartmentRow("D-05", "Marketing", "Sarah Mitchell", 9, "Remote"),
            new DepartmentRow("D-06", "Human Resources", "Rachel Adeyemi", 6, "Chicago, IL"),
            new DepartmentRow("D-07", "Customer Success", "Maria Santos", 15, "Austin, TX"),
            new DepartmentRow("D-08", "Data & Analytics", "James Okafor", 11, "Remote")
    );

    private static final List<ProjectRow> PROJECTS = List.of(
            new ProjectRow("P-2001", "Billing Platform Migration", "Engineering", "Priya Raman", "Active", LocalDate.of(2025, 9, 1), null),
            new ProjectRow("P-2002", "Q2 Revenue Forecast", "Finance", "Marcus Webb", "Completed", LocalDate.of(2026, 1, 6), LocalDate.of(2026, 4, 2)),
            new ProjectRow("P-2003", "Vendor Consolidation", "Operations", "Lena Fischer", "Active", LocalDate.of(2025, 11, 10), null),
            new ProjectRow("P-2004", "Enterprise CRM Rollout", "Sales", "David Kim", "On Hold", LocalDate.of(2025, 6, 16), null),
            new ProjectRow("P-2005", "Brand Refresh", "Marketing", "Sarah Mitchell", "Completed", LocalDate.of(2025, 2, 3), LocalDate.of(2025, 8, 29)),
            new ProjectRow("P-2006", "Onboarding Revamp", "Human Resources", "Rachel Adeyemi", "Active", LocalDate.of(2026, 2, 9), null),
            new ProjectRow("P-2007", "Churn Early-Warning Model", "Data & Analytics", "James Okafor", "Active", LocalDate.of(2025, 12, 1), null),
            new ProjectRow("P-2008", "Support SLA Dashboard", "Customer Success", "Maria Santos", "Completed", LocalDate.of(2025, 4, 14), LocalDate.of(2025, 10, 6)),
            new ProjectRow("P-2009", "Data Warehouse v2", "Data & Analytics", "Grace Liu", "Active", LocalDate.of(2025, 7, 21), null),
            new ProjectRow("P-2010", "SOC 2 Certification", "Engineering", "Anna Kowalski", "Active", LocalDate.of(2025, 10, 13), null),
            new ProjectRow("P-2011", "Expense Policy Automation", "Finance", "Kevin O'Brien", "Cancelled", LocalDate.of(2025, 3, 24), LocalDate.of(2025, 5, 30)),
            new ProjectRow("P-2012", "Field Sales Enablement", "Sales", "Sofia Reyes", "Completed", LocalDate.of(2025, 1, 20), LocalDate.of(2025, 7, 11)),
            new ProjectRow("P-2013", "Warehouse Slotting Optimization", "Operations", "Omar Haddad", "Active", LocalDate.of(2026, 3, 2), null),
            new ProjectRow("P-2014", "Lifecycle Email Program", "Marketing", "Emily Chen", "Active", LocalDate.of(2026, 4, 20), null),
            new ProjectRow("P-2015", "Internal Mobility Portal", "Human Resources", "Ingrid Larsen", "On Hold", LocalDate.of(2025, 8, 18), null)
    );

    @Override
    public List<UserRow> users() {
        return USERS;
    }

    @Override
    public List<DepartmentRow> departments() {
        return DEPARTMENTS;
    }

    @Override
    public List<ProjectRow> projects() {
        return PROJECTS;
    }
}
