package com.example.backend.controller.student;

import com.example.backend.model.Student;
import com.example.backend.model.Faculty;
import com.example.backend.model.student.Publications;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.student.PublicationsService;
import com.example.backend.service.student.MainService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PublicationsControllerTest {

    @Mock private PublicationsService publicationsService;
    @Mock private UserRepository userRepository;
    @Mock private MainService mainService;
    
    @InjectMocks private PublicationsController controller;
    
    private Student testStudent;
    private Faculty testFaculty;
    private Publications testPublication;
    private MultipartFile testFile;

    @BeforeEach
    void setUp() {
        testFaculty = new Faculty();
        testStudent = new Student();
        testStudent.setId(1L);
        testStudent.setFaculty(testFaculty);
        
        testPublication = new Publications();
        testPublication.setId(1L);
        
        testFile = new MockMultipartFile("test", "test.pdf", "application/pdf", "test".getBytes());
    }

    @Test
    void submitPublication_Success() throws Exception {
        when(userRepository.findById(anyLong())).thenReturn(Optional.of(testStudent));
        when(mainService.saveFile(any())).thenReturn("/path/to/file");
        when(publicationsService.savePublication(any())).thenReturn(testPublication);

        ResponseEntity<Map<String, Object>> response = controller.submitPublication(
            1L, "Title", "Type", "ORCID", "Author", 2023, "DOI", "Keywords", "Abstract", "Desc", testFile);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue((Boolean) response.getBody().get("success"));
    }

    @Test
    void getAllPublications_Success() {
        when(publicationsService.getAllPublications()).thenReturn(Collections.singletonList(testPublication));

        ResponseEntity<List<Publications>> response = controller.getAllPublications();
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
    }

    @Test
    void getByStudentId_Success() {
        when(publicationsService.getByStudentId(anyLong())).thenReturn(Collections.singletonList(testPublication));

        ResponseEntity<List<Publications>> response = controller.getByStudentId(1L);
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    void getPendingAndApprovedEventsByStudent_Success() {
        when(userRepository.findById(anyLong())).thenReturn(Optional.of(testStudent));
        when(publicationsService.getPendingAndApprovedEventsByStudent(any()))
            .thenReturn(Collections.singletonList(testPublication));

        ResponseEntity<List<Publications>> response = controller.getPendingAndApprovedEventsByStudent(1L);
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }
}