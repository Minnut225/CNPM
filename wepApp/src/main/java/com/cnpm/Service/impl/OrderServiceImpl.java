package com.cnpm.Service.impl;

import com.cnpm.Service.OrderService;
import com.cnpm.Entity.Order;
import com.cnpm.Repository.OrderRepo;
import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class OrderServiceImpl implements OrderService{
    private final OrderRepo orderRepo;

    public OrderServiceImpl(OrderRepo orderRepo){
        this.orderRepo = orderRepo;
    }

    @Override
    public Order getOrderById(int id){
        if (orderRepo.findById(id).isEmpty()){
            throw new RuntimeException("Order not found");
        }
        return orderRepo.findById(id).get();
    }

    @Override
    public Order saveOrder(Order order){
        return orderRepo.save(order);
    }

    @Override
    public void deleteById(int id) {
        orderRepo.deleteById(id);
    }
}
