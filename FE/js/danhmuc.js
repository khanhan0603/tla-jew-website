// =======================
// HIỂN THỊ DANH SÁCH LOẠI
// =======================
async function openDanhMuc() {
    const li=document.getElementById("danhmuc");
  try {
    const res = await fetch("http://localhost:8080/tla_jew/types");

    if (!res.ok) {
      alert("Không lấy được danh sách loại sản phẩm!");
      return;
    }

    const data = await res.json();
    // tìm hoặc tạo container con để chứa danh mục động 
    let dynamicContainer = document.getElementById("dynamic-types"); 
    if (!dynamicContainer) { 
        dynamicContainer = document.createElement("div"); 
        dynamicContainer.id = "dynamic-types"; 
        danhMuc.appendChild(dynamicContainer); 
    } dynamicContainer.innerHTML = ""; // clear cũ 
    data.forEach(t => { 
            dynamicContainer.innerHTML += ` 
            <button type="button" class="submitsp" onclick="window.location.href='/layouts-part/product/list_product.html?typeId=${t.typeId}'"> 
                ${t.typeName} 
            </button> <br> `; 
        });

  } catch (err) {
    console.error(err);
    alert("Lỗi kết nối server!");
  }
}