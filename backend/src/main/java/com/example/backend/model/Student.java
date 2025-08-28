package com.example.backend.model;

import jakarta.persistence.*;
import java.util.Date;

import com.example.backend.repository.FacultyRepository;

@Entity
@Table(name = "student")  
public class Student extends User {

    @Column(name = "roll_no", unique = true, nullable = false)  
    private String rollNo;

    @Column(name = "date_of_birth", nullable = true)  
    private Date dateOfBirth;

    @Column(name = "degree", nullable = true)  
    private String degree;

    private String department;

    private int batch;

    @Column(name = "student_class", nullable = false)  
    private String studentClass;

    // @Column(nullable = true)
    private Double cgpa;

    @Column(nullable = false)
    private String gender;

    private String address;

    private String city;

    private String state;

    @Column(name = "postal_code")  
    private String postalCode;

    private String country;

    @ManyToOne
    @JoinColumn(name = "faculty_id", referencedColumnName = "id", nullable = false)
    private Faculty faculty;
    
    

    // ✅ Constructors
    public Student() {}

    public Student(Long id, String name, String email, Role role, 
                   String rollNo, Date dateOfBirth, String degree, String department, 
                   int batch, String studentClass,double cgpa, String gender,
                   String address, String city, String state, String postalCode, 
                   String country, Faculty faculty, boolean isActive) {
        super(id, name, email, role, isActive);
        this.rollNo = rollNo;
        this.dateOfBirth = dateOfBirth;
        this.degree = degree;
        this.department = department;
        this.batch = batch;
        this.studentClass = studentClass;
        this.cgpa = cgpa;
        this.gender = gender;
        this.address = address;
        this.city = city;
        this.state = state;
        this.postalCode = postalCode;
        this.country = country;
        this.faculty = faculty;
    }

    // ✅ Getters & Setters
    public String getRollNo() {
        return rollNo;
    }

    public void setRollNo(String rollNo) {
        this.rollNo = rollNo;
    }

    public Date getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(Date dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getDegree() {
        return degree;
    }

    public void setDegree(String degree) {
        this.degree = degree;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public int getBatch() {
        return batch;
    }

    public void setBatch(int batch) {
        this.batch = batch;
    }

    public String getStudentClass() {
        return studentClass;
    }

    public void setStudentClass(String studentClass) {
        this.studentClass = studentClass;
    }

    public Double getCgpa() {
        return cgpa;
    }

    public void setCgpa(Double cgpa) {
        this.cgpa = cgpa;
    }


    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public Faculty getFaculty() {
        return faculty;
    }
    
    public void setFaculty(Faculty faculty) {
        this.faculty = faculty;
    }

    public void setFaEmail(String faEmail, FacultyRepository facultyRepository) {
        this.faculty = facultyRepository.findByEmail(faEmail)
            .orElseThrow(() -> new IllegalArgumentException("Faculty with email " + faEmail + " not found"));
    }

    
}
