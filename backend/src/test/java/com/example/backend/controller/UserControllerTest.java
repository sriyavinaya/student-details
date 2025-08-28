package com.example.backend.controller;

import com.example.backend.model.Role;
import com.example.backend.model.User;
import com.example.backend.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserControllerTest {

    @Mock
    private UserService userService;

    @InjectMocks
    private UserController userController;

    private User adminUser;
    private User studentUser;
    private User facultyUser;

    @BeforeEach
    void setUp() {
        adminUser = new User();
        adminUser.setId(1L);
        adminUser.setEmail("admin@example.com");
        adminUser.setRole(Role.ADMIN);

        studentUser = new User();
        studentUser.setId(2L);
        studentUser.setEmail("student@example.com");
        studentUser.setRole(Role.STUDENT);

        facultyUser = new User();
        facultyUser.setId(3L);
        facultyUser.setEmail("faculty@example.com");
        facultyUser.setRole(Role.FACULTY);
    }

    @Test
    void getUserById_ShouldReturnUser_WhenExists() {
        when(userService.getUserById(2L)).thenReturn(Optional.of(studentUser));

        ResponseEntity<User> response = userController.getUserById(2L);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(studentUser, response.getBody());
    }

    @Test
    void getUserById_ShouldReturnNotFound_WhenNotExists() {
        when(userService.getUserById(99L)).thenReturn(Optional.empty());

        ResponseEntity<User> response = userController.getUserById(99L);

        assertEquals(404, response.getStatusCodeValue());
    }

    @Test
    void getAllUsers_ShouldReturnNonAdminUsers() {
        when(userService.getAllUsers()).thenReturn(Arrays.asList(adminUser, studentUser, facultyUser));

        ResponseEntity<List<User>> response = userController.getAllUsers();

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(2, response.getBody().size());
        assertFalse(response.getBody().contains(adminUser));
        assertTrue(response.getBody().contains(studentUser));
        assertTrue(response.getBody().contains(facultyUser));
    }

    @Test
    void getAllUsers_ShouldReturnEmptyList_WhenOnlyAdminExists() {
        when(userService.getAllUsers()).thenReturn(Collections.singletonList(adminUser));

        ResponseEntity<List<User>> response = userController.getAllUsers();

        assertEquals(200, response.getStatusCodeValue());
        assertTrue(response.getBody().isEmpty());
    }

    @Test
    void getUsersByRoles_ShouldReturnFilteredUsers() {
        List<String> roles = Arrays.asList("STUDENT", "FACULTY");
        when(userService.getUsersByRoles(roles)).thenReturn(Arrays.asList(studentUser, facultyUser));

        ResponseEntity<List<User>> response = userController.getUsersByRoles(roles);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(2, response.getBody().size());
        assertTrue(response.getBody().contains(studentUser));
        assertTrue(response.getBody().contains(facultyUser));
    }

    @Test
    void getUsersByRoles_ShouldReturnEmptyList_WhenNoMatches() {
        List<String> roles = Collections.singletonList("ADMIN");
        when(userService.getUsersByRoles(roles)).thenReturn(Collections.singletonList(adminUser));

        ResponseEntity<List<User>> response = userController.getUsersByRoles(roles);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(1, response.getBody().size());
        assertEquals(adminUser, response.getBody().get(0));
    }
}