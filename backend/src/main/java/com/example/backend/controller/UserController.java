package com.example.backend.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.backend.model.Role;
import com.example.backend.model.User;
import com.example.backend.service.UserService;

@RestController
@RequestMapping("/api/users")  // Base path for user-related operations
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers()
                .stream()
                .filter(user -> user.getRole() != Role.ADMIN) // Compare with enum directly
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }
    

    @GetMapping("/roles")
    public ResponseEntity<List<User>> getUsersByRoles(@RequestParam List<String> roles) {
        return ResponseEntity.ok(userService.getUsersByRoles(roles));
    }

    // @DeleteMapping("/{id}")
    // public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
    //     boolean isDeleted = userService.deleteUserById(id);
    //     return isDeleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    // }
}
