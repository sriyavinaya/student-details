// package com.example.backend.repository.student;

// import com.example.backend.model.student.JobOpportunity;
// import com.example.backend.model.Student;
// import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.data.jpa.repository.Query;
// import org.springframework.data.repository.query.Param;
// import org.springframework.stereotype.Repository;

// import java.util.List;

// @Repository
// public interface JobOpportunityRepository extends JpaRepository<JobOpportunity, Long> {
    
//     @Query("SELECT j FROM JobOpportunity j WHERE j.student = :student")
//     List<JobOpportunity> findByStudent(@Param("student") Student student);
    
//     List<JobOpportunity> findByStudent_Id(Long studentId);
    
//     @Query("SELECT j FROM JobOpportunity j WHERE j.student = :student AND j.verified = :verified")
//     List<JobOpportunity> findByStudentAndVerified(@Param("student") Student student, 
//                                                 @Param("verified") boolean verified);
    
//     @Query("SELECT j FROM JobOpportunity j WHERE TYPE(j) = Internship AND j.student = :student")
//     List<JobOpportunity> findInternshipsByStudent(@Param("student") Student student);
    
//     @Query("SELECT j FROM JobOpportunity j WHERE TYPE(j) = Placement AND j.student = :student")
//     List<JobOpportunity> findPlacementsByStudent(@Param("student") Student student);
// }