package com.enfos.reporting.model;

import java.time.LocalDate;

public record UserRow(
        String userId,
        String name,
        String email,
        String role,
        String status,
        LocalDate createdDate
) {
}
