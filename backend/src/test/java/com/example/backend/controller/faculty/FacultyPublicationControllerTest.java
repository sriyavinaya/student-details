package com.example.backend.controller.faculty;

import com.example.backend.model.Faculty;
import com.example.backend.model.faculty.FacultyPublication;
import com.example.backend.service.faculty.FacultyPublicationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FacultyPublicationControllerTest {

    @Mock
    private FacultyPublicationService facultyPublicationService;

    @InjectMocks
    private FacultyPublicationController facultyPublicationController;

    private FacultyPublication publication;
    private Faculty faculty;

    @BeforeEach
    void setUp() {
        faculty = new Faculty();
        faculty.setId(1L);
        
        publication = new FacultyPublication();
        publication.setId(1L);
        publication.setTitle("Test Publication");
        publication.setFaculty(faculty);
    }

    @Test
    void getAllFacultyPublications_ShouldReturnAllPublications() {
        // Arrange
        List<FacultyPublication> publications = Arrays.asList(publication);
        when(facultyPublicationService.getAllFacultyPublications()).thenReturn(publications);

        // Act
        ResponseEntity<List<FacultyPublication>> response = facultyPublicationController.getAllFacultyPublications();

        // Assert
        assertEquals(200, response.getStatusCodeValue());
        assertEquals(1, response.getBody().size());
        assertEquals("Test Publication", response.getBody().get(0).getTitle());
    }

    @Test
    void getPublicationsByFacultyId_ShouldReturnFacultyPublications() {
        // Arrange
        List<FacultyPublication> publications = Arrays.asList(publication);
        when(facultyPublicationService.getPublicationsByFacultyId(anyLong())).thenReturn(publications);

        // Act
        ResponseEntity<List<FacultyPublication>> response = facultyPublicationController.getPublicationsByFacultyId(1L);

        // Assert
        assertEquals(200, response.getStatusCodeValue());
        assertEquals(1, response.getBody().size());
        assertEquals(1L, response.getBody().get(0).getFaculty().getId());
    }

    @Test
    void searchPublications_WithTitle_ShouldReturnMatchingPublications() {
        // Arrange
        List<FacultyPublication> publications = Arrays.asList(publication);
        when(facultyPublicationService.searchPublications(anyString())).thenReturn(publications);

        // Act
        ResponseEntity<List<FacultyPublication>> response = 
            facultyPublicationController.searchPublications("Test", null, null);

        // Assert
        assertEquals(200, response.getStatusCodeValue());
        assertEquals(1, response.getBody().size());
        verify(facultyPublicationService).searchPublications("Test");
    }

    @Test
    void searchPublications_WithAuthor_ShouldReturnMatchingPublications() {
        // Arrange
        List<FacultyPublication> publications = Arrays.asList(publication);
        when(facultyPublicationService.searchPublications(anyString())).thenReturn(publications);

        // Act
        ResponseEntity<List<FacultyPublication>> response = 
            facultyPublicationController.searchPublications(null, "Author", null);

        // Assert
        assertEquals(200, response.getStatusCodeValue());
        assertEquals(1, response.getBody().size());
        verify(facultyPublicationService).searchPublications("Author");
    }

    @Test
    void searchPublications_WithKeywords_ShouldReturnMatchingPublications() {
        // Arrange
        List<FacultyPublication> publications = Arrays.asList(publication);
        when(facultyPublicationService.searchPublications(anyString())).thenReturn(publications);

        // Act
        ResponseEntity<List<FacultyPublication>> response = 
            facultyPublicationController.searchPublications(null, null, "keyword1,keyword2");

        // Assert
        assertEquals(200, response.getStatusCodeValue());
        assertEquals(1, response.getBody().size());
        verify(facultyPublicationService).searchPublications("keyword1,keyword2");
    }

    @Test
    void submitPublication_WithValidData_ShouldReturnSuccess() throws Exception {
        // Arrange
        MultipartFile file = new MockMultipartFile("test.pdf", "test.pdf", "application/pdf", "content".getBytes());
        when(facultyPublicationService.savePublication(any(FacultyPublication.class))).thenReturn(publication);

        // Act
        ResponseEntity<Map<String, Object>> response = facultyPublicationController.submitPublication(
            1L, "Test Publication", "Journal", "0000-0000-0000-0000", "Author", 
            2023, "Collaborator", "doi:123", "keyword1,keyword2", "Abstract", 
            "Description", file);

        // Assert
        assertEquals(200, response.getStatusCodeValue());
        assertTrue((Boolean) response.getBody().get("success"));
        assertEquals("Publication submitted successfully", response.getBody().get("message"));
        assertEquals(1L, response.getBody().get("publicationId"));
    }

    @Test
    void submitPublication_WithoutFile_ShouldReturnSuccess() throws Exception {
        // Arrange
        when(facultyPublicationService.savePublication(any(FacultyPublication.class))).thenReturn(publication);

        // Act
        ResponseEntity<Map<String, Object>> response = facultyPublicationController.submitPublication(
            1L, "Test Publication", "Journal", "0000-0000-0000-0000", "Author", 
            2023, "Collaborator", "doi:123", "keyword1,keyword2", "Abstract", 
            "Description", null);

        // Assert
        assertEquals(200, response.getStatusCodeValue());
        assertTrue((Boolean) response.getBody().get("success"));
        assertNull(publication.getDocumentPath());
    }

    @Test
    void submitPublication_WithServiceException_ShouldReturnError() throws Exception {
        // Arrange
        when(facultyPublicationService.savePublication(any(FacultyPublication.class)))
            .thenThrow(new RuntimeException("Database error"));

        // Act
        ResponseEntity<Map<String, Object>> response = facultyPublicationController.submitPublication(
            1L, "Test Publication", "Journal", null, "Author", 
            2023, null, null, null, "Abstract", 
            "Description", null);

        // Assert
        assertEquals(500, response.getStatusCodeValue());
        assertFalse((Boolean) response.getBody().get("success"));
        assertTrue(((String) response.getBody().get("message")).contains("Database error"));
    }

    @Test
    void deletePublication_WithValidId_ShouldReturnSuccess() throws IOException {
        // Arrange
        doNothing().when(facultyPublicationService).deletePublication(anyLong());

        // Act
        ResponseEntity<Map<String, Object>> response = facultyPublicationController.deletePublication(1L);

        // Assert
        assertEquals(200, response.getStatusCodeValue());
        assertTrue((Boolean) response.getBody().get("success"));
        assertEquals("Publication deleted successfully", response.getBody().get("message"));
    }

    @Test
    void deletePublication_WithInvalidId_ShouldReturnError() throws IOException {
        // Arrange
        doThrow(new RuntimeException("Publication not found")).when(facultyPublicationService).deletePublication(anyLong());

        // Act
        ResponseEntity<Map<String, Object>> response = facultyPublicationController.deletePublication(999L);

        // Assert
        assertEquals(500, response.getStatusCodeValue());
        assertFalse((Boolean) response.getBody().get("success"));
        assertTrue(((String) response.getBody().get("message")).contains("Publication not found"));
    }
}