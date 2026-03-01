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
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String paymentId;

    @OneToOne
    @JoinColumn(name = "order_id")
    Orders order;

    String method;   // COD, VNPAY, MOMO
    String status;   // SUCCESS, FAILED
}
