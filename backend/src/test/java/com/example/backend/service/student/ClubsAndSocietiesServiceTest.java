package com.example.backend.service.student;

import com.example.backend.model.Student;
import com.example.backend.model.student.ClubsAndSocieties;
import com.example.backend.repository.student.ClubsAndSocietiesRepository;
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
class ClubsAndSocietiesServiceTest {

    @Mock
    private ClubsAndSocietiesRepository clubsAndSocietiesRepository;

    @InjectMocks
    private ClubsAndSocietiesService clubsAndSocietiesService;

    private ClubsAndSocieties club1;
    private ClubsAndSocieties club2;
    private Student student;

    @BeforeEach
    void setUp() {
        student = new Student();
        student.setId(1L);
        
        club1 = new ClubsAndSocieties();
        club1.setId(1L);
        club1.setStudent(student);
        
        club2 = new ClubsAndSocieties();
        club2.setId(2L);
        club2.setStudent(student);
    }

    @Test
    void getAllClubsAndSocieties_ShouldReturnAllClubs() {
        when(clubsAndSocietiesRepository.findAll()).thenReturn(Arrays.asList(club1, club2));
        
        List<ClubsAndSocieties> result = clubsAndSocietiesService.getAllClubsAndSocieties();
        
        assertEquals(2, result.size());
        verify(clubsAndSocietiesRepository, times(1)).findAll();
    }

    @Test
    void saveClubsAndSocieties_ShouldSaveAndReturnClub() {
        when(clubsAndSocietiesRepository.save(any(ClubsAndSocieties.class))).thenReturn(club1);
        
        ClubsAndSocieties result = clubsAndSocietiesService.saveClubsAndSocieties(club1);
        
        assertNotNull(result);
        assertEquals(1L, result.getId());
        verify(clubsAndSocietiesRepository, times(1)).save(club1);
    }

    @Test
    void getByStudent_ShouldReturnStudentClubs() {
        when(clubsAndSocietiesRepository.findByStudent(student)).thenReturn(Arrays.asList(club1));
        
        List<ClubsAndSocieties> result = clubsAndSocietiesService.getByStudent(student);
        
        assertEquals(1, result.size());
        assertEquals(student, result.get(0).getStudent());
        verify(clubsAndSocietiesRepository, times(1)).findByStudent(student);
    }

    @Test
    void getByStudentId_ShouldReturnClubs() {
        when(clubsAndSocietiesRepository.findByStudent_Id(1L)).thenReturn(Arrays.asList(club1, club2));
        
        List<ClubsAndSocieties> result = clubsAndSocietiesService.getByStudentId(1L);
        
        assertEquals(2, result.size());
        verify(clubsAndSocietiesRepository, times(1)).findByStudent_Id(1L);
    }

    @Test
    void getByVerificationStatus_ShouldReturnFilteredClubs() {
        when(clubsAndSocietiesRepository.findByFlag(true)).thenReturn(Arrays.asList(club1));
        
        List<ClubsAndSocieties> result = clubsAndSocietiesService.getByVerificationStatus(true);
        
        assertEquals(1, result.size());
        verify(clubsAndSocietiesRepository, times(1)).findByFlag(true);
    }

    @Test
    void getPendingAndApprovedEventsByStudent_ShouldReturnFilteredClubs() {
        when(clubsAndSocietiesRepository.findPendingAndApprovedByStudent(student))
            .thenReturn(Arrays.asList(club1));
        
        List<ClubsAndSocieties> result = clubsAndSocietiesService.getPendingAndApprovedEventsByStudent(student);
        
        assertEquals(1, result.size());
        verify(clubsAndSocietiesRepository, times(1)).findPendingAndApprovedByStudent(student);
    }
}