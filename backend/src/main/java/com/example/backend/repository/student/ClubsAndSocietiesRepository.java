package com.example.backend.repository.student;

import com.example.backend.model.student.ClubsAndSocieties;
import com.example.backend.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClubsAndSocietiesRepository extends JpaRepository<ClubsAndSocieties, Long> {
    
    List<ClubsAndSocieties> findByFlag(Boolean flag);
    
    @Query("SELECT c FROM ClubsAndSocieties c WHERE c.student = :student")
    List<ClubsAndSocieties> findByStudent(@Param("student") Student student);
    
    List<ClubsAndSocieties> findByStudent_Id(Long studentId);
    
    @Query("SELECT c FROM ClubsAndSocieties c WHERE c.student = :student AND c.flag = :flag")
    List<ClubsAndSocieties> findByStudentAndFlag(@Param("student") Student student, @Param("flag") Boolean flag);

    //Find approved and pending events of a student
    @Query("SELECT cs FROM ClubsAndSocieties cs " +
          "WHERE cs.student = :student " +
          "AND cs.verificationStatus IN ('Pending', 'Approved')")
    List<ClubsAndSocieties> findPendingAndApprovedByStudent(@Param("student") Student student);
}