package com.example.backend.controller.student;

import com.example.backend.model.Student;
import com.example.backend.model.Faculty;
import com.example.backend.model.student.JobOpportunity;
import com.example.backend.model.student.JobOpportunity.JobType;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.student.JobOpportunityService;
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
class JobOpportunityControllerTest {

    @Mock private JobOpportunityService jobOpportunityService;
    @Mock private UserRepository userRepository;
    @Mock private MainService mainService;
    
    @InjectMocks private JobOpportunityController controller;
    
    private Student testStudent;
    private Faculty testFaculty;
    private JobOpportunity testOpportunity;
    private MultipartFile testFile;

    @BeforeEach
    void setUp() {
        testFaculty = new Faculty();
        testStudent = new Student();
        testStudent.setId(1L);
        testStudent.setFaculty(testFaculty);
        
        testOpportunity = new JobOpportunity();
        testOpportunity.setId(1L);
        testOpportunity.setStudent(testStudent);
        
        testFile = new MockMultipartFile("test", "test.pdf", "application/pdf", "test".getBytes());
    }

    @Test
    void submitJobOpportunity_Success() throws Exception {
        when(userRepository.findById(anyLong())).thenReturn(Optional.of(testStudent));
        when(mainService.saveFile(any())).thenReturn("/path/to/file");
        when(jobOpportunityService.saveJobOpportunity(any())).thenReturn(testOpportunity);

        ResponseEntity<Map<String, Object>> response = controller.submitJobOpportunity(
            1L, "Title", "Desc", "Company", LocalDate.now(), 
            "Role", JobType.INTERNSHIP, testFile, "3 months", "1000", null);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue((Boolean) response.getBody().get("success"));
    }

    @Test
    void submitJobOpportunity_StudentNotFound() {
        when(userRepository.findById(anyLong())).thenReturn(Optional.empty());

        ResponseEntity<Map<String, Object>> response = controller.submitJobOpportunity(
            999L, "Title", "Desc", "Company", LocalDate.now(), 
            "Role", JobType.INTERNSHIP, testFile, "3 months", "1000", null);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    void getOpportunitiesByStudentId_Success() {
        when(jobOpportunityService.getOpportunitiesByStudentId(anyLong()))
            .thenReturn(Collections.singletonList(testOpportunity));

        ResponseEntity<List<JobOpportunity>> response = controller.getOpportunitiesByStudentId(1L);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
    }

    @Test
    void getPendingAndApprovedOpportunitiesByStudent_Success() {
        when(userRepository.findById(anyLong())).thenReturn(Optional.of(testStudent));
        when(jobOpportunityService.getPendingAndApprovedOpportunitiesByStudent(any()))
            .thenReturn(Collections.singletonList(testOpportunity));

        ResponseEntity<List<JobOpportunity>> response = controller.getPendingAndApprovedOpportunitiesByStudent(1L);
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    void getOpportunitiesByType_Success() {
        when(jobOpportunityService.getOpportunitiesByType(any())).thenReturn(Collections.singletonList(testOpportunity));

        ResponseEntity<List<JobOpportunity>> response = controller.getOpportunitiesByType(JobType.INTERNSHIP);
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }
}