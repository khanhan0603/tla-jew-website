function openCart() {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Vui lòng đăng nhập trước");
    window.location.href = "login_khachhang.html";
    return;
  }

  window.location.href = "/layouts-part/cart.html";
}

document.addEventListener("DOMContentLoaded", loadCart);

async function loadCart() {
  const token = localStorage.getItem("token");
  const tbody = document.getElementById("cartItem");
  if (!tbody) return;

  if (!token) {
    alert("Vui lòng đăng nhập trước");
    window.location.href = "login.html";
    return;
  }

  try {
    const res = await fetch(`http://localhost:8080/tla_jew/cart/cartItem`, {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
      }
    });

    if (!res.ok) {
      alert("Không lấy được cart!");
      return;
    }

    const data = await res.json();
    localStorage.setItem("cart", JSON.stringify(data));
    
    tbody.innerHTML = "";

    // Nếu rỗng
    if (!data || data.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center py-5"
              style="font-size: 20px; font-weight: 600; color: #666;">
              Không có sản phẩm trong giỏ hàng
          </td>
        </tr>
      `;
      return;
    }

    data.forEach(t => {
      const total = t.product.proCost * t.quantity;

      tbody.innerHTML += `
        <tr>
          <td class="shoping__cart__check">
            <input type="checkbox"  class="cart-check"
                    data-id="${t.cartItemId}"
                    data-quantity="${t.quantity}"
                    data-price="${t.product.proCost}"
                    onchange="updateSelectedSummary()">
          </td>

          <td class="shoping__cart__item">
            <img src="data:image/jpeg;base64,${t.product.proImg}" width="90">
            <h5>${t.product.proName}</h5>
          </td>

          <td class="shoping__cart__price">
            ${formatCurrency(t.product.proCost)}đ
          </td>

          <td class="shoping__cart__quantity">
            ${t.quantity}
          </td>

          <td class="shoping__cart__total">
            ${formatCurrency(total)}đ
          </td>

          <td class="shoping__cart__item__close">
            <button onclick="removeItem('${t.cartItemId}', this)">X</button>
          </td>
        </tr>
      `;
    });

  } catch (err) {
    console.error(err);
    alert("Lỗi kết nối server!");
  }
}

function buySelectedItems() {
  const checkboxes = document.querySelectorAll(".cart-check:checked");

  if (checkboxes.length === 0) {
    alert("Vui lòng chọn sản phẩm!");
    return;
  }

  const selectedIds = Array.from(checkboxes).map(cb => cb.dataset.id);

  // Lấy cart hiện tại từ localStorage
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const selectedItems = cart.filter(item =>
    selectedIds.includes(item.cartItemId)
  );

  // Lưu sang localStorage để trang donhang dùng
  localStorage.setItem("selectedItems", JSON.stringify(selectedItems));

  window.location.href = "donhang.html";
}

async function createCart() {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch("http://localhost:8080/tla_jew/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      }
    });

    const data = await response.json();
    console.log("Cart response:", data);
    return data;

  } catch (error) {
    console.error("Error:", error);
  }
}

// Giảm số lượng
function tru2() {
  const input = document.getElementById("soluong");
  let value = parseInt(input.value);

  if (value > 1) {
    value--;
    input.value = value;
  }
}

// Tăng số lượng
function cong2() {
  const input = document.getElementById("soluong");
  let value = parseInt(input.value);

  value++;
  input.value = value;
}

// Thêm vào giỏ hàng
async function addToCart(currentProductId) {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Vui lòng đăng nhập trước");
    window.location.href = "../login.html";
    return;
  }

  const quantity = parseInt(document.getElementById("soluong").value);

  try {
    const res = await fetch("http://localhost:8080/tla_jew/cart/createCartItem", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({
        proId: currentProductId,
        quantity: quantity
      })
    });

    if (!res.ok) {
      alert("Thêm vào giỏ hàng thất bại!");
      return;
    }

    alert("Đã thêm vào giỏ hàng!");
  } catch (err) {
    console.error(err);
    alert("Lỗi kết nối server!");
  }

  
}

//format tiền 
function formatCurrency(number) {
  return number.toLocaleString("vi-VN");
}

// Cập nhật số lượng + tổng tiền khi nhấn checkbox
function updateSelectedSummary() {
  const checkboxes = document.querySelectorAll(".cart-check:checked");

  let totalQuantity = 0;
  let totalMoney = 0;

  checkboxes.forEach(cb => {
    const quantity = parseInt(cb.dataset.quantity);
    const price = parseInt(cb.dataset.price);

    totalQuantity += quantity;
    totalMoney += quantity * price;
  });

  // Cập nhật nút Mua hàng
  document.getElementById("buyBtn").innerText =
    "Mua hàng (" + totalQuantity + ")";

  // Cập nhật tổng tiền
  document.getElementById("totalMoney").innerText =
    formatCurrency(totalMoney) + "đ";
}

async function removeItem(cartItemId, btn) {
    const token = localStorage.getItem("token");

  if (!confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;

  try {
    const res = await fetch(
      `http://localhost:8080/tla_jew/cart/deleteCartItem/${cartItemId}`,
      {
        method: "DELETE",
        headers: {
          "Authorization": "Bearer " + token
        }
      }
    );

    if (!res.ok) {
      alert("Xóa thất bại!");
      return;
    }

    // Xóa dòng khỏi bảng
    const row = btn.closest("tr");
    row.remove();

    updateSelectedSummary();

  } catch (err) {
    console.error("Lỗi chi tiết:", err);
    alert("Lỗi server!");
  }
}


