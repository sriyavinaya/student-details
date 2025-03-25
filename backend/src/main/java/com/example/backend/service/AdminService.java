package com.example.backend.service;

import com.example.backend.model.Admin;
import com.example.backend.model.Faculty;
import com.example.backend.model.Student;
import com.example.backend.repository.AdminRepository;
import com.example.backend.repository.FacultyRepository;
import com.example.backend.repository.StudentRepository;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;


@Service
public class AdminService {

    private final StudentRepository studentRepository;
    private final FacultyRepository facultyRepository;
    private final AdminRepository adminRepository;

    public AdminService(StudentRepository studentRepository, FacultyRepository facultyRepository, AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
        this.studentRepository = studentRepository;
        this.facultyRepository = facultyRepository;
    }

    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    public Optional<Admin> getAdminById(Long id) {
        return adminRepository.findById(id);
    }

    public Admin saveAdmin(Admin admin) {
        return adminRepository.save(admin);
    }

    public void deleteAdmin(Long id) {
        adminRepository.deleteById(id);
    }

    public String uploadStudentsExcel(MultipartFile file) {
        try {
            List<Student> students = parseStudentExcel(file.getInputStream());
            studentRepository.saveAll(students);
            return "Students uploaded successfully!";
        } catch (Exception e) {
            return "Error processing student file: " + e.getMessage();
        }
    }

    public String uploadFacultyExcel(MultipartFile file) {
        try {
            List<Faculty> facultyList = parseFacultyExcel(file.getInputStream());
            facultyRepository.saveAll(facultyList);
            return "Faculty uploaded successfully!";
        } catch (Exception e) {
            return "Error processing faculty file: " + e.getMessage();
        }
    }

    private List<Student> parseStudentExcel(InputStream inputStream) throws Exception {
        List<Student> students = new ArrayList<>();
        Workbook workbook = new XSSFWorkbook(inputStream);
        Sheet sheet = workbook.getSheetAt(0);

        for (Row row : sheet) {
            if (row.getRowNum() == 0) continue; // Skip header

            Student student = new Student();
            student.setName(row.getCell(0).getStringCellValue());
            student.setEmail(row.getCell(1).getStringCellValue());
            student.setRollNo(row.getCell(2).getStringCellValue());
            student.setDepartment(row.getCell(3).getStringCellValue());
            student.setBatch((int) row.getCell(4).getNumericCellValue());
            student.setAddress(row.getCell(6).getStringCellValue());
            student.setGender(row.getCell(7).getStringCellValue());
            student.setDateOfBirth(row.getCell(8).getDateCellValue());
            student.setCgpa(row.getCell(9).getNumericCellValue());

            students.add(student);
        }
        workbook.close();
        return students;
    }

    private List<Faculty> parseFacultyExcel(InputStream inputStream) throws Exception {
        List<Faculty> facultyList = new ArrayList<>();
        Workbook workbook = new XSSFWorkbook(inputStream);
        Sheet sheet = workbook.getSheetAt(0);

        for (Row row : sheet) {
            if (row.getRowNum() == 0) continue; // Skip header

            Faculty faculty = new Faculty();
            faculty.setName(row.getCell(0).getStringCellValue());
            faculty.setEmail(row.getCell(1).getStringCellValue());
            faculty.setFaId(row.getCell(2).getStringCellValue());
            faculty.setDepartment(row.getCell(3).getStringCellValue());
            faculty.setPhone(row.getCell(5).getStringCellValue());

            facultyList.add(faculty);
        }
        workbook.close();
        return facultyList;
    }
}
