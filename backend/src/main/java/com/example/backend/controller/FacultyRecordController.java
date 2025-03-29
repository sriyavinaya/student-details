package com.example.backend.controller;

import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.Faculty;
import com.example.backend.model.Student;
import com.example.backend.model.student.Main;
import com.example.backend.repository.FacultyRepository;
import com.example.backend.repository.StudentRepository;
import com.example.backend.service.student.MainService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/faculty")
@CrossOrigin(origins = "http://localhost:5173")
public class FacultyRecordController {

    private final FacultyRepository facultyRepository;
    private final StudentRepository studentRepository;
    private final MainService mainService;

    public FacultyRecordController(FacultyRepository facultyRepository, 
                                 StudentRepository studentRepository,MainService mainService ) {
        this.facultyRepository = facultyRepository;
        this.studentRepository = studentRepository;
        this.mainService = mainService;
    }

    // Get faculty by ID
    @GetMapping("/{facultyId}")
    public ResponseEntity<Faculty> getFacultyById(@PathVariable Long facultyId) {
        Optional<Faculty> facultyOptional = facultyRepository.findById(facultyId);
        return facultyOptional
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("Faculty not found with id: " + facultyId));
    }

    // Get students by faculty ID (single endpoint approach)
    @GetMapping("/{facultyId}/students")
    public ResponseEntity<List<Student>> getStudentsByFacultyId(@PathVariable Long facultyId) {
        Faculty faculty = facultyRepository.findById(facultyId)
                .orElseThrow(() -> new ResourceNotFoundException("Faculty not found with id: " + facultyId));
        
        List<Student> students = studentRepository.findByFaculty(faculty);
        return ResponseEntity.ok(students);
    }

     // Get pending records for verification
    @GetMapping("/{facultyId}/pending-records")
    public ResponseEntity<List<Main>> getPendingRecords(@PathVariable Long facultyId) {
        List<Main> pendingRecords = mainService.getPendingRecords(facultyId);
        return ResponseEntity.ok(pendingRecords);
    }

    // Approve a record
    @PutMapping("/{facultyId}/approve/{id}")
    public ResponseEntity<String> approveRecord(
            @PathVariable Long facultyId,
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> requestBody) {

        String comment = requestBody != null ? requestBody.get("comment") : null;
        boolean success = mainService.approveRecord(id, facultyId, comment);

        if (!success) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                   .body("Unauthorized: You cannot approve this record.");
        }

        return ResponseEntity.ok("Record approved successfully.");
    }

        // Reject a record
        @PutMapping("/{facultyId}/reject/{id}")
        public ResponseEntity<String> rejectRecord(
                @PathVariable Long facultyId,
                @PathVariable Long id,
                @RequestBody Map<String, String> requestBody) {
    
            String comment = requestBody.get("comment");
            if (comment == null || comment.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                       .body("Rejection comment is required.");
            }
    
            boolean success = mainService.rejectRecord(id, facultyId, comment);
            
            if (!success) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                       .body("Unauthorized: You cannot reject this record.");
            }
    
            return ResponseEntity.ok("Record rejected successfully.");
        }

        // Get rejected records
    @GetMapping("/{facultyId}/rejected-records")
    public ResponseEntity<List<Main>> getRejectedRecords(@PathVariable Long facultyId) {
        List<Main> rejectedRecords = mainService.getRejectedRecords(facultyId);
        return ResponseEntity.ok(rejectedRecords);
    }
    

}











// package com.example.backend.controller;

// import com.example.backend.model.Faculty;
// import com.example.backend.model.Student;
// import com.example.backend.model.student.Main;
// import com.example.backend.service.FacultyService;
// import com.example.backend.service.student.MainService;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;

// import java.util.List;
// import java.util.Map;

// @RestController
// @RequestMapping("/api/faculty")
// @CrossOrigin(origins = "http://localhost:5173")
// public class FacultyRecordController {

//     private final MainService mainService;
//     private final FacultyService facultyRepository;

//     public FacultyRecordController(MainService mainService, FacultyService facultyRepository) {
//         this.mainService = mainService;
//         this.facultyRepository = facultyRepository;
//     }

//     @GetMapping("/{facultyId}/students")
// public ResponseEntity<List<Student>> getStudentsByFacultyId(@PathVariable Long facultyId) {
//     Faculty faculty = facultyRepository.findById(facultyId)
//             .orElseThrow(() -> new ResourceNotFoundException("Faculty not found"));
//     List<Student> students = studentRepository.findByFaculty(faculty);
//     return ResponseEntity.ok(students);
// }

