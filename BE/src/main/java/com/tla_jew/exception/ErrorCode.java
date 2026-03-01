package com.tla_jew.exception;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.experimental.FieldDefaults;

@Getter
@FieldDefaults(level = AccessLevel.PRIVATE)
public enum ErrorCode {
    INVALID_PASSWORD(1001,"Mật khẩu phải ít nhất 8 ký tự"),
    INVALID_PHONE(1002,"Số điện thoại phải 10 ký tự"),
    USERNAME_INVALID(1003,"Tên người dùng phải ít nhất 3 ký tự"),
    PHONE_EXISTED(1004,"Số điện thoại đã tồn tại"),
    USERNAME_EXISTED(1009,"Tên người dùng đã tồn tại"),
    UNCATEGORIZED_EXCEPTION(9999,"Uncategorized error"),
    INVALID_KEY(1005,"Invalid message key"),
    UNAUTHENTICATED(1006,"Unauthenticated"),
    USER_NOT_EXISTED(1007,"Người dùng đã tồn tại"),
    TYPE_NAME_EXISTED(1008,"Tên loại sản phẩm đã tồn tại")
    ;

    int code;
    String message;

    ErrorCode(int code, String message) {
        this.code = code;
        this.message = message;
    }
}
