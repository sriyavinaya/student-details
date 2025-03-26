package com.example.backend.model.student;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
// Clubs and Societies Model
@Entity
public class Club extends Event {
    private String position;
    private LocalDate startDate;
    private LocalDate endDate;
    private String clubCategory;

    public Club() {}

    public Club(String eventName, LocalDate eventDate, String host, String category, 
                String achievement, String documentPath, String description, String verificationStatus,
                String position, LocalDate startDate, LocalDate endDate, String clubCategory, Long StudentId, String comments) {
        super(eventName, eventDate, host, category, achievement, documentPath, description, verificationStatus, StudentId, comments);
        this.position = position;
        this.startDate = startDate;
        this.endDate = endDate;
        this.clubCategory = clubCategory;
    }

    // Getters and Setters
}