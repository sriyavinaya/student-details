package com.example.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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
    public ResponseEntity<DropdownModel> addDropdownOption(@RequestBody DropdownDTO dropdownDTO) {
        DropdownModel createdOption = dropdownService.addDropdownOption(dropdownDTO);
        return ResponseEntity.ok(createdOption);
    }

    // Delete a dropdown option (ID in params)
    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteDropdownOption(@RequestParam Long id) {
        dropdownService.deleteDropdownOption(id);
        return ResponseEntity.ok("Dropdown option deleted successfully.");
    }

    // Fetch dropdown options by category and dropdownName (Use request params)
    @GetMapping("/fetch")
    public ResponseEntity<List<DropdownModel>> getDropdownOptions(
            @RequestParam String category, 
            @RequestParam String dropdownName) {
        List<DropdownModel> dropdownOptions = dropdownService.getDropdownOptions(category, dropdownName);
        return ResponseEntity.ok(dropdownOptions);
    }
}
