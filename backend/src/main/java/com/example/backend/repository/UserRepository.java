package com.example.backend.repository;

import com.example.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> { 
    Optional<User> findByEmail(String email); // ✅ Finds user by email

    Optional<User> findById(Long id); 

    List<User> findByRoleIn(List<String> roles);

    


    
}
