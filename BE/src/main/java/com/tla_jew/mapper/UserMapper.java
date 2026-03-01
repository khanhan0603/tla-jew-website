package com.tla_jew.mapper;

import com.tla_jew.dbo.request.UserCreationRequest;
import com.tla_jew.dbo.request.UserUpdateRequest;
import com.tla_jew.dbo.response.UserResponse;
import com.tla_jew.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toUser(UserCreationRequest request);
    UserResponse toUserResponse(User user);
    void updateUser(@MappingTarget User user, UserUpdateRequest request);
}
