package com.ReRideX.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "sell_requests")
@Data
public class SellRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String regNo;
    private String city;
    private String brand;
    
    private String model;
    private String kmDriven;
    private String ownership;
    
    private String name;
    private String mobile;

    private String status = "PENDING";
    private LocalDateTime createdAt = LocalDateTime.now();
}