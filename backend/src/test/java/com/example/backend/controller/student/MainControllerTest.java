package com.example.backend.controller.student;

import com.example.backend.controller.student.MainController;
import com.example.backend.model.student.Main;
import com.example.backend.service.student.MainService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MainControllerTest {

    @Mock
    private MainService mainService;

    @Mock
    private Resource mockResource;

    @InjectMocks
    private MainController mainController;

    private Main testRecord;

    @BeforeEach
    void setUp() {
        testRecord = new Main();
        testRecord.setId(1L);
    }

    @Test
    void getEventById_ShouldReturnRecord_WhenExists() {
        when(mainService.getEventById(1L)).thenReturn(testRecord);
        
        ResponseEntity<Main> response = mainController.getEventById(1L);
        
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(testRecord, response.getBody());
        verify(mainService).getEventById(1L);
    }

    @Test
    void uploadFile_ShouldReturnFilePath_WhenSuccessful() throws Exception {
        MultipartFile file = new MockMultipartFile(
            "file", "test.pdf", MediaType.APPLICATION_PDF_VALUE, "test data".getBytes());
        
        when(mainService.saveFile(any(MultipartFile.class))).thenReturn("/path/to/file");
        
        ResponseEntity<String> response = mainController.uploadFile(file);
        
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("/path/to/file", response.getBody());
        verify(mainService).saveFile(file);
    }

    @Test
    void uploadFile_ShouldReturnBadRequest_WhenEmptyFile() {
        MultipartFile file = new MockMultipartFile(
            "file", "test.pdf", MediaType.APPLICATION_PDF_VALUE, new byte[0]);
        
        ResponseEntity<String> response = mainController.uploadFile(file);
        
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("File is empty", response.getBody());
        try {
            verify(mainService, never()).saveFile(any());
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }

    @Test
    void uploadFile_ShouldReturnInternalServerError_WhenExceptionOccurs() throws Exception {
        MultipartFile file = new MockMultipartFile(
            "file", "test.pdf", MediaType.APPLICATION_PDF_VALUE, "test data".getBytes());
        
        when(mainService.saveFile(any(MultipartFile.class))).thenThrow(new IOException("Error"));
        
        ResponseEntity<String> response = mainController.uploadFile(file);
        
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("Error uploading file", response.getBody());
        verify(mainService).saveFile(file);
    }

    @Test
    void downloadFile_ShouldReturnFile_WhenExists() throws Exception {
        when(mainService.downloadFile(1L)).thenReturn(mockResource);
        when(mockResource.getFilename()).thenReturn("test.pdf");
        
        ResponseEntity<Resource> response = mainController.downloadFile(1L);
        
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(mockResource, response.getBody());
        assertEquals(MediaType.APPLICATION_OCTET_STREAM, response.getHeaders().getContentType());
        assertTrue(response.getHeaders().getContentDisposition().toString().contains("filename=\"test.pdf\""));
        verify(mainService).downloadFile(1L);
    }

    @Test
    void downloadFile_ShouldReturnNotFound_WhenFileNotExists() throws Exception {
        when(mainService.downloadFile(1L)).thenReturn(null);
        
        ResponseEntity<Resource> response = mainController.downloadFile(1L);
        
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertNull(response.getBody());
        verify(mainService).downloadFile(1L);
    }

    @Test
    void getAllApprovedRecords_ShouldReturnRecords() {
        List<Main> records = Arrays.asList(testRecord);
        when(mainService.getAllByVerificationStatus("Approved")).thenReturn(records);
        
        ResponseEntity<List<Main>> response = mainController.getAllApprovedRecords();
        
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(records, response.getBody());
        verify(mainService).getAllByVerificationStatus("Approved");
    }

    @Test
    void getAllPendingRecords_ShouldReturnRecords() {
        List<Main> records = Arrays.asList(testRecord);
        when(mainService.getAllByVerificationStatus("Pending")).thenReturn(records);
        
        ResponseEntity<List<Main>> response = mainController.getAllPendingRecords();
        
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(records, response.getBody());
        verify(mainService).getAllByVerificationStatus("Pending");
    }

    @Test
    void getAllRejectedRecords_ShouldReturnRecords() {
        List<Main> records = Arrays.asList(testRecord);
        when(mainService.getAllByVerificationStatus("Rejected")).thenReturn(records);
        
        ResponseEntity<List<Main>> response = mainController.getAllRejectedRecords();
        
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(records, response.getBody());
        verify(mainService).getAllByVerificationStatus("Rejected");
    }

    @Test
    void getStudentPendingRecords_ShouldReturnRecords() {
        List<Main> records = Arrays.asList(testRecord);
        when(mainService.getAllByStudentIdAndVerificationStatus(1L, "Pending")).thenReturn(records);
        
        ResponseEntity<List<Main>> response = mainController.getStudentPendingRecords(1L);
        
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(records, response.getBody());
        verify(mainService).getAllByStudentIdAndVerificationStatus(1L, "Pending");
    }

    @Test
    void getStudentRejectedRecords_ShouldReturnRecords() {
        List<Main> records = Arrays.asList(testRecord);
        when(mainService.getAllByStudentIdAndVerificationStatus(1L, "Rejected")).thenReturn(records);
        
        ResponseEntity<List<Main>> response = mainController.getStudentRejectedRecords(1L);
        
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(records, response.getBody());
        verify(mainService).getAllByStudentIdAndVerificationStatus(1L, "Rejected");
    }
}