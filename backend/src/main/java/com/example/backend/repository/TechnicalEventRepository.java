package com.example.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.backend.model.student.TechnicalEvent;

@Repository
public interface TechnicalEventRepository extends JpaRepository<TechnicalEvent, Long> {
    
    List<TechnicalEvent> findByStatus(String status);
}