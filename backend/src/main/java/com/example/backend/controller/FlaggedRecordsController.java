package com.example.backend.controller;

import com.example.backend.model.student.Main;
import com.example.backend.service.student.MainService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/flagged")
public class FlaggedRecordsController {

    private final MainService mainService;

    public FlaggedRecordsController(MainService mainService) {
        this.mainService = mainService;
    }

    // Get all flagged records (flag = true)
    @GetMapping
    public ResponseEntity<List<Main>> getAllFlaggedRecords() {
        List<Main> flaggedRecords = mainService.getAllByFlag(true);
        return ResponseEntity.ok(flaggedRecords);
    }

    @PutMapping("/{id}/flag")
    public ResponseEntity<String> flagRecord(@PathVariable Long id) {
        try {
            mainService.flagRecord(id);
            return ResponseEntity.ok("Record flagged for deletion successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body("Error flagging record: " + e.getMessage());
        }
    }

    // Admin approves deletion of flagged record
    @DeleteMapping("/{id}/delete-permanently")
    public ResponseEntity<String> approveDeletion(@PathVariable Long id) {
        try {
            mainService.deleteRecord(id);
            return ResponseEntity.ok("Record deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting record: " + e.getMessage());
        }
    }

    // Admin rejects deletion request (unflags the record)
    @PutMapping("/{id}/restore")
    public ResponseEntity<String> rejectDeletion(@PathVariable Long id) {
        try {
            mainService.updateFlag(id, false); // Set flag back to 0
            return ResponseEntity.ok("Deletion request rejected and record unflagged");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error rejecting deletion: " + e.getMessage());
        }
    }
}
