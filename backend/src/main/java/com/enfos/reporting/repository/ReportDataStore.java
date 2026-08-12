package com.enfos.reporting.repository;

import com.enfos.reporting.model.DepartmentRow;
import com.enfos.reporting.model.ProjectRow;
import com.enfos.reporting.model.UserRow;

import java.util.List;

/**
 * Data access seam for the reports. The current implementation is in-memory
 * (the assessment allows mock data); a JDBC/JPA implementation can replace it
 * without touching the service or controller layers.
 */
public interface ReportDataStore {

    List<UserRow> users();

    List<DepartmentRow> departments();

    List<ProjectRow> projects();
}
