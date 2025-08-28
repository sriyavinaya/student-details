package com.example.backend.service.student;

import com.example.backend.model.Student;
import com.example.backend.model.student.CulturalEvent;
import com.example.backend.repository.student.CulturalEventRepository;
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
class CulturalEventServiceTest {

    @Mock
    private CulturalEventRepository culturalEventRepository;

    @InjectMocks
    private CulturalEventService culturalEventService;

    private CulturalEvent event1;
    private CulturalEvent event2;
    private Student student;

    @BeforeEach
    void setUp() {
        student = new Student();
        student.setId(1L);
        
        event1 = new CulturalEvent();
        event1.setId(1L);
        event1.setStudent(student);
        
        event2 = new CulturalEvent();
        event2.setId(2L);
        event2.setStudent(student);
    }

    @Test
    void getAllCulturalEvents_ShouldReturnAllEvents() {
        when(culturalEventRepository.findAll()).thenReturn(Arrays.asList(event1, event2));
        
        List<CulturalEvent> result = culturalEventService.getAllCulturalEvents();
        
        assertEquals(2, result.size());
        verify(culturalEventRepository, times(1)).findAll();
    }

    @Test
    void saveCulturalEvent_ShouldSaveAndReturnEvent() {
        when(culturalEventRepository.save(any(CulturalEvent.class))).thenReturn(event1);
        
        CulturalEvent result = culturalEventService.saveCulturalEvent(event1);
        
        assertNotNull(result);
        assertEquals(1L, result.getId());
        verify(culturalEventRepository, times(1)).save(event1);
    }

    @Test
    void getByStudent_ShouldReturnStudentEvents() {
        when(culturalEventRepository.findByStudent(student)).thenReturn(Arrays.asList(event1));
        
        List<CulturalEvent> result = culturalEventService.getByStudent(student);
        
        assertEquals(1, result.size());
        assertEquals(student, result.get(0).getStudent());
        verify(culturalEventRepository, times(1)).findByStudent(student);
    }

    @Test
    void getByStudentId_ShouldReturnEvents() {
        when(culturalEventRepository.findByStudent_Id(1L)).thenReturn(Arrays.asList(event1, event2));
        
        List<CulturalEvent> result = culturalEventService.getByStudentId(1L);
        
        assertEquals(2, result.size());
        verify(culturalEventRepository, times(1)).findByStudent_Id(1L);
    }

    @Test
    void getPendingAndApprovedEventsByStudent_ShouldReturnFilteredEvents() {
        when(culturalEventRepository.findPendingAndApprovedByStudent(student))
            .thenReturn(Arrays.asList(event1));
        
        List<CulturalEvent> result = culturalEventService.getPendingAndApprovedEventsByStudent(student);
        
        assertEquals(1, result.size());
        verify(culturalEventRepository, times(1)).findPendingAndApprovedByStudent(student);
    }
}