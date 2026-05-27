package com.ReRideX.model;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "valuation_leads")
@Data
public class ValuationLead {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Matches your Frontend exactly!
    private String fullName;
    private String mobileNumber;
    private String vehicleNo;
    private String brand;
    private String model;
    private String kmDriven;
    private String noOfOwners;

    private LocalDateTime requestedAt = LocalDateTime.now();
}