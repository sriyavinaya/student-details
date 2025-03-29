package com.example.backend.service;

import java.util.HashMap;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.model.Student;
import com.example.backend.model.User;
import com.example.backend.repository.StudentRepository;
import com.example.backend.repository.UserRepository;

@Service
public class AdminService {

    
    
    @Autowired
    private UserRepository userRepository; // Using UserRepository instead of StudentRepository

    public boolean toggleUserStatus(Long userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setActive(!user.isActive()); // Toggle status
            userRepository.save(user);
            return user.isActive(); // Return new status
        }
        throw new RuntimeException("User not found");
    }

}





// package com.example.backend.service;

// import com.example.backend.model.Admin;
// import com.example.backend.model.Faculty;
// import com.example.backend.model.Student;
// import com.example.backend.repository.AdminRepository;
// import com.example.backend.repository.FacultyRepository;
// import com.example.backend.repository.StudentRepository;

// import jakarta.transaction.Transactional;

// import org.apache.poi.xssf.usermodel.XSSFWorkbook;
// import org.springframework.stereotype.Service;
// import org.springframework.web.multipart.MultipartFile;

// import java.io.IOException;
// import java.io.InputStream;
// import java.time.LocalDate;
// import java.time.ZoneId;
// import java.util.ArrayList;
// import java.util.Date;
// import java.util.List;
// import java.util.Optional;

// import org.apache.poi.ss.usermodel.*;
// import org.apache.poi.xssf.usermodel.XSSFWorkbook;
// import org.springframework.stereotype.Service;
// import org.springframework.web.multipart.MultipartFile;

// import java.io.InputStream;
// import java.util.ArrayList;
// import java.util.List;


// @Service
// public class AdminService {

//     private final StudentRepository studentRepository;
//     private final FacultyRepository facultyRepository;
//     private final AdminRepository adminRepository;

//     public AdminService(StudentRepository studentRepository, FacultyRepository facultyRepository, AdminRepository adminRepository) {
//         this.adminRepository = adminRepository;
//         this.studentRepository = studentRepository;
//         this.facultyRepository = facultyRepository;
//     }

//     public List<Admin> getAllAdmins() {
//         return adminRepository.findAll();
//     }

//     public Optional<Admin> getAdminById(Long id) {
//         return adminRepository.findById(id);
//     }

//     public Admin saveAdmin(Admin admin) {
//         return adminRepository.save(admin);
//     }

//     public void deleteAdmin(Long id) {
//         adminRepository.deleteById(id);
//     }

//     public String uploadStudentsExcel(MultipartFile file) {
//         try {
//             List<Student> students = parseStudentExcel(file.getInputStream());
//             studentRepository.saveAll(students);
//             return "Students uploaded successfully!";
//         } catch (Exception e) {
//             return "Error processing student file: " + e.getMessage();
//         }
//     }

//     public String uploadFacultyExcel(MultipartFile file) {
//         try {
//             List<Faculty> facultyList = parseFacultyExcel(file.getInputStream());
//             facultyRepository.saveAll(facultyList);
//             return "Faculty uploaded successfully!";
//         } catch (Exception e) {
//             return "Error processing faculty file: " + e.getMessage();
//         }
//     }

//     @Transactional
//     public void createStudentsFromExcel(MultipartFile file) throws IOException {
//         try (InputStream inputStream = file.getInputStream()) {
//             Workbook workbook = new XSSFWorkbook(inputStream);
//             Sheet sheet = workbook.getSheetAt(0);

//             // Start from row 1 to skip the header row
//             for (int i = 1; i <= sheet.getLastRowNum(); i++) {
//                 Row row = sheet.getRow(i);
//                 if (row == null) continue; // Skip empty rows

//                 // Create a new Student object
//                 Student student = new Student();
//                 // StudentRegistrationRequest student = new StudentRegistrationRequest();
//                 student.setName(getCellValueAsString(row.getCell(0))); // Column 1: Name
//                 student.setEmail(getCellValueAsString(row.getCell(1))); // Column 2: Email
//                 student.setRollNo(getCellValueAsString(row.getCell(2))); // Column 3: Roll Number
//                 student.setDateOfBirth(getCellValueAsDate(row.getCell(3)));
//                 student.setDegree(getCellValueAsString(row.getCell(5))); // Column 6: Password
//                 student.setDepartment(getCellValueAsString(row.getCell(3))); // Column 4: Department
//                 student.setBatch(getCellValueAsInteger(row.getCell(4))); // Column 5: Section
//                 student.setStudentClass(getCellValueAsString(row.getCell(4))); // Column 5: Section
//                 student.setCgpa(getCellValueAsDouble(row.getCell(4))); // Column 5: Section
//                 student.setGender(getCellValueAsString(row.getCell(9)))
                
//                 student.setFaEmail(getCellValueAsString(row.getCell(6)));
                
//                 // Register the student using AuthenticationService
//                 authenticationService.registerStudent(student);
//             }
//         }
//     }

//     private List<Faculty> parseFacultyExcel(InputStream inputStream) throws Exception {
//         List<Faculty> facultyList = new ArrayList<>();
//         Workbook workbook = new XSSFWorkbook(inputStream);
//         Sheet sheet = workbook.getSheetAt(0);

//         for (Row row : sheet) {
//             if (row.getRowNum() == 0) continue; // Skip header

//             Faculty faculty = new Faculty();
//             faculty.setName(row.getCell(0).getStringCellValue());
//             faculty.setEmail(row.getCell(1).getStringCellValue());
//             faculty.setFaId(row.getCell(2).getStringCellValue());
//             faculty.setDepartment(row.getCell(3).getStringCellValue());
//             faculty.setPhone(row.getCell(5).getStringCellValue());

//             facultyList.add(faculty);
//         }
//         workbook.close();
//         return facultyList;
//     }

//     private String getCellValueAsString(Cell cell) {
//         if (cell == null) {
//             return ""; // Return empty string if the cell is null
//         }
//         return cell.getStringCellValue();
//     }

//     private Date getCellValueAsDate(Cell cell) {
//         if (cell == null) {
//             return null; // Return null if the cell is empty
//         }
    
//         if (cell.getCellType() == CellType.NUMERIC && org.apache.poi.ss.usermodel.DateUtil.isCellDateFormatted(cell)) {
//             return cell.getDateCellValue(); // Extract date if it's formatted as a date
//         }
    
//         return null; // Return null if the cell is not a date
//     }

//     private Integer getCellValueAsInteger(Cell cell) {
//         if (cell == null) {
//             return null; // Return null if the cell is empty
//         }
//         if (cell.getCellType() == CellType.NUMERIC) {
//             return (int) cell.getNumericCellValue(); // Convert to integer
//         } else if (cell.getCellType() == CellType.STRING) {
//             try {
//                 return Integer.parseInt(cell.getStringCellValue().trim()); // Convert string to integer
//             } catch (NumberFormatException e) {
//                 return null; // Return null if parsing fails
//             }
//         }
//         return null;
//     }
    
//     private Double getCellValueAsDouble(Cell cell) {
//         if (cell == null) {
//             return null; // Return null if the cell is empty
//         }
//         if (cell.getCellType() == CellType.NUMERIC) {
//             return cell.getNumericCellValue(); // Return double value
//         } else if (cell.getCellType() == CellType.STRING) {
//             try {
//                 return Double.parseDouble(cell.getStringCellValue().trim()); // Convert string to double
//             } catch (NumberFormatException e) {
//                 return null; // Return null if parsing fails
//             }
//         }
//         return null;
//     }


// }


