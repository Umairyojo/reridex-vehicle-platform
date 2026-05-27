package com.ReRideX.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;

@Entity
@Table(name = "buyer_leads")
@Data
public class BuyerLead {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String mobile;
    private String segment;
    private String budget;

    private LocalDateTime createdAt = LocalDateTime.now();

    // The ID received from React
    @Column(name = "bike_id")
    private Long bikeId;

    // 🔥 THE FIX: Safely handles bike deletions without crashing
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "bike_id", insertable = false, updatable = false)
    @OnDelete(action = OnDeleteAction.SET_NULL)
    private Bike bike;
}