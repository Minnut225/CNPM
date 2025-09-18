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

import com.cnpm.Service.OrderService;
import com.cnpm.Entity.Order;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping("")
    List<Order> findAll() {
        return orderService.getAllOrders();
    }

    @GetMapping("/{id}")
    ResponseEntity<Order> findById(@PathVariable int id) {

        Order order = orderService.getOrderById(id);
        if (order == null) {
            throw new RuntimeException("Order not found");
        }
        return ResponseEntity.ok(order);
    }

    // POST
    @PostMapping("")
    @ResponseStatus(HttpStatus.CREATED)
    void create(@RequestBody Order order) {
        orderService.saveOrder(order);
    }

    // PUT 
    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    void update(@RequestBody Order order, @PathVariable int id) {
        orderService.saveOrder(order);
    }

    // DELETE
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/{id}")
    void delete(@PathVariable int id) {
        orderService.deleteOrderById(id);
    }
}
