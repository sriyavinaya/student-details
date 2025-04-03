// package com.example.backend.controller.student;

// import com.example.backend.model.Student;
// import com.example.backend.model.Faculty;
// import com.example.backend.model.student.*;
// import com.example.backend.repository.UserRepository;
// import com.example.backend.service.student.JobOpportunityService;
// import com.example.backend.service.student.MainService;

// import org.slf4j.Logger;
// import org.slf4j.LoggerFactory;
// import org.springframework.format.annotation.DateTimeFormat;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;
// import org.springframework.web.multipart.MultipartFile;

// import java.time.LocalDate;
// import java.util.HashMap;
// import java.util.List;
// import java.util.Map;

// @RestController
// @CrossOrigin(origins = "http://localhost:5173")
// @RequestMapping("/api/job-opportunities")
// public class JobOpportunityController {

//     private final Logger logger = LoggerFactory.getLogger(JobOpportunityController.class);

//     private final JobOpportunityService jobOpportunityService;
//     private final UserRepository userRepository;
//     private final MainService mainService;

//     public JobOpportunityController(JobOpportunityService jobOpportunityService,
//                                   UserRepository userRepository,
//                                   MainService mainService) {
//         this.jobOpportunityService = jobOpportunityService;
//         this.userRepository = userRepository;
//         this.mainService = mainService;
//     }

//     @PostMapping(value = "/internship/submit", consumes = {"multipart/form-data"})
//     public ResponseEntity<Map<String, Object>> submitInternship(
//             @RequestParam("studentId") Long studentId,
//             @RequestParam("title") String title,
//             @RequestParam("companyName") String companyName,
//             @RequestParam("startDate") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
//             @RequestParam("role") String role,
//             @RequestParam("duration") String duration,
//             @RequestParam("stipend") String stipend,
//             @RequestParam("description") String description,
//             @RequestParam(value = "documentPath", required = false) MultipartFile documentPath) {

//         try {
//             Student student = userRepository.findById(studentId)
//                     .filter(user -> user instanceof Student)
//                     .map(user -> (Student) user)
//                     .orElseThrow(() -> new IllegalArgumentException("Student not found with ID: " + studentId));

//             Faculty faculty = student.getFaculty();
//             if (faculty == null) {
//                 throw new IllegalStateException("Student has no faculty assigned");
//             }

//             String documentLink = null;
//             if (documentPath != null && !documentPath.isEmpty()) {
//                 documentLink = mainService.saveFile(documentPath);
//             }

//             Internship internship = new Internship();
//             internship.setTitle(title);
//             internship.setDescription(description);
//             internship.setStudent(student);
//             internship.setFaculty(faculty);
//             internship.setCompanyName(companyName);
//             internship.setStartDate(startDate);
//             internship.setRole(role);
//             internship.setDuration(duration);
//             internship.setStipend(stipend);
//             internship.setDocumentPath(documentLink);

//             Internship savedInternship = (Internship) jobOpportunityService.saveJobOpportunity(internship);

//             Map<String, Object> response = new HashMap<>();
//             response.put("success", true);
//             response.put("message", "Internship submitted successfully");
//             response.put("id", savedInternship.getId());
//             response.put("type", "INTERNSHIP");
//             return ResponseEntity.ok(response);

//         } catch (Exception e) {
//             logger.error("Error submitting internship", e);
//             Map<String, Object> errorResponse = new HashMap<>();
//             errorResponse.put("success", false);
//             errorResponse.put("message", e.getMessage());
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
//         }
//     }

//     @PostMapping(value = "/placement/submit", consumes = {"multipart/form-data"})
//     public ResponseEntity<Map<String, Object>> submitPlacement(
//             @RequestParam("studentId") Long studentId,
//             @RequestParam("title") String title,
//             @RequestParam("companyName") String companyName,
//             @RequestParam("startDate") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
//             @RequestParam("role") String role,
//             @RequestParam("ctc") String ctc,
//             @RequestParam("description") String description,
//             @RequestParam(value = "documentPath", required = false) MultipartFile documentPath) {

//         try {
//             Student student = userRepository.findById(studentId)
//                     .filter(user -> user instanceof Student)
//                     .map(user -> (Student) user)
//                     .orElseThrow(() -> new IllegalArgumentException("Student not found with ID: " + studentId));

//             Faculty faculty = student.getFaculty();
//             if (faculty == null) {
//                 throw new IllegalStateException("Student has no faculty assigned");
//             }

//             String documentLink = null;
//             if (documentPath != null && !documentPath.isEmpty()) {
//                 documentLink = mainService.saveFile(documentPath);
//             }

//             Placement placement = new Placement();
//             placement.setTitle(title);
//             placement.setDescription(description);
//             placement.setStudent(student);
//             placement.setFaculty(faculty);
//             placement.setCompanyName(companyName);
//             placement.setStartDate(startDate);
//             placement.setRole(role);
//             placement.setCtc(ctc);
//             placement.setDocumentPath(documentLink);

//             Placement savedPlacement = (Placement) jobOpportunityService.saveJobOpportunity(placement);

//             Map<String, Object> response = new HashMap<>();
//             response.put("success", true);
//             response.put("message", "Placement submitted successfully");
//             response.put("id", savedPlacement.getId());
//             response.put("type", "PLACEMENT");
//             return ResponseEntity.ok(response);

//         } catch (Exception e) {
//             logger.error("Error submitting placement", e);
//             Map<String, Object> errorResponse = new HashMap<>();
//             errorResponse.put("success", false);
//             errorResponse.put("message", e.getMessage());
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
//         }
//     }

//     @GetMapping("/all")
//     public ResponseEntity<List<JobOpportunity>> getAllJobOpportunities() {
//         List<JobOpportunity> opportunities = jobOpportunityService.getAllJobOpportunities();
//         return ResponseEntity.ok(opportunities);
//     }

//     @GetMapping("/student/{studentId}")
//     public ResponseEntity<List<JobOpportunity>> getByStudentId(@PathVariable Long studentId) {
//         List<JobOpportunity> opportunities = jobOpportunityService.getByStudentId(studentId);
//         return ResponseEntity.ok(opportunities);
//     }

//     @GetMapping("/student/{studentId}/internships")
//     public ResponseEntity<List<JobOpportunity>> getInternshipsByStudentId(@PathVariable Long studentId) {
//         Student student = userRepository.findById(studentId)
//                 .filter(user -> user instanceof Student)
//                 .map(user -> (Student) user)
//                 .orElseThrow(() -> new IllegalArgumentException("Student not found"));
        
//         List<JobOpportunity> internships = jobOpportunityService.getInternshipsByStudent(student);
//         return ResponseEntity.ok(internships);
//     }

//     @GetMapping("/student/{studentId}/placements")
//     public ResponseEntity<List<JobOpportunity>> getPlacementsByStudentId(@PathVariable Long studentId) {
//         Student student = userRepository.findById(studentId)
//                 .filter(user -> user instanceof Student)
//                 .map(user -> (Student) user)
//                 .orElseThrow(() -> new IllegalArgumentException("Student not found"));
        
//         List<JobOpportunity> placements = jobOpportunityService.getPlacementsByStudent(student);
//         return ResponseEntity.ok(placements);
//     }
// }