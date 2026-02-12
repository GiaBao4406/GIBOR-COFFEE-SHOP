/* 
  ========================================================================================
                              CODE BỞI NGUYỄN THẾ ANH
  ========================================================================================
*/

/**
 * loginregister.js - Xử lý logic Đăng nhập & Đăng ký
 *
 * Chức năng:
 *  1. Đăng nhập bằng Email/Password (dùng data.js + localStorage)
 *  2. Đăng ký tài khoản mới bằng Email/Password
 *
 * Lưu ý: File data.js và main.js phải được load trước file này
 */

/* ===== HÀM TIỆN ÍCH ===== */

/**
 * Tìm phần tử DOM theo ID (viết tắt)
 * @param {string} id - ID của phần tử
 * @returns {HTMLElement|null}
 */
const $ = (id) => document.getElementById(id);

/**
 * Chuyển hướng sau khi đăng nhập thành công (dùng popup thay vì alert)
 */
function redirectAfterLogin() {
  window.location.href = "index.html";
}

/* =============================================================
   TRANG ĐĂNG NHẬP (login.html)
   ============================================================= */
const loginForm = $("loginForm");

if (loginForm) {
  // Xử lý submit form đăng nhập
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = $("loginEmail").value.trim();
    const password = $("loginPassword").value;

    if (!email || !password) {
      showGiborPopup({
        type: "error",
        title: "Thiếu thông tin",
        message: "Vui lòng nhập đầy đủ email và mật khẩu.",
        confirmText: "Đã hiểu",
      });
      return;
    }

    const result = UserManager.login(email, password);

    if (result.success) {
      showGiborPopup({
        type: "success",
        title: "Đăng nhập thành công!",
        message:
          "Chào mừng " +
          result.user.displayName +
          " quay trở lại GIBOR Coffee!",
        confirmText: "Tiếp tục",
        onConfirm: () => {
          redirectAfterLogin();
        },
      });
    } else {
      showGiborPopup({
        type: "error",
        title: "Đăng nhập thất bại",
        message: result.message,
        confirmText: "Thử lại",
      });
    }
  });
}

/* =============================================================
   TRANG ĐĂNG KÝ (register.html)
   ============================================================= */
const registerForm = $("registerForm");

if (registerForm) {
  // Xử lý submit form đăng ký
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const lastName = $("regLastName").value.trim();
    const firstName = $("regFirstName").value.trim();
    const email = $("regEmail").value.trim();
    const phone = $("regPhone").value.trim();
    const password = $("regPassword").value;

    if (!lastName || !firstName || !email || !phone || !password) {
      showGiborPopup({
        type: "error",
        title: "Thiếu thông tin",
        message: "Vui lòng nhập đầy đủ thông tin đăng ký.",
        confirmText: "Đã hiểu",
      });
      return;
    }

    const result = UserManager.register({
      lastName,
      firstName,
      email,
      phone,
      password,
    });

    if (result.success) {
      showGiborPopup({
        type: "success",
        title: "Đăng ký thành công!",
        message:
          "Chào mừng " + result.user.displayName + " đến với GIBOR Coffee!",
        confirmText: "Bắt đầu khám phá",
        onConfirm: () => {
          redirectAfterLogin();
        },
      });
    } else {
      showGiborPopup({
        type: "error",
        title: "Đăng ký thất bại",
        message: result.message,
        confirmText: "Thử lại",
      });
    }
  });
}

// Toggle ẩn/hiện mật khẩu
document.addEventListener("DOMContentLoaded", () => {
  // Lấy tất cả nút toggle password trên trang
  const toggleBtns = document.querySelectorAll(".toggle-password");

  toggleBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Tìm ô input cùng nhóm
      const input = btn.parentElement.querySelector(".input-field");
      // Đổi type giữa password <-> text
      const isPassword = input.type === "password";
      input.type = isPassword ? "text" : "password";
      // Đổi icon mắt
      const icon = btn.querySelector("i");
      icon.classList.toggle("fa-eye", !isPassword);
      icon.classList.toggle("fa-eye-slash", isPassword);
    });
  });
});
/* 
  ========================================================================================
                          KẾT THÚC CODE BỞI NGUYỄN THẾ ANH
  ========================================================================================
*/
