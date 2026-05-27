package com.ReRideX.repository;

import com.ReRideX.model.Bike;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BikeRepository extends JpaRepository<Bike, Long> {
    
    // Keeps your existing status search working
    List<Bike> findByStatus(String status);

    // 🔥 NEW: Fetches a specific page of bikes filtered by category!
    Page<Bike> findByCategoryIgnoreCase(String category, Pageable pageable);
}