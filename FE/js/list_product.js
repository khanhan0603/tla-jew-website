document.addEventListener("DOMContentLoaded", function () {

    const params = new URLSearchParams(window.location.search);
    const keyword = params.get("keyword");

    if (!keyword) return;

    searchProducts(keyword);
});

async function searchProducts(keyword, page = 0) {

    try {
        const response = await fetch(
            `http://localhost:8080/tla_jew/pro/search?keyword=${encodeURIComponent(keyword)}&page=${page}&size=8`
        );

        const data = await response.json();

        console.log("Status:", response.status);
        console.log("Data:", data);

        if (data.code !== 0) {
            alert(data.message || "Lỗi từ backend");
            return;
        }

        renderProducts(data.result.content);

    } catch (error) {
        console.error("Fetch error:", error);
        alert("Không thể kết nối server");
    }
}
function renderProducts(products) {

    const container = document.getElementById("productContainer");

    if (!container) {
        console.error("Không tìm thấy productContainer");
        return;
    }

    container.innerHTML = "";

    products.forEach(product => {

        const imageSrc = product.proImg
            ? `data:image/jpeg;base64,${product.proImg}`
            : "default.jpg";

        const html = `
            <div class="product_sanpham">
                <a href="product_detail.html?id=${product.proId}" class="product_link">
                    <img src="${imageSrc}" />
                    <p class="product_info">${product.proName}</p>
                    <p class="product_price">
                        ${Number(product.proCost).toLocaleString()} VND
                    </p>
                </a>
            </div>
        `;

        container.innerHTML += html;
    });
}