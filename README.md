# TLA Jew - Website Bán Trang Sức

## Giới thiệu

TLA Jew là website bán trang sức được xây dựng theo mô hình gồm:

- 🔹 Frontend: HTML, CSS, JavaScript
- 🔹 Backend: Spring Boot (Java)
- 🔹 Cơ sở dữ liệu: MySQL

Hệ thống cho phép người dùng xem sản phẩm, tìm kiếm, quản lý dữ liệu thông qua API backend.


---
# Database

## Công nghệ sử dụng

- MySQL 8+

## Tạo Database

Trước khi chạy Backend, cần tạo database trong MySQL:

```sql
CREATE DATABASE tla_jew;
```

## Cấu hình thông tin kết nối
spring.datasource.url=jdbc:mysql://localhost:3306/tla_jew
spring.datasource.username=root
spring.datasource.password=your_password

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# FRONTEND (FE)

## Công nghệ sử dụng

- HTML5
- CSS3
- JavaScript
- Bootstrap
- Fetch API

## Chức năng
- Đối với khách hàng:
    Hiển thị danh sách sản phẩm
    Tìm kiếm sản phẩm
    Lọc theo loại
    Xem chi tiết sản phẩm
    Thêm sản phẩm vào giỏ hàng
    Xác nhận đơn hàng
- Đối với admin:
    Quản lý thông tin cá nhân, loại sản phẩm, sản phẩm, đơn hàng

## Cách chạy Frontend

Chỉ cần mở file: FE/layouts/landingpage.html

Hoặc sử dụng Live Server trong VS Code.

Lưu ý: Backend phải đang chạy thì dữ liệu mới hiển thị.

---

# BACKEND (BE)

## Công nghệ sử dụng

- Java 17+
- Spring Boot
- Spring Data JPA
- Spring Security
- MySQL
- Maven

## Chức năng

- RESTful API quản lý thông tin user, loại sản phẩm, sản phẩm, đơn hàng
- Tìm kiếm sản phẩm theo tên
- Tự động tạo tài khoản admin mặc định khi khởi chạy lần đầu

---

## Tài khoản mặc định

Khi chạy Backend lần đầu tiên, hệ thống sẽ tự động tạo tài khoản quản trị:

- Username: `admin`
- Password: `admin`

---

## Cách chạy Backend (không cần cài Maven sẵn)
- Windows
``` bash
.\mvnw.cmd spring-boot:run
```
- Build Project
    Mở TlaJewApplication -> bấm Run.

## Server mặc định
- Port : 8080
- Context path: /tla_jew


