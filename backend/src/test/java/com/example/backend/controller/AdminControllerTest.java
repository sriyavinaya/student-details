package com.example.backend.controller;

import com.example.backend.model.Faculty;
import com.example.backend.model.Student;
import com.example.backend.service.AdminService;
import com.example.backend.service.StudentService;
import com.example.backend.service.faculty.FacultyService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.example.backend.service.faculty.FacultyService;


@ExtendWith(MockitoExtension.class)
class AdminControllerTest {

    @Mock
    private StudentService studentService;

    @Mock
    private FacultyService facultyService;

    @Mock
    private AdminService adminService;  // Make sure this is properly mocked

    @InjectMocks
    private AdminController adminController;  // This will inject all mocks

    private Student student1;
    private Student student2;
    private Faculty faculty1;
    private Faculty faculty2;

    @BeforeEach
    void setUp() {
        student1 = new Student();
        student1.setId(1L);
        student2 = new Student();
        student2.setId(2L);

        faculty1 = new Faculty();
        faculty1.setId(1L);
        faculty2 = new Faculty();
        faculty2.setId(2L);

        // Initialize the controller with all dependencies
        adminController = new AdminController(studentService, facultyService);
        adminController.adminService = adminService;  // Manually set the adminService
    }



    @Test
    void getStudents_ShouldReturnAllStudents() {
        when(studentService.getAllStudents()).thenReturn(Arrays.asList(student1, student2));
        
        ResponseEntity<List<Student>> response = adminController.getStudents();
        
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(2, response.getBody().size());
        verify(studentService).getAllStudents();
    }

    @Test
    void getFaculty_ShouldReturnAllFaculty() {
        when(facultyService.getAllFaculty()).thenReturn(Arrays.asList(faculty1, faculty2));
        
        ResponseEntity<List<Faculty>> response = adminController.getFaculty();
        
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(2, response.getBody().size());
        verify(facultyService).getAllFaculty();
    }

    @Test
    void toggleUserStatus_ShouldReturnActivationMessage() {
        // Arrange
        when(adminService.toggleUserStatus(1L)).thenReturn(true);
        
        // Act
        ResponseEntity<String> response = adminController.toggleUserStatus(1L);
        
        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("User reactivated", response.getBody());
        verify(adminService).toggleUserStatus(1L);
    }

    @Test
    void toggleUserStatus_ShouldReturnDeactivationMessage() {
        // Arrange
        when(adminService.toggleUserStatus(2L)).thenReturn(false);
        
        // Act
        ResponseEntity<String> response = adminController.toggleUserStatus(2L);
        
        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("User deactivated", response.getBody());
        verify(adminService).toggleUserStatus(2L);
    }
}