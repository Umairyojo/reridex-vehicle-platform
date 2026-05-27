package com.ReRideX.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.BatchSize;

import java.util.List;

@Entity
@Table(name = "bikes")
@Data
@NoArgsConstructor
public class Bike {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String category;
    private String brand;
    private String location;

    // Custom Label (e.g., "NEW", "HIGH DISCOUNT")
    private String tag;

    @Column(name = "bike_status")
    private String status = "UNRESERVED";

    private String price;
    private String originalPrice;
    private String emi;

    private String kms;
    private String owners;
    private String makeYear;
    private String vehicleNo;
    private String regYear;

    // ⚡ FIX: Changed from default LAZY to EAGER fetch.
    // Without this, GET /api/bikes causes N+1 queries:
    //   1 query to get all bikes + 1 query PER bike to get its images.
    // With EAGER + @BatchSize(10), Hibernate fetches images for all bikes
    // in a single IN(...) query instead of one-per-bike.
    @ElementCollection(fetch = FetchType.EAGER)
    @BatchSize(size = 10)
    @CollectionTable(name = "bike_images", joinColumns = @JoinColumn(name = "bike_id"))
    @Column(name = "image_url")
    private List<String> imageUrls;
}
