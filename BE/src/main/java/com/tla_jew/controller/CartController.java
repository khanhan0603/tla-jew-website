package com.tla_jew.controller;

import com.tla_jew.dbo.request.CartCreationRequest;
import com.tla_jew.dbo.request.CartItemCreationRequest;
import com.tla_jew.dbo.response.ApiResponse;
import com.tla_jew.entity.Cart;
import com.tla_jew.entity.CartItem;
import com.tla_jew.service.CartService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.w3c.dom.stylesheets.LinkStyle;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class CartController {
    CartService cartService;

    @PostMapping
    ApiResponse<Cart> createCart(@RequestBody @Valid CartCreationRequest request){
        ApiResponse<Cart> apiResponse=new ApiResponse<>();

        apiResponse.setResult(cartService.createCart(request));

        return apiResponse;
    }

    @GetMapping
    List<Cart> getCarts(){
        return cartService.getCarts();
    }

    @GetMapping("/cartItem")
    List<CartItem> getCartItems(){
        return cartService.getCartItems();
    }

    @PostMapping("/createCartItem")
    ApiResponse<CartItem> createCartItem(@RequestBody @Valid CartItemCreationRequest request){
        ApiResponse<CartItem> apiResponse=new ApiResponse<>();

        apiResponse.setResult(cartService.createCartItem(request));

        return apiResponse;
    }

    @DeleteMapping("/deleteCartItem/{cartItemId}")
    public ResponseEntity<?> deleteCartItem(@PathVariable String cartItemId){
        cartService.deleteCartItem(cartItemId);
        return ResponseEntity.ok("Xóa thành công");
    }
}
