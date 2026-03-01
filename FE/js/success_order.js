document.addEventListener("DOMContentLoaded", () => {
  loadSuccessOrder();
});
async function loadSuccessOrder() {
    const params=new URLSearchParams(window.location.search);
    const orderId=params.get("orderId");
    const token = localStorage.getItem("token");
    const tbody = document.getElementById("orderItems");

    if(!tbody)return;

    if (!token) {
    alert("Vui lòng đăng nhập trước");
    window.location.href = "login.html";
    return;
  }
  if (!orderId) {
        alert("Không tìm thấy mã đơn hàng!");
        return;
    }

  try{
    const res = await fetch(`http://localhost:8080/tla_jew/order/user/${orderId}`, {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
      }
    });

    if(!res.ok){
        alert("Không lấy được thông tin order!");
        return;
    }

    const data=await res.json();

    // Đổ thông tin chung
        document.getElementById("orderId").innerText = `Mã hóa đơn: ${data.orderId}`;
        document.getElementById("fullName").innerText = `Họ và tên: ${data.fullName}`;
        document.getElementById("phone").innerText = `Số điện thoại: ${data.phone}`;
        document.getElementById("address").innerText = `Địa chỉ: ${data.address}`;
        document.getElementById("totalPrice").innerText = 
            `Tổng tiền: ${formatMoney(data.totalPrice)}`;

    // Đổ sản phẩm
        
        tbody.innerHTML = "";

        if (!data.orderItems || data.orderItems.length === 0) {
            tbody.innerHTML = 
                `<tr><td colspan="5">Không có sản phẩm trong hóa đơn!</td></tr>`;
            return;
        }

        data.orderItems.forEach(item => {
            const row = `
                <tr>
                    <td>${item.proName}</td>
                    <td>${item.quantity}</td>
                    <td>${formatMoney(item.price)} đ</td>
                    <td>${formatMoney(item.total)} đ</td>
                    <td>COD</td>
                </tr>
            `;
            tbody.innerHTML += row;
            localStorage.removeItem("selectedItems");
        });
  
  } catch (err) {
    console.error(err);
    alert("Lỗi kết nối server!");
  }
}
function formatMoney(number) {
    return new Intl.NumberFormat("vi-VN").format(number);
}