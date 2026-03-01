package com.tla_jew.repository;

import com.tla_jew.entity.Cart;
import com.tla_jew.entity.CartItem;
import com.tla_jew.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem,String> {
    List<CartItem> findByCart_User_Id(String userId);
    Optional<CartItem> findByCartAndProduct(Cart cart, Product product);

    void deleteCartItemByCartItemId(String cartItemId);
}
