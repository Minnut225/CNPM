package com.cnpm.Controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.cnpm.Entity.Product;
import com.cnpm.Entity.Restaurant;
import com.cnpm.Entity.Restaurant;
import com.cnpm.Entity.Order;
import com.cnpm.Service.ProductService;
import com.cnpm.Service.UserService;
import com.cnpm.Service.RestaurantService;
import com.cnpm.DTO.ProductDTO;
import com.cnpm.DTO.RestaurantDTO;
import com.cnpm.DTO.OrderDTO;
import com.cnpm.Service.OrderService;
import java.util.Optional;  

import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
public class RestaurantController {

    private final RestaurantService restaurantService;
    private final UserService userService;
    private final ProductService productService;
    private final OrderService orderService;

    public RestaurantController(RestaurantService restaurantService, UserService userService, ProductService productService, OrderService orderService) {
        this.restaurantService = restaurantService;
        this.userService = userService;
        this.productService = productService;
        this.orderService = orderService;
    }

    @GetMapping("")
    public ResponseEntity<List<Restaurant>> getAllRestaurants() {
        List<Restaurant> restaurants = restaurantService.getAllRestaurants();
        return ResponseEntity.ok(restaurants);
    }

    @PostMapping("")
    public ResponseEntity<Restaurant> createRestaurant(@RequestBody RestaurantDTO restaurant) {
        return ResponseEntity.ok(restaurantService.createRestaurant(restaurant));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteRestaurant(@PathVariable int id) {
        restaurantService.findById(id).ifPresent(restaurant -> restaurantService.deleteRestaurant(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Restaurant> updateRestaurant(@PathVariable int id, @RequestBody RestaurantDTO restaurant) {
        return restaurantService.findById(id)
                .map(existingRestaurant -> {
                    Restaurant updatedRestaurant = restaurantService.updateRestaurant(id, restaurant);
                    return ResponseEntity.ok(updatedRestaurant);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Restaurant> getRestaurantById(@PathVariable int id) {
        return restaurantService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/products")
    public ResponseEntity<List<ProductDTO>> getRestaurantMenu(@PathVariable int id) {
        return restaurantService.findById(id)
                .map(restaurant -> {
                    List<Product> products = productService.getProductsByRestaurant(restaurant);
                    List<ProductDTO> productDTOs = products.stream()
                            .map(product -> {
                                ProductDTO dto = new ProductDTO();
                                dto.setProductId(product.getProductId());
                                dto.setProductName(product.getProductName());
                                dto.setDescription(product.getDescription());
                                dto.setPrice(product.getPrice());
                                dto.setImageUrl(product.getImageUrl());
                                dto.setAvailable(product.isAvailable());
                                dto.setCategoryId(product.getCategory().getCategoryId());
                                dto.setRestaurantId(product.getRestaurant().getRestaurantId());
                                return dto;
                            })
                            .toList();
                    return ResponseEntity.ok(productDTOs);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/orders")
    public ResponseEntity<List<OrderDTO>> getRestaurantOrders(@PathVariable int id) {
        return restaurantService.findById(id)
                .map(restaurant -> {
                    List<OrderDTO> orders = orderService.getOrdersByRestaurant(restaurant);
                    return ResponseEntity.ok(orders);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<Restaurant> getRestaurantByOwnerId(@PathVariable int ownerId) {
        return restaurantService.findByOwnerId(ownerId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