//     // Get student activities (ID-based)
//     @GetMapping("/{facultyId}/students/{studentId}/activities")
//     public ResponseEntity<List<Main>> getStudentActivities(
//             @PathVariable Long facultyId,
//             @PathVariable Long studentId,
//             @RequestParam String status) {
//         List<Main> activities = mainService.getStudentActivitiesByIds(studentId, facultyId, status);
//         return ResponseEntity.ok(activities);
//     }

//     // Approve record (ID-based)
//     @PutMapping("/{facultyId}/records/{id}/approve")
//     public ResponseEntity<String> approveRecord(
//             @PathVariable Long facultyId,
//             @PathVariable Long id,
//             @RequestBody(required = false) Map<String, String> requestBody) {
        
//         String comments = requestBody != null ? requestBody.get("comments") : null;
//         boolean success = mainService.updateVerificationStatus(id, facultyId, "Approved", comments);
        
//         return success ? ResponseEntity.ok("Record approved successfully.")
//                      : ResponseEntity.status(403).body("Unauthorized");
//     }

//     // Reject record (ID-based)
//     @PutMapping("/{facultyId}/records/{id}/reject")
//     public ResponseEntity<String> rejectRecord(
//             @PathVariable Long facultyId,
//             @PathVariable Long id,
//             @RequestBody Map<String, String> requestBody) {
        
//         String comment = requestBody.get("comment");
//         if (comment == null || comment.trim().isEmpty()) {
//             return ResponseEntity.badRequest().body("Rejection comment is required.");
//         }
        
//         boolean success = mainService.updateVerificationStatus(id, facultyId, "Rejected", comment);
        
//         return success 
//             ? ResponseEntity.ok("Record rejected successfully.")
//             : ResponseEntity.status(403).body("Unauthorized");
//     }

//     // Get rejected records (ID-based)
//     // @GetMapping("/{facultyId}/records/rejected")
//     // public ResponseEntity<List<Main>> getRejectedRecords(@PathVariable Long facultyId) {
//     //     List<Main> rejectedRecords = mainService.getRejectedRecords(facultyId);
//     //     return ResponseEntity.ok(rejectedRecords);
//     // }

//     // // Get pending records (ID-based)
//     // @GetMapping("/{facultyId}/records/pending")
//     // public ResponseEntity<List<Main>> getPendingRecords(@PathVariable Long facultyId) {
//     //     List<Main> pendingRecords = mainService.getPendingRecords(facultyId);
//     //     return ResponseEntity.ok(pendingRecords);
//     // }
// }
// // package com.example.backend.controller;

// // import com.example.backend.model.student.TechnicalEvent;
// // import com.example.backend.repository.student.TechnicalEventRepository;
// // import org.springframework.http.ResponseEntity;
// // import org.springframework.web.bind.annotation.*;

// // import java.util.List;
// // import java.util.Optional;

// // @RestController
// // @RequestMapping("/api/faculty")
// // @CrossOrigin(origins = "http://localhost:5173")
// // public class FacultyRecordController {

// //     private final TechnicalEventRepository technicalEventRepository;

// //     public FacultyRecordController(TechnicalEventRepository technicalEventRepository) {
// //         this.technicalEventRepository = technicalEventRepository;
// //     }

//     // ✅ 1️⃣ Fetch all PENDING records for students under this faculty
//     // @GetMapping("/{facultyId}/pending-records")
//     // public ResponseEntity<List<TechnicalEvent>> getPendingRecords(@PathVariable Long facultyId) {
//     //     List<TechnicalEvent> pendingRecords = technicalEventRepository.findByFacultyIdAndVerificationStatus(facultyId, "Pending");
//     //     return ResponseEntity.ok(pendingRecords);
//     // }

//     // ✅ 2️⃣ Approve a record (only if the student belongs to the faculty)
//     // @PutMapping("/{facultyId}/approve/{id}")
//     // public ResponseEntity<String> approveRecord(@PathVariable Long facultyId, @PathVariable Long id) {
//     //     Optional<TechnicalEvent> optionalEvent = technicalEventRepository.findByIdAndFacultyId(id, facultyId);
//     //     if (optionalEvent.isPresent()) {
//     //         TechnicalEvent event = optionalEvent.get();
//     //         event.setVerificationStatus("Approved");
//     //         technicalEventRepository.save(event);
//     //         return ResponseEntity.ok("Record approved successfully.");
//     //     } else {
//     //         return ResponseEntity.status(403).body("Unauthorized: You cannot approve this record.");
//     //     }
//     // }

