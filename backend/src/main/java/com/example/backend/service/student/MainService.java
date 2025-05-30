package com.example.backend.service.student;

import com.example.backend.model.student.Main;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.Faculty;
import com.example.backend.model.Student;
import com.example.backend.repository.FacultyRepository;
import com.example.backend.repository.student.MainRepository;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class MainService {

    private final MainRepository mainRepository;
    private final FacultyRepository facultyRepository;

    public MainService(MainRepository mainRepository, FacultyRepository facultyRepository) {
        this.mainRepository = mainRepository;
        this.facultyRepository = facultyRepository;
    }

    private static final String UPLOAD_DIR = System.getProperty("user.dir") + "/RecordDocuments/";

    public Main getEventById(Long id) {
        return mainRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public List<Main> getStudentActivities(Student student, Faculty faculty, String status) {
        return mainRepository.findByStudentAndFacultyAndVerificationStatus(student, faculty, status);
    }

    @Transactional(readOnly = true)
    public List<Main> getStudentActivitiesByIds(Long studentId, Long facultyId, String status) {
        return mainRepository.findByStudent_IdAndFaculty_IdAndVerificationStatus(studentId, facultyId, status);
    }

    @Transactional(readOnly = true)
    public Faculty getFacultyByStudent(Student student) {
        Optional<Main> mainRecord = mainRepository.findByStudent(student);
        return mainRecord.map(Main::getFaculty).orElse(null);
    }

    @Transactional
    public boolean updateVerificationStatus(Long id, Faculty faculty, String status, String comment) {
        Optional<Main> optionalRecord = mainRepository.findByIdAndFaculty(id, faculty);
        
        if (optionalRecord.isPresent()) {
            Main record = optionalRecord.get();
            record.setVerificationStatus(status);
            
            // Only store comment if rejecting
            if ("Rejected".equalsIgnoreCase(status)) {
                record.setComments(comment);
            }
            
            mainRepository.save(record);
            return true;
        }
        return false;
    }

    //  ID-based version (backward compatible) - updates verification status using facultyId
    @Transactional
    public boolean updateVerificationStatus(Long id, Long facultyId, String status, String comment) {
        // First get the Faculty object
        Faculty faculty = facultyRepository.findById(facultyId)
            .orElseThrow(() -> new IllegalArgumentException("Invalid faculty ID: " + facultyId));
        
        // Then delegate to the object-based version
        return updateVerificationStatus(id, faculty, status, comment);
    }

    @Transactional
    public List<Main> getPendingRecords(Long facultyId) {
        return mainRepository.findByFacultyIdAndVerificationStatus(
            facultyId, "Pending");
    }

    @Transactional
    public List<Main> getRejectedRecords(Long facultyId) {
        return mainRepository.findByFacultyIdAndVerificationStatus(
            facultyId, "Rejected");
    }

    @Transactional
    public boolean approveRecord(Long recordId, Long facultyId, String comment) {
        Optional<Main> recordOpt = mainRepository.findByIdAndFacultyId(
            recordId, facultyId);
        
        if (recordOpt.isEmpty()) {
            return false;
        }

        Main record = recordOpt.get();
        record.setVerificationStatus("Approved");
        record.setComments(comment);
        mainRepository.save(record);
        return true;
    }

    @Transactional
    public boolean rejectRecord(Long recordId, Long facultyId, String comment) {
        Optional<Main> recordOpt = mainRepository.findByIdAndFacultyId(
            recordId, facultyId);
        
        if (recordOpt.isEmpty()) {
            return false;
        }

        Main record = recordOpt.get();
        record.setVerificationStatus("Rejected");
        record.setComments(comment);
        mainRepository.save(record);
        return true;
    }

    @Transactional
    public String saveFile(MultipartFile file) throws IOException {
        // Validate input file
        if (file == null) {
            throw new IllegalArgumentException("File cannot be null");
        }
        
        if (file.isEmpty()) {
            throw new IOException("File is empty");
        }
    
        // Validate filename
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.trim().isEmpty()) {
            throw new IllegalArgumentException("File name cannot be empty");
        }
    
        // Create upload directory if it doesn't exist
        File directory = new File(UPLOAD_DIR);
        if (!directory.exists()) {
            boolean dirsCreated = directory.mkdirs();
            if (!dirsCreated) {
                throw new IOException("Failed to create upload directory");
            }
        }
    
        // Extract file extension
        String fileExtension = "";
        if (originalFilename.contains(".")) {
            fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
    
        // Generate unique filename
        String fileName = UUID.randomUUID().toString() + fileExtension;
        Path filePath = Paths.get(UPLOAD_DIR, fileName);
    
        // Save the file
        try {
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new IOException("Failed to save file: " + e.getMessage(), e);
        }
    
        return filePath.toAbsolutePath().toString();
    }

    @Transactional
public Resource downloadFile(Long eventId) throws MalformedURLException, ResourceNotFoundException {
    // Validate input
    if (eventId == null) {
        throw new IllegalArgumentException("Event ID cannot be null");
    }

    // Find the event record
    Main event = mainRepository.findById(eventId)
        .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));

    // Check document path
    String documentPath = event.getDocumentPath();
    if (documentPath == null || documentPath.trim().isEmpty()) {
        throw new ResourceNotFoundException("No document path found for event id: " + eventId);
    }

    // Resolve file path
    Path filePath = Paths.get(UPLOAD_DIR).resolve(documentPath).normalize();
    
    // Verify the path is within the upload directory (security check)
    if (!filePath.startsWith(Paths.get(UPLOAD_DIR).normalize())) {
        throw new SecurityException("Attempted path traversal attack");
    }

    // Create resource
    Resource resource = new UrlResource(filePath.toUri());
    
    if (!resource.exists()) {
        throw new ResourceNotFoundException("File not found at path: " + filePath);
    }

    return resource;
}

    public List<Main> getAllByVerificationStatus(String verificationStatus) {
        return mainRepository.findByVerificationStatus(verificationStatus);
    }

    public List<Main> getAllByStudentIdAndVerificationStatus(Long studentId, String status) {
        return mainRepository.findAllByStudentIdAndVerificationStatus(studentId, status);
    }

    // Flag related methods

    @Transactional(readOnly = true)
    public List<Main> getAllByFlag(Boolean flag) {
        return mainRepository.findByFlag(flag);
    }

    @Transactional(readOnly = true)
    public List<Main> getAllByStudentIdAndFlag(Long studentId, Boolean flag) {
        return mainRepository.findByStudentIdAndFlag(studentId, flag);
    }

    @Transactional
    public void deleteRecord(Long id) {
        // First get the record to find the associated file path
        Main record = mainRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Record not found with id: " + id));

        // Delete the associated file if it exists
        if (record.getDocumentPath() != null && !record.getDocumentPath().isEmpty()) {
            try {
                Path filePath = Paths.get(UPLOAD_DIR).resolve(record.getDocumentPath()).normalize();
                Files.deleteIfExists(filePath);
            } catch (IOException e) {
                // Log the error but continue with record deletion
                System.err.println("Failed to delete document file: " + e.getMessage());
            }
        }

        // Delete the record from database
        mainRepository.deleteById(id);
    }

    @Transactional
    public void updateFlag(Long id, Boolean flag) {
        Main record = mainRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Record not found with id: " + id));

        record.setFlag(flag);
        mainRepository.save(record);
    }

    // Additional helper method to flag a record
    @Transactional
    public void flagRecord(Long id) {
        updateFlag(id, true);
    }
}


