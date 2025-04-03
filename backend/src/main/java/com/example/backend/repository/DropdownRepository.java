package com.example.backend.repository;

import com.example.backend.model.DropdownModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DropdownRepository extends JpaRepository<DropdownModel, Long> {
    List<DropdownModel> findByCategoryAndDropdownName(String category, String dropdownName);
}