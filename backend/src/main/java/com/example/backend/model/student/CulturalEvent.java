package com.example.backend.model.student;

import java.time.LocalDate;
import com.example.backend.model.Student;
import com.example.backend.model.Faculty;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "cultural_event")
@DiscriminatorValue("CulturalEvent")
@PrimaryKeyJoinColumn(name = "id")
public class CulturalEvent extends Event {
    
    public CulturalEvent() {
        super();
    }

    public CulturalEvent(String title, String description, Student student, Faculty faculty,
                        LocalDate eventDate, String host, String category, 
                        String achievement, String documentPath, Boolean flag) {
        super(title, description, student, faculty, eventDate, host, category, achievement, documentPath, flag);
    }
}


