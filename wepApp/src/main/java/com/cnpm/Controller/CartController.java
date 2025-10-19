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

import java.util.List;

import com.cnpm.DTO.CartDTO;
import com.cnpm.Entity.Cart;
import com.cnpm.Service.CartService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/carts")
public class CartController {
    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping("")
    ResponseEntity<List<CartDTO>> findAll() {
        return ResponseEntity.ok(cartService.getAllCarts());
    }

    @GetMapping("/{id}")
    ResponseEntity<CartDTO> findById(@PathVariable int id) {

        CartDTO cart = cartService.getCartById(id);
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

    // Add to cart
    @PostMapping("/add/{userId}/{productId}")
    public ResponseEntity<String> addToCart(
            @PathVariable int userId,
            @PathVariable int productId,
            @RequestParam(defaultValue = "1") int quantity) {

        cartService.addToCart(userId, productId, quantity);
        return ResponseEntity.ok("Product added to cart successfully!");
    }

    // Delete all cart items by userId
    @DeleteMapping("/delete/{userId}")
    public ResponseEntity<String> deleteAllCartItems(@PathVariable int userId) {
        cartService.deleteAllCartItemsByUserId(userId);
        return ResponseEntity.ok("All cart items deleted successfully!");
    }

}
