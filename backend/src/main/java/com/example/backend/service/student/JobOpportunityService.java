// package com.example.backend.service.student;

// import com.example.backend.model.Student;
// import com.example.backend.model.student.JobOpportunity;
// import com.example.backend.repository.student.JobOpportunityRepository;

// import org.springframework.stereotype.Service;
// import org.springframework.transaction.annotation.Transactional;

// import java.util.List;

// @Service
// @Transactional
// public class JobOpportunityService {

//     private final JobOpportunityRepository jobOpportunityRepository;

//     public JobOpportunityService(JobOpportunityRepository jobOpportunityRepository) {
//         this.jobOpportunityRepository = jobOpportunityRepository;
//     }

//     public List<JobOpportunity> getAllJobOpportunities() {
//         return jobOpportunityRepository.findAll();
//     }

//     public JobOpportunity saveJobOpportunity(JobOpportunity jobOpportunity) {
//         return jobOpportunityRepository.save(jobOpportunity);
//     }

//     public List<JobOpportunity> getByStudent(Student student) {
//         return jobOpportunityRepository.findByStudent(student);
//     }

//     public List<JobOpportunity> getByStudentId(Long studentId) {
//         return jobOpportunityRepository.findByStudent_Id(studentId);
//     }

//     public List<JobOpportunity> getInternshipsByStudent(Student student) {
//         return jobOpportunityRepository.findInternshipsByStudent(student);
//     }

//     public List<JobOpportunity> getPlacementsByStudent(Student student) {
//         return jobOpportunityRepository.findPlacementsByStudent(student);
//     }

// }