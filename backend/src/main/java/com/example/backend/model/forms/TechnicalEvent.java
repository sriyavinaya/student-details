package com.example.backend.model.forms;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "technical_events") 
public class TechnicalEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;          // Event Name
    private String date;          // Event Date
    private String host;          // Host of the Event
    private String category;      // Event Category
    private String achievement;   // Achievement (optional)
    private String description;   // Event Description
    private String status;        // Event Status (Pending, Ongoing, Completed)
    private String proofDocumentLink; // Link to the proof document

    // Constructors, Getters, Setters, and toString
    public TechnicalEvent() {
    }

    public TechnicalEvent(Long id, String name, String date, String host, String category, String achievement, String description, String status, String proofDocumentLink) {
        this.id = id;
        this.name = name;
        this.date = date;
        this.host = host;
        this.category = category;
        this.achievement = achievement;
        this.description = description;
        this.status = status;
        this.proofDocumentLink = proofDocumentLink;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getHost() {
        return host;
    }

    public void setHost(String host) {
        this.host = host;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getAchievement() {
        return achievement;
    }

    public void setAchievement(String achievement) {
        this.achievement = achievement;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getProofDocumentLink() {
        return proofDocumentLink;
    }

    public void setProofDocumentLink(String proofDocumentLink) {
        this.proofDocumentLink = proofDocumentLink;
    }

    @Override
    public String toString() {
        return "TechnicalEvent [name=" + name + ", date=" + date + ", host=" + host + ", category=" + category
                + ", achievement=" + achievement + ", description=" + description + ", status=" + status
                + ", proofDocumentLink=" + proofDocumentLink + "]";
    }
}