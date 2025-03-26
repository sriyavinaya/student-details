// Placements Model
package com.example.backend.model.student;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Placement extends JobOpportunity {
    public Placement() {}

    public Placement(String companyName, LocalDate startDate, String role, String offerLetterPath,
                     String description, String verificationStatus) {
        super(companyName, startDate, role, offerLetterPath, description, verificationStatus);
    }
}