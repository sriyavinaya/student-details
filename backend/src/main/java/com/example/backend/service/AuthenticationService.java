package com.example.backend.service;

import com.example.backend.model.Role;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthenticationService {

    private final UserRepository userRepository;

    public AuthenticationService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public boolean authenticate(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("Email cannot be null or empty");
        }
        
        Optional<User> optionalUser = userRepository.findByEmail(email);
        return optionalUser.isPresent() && optionalUser.get().isActive();
    }

    public String registerStudent(User student) {
        validateUserInput(student);
        student.setRole(Role.STUDENT); 
        
        if (userRepository.findByEmail(student.getEmail()).isPresent()) {
            return "Email is already registered";
        }
        
        student.setActive(true);
        userRepository.save(student);
        return "Student registration successful!";
    }

    public String registerFA(User fa) {
        validateUserInput(fa);
        fa.setRole(Role.FACULTY);
        
        if (userRepository.findByEmail(fa.getEmail()).isPresent()) {
            return "Email is already registered";
        }
        
        fa.setActive(true);
        userRepository.save(fa);
        return "FA registration successful!";
    }

    public String registerAdmin(User admin) {
        validateUserInput(admin);
        admin.setRole(Role.ADMIN);
        
        if (userRepository.findByEmail(admin.getEmail()).isPresent()) {
            return "Email is already registered";
        }
        
        admin.setActive(true);
        userRepository.save(admin);
        return "Admin registration successful!";
    }

    public String deactivateUser(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("Email cannot be null or empty");
        }
        
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isEmpty()) {
            return "User not found";
        }
        
        User user = optionalUser.get();
        user.setActive(false);
        userRepository.save(user);
        return "User deactivated successfully!";
    }

    private void validateUserInput(User user) {
        if (user == null) {
            throw new IllegalArgumentException("User cannot be null");
        }
        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email cannot be null or empty");
        }
    }
}