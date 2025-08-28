package com.example.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
@Inheritance(strategy = InheritanceType.JOINED)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Enumerated(EnumType.STRING) // ✅ Store role as a String in DB
    private Role role;
    
    @Column(nullable = false)
    private boolean isActive = true; // New field to track active status

    // ✅ Constructors
    public User() {}

    public User(Long id, String name, String email, Role role, boolean isActive) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.isActive = isActive;
    }

    // ✅ Getters & Setters
    public long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }
}