package com.cnpm.Service;

import com.cnpm.Entity.Order;

import java.util.List;

import org.springframework.stereotype.Service;

@Service
public interface OrderService {

    Order getOrderById(int id);

    Order saveOrder(Order order);

    void deleteById(int id);
    
}
