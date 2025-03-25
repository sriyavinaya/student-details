// package com.example.backend.security;

// import com.example.backend.model.User;
// import com.example.backend.repository.UserRepository;
// import jakarta.servlet.http.HttpServletRequest;
// import jakarta.servlet.http.HttpServletResponse;
// import jakarta.servlet.http.HttpSession;
// import org.springframework.security.core.Authentication;
// import org.springframework.security.oauth2.core.user.OAuth2User;
// import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
// import org.springframework.stereotype.Component;

// import java.io.IOException;
// import java.util.Map;

// @Component
// public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

//     private final UserRepository userRepository;

//     // Constructor to inject the UserRepository
//     public OAuth2LoginSuccessHandler(UserRepository userRepository) {
//         this.userRepository = userRepository;
//     }

//     @Override
//     public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
//             Authentication authentication) throws IOException {
//         // Retrieve the OAuth2 user details
//         OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();
//         Map<String, Object> attributes = oauthUser.getAttributes();
//         String email = (String) attributes.get("email"); // Get email from OAuth2 attributes

//         // Check if the user exists in the database using the email
//         User existingUser = userRepository.findByEmail(email).orElse(null);

//         HttpSession session = request.getSession(); // Get the HTTP session
//         if (existingUser != null) {
//             // If user exists, store the user in the session
//             session.setAttribute("user", existingUser);
//             response.sendRedirect("http://localhost:5173/login"); // Redirect to login page
//         } else {
//             // If user doesn't exist, deny access
//             response.sendRedirect("http://localhost:5173/not-found"); // Redirect to access denied page
//         }
//     }
// }