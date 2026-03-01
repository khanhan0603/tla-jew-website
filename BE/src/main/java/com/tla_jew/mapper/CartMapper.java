package com.tla_jew.mapper;

import com.tla_jew.dbo.request.CartCreationRequest;
import com.tla_jew.dbo.response.CartResponse;
import com.tla_jew.entity.Cart;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface CartMapper {
    Cart toCart(CartCreationRequest request);
    CartResponse toCartResponse(Cart cart);
}
