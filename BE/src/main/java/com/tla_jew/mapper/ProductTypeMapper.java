package com.tla_jew.mapper;

import com.tla_jew.dbo.request.ProductTypeCreationRequest;
import com.tla_jew.dbo.request.ProductTypeUpdateRequest;
import com.tla_jew.dbo.response.ProductTypeResponse;
import com.tla_jew.entity.ProductType;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ProductTypeMapper {
    ProductType toType(ProductTypeCreationRequest request);
    ProductTypeResponse toProductTypeResponse(ProductType type);
    void updateTypeName(@MappingTarget ProductType productType, ProductTypeUpdateRequest request);
}
