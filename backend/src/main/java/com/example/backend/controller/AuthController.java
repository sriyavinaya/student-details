package com.example.backend.controller;

// import com.example.backend.dto.LoginRequest;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.UserService;
// import com.example.backend.util.JwtUtil;

// import jakarta.servlet.http.HttpServletRequest;
// import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import org.springframework.http.HttpStatus;
// import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
// import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.Optional;
// import java.util.stream.Collectors;
import java.util.HashMap;
// import java.util.List;
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
    public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> payload, HttpSession session) {
        String email = payload.get("email");
 
        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body("Email is required");
        }

        
        Optional<User> authenticatedUser = userService.getUserByEmail(email);
    
        if (authenticatedUser.isPresent()) {
            User user = authenticatedUser.get();

            if (!user.isActive()) { // Ensure there is an `isActive` field in the User entity
                System.out.println(user.isActive());
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("message", "Account is inactive. Contact admin."));
            }
    
            
            // ✅ Store user info in the session
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

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok("Logged out successfully");
    }


}
