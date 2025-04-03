package com.example.backend.controller.student;

import com.example.backend.model.Student;
import com.example.backend.model.Faculty;
import com.example.backend.model.student.ClubsAndSocieties;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.student.ClubsAndSocietiesService;
import com.example.backend.service.student.MainService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/clubs")
public class ClubsAndSocietiesController {

    private final Logger logger = LoggerFactory.getLogger(ClubsAndSocietiesController.class);

    private final ClubsAndSocietiesService clubsAndSocietiesService;
    private final UserRepository userRepository;
    private final MainService mainService;

    public ClubsAndSocietiesController(ClubsAndSocietiesService clubsAndSocietiesService, 
                                      UserRepository userRepository, 
                                      MainService mainService) {
        this.clubsAndSocietiesService = clubsAndSocietiesService;
        this.userRepository = userRepository;
        this.mainService = mainService;
    }

    @PostMapping(value = "/submit", consumes = {"multipart/form-data"})
    public ResponseEntity<Map<String, Object>> submitClubsAndSocieties(
            @RequestParam("studentId") Long studentId,
            @RequestParam("title") String title,
            @RequestParam("position") String position,
            @RequestParam("startDate") LocalDate startDate,
            @RequestParam(value = "endDate", required = false) LocalDate endDate,
            @RequestParam("clubCategory") String clubCategory,
            @RequestParam("description") String description,
            @RequestParam(value = "documentPath") MultipartFile documentPath) {

        try {
            Student student = userRepository.findById(studentId)
                    .filter(user -> user instanceof Student)
                    .map(user -> (Student) user)
                    .orElseThrow(() -> new IllegalArgumentException("Student not found with ID: " + studentId));

            Faculty faculty = student.getFaculty();
            if (faculty == null) {
                throw new IllegalStateException("Student has no faculty assigned");
            }

            String documentLink = mainService.saveFile(documentPath);
            if (documentLink == null) {
                throw new IOException("Failed to save document");
            }

            ClubsAndSocieties clubsAndSocieties = new ClubsAndSocieties();
            clubsAndSocieties.setTitle(title);
            clubsAndSocieties.setDescription(description);
            clubsAndSocieties.setStudent(student);
            clubsAndSocieties.setFaculty(faculty);
            clubsAndSocieties.setPosition(position);
            clubsAndSocieties.setStartDate(startDate);
            clubsAndSocieties.setEndDate(endDate);
            clubsAndSocieties.setClubCategory(clubCategory);
            clubsAndSocieties.setDocumentPath(documentLink);
            clubsAndSocieties.setFlag(false); // Default verification status

            ClubsAndSocieties savedEntry = clubsAndSocietiesService.saveClubsAndSocieties(clubsAndSocieties);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Clubs and Societies entry submitted successfully");
            response.put("id", savedEntry.getId());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Error submitting clubs and societies entry", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<ClubsAndSocieties>> getAllClubsAndSocieties() {
        List<ClubsAndSocieties> entries = clubsAndSocietiesService.getAllClubsAndSocieties();
        return ResponseEntity.ok(entries);
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<ClubsAndSocieties>> getByStudentId(@PathVariable Long studentId) {
        List<ClubsAndSocieties> entries = clubsAndSocietiesService.getByStudentId(studentId);
        return ResponseEntity.ok(entries);
    }

    @GetMapping("/student/object/{studentId}")
    public ResponseEntity<List<ClubsAndSocieties>> getByStudentObject(@PathVariable Long studentId) {
        Student student = userRepository.findById(studentId)
            .filter(user -> user instanceof Student)
            .map(user -> (Student) user)
            .orElseThrow(() -> new IllegalArgumentException("Student not found"));
        
        List<ClubsAndSocieties> entries = clubsAndSocietiesService.getByStudent(student);
        return new ResponseEntity<>(entries, HttpStatus.OK);
    }
}