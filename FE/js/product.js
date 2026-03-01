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

async function showType() {
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

        const select = document.getElementById("typeId");

        if (!select) return;

        // reset option cũ (tránh bị lặp)
        select.innerHTML = '<option value="">-- Chọn loại sản phẩm --</option>';

        data.forEach(type => {
            const option = document.createElement("option");
            option.value = type.typeId;
            option.textContent = type.typeName;
            select.appendChild(option);
        });

    } catch (error) {
        console.error("Lỗi khi load loại sản phẩm:", error);
    }
}


// =======================
// THÊM SẢN PHẨM
// =======================
function handleAddProduct() {
  const form = document.getElementById("formAddProduct");

  if (!form) return;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const token = checkToken();
    if (!token) return;

    const formData = new FormData();
    formData.append("proName", document.querySelector('[name="tensanpham"]').value);
    formData.append("proCost", document.querySelector('[name="dongia"]').value);
    formData.append("proCount", document.querySelector('[name="soluong"]').value);
    formData.append("proDetail", document.querySelector('[name="mota"]').value);
    formData.append("typeId", document.getElementById("typeId").value);

    const fileInput = document.getElementById("formFile");
    if (fileInput.files.length > 0) {
      formData.append("file", fileInput.files[0]);
    }

    const res = await fetch("http://localhost:8080/tla_jew/pro", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + token
      },
      body: formData
    });

    if (!res.ok) {
      alert("Thêm sản phẩm thất bại!");
      return;
    }

    alert("Thêm sản phẩm thành công!");
    window.location.href = "sanphamcuatoi.html";
  });
}

async function showProduct() {
  const tbody=document.getElementById("productTableBody");
  if(!tbody) return;

  const token = checkToken();
  if (!token) return;

  try{
    const res = await fetch (`http://localhost:8080/tla_jew/pro`,{
      method: "GET",
      headers: {
        Authorization: "Bearer "+token,
        "Content-Type":"application/json"
      }
    });

    if(!res.ok){
      alert("Không lấy được danh sách sản phẩm!");
      return;
    }

    const data=await res.json();

    tbody.innerHTML="";

    data.forEach(t => {
      tbody.innerHTML += `
      <tr>
              <td>
                <img src="data:image/jpeg;base64,${t.proImg}" 
                     style="object-fit: cover; border-radius: 6px;" width="150" height="80">
              </td>
              <td>${t.proName}</td>
              <td>${t.productType.typeName}</td>
              <td>${t.proCost}₫</td>
              <td>${t.proCount}</td>
              <td>
                <a href="updatesp.html?proId=${t.proId}" 
                   class="btn btn-warning btn-sm">Cập nhật</a>

              <button 
                class="btn btn-danger btn-sm"
                onclick="deleteProduct('${t.proId}')">
                Xóa
              </button>
              </td>
            </tr>
      `
      ;
    });
  }
  catch(err){
    console.error(err);
    alert("Lỗi kết nối server!");
  }
}

// =======================
// Hien thi update
// =======================
async function showUpdateProduct() {
  const proName=document.getElementById("proName");
  const proCount=document.getElementById("proCount");
  const proCost=document.getElementById("proCost");
  const proImg=document.getElementById("proImg");
  const proDetail=document.getElementById("proDetail");
  const typeId=document.getElementById("typeId");

  if(!proName) return;

  const token=checkToken();
  if(!token) return;

  const params=new URLSearchParams(window.location.search);
  const proId=params.get("proId");

  if(!proId){
    alert("Không tìm thấy ID sản phẩm!");
    return;
  }

  try{
    const res = await fetch(`http://localhost:8080/tla_jew/pro/${proId}`, {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
      }
    });

    if(!res.ok){
      alert("Không lấy được thông tin sản phẩm!");
      return;
    }

    const data=await res.json();

    proName.value=data.proName;
    proCost.value=data.proCost;
    proCount.value=data.proCount;
    proImg.src = "data:image/*;base64," + data.proImg;
    proDetail.value=data.proDetail;
    typeId.value=data.productType.typeId;
  }
  catch(err){
    console.error(err);
    alert("Lỗi kết nối server!");
  }
}

// =======================
// Update sản phẩm
// =======================
function handleUpdateProduct(){
  const form = document.getElementById("formUpdateProduct");

  if(!form) return;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    
    const token=checkToken();
    if(!token) return;

    const formData=new FormData();

    formData.append("proName", document.getElementById("proName").value);
    formData.append("proCost", document.getElementById("proCost").value);
    formData.append("proCount", document.getElementById("proCount").value);
    formData.append("proDetail", document.getElementById("proDetail").value);
    formData.append("typeId", document.getElementById("typeId").value);

    const fileInput=document.getElementById("formFile");
    if(fileInput.files.length > 0){
      formData.append("file", fileInput.files[0]);
    }

    // LẤY typeId TỪ URL
    const params = new URLSearchParams(window.location.search);
    const proId = params.get("proId");

    if (!proId) {
      alert("Không tìm thấy ID sản phẩm!");
      return;
    }

    const res=await fetch(`http://localhost:8080/tla_jew/pro/${proId}`,{
      method: "PUT",
      headers: {
        "Authorization": "Bearer " + token
      },
      body: formData
    });

    if(!res.ok){
      alert("Cập nhật sản phẩm thất bại!");
      return;
    }
    alert("Cập nhật sản phẩm thành công!");
    window.location.href = "sanphamcuatoi.html";
  });
}
// =======================
// Xóa sản phẩm
// =======================
async function deleteProduct(proId) {
  if(!confirm("Bạn chắc chắn muốn xóa sản phẩm này?"))return;

  const token = checkToken();
  if (!token) return;

  try{
    const res = await fetch(
      `http://localhost:8080/tla_jew/pro/${proId}`,
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
      alert("Xóa sản phẩm thành công!");
      showProduct(); // reload lại bảng
      return;
    }

    const data = await res.json();
    alert(data.message || "Xóa thất bại!");

  } catch (err) {
    console.error(err);
    alert("Không thể kết nối server!");
  }
}

document.addEventListener("DOMContentLoaded", function () {
    showProduct();
    showType();
    handleAddProduct();

    const params = new URLSearchParams(window.location.search);
    const proId = params.get("proId");
    if(proId){
     showUpdateProduct();
      handleUpdateProduct();
    }
});