package com.cnpm.Controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;

import com.cnpm.Service.DroneService;
import com.cnpm.Entity.Drone;
import java.util.List;

@RestController
@RequestMapping("api/drone")
@CrossOrigin(origins = "http://localhost:5173")
public class DroneController {
    private final DroneService droneService;

    public DroneController(DroneService droneService) {
        this.droneService = droneService;
    }

    @GetMapping("")
    public List<Drone> getAllDrones() {
        return droneService.getAllDrones();
    }

    @GetMapping("/{id}")
    public Drone getDroneById(@PathVariable int id) {
        return droneService.getDroneById(id);
    }

    @GetMapping("/{status}")
    public List<Drone> getAvailableDrones(@PathVariable String status) {
        return droneService.getDroneByStatus(status);
    }

    @PutMapping("/{id}/location/{newLocation}")
    public Drone updateDroneLocation(@PathVariable int id, @PathVariable String newLocation) {
        return droneService.updateDroneLocation(id, newLocation);
    }

}
