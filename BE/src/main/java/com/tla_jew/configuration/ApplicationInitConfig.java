package com.tla_jew.configuration;

import com.tla_jew.entity.User;
import com.tla_jew.enums.Role;
import com.tla_jew.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;

//Class này dùng để tạo 1 admin ngay khi start application hoặc init application
@Slf4j
@RequiredArgsConstructor //Tạo một constructor mà cho tất cả các biến define là final
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@Configuration
public class ApplicationInitConfig {
    PasswordEncoder passwordEncoder;

    @Bean
    ApplicationRunner applicationRunner(UserRepository userRepository){
        return args -> {
            if(userRepository.findByUsername("admin").isEmpty()){
                var phanquyen=new HashSet<String>();
                phanquyen.add(Role.ADMIN.name());

                User user= User.builder()
                        .username("admin")
                        .password(passwordEncoder.encode("admin"))
                        .role(phanquyen)
                        .build();

                userRepository.save(user);
                log.warn("admin user has been created with default password: admin, please change");
            }
        };
    }
}
