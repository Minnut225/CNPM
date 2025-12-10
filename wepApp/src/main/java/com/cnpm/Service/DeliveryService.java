package com.cnpm.Service;

import com.cnpm.DTO.DeliveryRequest;
import com.cnpm.Entity.Delivery;
import java.util.List;

import org.springframework.stereotype.Service;

@Service
public interface DeliveryService {
    List<Delivery> getAllDeliveries();

    Delivery getDeliveryById(int id);

    Delivery saveDelivery(Delivery delivery);

    void deleteDeliveryById(int id);

    DeliveryRequest assignDelivery(DeliveryRequest deliveryRequest);
}
