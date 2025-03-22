package com.example.backend.controller;

import com.example.backend.model.User;
import com.example.backend.service.UserService;
import com.example.backend.util.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.Optional;
import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    private final JwtUtil jwtUtil;

    // ✅ Use Constructor-based Injection for JwtUtil
    public AuthController(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @GetMapping("/verify-token")
    public ResponseEntity<?> verifyToken(@RequestHeader("Authorization") String token) {
        try {
            String actualToken = token.replace("Bearer ", ""); // ✅ Remove Bearer prefix
            jwtUtil.extractRole(actualToken); // ✅ If this works, token is valid
            return ResponseEntity.ok().body("Token is valid");
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid token");
        }
    }

    @PostMapping("/google-login")
public ResponseEntity<?> loginWithGoogle(@RequestBody Map<String, String> request) {
    if (!request.containsKey("email")) {
        return ResponseEntity.badRequest().body("Missing 'email' field in request.");
    }

    String email = request.get("email");
    Optional<User> authenticatedUser = userService.getUserByEmail(email);

    if (authenticatedUser.isPresent()) {
        String role = authenticatedUser.get().getRole();
        String token = jwtUtil.generateToken(email, role);

        Map<String, Object> response = new HashMap<>();
        response.put("email", email);
        response.put("role", role);
        response.put("token", token);
        return ResponseEntity.ok(response);
    } else {
        return ResponseEntity.status(401).body("User not registered.");
    }
}

@PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        // ✅ Invalidate session (if using session-based authentication)
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate(); // Destroy session
        }

        // ✅ Clear security context (removes authentication)
        SecurityContextHolder.clearContext();

        // ✅ Send response to frontend
        return ResponseEntity.ok().body("Logged out successfully");
    }

}
