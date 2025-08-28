package com.example.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.backend.model.Faculty;
import com.example.backend.model.Student;
import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByEmail(String email);
    List<Student> findByDepartment(String department);
    List<Student> findByFaculty(Faculty faculty);

    List<Student> findStudentsByFaculty_Email(String email);
}
