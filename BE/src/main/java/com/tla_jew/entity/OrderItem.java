package com.tla_jew.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String orderItemId;

    @ManyToOne
    Orders order;

    @ManyToOne
    Product product;

    Integer quantity;

    Double price; // giá tại thời điểm mua
}
