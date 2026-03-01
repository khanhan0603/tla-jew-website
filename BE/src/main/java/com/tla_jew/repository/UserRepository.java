package com.tla_jew.repository;

import com.tla_jew.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User,String> {
    boolean existsByPhone(String phone);
    boolean existsByUsername(String username);
    Optional<User>findById(String id);
    Optional<User>findByUsername(String username);
}
