package com.example.backend.controller.student;

import com.example.backend.model.Student;
import com.example.backend.model.Faculty;
import com.example.backend.model.student.CulturalEvent;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.student.CulturalEventService;
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

import java.time.LocalDate;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CulturalEventControllerTest {

    @Mock private CulturalEventService culturalEventService;
    @Mock private UserRepository userRepository;
    @Mock private MainService mainService;
    
    @InjectMocks private CulturalEventController controller;
    
    private Student testStudent;
    private Faculty testFaculty;
    private CulturalEvent testEvent;
    private MultipartFile testFile;

    @BeforeEach
    void setUp() {
        testFaculty = new Faculty();
        testStudent = new Student();
        testStudent.setId(1L);
        testStudent.setFaculty(testFaculty);
        
        testEvent = new CulturalEvent();
        testEvent.setId(1L);
        
        testFile = new MockMultipartFile("test", "test.pdf", "application/pdf", "test".getBytes());
    }

    @Test
    void submitCulturalEvent_Success() throws Exception {
        when(userRepository.findById(anyLong())).thenReturn(Optional.of(testStudent));
        when(mainService.saveFile(any())).thenReturn("/path/to/file");
        when(culturalEventService.saveCulturalEvent(any())).thenReturn(testEvent);

        ResponseEntity<Map<String, Object>> response = controller.submitCulturalEvent(
            1L, "Title", LocalDate.now(), "Host", "Category", "Achievement", "Desc", testFile);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue((Boolean) response.getBody().get("success"));
    }

    @Test
    void getAllCulturalEvents_Success() {
        when(culturalEventService.getAllCulturalEvents()).thenReturn(Collections.singletonList(testEvent));

        ResponseEntity<List<CulturalEvent>> response = controller.getAllCulturalEvents();
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    void getByStudentId_Success() {
        when(culturalEventService.getByStudentId(anyLong())).thenReturn(Collections.singletonList(testEvent));

        ResponseEntity<List<CulturalEvent>> response = controller.getByStudentId(1L);
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    void getPendingAndApprovedEventsByStudent_Success() {
        when(userRepository.findById(anyLong())).thenReturn(Optional.of(testStudent));
        when(culturalEventService.getPendingAndApprovedEventsByStudent(any()))
            .thenReturn(Collections.singletonList(testEvent));

        ResponseEntity<List<CulturalEvent>> response = controller.getPendingAndApprovedEventsByStudent(1L);
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }
}