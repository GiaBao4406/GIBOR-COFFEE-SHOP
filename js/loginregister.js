/* 
  ========================================================================================
                              CODE BỞI NGUYỄN THẾ ANH
  ========================================================================================
*/

/**
 * loginregister.js - Xử lý logic Đăng nhập & Đăng ký
 *
 * Chức năng:
 *  1. Đăng nhập bằng Email/Password
 *  2. Đăng ký tài khoản mới bằng Email/Password
 *  3. Đăng nhập bằng Google (popup)
 *  4. Đăng nhập bằng Facebook (popup)
 *  5. Gửi email đặt lại mật khẩu (Quên mật khẩu)
 *
 * Lưu ý: File này phải được load với type="module"
 */

import { auth } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  updateProfile,
  sendPasswordResetEmail,
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

/* ===== HÀM TIỆN ÍCH ===== */

/**
 * Tìm phần tử DOM theo ID (viết tắt)
 * @param {string} id - ID của phần tử
 * @returns {HTMLElement|null}
 */
const $ = (id) => document.getElementById(id);

/**
 * Chuyển mã lỗi Firebase thành thông báo tiếng Việt dễ hiểu
 * @param {Error} err - Lỗi từ Firebase Auth
 * @returns {string} Thông báo lỗi tiếng Việt
 */
function friendlyError(err) {
  const code = err?.code || "";

  const errorMap = {
    "auth/invalid-email": "Email không hợp lệ.",
    "auth/user-not-found": "Không tìm thấy tài khoản.",
    "auth/wrong-password": "Sai mật khẩu.",
    "auth/invalid-credential": "Email hoặc mật khẩu không đúng.",
    "auth/email-already-in-use": "Email đã được dùng để đăng ký.",
    "auth/weak-password": "Mật khẩu quá yếu (tối thiểu 6 ký tự).",
    "auth/popup-closed-by-user": "Bạn đã đóng cửa sổ đăng nhập.",
    "auth/too-many-requests": "Quá nhiều lần thử. Vui lòng đợi rồi thử lại.",
  };

  // Tìm mã lỗi khớp trong danh sách
  for (const [key, message] of Object.entries(errorMap)) {
    if (code.includes(key)) return message;
  }

  return err?.message || "Có lỗi xảy ra. Vui lòng thử lại.";
}

/* ===== CÁC HÀM XÁC THỰC ===== */

/**
 * Đăng nhập bằng Email & Password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>} - Đối tượng user Firebase
 */
async function loginEmailPassword(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

/**
 * Đăng ký tài khoản mới bằng Email & Password
 * Có thể set displayName (Họ Tên) cho user
 * @param {Object} params
 * @param {string} params.email
 * @param {string} params.password
 * @param {string} [params.displayName]
 * @returns {Promise<User>}
 */
async function registerEmailPassword({ email, password, displayName }) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);

  // Cập nhật tên hiển thị nếu có
  if (displayName?.trim()) {
    await updateProfile(cred.user, { displayName: displayName.trim() });
  }

  return cred.user;
}

/**
 * Đăng nhập bằng tài khoản Google (popup)
 * @returns {Promise<User>}
 */
async function signInGoogle() {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  const cred = await signInWithPopup(auth, provider);
  return cred.user;
}

/**
 * Đăng nhập bằng tài khoản Facebook (popup)
 * @returns {Promise<User>}
 */
async function signInFacebook() {
  const provider = new FacebookAuthProvider();
  const cred = await signInWithPopup(auth, provider);
  return cred.user;
}

/**
 * Chuyển hướng sau khi đăng nhập thành công
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
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = $("loginEmail").value.trim();
    const password = $("loginPassword").value;

    try {
      await loginEmailPassword(email, password);
      alert("Đăng nhập thành công!");
      redirectAfterLogin();
    } catch (err) {
      alert(friendlyError(err));
    }
  });

  // Đăng nhập bằng Google
  $("btnGoogleLogin")?.addEventListener("click", async () => {
    try {
      await signInGoogle();
      alert("Đăng nhập Google thành công!");
      redirectAfterLogin();
    } catch (err) {
      alert(friendlyError(err));
    }
  });

  // Đăng nhập bằng Facebook
  $("btnFacebookLogin")?.addEventListener("click", async () => {
    try {
      await signInFacebook();
      alert("Đăng nhập Facebook thành công!");
      redirectAfterLogin();
    } catch (err) {
      alert(friendlyError(err));
    }
  });

  // Quên mật khẩu — gửi email reset
  $("forgotPasswordLink")?.addEventListener("click", async (e) => {
    e.preventDefault();

    const email = $("loginEmail")?.value?.trim();
    if (!email) {
      return alert("Nhập email trước để gửi link đặt lại mật khẩu.");
    }

    try {
      await sendPasswordResetEmail(auth, email);
      alert("Đã gửi email đặt lại mật khẩu. Kiểm tra inbox/spam nhé!");
    } catch (err) {
      alert(friendlyError(err));
    }
  });
}

/* =============================================================
   TRANG ĐĂNG KÝ (register.html)
   ============================================================= */
const registerForm = $("registerForm");

if (registerForm) {
  // Xử lý submit form đăng ký
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const lastName = $("regLastName").value.trim();
    const firstName = $("regFirstName").value.trim();
    const email = $("regEmail").value.trim();
    const phone = $("regPhone").value.trim(); // Lưu tạm, chưa lưu vào DB
    const password = $("regPassword").value;

    // Ghép Họ + Tên thành displayName
    const displayName = `${lastName} ${firstName}`.trim();

    try {
      await registerEmailPassword({ email, password, displayName });
      alert("Đăng ký thành công! Bạn đã được đăng nhập.");
      redirectAfterLogin();
    } catch (err) {
      alert(friendlyError(err));
    }
  });

  // Đăng ký bằng Google (Firebase tự tạo user mới nếu chưa có)
  $("btnGoogleRegister")?.addEventListener("click", async () => {
    try {
      await signInGoogle();
      alert("Đăng ký/Đăng nhập Google thành công!");
      redirectAfterLogin();
    } catch (err) {
      alert(friendlyError(err));
    }
  });

  // Đăng ký bằng Facebook
  $("btnFacebookRegister")?.addEventListener("click", async () => {
    try {
      await signInFacebook();
      alert("Đăng ký/Đăng nhập Facebook thành công!");
      redirectAfterLogin();
    } catch (err) {
      alert(friendlyError(err));
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
