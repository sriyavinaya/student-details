package com.example.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.backend.dto.DropdownDTO;
import com.example.backend.model.DropdownModel;
import com.example.backend.service.DropdownService;

@RestController
@RequestMapping("/api/dropdown")
@CrossOrigin(origins = "http://localhost:5173")
public class DropdownController {

    @Autowired
    private DropdownService dropdownService;

    // Add a dropdown option (Request body)
    @PostMapping("/add")
    public ResponseEntity<?> addDropdownOption(@RequestBody DropdownDTO dropdownDTO) {
        try {
            DropdownModel createdOption = dropdownService.addDropdownOption(dropdownDTO);
            return ResponseEntity.ok(createdOption);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error adding dropdown option: " + e.getMessage());
        }
    }

    // Delete a dropdown option (ID in params)
    @DeleteMapping("/delete")
public ResponseEntity<?> deleteDropdownOption(@RequestParam Long id) {
    try {
        dropdownService.deleteDropdownOption(id);
        return ResponseEntity.ok("Dropdown option deleted successfully.");
    } catch (RuntimeException e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error deleting dropdown option: " + e.getMessage());
    }
}

@GetMapping("/fetch")
public ResponseEntity<?> getDropdownOptions(
        @RequestParam String category, 
        @RequestParam String dropdownName) {
    try {
        List<DropdownModel> dropdownOptions = dropdownService.getDropdownOptions(category, dropdownName);
        return ResponseEntity.ok(dropdownOptions);
    } catch (RuntimeException e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error fetching dropdown options: " + e.getMessage());
    }
}
}
