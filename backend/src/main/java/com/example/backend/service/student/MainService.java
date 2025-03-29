package com.example.backend.service.student;

import com.example.backend.model.student.Main;
import com.example.backend.repository.student.MainRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MainService {

    private final MainRepository mainRepository;

    public MainService(MainRepository mainRepository) {
        this.mainRepository = mainRepository;
    }

    public List<Main> getStudentActivities(Long studentId, Long facultyId, String status) {
        return mainRepository.findByStudentIdAndFacultyIdAndVerificationStatus(studentId, facultyId, status);
    }

    public Long getFacultyIdByStudentId(Long studentId) {
        Optional<Main> mainRecord = mainRepository.findByStudentId(studentId);
        return mainRecord.map(Main::getFacultyId).orElse(null);
    }

    // ✅ Corrected method signature
    public boolean updateVerificationStatus(Long id, Long facultyId, String status, String comment) {
        Optional<Main> optionalRecord = mainRepository.findByIdAndFacultyId(id, facultyId);
        
        if (optionalRecord.isPresent()) {
            Main record = optionalRecord.get();
            record.setVerificationStatus(status);
            
            if ("Rejected".equals(status)) {
                record.setComments(comment); // Store the rejection comment
            }
    
            mainRepository.save(record);
            return true;
        }
        return false;
    }
    
    

    public List<Main> getRejectedRecords(Long facultyId) {
        return mainRepository.findByFacultyIdAndVerificationStatus(facultyId, "Rejected");
    }

    public List<Main> getPendingRecords(Long facultyId) {
        return mainRepository.findByFacultyIdAndVerificationStatus(facultyId, "Pending");
    }
    
}
