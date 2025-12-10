package com.cnpm.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RevenueDTO {
    private BigDecimal totalRevenueAfterTax;  // Tổng thu thực tế (Gross)
    private BigDecimal totalRevenueBeforeTax; // Doanh thu thuần (Net)
    private BigDecimal totalTax;              // Tiền thuế
    private Long totalOrders;                 // Tổng số đơn
}