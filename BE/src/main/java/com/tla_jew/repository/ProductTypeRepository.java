package com.tla_jew.repository;

import com.tla_jew.entity.ProductType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductTypeRepository extends JpaRepository<ProductType,String> {
    boolean existsByTypeName(String typeName);
    Optional<ProductType>findByTypeId(String typeId);
}
