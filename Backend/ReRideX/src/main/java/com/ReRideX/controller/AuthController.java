package com.ReRideX.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Random;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private JavaMailSender mailSender;

    // 🔥 SECURITY WALL 2: Pulling credentials from application.properties securely
    @Value("${admin.email}")
    private String adminEmail;

    @Value("${admin.password}")
    private String adminPass;

    private String currentOtp = "";

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        if (adminEmail.equalsIgnoreCase(email) && adminPass.equals(password)) {
            currentOtp = String.format("%06d", new Random().nextInt(999999));
            sendEmail(adminEmail, "ReRideX Admin Login OTP", 
                    "Your Secure Login OTP is: " + currentOtp + "\n\nDo not share this with anyone.");
            return ResponseEntity.ok(Map.of("message", "Credentials verified. OTP Sent."));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid Admin ID or Password"));
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> request) {
        String userOtp = request.get("otp");

        if (currentOtp.equals(userOtp) && !currentOtp.isEmpty()) {
            currentOtp = ""; 
            return ResponseEntity.ok(Map.of("message", "Authentication Successful!"));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid or Expired OTP"));
        }
    }
    
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");

        if (adminEmail.equalsIgnoreCase(email)) {
            sendEmail(adminEmail, "ReRideX Password Recovery", 
                    "You requested a password reminder.\n\nYour Admin Password is: " + adminPass + "\n\nPlease keep this secure!");
            return ResponseEntity.ok(Map.of("message", "Recovery email sent."));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Unregistered Admin Email"));
        }
    }

    private void sendEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        message.setFrom("reridex1@gmail.com");
        mailSender.send(message);
    }
}