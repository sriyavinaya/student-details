package com.example.backend.service.student;

import com.example.backend.model.Student;
import com.example.backend.model.student.Publications;
import com.example.backend.repository.student.PublicationsRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class PublicationsService {

    private final PublicationsRepository publicationsRepository;

    public PublicationsService(PublicationsRepository publicationsRepository) {
        this.publicationsRepository = publicationsRepository;
    }

    public List<Publications> getAllPublications() {
        return publicationsRepository.findAll();
    }

    public Publications savePublication(Publications publication) {
        return publicationsRepository.save(publication);
    }

    public List<Publications> getByStudent(Student student) {
        return publicationsRepository.findByStudent(student);
    }

    public List<Publications> getByStudentId(Long studentId) {
        return publicationsRepository.findByStudent_Id(studentId);
    }

    @Transactional
    public List<Publications> getPendingAndApprovedEventsByStudent(Student student) {
        return publicationsRepository.findPendingAndApprovedByStudent(student);
    }
}