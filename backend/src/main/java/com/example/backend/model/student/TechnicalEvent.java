package com.example.backend.model.student;

import java.time.LocalDate;

import com.example.backend.model.Student;
import com.example.backend.model.Faculty;
import com.example.backend.model.student.Event;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "technical_event")
@DiscriminatorValue("TechnicalEvent")
@PrimaryKeyJoinColumn(name = "id")
public class TechnicalEvent extends Event {
    
    public TechnicalEvent() {
        super();
    }

    public TechnicalEvent(String title, String description, Student student, Faculty faculty,
                         LocalDate eventDate, String host, String category, 
                         String achievement, String documentPath) {
        super(title, description, student, faculty, eventDate, host, category, achievement, documentPath);
    }
}

