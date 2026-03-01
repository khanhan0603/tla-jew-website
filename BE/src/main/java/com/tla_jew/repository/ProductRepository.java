package com.tla_jew.repository;

import com.tla_jew.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, String> {
    Optional<Product> findByProId(String proId);
    List<Product> getProductsByProductType_TypeId(String typeId);
    Page<Product> findByProNameContainingIgnoreCase(String proName, Pageable pageable);
}
