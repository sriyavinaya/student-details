package com.example.backend.controller;

import com.example.backend.model.student.TechnicalEvent;
import com.example.backend.repository.TechnicalEventRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/faculty")
@CrossOrigin(origins = "http://localhost:5173")
public class FacultyRecordController {

    private final TechnicalEventRepository technicalEventRepository;

    public FacultyRecordController(TechnicalEventRepository technicalEventRepository) {
        this.technicalEventRepository = technicalEventRepository;
    }

    // ✅ 1️⃣ Fetch all PENDING records
    @GetMapping("/pending-records")
    public ResponseEntity<List<TechnicalEvent>> getPendingRecords() {
        List<TechnicalEvent> pendingRecords = technicalEventRepository.findByStatus("Pending");
        return ResponseEntity.ok(pendingRecords);
    }

    // ✅ 2️⃣ Approve a record
    @PutMapping("/approve/{id}")
    public ResponseEntity<String> approveRecord(@PathVariable Long id) {
        Optional<TechnicalEvent> optionalEvent = technicalEventRepository.findById(id);
        if (optionalEvent.isPresent()) {
            TechnicalEvent event = optionalEvent.get();
            event.setStatus("Approved");
            technicalEventRepository.save(event);
            return ResponseEntity.ok("Record approved successfully.");
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // ✅ 3️⃣ Reject a record (moves to history)
    @PutMapping("/reject/{id}")
    public ResponseEntity<String> rejectRecord(@PathVariable Long id) {
        Optional<TechnicalEvent> optionalEvent = technicalEventRepository.findById(id);
        if (optionalEvent.isPresent()) {
            TechnicalEvent event = optionalEvent.get();
            event.setStatus("Rejected");
            technicalEventRepository.save(event);
            return ResponseEntity.ok("Record rejected and moved to history.");
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // ✅ 4️⃣ Fetch REJECTED records (for history/resubmission)
    @GetMapping("/rejected-records")
    public ResponseEntity<List<TechnicalEvent>> getRejectedRecords() {
        List<TechnicalEvent> rejectedRecords = technicalEventRepository.findByStatus("Rejected");
        return ResponseEntity.ok(rejectedRecords);
    }
}
