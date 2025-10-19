package com.cnpm.Service.impl;

import com.cnpm.Service.CartService;
import com.cnpm.DTO.CartDTO;
import com.cnpm.DTO.ItemDTO;
import com.cnpm.Entity.Cart;
import com.cnpm.Entity.CartItem;
import com.cnpm.Entity.Product;
import com.cnpm.Entity.User;
import com.cnpm.Repository.CartRepo;
import com.cnpm.Repository.ProductRepo;
import com.cnpm.Repository.UserRepo;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CartServiceImpl implements CartService {

    private final CartRepo cartRepo;
    private final UserRepo userRepo;
    private final ProductRepo productRepo;

    public CartServiceImpl(CartRepo cartRepo, UserRepo userRepo, ProductRepo productRepo) {
        this.cartRepo = cartRepo;
        this.userRepo = userRepo;
        this.productRepo = productRepo;
    }

    // Lấy toàn bộ carts → trả về DTO
    @Override
    public List<CartDTO> getAllCarts() {
        return cartRepo.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Lấy cart theo id → trả về DTO
    @Override
    public CartDTO getCartById(int id) {
        Cart cart = cartRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Cart not found"));
        return convertToDTO(cart);
    }

    // Lưu cart entity (trường hợp cần)
    @Override
    public Cart saveCart(Cart cart) {
        return cartRepo.save(cart);
    }

    // Xóa cart theo id
    @Override
    public void deleteCartById(int id) {
        cartRepo.deleteById(id);
    }

    // Thêm product vào giỏ hàng của user
    @Override
    public void addToCart(int userId, int productId, int quantity) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // tìm hoặc tạo mới cart theo user
        Cart cart = cartRepo.findByUserId(user.getId())
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUserId(user.getId());
                    return cartRepo.save(newCart);
                });
        // kiểm tra xem product đã có trong cart chưa
        CartItem existingItem = cart.getCartItems().stream()
                .filter(item -> item.getProduct().getId() == productId)
                .findFirst()
                .orElse(null);

        if (existingItem != null) {
            // nếu có rồi, chỉ tăng quantity
            existingItem.setQuantity(existingItem.getQuantity() + quantity);
        } else {
            // nếu chưa có, thêm mới
            cart.addCartItem(product, quantity);
        }
        cartRepo.save(cart);
    }

    // Xóa toàn bộ items trong cart theo user
    @Override
    public void deleteAllCartItemsByUserId(int userId) {
        Cart cart = cartRepo.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found for user id: " + userId));
        cart.getCartItems().clear();
        cartRepo.save(cart);
    }


    // Helper: convert Cart Entity -> CartDTO
    private CartDTO convertToDTO(Cart cart) {
        CartDTO dto = new CartDTO();
        dto.setCartId(cart.getId());
        dto.setUserId(cart.getUserId());
        dto.setCartItems(cart.getCartItems()
                .stream()
                .map(item -> new ItemDTO(
                        item.getProduct().getId(),
                        item.getQuantity(),
                        item.getPrice() // include price in DTO
                ))
                .collect(Collectors.toList()));
        return dto;
    }

    // Helper: convert CartDTO -> Cart Entity
    private Cart convertToEntity(CartDTO dto) {
        Cart cart = new Cart();
        cart.setId(dto.getCartId());
        cart.setUserId(dto.getUserId());
        for (ItemDTO itemDTO : dto.getCartItems()) {
            // Giả sử bạn có một phương thức để tìm Product theo ID
            Product product = productRepo.findById(itemDTO.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));
            cart.addCartItem(product, itemDTO.getQuantity());
        }
        return cart;
    }
        
}