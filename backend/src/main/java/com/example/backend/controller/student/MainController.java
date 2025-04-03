package com.example.backend.controller.student;

import com.example.backend.model.student.Main;
import com.example.backend.service.student.MainService;

import java.io.IOException;
import java.net.MalformedURLException;
import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
// import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/main")
public class MainController {

    private final MainService mainService;

    public MainController(MainService mainService) {
        this.mainService = mainService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Main> getEventById(@PathVariable Long id) {
        Main event = mainService.getEventById(id);
        return ResponseEntity.ok(event);
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("File is empty");
            }
            String filePath = mainService.saveFile(file);
            return ResponseEntity.ok(filePath);
        } catch (IOException e) {
            // logger.error("Error uploading file: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error uploading file");
        }
    }

    @GetMapping("/download/{eventId}")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long eventId) {
        try {
            Resource file = mainService.downloadFile(eventId);

            if (file == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFilename() + "\"")
                    .body(file);
        } catch (MalformedURLException e) {
            // logger.error("Error loading file for event ID: " + eventId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

     // New endpoint to fetch all pending records
     @GetMapping("/pending")
     public ResponseEntity<List<Main>> getAllPendingRecords() {
         List<Main> pendingRecords = mainService.getAllByVerificationStatus("Pending");
         return ResponseEntity.ok(pendingRecords);
     }
 
     // New endpoint to fetch all rejected records
     @GetMapping("/rejected")
     public ResponseEntity<List<Main>> getAllRejectedRecords() {
         List<Main> rejectedRecords = mainService.getAllByVerificationStatus("Rejected");
         return ResponseEntity.ok(rejectedRecords);
     }

     // New endpoint to fetch pending records for a specific student
    @GetMapping("/student/{studentId}/pending")
    public ResponseEntity<List<Main>> getStudentPendingRecords(@PathVariable Long studentId) {
        List<Main> studentPendingRecords = mainService.getAllByStudentIdAndVerificationStatus(studentId, "Pending");
        return ResponseEntity.ok(studentPendingRecords);
    }
    
    // New endpoint to fetch rejected records for a specific student
    @GetMapping("/student/{studentId}/rejected")
    public ResponseEntity<List<Main>> getStudentRejectedRecords(@PathVariable Long studentId) {
        List<Main> studentRejectedRecords = mainService.getAllByStudentIdAndVerificationStatus(studentId, "Rejected");
        return ResponseEntity.ok(studentRejectedRecords);
    }

}