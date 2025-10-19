package com.cnpm.Service;

import com.cnpm.Entity.Cart;
import com.cnpm.DTO.CartDTO;

import java.util.List;

import org.springframework.stereotype.Service;

@Service
public interface CartService {

    List<CartDTO> getAllCarts();

    CartDTO getCartById(int id);

    Cart saveCart(Cart cart);

    void deleteCartById(int id);

    void addToCart(int userId, int productId, int quantity);

    void deleteAllCartItemsByUserId(int userId);

    

    //CartItemDTO updateCartItemQuantity(int cartItemId, int quantity);
    
}