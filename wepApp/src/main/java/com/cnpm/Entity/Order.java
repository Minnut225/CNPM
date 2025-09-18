package com.cnpm.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "Orders") // tên Table trong database
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private int userId;
    private String orderDate;
    private double totalPrice;
    private String payment;
    private String shipping_address;

    //Constructors
    public Order() {}

    public Order(int id, int userId, String orderDate, double totalPrice, String payment, String shipping_address) {
        this.id = id;
        this.userId = userId;
        this.orderDate = orderDate;
        this.totalPrice = totalPrice;
        this.payment = payment;
        this.shipping_address = shipping_address;
    }

    //Getters and Setters
    public int getId(){
        return id;
    }

    public void setId(int id){
        this.id = id;
    }

    public int getUserId(){
        return userId;
    }

    public void setUserId(int userId){
        this.userId = userId;
    }

    public String getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(String orderDate) {
        this.orderDate = orderDate;
    }

    public double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public String getPayment() {
        return payment;
    }

    public void setPayment(String payment) {
        this.payment = payment;
    }

    public String getShipping_address() {
        return shipping_address;
    }

    public void setShipping_address(String shipping_address) {
        this.shipping_address = shipping_address;
    }
}
