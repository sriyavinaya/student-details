package com.example.backend.repository.student;

import com.example.backend.model.student.CulturalEvent;
import com.example.backend.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CulturalEventRepository extends JpaRepository<CulturalEvent, Long> {
    
    List<CulturalEvent> findByFlag(Boolean flag);
    
    @Query("SELECT c FROM CulturalEvent c WHERE c.student = :student")
    List<CulturalEvent> findByStudent(@Param("student") Student student);
    
    List<CulturalEvent> findByStudent_Id(Long studentId);
    
    @Query("SELECT c FROM CulturalEvent c WHERE c.student = :student AND c.flag = :flag")
    List<CulturalEvent> findByStudentAndFlag(@Param("student") Student student, @Param("flag") Boolean flag);
}