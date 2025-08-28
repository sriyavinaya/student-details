package com.example.backend.service.faculty;

import com.example.backend.model.Faculty;
import com.example.backend.model.Student;
import com.example.backend.repository.FacultyRepository;
import com.example.backend.repository.StudentRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.faculty.FacultyService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FacultyServiceTest {

    @Mock
    private FacultyRepository facultyRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private StudentRepository studentRepository;

    @InjectMocks
    private FacultyService facultyService;

    private Faculty faculty;
    private Student student1;
    private Student student2;

    @BeforeEach
    void setUp() {
        faculty = new Faculty();
        faculty.setId(1L);
        faculty.setEmail("faculty@example.com");

        student1 = new Student();
        student1.setId(1L);
        student1.setFaculty(faculty);

        student2 = new Student();
        student2.setId(2L);
        student2.setFaculty(faculty);
    }

    @Test
    void getStudentsUnderFaculty_WithFacultyObject_ShouldReturnStudents() {
        when(facultyRepository.findStudentsByFaculty(faculty)).thenReturn(Arrays.asList(student1, student2));

        List<Student> result = facultyService.getStudentsUnderFaculty(faculty);

        assertEquals(2, result.size());
        verify(facultyRepository).findStudentsByFaculty(faculty);
    }

    @Test
    void getStudentsUnderFaculty_WithFacultyId_ShouldReturnStudents() {
        when(facultyRepository.findById(1L)).thenReturn(Optional.of(faculty));
        when(facultyRepository.findStudentsByFaculty(faculty)).thenReturn(Arrays.asList(student1, student2));

        List<Student> result = facultyService.getStudentsUnderFaculty(1L);

        assertEquals(2, result.size());
        verify(facultyRepository).findById(1L);
        verify(facultyRepository).findStudentsByFaculty(faculty);
    }

    @Test
    void getStudentsUnderFaculty_WithInvalidFacultyId_ShouldThrowException() {
        when(facultyRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> facultyService.getStudentsUnderFaculty(99L));
    }

    @Test
    void getFacultyByEmail_ShouldReturnFaculty() {
        when(facultyRepository.findByEmail("faculty@example.com")).thenReturn(Optional.of(faculty));

        Optional<Faculty> result = facultyService.getFacultyByEmail("faculty@example.com");

        assertTrue(result.isPresent());
        assertEquals(faculty, result.get());
    }

    @Test
    void getAllFaculty_ShouldReturnAllFaculty() {
        Faculty faculty2 = new Faculty();
        faculty2.setId(2L);
        when(facultyRepository.findAll()).thenReturn(Arrays.asList(faculty, faculty2));

        List<Faculty> result = facultyService.getAllFaculty();

        assertEquals(2, result.size());
        verify(facultyRepository).findAll();
    }

    @Test
    void getFacultyById_ShouldReturnFaculty() {
        when(facultyRepository.findById(1L)).thenReturn(Optional.of(faculty));

        Optional<Faculty> result = facultyService.getFacultyById(1L);

        assertTrue(result.isPresent());
        assertEquals(faculty, result.get());
    }

    @Test
    void saveFaculty_ShouldReturnSavedFaculty() {
        when(facultyRepository.save(faculty)).thenReturn(faculty);

        Faculty result = facultyService.saveFaculty(faculty);

        assertEquals(faculty, result);
        verify(facultyRepository).save(faculty);
    }

    @Test
    void deleteFaculty_ShouldCallDelete() {
        facultyService.deleteFaculty(1L);

        verify(facultyRepository).deleteById(1L);
    }
}