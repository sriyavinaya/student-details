package com.example.backend.service.student;

import com.example.backend.model.Student;
import com.example.backend.model.student.JobOpportunity;
import com.example.backend.repository.student.JobOpportunityRepository;
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
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class JobOpportunityServiceTest {

    @Mock
    private JobOpportunityRepository jobOpportunityRepository;

    @InjectMocks
    private JobOpportunityService jobOpportunityService;

    private JobOpportunity opportunity1;
    private JobOpportunity opportunity2;
    private Student student;

    @BeforeEach
    void setUp() {
        student = new Student();
        student.setId(1L);
        
        opportunity1 = new JobOpportunity();
        opportunity1.setId(1L);
        opportunity1.setStudent(student);
        
        opportunity2 = new JobOpportunity();
        opportunity2.setId(2L);
        opportunity2.setStudent(student);
    }

    @Test
    void getAllOpportunities_ShouldReturnAllOpportunities() {
        when(jobOpportunityRepository.findAll()).thenReturn(Arrays.asList(opportunity1, opportunity2));
        
        List<JobOpportunity> result = jobOpportunityService.getAllOpportunities();
        
        assertEquals(2, result.size());
        verify(jobOpportunityRepository, times(1)).findAll();
    }

    @Test
    void saveJobOpportunity_ShouldSaveAndReturnOpportunity() {
        when(jobOpportunityRepository.save(any(JobOpportunity.class))).thenReturn(opportunity1);
        
        JobOpportunity result = jobOpportunityService.saveJobOpportunity(opportunity1);
        
        assertNotNull(result);
        assertEquals(1L, result.getId());
        verify(jobOpportunityRepository, times(1)).save(opportunity1);
        verify(jobOpportunityRepository, times(1)).flush();
    }

    @Test
    void getOpportunitiesByStudent_ShouldReturnStudentOpportunities() {
        when(jobOpportunityRepository.findByStudent(student)).thenReturn(Arrays.asList(opportunity1));
        
        List<JobOpportunity> result = jobOpportunityService.getOpportunitiesByStudent(student);
        
        assertEquals(1, result.size());
        assertEquals(student, result.get(0).getStudent());
        verify(jobOpportunityRepository, times(1)).findByStudent(student);
    }

    @Test
    void getOpportunitiesByStudentId_ShouldReturnOpportunities() {
        when(jobOpportunityRepository.findByStudent_Id(1L)).thenReturn(Arrays.asList(opportunity1, opportunity2));
        
        List<JobOpportunity> result = jobOpportunityService.getOpportunitiesByStudentId(1L);
        
        assertEquals(2, result.size());
        verify(jobOpportunityRepository, times(1)).findByStudent_Id(1L);
    }

    @Test
    void getPendingAndApprovedOpportunitiesByStudent_ShouldReturnFilteredOpportunities() {
        when(jobOpportunityRepository.findPendingAndApprovedByStudent(student))
            .thenReturn(Arrays.asList(opportunity1));
        
        List<JobOpportunity> result = jobOpportunityService.getPendingAndApprovedOpportunitiesByStudent(student);
        
        assertEquals(1, result.size());
        verify(jobOpportunityRepository, times(1)).findPendingAndApprovedByStudent(student);
    }

    @Test
    void getOpportunitiesByType_ShouldReturnTypedOpportunities() {
        when(jobOpportunityRepository.findByType(any())).thenReturn(Arrays.asList(opportunity1));
        
        List<JobOpportunity> result = jobOpportunityService.getOpportunitiesByType(JobOpportunity.JobType.INTERNSHIP);
        
        assertEquals(1, result.size());
        verify(jobOpportunityRepository, times(1)).findByType(any());
    }
}