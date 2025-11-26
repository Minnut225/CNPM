package com.cnpm.Service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import com.cnpm.Service.CartService;
import com.cnpm.Entity.User;
import com.cnpm.Service.UserService;
import com.cnpm.Service.impl.AuthServiceImpl;
import com.cnpm.DTO.LoginRequest;
import com.cnpm.DTO.OTPResponse;
import com.cnpm.DTO.RegisterRequest;
import com.cnpm.DTO.AuthResponse;
import com.cnpm.Security.TokenProvider;

@ExtendWith(MockitoExtension.class)
public class AuthServiceImplTest {
    @Mock 
    private UserService userService;

    @Mock
    private CartService cartService; 
    @Mock
    private TokenProvider tokenProvider;

    @InjectMocks
    private AuthServiceImpl authService;

    // -----------------------------------------------------------
    // TEST CASE 1: Đăng nhập thành công
    // -----------------------------------------------------------
    @Test
    void login_ShouldReturnAuthResponse_WhenCredentialsAreCorrect() {
        // 1. ARRANGE (Chuẩn bị dữ liệu giả)
        String phone = "0901111111";
        String password = "pass1";
        String fullName = "Nguyen Van A";
        String fakeToken = "abc.xyz.token";
        int userId = 1;
        String role = "ADMIN";

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setPhone(phone);
        loginRequest.setPassword(password);

        User mockUser = new User();
        mockUser.setUserId(userId);
        mockUser.setFullName(fullName);
        mockUser.setPassword(password); // Password trong DB khớp với request
        mockUser.setRole(role);

        // Dạy Mockito hành vi:
        when(userService.getUserByPhone(phone)).thenReturn(mockUser);
        when(tokenProvider.generateToken(fullName)).thenReturn(fakeToken);

        // 2. ACT (Chạy hàm cần test)
        AuthResponse response = authService.login(loginRequest);

        // 3. ASSERT (Kiểm tra kết quả)
        assertNotNull(response);
        assertEquals(fakeToken, response.getToken());
        assertEquals("Login successful", response.getMessage());
        assertEquals(userId, response.getUserId());
        
        // Verify: Đảm bảo tokenProvider thực sự đã được gọi 1 lần
        verify(tokenProvider, times(1)).generateToken(fullName);
    }


    // -----------------------------------------------------------
    // TEST CASE 2: Sai số điện thoại (User trả về null)
    // -----------------------------------------------------------
    @Test
    void login_ShouldThrowException_WhenUserNotFound() {
        // 1. ARRANGE
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setPhone("0999999999"); // Số lạ
        loginRequest.setPassword("anyPassword");

        // Dạy Mockito: Tìm không thấy user -> trả về null
        when(userService.getUserByPhone("0999999999")).thenReturn(null);

        // 2. & 3. ACT & ASSERT
        // Mong đợi một RuntimeException được ném ra
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            authService.login(loginRequest);
        });

        assertEquals("Invalid phone number or password", exception.getMessage());
        
        // Verify: Đảm bảo KHÔNG bao giờ gọi hàm tạo token nếu login lỗi
        verify(tokenProvider, never()).generateToken(anyString());
    }

    // -----------------------------------------------------------
    // TEST CASE 3: Sai mật khẩu
    // -----------------------------------------------------------
    @Test
    void login_ShouldThrowException_WhenPasswordIsWrong() {
        // 1. ARRANGE
        String phone = "0909123456";
        
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setPhone(phone);
        loginRequest.setPassword("wrongPassword"); // Mật khẩu sai

        User mockUser = new User();
        mockUser.setUserId(1);
        mockUser.setPassword("correctPassword"); // Mật khẩu đúng trong DB

        // Dạy Mockito: Tìm thấy user nhưng password không khớp
        when(userService.getUserByPhone(phone)).thenReturn(mockUser);

        // 2. & 3. ACT & ASSERT
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            authService.login(loginRequest);
        });

        assertEquals("Invalid phone number or password", exception.getMessage());
        verify(tokenProvider, never()).generateToken(anyString());
    }
}
