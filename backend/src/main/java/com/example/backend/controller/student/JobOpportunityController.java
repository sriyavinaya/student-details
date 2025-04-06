package com.example.backend.controller.student;

import com.example.backend.model.Student;
import com.example.backend.model.Faculty;
import com.example.backend.model.student.JobOpportunity;
import com.example.backend.model.student.JobOpportunity.JobType;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.student.JobOpportunityService;
import com.example.backend.service.student.MainService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/job-opportunity")
public class JobOpportunityController {

    private final Logger logger = LoggerFactory.getLogger(JobOpportunityController.class);

    @Autowired
    private JobOpportunityService jobOpportunityService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MainService mainService;

    @PostMapping(value = "/submit", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    @Transactional
    public ResponseEntity<Map<String, Object>> submitJobOpportunity(
        @RequestParam("studentId") Long studentId,
        @RequestParam("title") String title,
        @RequestParam("description") String description,
        @RequestParam("companyName") String companyName,
        @RequestParam("startDate") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
        @RequestParam("role") String role,
        @RequestParam("type") JobType type,
        @RequestParam("documentPath") MultipartFile documentPath,
        @RequestParam(value = "duration", required = false) String duration,
        @RequestParam(value = "stipend", required = false) String stipend,
        @RequestParam(value = "ctc", required = false) String ctc) {

        try {
            // Validate document exists
            if (documentPath == null || documentPath.isEmpty()) {
                throw new IllegalArgumentException("Document proof is required");
            }

            // 1. Get and validate student
            Student student = userRepository.findById(studentId)
                .filter(user -> user instanceof Student)
                .map(user -> (Student) user)
                .orElseThrow(() -> new IllegalArgumentException("Student not found with ID: " + studentId));

            // 2. Get faculty from student (must exist)
            Faculty faculty = student.getFaculty();
            if (faculty == null) {
                throw new IllegalStateException("Student with ID " + studentId + " has no faculty assigned");
            }

            // 3. Handle file upload (now mandatory)
            String documentLink = mainService.saveFile(documentPath);
            if (documentLink == null) {
                throw new IOException("Failed to save document");
            }

            // 4. Create and populate JobOpportunity based on type
            JobOpportunity opportunity = new JobOpportunity();
            opportunity.setTitle(title);
            opportunity.setDescription(description);
            opportunity.setStudent(student);
            opportunity.setFaculty(faculty);
            opportunity.setCompanyName(companyName);
            opportunity.setStartDate(startDate);
            opportunity.setRole(role);
            opportunity.setType(type);
            opportunity.setDocumentPath(documentLink);
            opportunity.setVerificationStatus("Pending");

            // Set type-specific fields
            if (type == JobType.INTERNSHIP) {
                opportunity.setDuration(duration);
                opportunity.setStipend(stipend);
            } else if (type == JobType.PLACEMENT) {
                opportunity.setCtc(ctc);
            }

            // 5. Save and verify
            JobOpportunity savedOpportunity = jobOpportunityService.saveJobOpportunity(opportunity);

            // 6. Return success response
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Job Opportunity submitted successfully");
            response.put("opportunityId", savedOpportunity.getId());
            response.put("documentPath", savedOpportunity.getDocumentPath());

            logger.info("JobOpportunity created - ID: {}, Student: {}", savedOpportunity.getId(), studentId);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Error submitting job opportunity", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<JobOpportunity>> getOpportunitiesByStudentId(@PathVariable Long studentId) {
        List<JobOpportunity> opportunities = jobOpportunityService.getOpportunitiesByStudentId(studentId);
        return new ResponseEntity<>(opportunities, HttpStatus.OK);
    }
    
    @GetMapping("/student/object/{studentId}")
    public ResponseEntity<List<JobOpportunity>> getPendingAndApprovedOpportunitiesByStudent(
        @PathVariable Long studentId) {
        
        Student student = userRepository.findById(studentId)
            .filter(user -> user instanceof Student)
            .map(user -> (Student) user)
            .orElseThrow(() -> new IllegalArgumentException("Student not found"));
        
        List<JobOpportunity> opportunities = jobOpportunityService.getPendingAndApprovedOpportunitiesByStudent(student);
        return ResponseEntity.ok(opportunities);
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<JobOpportunity>> getOpportunitiesByType(@PathVariable JobType type) {
        List<JobOpportunity> opportunities = jobOpportunityService.getOpportunitiesByType(type);
        return ResponseEntity.ok(opportunities);
    }
}