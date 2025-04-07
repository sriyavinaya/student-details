package com.example.backend.controller.student;

import com.example.backend.model.Faculty;
import com.example.backend.model.Student;
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
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
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

    private Student student;
    private Faculty faculty;
    private TechnicalEvent event;
    private MultipartFile mockFile;

    @BeforeEach
    void setUp() {
        faculty = new Faculty();
        faculty.setId(1L);

        student = new Student();
        student.setId(1L);
        student.setFaculty(faculty);

        event = new TechnicalEvent();
        event.setId(1L);
        event.setStudent(student);
        event.setDocumentPath("/path/to/file.pdf");

        mockFile = new MockMultipartFile(
            "document",
            "test.pdf",
            "application/pdf",
            "test content".getBytes()
        );
    }

    @Test
    void submitTechnicalEvent_ShouldSuccessfullySubmit() throws Exception {
        // Setup more complete student object
        student.setFaculty(new Faculty()); // Ensure faculty exists
        when(userRepository.findById(1L)).thenReturn(Optional.of(student));
        
        // Mock file saving
        when(mainService.saveFile(any(MultipartFile.class))).thenReturn("/path/to/file.pdf");
        
        // Mock event saving
        TechnicalEvent savedEvent = new TechnicalEvent();
        savedEvent.setId(1L);
        savedEvent.setDocumentPath("/path/to/file.pdf");
        when(technicalEventRepository.save(any(TechnicalEvent.class))).thenReturn(savedEvent);
    
        // Create valid mock file
        MultipartFile validFile = new MockMultipartFile(
            "documentPath",
            "test.pdf",
            "application/pdf",
            "test content".getBytes()
        );
    
        // Call controller
        ResponseEntity<Map<String, Object>> response = technicalEventController.submitTechnicalEvent(
            1L, 
            "Valid Title", 
            LocalDate.now(), 
            "Valid Host", 
            "Valid Category",
            "Valid Achievement", 
            "Valid Description", 
            validFile
        );
    
        // Verify
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue((Boolean) response.getBody().get("success"));
        verify(mainService).saveFile(validFile);
    }

    @Test
    void submitTechnicalEvent_ShouldFailWhenStudentNotFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        ResponseEntity<Map<String, Object>> response = technicalEventController.submitTechnicalEvent(
            1L, "Title", LocalDate.now(), "Host", "Category", 
            "Achievement", "Description", mockFile
        );

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertFalse((Boolean) response.getBody().get("success"));
    }

    @Test
    void submitTechnicalEvent_ShouldFailWhenNoFaculty() {
        student.setFaculty(null);
        when(userRepository.findById(1L)).thenReturn(Optional.of(student));

        ResponseEntity<Map<String, Object>> response = technicalEventController.submitTechnicalEvent(
            1L, "Title", LocalDate.now(), "Host", "Category", 
            "Achievement", "Description", mockFile
        );

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertFalse((Boolean) response.getBody().get("success"));
    }

    @Test
    void submitTechnicalEvent_ShouldFailWhenDocumentMissing() {
        ResponseEntity<Map<String, Object>> response = technicalEventController.submitTechnicalEvent(
            1L, "Title", LocalDate.now(), "Host", "Category", 
            "Achievement", "Description", null
        );

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertFalse((Boolean) response.getBody().get("success"));
    }

    @Test
    void getEventsByStudentId_ShouldReturnEvents() {
        when(technicalEventService.getEventsByStudentId(1L)).thenReturn(Arrays.asList(event));

        ResponseEntity<List<TechnicalEvent>> response = 
            technicalEventController.getEventsByStudentId(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
        verify(technicalEventService).getEventsByStudentId(1L);
    }

    @Test
    void getPendingAndApprovedEventsByStudent_ShouldReturnFilteredEvents() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(student));
        when(technicalEventService.getPendingAndApprovedEventsByStudent(student))
            .thenReturn(Arrays.asList(event));

        ResponseEntity<List<TechnicalEvent>> response = 
            technicalEventController.getPendingAndApprovedEventsByStudent(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
        verify(technicalEventService).getPendingAndApprovedEventsByStudent(student);
    }

    @Test
    void getPendingAndApprovedEventsByStudent_ShouldFailWhenStudentNotFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> 
            technicalEventController.getPendingAndApprovedEventsByStudent(1L)
        );
    }
}