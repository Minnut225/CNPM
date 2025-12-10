package com.cnpm.Service.impl;

import org.aspectj.weaver.ast.Or;
import org.springframework.stereotype.Service;
import com.cnpm.Entity.Delivery;
import com.cnpm.Repository.DeliveryRepo;
import com.cnpm.Service.DeliveryService;
import com.cnpm.DTO.DeliveryRequest;
import com.cnpm.Repository.DroneRepo;
import com.cnpm.Repository.OrderRepo;
import com.cnpm.Entity.Drone;
import com.cnpm.Entity.Order;


import java.util.List;

@Service
public class DeliveryServiceImpl implements DeliveryService {
    private final DeliveryRepo deliveryRepo;
    private final DroneRepo droneRepo;
    private final OrderRepo orderRepo;

    public DeliveryServiceImpl(DeliveryRepo deliveryRepo, DroneRepo droneRepo, OrderRepo orderRepo) {
        this.deliveryRepo = deliveryRepo;
        this.droneRepo = droneRepo;
        this.orderRepo = orderRepo;
    }

    @Override
    public List<Delivery> getAllDeliveries() {
        return deliveryRepo.findAll();
    }

    @Override
    public Delivery getDeliveryById(int id) {
        return deliveryRepo.findById(id).orElse(null);
    }

    @Override
    public Delivery saveDelivery(Delivery delivery) {
        return deliveryRepo.save(delivery);
    }

    @Override
    public void deleteDeliveryById(int id) {
        deliveryRepo.deleteById(id);
    }

    @Override
    public DeliveryRequest assignDelivery(DeliveryRequest deliveryRequest) {
        Order order = orderRepo.findById(deliveryRequest.getOrderId()).orElse(null);
        Drone drone = droneRepo.findById(deliveryRequest.getDroneId()).orElse(null);

        if (order == null || drone == null) {
            return null;
        }

        Delivery delivery = new Delivery();
        delivery.setOrder(order);
        delivery.setDrone(drone);
        delivery.setDeliveryStatus(deliveryRequest.getDeliveryStatus());
        //delivery = deliveryRepo.save(delivery);

        order.setStatus("Completed");
        orderRepo.save(order);

        return deliveryRequest;
    }
}
