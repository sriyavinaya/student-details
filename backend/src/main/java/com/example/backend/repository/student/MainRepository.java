package com.example.backend.repository.student;

import com.example.backend.model.student.Main;
import com.example.backend.model.Faculty;
import com.example.backend.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MainRepository extends JpaRepository<Main, Long> {

    // Fetch all activities of a student under a specific faculty, grouped by verification status
    @Query("SELECT m FROM Main m WHERE m.student = :student AND m.faculty = :faculty AND m.verificationStatus = :verificationStatus")
    List<Main> findByStudentAndFacultyAndVerificationStatus(
            @Param("student") Student student,
            @Param("faculty") Faculty faculty,
            @Param("verificationStatus") String verificationStatus);

    // Fetch faculty for a given student
    @Query("SELECT m.faculty FROM Main m WHERE m.student = :student")
    Optional<Faculty> findFacultyByStudent(@Param("student") Student student);
    
    // Object-based
    Optional<Main> findByIdAndFaculty(Long id, Faculty faculty);

    // ID-based (for backward compatibility)
    @Query("SELECT m FROM Main m WHERE m.id = :id AND m.faculty.id = :facultyId")
    Optional<Main> findByIdAndFacultyId(@Param("id") Long id, @Param("facultyId") Long facultyId);

    // Find by faculty and verification status
    List<Main> findByFacultyAndVerificationStatus(Faculty faculty, String verificationStatus);

    // Find by student
    Optional<Main> findByStudent(Student student);

    // Additional query methods if needed
    @Query("SELECT m FROM Main m WHERE m.student = :student AND m.faculty = :faculty")
    List<Main> findByStudentAndFaculty(
            @Param("student") Student student,
            @Param("faculty") Faculty faculty);

    List<Main> findByStudent_IdAndFaculty_IdAndVerificationStatus(
        Long studentId, 
        Long facultyId, 
        String verificationStatus);

   List<Main> findByFacultyIdAndVerificationStatus(Long facultyId, String verificationStatus);

   List<Main> findByVerificationStatus(String verificationStatus);

   List<Main> findAllByStudentIdAndVerificationStatus(Long studentId, String status);
  
}

// package com.example.backend.repository.student;

// import com.example.backend.model.student.Main;
// import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.data.jpa.repository.Query;
// import org.springframework.data.repository.query.Param;
// import java.util.List;
// import java.util.Optional;

// public interface MainRepository extends JpaRepository<Main, Long> {

//     // ✅ Fetch all activities of a student under a specific faculty, grouped by verification status
//     @Query("SELECT m FROM Main m WHERE m.studentId = :studentId AND m.facultyId = :facultyId AND m.verificationStatus = :verificationStatus")
//     List<Main> findByStudentAndFacultyAndStatus(@Param("studentId") Long studentId, 
//                                                 @Param("facultyId") Long facultyId, 
//                                                 @Param("verificationStatus") String verificationStatus);

//     // ✅ Fetch faculty ID for a given student ID
//     @Query("SELECT m.facultyId FROM Main m WHERE m.studentId = :studentId")
//     Long findFacultyIdByStudentId(@Param("studentId") Long studentId);

//     Optional<Main> findByIdAndFacultyId(Long id, Long facultyId);

//     List<Main> findByFacultyIdAndVerificationStatus(Long facultyId, String verificationStatus);

//     List<Main> findByStudentIdAndFacultyIdAndVerificationStatus(Long studentId, Long facultyId, String status);

//     Optional<Main> findByStudentId(Long studentId);


// }
