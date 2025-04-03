package com.example.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.disable())
                .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/api/auth/**",        // Authentication (Google OAuth, Login, Logout)
                    "/api/dashboard/**",   
                    "/api/admin/**",       // Admin operations
                    "/api/technical/**",   // Technical Events (form submission, proof upload, etc.)
                    "/api/technical/all",   // Technical Events (form submission, proof upload, etc.)
                    "/api/technical/submit",   // Technical Events (form submission, proof upload, etc.)
                    "/api/technical/download/**",   // Technical Events (form submission, proof upload, etc.)
                    "/api/events/**",      // General event-related APIs
                    "/api/files/upload",   // File upload (Proof documents, event media, etc.)
                    "/api/users/profile",  // User profile operations
                    "/api/notifications/**", // Notifications API
                    "/api/auth/check-session",
                    "/login/**",
                    "/public/**",
                    "/static/**",
                    "/v3/api-docs/**", "/swagger-ui/**",
                    "/login/oauth2/code/google",
                    "/api/auth/google-login",
                    "/api/users/**",
                    "/api/admin/all-students",
                    "/api/faculty/**",
                    "/api/students/**",
                    "/api/main/**",
                    "/api/sports/**",
                    "/api/clubs/**",
                    "/api/cultural/**",
                    "/api/publications/**",
                    "/api/dropdown/**",
                    "/favicon.ico."
            ).permitAll()
                        .anyRequest().authenticated())
                .csrf(csrf -> csrf.disable());

        return http.build();
    }
}




