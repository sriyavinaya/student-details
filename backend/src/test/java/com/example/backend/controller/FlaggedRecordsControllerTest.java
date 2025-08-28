package com.example.backend.controller;

import com.example.backend.model.student.Main;
import com.example.backend.service.student.MainService;
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

@ExtendWith(MockitoExtension.class)
class FlaggedRecordsControllerTest {

    @Mock
    private MainService mainService;

    @InjectMocks
    private FlaggedRecordsController flaggedRecordsController;

    private Main flaggedRecord1;
    private Main flaggedRecord2;

    @BeforeEach
    void setUp() {
        flaggedRecord1 = new Main();
        flaggedRecord1.setId(1L);
        flaggedRecord1.setFlag(true);

        flaggedRecord2 = new Main();
        flaggedRecord2.setId(2L);
        flaggedRecord2.setFlag(true);
    }

    @Test
    void getAllFlaggedRecords_ShouldReturnFlaggedRecords() {
        // Arrange
        List<Main> flaggedRecords = Arrays.asList(flaggedRecord1, flaggedRecord2);
        when(mainService.getAllByFlag(true)).thenReturn(flaggedRecords);

        // Act
        ResponseEntity<List<Main>> response = flaggedRecordsController.getAllFlaggedRecords();

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(2, response.getBody().size());
        verify(mainService, times(1)).getAllByFlag(true);
    }

    @Test
    void getAllFlaggedRecords_WhenNoRecords_ShouldReturnEmptyList() {
        // Arrange
        when(mainService.getAllByFlag(true)).thenReturn(List.of());

        // Act
        ResponseEntity<List<Main>> response = flaggedRecordsController.getAllFlaggedRecords();

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody().isEmpty());
        verify(mainService, times(1)).getAllByFlag(true);
    }

    @Test
    void flagRecord_ShouldFlagRecordSuccessfully() {
        // Arrange
        Long recordId = 1L;
        doNothing().when(mainService).flagRecord(recordId);

        // Act
        ResponseEntity<String> response = flaggedRecordsController.flagRecord(recordId);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Record flagged for deletion successfully", response.getBody());
        verify(mainService, times(1)).flagRecord(recordId);
    }

    @Test
    void flagRecord_WhenServiceThrowsException_ShouldReturnErrorResponse() {
        // Arrange
        Long recordId = 1L;
        String errorMessage = "Database error";
        doThrow(new RuntimeException(errorMessage)).when(mainService).flagRecord(recordId);

        // Act
        ResponseEntity<String> response = flaggedRecordsController.flagRecord(recordId);

        // Assert
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertTrue(response.getBody().contains(errorMessage));
        verify(mainService, times(1)).flagRecord(recordId);
    }

    @Test
    void approveDeletion_ShouldDeleteRecordSuccessfully() {
        // Arrange
        Long recordId = 1L;
        doNothing().when(mainService).deleteRecord(recordId);

        // Act
        ResponseEntity<String> response = flaggedRecordsController.approveDeletion(recordId);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Record deleted successfully", response.getBody());
        verify(mainService, times(1)).deleteRecord(recordId);
    }

    @Test
    void approveDeletion_WhenServiceThrowsException_ShouldReturnErrorResponse() {
        // Arrange
        Long recordId = 1L;
        String errorMessage = "Delete failed";
        doThrow(new RuntimeException(errorMessage)).when(mainService).deleteRecord(recordId);

        // Act
        ResponseEntity<String> response = flaggedRecordsController.approveDeletion(recordId);

        // Assert
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertTrue(response.getBody().contains(errorMessage));
        verify(mainService, times(1)).deleteRecord(recordId);
    }

    @Test
    void rejectDeletion_ShouldUnflagRecordSuccessfully() {
        // Arrange
        Long recordId = 1L;
        doNothing().when(mainService).updateFlag(recordId, false);

        // Act
        ResponseEntity<String> response = flaggedRecordsController.rejectDeletion(recordId);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Deletion request rejected and record unflagged", response.getBody());
        verify(mainService, times(1)).updateFlag(recordId, false);
    }

    @Test
    void rejectDeletion_WhenServiceThrowsException_ShouldReturnErrorResponse() {
        // Arrange
        Long recordId = 1L;
        String errorMessage = "Update failed";
        doThrow(new RuntimeException(errorMessage)).when(mainService).updateFlag(recordId, false);

        // Act
        ResponseEntity<String> response = flaggedRecordsController.rejectDeletion(recordId);

        // Assert
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertTrue(response.getBody().contains(errorMessage));
        verify(mainService, times(1)).updateFlag(recordId, false);
    }
}