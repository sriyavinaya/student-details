package com.example.backend.service.student;

import com.example.backend.model.Student;
import com.example.backend.model.student.SportsEvent;
import com.example.backend.repository.student.SportsEventRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class SportsEventService {

    private final SportsEventRepository sportsEventRepository;

    public SportsEventService(SportsEventRepository sportsEventRepository) {
        this.sportsEventRepository = sportsEventRepository;
    }

    public List<SportsEvent> getAllSportsEvents() {
        return sportsEventRepository.findAll();
    }

    public SportsEvent saveSportsEvent(SportsEvent sportsEvent) {
        return sportsEventRepository.save(sportsEvent);
    }

    public List<SportsEvent> getByStudent(Student student) {
        return sportsEventRepository.findByStudent(student);
    }

    public List<SportsEvent> getByStudentId(Long studentId) {
        return sportsEventRepository.findByStudent_Id(studentId);
    }

    public List<SportsEvent> getByVerificationStatus(Boolean flag) {
        return sportsEventRepository.findByFlag(flag);
    }
}