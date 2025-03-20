// package com.example.backend.controller;

// import com.example.backend.model.User;
// import com.example.backend.service.UserService;
// // import com.example.backend.util.JwtUtil;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.web.bind.annotation.*;
// import java.util.Optional;
// import java.util.HashMap;
// import java.util.Map;

// @RestController
// @CrossOrigin(origins = "http://localhost:5173")

// @RequestMapping("/api/auth")
// public class AuthController {

//     @Autowired
//     private UserService userService;
// //
// //    
// //    
//     @Autowired
//     private JwtUtil jwtUtil;

//     @PostMapping("/login")
//     public Map<String, Object> login(@RequestBody User user) {
//         Optional<User> authenticatedUser = userService.authenticate(user.getEmail(), user.getPassword());
//         Map<String, Object> response = new HashMap<>();

//         if (authenticatedUser.isPresent()) {
//         	String role = authenticatedUser.get().getEmail().contains("Admin") ? "ADMIN" :
//                 authenticatedUser.get().getEmail().contains("sriya") ? "STUDENT" :
//                 authenticatedUser.get().getEmail().contains("faculty") ? "FACULTY" : "UNKNOWN";
//             String token = jwtUtil.generateToken(user.getEmail(), role);
//             response.put("token", token);
//             response.put("email", user.getEmail());
//             response.put("role", role);
//             response.put("message", "Login Successful");
//         } else {
//             response.put("message", "Invalid Credentials");
//         }

//         return response;
//     }
// }