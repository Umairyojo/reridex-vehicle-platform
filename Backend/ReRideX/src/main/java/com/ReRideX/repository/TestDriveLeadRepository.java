package com.ReRideX.repository;

import com.ReRideX.model.TestDriveLead;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TestDriveLeadRepository extends JpaRepository<TestDriveLead, Long> {
}
