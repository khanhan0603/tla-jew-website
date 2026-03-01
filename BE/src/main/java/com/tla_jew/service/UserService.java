package com.tla_jew.service;

import com.tla_jew.dbo.request.UserCreationRequest;
import com.tla_jew.dbo.request.UserUpdateRequest;
import com.tla_jew.dbo.response.UserResponse;
import com.tla_jew.entity.User;
import com.tla_jew.enums.Role;
import com.tla_jew.exception.AppException;
import com.tla_jew.exception.ErrorCode;
import com.tla_jew.mapper.UserMapper;
import com.tla_jew.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserService {
    UserRepository userRepository;
    UserMapper userMapper;
    PasswordEncoder passwordEncoder;

    public User createUser(UserCreationRequest request){
        if(userRepository.existsByPhone(request.getPhone()))
            throw new AppException(ErrorCode.PHONE_EXISTED);
        if(userRepository.existsByUsername(request.getUsername()))
            throw new AppException(ErrorCode.USERNAME_EXISTED);

//        Mapp request for User
        User user=userMapper.toUser(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        HashSet<String> role=new HashSet<>();
        role.add(Role.USER.name());

        user.setRole(role);

        return userRepository.save(user);
    }

    public List<User> getUsers(){
        return userRepository.findAll();
    }

    public UserResponse getUser(String id){
        //Nếu tìm thấy trả về user, ko thì báo lỗi User not found
        return userMapper.toUserResponse(userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin người dùng!")));
    }

    public UserResponse updateUser(String id, UserUpdateRequest request){
        User user=userRepository.findById(id).orElseThrow(()->new RuntimeException("Không tìm thấy id của người dùng!"));

        userMapper.updateUser(user,request);

        return userMapper.toUserResponse(userRepository.save(user));
    }
}
