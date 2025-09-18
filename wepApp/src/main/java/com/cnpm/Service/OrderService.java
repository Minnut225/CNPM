package com.cnpm.Service;

import com.cnpm.Entity.Order;

import java.util.List;

import org.springframework.stereotype.Service;

@Service
public interface OrderService {

    List<Order> getAllOrders();

    Order getOrderById(int id);

    Order saveOrder(Order order);

    void deleteOrderById(int id);
    
}
