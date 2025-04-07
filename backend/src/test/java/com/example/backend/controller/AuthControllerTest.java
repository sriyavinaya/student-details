package com.example.backend.controller;

import com.example.backend.model.User;
import com.example.backend.model.Role;
import com.example.backend.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private UserService userService;

    @Mock
    private HttpSession session;

    @InjectMocks
    private AuthController authController;

    private User activeStudent;
    private User activeFaculty;
    private User inactiveAdmin;
    private Map<String, String> validPayload;

    @BeforeEach
    void setUp() {
        activeStudent = new User();
        activeStudent.setId(1L);
        activeStudent.setEmail("student@example.com");
        activeStudent.setActive(true);
        activeStudent.setRole(Role.STUDENT);

        activeFaculty = new User();
        activeFaculty.setId(2L);
        activeFaculty.setEmail("faculty@example.com");
        activeFaculty.setActive(true);
        activeFaculty.setRole(Role.FACULTY);

        inactiveAdmin = new User();
        inactiveAdmin.setId(3L);
        inactiveAdmin.setEmail("admin@example.com");
        inactiveAdmin.setActive(false);
        inactiveAdmin.setRole(Role.ADMIN);

        validPayload = new HashMap<>();
        validPayload.put("email", "user@example.com");
    }

    @Test
    void googleLogin_ShouldReturnStudentDetails_WhenActiveStudent() {
        when(userService.getUserByEmail("student@example.com")).thenReturn(Optional.of(activeStudent));

        ResponseEntity<?> response = authController.googleLogin(
            Map.of("email", "student@example.com"), 
            session
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
        Map<?, ?> body = (Map<?, ?>) response.getBody();
        assertEquals(Role.STUDENT, body.get("role"));
        verify(session).setAttribute("user", activeStudent);
    }

    @Test
    void googleLogin_ShouldReturnFacultyDetails_WhenActiveFaculty() {
        when(userService.getUserByEmail("faculty@example.com")).thenReturn(Optional.of(activeFaculty));

        ResponseEntity<?> response = authController.googleLogin(
            Map.of("email", "faculty@example.com"), 
            session
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
        Map<?, ?> body = (Map<?, ?>) response.getBody();
        assertEquals(Role.FACULTY, body.get("role"));
    }

    @Test
    void googleLogin_ShouldRejectInactiveAdmin() {
        when(userService.getUserByEmail("admin@example.com")).thenReturn(Optional.of(inactiveAdmin));

        ResponseEntity<?> response = authController.googleLogin(
            Map.of("email", "admin@example.com"), 
            session
        );

        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        verify(session, never()).setAttribute(anyString(), any());
    }

    @Test
    void logout_ShouldInvalidateSession_ForAllUserRoles() {
        // Should work regardless of role
        ResponseEntity<?> response = authController.logout(session);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(session).invalidate();
    }
}