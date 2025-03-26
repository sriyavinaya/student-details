package com.example.backend.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "faculty")  
public class Faculty extends User {

    @Column(name = "fa_id", unique = true, nullable = false)  
    private String faId;

    private String department;

    private String phone;

    @OneToMany(mappedBy = "faculty", cascade = CascadeType.ALL)  
    private List<Student> students;

    // ✅ Constructors
    public Faculty() {}

    public Faculty(Long id, String name, String email, Role role, 
                   String faId, String department, String phone, List<Student> students, boolean isActive) {
        super(id, name, email, role, isActive);
        this.faId = faId;
        this.department = department;
        this.phone = phone;
        this.students = students;
    }

    // ✅ Getters & Setters
    public String getFaId() {
        return faId;
    }

    public void setFaId(String faId) {
        this.faId = faId;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public List<Student> getStudents() {
        return students;
    }

    public void setStudents(List<Student> students) {
        this.students = students;
    }
}
