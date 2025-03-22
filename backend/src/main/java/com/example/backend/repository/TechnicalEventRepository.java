package com.example.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.backend.model.student.TechnicalEvent;

@Repository
public interface TechnicalEventRepository extends JpaRepository<TechnicalEvent, Long> {
    // Custom query methods can be added here if needed
}