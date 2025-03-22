package com.example.backend.dto;

public class LoginRequest {
    private String email;

    // ✅ Constructor
    public LoginRequest() {}

    public LoginRequest(String email) {
        this.email = email;
    }

    // ✅ Getter & Setter
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
