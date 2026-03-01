package com.tla_jew.dbo.response;

import com.tla_jew.entity.OrderItem;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data //Tự tạo getter, setter, đồng thời có thêm các phương thức khác như toString...
@NoArgsConstructor
@AllArgsConstructor
@Builder //builder class cho 1 cái dbo
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderResponse {
    String orderId;
    String fullName;
    String phone;
    String address;
    List<OrderItemResponse> orderItems;
    String paymentMethod;
    Double totalPrice;
}
