package com.cnpm.DTO;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DeliveryRequest {
    private int orderId;
    private int droneId;
    private String deliveryStatus;
}