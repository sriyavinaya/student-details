package com.example.backend.controller.faculty;

import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.Faculty;
import com.example.backend.model.Student;
import com.example.backend.model.student.Main;
import com.example.backend.repository.FacultyRepository;
import com.example.backend.repository.StudentRepository;
import com.example.backend.service.student.MainService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FacultyRecordControllerTest {

    @Mock
    private FacultyRepository facultyRepository;

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private MainService mainService;

    @InjectMocks
    private FacultyRecordController facultyRecordController;

    private Faculty faculty;
    private Student student;
    private Main pendingRecord;
    private Main rejectedRecord;

    @BeforeEach
    void setUp() {
        faculty = new Faculty();
        faculty.setId(1L);

        student = new Student();
        student.setId(1L);
        student.setFaculty(faculty);

        pendingRecord = new Main();
        pendingRecord.setId(1L);
        pendingRecord.setVerificationStatus("Pending");

        rejectedRecord = new Main();
        rejectedRecord.setId(2L);
        rejectedRecord.setVerificationStatus("Rejected");
    }

    @Test
    void getFacultyById_ShouldReturnFaculty() {
        when(facultyRepository.findById(1L)).thenReturn(Optional.of(faculty));

        ResponseEntity<Faculty> response = facultyRecordController.getFacultyById(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(faculty, response.getBody());
    }

    @Test
    void getFacultyById_ShouldThrowNotFound() {
        when(facultyRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> facultyRecordController.getFacultyById(99L));
    }

    @Test
    void getStudentsByFacultyId_ShouldReturnStudents() {
        when(facultyRepository.findById(1L)).thenReturn(Optional.of(faculty));
        when(studentRepository.findByFaculty(faculty)).thenReturn(Collections.singletonList(student));

        ResponseEntity<List<Student>> response = facultyRecordController.getStudentsByFacultyId(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
        assertEquals(student, response.getBody().get(0));
    }

    @Test
    void getPendingRecords_ShouldReturnRecords() {
        when(mainService.getPendingRecords(1L)).thenReturn(Collections.singletonList(pendingRecord));

        ResponseEntity<List<Main>> response = facultyRecordController.getPendingRecords(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
        assertEquals("Pending", response.getBody().get(0).getVerificationStatus());
    }

    @Test
    void approveRecord_ShouldReturnSuccess() {
        when(mainService.approveRecord(1L, 1L, "Approved")).thenReturn(true);

        ResponseEntity<String> response = facultyRecordController.approveRecord(
            1L, 1L, Map.of("comment", "Approved"));

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Record approved successfully.", response.getBody());
    }

    @Test
    void approveRecord_ShouldReturnForbidden() {
        when(mainService.approveRecord(1L, 1L, null)).thenReturn(false);

        ResponseEntity<String> response = facultyRecordController.approveRecord(
            1L, 1L, null);

        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        assertTrue(response.getBody().contains("Unauthorized"));
    }

    @Test
    void rejectRecord_ShouldReturnSuccess() {
        when(mainService.rejectRecord(1L, 1L, "Incomplete")).thenReturn(true);

        ResponseEntity<String> response = facultyRecordController.rejectRecord(
            1L, 1L, Map.of("comment", "Incomplete"));

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Record rejected successfully.", response.getBody());
    }

    @Test
    void rejectRecord_ShouldReturnBadRequest_WhenNoComment() {
        ResponseEntity<String> response = facultyRecordController.rejectRecord(
            1L, 1L, Map.of());

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertTrue(response.getBody().contains("Rejection comment is required"));
    }

    @Test
    void getRejectedRecords_ShouldReturnRecords() {
        when(mainService.getRejectedRecords(1L)).thenReturn(Collections.singletonList(rejectedRecord));

        ResponseEntity<List<Main>> response = facultyRecordController.getRejectedRecords(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
        assertEquals("Rejected", response.getBody().get(0).getVerificationStatus());
    }
}