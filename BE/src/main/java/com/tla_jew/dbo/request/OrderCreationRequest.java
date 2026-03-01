package com.tla_jew.dbo.request;

import com.tla_jew.entity.OrderItem;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderCreationRequest {
    String fullName;
    String phone;
    String address;
    List<OrderItemCreationRequest> items;
}
