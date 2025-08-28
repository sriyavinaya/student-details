package com.example.backend.service;

import com.example.backend.model.Student;
import com.example.backend.repository.FacultyRepository;
import com.example.backend.repository.StudentRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class ExcelUploadService {

    private final StudentRepository studentRepository;

    public ExcelUploadService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public boolean isValidExcelFile(MultipartFile file) {
        return Objects.equals(file.getContentType(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    }

    public List<Student> getStudentDataFromExcel(InputStream inputStream) {
        List<Student> students = new ArrayList<>();

        try (XSSFWorkbook workbook = new XSSFWorkbook(inputStream)) {
            XSSFSheet sheet = workbook.getSheetAt(0);
            int rowIndex = 0;

            for (Row row : sheet) {
                if (rowIndex == 0) {
                    rowIndex++;
                    continue;
                }

                Student student = new Student();
                student.setName(getCellValueAsString(row.getCell(0)));
                student.setEmail(getCellValueAsString(row.getCell(1)));
                student.setRollNo(getCellValueAsString(row.getCell(2)));
                student.setDateOfBirth(getCellValueAsDate(row.getCell(3)));
                System.out.println("Parsed Date of Birth: " + student.getDateOfBirth());

                student.setDepartment(getCellValueAsString(row.getCell(4)));
                student.setBatch(getCellValueAsInteger(row.getCell(5)));
                student.setStudentClass(getCellValueAsString(row.getCell(6)));
                student.setCgpa(getCellValueAsDouble(row.getCell(7)));
                student.setGender(getCellValueAsString(row.getCell(8)));

                students.add(student);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        return students;
    }

    private String getCellValueAsString(Cell cell) {
        if (cell == null) return "";
        return switch (cell.getCellType()) {
            case STRING -> cell.getStringCellValue();
            case NUMERIC -> String.valueOf((long) cell.getNumericCellValue());
            case BOOLEAN -> String.valueOf(cell.getBooleanCellValue());
            case FORMULA -> cell.getCellFormula();
            case BLANK -> "";
            default -> "";
        };
    }

    private Integer getCellValueAsInteger(Cell cell) {
        if (cell == null || cell.getCellType() != CellType.NUMERIC) return 0;
        return (int) cell.getNumericCellValue();
    }

    private Double getCellValueAsDouble(Cell cell) {
        if (cell == null || cell.getCellType() != CellType.NUMERIC) return 0.0;
        return cell.getNumericCellValue();
    }

    private java.util.Date getCellValueAsDate(Cell cell) {
        if (cell == null || cell.getCellType() != CellType.NUMERIC) return null;
        return cell.getDateCellValue();
    }
}
