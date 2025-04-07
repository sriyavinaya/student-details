package com.example.backend.controller.student;

import com.example.backend.model.Student;
import com.example.backend.model.Faculty;
import com.example.backend.model.student.TechnicalEvent;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.student.TechnicalEventRepository;
import com.example.backend.service.student.MainService;
import com.example.backend.service.student.TechnicalEventService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TechnicalEventControllerTest {

    @Mock
    private TechnicalEventService technicalEventService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private TechnicalEventRepository technicalEventRepository;

    @Mock
    private MainService mainService;

    @InjectMocks
    private TechnicalEventController technicalEventController;

    private Student testStudent;
    private Faculty testFaculty;
    private TechnicalEvent testEvent;
    private MultipartFile testFile;

    @BeforeEach
    void setUp() {
        testFaculty = new Faculty();
        testFaculty.setId(1L);
        testFaculty.setName("Test Faculty");

        testStudent = new Student();
        testStudent.setId(1L);
        testStudent.setName("Test Student");
        testStudent.setFaculty(testFaculty);

        testEvent = new TechnicalEvent();
        testEvent.setId(1L);
        testEvent.setTitle("Test Event");
        testEvent.setStudent(testStudent);
        testEvent.setFaculty(testFaculty);

        testFile = new MockMultipartFile(
            "document", 
            "test.pdf", 
            MediaType.APPLICATION_PDF_VALUE, 
            "test content".getBytes()
        );
    }

    @Test
    void submitTechnicalEvent_ShouldSuccessfullySubmit() throws IOException {
        // Mock dependencies
        when(userRepository.findById(anyLong())).thenReturn(Optional.of(testStudent));
        when(mainService.saveFile(any(MultipartFile.class))).thenReturn("/path/to/file");
        when(technicalEventRepository.save(any(TechnicalEvent.class))).thenReturn(testEvent);

        // Call controller method
        ResponseEntity<Map<String, Object>> response = technicalEventController.submitTechnicalEvent(
            1L, "Test Event", LocalDate.now(), "Test Host", "Test Category",
            "Test Achievement", "Test Description", testFile
        );

        // Verify results
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue((Boolean) response.getBody().get("success"));
        assertEquals("Technical Event submitted successfully", response.getBody().get("message"));
        
        // Verify interactions
        verify(userRepository, times(1)).findById(1L);
        verify(mainService, times(1)).saveFile(testFile);
        verify(technicalEventRepository, times(1)).save(any(TechnicalEvent.class));
    }

    @Test
    void submitTechnicalEvent_ShouldFailWhenStudentNotFound() {
        when(userRepository.findById(anyLong())).thenReturn(Optional.empty());

        ResponseEntity<Map<String, Object>> response = technicalEventController.submitTechnicalEvent(
            999L, "Test Event", LocalDate.now(), "Test Host", "Test Category",
            "Test Achievement", "Test Description", testFile
        );

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertFalse((Boolean) response.getBody().get("success"));
        assertTrue(response.getBody().get("message").toString().contains("Student not found"));
    }

    @Test
    void submitTechnicalEvent_ShouldFailWhenNoFacultyAssigned() {
        testStudent.setFaculty(null);
        when(userRepository.findById(anyLong())).thenReturn(Optional.of(testStudent));

        ResponseEntity<Map<String, Object>> response = technicalEventController.submitTechnicalEvent(
            1L, "Test Event", LocalDate.now(), "Test Host", "Test Category",
            "Test Achievement", "Test Description", testFile
        );

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertTrue(response.getBody().get("message").toString().contains("no faculty assigned"));
    }

    @Test
    void submitTechnicalEvent_ShouldFailWhenDocumentMissing() {
        ResponseEntity<Map<String, Object>> response = technicalEventController.submitTechnicalEvent(
            1L, "Test Event", LocalDate.now(), "Test Host", "Test Category",
            "Test Achievement", "Test Description", null
        );

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertTrue(response.getBody().get("message").toString().contains("Document proof is required"));
    }

    @Test
    void getEventsByStudentId_ShouldReturnEvents() {
        List<TechnicalEvent> events = Collections.singletonList(testEvent);
        when(technicalEventService.getEventsByStudentId(anyLong())).thenReturn(events);

        ResponseEntity<List<TechnicalEvent>> response = technicalEventController.getEventsByStudentId(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
        assertEquals(testEvent, response.getBody().get(0));
    }

    @Test
    void getPendingAndApprovedEventsByStudent_ShouldReturnFilteredEvents() {
        List<TechnicalEvent> events = Collections.singletonList(testEvent);
        when(userRepository.findById(anyLong())).thenReturn(Optional.of(testStudent));
        when(technicalEventService.getPendingAndApprovedEventsByStudent(any(Student.class))).thenReturn(events);

        ResponseEntity<List<TechnicalEvent>> response = technicalEventController.getPendingAndApprovedEventsByStudent(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
    }

    @Test
    void getPendingAndApprovedEventsByStudent_ShouldFailWhenStudentNotFound() {
        when(userRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> {
            technicalEventController.getPendingAndApprovedEventsByStudent(999L);
        });
    }
}