package com.example.backend.controller;

// import com.example.backend.service.ImportService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.backend.model.Faculty;
import com.example.backend.model.Student;
import com.example.backend.service.AdminService;
import com.example.backend.service.FacultyService;
import com.example.backend.service.StudentService;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;


@RestController
@RequestMapping("/api/admin")

@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    @Autowired
    private AdminService adminService;

    private final StudentService studentService;
    private final FacultyService facultyService;


    public AdminController(StudentService studentService, FacultyService facultyService) {
        this.studentService = studentService;
        this.facultyService = facultyService;

    }

        // @Operation(summary = "Upload an Excel file containing student data", 
        //     description = "Uploads an Excel file and saves student data to the database.")
        // @PostMapping(value = "/upload-students-data", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
        // public ResponseEntity<?> uploadStudentsData(@RequestParam("file") MultipartFile file) {
        //     studentService.saveStudentsToDatabase(file);
        //     return ResponseEntity.ok(Map.of("Message", "Students data uploaded and saved to database successfully"));
        // }

        @GetMapping("/all-students")
        public ResponseEntity<List<Student>> getStudents() {
            List<Student> students = studentService.getAllStudents();
            return ResponseEntity.ok(students); // Returns 200 OK with the student list
        }

        @GetMapping("/all-faculty")
        public ResponseEntity<List<Faculty>> getFaculty() {
            List<Faculty> faculty = facultyService.getAllFaculty();
            return ResponseEntity.ok(faculty); // Returns 200 OK with the student list
        }

        @PutMapping("/users/{id}/toggle-status")
        public ResponseEntity<String> toggleUserStatus(@PathVariable Long id) {
            boolean updatedStatus = adminService.toggleUserStatus(id);
            return ResponseEntity.ok(updatedStatus ? "User reactivated" : "User deactivated");
        }


}




































// public class AdminController {

    // private final ImportService importService;

    // public AdminController(ImportService importService) {
    //     this.importService = importService;
    // }

    // @PostMapping(value = "/upload-students", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    // public ResponseEntity<String> uploadStudents(@RequestParam("file") MultipartFile file) {
    //     String response = importService.uploadStudentsExcel(file);
    //     return ResponseEntity.ok(response);
    // }

    // @PostMapping(value = "/upload-faculty", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    // public ResponseEntity<String> uploadFaculty(@RequestParam("file") MultipartFile file) {
    //     String response = importService.uploadFacultyExcel(file);
    //     return ResponseEntity.ok(response);
    // }


    
// }
