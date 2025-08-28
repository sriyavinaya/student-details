package com.example.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.dto.DropdownDTO;
import com.example.backend.model.DropdownModel;
import com.example.backend.repository.DropdownRepository;

import java.util.List;

@Service
public class DropdownService {

    @Autowired
    private DropdownRepository dropdownRepository;

    // Add a new dropdown option
    public DropdownModel addDropdownOption(DropdownDTO dropdownDTO) {
        DropdownModel newOption = new DropdownModel(
                dropdownDTO.getCategory(), 
                dropdownDTO.getDropdownName(), 
                dropdownDTO.getOptionValue()
        );
        return dropdownRepository.save(newOption);
    }

    // Delete a dropdown option by ID
    public void deleteDropdownOption(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("ID cannot be null");
        }
        dropdownRepository.deleteById(id);
    }

    // Fetch dropdown options by category and dropdownName
    public List<DropdownModel> getDropdownOptions(String category, String dropdownName) {
        if (category == null) {
            throw new IllegalArgumentException("Category cannot be null");
        }
        if (dropdownName == null) {
            throw new IllegalArgumentException("Dropdown name cannot be null");
        }
        return dropdownRepository.findByCategoryAndDropdownName(category, dropdownName);
    }
}