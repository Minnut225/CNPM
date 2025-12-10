package com.cnpm.Service.impl;

import com.cnpm.Service.RestaurantService;
import org.springframework.stereotype.Service;

import com.cnpm.DTO.RestaurantDTO;
import com.cnpm.Entity.Product;
import com.cnpm.Entity.Restaurant;
import com.cnpm.Repository.RestaurantRepo;
import com.cnpm.Repository.ProductRepo;
import com.cnpm.Repository.UserRepo;
import com.cnpm.Entity.User;

import java.util.Optional;
import java.util.List;

@Service
public class RestaurantServiceImpl implements RestaurantService {
    
    private final RestaurantRepo restaurantRepo;
    private final ProductRepo productRepo;
    private final UserRepo userRepo;

    public RestaurantServiceImpl(RestaurantRepo restaurantRepo, ProductRepo productRepo, UserRepo userRepo) {
        this.restaurantRepo = restaurantRepo;
        this.productRepo = productRepo;
        this.userRepo = userRepo;
    }

    @Override
    public Optional<Restaurant> findById(int id) {
        return restaurantRepo.findById(id);
    }

    @Override
    public List<Restaurant> getAllRestaurants() {
        return restaurantRepo.findAll();
    }

    @Override
    public Restaurant createRestaurant(RestaurantDTO restaurant) {
        User owner = userRepo.findById(restaurant.getOwnerId()).orElse(null);
        Restaurant newRestaurant = new Restaurant();
        newRestaurant.setRestaurantName(restaurant.getRestaurantName());
        newRestaurant.setAddress(restaurant.getAddress());
        newRestaurant.setPhone(restaurant.getPhone());
        newRestaurant.setOwner(owner);
        newRestaurant.setLatitude(restaurant.getLatitude());
        newRestaurant.setLongitude(restaurant.getLongitude());
        return restaurantRepo.save(newRestaurant);
    }

    @Override
    public Restaurant updateRestaurant(int id, RestaurantDTO restaurant) {
        User owner = userRepo.findById(restaurant.getOwnerId()).orElse(null);
        return restaurantRepo.findById(id)
                .map(existingRestaurant -> {
                    existingRestaurant.setRestaurantName(restaurant.getRestaurantName());
                    existingRestaurant.setAddress(restaurant.getAddress());
                    existingRestaurant.setPhone(restaurant.getPhone());
                    existingRestaurant.setOwner(owner);
                    existingRestaurant.setLatitude(restaurant.getLatitude());
                    existingRestaurant.setLongitude(restaurant.getLongitude());
                    return restaurantRepo.save(existingRestaurant);
                })
                .orElse(null);
    }

    @Override
    public void deleteRestaurant(int id) {
        restaurantRepo.deleteById(id);
    }

    @Override
    public Optional<Restaurant> findByOwnerId(int ownerId) {
        User owner = userRepo.findById(ownerId).orElse(null);
        return restaurantRepo.findByOwner(owner);
    }

    private RestaurantDTO convertToDTO(Restaurant restaurant) {
        RestaurantDTO dto = new RestaurantDTO();
        dto.setRestaurantId(restaurant.getRestaurantId());
        dto.setRestaurantName(restaurant.getRestaurantName());
        dto.setAddress(restaurant.getAddress());
        dto.setPhone(restaurant.getPhone());
        dto.setOwnerId(restaurant.getOwner().getUserId());
        dto.setLatitude(restaurant.getLatitude());
        dto.setLongitude(restaurant.getLongitude());
        return dto;
    }
}
