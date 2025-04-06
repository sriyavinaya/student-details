package com.example.backend.model.student;

import com.example.backend.model.Faculty;
import com.example.backend.model.Student;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "publications")
@DiscriminatorValue("Publications")
@PrimaryKeyJoinColumn(name = "id")
public class Publications extends Main {

    private String orcidId;

    @Column(columnDefinition = "TEXT")
    private String author;

    private Integer year;  
    // private String collaborators;
    private String doi;

    @Column(columnDefinition = "TEXT")
    private String keywords;

    @Column(columnDefinition = "TEXT")
    private String abstractContent;

    private String publicationType;

    public Publications() {
        super();
    }

    public Publications(String title, String description, Student student, Faculty faculty,
                        String orcidId, String author, int year, 
                        String doi, String keywords, String abstractContent,
                        String documentPath, Boolean flag, String publicationType) {
        super();
        this.setTitle(title);
        this.setDescription(description);
        this.setStudent(student);
        this.setFaculty(faculty);
        this.orcidId = orcidId;
        this.author = author;
        this.year = year;
        // this.collaborators = collaborators;
        this.doi = doi;
        this.keywords = keywords;
        this.abstractContent = abstractContent;
        this.setDocumentPath(documentPath);
        this.setFlag(flag);
        this.publicationType = publicationType;
    }
}
