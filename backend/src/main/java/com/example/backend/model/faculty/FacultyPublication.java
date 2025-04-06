package com.example.backend.model.faculty;

import com.example.backend.model.Faculty;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "faculty_publications")
@Data
public class FacultyPublication {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String title;
    private String publicationType;
    private String orcidId;
    private String author;
    private Integer year;
    private String collaborators;
    private String doi;
    private String keywords;
    private String abstractContent;
    private String description;
    private String documentPath;
    
    @ManyToOne
    @JoinColumn(name = "faculty_id", nullable = false)
    private Faculty faculty;
    
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}