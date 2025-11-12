package com.cnpm.Controller;

import com.cnpm.DTO.PaymentResponse;
import com.cnpm.Entity.Payment;
import com.cnpm.Service.OrderService;
import com.cnpm.Service.PaymentService;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;
    private final OrderService orderService;

    public PaymentController(PaymentService paymentService, OrderService orderService) {
        this.paymentService = paymentService;
        this.orderService = orderService;
    }

    // Tạo Payment
    @PostMapping("/create")
    public ResponseEntity<PaymentResponse> createPayment(
            @RequestParam int orderId,
            @RequestParam double amount,
            @RequestParam String method,
            HttpServletRequest request) {
        PaymentResponse response = paymentService.createPayment(orderId, amount, method, request);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Lấy chi tiết Payment
    @GetMapping("/{id}")
    public ResponseEntity<Payment> getPayment(@PathVariable int id) {
        return ResponseEntity.ok(paymentService.getPaymentByID(id));
    }

    // Xử lý callback từ VNPAY
    @GetMapping("/vnpay-return")
    public ResponseEntity<String> vnpayReturn(HttpServletRequest request) {
        // Lấy params mà VNPAY redirect kèm về
        Map<String, String[]> paramMap = request.getParameterMap();

        Map<String, String> vnp_Params = paramMap.entrySet().stream()
                .collect(Collectors.toMap(Map.Entry::getKey, e -> e.getValue()[0]));

        String responseCode = vnp_Params.get("vnp_ResponseCode");
        String orderId = vnp_Params.get("vnp_TxnRef"); // orderId lúc tạo payment

        if ("00".equals(responseCode)) {
            // Update payment = PAID
            orderService.updateOrderStatus(Integer.parseInt(orderId), "PAID");
            return ResponseEntity.ok("Thanh toán thành công cho orderId=" + orderId);
        } else {
            // Update payment = FAILED
            return ResponseEntity.ok("Thanh toán thất bại cho orderId=" + orderId);
        }
    }
}
