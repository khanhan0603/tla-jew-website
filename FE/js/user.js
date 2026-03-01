
// ===============================
// CHẠY KHI DOM LOAD XONG
// ===============================
document.addEventListener("DOMContentLoaded", function () {

    // Trang profile
    if (document.getElementById("fullname-1")) {
        showProfileUser();
        handleUpdateUser();
    }

    // Trang đăng ký
    if (document.getElementById("formDangKy")) {
        handleSignUp();
    }
});


// ===============================
// LẤY THÔNG TIN PROFILE
// ===============================
async function showProfileUser() {

    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login_khachhang.html";
        return;
    }

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userId = payload.sub;

        if (!userId) {
            localStorage.removeItem("token");
            alert("Chưa đăng nhập");
            window.location.href = "login_khachhang.html";
            return;
        }

        const res = await fetch(`http://localhost:8080/tla_jew/users/${userId}`, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        if (!res.ok) {
            throw new Error("Unauthorized");
        }

        const data = await res.json();

        const user = data.result ? data.result : data;

        document.getElementById("fullname-1").textContent = user.fullname || "";
        document.getElementById("username").value = user.username || "";
        document.getElementById("fullname").value = user.fullname || "";
        document.getElementById("address").value = user.address || "";
        document.getElementById("phone").value = user.phone || "";
        document.getElementById("gender").value = String(user.gender);

    } catch (error) {
        localStorage.removeItem("token");
        window.location.href = "login_khachhang.html";
    }
}


// ===============================
// ĐĂNG KÝ USER
// ===============================
function handleSignUp() {

    const form = document.getElementById("formDangKy");
    const errorDiv = document.getElementById("signup-error");

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        errorDiv.textContent = ""; // reset lỗi cũ

        const username = document.querySelector("input[name='username']").value.trim();
        const password = document.querySelector("input[name='password']").value.trim();
        const phone = document.querySelector("input[name='phone']").value.trim();

        if (!username || !password || !phone) {
            errorDiv.textContent = "Vui lòng nhập đầy đủ thông tin!";
            return;
        }

        try {
            const res = await fetch("http://localhost:8080/tla_jew/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                    phone: phone
                })
            });

            const data = await res.json();

            // Nếu BE dùng ApiResponse chuẩn
            if (data.code === 1000) {
                alert("Đăng ký thành công!");
                window.location.href = "login_khachhang.html";
                return;
            }

            // Hiển thị lỗi từ BE
            errorDiv.textContent = data.message || "Đăng ký thất bại!";

        } catch (error) {
            errorDiv.textContent = "Không thể kết nối server!";
        }
    });
}

// ===============================
// UPDATE USER
// ===============================
function handleUpdateUser() {

    const form = document.getElementById("updateForm");
    if (!form) return;

    const messageDiv = document.getElementById("update-message");

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        messageDiv.textContent = "";
        messageDiv.style.color = "red";

        const token = localStorage.getItem("token");
        if (!token) {
            window.location.href = "login_khachhang.html";
            return;
        }

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const userId = payload.sub;

            const fullname = document.getElementById("fullname").value.trim();
            const address = document.getElementById("address").value.trim();
            const phone = document.getElementById("phone").value.trim();
            const gender = document.getElementById("gender").value;

            const res = await fetch(`http://localhost:8080/tla_jew/users/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({
                    fullname: fullname,
                    address: address,
                    phone: phone,
                    gender: gender
                })
            });

            const data = await res.json();

            if (data.code === 1000 || res.ok) {
                messageDiv.style.color = "green";
                messageDiv.textContent = "Cập nhật thông tin thành công!";
                document.getElementById("fullname-1").textContent = fullname;
            } else {
                messageDiv.textContent = data.message || "Cập nhật thất bại!";
            }

        } catch (error) {
            messageDiv.textContent = "Không thể kết nối server!";
        }
    });
}


// ===============================
// LOGOUT
// ===============================
function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("cart");
    window.location.href = "/layouts-part/landingpage.html";
}