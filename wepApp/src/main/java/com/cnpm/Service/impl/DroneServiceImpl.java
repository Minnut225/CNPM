package com.cnpm.Service.impl;

import com.cnpm.Service.DroneService;
import com.cnpm.Entity.Drone;
import com.cnpm.Repository.DroneRepo;

import java.util.List;

import org.springframework.stereotype.Service;


@Service
public class DroneServiceImpl implements DroneService {
    private final DroneRepo droneRepo;

    public DroneServiceImpl(DroneRepo droneRepo) {
        this.droneRepo = droneRepo;
    }

    @Override
    public List<Drone> getAllDrones() {
        return droneRepo.findAll();
    }

    @Override
    public Drone getDroneById(int id) {
        return droneRepo.findById(id).orElse(null);
    }

    @Override
    public Drone saveDrone(Drone drone) {
        return droneRepo.save(drone);
    }

    @Override
    public void deleteDroneById(int id) {
        droneRepo.deleteById(id);
    }

    @Override
    public List<Drone> getDroneByStatus(String status) {
        return droneRepo.findByStatus(status);
    }

    @Override
    public Drone updateDroneLocation(int id, Double newLatitude, Double newLongitude) {
        Drone drone = droneRepo.findById(id).orElse(null);
        if (drone != null) {
            drone.setLatitude(newLatitude);
            drone.setLongitude(newLongitude);
            droneRepo.save(drone);
        }
        return drone;
    }
}
