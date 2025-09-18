package com.cnpm.Controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.DeleteMapping;


import java.util.List;
import java.util.Optional;
import com.cnpm.Entity.Cart;
import com.cnpm.Service.CartService;

@RestController
@RequestMapping("/api/carts")
public class CartController {
    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping("")
    List<Cart> findAll() {
        return cartService.getAllCarts();
    }

    @GetMapping("/{id}")
    ResponseEntity<Cart> findById(@PathVariable int id) {

        Cart cart = cartService.getCartById(id);
        if (cart == null) {
            throw new RuntimeException("Cart not found");
        }
        return ResponseEntity.ok(cart);
    }

    // POST
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("")
    void create(@RequestBody Cart cart) {
        cartService.saveCart(cart);
    }

    // PUT 
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PutMapping("/{id}")
    void update(@RequestBody Cart cart, @PathVariable int id) {
        cartService.saveCart(cart);
    }

    // DELETE
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/{id}")
    void delete(@PathVariable int id) {
        cartService.deleteCartById(id);
    }
}
