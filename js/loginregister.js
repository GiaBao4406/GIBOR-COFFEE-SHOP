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

/**
 * Xử lý đăng nhập bằng Google qua Firebase Auth
 * Dùng cho cả trang Login và Register
 */
function handleGoogleSignIn() {
  if (typeof firebase === "undefined" || !firebase.auth) {
    showGiborPopup({
      type: "error",
      title: "Lỗi hệ thống",
      message: "Không thể kết nối Firebase. Vui lòng thử lại sau.",
      confirmText: "Đã hiểu",
    });
    return;
  }

  const provider = new firebase.auth.GoogleAuthProvider();
  provider.addScope("email");
  provider.addScope("profile");

  firebase
    .auth()
    .signInWithPopup(provider)
    .then((result) => {
      const googleUser = {
        displayName: result.user.displayName || "",
        email: result.user.email || "",
        photoURL: result.user.photoURL || "",
        uid: result.user.uid,
      };

      const loginResult = UserManager.loginWithGoogle(googleUser);

      if (loginResult.success) {
        const welcomeMsg = loginResult.isNew
          ? "Chào mừng " +
            loginResult.user.displayName +
            " đến với GIBOR Coffee!"
          : "Chào mừng " +
            loginResult.user.displayName +
            " quay trở lại GIBOR Coffee!";

        showGiborPopup({
          type: "success",
          title: loginResult.isNew
            ? "Đăng ký thành công!"
            : "Đăng nhập thành công!",
          message: welcomeMsg,
          confirmText: loginResult.isNew ? "Bắt đầu khám phá" : "Tiếp tục",
          onConfirm: () => {
            redirectAfterLogin();
          },
        });
      }
    })
    .catch((error) => {
      console.error("Google Sign-In error:", error);

      // Nếu user đóng popup → không hiện lỗi
      if (
        error.code === "auth/popup-closed-by-user" ||
        error.code === "auth/cancelled-popup-request"
      ) {
        return;
      }

      let errorMsg = "Không thể đăng nhập bằng Google. Vui lòng thử lại.";
      if (error.code === "auth/network-request-failed") {
        errorMsg = "Lỗi kết nối mạng. Vui lòng kiểm tra internet và thử lại.";
      } else if (
        error.code === "auth/account-exists-with-different-credential"
      ) {
        errorMsg = "Email này đã được liên kết với phương thức đăng nhập khác.";
      }

      showGiborPopup({
        type: "error",
        title: "Đăng nhập Google thất bại",
        message: errorMsg,
        confirmText: "Thử lại",
      });
    });
}

// Gắn sự kiện cho nút Google trên trang Login
const btnGoogleLogin = document.getElementById("btnGoogleLogin");
if (btnGoogleLogin) {
  btnGoogleLogin.addEventListener("click", handleGoogleSignIn);
}

// Gắn sự kiện cho nút Google trên trang Register
const btnGoogleRegister = document.getElementById("btnGoogleRegister");
if (btnGoogleRegister) {
  btnGoogleRegister.addEventListener("click", handleGoogleSignIn);
}

/* 
  ========================================================================================
                          KẾT THÚC CODE BỞI NGUYỄN THẾ ANH
  ========================================================================================
*/
