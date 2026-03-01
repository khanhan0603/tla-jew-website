package com.tla_jew.controller;

import com.tla_jew.dbo.request.OrderCreationRequest;
import com.tla_jew.dbo.response.ApiResponse;
import com.tla_jew.dbo.response.OrderResponse;
import com.tla_jew.entity.Orders;
import com.tla_jew.service.OrderService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/order")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class OrderController {
    OrderService orderService;

    @PostMapping
    ApiResponse<Orders> createOrder(@RequestBody @Valid OrderCreationRequest request){
        ApiResponse<Orders> apiResponse=new ApiResponse<>();
        //System.out.println(request);
        apiResponse.setResult(orderService.createOrder(request));

        return apiResponse;
    }

    @GetMapping("/admin/orders")
    @PreAuthorize("hasRole('ADMIN')")
    List<Orders> getOrders(){
        return orderService.getOrders();
    }

    @GetMapping("user/{orderId}")
    @PreAuthorize("hasRole('USER')")
    OrderResponse getOrderByUserId(@PathVariable String orderId){
        return orderService.getOrderById(orderId);
    }
}
