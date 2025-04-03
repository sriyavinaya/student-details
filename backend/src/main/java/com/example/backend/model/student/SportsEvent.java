package com.example.backend.model.student;

import java.time.LocalDate;

import com.example.backend.model.Faculty;
import com.example.backend.model.Student;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "sports_event")
@DiscriminatorValue("SportsEvent")
@PrimaryKeyJoinColumn(name = "id")
public class SportsEvent extends Event {
    private String eventLevel;
    private String role;
    private String outcome;
    
    public SportsEvent() {
        super();
    }
    
    public SportsEvent(String title, String description, Student student, Faculty faculty,
                       LocalDate eventDate, String host, String category, 
                       String achievement, String documentPath, Boolean flag,
                       String eventLevel, String role, String outcome ){
        super(title, description, student, faculty, eventDate, host, category, achievement, documentPath, flag);
        this.eventLevel = eventLevel;
        this.role = role;
        this.outcome = outcome;
    }
}
