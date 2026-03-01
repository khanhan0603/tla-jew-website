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
@Table(
        uniqueConstraints = @UniqueConstraint(
                columnNames = {"cart_id", "product_id"}
        )
)
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
     String cartItemId;

    @ManyToOne
    @JoinColumn(name = "cart_id")
     Cart cart;

    @ManyToOne
    @JoinColumn(name = "product_id")
     Product product;

     int quantity;
}
