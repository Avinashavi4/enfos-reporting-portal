package com.enfos.reporting.model;

public record DepartmentRow(
        String departmentId,
        String departmentName,
        String manager,
        int employeeCount,
        String location
) {
}
