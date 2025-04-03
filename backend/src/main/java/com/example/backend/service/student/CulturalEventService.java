package com.example.backend.service.student;

import com.example.backend.model.Student;
import com.example.backend.model.student.CulturalEvent;
import com.example.backend.repository.student.CulturalEventRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CulturalEventService {

    private final CulturalEventRepository culturalEventRepository;

    public CulturalEventService(CulturalEventRepository culturalEventRepository) {
        this.culturalEventRepository = culturalEventRepository;
    }

    public List<CulturalEvent> getAllCulturalEvents() {
        return culturalEventRepository.findAll();
    }

    public CulturalEvent saveCulturalEvent(CulturalEvent culturalEvent) {
        return culturalEventRepository.save(culturalEvent);
    }

    public List<CulturalEvent> getByStudent(Student student) {
        return culturalEventRepository.findByStudent(student);
    }

    public List<CulturalEvent> getByStudentId(Long studentId) {
        return culturalEventRepository.findByStudent_Id(studentId);
    }

    public List<CulturalEvent> getByVerificationStatus(Boolean flag) {
        return culturalEventRepository.findByFlag(flag);
    }
}