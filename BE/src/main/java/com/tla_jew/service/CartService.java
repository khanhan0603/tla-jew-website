package com.tla_jew.service;

import com.tla_jew.dbo.request.CartCreationRequest;
import com.tla_jew.dbo.request.CartItemCreationRequest;
import com.tla_jew.entity.Cart;
import com.tla_jew.entity.CartItem;
import com.tla_jew.entity.Product;
import com.tla_jew.entity.User;
import com.tla_jew.mapper.CartMapper;
import com.tla_jew.repository.CartItemRepository;
import com.tla_jew.repository.CartRepository;
import com.tla_jew.repository.ProductRepository;
import com.tla_jew.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CartService {
    CartRepository cartRepository;
    CartItemRepository cartItemRepository;
    UserRepository userRepository;
    ProductRepository productRepository;
    CartMapper cartMapper;

    public Cart createCart(CartCreationRequest request){
        Optional<Cart> existingCart =
                cartRepository.findCartByUser_Id(request.getUserId());

        if(existingCart.isPresent()){
            return existingCart.get();
        }

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = new Cart();
        cart.setUser(user);

        return cartRepository.save(cart);
    }

    public List<Cart> getCarts(){
        return cartRepository.findAll();
    }

    private String getUserIdFromToken() {
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        return authentication.getName();
    }

    public List<CartItem> getCartItems(){
        String userId=getUserIdFromToken();
        return cartItemRepository.findByCart_User_Id(userId);
    }
//Tạo mới hoặc cập nhật số lượng
    public CartItem createCartItem(CartItemCreationRequest request){
        String userId = getUserIdFromToken();

        Cart cart = cartRepository.findCartByUser_Id(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        Product product = productRepository.findByProId(request.getProId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Check đã tồn tại chưa
        Optional<CartItem> existingCartItem =
                cartItemRepository.findByCartAndProduct(cart, product);

        if (existingCartItem.isPresent()) {
            // Nếu đã có → update số lượng
            CartItem cartItem = existingCartItem.get();
            cartItem.setQuantity(
                    cartItem.getQuantity() + request.getQuantity()
            );
            return cartItemRepository.save(cartItem);
        }

        // Nếu chưa có → tạo mới
        CartItem cartItem = new CartItem();
        cartItem.setCart(cart);
        cartItem.setProduct(product);
        cartItem.setQuantity(request.getQuantity());

        return cartItemRepository.save(cartItem);
    }
//    Xóa cartItem
    public void deleteCartItem(String cartItemId){
        if (!cartItemRepository.existsById(cartItemId)) {
            throw new RuntimeException("CartItem không tồn tại");
        }
        cartItemRepository.deleteById(cartItemId);
    }
}
