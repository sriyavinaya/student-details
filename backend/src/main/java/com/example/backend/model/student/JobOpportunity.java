package com.example.backend.model.student;

import java.time.LocalDate;

import jakarta.persistence.Id;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

// Parent class for Job Opportunities (Internship and Placements)
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class JobOpportunity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String companyName;
    private LocalDate startDate;
    private String role;
    private String offerLetterPath;
    private String description;
    private String verificationStatus;

    public JobOpportunity() {}

    public JobOpportunity(String companyName, LocalDate startDate, String role, String offerLetterPath,
                          String description, String verificationStatus) {
        this.companyName = companyName;
        this.startDate = startDate;
        this.role = role;
        this.offerLetterPath = offerLetterPath;
        this.description = description;
        this.verificationStatus = verificationStatus;
    }

    // Getters and Setters
}
