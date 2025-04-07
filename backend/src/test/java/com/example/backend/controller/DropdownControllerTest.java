package com.example.backend.controller;

import com.example.backend.dto.DropdownDTO;
import com.example.backend.model.DropdownModel;
import com.example.backend.service.DropdownService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DropdownControllerTest {

    @Mock
    private DropdownService dropdownService;

    @InjectMocks
    private DropdownController dropdownController;

    private DropdownModel dropdownOption1;
    private DropdownModel dropdownOption2;
    private DropdownDTO dropdownDTO;

    @BeforeEach
    void setUp() {
        dropdownOption1 = new DropdownModel();
        dropdownOption1.setId(1L);
        dropdownOption1.setCategory("student");
        dropdownOption1.setDropdownName("program");
        dropdownOption1.setOptionValue("Computer Science");

        dropdownOption2 = new DropdownModel();
        dropdownOption2.setId(2L);
        dropdownOption2.setCategory("student");
        dropdownOption2.setDropdownName("program");
        dropdownOption2.setOptionValue("Electrical Engineering");

        dropdownDTO = new DropdownDTO();
        dropdownDTO.setCategory("student");
        dropdownDTO.setDropdownName("program");
        dropdownDTO.setOptionValue("Computer Science");
    }

    @Test
    void addDropdownOption_ShouldReturnCreatedOption() {
        when(dropdownService.addDropdownOption(any(DropdownDTO.class)))
            .thenReturn(dropdownOption1);

        ResponseEntity<?> response = dropdownController.addDropdownOption(dropdownDTO);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(dropdownOption1, response.getBody());
        verify(dropdownService, times(1)).addDropdownOption(any(DropdownDTO.class));
    }

    @Test
    void addDropdownOption_WhenServiceThrowsException_ShouldReturnInternalServerError() {
        String errorMessage = "Database error";
        when(dropdownService.addDropdownOption(any(DropdownDTO.class)))
            .thenThrow(new RuntimeException(errorMessage));

        ResponseEntity<?> response = dropdownController.addDropdownOption(dropdownDTO);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("Error adding dropdown option: " + errorMessage, response.getBody());
        verify(dropdownService, times(1)).addDropdownOption(any(DropdownDTO.class));
    }

    @Test
    void deleteDropdownOption_ShouldReturnSuccessMessage() {
        Long id = 1L;
        doNothing().when(dropdownService).deleteDropdownOption(id);

        ResponseEntity<?> response = dropdownController.deleteDropdownOption(id);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Dropdown option deleted successfully.", response.getBody());
        verify(dropdownService, times(1)).deleteDropdownOption(id);
    }

    @Test
    void deleteDropdownOption_WhenServiceThrowsException_ShouldReturnInternalServerError() {
        Long id = 1L;
        String errorMessage = "Delete failed";
        doThrow(new RuntimeException(errorMessage)).when(dropdownService).deleteDropdownOption(id);

        ResponseEntity<?> response = dropdownController.deleteDropdownOption(id);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("Error deleting dropdown option: " + errorMessage, response.getBody());
        verify(dropdownService, times(1)).deleteDropdownOption(id);
    }

    @Test
    void getDropdownOptions_ShouldReturnOptionsList() {
        String category = "student";
        String dropdownName = "program";
        List<DropdownModel> options = Arrays.asList(dropdownOption1, dropdownOption2);
        
        when(dropdownService.getDropdownOptions(category, dropdownName))
            .thenReturn(options);

        ResponseEntity<?> response = 
            dropdownController.getDropdownOptions(category, dropdownName);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody() instanceof List);
        List<DropdownModel> responseBody = (List<DropdownModel>) response.getBody();
        assertEquals(2, responseBody.size());
        assertEquals("Computer Science", responseBody.get(0).getOptionValue());
        verify(dropdownService, times(1)).getDropdownOptions(category, dropdownName);
    }

    @Test
    void getDropdownOptions_WhenNoOptionsFound_ShouldReturnEmptyList() {
        String category = "faculty";
        String dropdownName = "department";
        
        when(dropdownService.getDropdownOptions(category, dropdownName))
            .thenReturn(List.of());

        ResponseEntity<?> response = 
            dropdownController.getDropdownOptions(category, dropdownName);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody() instanceof List);
        List<?> responseBody = (List<?>) response.getBody();
        assertTrue(responseBody.isEmpty());
        verify(dropdownService, times(1)).getDropdownOptions(category, dropdownName);
    }

    @Test
    void getDropdownOptions_WhenServiceThrowsException_ShouldReturnInternalServerError() {
        String category = "student";
        String dropdownName = "program";
        String errorMessage = "Fetch failed";
        
        when(dropdownService.getDropdownOptions(category, dropdownName))
            .thenThrow(new RuntimeException(errorMessage));

        ResponseEntity<?> response = 
            dropdownController.getDropdownOptions(category, dropdownName);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("Error fetching dropdown options: " + errorMessage, response.getBody());
        verify(dropdownService, times(1)).getDropdownOptions(category, dropdownName);
    }
}