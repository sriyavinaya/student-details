package com.example.backend.service;

import com.example.backend.model.Student;
import com.example.backend.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class StudentService {
    private final StudentRepository studentRepository;
    private final ExcelUploadService excelUploadService; // ✅ Inject ExcelUploadService

    public StudentService(StudentRepository studentRepository, ExcelUploadService excelUploadService) {
        this.studentRepository = studentRepository;
        this.excelUploadService = excelUploadService;
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Optional<Student> getStudentById(Long id) {
        return studentRepository.findById(id);
    }

    public Student saveStudent(Student student) {
        return studentRepository.save(student);
    }

    public void deleteStudent(Long id) {
        studentRepository.deleteById(id);
    }

    public void saveStudentsToDatabase(MultipartFile file) {
        if (excelUploadService.isValidExcelFile(file)) { // ✅ Now called as an instance method
            try {
                List<Student> students = excelUploadService.getStudentDataFromExcel(file.getInputStream()); // ✅ Instance method
                this.studentRepository.saveAll(students);
            } catch (IOException e) {
                throw new IllegalArgumentException("The file is not a valid Excel file");
            }
        }
    }
}
