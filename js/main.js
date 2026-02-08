/* 
========================================================================================

                                    CODE BỞI TRẦN GIA BẢO

========================================================================================
*/

// Cuộn xuống thanh vẫn theo
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".header");
  navbar.classList.toggle("scrolled", window.scrollY > 50);
});

// Hiệu ứng nền tối
const toggleBtn = document.getElementById("themeToggle");

toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  const isDark = document.body.classList.contains("dark");
  toggleBtn.textContent = isDark ? "☀️" : "🌙";

  localStorage.setItem("theme", isDark ? "dark" : "light");
});

// Load lại trạng thái
window.onload = () => {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    toggleBtn.textContent = "☀️";
  }
};

// Xử lý Preloader
window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");
  setTimeout(() => {
    preloader.classList.add("preloader-hidden");
  }, 1200); // Hiển thị 1.2 giây để khách thấy logo
});

/* 
========================================================================================

                                KẾT THÚC CODE BỞI TRẦN GIA BẢO

========================================================================================
*/
