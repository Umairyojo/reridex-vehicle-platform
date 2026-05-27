package com.ReRideX.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.ReRideX.model.Location;



public interface LocationRepository extends JpaRepository<Location, Long> {
	
	
}