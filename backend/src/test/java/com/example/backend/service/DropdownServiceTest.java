package com.example.backend.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.backend.dto.DropdownDTO;
import com.example.backend.model.DropdownModel;
import com.example.backend.repository.DropdownRepository;

@ExtendWith(MockitoExtension.class)
class DropdownServiceTest {

    @Mock
    private DropdownRepository dropdownRepository;

    @InjectMocks
    private DropdownService dropdownService;

    private DropdownDTO dropdownDTO;
    private DropdownModel dropdownModel;
    private final Long testId = 1L;

    @BeforeEach
    void setUp() {
        dropdownDTO = new DropdownDTO();
        dropdownDTO.setCategory("testCategory");
        dropdownDTO.setDropdownName("testDropdown");
        dropdownDTO.setOptionValue("testOption");

        dropdownModel = new DropdownModel();
        dropdownModel.setId(testId);
        dropdownModel.setCategory("testCategory");
        dropdownModel.setDropdownName("testDropdown");
        dropdownModel.setOptionValue("testOption");
    }

    @Test
    void addDropdownOption_ShouldReturnSavedOption() {
        // Arrange
        when(dropdownRepository.save(any(DropdownModel.class))).thenReturn(dropdownModel);

        // Act
        DropdownModel result = dropdownService.addDropdownOption(dropdownDTO);

        // Assert
        assertNotNull(result);
        assertEquals(testId, result.getId());
        assertEquals(dropdownDTO.getCategory(), result.getCategory());
        assertEquals(dropdownDTO.getDropdownName(), result.getDropdownName());
        assertEquals(dropdownDTO.getOptionValue(), result.getOptionValue());
        
        verify(dropdownRepository, times(1)).save(any(DropdownModel.class));
    }

    @Test
    void deleteDropdownOption_ShouldCallRepositoryDelete() {
        // Arrange - no need to mock anything since method is void
        
        // Act
        dropdownService.deleteDropdownOption(testId);

        // Assert
        verify(dropdownRepository, times(1)).deleteById(testId);
    }

    @Test
    void getDropdownOptions_ShouldReturnOptionsForCategoryAndName() {
        // Arrange
        List<DropdownModel> expectedOptions = Arrays.asList(
            dropdownModel,
            new DropdownModel("testCategory", "testDropdown", "option2")
        );
        
        when(dropdownRepository.findByCategoryAndDropdownName("testCategory", "testDropdown"))
            .thenReturn(expectedOptions);

        // Act
        List<DropdownModel> result = dropdownService.getDropdownOptions("testCategory", "testDropdown");

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(expectedOptions, result);
        
        verify(dropdownRepository, times(1))
            .findByCategoryAndDropdownName("testCategory", "testDropdown");
    }

    @Test
    void getDropdownOptions_ShouldReturnEmptyListWhenNoOptionsFound() {
        // Arrange
        when(dropdownRepository.findByCategoryAndDropdownName("nonexistent", "dropdown"))
            .thenReturn(List.of());

        // Act
        List<DropdownModel> result = dropdownService.getDropdownOptions("nonexistent", "dropdown");

        // Assert
        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    void addDropdownOption_ShouldHandleNullInputGracefully() {
        // Act & Assert
        assertThrows(NullPointerException.class, () -> {
            dropdownService.addDropdownOption(null);
        });
    }

    @Test
    void deleteDropdownOption_ShouldHandleNullIdGracefully() {
        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> {
            dropdownService.deleteDropdownOption(null);
        });
    }

    @Test
    void getDropdownOptions_ShouldHandleNullParametersGracefully() {
        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> {
            dropdownService.getDropdownOptions(null, "test");
        });

        assertThrows(IllegalArgumentException.class, () -> {
            dropdownService.getDropdownOptions("test", null);
        });

        assertThrows(IllegalArgumentException.class, () -> {
            dropdownService.getDropdownOptions(null, null);
        });
    }
}