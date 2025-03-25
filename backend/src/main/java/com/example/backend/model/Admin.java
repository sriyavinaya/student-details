package com.example.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "admin")  
public class Admin extends User {

    // @Column(name = "admin_id", unique = true, nullable = false)  
    // private String adminId;

    @Column(name = "phone", nullable = false)  
    private String phone;

    // ✅ Constructors
    public Admin() {}

    public Admin(Long id, String name, String email, String role, 
                String phone) {
        super(id, name, email, role);
        // this.adminId = adminId;
        this.phone = phone;
    }
// 
    // ✅ Getters & Setters
    // public String getAdminId() {
    //     return adminId;
    // }

    // public void setAdminId(String adminId) {
    //     this.adminId = adminId;
    // }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }
}
