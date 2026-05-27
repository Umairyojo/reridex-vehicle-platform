package com.ReRideX.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;

@Entity
@Table(name = "test_drive_leads")
@Data
public class TestDriveLead {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String mobile;
    private String area;
    private String pincode;
    private String city;
    private String timeSlot;
    
    private String bikeName;
    private String paymentStatus;
    private String vehicleNo;

    @Column(name = "booked_at")
    private LocalDateTime bookedAt = LocalDateTime.now();

    // The ID received from React
    @Column(name = "bike_id")
    private Long bikeId;

    // 🔥 THE FIX: Links the bike, but allows deletion by setting bike_id to NULL safely
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "bike_id", insertable = false, updatable = false)
    @OnDelete(action = OnDeleteAction.SET_NULL)
    private Bike bike;
}