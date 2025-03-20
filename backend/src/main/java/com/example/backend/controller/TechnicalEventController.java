package com.example.backend.controller;

import java.io.File;
// import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

// import org.apache.commons.io.FilenameUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import org.springframework.http.MediaType;

import java.nio.file.Files;
// import java.nio.file.Path;
// import java.nio.file.Paths;

import com.example.backend.model.forms.TechnicalEvent;
import com.example.backend.service.TechnicalEventService;


@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/technical")
public class TechnicalEventController {

    private final Logger logger = LoggerFactory.getLogger(TechnicalEventController.class);

    @Autowired
    private TechnicalEventService technicalEventService;

    @PostMapping(value = "/submit", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<String> submitTechnicalEvent(
            @RequestParam("id") Long id,
            @RequestParam("name") String name,
            @RequestParam("date") String date,
            @RequestParam("host") String host,
            @RequestParam("category") String category,
            @RequestParam("achievement") String achievement,
            @RequestParam("description") String description,
            @RequestParam("status") String status,
            @RequestParam("proofDocument") MultipartFile proofDocument) {

        try {
            // Save the uploaded file
            String proofDocumentLink = saveFile(proofDocument);

            // Create a new TechnicalEvent object
            TechnicalEvent technicalEvent = new TechnicalEvent();
            technicalEvent.setId(id);
            technicalEvent.setName(name);
            technicalEvent.setDate(date);
            technicalEvent.setHost(host);
            technicalEvent.setCategory(category);
            technicalEvent.setAchievement(achievement);
            technicalEvent.setDescription(description);
            technicalEvent.setStatus(status);
            technicalEvent.setProofDocumentLink(proofDocumentLink);

            // Save the TechnicalEvent to the database
            technicalEventService.saveTechnicalEvent(technicalEvent);

            return new ResponseEntity<>("Technical Event submitted successfully!", HttpStatus.OK);
        } catch (IOException e) {
            logger.error("Error saving file: ", e);
            return new ResponseEntity<>("Error submitting technical event", HttpStatus.INTERNAL_SERVER_ERROR);
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

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return new ResponseEntity<>("File is empty", HttpStatus.BAD_REQUEST);
            }

            // Save the uploaded file
            String filePath = saveFile(file);

            return new ResponseEntity<>(filePath, HttpStatus.OK);
        } catch (IOException e) {
            logger.error("Error uploading file: ", e);
            return new ResponseEntity<>("Error uploading file", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



    private String saveFile(MultipartFile file) throws IOException {
    String uploadDir = System.getProperty("user.dir") + "/TechnicalEvents/";
    File directory = new File(uploadDir);
    if (!directory.exists()) {
        directory.mkdirs();
    }

    // Generate a unique filename (UUID to ensure uniqueness)
    String fileExtension = "";
    String originalFilename = file.getOriginalFilename();
    
    if (originalFilename != null && originalFilename.contains(".")) {
        fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
    }

    String fileName = UUID.randomUUID().toString() + fileExtension;  // Safe unique filename
    Path filePath = Paths.get(uploadDir, fileName);

    Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

    

    return filePath.toAbsolutePath().toString();
}



    // @GetMapping("/hello") // Endpoint: http://localhost:8080/api/hello
    // public String hello() {
    //     return "Hello, World!";
    // }


}