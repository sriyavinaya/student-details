package com.example.backend.service.student;

import com.example.backend.model.User;
import com.example.backend.model.student.TechnicalEvent;
import com.example.backend.repository.student.TechnicalEventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class TechnicalEventService {

    @Autowired
    private TechnicalEventRepository technicalEventRepository;

    private static final String UPLOAD_DIR = System.getProperty("user.dir") + "/TechnicalEvents/";

    public List<TechnicalEvent> getAllEvents() {
        return technicalEventRepository.findAll();
    }

    public TechnicalEvent saveTechnicalEvent(TechnicalEvent technicalEvent) {
        return technicalEventRepository.save(technicalEvent);
    }

        // Fetch all technical events for a specific student
        public List<TechnicalEvent> getEventsByStudent(Long studentId) {
            return technicalEventRepository.findByStudentId(studentId); // ✅ Ensure repository method uses Long
        }
        
        

    public String saveFile(MultipartFile file) throws IOException {
        File directory = new File(UPLOAD_DIR);
        if (!directory.exists()) {
            directory.mkdirs(); // Create directory if it doesn't exist
        }

        // Extract file extension
        String fileExtension = "";
        String originalFilename = file.getOriginalFilename();
        if (originalFilename != null && originalFilename.contains(".")) {
            fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }

        // Generate a unique filename
        String fileName = UUID.randomUUID().toString() + fileExtension;
        Path filePath = Paths.get(UPLOAD_DIR, fileName);

        // Copy file to the specified directory
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return filePath.toAbsolutePath().toString();
    }

    public Resource downloadFile(Long eventId) throws MalformedURLException {
        // Retrieve the event and check if the document exists
        Optional<TechnicalEvent> eventOptional = technicalEventRepository.findById(eventId);
        if (eventOptional.isEmpty()) {
            return null;
        }

        TechnicalEvent event = eventOptional.get();
        String documentPath = event.getDocumentPath();
        if (documentPath == null || documentPath.isEmpty()) {
            return null;
        }

        // Load the file from local storage
        Path filePath = Paths.get(UPLOAD_DIR).resolve(documentPath).normalize();
        Resource resource = new UrlResource(filePath.toUri());

        if (!resource.exists()) {
            return null; // File not found
        }

        return resource;
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