package com.example.backend.service;

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
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AdminService adminService;

    private User activeUser;
    private User inactiveUser;

    @BeforeEach
    void setUp() {
        activeUser = new User();
        activeUser.setId(1L);
        activeUser.setActive(true);

        inactiveUser = new User();
        inactiveUser.setId(2L);
        inactiveUser.setActive(false);
    }

    @Test
    void toggleUserStatus_ShouldActivateInactiveUser() {
        when(userRepository.findById(2L)).thenReturn(Optional.of(inactiveUser));
        
        boolean result = adminService.toggleUserStatus(2L);
        
        assertTrue(result);
        assertTrue(inactiveUser.isActive());
        verify(userRepository).save(inactiveUser);
    }

    @Test
    void toggleUserStatus_ShouldDeactivateActiveUser() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(activeUser));
        
        boolean result = adminService.toggleUserStatus(1L);
        
        assertFalse(result);
        assertFalse(activeUser.isActive());
        verify(userRepository).save(activeUser);
    }

    @Test
    void toggleUserStatus_ShouldThrowException_WhenUserNotFound() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());
        
        assertThrows(RuntimeException.class, () -> {
            adminService.toggleUserStatus(99L);
        });
        
        verify(userRepository, never()).save(any());
    }
}