package com.example.backend.service.faculty;

import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.Faculty;
import com.example.backend.model.faculty.FacultyPublication;
import com.example.backend.repository.faculty.FacultyPublicationRepository;
import com.example.backend.service.faculty.FacultyPublicationService;
import com.example.backend.service.student.MainService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FacultyPublicationServiceTest {

    @Mock
    private FacultyPublicationRepository facultyPublicationRepository;

    @Mock
    private MainService mainService;

    @Mock
    private MultipartFile documentFile;

    @InjectMocks
    private FacultyPublicationService facultyPublicationService;

    private FacultyPublication publication;
    private List<FacultyPublication> publicationList;

    @BeforeEach
void setUp() {
    Faculty faculty = new Faculty();
    faculty.setId(101L);
    faculty.setName("Test Faculty");
    
    publication = new FacultyPublication();
    publication.setId(1L);
    publication.setTitle("Test Publication");
    publication.setFaculty(faculty);  // Set the Faculty object, not just the ID
    publication.setDocumentPath("/path/to/document.pdf");

    FacultyPublication publication2 = new FacultyPublication();
    publication2.setId(2L);
    publication2.setTitle("Another Publication");
    
    Faculty faculty2 = new Faculty();
    faculty2.setId(102L);
    faculty2.setName("Another Faculty");
    publication2.setFaculty(faculty2);

    publicationList = Arrays.asList(publication, publication2);
}

    @Test
    void getAllFacultyPublications_ShouldReturnAllPublications() {
        when(facultyPublicationRepository.findAll()).thenReturn(publicationList);

        List<FacultyPublication> result = facultyPublicationService.getAllFacultyPublications();

        assertEquals(2, result.size());
        verify(facultyPublicationRepository, times(1)).findAll();
    }

    @Test
void getPublicationsByFacultyId_ShouldReturnFacultyPublications() {
    Long facultyId = 101L;
    when(facultyPublicationRepository.findByFacultyId(facultyId))
        .thenReturn(Arrays.asList(publication));

    List<FacultyPublication> result = facultyPublicationService.getPublicationsByFacultyId(facultyId);

    assertEquals(1, result.size());
    // Compare faculty IDs instead of comparing Long with Faculty object
    assertEquals(facultyId, result.get(0).getFaculty().getId());
    verify(facultyPublicationRepository, times(1)).findByFacultyId(facultyId);
}

    @Test
    void searchPublications_ShouldReturnMatchingPublications() {
        String query = "Test";
        when(facultyPublicationRepository.searchPublications(query))
            .thenReturn(Arrays.asList(publication));

        List<FacultyPublication> result = facultyPublicationService.searchPublications(query);

        assertEquals(1, result.size());
        assertTrue(result.get(0).getTitle().contains(query));
        verify(facultyPublicationRepository, times(1)).searchPublications(query);
    }

    @Test
    void savePublication_ShouldReturnSavedPublication() {
        when(facultyPublicationRepository.save(any(FacultyPublication.class)))
            .thenReturn(publication);

        FacultyPublication result = facultyPublicationService.savePublication(publication);

        assertNotNull(result);
        assertEquals(publication.getId(), result.getId());
        verify(facultyPublicationRepository, times(1)).save(publication);
    }

    @Test
    void submitPublication_WithDocumentFile_ShouldSaveFileAndPublication() throws IOException {
        String filePath = "/uploads/document.pdf";
        when(documentFile.isEmpty()).thenReturn(false);
        when(mainService.saveFile(documentFile)).thenReturn(filePath);
        when(facultyPublicationRepository.save(any(FacultyPublication.class)))
            .thenReturn(publication);

        FacultyPublication result = facultyPublicationService.submitPublication(publication, documentFile);

        assertNotNull(result);
        assertEquals(filePath, result.getDocumentPath());
        verify(mainService, times(1)).saveFile(documentFile);
        verify(facultyPublicationRepository, times(1)).save(publication);
    }

    @Test
    void deletePublication_WhenPublicationNotFound_ShouldThrowResourceNotFoundException() {
        Long publicationId = 99L;
        when(facultyPublicationRepository.findById(publicationId))
            .thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            facultyPublicationService.deletePublication(publicationId);
        });

        verify(facultyPublicationRepository, times(1)).findById(publicationId);
        verify(facultyPublicationRepository, never()).deleteById(publicationId);
    }

}