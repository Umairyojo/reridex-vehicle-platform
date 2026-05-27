package com.ReRideX.repository;

import com.ReRideX.model.BuyerLead;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BuyerLeadRepository extends JpaRepository<BuyerLead, Long> {
}