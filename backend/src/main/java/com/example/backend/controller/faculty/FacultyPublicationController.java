package com.example.backend.controller.faculty;

import com.example.backend.model.Faculty;
import com.example.backend.model.faculty.FacultyPublication;
import com.example.backend.service.faculty.FacultyPublicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/faculty-publications")
public class FacultyPublicationController {

    private final FacultyPublicationService facultyPublicationService;

    public FacultyPublicationController(FacultyPublicationService facultyPublicationService) {
        this.facultyPublicationService = facultyPublicationService;
    }

    @GetMapping
    public ResponseEntity<List<FacultyPublication>> getAllFacultyPublications() {
        return ResponseEntity.ok(facultyPublicationService.getAllFacultyPublications());
    }

    @GetMapping("/faculty/{facultyId}")
    public ResponseEntity<List<FacultyPublication>> getPublicationsByFacultyId(@PathVariable Long facultyId) {
        return ResponseEntity.ok(facultyPublicationService.getPublicationsByFacultyId(facultyId));
    }

    @GetMapping("/search")
    public ResponseEntity<List<FacultyPublication>> searchPublications(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String author,
            @RequestParam(required = false) String keywords) {
        
        String query = title != null ? title : 
                      author != null ? author : 
                      keywords != null ? keywords : "";
        
        return ResponseEntity.ok(facultyPublicationService.searchPublications(query));
    }

     @PostMapping(value = "/submit", consumes = {"multipart/form-data"})
    public ResponseEntity<Map<String, Object>> submitPublication(
            @RequestParam("facultyId") Long facultyId,
            @RequestParam("title") String title,
            @RequestParam("publicationType") String publicationType,
            @RequestParam(value = "orcidId", required = false) String orcidId,
            @RequestParam("author") String author,
            @RequestParam("year") int year,
            @RequestParam(value = "collaborators", required = false) String collaborators,
            @RequestParam(value = "doi", required = false) String doi,
            @RequestParam(value = "keywords", required = false) String keywords,
            @RequestParam("abstractContent") String abstractContent,
            @RequestParam("description") String description,
            @RequestParam(value = "documentPath", required = false) MultipartFile documentPath) {

        Map<String, Object> response = new HashMap<>();
        
        try {
            FacultyPublication publication = new FacultyPublication();
            publication.setTitle(title);
            publication.setPublicationType(publicationType);
            publication.setOrcidId(orcidId);
            publication.setAuthor(author);
            publication.setYear(year);
            publication.setCollaborators(collaborators);
            publication.setDoi(doi);
            publication.setKeywords(keywords);
            publication.setAbstractContent(abstractContent);
            publication.setDescription(description);
            
            // Set document path if file exists
            if (documentPath != null && !documentPath.isEmpty()) {
                String filePath = "path/to/save/" + documentPath.getOriginalFilename();
                // Save file logic here
                publication.setDocumentPath(filePath);
            }
            
            // Set faculty (you'll need to fetch the faculty entity)
            Faculty faculty = new Faculty();
            faculty.setId(facultyId);
            publication.setFaculty(faculty);
            
            FacultyPublication savedPublication = facultyPublicationService.savePublication(publication);
            
            response.put("success", true);
            response.put("message", "Publication submitted successfully");
            response.put("publicationId", savedPublication.getId());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to submit publication: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @DeleteMapping("/delete/{publicationId}")
    public ResponseEntity<Map<String, Object>> deletePublication(
            @PathVariable Long publicationId) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            facultyPublicationService.deletePublication(publicationId);
            response.put("success", true);
            response.put("message", "Publication deleted successfully");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to delete publication: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
}
