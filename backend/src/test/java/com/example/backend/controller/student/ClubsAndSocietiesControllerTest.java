package com.example.backend.controller.student;

import com.example.backend.model.Student;
import com.example.backend.model.Faculty;
import com.example.backend.model.student.ClubsAndSocieties;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.student.ClubsAndSocietiesService;
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
class ClubsAndSocietiesControllerTest {

    @Mock private ClubsAndSocietiesService clubsAndSocietiesService;
    @Mock private UserRepository userRepository;
    @Mock private MainService mainService;
    
    @InjectMocks private ClubsAndSocietiesController controller;
    
    private Student testStudent;
    private Faculty testFaculty;
    private ClubsAndSocieties testEntry;
    private MultipartFile testFile;

    @BeforeEach
    void setUp() {
        testFaculty = new Faculty();
        testStudent = new Student();
        testStudent.setId(1L);
        testStudent.setFaculty(testFaculty);
        
        testEntry = new ClubsAndSocieties();
        testEntry.setId(1L);
        
        testFile = new MockMultipartFile("test", "test.pdf", "application/pdf", "test".getBytes());
    }

    @Test
    void submitClubsAndSocieties_Success() throws Exception {
        when(userRepository.findById(anyLong())).thenReturn(Optional.of(testStudent));
        when(mainService.saveFile(any())).thenReturn("/path/to/file");
        when(clubsAndSocietiesService.saveClubsAndSocieties(any())).thenReturn(testEntry);

        ResponseEntity<Map<String, Object>> response = controller.submitClubsAndSocieties(
            1L, "Title", "Position", LocalDate.now(), null, "Category", "Desc", testFile);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue((Boolean) response.getBody().get("success"));
    }

    @Test
    void getAllClubsAndSocieties_Success() {
        when(clubsAndSocietiesService.getAllClubsAndSocieties()).thenReturn(Collections.singletonList(testEntry));

        ResponseEntity<List<ClubsAndSocieties>> response = controller.getAllClubsAndSocieties();
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    void getByStudentId_Success() {
        when(clubsAndSocietiesService.getByStudentId(anyLong())).thenReturn(Collections.singletonList(testEntry));

        ResponseEntity<List<ClubsAndSocieties>> response = controller.getByStudentId(1L);
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    void getPendingAndApprovedEventsByStudent_Success() {
        when(userRepository.findById(anyLong())).thenReturn(Optional.of(testStudent));
        when(clubsAndSocietiesService.getPendingAndApprovedEventsByStudent(any()))
            .thenReturn(Collections.singletonList(testEntry));

        ResponseEntity<List<ClubsAndSocieties>> response = controller.getPendingAndApprovedEventsByStudent(1L);
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }
}