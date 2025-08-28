// package com.example.backend.exception;

// import java.util.stream.Collectors;

// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import org.springframework.validation.FieldError;
// import org.springframework.web.bind.MethodArgumentNotValidException;
// import org.springframework.web.bind.annotation.ControllerAdvice;
// import org.springframework.web.bind.annotation.ExceptionHandler;

// @ControllerAdvice
// public class GlobalExceptionHandler {
    
//     @ExceptionHandler(ResourceNotFoundException.class)
//     public ResponseEntity<ErrorResponse> handleResourceNotFound(ResourceNotFoundException ex) {
//         return ResponseEntity
//             .status(HttpStatus.NOT_FOUND)
//             .body(new ErrorResponse(HttpStatus.NOT_FOUND.value(), ex.getMessage()));
//     }
    
//     @ExceptionHandler(DuplicateResourceException.class)
//     public ResponseEntity<ErrorResponse> handleDuplicateResource(DuplicateResourceException ex) {
//         return ResponseEntity
//             .status(HttpStatus.CONFLICT)
//             .body(new ErrorResponse(HttpStatus.CONFLICT.value(), ex.getMessage()));
//     }
    
//     @ExceptionHandler(MethodArgumentNotValidException.class)
//     public ResponseEntity<ErrorResponse> handleValidationExceptions(
//         MethodArgumentNotValidException ex) {
//         String errorMsg = ex.getBindingResult()
//             .getFieldErrors()
//             .stream()
//             .map(FieldError::getDefaultMessage)
//             .collect(Collectors.joining(", "));
        
//         return ResponseEntity
//             .status(HttpStatus.BAD_REQUEST)
//             .body(new ErrorResponse(HttpStatus.BAD_REQUEST.value(), errorMsg));
//     }
    
//     @ExceptionHandler(Exception.class)
//     public ResponseEntity<ErrorResponse> handleAllExceptions(Exception ex) {
//         return ResponseEntity
//             .status(HttpStatus.INTERNAL_SERVER_ERROR)
//             .body(new ErrorResponse(
//                 HttpStatus.INTERNAL_SERVER_ERROR.value(), 
//                 "An unexpected error occurred"));
//     }
// }
