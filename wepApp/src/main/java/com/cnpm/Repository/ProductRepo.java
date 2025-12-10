package com.cnpm.Repository;

import com.cnpm.Entity.Product;
import com.cnpm.Entity.Restaurant;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface ProductRepo extends JpaRepository<Product, Integer> {

    Optional<Product> findByProductId(Integer productId);

    List<Product> findByRestaurant(Restaurant restaurant);
}