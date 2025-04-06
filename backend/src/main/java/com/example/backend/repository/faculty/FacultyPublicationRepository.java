package com.example.backend.repository.faculty;

import com.example.backend.model.Faculty;
import com.example.backend.model.faculty.FacultyPublication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FacultyPublicationRepository extends JpaRepository<FacultyPublication, Long> {
    
    List<FacultyPublication> findByFaculty(Faculty faculty);
    
    @Query("SELECT p FROM FacultyPublication p WHERE p.faculty.id = :facultyId")
    List<FacultyPublication> findByFacultyId(@Param("facultyId") Long facultyId);
    
    @Query("SELECT p FROM FacultyPublication p WHERE " +
           "LOWER(p.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.author) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.keywords) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<FacultyPublication> searchPublications(@Param("query") String query);
}