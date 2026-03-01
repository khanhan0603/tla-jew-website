// =======================
// KIỂM TRA TOKEN CHUNG
// =======================
function checkToken() {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Chưa đăng nhập!");
    window.location.href = "login_admin.html";
    return null;
  }
  return token;
}

// =======================
// HIỂN THỊ DANH SÁCH LOẠI
// =======================
async function showProductType() {

  const tbody = document.getElementById("typeTableBody");
  if (!tbody) return; // Không phải trang danh sách thì thoát

  const token = checkToken();
  if (!token) return;

  try {
    const res = await fetch("http://localhost:8080/tla_jew/types", {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
      }
    });

    if (!res.ok) {
      alert("Không lấy được danh sách loại sản phẩm!");
      return;
    }

    const data = await res.json();
    tbody.innerHTML = "";

    data.forEach(t => {
      tbody.innerHTML += `
        <tr>
          <td>${t.typeName}</td>
          <td>
            <a href="./updateloai.html?typeId=${t.typeId}" 
               class="btn btn-warning btn-sm">
              Cập nhật
            </a>

            <button onclick="deleteType('${t.typeId}')"
               class="btn btn-danger btn-sm">
              Xóa
            </button>
          </td>
        </tr>
      `;
    });

  } catch (err) {
    console.error(err);
    alert("Lỗi kết nối server!");
  }
}


// =======================
// THÊM LOẠI SẢN PHẨM
// =======================
function handleAddProductType() {

  const form = document.getElementById("formAddProductType");
  if (!form) return; // Không phải trang thêm thì thoát

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const token = checkToken();
    if (!token) return;

    const typeName = document.getElementById("typeName").value.trim();

    if (!typeName) {
      showError("Tên loại sản phẩm không được để trống!");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/tla_jew/types", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ typeName })
      });

      if (res.status === 401) {
        alert("Phiên đăng nhập đã hết hạn!");
        localStorage.removeItem("token");
        window.location.href = "login_admin.html";
        return;
      }

      const data = await res.json();

      if (data.code === 1000) {
        alert("Thêm loại sản phẩm thành công!");
        window.location.href = "loaisanpham.html";
        return;
      }

      showError(data.message || "Thêm thất bại!");

    } catch (err) {
      console.error(err);
      showError("Không thể kết nối server!");
    }
  });
}


// =======================
// HIỂN THỊ UPDATE
// =======================
async function showUpdateLoai() {

  const input = document.getElementById("typeName");
  if (!input) return; // Không phải trang update thì thoát

  const token = checkToken();
  if (!token) return;

  const params = new URLSearchParams(window.location.search);
  const typeId = params.get("typeId");

  if (!typeId) {
    alert("Không tìm thấy ID loại sản phẩm!");
    return;
  }

  try {
    const res = await fetch(`http://localhost:8080/tla_jew/types/${typeId}`, {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
      }
    });

    if (!res.ok) {
      alert("Không lấy được thông tin loại sản phẩm!");
      return;
    }

    const data = await res.json();
    input.value = data.typeName;

  } catch (err) {
    console.error(err);
    alert("Lỗi kết nối server!");
  }
}

// =======================
// Update Tên loại
// =======================
function handleUpdateTypeName() {

  const form = document.getElementById("formUpdateTypeName");
  if (!form) return;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const token = checkToken();
    if (!token) return;

    const typeName = document.getElementById("typeName").value.trim();

    if (!typeName) {
      showError("Tên loại sản phẩm không được để trống!");
      return;
    }

    // LẤY typeId TỪ URL
    const params = new URLSearchParams(window.location.search);
    const typeId = params.get("typeId");

    if (!typeId) {
      alert("Không tìm thấy ID loại sản phẩm!");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8080/tla_jew/types/${typeId}`,
        {
          method: "PUT",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ typeName }),
        }
      );

      // Token hết hạn
      if (res.status === 401) {
        alert("Phiên đăng nhập đã hết hạn!");
        localStorage.removeItem("token");
        window.location.href = "login_admin.html";
        return;
      }

      const data = await res.json();

      // Nếu BE của bạn trả về dạng { code: 1000, message: "..."}
      if (data.code === 1000 || res.ok) {
        alert("Cập nhật loại sản phẩm thành công!");
        window.location.href = "loaisanpham.html";
        return;
      }

      // Lỗi từ BE
      showError(data.message || "Cập nhật thất bại!");

    } catch (err) {
      console.error(err);
      showError("Không thể kết nối server!");
    }
  });
}

// =======================
// Xóa Tên loại
// =======================
async function deleteType(typeId) {

  if (!confirm("Bạn chắc chắn muốn xóa?")) return;

  const token = checkToken();
  if (!token) return;

  try {
    const res = await fetch(
      `http://localhost:8080/tla_jew/types/${typeId}`,
      {
        method: "DELETE",
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

    if (res.ok) {
      alert("Xóa loại sản phẩm thành công!");
      showProductType(); // reload lại bảng
      return;
    }

    const data = await res.json();
    alert(data.message || "Xóa thất bại!");

  } catch (err) {
    console.error(err);
    alert("Không thể kết nối server!");
  }
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


// =======================
// DOM READY
// =======================
document.addEventListener("DOMContentLoaded", function () {
  showProductType();
  handleAddProductType();

  const params = new URLSearchParams(window.location.search);
  const typeId = params.get("typeId");

  if (typeId) {
    showUpdateLoai();
    handleUpdateTypeName();
  }
});

