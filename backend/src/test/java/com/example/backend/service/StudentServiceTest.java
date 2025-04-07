package com.example.backend.service;

import com.example.backend.model.Student;
import com.example.backend.repository.StudentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StudentServiceTest {

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private ExcelUploadService excelUploadService;

    @Mock
    private MultipartFile file;

    @InjectMocks
    private StudentService studentService;

    private Student student1;
    private Student student2;
    private List<Student> studentList;

    @BeforeEach
    void setUp() {
        student1 = new Student();
        student1.setId(1L);
        student1.setName("John Doe");
        student1.setEmail("john@example.com");

        student2 = new Student();
        student2.setId(2L);
        student2.setName("Jane Smith");
        student2.setEmail("jane@example.com");

        studentList = Arrays.asList(student1, student2);
    }

    @Test
    void getAllStudents_ShouldReturnAllStudents() {
        when(studentRepository.findAll()).thenReturn(studentList);

        List<Student> result = studentService.getAllStudents();

        assertEquals(2, result.size());
        verify(studentRepository, times(1)).findAll();
    }

    @Test
    void getStudentById_WithExistingId_ShouldReturnStudent() {
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student1));

        Optional<Student> result = studentService.getStudentById(1L);

        assertTrue(result.isPresent());
        assertEquals("John Doe", result.get().getName());
        verify(studentRepository, times(1)).findById(1L);
    }

    @Test
    void getStudentById_WithNonExistingId_ShouldReturnEmpty() {
        when(studentRepository.findById(99L)).thenReturn(Optional.empty());

        Optional<Student> result = studentService.getStudentById(99L);

        assertFalse(result.isPresent());
        verify(studentRepository, times(1)).findById(99L);
    }

    @Test
    void saveStudent_ShouldReturnSavedStudent() {
        when(studentRepository.save(any(Student.class))).thenReturn(student1);

        Student result = studentService.saveStudent(student1);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        verify(studentRepository, times(1)).save(student1);
    }

    @Test
    void deleteStudent_ShouldCallRepositoryDelete() {
        doNothing().when(studentRepository).deleteById(1L);

        studentService.deleteStudent(1L);

        verify(studentRepository, times(1)).deleteById(1L);
    }

    @Test
    void saveStudentsToDatabase_WithValidExcelFile_ShouldSaveStudents() throws IOException {
        when(excelUploadService.isValidExcelFile(file)).thenReturn(true);
        when(excelUploadService.getStudentDataFromExcel(any()))
            .thenReturn(studentList);
        when(studentRepository.saveAll(anyList())).thenReturn(studentList);

        studentService.saveStudentsToDatabase(file);

        verify(excelUploadService, times(1)).isValidExcelFile(file);
        verify(excelUploadService, times(1)).getStudentDataFromExcel(any());
        verify(studentRepository, times(1)).saveAll(studentList);
    }

}