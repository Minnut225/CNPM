package com.cnpm.Service;

import com.cnpm.Entity.Cart;

import java.util.List;

import org.springframework.stereotype.Service;

@Service
public interface CartService {

    List<Cart> getAllCarts();

    Cart getCartById(int id);

    Cart saveCart(Cart cart);

    void deleteCartById(int id);
}