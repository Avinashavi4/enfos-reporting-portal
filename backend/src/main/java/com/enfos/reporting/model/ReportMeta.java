package com.enfos.reporting.model;

import java.time.LocalDate;

/**
 * Catalog entry for one report. rowCount is computed from the live data store
 * so the landing page always reflects what the detail endpoint will return.
 */
public record ReportMeta(
        String id,
        String name,
        String description,
        LocalDate lastUpdated,
        int rowCount,
        String path
) {
}
