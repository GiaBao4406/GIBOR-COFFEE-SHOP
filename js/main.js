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

/* 
========================================================================================

                                CODE BỞI NGUYỄN HOÀNG BẢO

========================================================================================
*/

// Mở popup
let currentProduct = { name: "", img: "", basePrice: 0 };
let selectedSize = "";
let selectedPrice = 0;
let selectedSugar = "50%";
let selectedIce = "100%";

function openPopup(name, img, basePrice) {
  const popup = document.getElementById("popup");
  if (!popup) return;

  popup.style.display = "flex";
  document.getElementById("popup-name").innerText = name;
  document.getElementById("popup-img").src = img;

  // Lưu thông tin sản phẩm hiện tại
  currentProduct = { name, img, basePrice: basePrice || 0 };
  selectedSize = "";
  selectedPrice = 0;

  // Reset giá khi mở popup
  document.getElementById("price-value").innerText = "0";

  // Tính giá theo size dựa trên giá gốc của sản phẩm
  const priceS = basePrice;
  const priceM = basePrice + 5000;
  const priceL = basePrice + 10000;

  // Cập nhật giá hiển thị trên mỗi nút size
  const elPriceS = document.getElementById("price-s");
  const elPriceM = document.getElementById("price-m");
  const elPriceL = document.getElementById("price-l");
  if (elPriceS) elPriceS.textContent = priceS.toLocaleString("vi-VN") + "đ";
  if (elPriceM) elPriceM.textContent = priceM.toLocaleString("vi-VN") + "đ";
  if (elPriceL) elPriceL.textContent = priceL.toLocaleString("vi-VN") + "đ";

  // Gán sự kiện click cho các nút size
  const btnS = document.getElementById("btn-size-s");
  const btnM = document.getElementById("btn-size-m");
  const btnL = document.getElementById("btn-size-l");
  if (btnS)
    btnS.onclick = function () {
      selectSize("S", priceS, this);
    };
  if (btnM)
    btnM.onclick = function () {
      selectSize("M", priceM, this);
    };
  if (btnL)
    btnL.onclick = function () {
      selectSize("L", priceL, this);
    };

  // Reset active class trên các nút size
  document.querySelectorAll(".size-options button").forEach((btn) => {
    btn.classList.remove("active");
  });

  // Reset đường = 50%, đá = 100% (mặc định)
  selectedSugar = "50%";
  selectedIce = "100%";
  document.querySelectorAll("#sugarOptions .option-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.textContent.trim() === "50%");
  });
  document.querySelectorAll("#iceOptions .option-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.textContent.trim() === "100%");
  });

  // Reset ghi chú
  const noteEl = document.getElementById("popupNote");
  if (noteEl) noteEl.value = "";
}

// Đóng popup
function closePopup() {
  const popup = document.getElementById("popup");
  if (popup) popup.style.display = "none";
}

// Chọn size
function selectSize(size, price, btnElement) {
  selectedSize = size;
  selectedPrice = price;
  document.getElementById("price-value").innerText =
    price.toLocaleString("vi-VN");

  // Đánh dấu nút được chọn
  document.querySelectorAll(".size-options button").forEach((btn) => {
    btn.classList.remove("active");
  });
  if (btnElement) btnElement.classList.add("active");
}

// Chọn lượng đường / đá
function selectOption(type, value, btnElement) {
  // Cập nhật giá trị
  if (type === "sugar") selectedSugar = value;
  if (type === "ice") selectedIce = value;

  // Đánh dấu nút được chọn trong nhóm
  const parent = btnElement.parentElement;
  parent.querySelectorAll(".option-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  btnElement.classList.add("active");
}

/* 
========================================================================================

                                KẾT THÚC CODE BỞI NGUYỄN HOÀNG BẢO

========================================================================================
*/
