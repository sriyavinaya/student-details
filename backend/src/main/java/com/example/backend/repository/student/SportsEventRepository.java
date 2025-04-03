package com.example.backend.repository.student;

import com.example.backend.model.student.SportsEvent;
import com.example.backend.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SportsEventRepository extends JpaRepository<SportsEvent, Long> {
    
    List<SportsEvent> findByFlag(Boolean flag);
    
    @Query("SELECT s FROM SportsEvent s WHERE s.student = :student")
    List<SportsEvent> findByStudent(@Param("student") Student student);
    
    List<SportsEvent> findByStudent_Id(Long studentId);
    
    @Query("SELECT s FROM SportsEvent s WHERE s.student = :student AND s.flag = :flag")
    List<SportsEvent> findByStudentAndFlag(@Param("student") Student student, @Param("flag") Boolean flag);
}