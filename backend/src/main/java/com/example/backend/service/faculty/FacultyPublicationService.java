package com.example.backend.service.faculty;

import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.faculty.FacultyPublication;
import com.example.backend.repository.faculty.FacultyPublicationRepository;
import com.example.backend.service.student.MainService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
@Transactional
public class FacultyPublicationService {

    private final FacultyPublicationRepository facultyPublicationRepository;
    private final MainService mainService;

    @Autowired
    public FacultyPublicationService(FacultyPublicationRepository facultyPublicationRepository,
                                   MainService mainService) {
        this.facultyPublicationRepository = facultyPublicationRepository;
        this.mainService = mainService;
    }

    public List<FacultyPublication> getAllFacultyPublications() {
        return facultyPublicationRepository.findAll();
    }

    public List<FacultyPublication> getPublicationsByFacultyId(Long facultyId) {
        return facultyPublicationRepository.findByFacultyId(facultyId);
    }

    public List<FacultyPublication> searchPublications(String query) {
        return facultyPublicationRepository.searchPublications(query);
    }

    public FacultyPublication savePublication(FacultyPublication publication) {
        return facultyPublicationRepository.save(publication);
    }

    public FacultyPublication submitPublication(FacultyPublication publication, MultipartFile documentFile) throws IOException {
        if (documentFile != null && !documentFile.isEmpty()) {
            String documentPath = mainService.saveFile(documentFile);
            publication.setDocumentPath(documentPath);
        }
        return facultyPublicationRepository.save(publication);
    }

    public void deletePublication(Long publicationId) throws IOException {
        FacultyPublication publication = facultyPublicationRepository.findById(publicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Publication not found with id: " + publicationId));
        
        // Delete associated file if exists
        if (publication.getDocumentPath() != null) {
            try {
                Path filePath = Paths.get(publication.getDocumentPath());
                Files.deleteIfExists(filePath);
            } catch (IOException e) {
                throw new IOException("Failed to delete document file: " + e.getMessage());
            }
        }
        
        facultyPublicationRepository.deleteById(publicationId);
    }
}