package com.example.backend.controller;

import com.example.backend.dto.LoginRequest;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.UserService;
import com.example.backend.util.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepostiory;

    @Autowired
    private UserService userService;

    
    @PostMapping("/google-login")
    public ResponseEntity<?> loginWithGoogle(@RequestBody Map<String, String> request, HttpServletRequest httpRequest) {
        if (!request.containsKey("email")) {
            return ResponseEntity.badRequest().body("Missing 'email' field in request.");
        
            
        }
    
        String email = request.get("email");
        Optional<User> authenticatedUser = userService.getUserByEmail(email);
    
        if (authenticatedUser.isPresent()) {
            User user = authenticatedUser.get();
            
            // ✅ Store user info in the session
            HttpSession session = httpRequest.getSession(true);
            session.setAttribute("user", user);
        
            // ✅ Construct response
            Map<String, Object> response = new HashMap<>();
            response.put("id", user.getId());
            response.put("email", user.getEmail());
            response.put("role", user.getRole());
        
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(401).body("User not registered.");
        }
    }


    @GetMapping("/check-session")
    public ResponseEntity<?> checkSession(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        
        if (session == null || session.getAttribute("user") == null) {
            return ResponseEntity.status(401).body("Session expired or not found.");
        }

        

        // Retrieve user details from session
        User user = (User) session.getAttribute("user");

        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("email", user.getEmail());
        response.put("role", user.getRole());

        return ResponseEntity.ok(response);
    }

        @GetMapping("/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userService.getAllUsers()
                .stream()
                .filter(user -> !"admin".equalsIgnoreCase(user.getRole())) 
                .collect(Collectors.toList());
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate(); // ✅ Destroy session
        }

        SecurityContextHolder.clearContext();
        return ResponseEntity.ok().body("Logged out successfully");
}


}
