package com.enfos.reporting;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.greaterThan;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class ReportApiTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void catalogListsAllThreeReports() throws Exception {
        mockMvc.perform(get("/api/reports"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(3)))
                .andExpect(jsonPath("$[0].id").value("users"))
                .andExpect(jsonPath("$[1].id").value("departments"))
                .andExpect(jsonPath("$[2].id").value("projects"))
                .andExpect(jsonPath("$[0].rowCount", greaterThan(0)));
    }

    @Test
    void usersReportReturnsRequiredColumns() throws Exception {
        mockMvc.perform(get("/api/reports/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].userId").exists())
                .andExpect(jsonPath("$[0].name").exists())
                .andExpect(jsonPath("$[0].email").exists())
                .andExpect(jsonPath("$[0].role").exists())
                .andExpect(jsonPath("$[0].status").exists())
                .andExpect(jsonPath("$[0].createdDate").exists());
    }

    @Test
    void departmentsReportReturnsRequiredColumns() throws Exception {
        mockMvc.perform(get("/api/reports/departments"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].departmentId").exists())
                .andExpect(jsonPath("$[0].departmentName").exists())
                .andExpect(jsonPath("$[0].manager").exists())
                .andExpect(jsonPath("$[0].employeeCount").exists())
                .andExpect(jsonPath("$[0].location").exists());
    }

    @Test
    void projectsReportReturnsRequiredColumns() throws Exception {
        mockMvc.perform(get("/api/reports/projects"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].projectId").exists())
                .andExpect(jsonPath("$[0].projectName").exists())
                .andExpect(jsonPath("$[0].department").exists())
                .andExpect(jsonPath("$[0].owner").exists())
                .andExpect(jsonPath("$[0].status").exists())
                .andExpect(jsonPath("$[0].startDate").exists());
    }

    @Test
    void unknownReportReturns404() throws Exception {
        mockMvc.perform(get("/api/reports/payroll"))
                .andExpect(status().isNotFound());
    }
}
