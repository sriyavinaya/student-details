package com.example.backend.service;

import com.example.backend.model.forms.TechnicalEvent;
import com.example.backend.repository.TechnicalEventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TechnicalEventService {

    @Autowired
    private TechnicalEventRepository technicalEventRepository;

    public TechnicalEvent saveTechnicalEvent(TechnicalEvent technicalEvent) {
        return technicalEventRepository.save(technicalEvent);
    }
}