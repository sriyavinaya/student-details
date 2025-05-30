package com.example.backend.controller.student;

import com.example.backend.model.Student;
import com.example.backend.model.Faculty;
import com.example.backend.model.student.TechnicalEvent;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.student.TechnicalEventRepository;
import com.example.backend.service.student.MainService;
import com.example.backend.service.student.TechnicalEventService;

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
@RequestMapping("/api/technical")
public class TechnicalEventController {

    private final Logger logger = LoggerFactory.getLogger(TechnicalEventController.class);

    @Autowired
    private TechnicalEventService technicalEventService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TechnicalEventRepository technicalEventRepository;

    @Autowired
    private MainService mainService;

    

    
    @PostMapping(value = "/submit", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    @Transactional
    public ResponseEntity<Map<String, Object>> submitTechnicalEvent(
        @RequestParam("studentId") Long studentId,
        @RequestParam("title") String title,
        @RequestParam("eventDate") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate eventDate,
        @RequestParam("host") String host,
        @RequestParam("category") String category,
        @RequestParam("achievement") String achievement,
        @RequestParam("description") String description,
        @RequestParam("documentPath") MultipartFile documentPath) {  // Changed to required=true

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

            // 4. Create and populate TechnicalEvent
            TechnicalEvent event = new TechnicalEvent();
            event.setTitle(title);
            event.setDescription(description);
            event.setStudent(student);
            event.setFaculty(faculty);
            event.setEventDate(eventDate);
            event.setHost(host);
            event.setCategory(category);
            event.setAchievement(achievement);
            event.setDocumentPath(documentLink);
            event.setVerificationStatus("Pending");

            // 5. Save and verify
            TechnicalEvent savedEvent = technicalEventRepository.save(event);
            technicalEventRepository.flush();

            if (savedEvent.getStudent() == null || savedEvent.getFaculty() == null) {
                throw new IllegalStateException("Failed to persist relationships");
            }

            // 6. Return success response
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Technical Event submitted successfully");
            response.put("eventId", savedEvent.getId());
            response.put("documentPath", savedEvent.getDocumentPath());

            logger.info("TechnicalEvent created - ID: {}, Student: {}", savedEvent.getId(), studentId);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Error submitting technical event", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse); // Changed to 400 for validation errors
        }
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<TechnicalEvent>> getEventsByStudentId(@PathVariable Long studentId) {
        List<TechnicalEvent> events = technicalEventService.getEventsByStudentId(studentId);
        return new ResponseEntity<>(events, HttpStatus.OK);
    }
    
    //Gets pending and approved events of a particular student
    @GetMapping("/student/object/{studentId}")
    public ResponseEntity<List<TechnicalEvent>> getPendingAndApprovedEventsByStudent(@PathVariable Long studentId) {
        
        Student student = userRepository.findById(studentId)
            .filter(user -> user instanceof Student)
            .map(user -> (Student) user)
            .orElseThrow(() -> new IllegalArgumentException("Student not found"));
        
        List<TechnicalEvent> events = technicalEventService.getPendingAndApprovedEventsByStudent(student);
        return ResponseEntity.ok(events);
    }




}


























    // private String saveFile(MultipartFile file) throws IOException {
    //     String uploadDir = System.getProperty("user.dir") + "/TechnicalEvents/"; // Standard path
    //     File directory = new File(uploadDir);
    //     if (!directory.exists()) {
    //         directory.mkdirs();
    //     }

    //     // Sanitize filename
    //     String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename().replaceAll("\\s+", "_");
    //     Path filePath = Paths.get(uploadDir, fileName);

    //     // Prevent file overwriting
    //     if (Files.exists(filePath)) {
    //         fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
    //         filePath = Paths.get(uploadDir, fileName);
    //     }

    //     Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

    //     return filePath.toAbsolutePath().toString();
    // }



    // @GetMapping("/all")
    // public ResponseEntity<?> getAllEvents() {
    //     try {
    //         List<TechnicalEvent> events = technicalEventService.getAllEvents();
    //         if (events.isEmpty()) {
    //             return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    //         }
    //         return ResponseEntity.ok(events);
    //     } catch (Exception e) {
    //         logger.error("Failed to fetch events: {}", e.getMessage());
    //         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
    //                .body(Map.of(
    //                    "error", "Failed to fetch events",
    //                    "message", e.getMessage(),
    //                    "timestamp", LocalDateTime.now()
    //                ));
    //     }
    // }