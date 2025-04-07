package com.example.backend.service.student;

import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.Faculty;
import com.example.backend.model.Student;
import com.example.backend.model.student.Main;
import com.example.backend.repository.FacultyRepository;
import com.example.backend.repository.student.MainRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.io.Resource;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MainServiceTest {

    @Mock
    private MainRepository mainRepository;

    @Mock
    private FacultyRepository facultyRepository;

    @Mock
    private MultipartFile multipartFile;

    @InjectMocks
    private MainService mainService;

    private Main testRecord;
    private Faculty testFaculty;
    private Student testStudent;

    @BeforeEach
    void setUp() {
        testFaculty = new Faculty();
        testFaculty.setId(1L);
        
        testStudent = new Student();
        testStudent.setId(1L);
        
        testRecord = new Main();
        testRecord.setId(1L);
        testRecord.setFaculty(testFaculty);
        testRecord.setStudent(testStudent);
        testRecord.setVerificationStatus("Pending");
    }

    @Test
    void getEventById_ShouldReturnRecord_WhenExists() {
        when(mainRepository.findById(1L)).thenReturn(Optional.of(testRecord));
        
        Main result = mainService.getEventById(1L);
        
        assertEquals(testRecord, result);
        verify(mainRepository).findById(1L);
    }

    @Test
    void getEventById_ShouldThrowException_WhenNotExists() {
        when(mainRepository.findById(1L)).thenReturn(Optional.empty());
        
        assertThrows(ResourceNotFoundException.class, () -> mainService.getEventById(1L));
        verify(mainRepository).findById(1L);
    }

    @Test
    void getStudentActivities_ShouldReturnRecords_WhenExists() {
        List<Main> expected = Arrays.asList(testRecord);
        when(mainRepository.findByStudentAndFacultyAndVerificationStatus(testStudent, testFaculty, "Pending"))
            .thenReturn(expected);
        
        List<Main> result = mainService.getStudentActivities(testStudent, testFaculty, "Pending");
        
        assertEquals(expected, result);
        verify(mainRepository).findByStudentAndFacultyAndVerificationStatus(testStudent, testFaculty, "Pending");
    }

    @Test
    void getStudentActivitiesByIds_ShouldReturnRecords_WhenExists() {
        List<Main> expected = Arrays.asList(testRecord);
        when(mainRepository.findByStudent_IdAndFaculty_IdAndVerificationStatus(1L, 1L, "Pending"))
            .thenReturn(expected);
        
        List<Main> result = mainService.getStudentActivitiesByIds(1L, 1L, "Pending");
        
        assertEquals(expected, result);
        verify(mainRepository).findByStudent_IdAndFaculty_IdAndVerificationStatus(1L, 1L, "Pending");
    }

    @Test
    void getFacultyByStudent_ShouldReturnFaculty_WhenRecordExists() {
        when(mainRepository.findByStudent(testStudent)).thenReturn(Optional.of(testRecord));
        
        Faculty result = mainService.getFacultyByStudent(testStudent);
        
        assertEquals(testFaculty, result);
        verify(mainRepository).findByStudent(testStudent);
    }

    @Test
    void getFacultyByStudent_ShouldReturnNull_WhenNoRecordExists() {
        when(mainRepository.findByStudent(testStudent)).thenReturn(Optional.empty());
        
        Faculty result = mainService.getFacultyByStudent(testStudent);
        
        assertNull(result);
        verify(mainRepository).findByStudent(testStudent);
    }

    @Test
    void updateVerificationStatus_ShouldUpdateStatus_WhenRecordExists() {
        when(mainRepository.findByIdAndFaculty(1L, testFaculty)).thenReturn(Optional.of(testRecord));
        
        boolean result = mainService.updateVerificationStatus(1L, testFaculty, "Approved", "Comment");
        
        assertTrue(result);
        assertEquals("Approved", testRecord.getVerificationStatus());
        assertNull(testRecord.getComments()); // Comment should only be set for Rejected
        verify(mainRepository).save(testRecord);
    }

    @Test
    void updateVerificationStatus_ShouldSetComment_WhenRejected() {
        when(mainRepository.findByIdAndFaculty(1L, testFaculty)).thenReturn(Optional.of(testRecord));
        
        boolean result = mainService.updateVerificationStatus(1L, testFaculty, "Rejected", "Rejection comment");
        
        assertTrue(result);
        assertEquals("Rejected", testRecord.getVerificationStatus());
        assertEquals("Rejection comment", testRecord.getComments());
        verify(mainRepository).save(testRecord);
    }

    @Test
    void updateVerificationStatus_ShouldReturnFalse_WhenRecordNotExists() {
        when(mainRepository.findByIdAndFaculty(1L, testFaculty)).thenReturn(Optional.empty());
        
        boolean result = mainService.updateVerificationStatus(1L, testFaculty, "Approved", "Comment");
        
        assertFalse(result);
        verify(mainRepository, never()).save(any());
    }

    @Test
    void updateVerificationStatusById_ShouldUpdateStatus_WhenRecordExists() {
        when(facultyRepository.findById(1L)).thenReturn(Optional.of(testFaculty));
        when(mainRepository.findByIdAndFaculty(1L, testFaculty)).thenReturn(Optional.of(testRecord));
        
        boolean result = mainService.updateVerificationStatus(1L, 1L, "Approved", "Comment");
        
        assertTrue(result);
        verify(facultyRepository).findById(1L);
        verify(mainRepository).findByIdAndFaculty(1L, testFaculty);
        verify(mainRepository).save(testRecord);
    }

    @Test
    void updateVerificationStatusById_ShouldThrowException_WhenFacultyNotExists() {
        when(facultyRepository.findById(1L)).thenReturn(Optional.empty());
        
        assertThrows(IllegalArgumentException.class, () -> 
            mainService.updateVerificationStatus(1L, 1L, "Approved", "Comment"));
        
        verify(facultyRepository).findById(1L);
        verify(mainRepository, never()).findByIdAndFaculty(any(), any());
    }

    @Test
    void getPendingRecords_ShouldReturnRecords() {
        List<Main> expected = Arrays.asList(testRecord);
        when(mainRepository.findByFacultyIdAndVerificationStatus(1L, "Pending")).thenReturn(expected);
        
        List<Main> result = mainService.getPendingRecords(1L);
        
        assertEquals(expected, result);
        verify(mainRepository).findByFacultyIdAndVerificationStatus(1L, "Pending");
    }

    @Test
    void getRejectedRecords_ShouldReturnRecords() {
        List<Main> expected = Arrays.asList(testRecord);
        when(mainRepository.findByFacultyIdAndVerificationStatus(1L, "Rejected")).thenReturn(expected);
        
        List<Main> result = mainService.getRejectedRecords(1L);
        
        assertEquals(expected, result);
        verify(mainRepository).findByFacultyIdAndVerificationStatus(1L, "Rejected");
    }

    @Test
    void approveRecord_ShouldUpdateStatus_WhenRecordExists() {
        when(mainRepository.findByIdAndFacultyId(1L, 1L)).thenReturn(Optional.of(testRecord));
        
        boolean result = mainService.approveRecord(1L, 1L, "Approval comment");
        
        assertTrue(result);
        assertEquals("Approved", testRecord.getVerificationStatus());
        assertEquals("Approval comment", testRecord.getComments());
        verify(mainRepository).save(testRecord);
    }

    @Test
    void rejectRecord_ShouldUpdateStatus_WhenRecordExists() {
        when(mainRepository.findByIdAndFacultyId(1L, 1L)).thenReturn(Optional.of(testRecord));
        
        boolean result = mainService.rejectRecord(1L, 1L, "Rejection comment");
        
        assertTrue(result);
        assertEquals("Rejected", testRecord.getVerificationStatus());
        assertEquals("Rejection comment", testRecord.getComments());
        verify(mainRepository).save(testRecord);
    }

    @Test
    void saveFile_ShouldSaveFile_WhenValidFile() throws IOException {
        String originalFilename = "test.pdf";
        String expectedExtension = ".pdf";
        when(multipartFile.getOriginalFilename()).thenReturn(originalFilename);
        when(multipartFile.getInputStream()).thenReturn(mock(java.io.InputStream.class));
        
        String result = mainService.saveFile(multipartFile);
        
        assertNotNull(result);
        assertTrue(result.endsWith(expectedExtension));
        verify(multipartFile).getInputStream();
    }

    @Test
void saveFile_ShouldThrowException_WhenFileIsNull() {
    assertThrows(IllegalArgumentException.class, () -> mainService.saveFile(null));
}

@Test
void saveFile_ShouldThrowException_WhenFileIsEmpty() {
    MultipartFile emptyFile = new MockMultipartFile(
        "emptyFile", 
        new byte[0]
    );
    assertThrows(IOException.class, () -> mainService.saveFile(emptyFile));
}

@Test
void saveFile_ShouldSuccessfullySave_WhenValidFile() throws IOException {
    MultipartFile validFile = new MockMultipartFile(
        "testFile", 
        "test.pdf", 
        "application/pdf", 
        "test content".getBytes()
    );
    
    String result = mainService.saveFile(validFile);
    
    assertNotNull(result);
    assertTrue(result.endsWith(".pdf"));
    // Add cleanup if you're actually writing to filesystem in tests
}

@Test
void downloadFile_ShouldReturnResource_WhenFileExists() throws Exception {
    // Create upload directory if it doesn't exist
    Path uploadDir = Paths.get(System.getProperty("user.dir"), "RecordDocuments");
    Files.createDirectories(uploadDir);
    
    // Create a test file with known name
    String testFileName = "test_" + UUID.randomUUID() + ".pdf";
    Path testFile = uploadDir.resolve(testFileName);
    Files.write(testFile, "test content".getBytes());
    
    try {
        // Setup test record with the actual filename we created
        testRecord.setDocumentPath(testFileName);
        when(mainRepository.findById(1L)).thenReturn(Optional.of(testRecord));
        
        // Test the download
        Resource result = mainService.downloadFile(1L);
        
        // Verify
        assertNotNull(result);
        assertTrue(result.exists());
        assertEquals(testFile.toAbsolutePath().toString(), result.getFile().getAbsolutePath());
    } finally {
        // Clean up
        Files.deleteIfExists(testFile);
    }
}

    @Test
void downloadFile_ShouldReturnNull_WhenRecordNotExists() {
    assertDoesNotThrow(() -> {
        when(mainRepository.findById(1L)).thenReturn(Optional.empty());
        
        Resource result = mainService.downloadFile(1L);
        
        assertNull(result);
        verify(mainRepository).findById(1L);
    });
}

    @Test
    void getAllByVerificationStatus_ShouldReturnRecords() {
        List<Main> expected = Arrays.asList(testRecord);
        when(mainRepository.findByVerificationStatus("Pending")).thenReturn(expected);
        
        List<Main> result = mainService.getAllByVerificationStatus("Pending");
        
        assertEquals(expected, result);
        verify(mainRepository).findByVerificationStatus("Pending");
    }

    @Test
    void getAllByStudentIdAndVerificationStatus_ShouldReturnRecords() {
        List<Main> expected = Arrays.asList(testRecord);
        when(mainRepository.findAllByStudentIdAndVerificationStatus(1L, "Pending")).thenReturn(expected);
        
        List<Main> result = mainService.getAllByStudentIdAndVerificationStatus(1L, "Pending");
        
        assertEquals(expected, result);
        verify(mainRepository).findAllByStudentIdAndVerificationStatus(1L, "Pending");
    }

    @Test
    void getAllByFlag_ShouldReturnRecords() {
        List<Main> expected = Arrays.asList(testRecord);
        when(mainRepository.findByFlag(true)).thenReturn(expected);
        
        List<Main> result = mainService.getAllByFlag(true);
        
        assertEquals(expected, result);
        verify(mainRepository).findByFlag(true);
    }

    @Test
    void getAllByStudentIdAndFlag_ShouldReturnRecords() {
        List<Main> expected = Arrays.asList(testRecord);
        when(mainRepository.findByStudentIdAndFlag(1L, true)).thenReturn(expected);
        
        List<Main> result = mainService.getAllByStudentIdAndFlag(1L, true);
        
        assertEquals(expected, result);
        verify(mainRepository).findByStudentIdAndFlag(1L, true);
    }

    @Test
    void deleteRecord_ShouldDeleteRecordAndFile_WhenExists() throws IOException {
        // Create a temporary file for testing
        Path tempDir = Paths.get(System.getProperty("user.dir") + "/RecordDocuments/");
        Files.createDirectories(tempDir);
        Path tempFile = Files.createTempFile(tempDir, "test", ".pdf");
        String fileName = tempFile.getFileName().toString();
        
        testRecord.setDocumentPath(fileName);
        when(mainRepository.findById(1L)).thenReturn(Optional.of(testRecord));
        
        mainService.deleteRecord(1L);
        
        assertFalse(Files.exists(tempFile));
        verify(mainRepository).deleteById(1L);
    }

    @Test
    void deleteRecord_ShouldDeleteRecordOnly_WhenNoFileExists() {
        when(mainRepository.findById(1L)).thenReturn(Optional.of(testRecord));
        
        mainService.deleteRecord(1L);
        
        verify(mainRepository).deleteById(1L);
    }

    @Test
    void updateFlag_ShouldUpdateFlag_WhenRecordExists() {
        when(mainRepository.findById(1L)).thenReturn(Optional.of(testRecord));
        
        mainService.updateFlag(1L, true);
        
        assertTrue(testRecord.getFlag());
        verify(mainRepository).save(testRecord);
    }

    @Test
    void flagRecord_ShouldSetFlagToTrue() {
        when(mainRepository.findById(1L)).thenReturn(Optional.of(testRecord));
        
        mainService.flagRecord(1L);
        
        assertTrue(testRecord.getFlag());
        verify(mainRepository).save(testRecord);
    }
}