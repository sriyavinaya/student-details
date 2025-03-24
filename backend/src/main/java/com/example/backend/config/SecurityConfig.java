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
                    "/api/dashboard/**",    // Student operations
                    "/api/faculty/**",     // Faculty operations
                    "/api/admin/**",       // Admin operations
                    "/api/technical/**",   // Technical Events (form submission, proof upload, etc.)
                    "/api/technical/upload",   // Technical Events (form submission, proof upload, etc.)
                    "/api/technical/submit",   // Technical Events (form submission, proof upload, etc.)
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
                    "/admin/**",
                    "/api/auth/users/${userId}"
            ).permitAll()
                        .anyRequest().authenticated())
                .csrf(csrf -> csrf.disable());

        return http.build();
    }
}

// package com.example.backend.config;

// import com.example.backend.service.UserService; // Import UserService
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.security.config.annotation.web.builders.HttpSecurity;
// import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
// import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
// import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
// import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
// import org.springframework.security.oauth2.core.user.OAuth2User;
// import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
// import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;
// import org.springframework.security.web.SecurityFilterChain;
// import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;

// import java.io.IOException;

// import jakarta.servlet.http.HttpServletResponse;

// @Configuration
// public class SecurityConfig {

//     private final UserService userService;

//     // Constructor-based injection (better practice than field injection)
//     public SecurityConfig(UserService userService) {
//         this.userService = userService;
//     }

//     @Bean
//     public SecurityFilterChain securityFilterChain(HttpSecurity http, ClientRegistrationRepository clientRegistrationRepository) throws Exception {
//         http
//             .csrf(csrf -> csrf.disable()) // ✅ Disable CSRF for REST API
//             .cors(cors -> cors.disable())
//             .authorizeHttpRequests(auth -> auth
//                 .requestMatchers(
//                     "/api/auth/google-login",
//                     "/oauth2/**",
//                     "/login/**",
//                     "/public/**",
//                     "/static/**",
//                     "/v3/api-docs/**", "/swagger-ui/**",
//                     "/login/oauth2/code/google",
//                     "/api/auth/verify-token"
//                 ).permitAll()
//                 .requestMatchers("/api/admin/**").hasAuthority("admin")
//                 .requestMatchers("/api/faculty/**").hasAuthority("faculty")
//                 .requestMatchers("/api/dashboard/**").hasAuthority("student")
//                 .requestMatchers("/api/technical/**").hasAnyAuthority("student", "faculty", "admin")
//                 .requestMatchers("/api/events/**").hasAnyAuthority("student", "faculty", "admin")
//                 .requestMatchers("/api/files/upload").hasAnyAuthority("faculty", "admin")
//                 .requestMatchers("/api/users/profile").authenticated()
//                 .requestMatchers("/api/logout/**").authenticated()
//                 .anyRequest().authenticated()
//             )
//             .oauth2Login(oauth2 -> oauth2
//                 .successHandler((request, response, authentication) -> handleSuccessAuthentication(response, authentication))
//                 .failureHandler(new SimpleUrlAuthenticationFailureHandler("http://localhost:5173/login?error"))
//             );

//         return http.build();
//     }

//     // ✅ Handle authentication success
//     private void handleSuccessAuthentication(HttpServletResponse response, org.springframework.security.core.Authentication authentication) throws IOException {
//         OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
//         String email = oauth2User.getAttribute("email");

//         if (email == null) {
//             response.sendRedirect("http://localhost:5173/login?error=email_missing");
//             return;
//         }

//         // Fetch the user's role from the database
//         String role = fetchUserRoleFromDatabase(email);
//         if (role == null) {
//             response.sendRedirect("http://localhost:5173/login?error=unauthorized");
//             return;
//         }

//         // Redirect based on the user's role
//         String redirectUrl = determineRedirectUrlByRole(role);
//         response.sendRedirect(redirectUrl);
//     }

//     // ✅ Fetch user role from the database
//     private String fetchUserRoleFromDatabase(String email) {
//         return userService.getUserRoleByEmail(email);
//     }

//     // ✅ Redirect users based on their role
//     private String determineRedirectUrlByRole(String role) {
//         return switch (role) {
//             case "admin" -> "http://localhost:5173/admin";
//             case "faculty" -> "http://localhost:5173/faculty";
//             case "student" -> "http://localhost:5173/dashboard";
//             default -> "http://localhost:5173/login?error=unauthorized";
//         };
//     }

// }



