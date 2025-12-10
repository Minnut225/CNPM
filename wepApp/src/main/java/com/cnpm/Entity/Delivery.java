package com.cnpm.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "Deliveries") // tên Table trong database
public class Delivery {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "deliveryId")
    private int deliveryId;

    @OneToOne
    @JoinColumn(name = "orderId")
    @JsonIgnoreProperties({"delivery", "orderItems", "user"})
    private Order order;

    @ManyToOne 
    @JoinColumn(name = "droneId")
    @JsonIgnoreProperties("deliveries")
    private Drone drone;

    @Column(name = "deliveryStatus")
    private String deliveryStatus;

}