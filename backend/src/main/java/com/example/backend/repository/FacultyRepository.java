package com.example.backend.repository;

import com.example.backend.model.Faculty;
import com.example.backend.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FacultyRepository extends JpaRepository<Faculty, Long> {
    Optional<Faculty> findByEmail(String email);
    Optional<Faculty> findById(Long id);
    
    // New methods for object-based queries
    @Query("SELECT s FROM Student s WHERE s.faculty = :faculty")
    List<Student> findStudentsByFaculty(@Param("faculty") Faculty faculty);
    
    @Query("SELECT s FROM Student s WHERE s.faculty.id = :facultyId")
    List<Student> findStudentsByFacultyId(@Param("facultyId") Long facultyId);
    
    @Query("SELECT s FROM Student s WHERE s.faculty.email = :facultyEmail")
    List<Student> findStudentsByFaculty_Email(@Param("facultyEmail") String facultyEmail);
}




// package com.example.backend.repository;

// import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.data.jpa.repository.Query;
// import org.springframework.data.repository.query.Param;
// import org.springframework.stereotype.Repository;

// import com.example.backend.model.Faculty;
// import com.example.backend.model.Student;
// import com.example.backend.model.student.TechnicalEvent;

// import java.util.List;
// import java.util.Optional;

// @Repository
// public interface FacultyRepository extends JpaRepository<Faculty, Long> {
//     Optional<Faculty> findByEmail(String email);

//     // ✅ Find faculty by ID
//     Optional<Faculty> findById(Long id);

// }
