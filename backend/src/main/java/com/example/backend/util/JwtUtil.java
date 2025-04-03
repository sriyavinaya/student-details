// package com.example.backend.util;

// import com.example.backend.config.JwtConfig;
// import io.jsonwebtoken.Claims;
// import io.jsonwebtoken.Jwts;
// import io.jsonwebtoken.SignatureAlgorithm;
// import io.jsonwebtoken.io.Decoders;
// import io.jsonwebtoken.security.Keys;
// import org.springframework.stereotype.Component;

// import javax.crypto.SecretKey;
// import java.util.Date;

// @Component
// public class JwtUtil {

//     private final JwtConfig jwtConfig;

//     public JwtUtil(JwtConfig jwtConfig) {
//         this.jwtConfig = jwtConfig;
//     }

//     // ✅ Convert secret key to bytes and create a signing key
//     private SecretKey getSigningKey() {
//         byte[] keyBytes = Decoders.BASE64.decode(jwtConfig.getSecret());
//         return Keys.hmacShaKeyFor(keyBytes);
//     }

//     // ✅ Generate JWT Token with Role
//     public String generateToken(String email, String role) {
//         return Jwts.builder()
//                 .setSubject(email)
//                 .claim("role", role) // ✅ Store role in JWT
//                 .setIssuedAt(new Date())
//                 .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60)) // 1 hour expiration
//                 .signWith(getSigningKey(), SignatureAlgorithm.HS256) // ✅ Uses `getSigningKey()`
//                 .compact();
//     }

//     // ✅ Validate JWT Token
//     public boolean validateToken(String token) {
//         try {
//             ((Object) Jwts.builder())
//                 .setSigningKey(getSigningKey()) // ✅ Uses `getSigningKey()`
//                 .build()
//                 .parseClaimsJws(token);
//             return true;
//         } catch (Exception e) {
//             return false;
//         }
//     }

//     // ✅ Extract email from JWT
//     public String getEmailFromToken(String token) {
//         return Jwts.builder()
//                 .setSigningKey(getSigningKey()) // ✅ Uses `getSigningKey()`
//                 .build()
//                 .parseClaimsJws(token)
//                 .getBody()
//                 .getSubject();
//     }

//     // ✅ Extract role from JWT
//     public String extractRole(String token) {
//         return Jwts.builder()
//                 .setSigningKey(getSigningKey()) // ✅ Uses `getSigningKey()`
//                 .build()
//                 .parseClaimsJws(token)
//                 .getBody()
//                 .get("role", String.class);
//     }
// }