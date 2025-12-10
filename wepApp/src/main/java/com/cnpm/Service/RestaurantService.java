package com.cnpm.Service;

import org.springframework.stereotype.Service;
import com.cnpm.Entity.Restaurant;
import com.cnpm.DTO.RestaurantDTO;
import java.util.Optional;
import java.util.List;

@Service
public interface RestaurantService {

    Optional<Restaurant> findById(int id);

    List<Restaurant> getAllRestaurants();

    Optional<Restaurant> findByOwnerId(int ownerId);

    Restaurant createRestaurant(RestaurantDTO restaurant);

    Restaurant updateRestaurant(int id, RestaurantDTO restaurant);

    void deleteRestaurant(int id);
}
