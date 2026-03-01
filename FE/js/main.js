document.addEventListener("DOMContentLoaded", function () {

    // ===== MENU =====

    const menuList = document.getElementById("menu-list");
    const accessoriesList = document.getElementById("accesories-list-item");
    const tamgiacphai = document.getElementsByClassName("fa-caret-right");
    const tamgiactrai = document.getElementsByClassName("fa-caret-left");

    window.menuIconclick = function () {
        if (menuList) {
            menuList.classList.toggle("hidden");
        }
    };

    window.closeMenuclick = function () {
        if (menuList) menuList.classList.add("hidden");
        if (accessoriesList) accessoriesList.classList.add("hidden1");
    };

    for (let i = 0; i < tamgiacphai.length; i++) {
        tamgiacphai[i].addEventListener("click", function () {
            if (accessoriesList) {
                accessoriesList.classList.toggle("hidden1");
            }
        });
    }

    for (let i = 0; i < tamgiactrai.length; i++) {
        tamgiactrai[i].addEventListener("click", function () {
            if (accessoriesList) {
                accessoriesList.classList.add("hidden1");
            }
        });
    }

    // ===== CHECKBOX CART =====

    document.addEventListener("change", function (e) {
        if (e.target.classList.contains("product-check")) {
            updateCartTotal();
        }
    });

    // ===== REMOVE CART AJAX =====

    document.addEventListener("click", function (e) {

        if (e.target.classList.contains("remove-cart")) {

            const id = e.target.getAttribute("data-id");

            if (!confirm("Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?")) {
                return;
            }

            fetch("/BanTrangSuc/ajax_remove_cart", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: "masanpham=" + id
            })
                .then(res => res.json())
                .then(data => {

                    if (data.success) {

                        e.target.closest("tr").remove();

                        document.querySelectorAll("#count-of-cart, .cart-count")
                            .forEach(el => el.innerText = data.count);

                        document.getElementById("shoping_checkout_total")
                            .innerText = data.total.toLocaleString("vi-VN") + " đ";

                        document.getElementById("totalQuantity")
                            .innerText = data.count;

                        if (data.count === 0) {
                            document.querySelector(".addcart").innerHTML = `
                                <tr>
                                    <td colspan="6" class="text-center py-5"
                                        style="font-size: 20px; font-weight: 600; color: #666;">
                                        Không có sản phẩm trong giỏ hàng
                                    </td>
                                </tr>
                            `;
                        }
                    }
                })
                .catch(err => console.log("Lỗi:", err));
        }
    });

});


// ===== TÍNH TỔNG =====

function updateCartTotal() {

    let totalQty = 0;
    let totalPrice = 0;

    document.querySelectorAll(".addcart tr").forEach(function (row) {

        const check = row.querySelector(".product-check");

        if (check && check.checked) {

            const qtyElement = row.querySelector(".shoping__cart__quantity");
            const totalElement = row.querySelector(".shoping__cart__total");

            if (qtyElement && totalElement) {

                const qty = parseInt(qtyElement.innerText) || 0;

                const priceText = totalElement.innerText;
                const itemTotal = parseInt(priceText.replace(/\D/g, "")) || 0;

                totalQty += qty;
                totalPrice += itemTotal;
            }
        }
    });

    const totalDisplay = document.getElementById("shoping_checkout_total");
    const qtyDisplay = document.getElementById("totalQuantity");

    if (totalDisplay) {
        totalDisplay.innerText = totalPrice.toLocaleString("vi-VN") + " đ";
    }

    if (qtyDisplay) {
        qtyDisplay.innerText = totalQty;
    }
}