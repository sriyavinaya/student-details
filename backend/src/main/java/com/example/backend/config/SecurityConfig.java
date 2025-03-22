// package com.example.backend.config;

// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.security.config.annotation.web.builders.HttpSecurity;
// import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
// import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
// import org.springframework.security.oauth2.core.oidc.user.OidcUser;
// import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
// import org.springframework.security.web.SecurityFilterChain;

// @Configuration
// public class SecurityConfig {

//     @Bean
//     public SecurityFilterChain securityFilterChain(HttpSecurity http, ClientRegistrationRepository clientRegistrationRepository) throws Exception {
//         http
//             .csrf(csrf -> csrf.disable()) // ✅ Disable CSRF for REST API
//             .authorizeHttpRequests(auth -> auth
//                 .requestMatchers(
//                     "/api/auth/google-login",
//                     "/oauth2/**",
//                     "/login/**",
//                     "/public/**",
//                     "/static/**",
//                     "/v3/api-docs/**", "/swagger-ui/**",
//                     "/login/oauth2/code/google"

//                 ).permitAll()
//                 .requestMatchers("/api/admin/**").hasAuthority("ROLE_ADMIN")
//                 .requestMatchers("/api/faculty/**").hasAuthority("ROLE_FACULTY")
//                 .requestMatchers("/api/dashboard/**").hasAuthority("ROLE_STUDENT")
//                 .requestMatchers("/api/technical/**").hasAnyAuthority("ROLE_STUDENT", "ROLE_FACULTY", "ROLE_ADMIN")
//                 .requestMatchers("/api/events/**").hasAnyAuthority("ROLE_STUDENT", "ROLE_FACULTY", "ROLE_ADMIN")
//                 .requestMatchers("/api/files/upload").hasAnyAuthority("ROLE_FACULTY", "ROLE_ADMIN")
//                 .requestMatchers("/api/users/profile").authenticated()
//                 .requestMatchers("/api/logout/**").authenticated()
//                 .anyRequest().authenticated()
//             )
//             .oauth2Login(oauth2 -> oauth2
//             .defaultSuccessUrl("http://localhost:5173/dashboard", true)  // ✅ Redirects to frontend
//             .failureUrl("http://localhost:5173/login?error")  // ✅ Redirect on failure
//             .userInfoEndpoint(userInfo -> userInfo.oidcUserService(new OidcUserService()))
//         );

//         return http.build();
//     }

//     // ✅ Fix: Define `OidcUserService` as a separate bean
//     @Bean
//     public OidcUserService oidcUserService() {
//         OidcUserService delegate = new OidcUserService();
        
//         return new OidcUserService() {
//             @Override
//             public OidcUser loadUser(org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest userRequest) throws OAuth2AuthenticationException {
//                 OidcUser oidcUser = delegate.loadUser(userRequest);
//                 String email = oidcUser.getAttribute("email");

//                 // if (email == null || !email.endsWith("@nitc.ac.in")) {
//                 //     throw new OAuth2AuthenticationException("Only NITC emails are allowed");
//                 // }

//                 return oidcUser;
//             }
//         };
//     }

    // // ✅ Redirect users based on email pattern
    // private String determineRedirectUrl(String email) {
    //     if (email.equals("sriya_b221240cs@nitc.ac.in")) {
    //         return "http://localhost:5173/admin";
    //     } else if (email.matches(".*[bmp]\\d{6}[a-zA-Z]+@nitc\\.ac\\.in")) {
    //         return "http://localhost:5173/dashboard";
    //     } else {
    //         return "http://localhost:5173/faculty";
    //     }
    // }
// }







package com.example.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

// import java.util.List;

@Configuration
public class SecurityConfig {

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Disable CSRF for REST API
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/api/auth/**", 
                    "/api/auth/logout",
                    "/api/dashboard/**",
                    "/api/faculty/**",
                    "/api/admin/**",
                    "/api/technical/**",
                    "/api/events/**",
                    "/api/files/upload",
                    "/api/users/profile",
                    "/api/notifications/**",
                    "/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html",
                    "/api/faculty/**"
                ).permitAll()
                .anyRequest().authenticated()
            );

        return http.build();
    }
}


