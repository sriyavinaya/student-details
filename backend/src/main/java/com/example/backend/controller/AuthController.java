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

    private final JwtUtil jwtUtil;

    // ✅ Use Constructor-based Injection for JwtUtil
    public AuthController(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    // @PostMapping("/manual-login")
    // public ResponseEntity<?> manualLogin(@RequestBody Map<String, String> request) {
    //     String email = request.get("email");
    //     String role = request.get("role");
    //     System.out.println(role);

    //     Optional<User> userOptional = userRepository.findByEmail(email);

    //     if (userOptional.isPresent()) {
    //         User user = userOptional.get();

    //         // Ensure role in request matches role in database (optional)
    //         if (!user.getRole().equals(role)) {
    //             return ResponseEntity.status(403).body(Map.of("error", "Incorrect role selected"));
    //         }

    //         return ResponseEntity.ok().body(Map.of(
    //             "message", "Login successful",
    //             "email", user.getEmail(),
    //             "role", user.getRole()
    //         ));
    //     } else {
    //         return ResponseEntity.status(401).body(Map.of("error", "User not found"));
    //     }}


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

    



//     @GetMapping("/verify-token")
//     public ResponseEntity<?> verifyToken(@RequestHeader("Authorization") String token) {
//         try {
//             String actualToken = token.replace("Bearer ", ""); // ✅ Remove Bearer prefix
//             jwtUtil.extractRole(actualToken); // ✅ If this works, token is valid
//             return ResponseEntity.ok().body("Token is valid");
//         } catch (Exception e) {
//             return ResponseEntity.status(401).body("Invalid token");
//         }
//     }

    @PostMapping("/google-login")
public ResponseEntity<?> loginWithGoogle(@RequestBody Map<String, String> request) {
    System.out.println("\n\n"+request);
    if (!request.containsKey("email")) {
        return ResponseEntity.badRequest().body("Missing 'email' field in request.");
    }

    String email = request.get("email");
    Optional<User> authenticatedUser = userService.getUserByEmail(email);

    if (authenticatedUser.isPresent()) {
        String role = authenticatedUser.get().getRole();
        // String token = jwtUtil.generateToken(email, role);

        Map<String, Object> response = new HashMap<>();
        response.put("email", email);
        response.put("role", role);
        // response.put("token", token);
        return ResponseEntity.ok(response);
    } else {
        return ResponseEntity.status(401).body("User not registered.");
    }
}

// @PostMapping("/logout")
//     public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
//         // ✅ Invalidate session (if using session-based authentication)
//         HttpSession session = request.getSession(false);
//         if (session != null) {
//             session.invalidate(); // Destroy session
//         }

//         // ✅ Clear security context (removes authentication)
//         SecurityContextHolder.clearContext();

//         // ✅ Send response to frontend
//         return ResponseEntity.ok().body("Logged out successfully");
//     }

}
