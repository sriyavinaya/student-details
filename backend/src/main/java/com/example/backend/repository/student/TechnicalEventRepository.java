package com.example.backend.repository.student;

import com.example.backend.model.student.TechnicalEvent;
import com.example.backend.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TechnicalEventRepository extends JpaRepository<TechnicalEvent, Long> {
    
    // Find by verification status
    List<TechnicalEvent> findByVerificationStatus(String verificationStatus);
    
    // Find by student (using object reference)
    @Query("SELECT t FROM TechnicalEvent t WHERE t.student = :student")
    List<TechnicalEvent> findByStudent(@Param("student") Student student);
    
    // Alternative method name following Spring Data JPA conventions
    List<TechnicalEvent> findByStudent_Id(Long studentId);
    
    // Find pending events for a specific student
    @Query("SELECT t FROM TechnicalEvent t WHERE t.student = :student AND t.verificationStatus = 'Pending'")
    List<TechnicalEvent> findPendingByStudent(@Param("student") Student student);
}