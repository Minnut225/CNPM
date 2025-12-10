package com.cnpm.Repository;

import com.cnpm.Entity.Restaurant;
import com.cnpm.Entity.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface RestaurantRepo extends JpaRepository<Restaurant, Integer> {
    
    Optional<Restaurant> findByRestaurantId(Integer restaurantId);

    Optional<Restaurant> findByOwner(User owner);
}
