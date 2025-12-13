package com.cnpm.Controller;

import com.cnpm.Service.OrderService;
import com.cnpm.DTO.RevenueDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@RestController
@RequestMapping("/api/stats")
public class StatisticsController {

    private final OrderService orderService;
    private static final double TAX_RATE = 0.10; // Thuế 10%

    public StatisticsController(@Autowired OrderService orderService) {
        this.orderService = orderService;
    }
    // GET: /api/stats/revenue?restaurantId=1&start=2023-01-01&end=2023-12-31
    @GetMapping("/revenue")
    public ResponseEntity<RevenueDTO> getRevenue(
            @RequestParam Long restaurantId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end
    ) {
        // Chuyển đổi LocalDate sang LocalDateTime (đầu ngày và cuối ngày)
        LocalDateTime startDateTime = start.atStartOfDay();
        LocalDateTime endDateTime = end.atTime(LocalTime.MAX);

        Double totalAmount = orderService.sumTotalPriceByRestaurantAndDate(restaurantId, startDateTime, endDateTime);
        Long count = orderService.countOrdersByRestaurantAndDate(restaurantId, startDateTime, endDateTime);

        if (totalAmount == null) totalAmount = 0.0;

        // Tính toán thuế
        BigDecimal revenueAfterTax = BigDecimal.valueOf(totalAmount);
        
        // Công thức: Trước thuế = Sau thuế / (1 + TaxRate)
        BigDecimal revenueBeforeTax = revenueAfterTax.divide(BigDecimal.valueOf(1 + TAX_RATE), 2, RoundingMode.HALF_UP);
        
        BigDecimal taxAmount = revenueAfterTax.subtract(revenueBeforeTax);

        return ResponseEntity.ok(new RevenueDTO(revenueAfterTax, revenueBeforeTax, taxAmount, count));
    }

}