// package com.example.backend.service.student;

// import com.example.backend.model.student.Main;
// import com.example.backend.repository.student.MainRepository;
// import org.springframework.stereotype.Service;

// import java.util.List;
// import java.util.Optional;

// @Service
// public class MainService {

//     private final MainRepository mainRepository;

//     public MainService(MainRepository mainRepository) {
//         this.mainRepository = mainRepository;
//     }

//     public List<Main> getStudentActivities(Long studentId, Long facultyId, String status) {
//         return mainRepository.findByStudentIdAndFacultyIdAndVerificationStatus(studentId, facultyId, status);
//     }

//     public Long getFacultyIdByStudentId(Long studentId) {
//         Optional<Main> mainRecord = mainRepository.findByStudentId(studentId);
//         return mainRecord.map(Main::getFacultyId).orElse(null);
//     }

//     // ✅ Corrected method signature
//     public boolean updateVerificationStatus(Long id, Long facultyId, String status, String comment) {
//         Optional<Main> optionalRecord = mainRepository.findByIdAndFacultyId(id, facultyId);
        
//         if (optionalRecord.isPresent()) {
//             Main record = optionalRecord.get();
//             record.setVerificationStatus(status);
            
//             if ("Rejected".equals(status)) {
//                 record.setComments(comment); // Store the rejection comment
//             }
    
//             mainRepository.save(record);
//             return true;
//         }
//         return false;
//     }
    
    

//     public List<Main> getRejectedRecords(Long facultyId) {
//         return mainRepository.findByFacultyIdAndVerificationStatus(facultyId, "Rejected");
//     }

//     public List<Main> getPendingRecords(Long facultyId) {
//         return mainRepository.findByFacultyIdAndVerificationStatus(facultyId, "Pending");
//     }
    
// }
