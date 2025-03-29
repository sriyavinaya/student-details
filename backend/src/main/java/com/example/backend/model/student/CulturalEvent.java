package com.example.backend.model.student;

import java.time.LocalDate;
import com.example.backend.model.Student;
import com.example.backend.model.Faculty;
import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class CulturalEvent extends Event {
    
    public CulturalEvent() {
        super();
    }

    public CulturalEvent(String title, String description, Student student, Faculty faculty,
                        LocalDate eventDate, String host, String category, 
                        String achievement, String documentPath) {
        super(title, description, student, faculty, eventDate, host, category, achievement, documentPath);
    }
}





// package com.example.backend.model.student;

// import java.time.LocalDate;

// import jakarta.persistence.Entity;
// import lombok.Getter;
// import lombok.Setter;

// @Getter
// @Setter
// @Entity
// public class CulturalEvent extends Event {
//     public CulturalEvent() {}

//     public CulturalEvent(String eventName, LocalDate eventDate, String host, String category, 
//                          String achievement, String documentPath, String description, String verificationStatus,Long StudentId, String comments) {
//         super(eventName, eventDate, host, category, achievement, documentPath, description, verificationStatus, StudentId, comments);
//     }
// }
