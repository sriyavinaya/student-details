package com.example.backend.model.student;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

import com.example.backend.model.Faculty;
import com.example.backend.model.Student;

// @Getter
// @Setter
// @Entity
// @Table(name = "clubs_and_societies")
// @DiscriminatorValue("ClubsAndSocieties")
// @PrimaryKeyJoinColumn(name = "id")
// public class ClubsAndSocieties extends Main {

//     private String position;
//     private LocalDate startDate;
//     private LocalDate endDate;
//     private String clubCategory;

//     public ClubsAndSocieties() {
//         super();
//     }

//     public ClubsAndSocieties(String title, String description, Student student, Faculty faculty,
//                              String position, LocalDate startDate, LocalDate endDate, String clubCategory,
//                              String documentPath, Boolean flag) {
//         super();
//         this.setTitle(title);
//         this.setDescription(description);
//         this.setStudent(student);
//         this.setFaculty(faculty);
//         this.position = position;
//         this.startDate = startDate;
//         this.endDate = endDate;
//         this.clubCategory = clubCategory;
//         this.setDocumentPath(documentPath);
//         this.setFlag(flag);
//     }
// }

@Getter
@Setter
@Entity
@Table(name = "clubs_and_societies")
@DiscriminatorValue("ClubsAndSocieties")
@PrimaryKeyJoinColumn(name = "id")
public class ClubsAndSocieties extends Main {

    private String position;
    private LocalDate startDate;
    private LocalDate endDate;
    private String clubCategory;

    @ManyToOne
    @JoinColumn(name = "event_id", referencedColumnName = "id")
    private Event event; // Explicitly reference Event

    public ClubsAndSocieties() {
        super();
    }

    public ClubsAndSocieties(String title, String description, Student student, Faculty faculty,
                             String position, LocalDate startDate, LocalDate endDate, String clubCategory,
                             String documentPath, Boolean flag, Event event) {
        super();
        this.setTitle(title);
        this.setDescription(description);
        this.setStudent(student);
        this.setFaculty(faculty);
        this.position = position;
        this.startDate = startDate;
        this.endDate = endDate;
        this.clubCategory = clubCategory;
        this.setDocumentPath(documentPath);
        this.setFlag(flag);
        this.event = event;
    }
}
