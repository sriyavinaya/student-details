package com.example.backend.service.student;

import com.example.backend.model.Student;
import com.example.backend.model.student.SportsEvent;
import com.example.backend.repository.student.SportsEventRepository;
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
class SportsEventServiceTest {

    @Mock
    private SportsEventRepository sportsEventRepository;

    @InjectMocks
    private SportsEventService sportsEventService;

    private SportsEvent event1;
    private SportsEvent event2;
    private Student student;

    @BeforeEach
    void setUp() {
        student = new Student();
        student.setId(1L);
        
        event1 = new SportsEvent();
        event1.setId(1L);
        event1.setStudent(student);
        
        event2 = new SportsEvent();
        event2.setId(2L);
        event2.setStudent(student);
    }

    @Test
    void getAllSportsEvents_ShouldReturnAllEvents() {
        when(sportsEventRepository.findAll()).thenReturn(Arrays.asList(event1, event2));
        
        List<SportsEvent> result = sportsEventService.getAllSportsEvents();
        
        assertEquals(2, result.size());
        verify(sportsEventRepository, times(1)).findAll();
    }

    @Test
    void saveSportsEvent_ShouldSaveAndReturnEvent() {
        when(sportsEventRepository.save(any(SportsEvent.class))).thenReturn(event1);
        
        SportsEvent result = sportsEventService.saveSportsEvent(event1);
        
        assertNotNull(result);
        assertEquals(1L, result.getId());
        verify(sportsEventRepository, times(1)).save(event1);
    }

    @Test
    void getByStudent_ShouldReturnStudentEvents() {
        when(sportsEventRepository.findByStudent(student)).thenReturn(Arrays.asList(event1));
        
        List<SportsEvent> result = sportsEventService.getByStudent(student);
        
        assertEquals(1, result.size());
        assertEquals(student, result.get(0).getStudent());
        verify(sportsEventRepository, times(1)).findByStudent(student);
    }

    @Test
    void getByStudentId_ShouldReturnEvents() {
        when(sportsEventRepository.findByStudent_Id(1L)).thenReturn(Arrays.asList(event1, event2));
        
        List<SportsEvent> result = sportsEventService.getByStudentId(1L);
        
        assertEquals(2, result.size());
        verify(sportsEventRepository, times(1)).findByStudent_Id(1L);
    }

    @Test
    void getPendingAndApprovedEventsByStudent_ShouldReturnFilteredEvents() {
        when(sportsEventRepository.findPendingAndApprovedByStudent(student))
            .thenReturn(Arrays.asList(event1));
        
        List<SportsEvent> result = sportsEventService.getPendingAndApprovedEventsByStudent(student);
        
        assertEquals(1, result.size());
        verify(sportsEventRepository, times(1)).findPendingAndApprovedByStudent(student);
    }
}