//     // ✅ 3️⃣ Reject a record (only if the student belongs to the faculty)
//     // @PutMapping("/{facultyId}/reject/{id}")
//     // public ResponseEntity<String> rejectRecord(@PathVariable Long facultyId, @PathVariable Long id) {
//     //     Optional<TechnicalEvent> optionalEvent = technicalEventRepository.findByIdAndFacultyId(id, facultyId);
//     //     if (optionalEvent.isPresent()) {
//     //         TechnicalEvent event = optionalEvent.get();
//     //         event.setVerificationStatus("Rejected");
//     //         technicalEventRepository.save(event);
//     //         return ResponseEntity.ok("Record rejected successfully.");
//     //     } else {
//     //         return ResponseEntity.status(403).body("Unauthorized: You cannot reject this record.");
//     //     }
//     // }

//     // ✅ 4️⃣ Fetch REJECTED records for students under this faculty
//     // @GetMapping("/{facultyId}/rejected-records")
//     // public ResponseEntity<List<TechnicalEvent>> getRejectedRecords(@PathVariable Long facultyId) {
//     //     List<TechnicalEvent> rejectedRecords = technicalEventRepository.findByFacultyIdAndVerificationStatus(facultyId, "Rejected");
//     //     return ResponseEntity.ok(rejectedRecords);
//     // }
// // }














// // package com.example.backend.controller;

// // import com.example.backend.model.student.TechnicalEvent;
// // import com.example.backend.repository.student.TechnicalEventRepository;

// // import org.springframework.http.ResponseEntity;
// // import org.springframework.web.bind.annotation.*;

// // import java.util.List;
// // import java.util.Optional;

// // @RestController
// // @RequestMapping("/api/faculty")
// // @CrossOrigin(origins = "http://localhost:5173")
// // public class FacultyRecordController {

// //     private final TechnicalEventRepository technicalEventRepository;

// //     public FacultyRecordController(TechnicalEventRepository technicalEventRepository) {
// //         this.technicalEventRepository = technicalEventRepository;
// //     }

// //     // ✅ 1️⃣ Fetch all PENDING records
// //     @GetMapping("/pending-records")
// //     public ResponseEntity<List<TechnicalEvent>> getPendingRecords() {
// //         List<TechnicalEvent> pendingRecords = technicalEventRepository.findByVerificationStatus("Pending");
// //         return ResponseEntity.ok(pendingRecords);
// //     }

// //     // ✅ 2️⃣ Approve a record
// //     @PutMapping("/approve/{id}")
// //     public ResponseEntity<String> approveRecord(@PathVariable Long id) {
// //         Optional<TechnicalEvent> optionalEvent = technicalEventRepository.findById(id);
// //         if (optionalEvent.isPresent()) {
// //             TechnicalEvent event = optionalEvent.get();
// //             event.setVerificationStatus("Approved");
// //             technicalEventRepository.save(event);
// //             return ResponseEntity.ok("Record approved successfully.");
// //         } else {
// //             return ResponseEntity.notFound().build();
// //         }
// //     }

// //     // ✅ 3️⃣ Reject a record (moves to history)
// //     @PutMapping("/reject/{id}")
// //     public ResponseEntity<String> rejectRecord(@PathVariable Long id) {
// //         Optional<TechnicalEvent> optionalEvent = technicalEventRepository.findById(id);
// //         if (optionalEvent.isPresent()) {
// //             TechnicalEvent event = optionalEvent.get();
// //             event.setVerificationStatus("Rejected");
// //             technicalEventRepository.save(event);
// //             return ResponseEntity.ok("Record rejected and moved to history.");
// //         } else {
// //             return ResponseEntity.notFound().build();
// //         }
// //     }

// //     // ✅ 4️⃣ Fetch REJECTED records (for history/resubmission)
// //     @GetMapping("/rejected-records")
// //     public ResponseEntity<List<TechnicalEvent>> getRejectedRecords() {
// //         List<TechnicalEvent> rejectedRecords = technicalEventRepository.findByVerificationStatus("Rejected");
// //         return ResponseEntity.ok(rejectedRecords);
// //     }
// // }
