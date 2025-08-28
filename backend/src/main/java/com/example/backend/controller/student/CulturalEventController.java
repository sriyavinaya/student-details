package com.example.backend.controller.student;

import com.example.backend.model.Student;
import com.example.backend.model.Faculty;
import com.example.backend.model.student.CulturalEvent;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.student.CulturalEventService;
import com.example.backend.service.student.MainService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.format.annotation.DateTimeFormat;
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
@RequestMapping("/api/cultural")
public class CulturalEventController {

    private final Logger logger = LoggerFactory.getLogger(CulturalEventController.class);

    private final CulturalEventService culturalEventService;
    private final UserRepository userRepository;
    private final MainService mainService;

    public CulturalEventController(CulturalEventService culturalEventService,
                                  UserRepository userRepository,
                                  MainService mainService) {
        this.culturalEventService = culturalEventService;
        this.userRepository = userRepository;
        this.mainService = mainService;
    }

    @PostMapping(value = "/submit", consumes = {"multipart/form-data"})
    public ResponseEntity<Map<String, Object>> submitCulturalEvent(
            @RequestParam("studentId") Long studentId,
            @RequestParam("title") String title,
            @RequestParam("eventDate") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate eventDate,
            @RequestParam("host") String host,
            @RequestParam("category") String category,
            @RequestParam("achievement") String achievement,
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

            CulturalEvent culturalEvent = new CulturalEvent();
            culturalEvent.setTitle(title);
            culturalEvent.setDescription(description);
            culturalEvent.setStudent(student);
            culturalEvent.setFaculty(faculty);
            culturalEvent.setEventDate(eventDate);
            culturalEvent.setHost(host);
            culturalEvent.setCategory(category);
            culturalEvent.setAchievement(achievement);
            culturalEvent.setDocumentPath(documentLink);
            culturalEvent.setFlag(false); // Default verification status

            CulturalEvent savedEvent = culturalEventService.saveCulturalEvent(culturalEvent);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Cultural Event submitted successfully");
            response.put("id", savedEvent.getId());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Error submitting cultural event", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<CulturalEvent>> getAllCulturalEvents() {
        List<CulturalEvent> events = culturalEventService.getAllCulturalEvents();
        return ResponseEntity.ok(events);
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<CulturalEvent>> getByStudentId(@PathVariable Long studentId) {
        List<CulturalEvent> events = culturalEventService.getByStudentId(studentId);
        return ResponseEntity.ok(events);
    }

    @GetMapping("/student/object/{studentId}")
    public ResponseEntity<List<CulturalEvent>> getPendingAndApprovedEventsByStudent(@PathVariable Long studentId) {
        Student student = userRepository.findById(studentId)
            .filter(user -> user instanceof Student)
            .map(user -> (Student) user)
            .orElseThrow(() -> new IllegalArgumentException("Student not found"));
        
        List<CulturalEvent> events = culturalEventService.getPendingAndApprovedEventsByStudent(student);
        return new ResponseEntity<>(events, HttpStatus.OK);
    }
}