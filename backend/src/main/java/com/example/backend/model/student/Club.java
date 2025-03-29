// package com.example.backend.model.student;

// import jakarta.persistence.Entity;
// import lombok.Getter;
// import lombok.Setter;
// import java.time.LocalDate;

// @Getter
// @Setter
// @Entity
// public class Club extends Main {  // ✅ Inherits all fields from Main
//     private String position;
//     private LocalDate startDate;
//     private LocalDate endDate;
//     private String clubCategory;
//     private String documentPath;

//     public Club() {
//         super();
//     }

//     public Club(String title, String description, Long studentId, Long facultyId, 
//                 String position, LocalDate startDate, LocalDate endDate, 
//                 String clubCategory, String documentPath) {
//         super();
//         this.setTitle(title);
//         this.setDescription(description);
//         this.setStudentId(studentId);
//         this.setFacultyId(facultyId);
//         this.position = position;
//         this.startDate = startDate;
//         this.endDate = endDate;
//         this.clubCategory = clubCategory;
//         this.documentPath = documentPath;
//     }
// }


// package com.example.backend.model.student;

// import java.time.LocalDate;

// import jakarta.persistence.Entity;
// import lombok.Getter;
// import lomboak.Setter;

// @Getter
// @Setter
// // Clubs and Societies Model
// @Entity
// public class Club {
//     private String position;
//     private LocalDate startDate;
//     private LocalDate endDate;
//     private String clubCategory;
//     private String documentPath;
//     private String comments;

//     public Club() {}

//     public Club(String documentPath, String description, String verificationStatus,
//                 String position, LocalDate startDate, LocalDate endDate, String clubCategory, Long StudentId, String comments) {
//         // super(eventName, eventDate, host, category, achievement, documentPath, description, verificationStatus, StudentId, comments);
//         this.position = position;
//         this.startDate = startDate;
//         this.endDate = endDate;
//         this.clubCategory = clubCategory;
//         this.documentPath = documentPath;
//         this.comments = comments;
//     }

//     // Getters and Setters
// }