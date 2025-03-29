package com.example.backend.model.student;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;
import com.example.backend.model.Student;
import com.example.backend.model.Faculty;

@Getter
@Setter
@Entity
@DiscriminatorValue("Event")
public class Event extends Main {
    private LocalDate eventDate;
    private String host;
    private String category;
    private String achievement;
    private String documentPath;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id")
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "faculty_id")
    private Faculty faculty;

    public Event() {
        super();
    }

    public Event(String title, String description, Student student, Faculty faculty,
                LocalDate eventDate, String host, String category, 
                String achievement, String documentPath) {
        super();
        this.setTitle(title);
        this.setDescription(description);
        this.student = student;
        this.faculty = faculty;
        this.eventDate = eventDate;
        this.host = host;
        this.category = category;
        this.achievement = achievement;
        this.documentPath = documentPath;
    }
}


// package com.example.backend.model.student;

// import jakarta.persistence.*;
// import java.time.LocalDate;

// import lombok.Getter;
// import lombok.Setter;

// @Getter
// @Setter
// @Entity
// @Inheritance(strategy = InheritanceType.JOINED)
// public abstract class Event {

//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     private Long id;

//     private String eventName;
//     private LocalDate eventDate;
//     private String host;
//     private String category;
//     private String achievement;
//     private String documentPath;
//     private String description;
//     private String verificationStatus;
//     private Long studentId;
//     private String comments;
    

//     // ✅ Corrected ManyToOne Relationship (Joining on Student ID)
//     // @ManyToOne
//     // @JoinColumn(name = "student_id", referencedColumnName = "id", nullable = false)


//     // ✅ Constructors
//     public Event() {}

//     public Event(String eventName, LocalDate eventDate, String host, String category, 
//                  String achievement, String documentPath, String description, 
//                  String verificationStatus, Long studentId, String comments) {  
//         this.eventName = eventName;
//         this.eventDate = eventDate;
//         this.host = host;
//         this.category = category;
//         this.achievement = achievement;
//         this.documentPath = documentPath;
//         this.description = description;
//         this.verificationStatus = verificationStatus;
//         this.studentId= studentId;
//         this.comments = comments;
//     }
// }
