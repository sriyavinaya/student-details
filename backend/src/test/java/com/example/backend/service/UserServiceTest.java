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

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    private User adminUser;
    private User regularUser;
    private User anotherUser;

    @BeforeEach
    void setUp() {
        adminUser = new User();
        adminUser.setId(1L);
        adminUser.setEmail("admin@example.com");
        adminUser.setRole(Role.ADMIN);

        regularUser = new User();
        regularUser.setId(2L);
        regularUser.setEmail("user@example.com");
        regularUser.setRole(Role.STUDENT);

        anotherUser = new User();
        anotherUser.setId(3L);
        anotherUser.setEmail("another@example.com");
        anotherUser.setRole(Role.FACULTY);
    }

    @Test
    void getUserByEmail_ShouldReturnUser_WhenExists() {
        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(regularUser));

        Optional<User> result = userService.getUserByEmail("user@example.com");

        assertTrue(result.isPresent());
        assertEquals(regularUser, result.get());
        verify(userRepository).findByEmail("user@example.com");
    }

    @Test
    void getUserByEmail_ShouldReturnEmpty_WhenNotExists() {
        when(userRepository.findByEmail("nonexistent@example.com")).thenReturn(Optional.empty());

        Optional<User> result = userService.getUserByEmail("nonexistent@example.com");

        assertFalse(result.isPresent());
        verify(userRepository).findByEmail("nonexistent@example.com");
    }

    @Test
    void getUserRoleByEmail_ShouldReturnRole_WhenUserExists() {
        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(regularUser));

        Role result = userService.getUserRoleByEmail("user@example.com");

        assertEquals(Role.STUDENT, result);
    }

    @Test
    void getUserRoleByEmail_ShouldReturnNull_WhenUserNotExists() {
        when(userRepository.findByEmail("nonexistent@example.com")).thenReturn(Optional.empty());

        Role result = userService.getUserRoleByEmail("nonexistent@example.com");

        assertNull(result);
    }

    @Test
    void authenticate_ShouldReturnUser_WhenCredentialsMatch() {
        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(regularUser));

        Optional<User> result = userService.authenticate("user@example.com", "password");

        assertTrue(result.isPresent());
        assertEquals(regularUser, result.get());
    }

    @Test
    void authenticate_ShouldReturnEmpty_WhenUserNotExists() {
        when(userRepository.findByEmail("nonexistent@example.com")).thenReturn(Optional.empty());

        Optional<User> result = userService.authenticate("nonexistent@example.com", "password");

        assertFalse(result.isPresent());
    }

    @Test
    void getAllUsers_ShouldReturnAllUsers() {
        when(userRepository.findAll()).thenReturn(Arrays.asList(adminUser, regularUser, anotherUser));

        List<User> result = userService.getAllUsers();

        assertEquals(3, result.size());
        verify(userRepository).findAll();
    }

    @Test
    void getUserById_ShouldReturnUser_WhenExists() {
        when(userRepository.findById(2L)).thenReturn(Optional.of(regularUser));

        Optional<User> result = userService.getUserById(2L);

        assertTrue(result.isPresent());
        assertEquals(regularUser, result.get());
    }

    @Test
    void getUserById_ShouldReturnEmpty_WhenNotExists() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        Optional<User> result = userService.getUserById(99L);

        assertFalse(result.isPresent());
    }

    @Test
    void getUsersByRoles_ShouldReturnFilteredUsers() {
        List<String> roles = Arrays.asList("STUDENT", "FACULTY");
        when(userRepository.findByRoleIn(roles)).thenReturn(Arrays.asList(regularUser, anotherUser));

        List<User> result = userService.getUsersByRoles(roles);

        assertEquals(2, result.size());
        assertTrue(result.contains(regularUser));
        assertTrue(result.contains(anotherUser));
        verify(userRepository).findByRoleIn(roles);
    }

    @Test
    void getUsersByRoles_ShouldReturnEmptyList_WhenNoMatches() {
        List<String> roles = Collections.singletonList("ADMIN");
        when(userRepository.findByRoleIn(roles)).thenReturn(Collections.singletonList(adminUser));

        List<User> result = userService.getUsersByRoles(roles);

        assertEquals(1, result.size());
        assertEquals(adminUser, result.get(0));
    }
}