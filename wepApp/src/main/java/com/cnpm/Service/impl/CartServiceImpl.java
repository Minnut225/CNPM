package com.cnpm.Service.impl;

import com.cnpm.Service.CartService;
import com.cnpm.Entity.Cart;
import com.cnpm.Repository.CartRepo;
import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class CartServiceImpl implements CartService {
    
    private final CartRepo cartRepo;

    public CartServiceImpl(CartRepo cartRepo){
        this.cartRepo = cartRepo;
    }

    @Override
    public List<Cart> getAllCarts(){
        return cartRepo.findAll();
    }   

    @Override
    public Cart getCartById(int id){
        if (cartRepo.findById(id).isEmpty()){
            throw new RuntimeException("Cart not found");
        }
        return cartRepo.findById(id).get();
    }

    @Override
    public Cart saveCart(Cart cart){
        return cartRepo.save(cart);
    }

    @Override
    public void deleteCartById(int id) {
        cartRepo.deleteById(id);
    }
}
