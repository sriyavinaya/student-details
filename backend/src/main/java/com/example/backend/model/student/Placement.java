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
// @Table(name = "placement")
// @DiscriminatorValue("Placement")
// @PrimaryKeyJoinColumn(name = "id")
// public class Placement extends JobOpportunity {
//     private String ctc;

//     public Placement() {
//         super();
//     }

//     public Placement(String title, String description, Student student, Faculty faculty,
//                      String companyName, LocalDate startDate, String role, 
//                       String documentPath, Boolean flag, String ctc) {
//         super(title, description, student, faculty, companyName, startDate, role,  documentPath, flag);
//         this.ctc = ctc;
//     }
// }
