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
// @Table(name = "job_opportunity")
// @Inheritance(strategy = InheritanceType.SINGLE_TABLE)
// @DiscriminatorColumn(name = "opportunity_type", discriminatorType = DiscriminatorType.STRING)
// @PrimaryKeyJoinColumn(name = "id")
// public class JobOpportunity extends Main {

//     private String companyName;
//     private LocalDate startDate;
//     private String role;
//     // private String offerLetterPath;

//     public JobOpportunity() {
//         super();
//     }

//     public JobOpportunity(String title, String description, Student student, Faculty faculty,
//                             String companyName, LocalDate startDate, String role, 
//                              String documentPath, Boolean flag) {
//         super();
//         this.setTitle(title);
//         this.setDescription(description);
//         this.setStudent(student);
//         this.setFaculty(faculty);
//         this.companyName = companyName;
//         this.startDate = startDate;
//         this.role = role;
//         // this.offerLetterPath = offerLetterPath;
//         this.setDocumentPath(documentPath);
//         this.setFlag(flag);
//     }
// }
