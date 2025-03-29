package com.example.backend.service;

import com.example.backend.model.Faculty;
import com.example.backend.model.Student;
import com.example.backend.model.User;
import com.example.backend.repository.FacultyRepository;
import com.example.backend.repository.StudentRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FacultyService {

    private final FacultyRepository facultyRepository;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;

    public FacultyService(FacultyRepository facultyRepository, UserRepository userRepository, StudentRepository studentRepository) {
        this.facultyRepository = facultyRepository;
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
    }

    // ✅ Fetch students under a faculty based on faculty email
    public List<Student> getStudentsUnderFaculty(Long facultyId) {
        // Get faculty's email from User table
        String facultyEmail = userRepository.findById(facultyId)
            .map(User::getEmail)
            .orElseThrow(() -> new RuntimeException("Faculty not found"));

        // Find students where faculty_email matches
        return studentRepository.findStudentsByFaculty_Email(facultyEmail);
    }

    // ✅ Fetch all faculty members
    public List<Faculty> getAllFaculty() {
        return facultyRepository.findAll();
    }

    // ✅ Fetch faculty by ID
    public Optional<Faculty> getFacultyById(Long id) {
        return facultyRepository.findById(id);
    }

    // ✅ Save faculty
    public Faculty saveFaculty(Faculty faculty) {
        return facultyRepository.save(faculty);
    }

    // ✅ Delete faculty
    public void deleteFaculty(Long id) {
        facultyRepository.deleteById(id);
    }

    
}








// package com.example.backend.service;

// import com.example.backend.model.Faculty;
// import com.example.backend.repository.FacultyRepository;
// import com.example.backend.repository.student.MainRepository;
// import org.springframework.stereotype.Service;

// import java.util.List;
// import java.util.Optional;

// @Service
// public class FacultyService {

//     private final FacultyRepository facultyRepository;
//     private final MainRepository mainRepository;

//     public FacultyService(FacultyRepository facultyRepository, MainRepository mainRepository) {
//         this.facultyRepository = facultyRepository;
//         this.mainRepository = mainRepository;
//     }

//     // ✅ Get all faculty members
//     public List<Faculty> getAllFaculty() {
//         return facultyRepository.findAll();
//     }

//     // ✅ Get faculty by ID
//     public Optional<Faculty> getFacultyById(Long id) {
//         return facultyRepository.findById(id);
//     }

//     // ✅ Save faculty
//     public Faculty saveFaculty(Faculty faculty) {
//         return facultyRepository.save(faculty);
//     }

//     // ✅ Delete faculty by ID
//     public void deleteFaculty(Long id) {
//         facultyRepository.deleteById(id);
//     }

//     // ✅ Get faculty ID by student ID
//     public Long getFacultyIdByStudentId(Long studentId) {
//         return mainRepository.findFacultyIdByStudentId(studentId);
//     }
// }
