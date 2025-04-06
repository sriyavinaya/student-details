package com.example.backend.service.student;

import com.example.backend.model.Student;
import com.example.backend.model.student.TechnicalEvent;
import com.example.backend.repository.student.TechnicalEventRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Service
@Transactional
public class TechnicalEventService {

    private final TechnicalEventRepository technicalEventRepository;

    public TechnicalEventService(TechnicalEventRepository technicalEventRepository) {
        this.technicalEventRepository = technicalEventRepository;
    }

    @Transactional
    public List<TechnicalEvent> getAllEvents() {
        return technicalEventRepository.findAll();
    }

    public TechnicalEvent saveTechnicalEvent(TechnicalEvent event) {
        // Ensure the student and faculty are managed entities
        TechnicalEvent savedEvent = technicalEventRepository.save(event);
        // Explicitly flush to catch any persistence issues immediately
        technicalEventRepository.flush();
        return savedEvent;
    }

    @Transactional
    public List<TechnicalEvent> getEventsByStudent(Student student) {
        return technicalEventRepository.findByStudent(student);
    }

    @Transactional
    public List<TechnicalEvent> getEventsByStudentId(Long studentId) {
        return technicalEventRepository.findByStudent_Id(studentId);
    }

    @Transactional
    public List<TechnicalEvent> getPendingAndApprovedEventsByStudent(Student student) {
        return technicalEventRepository.findPendingAndApprovedByStudent(student);
    }

}

















// package com.example.backend.service.student;

// import com.example.backend.model.student.TechnicalEvent;
// import com.example.backend.repository.student.TechnicalEventRepository;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Service;
// import org.springframework.web.multipart.MultipartFile;

// import java.io.File;
// import java.io.IOException;
// import java.nio.file.Files;
// import java.nio.file.Path;
// import java.nio.file.Paths;
// import java.nio.file.StandardCopyOption;
// import java.util.List;
// import java.util.UUID;

// @Service
// public class TechnicalEventService {

//     @Autowired
//     private TechnicalEventRepository technicalEventRepository;

//     public List<TechnicalEvent> getAllEvents() {
//         return technicalEventRepository.findAll();
//     }

//     private static final String UPLOAD_DIR = System.getProperty("user.dir") + "/TechnicalEvents/";


//     public TechnicalEvent saveTechnicalEvent(TechnicalEvent technicalEvent) {
//         return technicalEventRepository.save(technicalEvent);
//     }


//     public String saveFile(MultipartFile file) throws IOException {
//         File directory = new File(UPLOAD_DIR);
//         if (!directory.exists()) {
//             directory.mkdirs(); // Create directory if it doesn't exist
//         }

//         // Extract file extension
//         String fileExtension = "";
//         String originalFilename = file.getOriginalFilename();
//         if (originalFilename != null && originalFilename.contains(".")) {
//             fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
//         }

//         // Generate a unique filename
//         String fileName = UUID.randomUUID().toString() + fileExtension;
//         Path filePath = Paths.get(UPLOAD_DIR, fileName);

//         // Copy file to the specified directory
//         Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

//         return filePath.toAbsolutePath().toString();
//     }
// }













// // package com.example.backend.service;

// // import com.example.backend.model.forms.TechnicalEvent;
// // import com.example.backend.repository.TechnicalEventRepository;
// // import org.springframework.beans.factory.annotation.Autowired;
// // import org.springframework.stereotype.Service;

// // @Service
// // public class TechnicalEventService {

// //     @Autowired
// //     private TechnicalEventRepository technicalEventRepository;

// //     public TechnicalEvent saveTechnicalEvent(TechnicalEvent technicalEvent) {
// //         return technicalEventRepository.save(technicalEvent);
// //     }
// // }