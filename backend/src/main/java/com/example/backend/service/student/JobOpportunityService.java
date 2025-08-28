package com.example.backend.service.student;

import com.example.backend.model.Student;
import com.example.backend.model.student.JobOpportunity;
import com.example.backend.repository.student.JobOpportunityRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class JobOpportunityService {

    private final JobOpportunityRepository jobOpportunityRepository;

    public JobOpportunityService(JobOpportunityRepository jobOpportunityRepository) {
        this.jobOpportunityRepository = jobOpportunityRepository;
    }

    // Read-only methods should specify it
    @Transactional(readOnly = true)
    public List<JobOpportunity> getAllOpportunities() {
        return jobOpportunityRepository.findAll();
    }

    // More defensive saving
    public JobOpportunity saveJobOpportunity(JobOpportunity opportunity) {
        try {
            JobOpportunity savedOpportunity = jobOpportunityRepository.save(opportunity);
            // Only flush if absolutely necessary
            jobOpportunityRepository.flush(); 
            return savedOpportunity;
        } catch (Exception e) {
            // Log and rethrow to maintain transaction integrity
            throw new RuntimeException("Failed to save opportunity", e);
        }
    }

    @Transactional(readOnly = true)
    public List<JobOpportunity> getOpportunitiesByStudent(Student student) {
        return jobOpportunityRepository.findByStudent(student);
    }

    @Transactional(readOnly = true)
    public List<JobOpportunity> getOpportunitiesByStudentId(Long studentId) {
        return jobOpportunityRepository.findByStudent_Id(studentId);
    }

    @Transactional(readOnly = true)
    public List<JobOpportunity> getPendingAndApprovedOpportunitiesByStudent(Student student) {
        return jobOpportunityRepository.findPendingAndApprovedByStudent(student);
    }
    
    @Transactional(readOnly = true)
    public List<JobOpportunity> getOpportunitiesByType(JobOpportunity.JobType type) {
        return jobOpportunityRepository.findByType(type);
    }
}