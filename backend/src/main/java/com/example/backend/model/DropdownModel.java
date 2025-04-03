package com.example.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "dropdown_options")
public class DropdownModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String category; // e.g., "Cultural Event Form"
    private String dropdownName; // e.g., "Awards"
    private String optionValue; // e.g., "Best Performer"

    // Constructors
    public DropdownModel() {}

    public DropdownModel(String category, String dropdownName, String optionValue) {
        this.category = category;
        this.dropdownName = dropdownName;
        this.optionValue = optionValue;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDropdownName() {
        return dropdownName;
    }

    public void setDropdownName(String dropdownName) {
        this.dropdownName = dropdownName;
    }

    public String getOptionValue() {
        return optionValue;
    }

    public void setOptionValue(String optionValue) {
        this.optionValue = optionValue;
    }
}