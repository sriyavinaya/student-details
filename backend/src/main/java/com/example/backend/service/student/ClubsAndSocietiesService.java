package com.example.backend.service.student;

import com.example.backend.model.Student;
import com.example.backend.model.student.ClubsAndSocieties;
import com.example.backend.repository.student.ClubsAndSocietiesRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ClubsAndSocietiesService {

    private final ClubsAndSocietiesRepository clubsAndSocietiesRepository;

    public ClubsAndSocietiesService(ClubsAndSocietiesRepository clubsAndSocietiesRepository) {
        this.clubsAndSocietiesRepository = clubsAndSocietiesRepository;
    }

    public List<ClubsAndSocieties> getAllClubsAndSocieties() {
        return clubsAndSocietiesRepository.findAll();
    }

    public ClubsAndSocieties saveClubsAndSocieties(ClubsAndSocieties clubsAndSocieties) {
        return clubsAndSocietiesRepository.save(clubsAndSocieties);
    }

    public List<ClubsAndSocieties> getByStudent(Student student) {
        return clubsAndSocietiesRepository.findByStudent(student);
    }

    public List<ClubsAndSocieties> getByStudentId(Long studentId) {
        return clubsAndSocietiesRepository.findByStudent_Id(studentId);
    }

    public List<ClubsAndSocieties> getByVerificationStatus(Boolean flag) {
        return clubsAndSocietiesRepository.findByFlag(flag);
    }
}