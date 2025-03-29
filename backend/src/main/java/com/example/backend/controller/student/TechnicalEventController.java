package com.example.backend.controller.student;

import com.example.backend.model.Student;
import com.example.backend.model.student.TechnicalEvent;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.student.TechnicalEventService;

import jakarta.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.net.MalformedURLException;
import java.security.Principal;
import java.time.LocalDate;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/technical")
public class TechnicalEventController {

    private final Logger logger = LoggerFactory.getLogger(TechnicalEventController.class);

    @Autowired
    private TechnicalEventService technicalEventService;

    @Autowired
    private UserRepository userRepository;

    // ✅ **Submit a Technical Event with studentId**
    @PostMapping(value = "/submit", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
public ResponseEntity<String> submitTechnicalEvent(
    @RequestParam("studentId") Long studentId,
    @RequestParam("title") String title,
    @RequestParam("eventDate") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate eventDate,
    @RequestParam("host") String host,
    @RequestParam("category") String category,
    @RequestParam("achievement") String achievement,
    @RequestParam("description") String description,
    @RequestParam("documentPath") MultipartFile documentPath) {  

    try {
        // ✅ Save file and get its path
        String documentLink = technicalEventService.saveFile(documentPath);

        // ✅ Fetch student to get faculty ID
        Student student = userRepository.findById(studentId)
            .filter(user -> user instanceof Student)
            .map(user -> (Student) user)
            .orElseThrow(() -> new IllegalArgumentException("Student not found"));

        Long facultyId = student.getFaculty().getId(); // Get faculty ID from Student

        // ✅ Create and save TechnicalEvent
        TechnicalEvent technicalEvent = new TechnicalEvent(
            title, description, studentId, facultyId, eventDate, host, category, achievement, documentLink
        );

        technicalEventService.saveTechnicalEvent(technicalEvent);

        return ResponseEntity.ok("Technical Event submitted successfully!");
    } catch (IOException e) {
        logger.error("Error saving file: ", e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error submitting technical event");
    } catch (Exception e) {
        logger.error("Error processing request: ", e);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
    }
}



    // ✅ **Get all Technical Events**
    @GetMapping("/all")
    public ResponseEntity<List<TechnicalEvent>> getAllEvents() {
        List<TechnicalEvent> events = technicalEventService.getAllEvents();
        return new ResponseEntity<>(events, HttpStatus.OK);
    }

    // ✅ **Download Proof Document**
    @GetMapping("/download/{eventId}")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long eventId) {
        try {
            Resource file = technicalEventService.downloadFile(eventId);

            if (file == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFilename() + "\"")
                    .body(file);
        } catch (MalformedURLException e) {
            logger.error("Error loading file for event ID: " + eventId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    // ✅ **Get all Technical Events for a specific student**
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<TechnicalEvent>> getEventsByStudent(@PathVariable Long studentId) {
        List<TechnicalEvent> events = technicalEventService.getEventsByStudent(studentId);
        return new ResponseEntity<>(events, HttpStatus.OK);
    }
}
























    // @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    // public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
    //     try {
    //         if (file.isEmpty()) {
    //             return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("File is empty");
    //         }
    //         String filePath = technicalEventService.saveFile(file);
    //         return ResponseEntity.ok(filePath);
    //     } catch (IOException e) {
    //         logger.error("Error uploading file: ", e);
    //         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error uploading file");
    //     }
    // }





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