package com.example.backend.model.student;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;
import com.example.backend.model.Faculty;
import com.example.backend.model.Student;

@Getter
@Setter
@Entity
@Table(name = "job_opportunity")
@DiscriminatorValue("JobOpoortunities")
@PrimaryKeyJoinColumn(name = "id")
public class JobOpportunity extends Main {
    
    @Column(name = "company_name")
    private String companyName;
    
    @Column(name = "start_date")
    private LocalDate startDate;
    
    private String role;
    private String field;
    
    @Enumerated(EnumType.STRING)
    private JobType type;  // Enum to distinguish between INTERNSHIP and PLACEMENT
    
    // Fields specific to internship
    private String duration;
    private String stipend;
    
    // Field specific to placement
    private String ctc;

    public enum JobType {
        INTERNSHIP,
        PLACEMENT
    }

    public JobOpportunity() {
        // Default constructor
    }

    // Common fields constructor
    protected JobOpportunity(String title, String description, Student student, Faculty faculty,
                          String companyName, LocalDate startDate, String role, String field,
                          String documentPath, Boolean flag) {
        super();
        this.setTitle(title);
        this.setDescription(description);
        this.setStudent(student);
        this.setFaculty(faculty);
        this.setFlag(flag);
        this.companyName = companyName;
        this.startDate = startDate;
        this.role = role;
        this.field = field;
    }

    // Constructor for Internship type
    public JobOpportunity(String title, String description, Student student, Faculty faculty,
                         String companyName, LocalDate startDate, String role, String field,
                         String documentPath, Boolean flag, String duration, String stipend) {
        this(title, description, student, faculty, companyName, startDate, role, field, documentPath, flag);
        this.type = JobType.INTERNSHIP;
        this.duration = duration;
        this.stipend = stipend;
    }

    // Constructor for Placement type
    public JobOpportunity(String title, String description, Student student, Faculty faculty,
                         String companyName, LocalDate startDate, String role, String field,
                         String documentPath, Boolean flag, String ctc) {
        this(title, description, student, faculty, companyName, startDate, role, field, documentPath, flag);
        this.type = JobType.PLACEMENT;
        this.ctc = ctc;
    }
}