package com.ReRideX;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.scheduling.annotation.EnableAsync;

// ⚡ @EnableAsync activates background thread execution for @Async methods.
// This makes Google Sheets writes non-blocking — lead forms respond instantly
// instead of waiting for Google's API to confirm the write.
@SpringBootApplication
@EnableAsync
@EnableCaching // 🔥 NEW: Turns on the Spring Boot Caching Engine!
public class ReRideXApplication {
    public static void main(String[] args) {
        SpringApplication.run(ReRideXApplication.class, args);
    }
}