package com.cnpm.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RestaurantDTO {
    private int restaurantId;
    private String restaurantName;
    private String address;
    private String phone;
    
    private String ownerName; 
    private int ownerId;
    
    private Double latitude;
    private Double longitude;
}
