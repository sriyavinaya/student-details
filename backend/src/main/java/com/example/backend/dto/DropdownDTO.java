package com.example.backend.dto;

public class DropdownDTO {
    private String category;
    private String dropdownName;
    private String optionValue;

    // Constructors
    public DropdownDTO() {}

    public DropdownDTO(String category, String dropdownName, String optionValue) {
        this.category = category;
        this.dropdownName = dropdownName;
        this.optionValue = optionValue;
    }

    // Getters and Setters
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