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
@Table(name = "event")
@DiscriminatorValue("Event")
@PrimaryKeyJoinColumn(name = "id")
public class Event extends Main {
    private LocalDate eventDate;
    private String host;
    private String category;
    private String achievement;
    

    public Event() {
        super();
    }

    public Event(String title, String description, Student student, Faculty faculty,
                LocalDate eventDate, String host, String category, 
                String achievement, String documentPath) {
        this.setTitle(title);
        this.setDescription(description);
        this.setStudent(student);
        this.setFaculty(faculty);
        this.setDocumentPath(documentPath);
        this.eventDate = eventDate;
        this.host = host;
        this.category = category;
        this.achievement = achievement;
    }
}

