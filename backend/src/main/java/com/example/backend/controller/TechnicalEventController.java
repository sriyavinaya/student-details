package com.example.backend.controller;

import com.example.backend.model.student.TechnicalEvent;
import com.example.backend.service.TechnicalEventService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/technical")
public class TechnicalEventController {

    private final Logger logger = LoggerFactory.getLogger(TechnicalEventController.class);

    @Autowired
    private TechnicalEventService technicalEventService;

    @PostMapping(value = "/submit", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
public ResponseEntity<String> submitTechnicalEvent(
        @RequestParam("name") String name,
        @RequestParam("date") String date,
        @RequestParam("host") String host,
        @RequestParam("category") String category,
        @RequestParam("achievement") String achievement,
        @RequestParam("description") String description,
        @RequestParam("proofDocument") MultipartFile proofDocument) {
    try {
        // Save file and get its path
        String proofDocumentLink = technicalEventService.saveFile(proofDocument);

        // Create and save TechnicalEvent (WITHOUT setting ID manually)
        TechnicalEvent technicalEvent = new TechnicalEvent();
        technicalEvent.setName(name);
        technicalEvent.setDate(date);
        technicalEvent.setHost(host);
        technicalEvent.setCategory(category);
        technicalEvent.setAchievement(achievement);
        technicalEvent.setDescription(description);
        technicalEvent.setStatus("Pending");
        technicalEvent.setProofDocumentLink(proofDocumentLink);

        technicalEventService.saveTechnicalEvent(technicalEvent);

        return ResponseEntity.ok("Technical Event submitted successfully!");
    } catch (IOException e) {
        logger.error("Error saving file: ", e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error submitting technical event");
    }
}

@GetMapping("/all")
public ResponseEntity<List<TechnicalEvent>> getAllEvents() {
    List<TechnicalEvent> events = technicalEventService.getAllEvents();
    return new ResponseEntity<>(events, HttpStatus.OK);
}


    // @GetMapping("/hello") // Endpoint: http://localhost:8080/api/hello
    // public String hello() {
    //     return "Hello, World!";
    // }


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