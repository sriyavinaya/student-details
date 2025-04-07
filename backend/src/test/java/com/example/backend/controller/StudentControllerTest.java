package com.example.backend.controller;

import com.example.backend.model.Student;
import com.example.backend.service.StudentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StudentControllerTest {

    @Mock
    private StudentService studentService;

    @InjectMocks
    private StudentController studentController;

    private Student student;

    @BeforeEach
    void setUp() {
        student = new Student();
        student.setId(1L);
        student.setName("John Doe");
        student.setEmail("john.doe@example.com");
    }

    @Test
    void getStudentById_WhenStudentExists_ShouldReturnStudent() {
        // Arrange
        when(studentService.getStudentById(1L)).thenReturn(Optional.of(student));

        // Act
        ResponseEntity<Student> response = studentController.getStudentById(1L);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1L, response.getBody().getId());
        assertEquals("John Doe", response.getBody().getName());
        verify(studentService, times(1)).getStudentById(1L);
    }

    @Test
    void getStudentById_WhenStudentNotExists_ShouldReturnNotFound() {
        // Arrange
        when(studentService.getStudentById(1L)).thenReturn(Optional.empty());

        // Act
        ResponseEntity<Student> response = studentController.getStudentById(1L);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertNull(response.getBody());
        verify(studentService, times(1)).getStudentById(1L);
    }

    @Test
    void getStudentById_WhenServiceThrowsException_ShouldPropagateException() {
        // Arrange
        when(studentService.getStudentById(1L)).thenThrow(new RuntimeException("Database error"));

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            studentController.getStudentById(1L);
        });
        verify(studentService, times(1)).getStudentById(1L);
    }
}