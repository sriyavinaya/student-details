// package com.example.backend.controller;

// import org.springframework.http.HttpHeaders;
// import org.springframework.http.MediaType;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;

// import com.example.backend.service.ExportService;
// import com.itextpdf.text.DocumentException;

// import java.io.IOException;
// import java.util.Set;

// @RestController
// @RequestMapping("/api/export")
// public class ExportController {

//     private final ExportService exportService;

//     public ExportController(ExportService exportService) {
//         this.exportService = exportService;
//     }

//     @PostMapping("/students")
//     public ResponseEntity<byte[]> exportStudents(
//             @RequestParam String format,
//             @RequestParam(required = false) String department,
//             @RequestParam(required = false) String searchTerm,
//             @RequestBody Set<String> fields) throws IOException, DocumentException {
        
//         byte[] content = exportService.exportStudents(format, department, searchTerm, fields);
        
//         String contentType = switch (format.toLowerCase()) {
//             case "excel" -> "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
//             case "pdf" -> "application/pdf";
//             case "csv" -> "text/csv";
//             default -> "application/octet-stream";
//         };
        
//         String fileName = "student_details." + format.toLowerCase();
        
//         return ResponseEntity.ok()
//                 .contentType(MediaType.parseMediaType(contentType))
//                 .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
//                 .body(content);
//     }
// }