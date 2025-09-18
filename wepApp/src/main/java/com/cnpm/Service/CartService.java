package com.cnpm.Service;

import com.cnpm.Entity.Cart;

import java.util.List;

import org.springframework.stereotype.Service;

@Service
public interface CartService {

    Cart getCartById(int id);

    Cart saveCart(Cart cart);

    void deleteById(int id);
}