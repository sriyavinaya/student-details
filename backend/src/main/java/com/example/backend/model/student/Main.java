package com.example.backend.model.student;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;
import com.example.backend.model.Student; // Import Student entity
import com.example.backend.model.Faculty; // Import Faculty entity

@Getter
@Setter
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "dtype", discriminatorType = DiscriminatorType.STRING)
@Table(name = "main")
public class Main {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private LocalDateTime submissionDate;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne
    @JoinColumn(name = "faculty_id", nullable = false)
    private Faculty faculty;

    private String verificationStatus;
    
    @Column(columnDefinition = "TEXT")
    private String comments;

    private String documentPath;

    public Main() {
        this.submissionDate = LocalDateTime.now();
        this.verificationStatus = "Pending";
    }
}