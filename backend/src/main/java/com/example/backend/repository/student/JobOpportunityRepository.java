package com.example.backend.repository.student;

import com.example.backend.model.student.JobOpportunity;
import com.example.backend.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobOpportunityRepository extends JpaRepository<JobOpportunity, Long> {
    
    // Find by verification status
    List<JobOpportunity> findByVerificationStatus(String verificationStatus);
    
    // Find by student (using object reference)
    @Query("SELECT j FROM JobOpportunity j WHERE j.student = :student")
    List<JobOpportunity> findByStudent(@Param("student") Student student);
    
    // Alternative method name following Spring Data JPA conventions
    List<JobOpportunity> findByStudent_Id(Long studentId);
    
    // Find pending opportunities for a specific student
    @Query("SELECT j FROM JobOpportunity j WHERE j.student = :student AND j.verificationStatus = 'Pending'")
    List<JobOpportunity> findPendingByStudent(@Param("student") Student student);

    // Find approved and pending opportunities of a student
    @Query("SELECT j FROM JobOpportunity j " +
          "WHERE j.student = :student " +
          "AND j.verificationStatus IN ('Pending', 'Approved')")
    List<JobOpportunity> findPendingAndApprovedByStudent(@Param("student") Student student);
    
    // Find by job type (INTERNSHIP or PLACEMENT)
    List<JobOpportunity> findByType(JobOpportunity.JobType type);
}