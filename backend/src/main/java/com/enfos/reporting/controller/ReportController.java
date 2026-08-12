package com.enfos.reporting.controller;

import com.enfos.reporting.model.DepartmentRow;
import com.enfos.reporting.model.ProjectRow;
import com.enfos.reporting.model.ReportMeta;
import com.enfos.reporting.model.UserRow;
import com.enfos.reporting.service.ReportService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    /** Cap for the demo delay so a typo can't hang a request for minutes. */
    private static final long MAX_DELAY_MS = 5_000;

    private final ReportService service;

    public ReportController(ReportService service) {
        this.service = service;
    }

    @GetMapping
    public List<ReportMeta> catalog() {
        return service.catalog();
    }

    @GetMapping("/users")
    public List<UserRow> users(@RequestParam(required = false) Long delay) {
        simulateLatency(delay);
        return service.users();
    }

    @GetMapping("/departments")
    public List<DepartmentRow> departments(@RequestParam(required = false) Long delay) {
        simulateLatency(delay);
        return service.departments();
    }

    @GetMapping("/projects")
    public List<ProjectRow> projects(@RequestParam(required = false) Long delay) {
        simulateLatency(delay);
        return service.projects();
    }

    /**
     * Optional ?delay=<ms> on the row endpoints. In-memory data returns
     * instantly, which makes loading states impossible to see in a demo; this
     * makes them reviewable (e.g. /api/reports/users?delay=1500).
     */
    private void simulateLatency(Long delayMs) {
        if (delayMs == null || delayMs <= 0) {
            return;
        }
        try {
            Thread.sleep(Math.min(delayMs, MAX_DELAY_MS));
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}
