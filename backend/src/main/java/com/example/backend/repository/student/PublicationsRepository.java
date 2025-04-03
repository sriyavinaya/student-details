package com.example.backend.repository.student;

import com.example.backend.model.student.Publications;
import com.example.backend.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PublicationsRepository extends JpaRepository<Publications, Long> {
    
    List<Publications> findByFlag(Boolean flag);
    
    @Query("SELECT p FROM Publications p WHERE p.student = :student")
    List<Publications> findByStudent(@Param("student") Student student);
    
    List<Publications> findByStudent_Id(Long studentId);
    
    @Query("SELECT p FROM Publications p WHERE p.student = :student AND p.flag = :flag")
    List<Publications> findByStudentAndFlag(@Param("student") Student student, @Param("flag") Boolean flag);
}