package com.example.backend.repository.student;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.backend.model.student.TechnicalEvent;

@Repository
public interface TechnicalEventRepository extends JpaRepository<TechnicalEvent, Long> {
    
    List<TechnicalEvent> findByVerificationStatus(String verificationStatus);
    
    // List<TechnicalEvent> findByStudentId(Long studentId);

    @Query("SELECT t FROM TechnicalEvent t WHERE t.studentId = :studentId")
    List<TechnicalEvent> findByStudentId(@Param("studentId") Long studentId);
    

}
