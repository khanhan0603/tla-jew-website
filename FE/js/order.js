document.addEventListener("DOMContentLoaded", () => {
  loadSelectedItems();
  loadUserInfo();
});

async function loadUserInfo() {
  const token = localStorage.getItem("token");

  if (!token) return;

  function parseJwt(token) {
        return JSON.parse(atob(token.split('.')[1]));
    }

    const payload = parseJwt(token);
    const userId = payload.sub;

  try {
    const res = await fetch(`http://localhost:8080/tla_jew/users/${userId}`, {
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    if (!res.ok) {
      console.log("Không lấy được thông tin user");
      return;
    }

    const user = await res.json();

    document.getElementById("fullName").value = user.fullname || "";
    document.getElementById("phone").value = user.phone || "";
    document.getElementById("address").value = user.address || "";

  } catch (err) {
    console.error("Lỗi load user:", err);
  }
}

function loadSelectedItems() {
  const selectedItems = JSON.parse(localStorage.getItem("selectedItems")) || [];
  const tbody = document.getElementById("bodyOrder");
  const totalSpan = document.getElementById("total");

  tbody.innerHTML = "";
  let total = 0;

  if (selectedItems.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="3">Không có sản phẩm</td>
      </tr>
    `;
    totalSpan.innerText = "0đ";
    return;
  }

  selectedItems.forEach(item => {
    const price = item.product.proCost;
    const quantity = item.quantity;
    total += price * quantity;

    tbody.innerHTML += `
      <tr>
        <td>${item.product.proName}</td>
        <td>${quantity}</td>
        <td>${formatCurrency(price)}đ</td>
      </tr>
    `;
  });

  totalSpan.innerText = formatCurrency(total) + "đ";
}

function formatCurrency(number) {
  return new Intl.NumberFormat("vi-VN").format(number);
}

async function createOrder() {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Chưa đăng nhập!");
    window.location.href = "login.html";
    return;
  }

  const selectedItems = JSON.parse(localStorage.getItem("selectedItems")) || [];
  //console.log(selectedItems);
  if (selectedItems.length === 0) {
    alert("Không có sản phẩm để đặt!");
    return;
  }

  // LẤY THÔNG TIN TỪ FORM (có thể user đã sửa)
  const fullName = document.getElementById("fullName").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();

  // Validate cơ bản
  if (!fullName || !phone || !address) {
    alert("Vui lòng nhập đầy đủ thông tin giao hàng!");
    return;
  }

  try {
    const response = await fetch("http://localhost:8080/tla_jew/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({
        fullName,
        phone,
        address,
        items: selectedItems.map(item => ({
          proId: item.product.proId,
          quantity: item.quantity
        }))
      })
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    const data = await response.json();

    alert("Đặt hàng thành công!");
    window.location.href=`order_confirmation.html?orderId=${data.result.orderId}`;

    
  } catch (err) {
    console.error(err);
    alert("Tạo đơn hàng thất bại!");
  }
}