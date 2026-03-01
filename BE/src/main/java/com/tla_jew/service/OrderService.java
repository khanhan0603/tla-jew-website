package com.tla_jew.service;

import com.tla_jew.dbo.request.OrderCreationRequest;
import com.tla_jew.dbo.request.OrderItemCreationRequest;
import com.tla_jew.dbo.response.OrderItemResponse;
import com.tla_jew.dbo.response.OrderResponse;
import com.tla_jew.entity.Orders;
import com.tla_jew.entity.OrderItem;
import com.tla_jew.entity.Product;
import com.tla_jew.entity.User;
import com.tla_jew.repository.OrderRepository;
import com.tla_jew.repository.ProductRepository;
import com.tla_jew.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OrderService {
    OrderRepository orderRepository;
    UserRepository userRepository;
    ProductRepository productRepository;

    private String getUserIdFromToken() {
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        return authentication.getName();
    }
    @Transactional
    public Orders createOrder(OrderCreationRequest request){
        String userId=getUserIdFromToken();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Orders order=new Orders();
        order.setFullName(request.getFullName());
        order.setAddress(request.getAddress());
        order.setPhone(request.getPhone());
        order.setUser(user);
        order.setStatus("PENDING");
        order.setCreatedAt(LocalDateTime.now());

        List<OrderItem> orderItems=new ArrayList<>();
        double totalAmount=0;

        for (OrderItemCreationRequest orderItemCreationRequest : request.getItems()) {

            Product product = productRepository.findById(orderItemCreationRequest.getProId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            if (product.getProCount() < orderItemCreationRequest.getQuantity()) {
                throw new RuntimeException("Not enough stock");
            }

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(orderItemCreationRequest.getQuantity());
            orderItem.setPrice(product.getProCost());

            totalAmount += product.getProCost() * orderItemCreationRequest.getQuantity();

            // Trừ kho
            product.setProCount(product.getProCount() - orderItemCreationRequest.getQuantity());

            orderItems.add(orderItem);
        }

        order.setTotalPrice(totalAmount);
        order.setOrderItems(orderItems);

        return orderRepository.save(order);
    }

    public List<Orders> getOrders(){
        return orderRepository.findAll();
    }

    public OrderResponse getOrderById(String orderId){
        String userId=getUserIdFromToken();
        Orders order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        if(!order.getUser().getId().equals(userId)){
            throw new RuntimeException("You are not allowed to view this order!");
        }

        List<OrderItemResponse> orderItemResponses=order.getOrderItems()
                .stream()
                .map(item -> OrderItemResponse.builder()
                        .proName(item.getProduct().getProName())
                        .quantity(item.getQuantity())
                        .price(item.getPrice())
                        .total(item.getPrice()*item.getQuantity())
                        .build())
                .toList();
        return OrderResponse.builder()
                .orderId(order.getOrderId())
                .fullName(order.getFullName())
                .phone(order.getPhone())
                .address(order.getAddress())
                .paymentMethod("COD")
                .totalPrice(order.getTotalPrice())
                .orderItems(orderItemResponses)
                .build();
    }


}
