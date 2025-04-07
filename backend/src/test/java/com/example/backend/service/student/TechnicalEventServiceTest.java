package com.example.backend.service.student;

import com.example.backend.model.Student;
import com.example.backend.model.student.TechnicalEvent;
import com.example.backend.repository.student.TechnicalEventRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TechnicalEventServiceTest {

    @Mock
    private TechnicalEventRepository technicalEventRepository;

    @InjectMocks
    private TechnicalEventService technicalEventService;

    private TechnicalEvent event1;
    private TechnicalEvent event2;
    private Student student;

    @BeforeEach
    void setUp() {
        student = new Student();
        student.setId(1L);

        event1 = new TechnicalEvent();
        event1.setId(1L);
        event1.setStudent(student);
        event1.setVerificationStatus("Pending");

        event2 = new TechnicalEvent();
        event2.setId(2L);
        event2.setStudent(student);
        event2.setVerificationStatus("Approved");
    }

    @Test
    void getAllEvents_ShouldReturnAllEvents() {
        when(technicalEventRepository.findAll()).thenReturn(Arrays.asList(event1, event2));

        List<TechnicalEvent> result = technicalEventService.getAllEvents();

        assertEquals(2, result.size());
        verify(technicalEventRepository).findAll();
    }

    @Test
    void saveTechnicalEvent_ShouldSaveAndReturnEvent() {
        when(technicalEventRepository.save(event1)).thenReturn(event1);

        TechnicalEvent result = technicalEventService.saveTechnicalEvent(event1);

        assertNotNull(result);
        assertEquals(event1, result);
        verify(technicalEventRepository).save(event1);
        verify(technicalEventRepository).flush();
    }

    @Test
    void getEventsByStudent_ShouldReturnStudentEvents() {
        when(technicalEventRepository.findByStudent(student)).thenReturn(Arrays.asList(event1));

        List<TechnicalEvent> result = technicalEventService.getEventsByStudent(student);

        assertEquals(1, result.size());
        assertEquals(event1, result.get(0));
        verify(technicalEventRepository).findByStudent(student);
    }

    @Test
    void getEventsByStudentId_ShouldReturnEventsForStudentId() {
        when(technicalEventRepository.findByStudent_Id(1L)).thenReturn(Arrays.asList(event1, event2));

        List<TechnicalEvent> result = technicalEventService.getEventsByStudentId(1L);

        assertEquals(2, result.size());
        verify(technicalEventRepository).findByStudent_Id(1L);
    }

    @Test
    void getPendingAndApprovedEventsByStudent_ShouldReturnFilteredEvents() {
        when(technicalEventRepository.findPendingAndApprovedByStudent(student))
            .thenReturn(Arrays.asList(event1, event2));

        List<TechnicalEvent> result = technicalEventService.getPendingAndApprovedEventsByStudent(student);

        assertEquals(2, result.size());
        verify(technicalEventRepository).findPendingAndApprovedByStudent(student);
    }
}