
document.getElementById("formLogin-admin").addEventListener("submit", async function(e) {
  e.preventDefault(); // chặn reload trang

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("http://localhost:8080/tla_jew/auth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    });

    const data = await res.json();

    if (data.code === 0 && data.result.authenticated) {
        // lưu token
        localStorage.setItem("token", data.result.token);

        alert("Đăng nhập thành công");
        window.location.href = "thongtin_admin.html";
    } else {
      alert("Sai tài khoản hoặc mật khẩu");
    }
  } catch (err) {
    console.error(err);
    alert("Không kết nối được server");
  }
});






