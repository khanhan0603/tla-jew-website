package com.tla_jew.mapper;

import com.tla_jew.dbo.request.ProductCreationRequest;
import com.tla_jew.dbo.request.ProductUpdateRequets;
import com.tla_jew.dbo.response.ProductResponse;
import com.tla_jew.entity.Product;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ProductMapper {
    Product toProduct(ProductCreationRequest request);
    ProductResponse toProductResponse(Product product);
    void updateProduct(@MappingTarget Product product, ProductUpdateRequets requet);
}
