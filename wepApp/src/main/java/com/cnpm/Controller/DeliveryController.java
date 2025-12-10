package com.cnpm.Controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

import com.cnpm.DTO.DeliveryRequest;
import com.cnpm.Entity.Delivery;

import com.cnpm.Service.DeliveryService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/deliveries")
public class DeliveryController {
    private final DeliveryService deliveryService;

    public DeliveryController(DeliveryService deliveryService) {
        this.deliveryService = deliveryService;
    }

    @GetMapping("")
    public Object getAllDeliveries() {
        return deliveryService.getAllDeliveries();
    }

    @GetMapping("/{id}")
    public Object getDeliveryById(@PathVariable int id) {
        return deliveryService.getDeliveryById(id);
    }

    @PostMapping("")
    @ResponseStatus(HttpStatus.CREATED)
    public void createDelivery(@RequestBody Delivery delivery) {
        deliveryService.saveDelivery(delivery);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void updateDelivery(@RequestBody Delivery delivery, @PathVariable int id) {
        deliveryService.saveDelivery(delivery);
    }

    @PostMapping("/assign")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ResponseEntity<?> assignDelivery(@RequestBody DeliveryRequest request) {
        return ResponseEntity.ok(deliveryService.assignDelivery(request));
    }
}   
