package com.example.backend.service;

import com.example.backend.model.Role;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthenticationServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AuthenticationService authenticationService;

    private User testUser;
    private final String testEmail = "test@example.com";

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setEmail(testEmail);
        testUser.setActive(true);
        testUser.setRole(Role.STUDENT);
    }

    // authenticate() tests
    @Test
    void authenticate_ShouldReturnTrueForValidActiveUser() {
        when(userRepository.findByEmail(testEmail)).thenReturn(Optional.of(testUser));
        
        boolean result = authenticationService.authenticate(testEmail);
        
        assertTrue(result);
        verify(userRepository, times(1)).findByEmail(testEmail);
    }

    @Test
    void authenticate_ShouldReturnFalseForInactiveUser() {
        testUser.setActive(false);
        when(userRepository.findByEmail(testEmail)).thenReturn(Optional.of(testUser));
        
        boolean result = authenticationService.authenticate(testEmail);
        
        assertFalse(result);
    }

    @Test
    void authenticate_ShouldReturnFalseForNonExistentUser() {
        when(userRepository.findByEmail(testEmail)).thenReturn(Optional.empty());
        
        boolean result = authenticationService.authenticate(testEmail);
        
        assertFalse(result);
    }

    @Test
    void authenticate_ShouldThrowExceptionForNullEmail() {
        assertThrows(IllegalArgumentException.class, () -> {
            authenticationService.authenticate(null);
        });
    }

    // registerStudent() tests
    @Test
    void registerStudent_ShouldSuccessfullyRegisterNewStudent() {
        when(userRepository.findByEmail(testEmail)).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        
        String result = authenticationService.registerStudent(testUser);
        
        assertEquals("Student registration successful!", result);
        assertEquals(Role.STUDENT, testUser.getRole());
        assertTrue(testUser.isActive());
        verify(userRepository, times(1)).save(testUser);
    }

    @Test
    void registerStudent_ShouldReturnErrorMessageForExistingEmail() {
        when(userRepository.findByEmail(testEmail)).thenReturn(Optional.of(testUser));
        
        String result = authenticationService.registerStudent(testUser);
        
        assertEquals("Email is already registered", result);
        verify(userRepository, never()).save(any());
    }

    // registerFA() tests
    @Test
    void registerFA_ShouldSuccessfullyRegisterNewFA() {
        testUser.setRole(Role.FACULTY);
        when(userRepository.findByEmail(testEmail)).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        
        String result = authenticationService.registerFA(testUser);
        
        assertEquals("FA registration successful!", result);
        assertEquals(Role.FACULTY, testUser.getRole());
        assertTrue(testUser.isActive());
        verify(userRepository, times(1)).save(testUser);
    }

    @Test
    void registerFA_ShouldReturnErrorMessageForExistingEmail() {
        when(userRepository.findByEmail(testEmail)).thenReturn(Optional.of(testUser));
        
        String result = authenticationService.registerFA(testUser);
        
        assertEquals("Email is already registered", result);
        verify(userRepository, never()).save(any());
    }

    // registerAdmin() tests
    @Test
    void registerAdmin_ShouldSuccessfullyRegisterNewAdmin() {
        testUser.setRole(Role.ADMIN);
        when(userRepository.findByEmail(testEmail)).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        
        String result = authenticationService.registerAdmin(testUser);
        
        assertEquals("Admin registration successful!", result);
        assertEquals(Role.ADMIN, testUser.getRole());
        assertTrue(testUser.isActive());
        verify(userRepository, times(1)).save(testUser);
    }

    @Test
    void registerAdmin_ShouldReturnErrorMessageForExistingEmail() {
        when(userRepository.findByEmail(testEmail)).thenReturn(Optional.of(testUser));
        
        String result = authenticationService.registerAdmin(testUser);
        
        assertEquals("Email is already registered", result);
        verify(userRepository, never()).save(any());
    }

    // deactivateUser() tests
    @Test
    void deactivateUser_ShouldSuccessfullyDeactivateUser() {
        when(userRepository.findByEmail(testEmail)).thenReturn(Optional.of(testUser));
        
        String result = authenticationService.deactivateUser(testEmail);
        
        assertEquals("User deactivated successfully!", result);
        assertFalse(testUser.isActive());
        verify(userRepository, times(1)).save(testUser);
    }

    @Test
    void deactivateUser_ShouldReturnErrorMessageForNonExistentUser() {
        when(userRepository.findByEmail(testEmail)).thenReturn(Optional.empty());
        
        String result = authenticationService.deactivateUser(testEmail);
        
        assertEquals("User not found", result);
        verify(userRepository, never()).save(any());
    }

    @Test
    void deactivateUser_ShouldThrowExceptionForNullEmail() {
        assertThrows(IllegalArgumentException.class, () -> {
            authenticationService.deactivateUser(null);
        });
    }

    // Common null checks for all registration methods
    @Test
    void registerMethods_ShouldThrowExceptionForNullUser() {
        assertThrows(IllegalArgumentException.class, () -> {
            authenticationService.registerStudent(null);
        });
        
        assertThrows(IllegalArgumentException.class, () -> {
            authenticationService.registerFA(null);
        });
        
        assertThrows(IllegalArgumentException.class, () -> {
            authenticationService.registerAdmin(null);
        });
    }
}