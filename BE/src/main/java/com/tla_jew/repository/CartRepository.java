package com.tla_jew.repository;

import com.tla_jew.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart,String> {
    Optional<Cart> findCartByUser_Id(String userId);
}
