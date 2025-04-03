package com.example.backend.controller.student;

import com.example.backend.model.Student;
import com.example.backend.model.Faculty;
import com.example.backend.model.student.Publications;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.student.PublicationsService;
import com.example.backend.service.student.MainService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/publications")
public class PublicationsController {

    private final Logger logger = LoggerFactory.getLogger(PublicationsController.class);

    private final PublicationsService publicationsService;
    private final UserRepository userRepository;
    private final MainService mainService;

    public PublicationsController(PublicationsService publicationsService,
                                 UserRepository userRepository,
                                 MainService mainService) {
        this.publicationsService = publicationsService;
        this.userRepository = userRepository;
        this.mainService = mainService;
    }

    @PostMapping(value = "/submit", consumes = {"multipart/form-data"})
    public ResponseEntity<Map<String, Object>> submitPublication(
            @RequestParam("studentId") Long studentId,
            @RequestParam("title") String title,
            @RequestParam("publicationType") String publicationType,
            @RequestParam("orcidId") String orcidId,
            @RequestParam("author") String author,
            @RequestParam("year") int year,
            @RequestParam("collaborators") String collaborators,
            @RequestParam("doi") String doi,
            @RequestParam("keywords") String keywords,
            @RequestParam("abstractContent") String abstractContent,
            @RequestParam("description") String description,
            @RequestParam(value = "documentPath", required = false) MultipartFile documentPath) {

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

            Publications publication = new Publications();
            publication.setTitle(title);
            publication.setDescription(description);
            publication.setStudent(student);
            publication.setFaculty(faculty);
            publication.setPublicationType(publicationType);
            publication.setOrcidId(orcidId);
            publication.setAuthor(author);
            publication.setYear(year);
            publication.setCollaborators(collaborators);
            publication.setDoi(doi);
            publication.setKeywords(keywords);
            publication.setAbstractContent(abstractContent);
            publication.setDocumentPath(documentLink);
            publication.setFlag(false); // Default verification status

            Publications savedPublication = publicationsService.savePublication(publication);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Publication submitted successfully");
            response.put("id", savedPublication.getId());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Error submitting publication", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<Publications>> getAllPublications() {
        List<Publications> publications = publicationsService.getAllPublications();
        return ResponseEntity.ok(publications);
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Publications>> getByStudentId(@PathVariable Long studentId) {
        List<Publications> publications = publicationsService.getByStudentId(studentId);
        return ResponseEntity.ok(publications);
    }

    @GetMapping("/student/object/{studentId}")
    public ResponseEntity<List<Publications>> getByStudentObject(@PathVariable Long studentId) {
        Student student = userRepository.findById(studentId)
            .filter(user -> user instanceof Student)
            .map(user -> (Student) user)
            .orElseThrow(() -> new IllegalArgumentException("Student not found"));
        
        List<Publications> publications = publicationsService.getByStudent(student);
        return new ResponseEntity<>(publications, HttpStatus.OK);
    }
}