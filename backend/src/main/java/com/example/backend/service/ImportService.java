// package com.example.backend.service;

// import com.example.backend.model.Admin;
// import com.example.backend.model.Faculty;
// import com.example.backend.model.Student;
// import com.example.backend.repository.AdminRepository;
// import com.example.backend.repository.FacultyRepository;
// import com.example.backend.repository.StudentRepository;
// import jakarta.transaction.Transactional;
// import org.apache.poi.ss.usermodel.*;
// import org.apache.poi.xssf.usermodel.XSSFWorkbook;
// import org.springframework.stereotype.Service;
// import org.springframework.web.multipart.MultipartFile;
// import java.io.IOException;
// import java.io.InputStream;
// import java.util.ArrayList;
// import java.util.List;

// @Service
// public class ImportService {

//     private final StudentRepository studentRepository;
//     private final FacultyRepository facultyRepository;
//     private final AdminRepository adminRepository;
//     private final AuthenticationService authenticationService;

//     public ImportService(StudentRepository studentRepository, FacultyRepository facultyRepository,
//                         AdminRepository adminRepository, AuthenticationService authenticationService) {
//         this.adminRepository = adminRepository;
//         this.studentRepository = studentRepository;
//         this.facultyRepository = facultyRepository;
//         this.authenticationService = authenticationService;
//     }

//     public String uploadStudentsExcel(MultipartFile file) {
//         try (InputStream inputStream = file.getInputStream(); Workbook workbook = new XSSFWorkbook(inputStream)) {
//             List<Student> students = parseStudentExcel(workbook);
//             studentRepository.saveAll(students);
//             return "Students uploaded successfully!";
//         } catch (Exception e) {
//             return "Error processing student file: " + e.getMessage();
//         }
//     }

//     @Transactional
//     public void createStudentsFromExcel(MultipartFile file) throws IOException {
//         try (InputStream inputStream = file.getInputStream(); Workbook workbook = new XSSFWorkbook(inputStream)) {
//             Sheet sheet = workbook.getSheetAt(0);
//             for (int i = 1; i <= sheet.getLastRowNum(); i++) {
//                 Row row = sheet.getRow(i);
//                 if (row == null) continue;

//                 Student student = new Student();
//                 student.setName(getCellValueAsString(row.getCell(0)));
//                 student.setEmail(getCellValueAsString(row.getCell(1)));
//                 student.setRollNo(getCellValueAsString(row.getCell(2)));
//                 student.setDateOfBirth(getCellValueAsDate(row.getCell(3)));
//                 student.setDepartment(getCellValueAsString(row.getCell(4)));
//                 student.setBatch(getCellValueAsInteger(row.getCell(5)));
//                 student.setStudentClass(getCellValueAsString(row.getCell(6)));
//                 student.setCgpa(getCellValueAsDouble(row.getCell(7)));
//                 student.setGender(getCellValueAsString(row.getCell(8)));
//                 student.setRole("student");

//                 student.setFaEmail(getCellValueAsString(row.getCell(9)), facultyRepository);
//                 authenticationService.registerStudent(student);
//             }
//         }
//     }

//     private List<Student> parseStudentExcel(Workbook workbook) {
//         List<Student> students = new ArrayList<>();
//         Sheet sheet = workbook.getSheetAt(0);
//         for (Row row : sheet) {
//             if (row.getRowNum() == 0) continue;
//             Student student = new Student();
//             student.setName(getCellValueAsString(row.getCell(0)));
//             student.setEmail(getCellValueAsString(row.getCell(1)));
//             students.add(student);
//         }
//         return students;
//     }

//     private String getCellValueAsString(Cell cell) {
//         if (cell == null) return "";
//         return cell.getCellType() == CellType.STRING ? cell.getStringCellValue().trim() : "";
//     }

//     private Integer getCellValueAsInteger(Cell cell) {
//         if (cell == null) return null;
//         return cell.getCellType() == CellType.NUMERIC ? (int) cell.getNumericCellValue() : null;
//     }

//     private Double getCellValueAsDouble(Cell cell) {
//         if (cell == null) return null;
//         return cell.getCellType() == CellType.NUMERIC ? cell.getNumericCellValue() : null;
//     }

//     private java.util.Date getCellValueAsDate(Cell cell) {
//         if (cell == null) return null;
//         return cell.getCellType() == CellType.NUMERIC && DateUtil.isCellDateFormatted(cell) ? cell.getDateCellValue() : null;
//     }
// }
