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
public class Cart {
    @Id
    @GeneratedValue (strategy = GenerationType.UUID)
    String cartId;

    @ManyToOne
    @JoinColumn(name="user_Id")
    User user;
}
