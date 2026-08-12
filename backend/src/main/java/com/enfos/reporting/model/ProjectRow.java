package com.enfos.reporting.model;

import java.time.LocalDate;

public record ProjectRow(
        String projectId,
        String projectName,
        String department,
        String owner,
        String status,
        LocalDate startDate,
        LocalDate endDate  // null while the project is still running
) {
}
