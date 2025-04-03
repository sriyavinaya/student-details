// package com.example.backend.model.student;

// import jakarta.persistence.*;
// import lombok.Getter;
// import lombok.Setter;
// import java.time.LocalDate;

// import com.example.backend.model.Faculty;
// import com.example.backend.model.Student;

// @Getter
// @Setter
// @Entity
// @Table(name = "internship")
// @DiscriminatorValue("Internship")
// @PrimaryKeyJoinColumn(name = "id")
// public class Internship extends JobOpportunity {

//     private String duration; 
//     private String stipend; 


//     public Internship() {
//         super();
//     }

//     public Internship(String title, String description, Student student, Faculty faculty,
//                       String companyName, LocalDate startDate, String role, 
//                       String duration, String documentPath, Boolean flag, String stipend) {
//         super(title, description, student, faculty, companyName, startDate, role, documentPath, flag);
//         this.duration = duration;
//         this.stipend = stipend;
//     }
// }
