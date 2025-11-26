package com.cnpm.Repository;

import com.cnpm.Entity.Drone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DroneRepo extends JpaRepository<Drone, Integer> {

    List<Drone> findByStatus(String status);
}
