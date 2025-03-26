package com.example.backend.model.student;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
// Publications Model
@Entity
public class Publication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String orcidId;
    private String title;
    private String author;
    private int year;
    private String collaborators;
    private String doi;
    private String keywords;
    private String abstractText;
    private String documentPath;
    private String verificationStatus;
    private String description;

    public Publication() {}

    public Publication(String orcidId, String title, String author, int year, String collaborators, 
                       String doi, String keywords, String abstractText, String documentPath, 
                       String verificationStatus, String description) {
        this.orcidId = orcidId;
        this.title = title;
        this.author = author;
        this.year = year;
        this.collaborators = collaborators;
        this.doi = doi;
        this.keywords = keywords;
        this.abstractText = abstractText;
        this.documentPath = documentPath;
        this.verificationStatus = verificationStatus;
        this.description = description;
    }

    // Getters and Setters
}
