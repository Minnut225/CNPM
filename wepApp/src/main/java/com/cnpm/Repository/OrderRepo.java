package com.cnpm.Repository;

import com.cnpm.Entity.Order;
import com.cnpm.Entity.Restaurant;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.time.LocalDateTime;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

@Repository
public interface OrderRepo extends JpaRepository<Order, Integer>{

    Optional<Order> findByOrderId(Integer orderId);

    List<Order> findByStatus(String status);

    List<Order> findByRestaurant(Restaurant restaurant);

    @Query("SELECT SUM(o.totalPrice) FROM com.cnpm.Entity.Order o " +
           "WHERE o.restaurant.restaurantId = :restaurantId " +
           "AND (o.status = 'Completed' OR o.status = 'PAID') " +
           "AND o.orderDate BETWEEN :startDate AND :endDate")
    Double sumTotalPriceByRestaurantAndDate(@Param("restaurantId") Long restaurantId, 
                                            @Param("startDate") LocalDateTime startDate, 
                                            @Param("endDate") LocalDateTime endDate);

    // Đếm số đơn
    @Query("SELECT COUNT(o) FROM com.cnpm.Entity.Order o " +
           "WHERE o.restaurant.restaurantId = :restaurantId " +
           "AND (o.status = 'Completed' OR o.status = 'PAID') " +
           "AND o.orderDate BETWEEN :startDate AND :endDate")
    Long countOrdersByRestaurantAndDate(@Param("restaurantId") Long restaurantId, 
                                        @Param("startDate") LocalDateTime startDate, 
                                        @Param("endDate") LocalDateTime endDate);

    @Query("SELECT SUM(o.totalPrice) FROM com.cnpm.Entity.Order o " +
           "WHERE (o.status = 'Completed' OR o.status = 'PAID') " +
           "AND o.orderDate BETWEEN :startDate AND :endDate")
    Double sumTotalPriceByDate(@Param("startDate") LocalDateTime startDate, 
                               @Param("endDate") LocalDateTime endDate);

    @Query("SELECT COUNT(o) FROM com.cnpm.Entity.Order o " +
           "WHERE (o.status = 'Completed' OR o.status = 'PAID') " +
           "AND o.orderDate BETWEEN :startDate AND :endDate")
    Long countOrdersByDate(@Param("startDate") LocalDateTime startDate, 
                          @Param("endDate") LocalDateTime endDate);

}