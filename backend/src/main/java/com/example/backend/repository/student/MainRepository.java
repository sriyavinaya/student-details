package com.example.backend.repository.student;

import com.example.backend.model.student.Main;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface MainRepository extends JpaRepository<Main, Long> {

    // ✅ Fetch all activities of a student under a specific faculty, grouped by verification status
    @Query("SELECT m FROM Main m WHERE m.studentId = :studentId AND m.facultyId = :facultyId AND m.verificationStatus = :verificationStatus")
    List<Main> findByStudentAndFacultyAndStatus(@Param("studentId") Long studentId, 
                                                @Param("facultyId") Long facultyId, 
                                                @Param("verificationStatus") String verificationStatus);

    // ✅ Fetch faculty ID for a given student ID
    @Query("SELECT m.facultyId FROM Main m WHERE m.studentId = :studentId")
    Long findFacultyIdByStudentId(@Param("studentId") Long studentId);

    Optional<Main> findByIdAndFacultyId(Long id, Long facultyId);

    List<Main> findByFacultyIdAndVerificationStatus(Long facultyId, String verificationStatus);

    List<Main> findByStudentIdAndFacultyIdAndVerificationStatus(Long studentId, Long facultyId, String status);

    Optional<Main> findByStudentId(Long studentId);


}
