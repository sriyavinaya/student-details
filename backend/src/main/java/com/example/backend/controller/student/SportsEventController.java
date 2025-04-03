package com.example.backend.controller.student;

import com.example.backend.model.Student;
import com.example.backend.model.Faculty;
import com.example.backend.model.student.SportsEvent;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.student.SportsEventService;
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
@RequestMapping("/api/sports")
public class SportsEventController {

    private final Logger logger = LoggerFactory.getLogger(SportsEventController.class);

    private final SportsEventService sportsEventService;
    private final UserRepository userRepository;
    private final MainService mainService;

    public SportsEventController(SportsEventService sportsEventService,
                                UserRepository userRepository,
                                MainService mainService) {
        this.sportsEventService = sportsEventService;
        this.userRepository = userRepository;
        this.mainService = mainService;
    }

    @PostMapping(value = "/submit", consumes = {"multipart/form-data"})
    public ResponseEntity<Map<String, Object>> submitSportsEvent(
            @RequestParam("studentId") Long studentId,
            @RequestParam("title") String title,
            @RequestParam("eventDate") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate eventDate,
            @RequestParam("host") String host,
            @RequestParam("category") String category,
            @RequestParam("achievement") String achievement,
            @RequestParam("eventLevel") String eventLevel,
            @RequestParam("role") String role,
            @RequestParam("outcome") String outcome,
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

            SportsEvent sportsEvent = new SportsEvent();
            sportsEvent.setTitle(title);
            sportsEvent.setDescription(description);
            sportsEvent.setStudent(student);
            sportsEvent.setFaculty(faculty);
            sportsEvent.setEventDate(eventDate);
            sportsEvent.setHost(host);
            sportsEvent.setCategory(category);
            sportsEvent.setAchievement(achievement);
            sportsEvent.setEventLevel(eventLevel);
            sportsEvent.setRole(role);
            sportsEvent.setOutcome(outcome);
            sportsEvent.setDocumentPath(documentLink);
            sportsEvent.setFlag(false); // Default verification status

            SportsEvent savedEvent = sportsEventService.saveSportsEvent(sportsEvent);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Sports Event submitted successfully");
            response.put("id", savedEvent.getId());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Error submitting sports event", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<SportsEvent>> getAllSportsEvents() {
        List<SportsEvent> events = sportsEventService.getAllSportsEvents();
        return ResponseEntity.ok(events);
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<SportsEvent>> getByStudentId(@PathVariable Long studentId) {
        List<SportsEvent> events = sportsEventService.getByStudentId(studentId);
        return ResponseEntity.ok(events);
    }

    @GetMapping("/student/object/{studentId}")
    public ResponseEntity<List<SportsEvent>> getByStudentObject(@PathVariable Long studentId) {
        Student student = userRepository.findById(studentId)
            .filter(user -> user instanceof Student)
            .map(user -> (Student) user)
            .orElseThrow(() -> new IllegalArgumentException("Student not found"));
        
        List<SportsEvent> events = sportsEventService.getByStudent(student);
        return new ResponseEntity<>(events, HttpStatus.OK);
    }
}