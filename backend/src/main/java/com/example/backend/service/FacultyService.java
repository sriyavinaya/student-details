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

    public FacultyService(FacultyRepository facultyRepository, 
                         UserRepository userRepository, 
                         StudentRepository studentRepository) {
        this.facultyRepository = facultyRepository;
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
    }

    // Object-based version
    public List<Student> getStudentsUnderFaculty(Faculty faculty) {
        return facultyRepository.findStudentsByFaculty(faculty);
    }

    // ID-based version (existing)
    public List<Student> getStudentsUnderFaculty(Long facultyId) {
        // Get faculty first
        Faculty faculty = facultyRepository.findById(facultyId)
            .orElseThrow(() -> new RuntimeException("Faculty not found"));
        
        // Then get students using object reference
        return facultyRepository.findStudentsByFaculty(faculty);
        
        // Or keep the existing email-based implementation:
        // String facultyEmail = userRepository.findById(facultyId)
        //     .map(User::getEmail)
        //     .orElseThrow(() -> new RuntimeException("Faculty not found"));
        // return studentRepository.findStudentsByFaculty_Email(facultyEmail);
    }

    // Get faculty by email
    public Optional<Faculty> getFacultyByEmail(String email) {
        return facultyRepository.findByEmail(email);
    }

    public List<Faculty> getAllFaculty() {
        return facultyRepository.findAll();
    }

    public Optional<Faculty> getFacultyById(Long id) {
        return facultyRepository.findById(id);
    }

    public Faculty saveFaculty(Faculty faculty) {
        return facultyRepository.save(faculty);
    }

    public void deleteFaculty(Long id) {
        facultyRepository.deleteById(id);
    }

    public Object findById(Long facultyId) {

        throw new UnsupportedOperationException("Unimplemented method 'findById'");
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
