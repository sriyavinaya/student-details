package com.example.backend.service.student;

import com.example.backend.model.Student;
import com.example.backend.model.student.Publications;
import com.example.backend.repository.student.PublicationsRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PublicationsServiceTest {

    @Mock
    private PublicationsRepository publicationsRepository;

    @InjectMocks
    private PublicationsService publicationsService;

    private Publications publication1;
    private Publications publication2;
    private Student student;

    @BeforeEach
    void setUp() {
        student = new Student();
        student.setId(1L);
        
        publication1 = new Publications();
        publication1.setId(1L);
        publication1.setStudent(student);
        
        publication2 = new Publications();
        publication2.setId(2L);
        publication2.setStudent(student);
    }

    @Test
    void getAllPublications_ShouldReturnAllPublications() {
        when(publicationsRepository.findAll()).thenReturn(Arrays.asList(publication1, publication2));
        
        List<Publications> result = publicationsService.getAllPublications();
        
        assertEquals(2, result.size());
        verify(publicationsRepository, times(1)).findAll();
    }

    @Test
    void savePublication_ShouldSaveAndReturnPublication() {
        when(publicationsRepository.save(any(Publications.class))).thenReturn(publication1);
        
        Publications result = publicationsService.savePublication(publication1);
        
        assertNotNull(result);
        assertEquals(1L, result.getId());
        verify(publicationsRepository, times(1)).save(publication1);
    }

    @Test
    void getByStudent_ShouldReturnStudentPublications() {
        when(publicationsRepository.findByStudent(student)).thenReturn(Arrays.asList(publication1));
        
        List<Publications> result = publicationsService.getByStudent(student);
        
        assertEquals(1, result.size());
        assertEquals(student, result.get(0).getStudent());
        verify(publicationsRepository, times(1)).findByStudent(student);
    }

    @Test
    void getByStudentId_ShouldReturnPublications() {
        when(publicationsRepository.findByStudent_Id(1L)).thenReturn(Arrays.asList(publication1, publication2));
        
        List<Publications> result = publicationsService.getByStudentId(1L);
        
        assertEquals(2, result.size());
        verify(publicationsRepository, times(1)).findByStudent_Id(1L);
    }

    @Test
    void getPendingAndApprovedEventsByStudent_ShouldReturnFilteredPublications() {
        when(publicationsRepository.findPendingAndApprovedByStudent(student))
            .thenReturn(Arrays.asList(publication1));
        
        List<Publications> result = publicationsService.getPendingAndApprovedEventsByStudent(student);
        
        assertEquals(1, result.size());
        verify(publicationsRepository, times(1)).findPendingAndApprovedByStudent(student);
    }
}