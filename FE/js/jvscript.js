/********************
     MENU
    *********************/
const menuList = document.getElementById("menu-list");
const tamgiacphai = document.getElementsByClassName(" fa-caret-right");
const accessoriesList = document.getElementById("accesories-list-item");
const tamgiactrai = document.getElementsByClassName("fa-caret-left");

function menuIconclick() {
  menuList.classList.toggle("hidden");
}

function closeMenuclick() {
  menuList.classList.add("hidden");
  accessoriesList.classList.add("hidden1");
}

for (let i = 0; i < tamgiacphai.length; i++) {
  tamgiacphai[i].addEventListener("click", function () {
    accessoriesList.classList.toggle("hidden1");
  });
}
for (let i = 0; i < tamgiactrai.length; i++) {
  tamgiactrai[i].addEventListener("click", function () {
    accessoriesList.classList.add("hidden1");
  });
}
// ==========================
// HIỂN THỊ SẢN PHẨM
// ==========================
async function loadProductsForUser() {

  const container = document.querySelector(".grid-container");
  if (!container) return;

  try {

    const res = await fetch("http://localhost:8080/tla_jew/pro");

    if (!res.ok) {
      console.error("Không lấy được sản phẩm");
      return;
    }

    const data = await res.json();

    container.innerHTML = "";

    data.forEach(product => {

      container.innerHTML += `
        <div class="product_sanpham">
            <a href="detail_product.html?proId=${product.proId}" class="product_link">

                <img src="data:image/jpeg;base64,${product.proImg}" alt="${product.proName}">

                <p class="product_info">${product.proName}</p>

                <p class="product_price">
                  ${Number(product.proCost).toLocaleString('vi-VN')} VND
                </p>

            </a>
        </div>
      `;

    });

  } catch (error) {
    console.error("Lỗi kết nối server:", error);
  }
}

let currentProductId = null;
// Hiển thị chi tiết sản phẩm
function showDetailPro() {

    // Lấy proId từ URL
    const params = new URLSearchParams(window.location.search);
    const proId = params.get("proId");
    currentProductId=proId;

    if (!proId) {
        alert("Không tìm thấy sản phẩm!");
        return;
    }

    fetch(`http://localhost:8080/tla_jew/pro/${proId}`)
        .then(response => response.json())
        .then(data => {

            // Tên
            document.getElementById("proName").innerText = data.proName;

            // Giá
            document.getElementById("proCost").innerText =
                data.proCost.toLocaleString("vi-VN") + "₫";

            // Mô tả
            document.getElementById("proDetail").innerText = data.proDetail;

            // Ảnh base64
            if (data.proImg) {
            document.getElementById("proImg").src =
                `data:image/jpeg;base64,${data.proImg}`;
            } else {
                console.log("Không có ảnh");
            }


        })
        .catch(error => {
            console.error("Lỗi khi load sản phẩm:", error);
            alert("Không thể tải sản phẩm!");
        });
}
// =======================
// Hiển thị danh sách sản phẩm theo mã loại
// =======================
async function showProductByTypeId() {
  const container = document.querySelector(".grid-container");

  try {

    const urlParams = new URLSearchParams(window.location.search); 
    const typeId = urlParams.get("typeId");

    const res = await fetch(`http://localhost:8080/tla_jew/pro/type/${typeId}`);

    if (!res.ok) {
      console.error("Không lấy được sản phẩm");
      return;
    }

    const data = await res.json();

    container.innerHTML = "";

    data.forEach(product => {

      container.innerHTML += `
        <div class="product_sanpham">
            <a href="detail_product.html?proId=${product.proId}" class="product_link">

                <img src="data:image/jpeg;base64,${product.proImg}" alt="${product.proName}">

                <p class="product_info">${product.proName}</p>

                <p class="product_price">
                  ${Number(product.proCost).toLocaleString('vi-VN')} VND
                </p>

            </a>
        </div>
      `;

    });

  } catch (error) {
    console.error("Lỗi kết nối server:", error);
  }
  
}

document.addEventListener("DOMContentLoaded", function () { 
  const params = new URLSearchParams(window.location.search); 
  const proId = params.get("proId"); 
  const typeId = params.get("typeId"); 

  const currentPage = window.location.pathname;

  if (proId) { 
      showDetailPro(); 
      return;
  } 

  if (typeId) { 
      showProductByTypeId(); 
      return;
  } 

  // CHỈ load tất cả nếu đang ở trang list_product
  if (currentPage.includes("list_product.html")) {
      loadProductsForUser();
  }
});

