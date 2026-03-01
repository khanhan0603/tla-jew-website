package com.tla_jew.repository;

import com.tla_jew.entity.Orders;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OrderRepository extends JpaRepository<Orders,String> {
    Orders findOrdersByOrderId(String orderId);

    Optional<Object> findByOrderId(String orderId);
}
