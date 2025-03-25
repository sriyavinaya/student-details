package com.example.backend.controller;

import com.example.backend.service.AdminService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping(value = "/upload-students", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> uploadStudents(@RequestParam("file") MultipartFile file) {
        String response = adminService.uploadStudentsExcel(file);
        return ResponseEntity.ok(response);
    }

    @PostMapping(value = "/upload-faculty", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> uploadFaculty(@RequestParam("file") MultipartFile file) {
        String response = adminService.uploadFacultyExcel(file);
        return ResponseEntity.ok(response);
    }
}
