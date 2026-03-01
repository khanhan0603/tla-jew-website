package com.tla_jew.dbo.request;

import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserUpdateRequest {
    String fullname;
    String address;
    boolean gender;

    @Size(max = 10, message = "INVALID_PHONE")
    String phone;
}
