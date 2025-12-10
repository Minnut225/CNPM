package com.cnpm.Service;

import com.cnpm.Entity.Drone;
import java.util.List;

import org.springframework.stereotype.Service;

@Service
public interface DroneService {

    List<Drone> getAllDrones();

    Drone getDroneById(int id);

    Drone saveDrone(Drone drone);

    void deleteDroneById(int id);

    List<Drone> getDroneByStatus(String status);

    Drone updateDroneLocation(int id, Double newLatitude, Double newLongitude);
}
