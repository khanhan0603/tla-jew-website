// =======================
// LẤY USER ID TỪ TOKEN
// =======================
function getUserIdFromToken() {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.sub;
    } catch (e) {
        console.error("Token không hợp lệ");
        return null;
    }
}


// =======================
// HIỂN THỊ PROFILE
// =======================
async function showProfileUser() {

    const token = localStorage.getItem("token");
    const userId = getUserIdFromToken();

    if (!token || !userId) {
        alert("Chưa đăng nhập!");
        window.location.href = "login_admin.html";
        return;
    }

    try {
        const res = await fetch(
            `http://localhost:8080/tla_jew/users/${userId}`,
            {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + token,
                    "Content-Type": "application/json"
                }
            }
        );

        if (res.status === 401) {
            alert("Phiên đăng nhập đã hết hạn!");
            localStorage.removeItem("token");
            window.location.href = "login_admin.html";
            return;
        }

        if (!res.ok) {
            alert("Không lấy được thông tin người dùng!");
            return;
        }

        const data = await res.json();

        // Đổ dữ liệu lên HTML (check tồn tại để tránh crash)
        const fullnameText = document.getElementById("fullname");
        const fullnameInput = document.getElementById("fullname-2");
        const addressInput = document.getElementById("address");
        const phoneInput = document.getElementById("phone");

        if (fullnameText) fullnameText.textContent = data.fullname || "";
        if (fullnameInput) fullnameInput.value = data.fullname || "";
        if (addressInput) addressInput.value = data.address || "";
        if (phoneInput) phoneInput.value = data.phone || "";

    } catch (err) {
        console.error(err);
        alert("Không thể kết nối server!");
    }
}


// =======================
// UPDATE ADMIN
// =======================
function handleUpdateAdmin(){

    const form = document.getElementById("updateAdmin");
    if(!form) return;

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const token = localStorage.getItem("token");
        const userId = getUserIdFromToken();

        if (!token || !userId) {
            alert("Chưa đăng nhập!");
            window.location.href = "login_admin.html";
            return;
        }

        const fullname = document.getElementById("fullname-2")?.value.trim();
        const address  = document.getElementById("address")?.value.trim();
        const phone    = document.getElementById("phone")?.value.trim();

        if (!fullname) {
            showError("Họ tên không được để trống!");
            return;
        }

        try{
            const res = await fetch(
                `http://localhost:8080/tla_jew/users/${userId}`,
                {
                    method:"PUT",
                    headers:{
                        "Authorization":"Bearer "+token,
                        "Content-Type":"application/json",
                    },
                    body: JSON.stringify({ fullname, address, phone }),
                }
            );
            
            if (res.status === 401) {
                alert("Phiên đăng nhập đã hết hạn!");
                localStorage.removeItem("token");
                window.location.href = "login_admin.html";
                return;
            }

            const data = await res.json();

            if (res.ok) {
                alert("Cập nhật thông tin thành công!");
                showProfileUser(); // reload lại dữ liệu
                return;
            }

            showError(data.message || "Cập nhật thất bại!");

        }
        catch(err){
            console.error(err);
            showError("Không thể kết nối server!");
        }
    });
}


// =======================
// HIỂN THỊ LỖI
// =======================
function showError(message) {
  const errorBox = document.getElementById("errorBox");

  if (!errorBox) {
    alert(message);
    return;
  }

  errorBox.innerText = message;
  errorBox.style.display = "block";
}

function logout() {
    localStorage.removeItem("token");
    window.location.href = "/layouts-part/landingpage.html";
}


// =======================
// DOM READY
// =======================
document.addEventListener("DOMContentLoaded", function () {
  showProfileUser();
  handleUpdateAdmin();
});