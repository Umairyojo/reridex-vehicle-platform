package com.ReRideX.repository;

import com.ReRideX.model.ValuationLead;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ValuationLeadRepository extends JpaRepository<ValuationLead, Long> {
}