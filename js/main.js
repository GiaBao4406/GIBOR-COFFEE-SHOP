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

// ==================== HAMBURGER MENU MOBILE ====================
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.querySelector(".nav");

if (menuToggle && navMenu) {
  menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");
    menuToggle.classList.toggle("active");
  });

  // Đóng menu khi click vào link
  const navLinks = navMenu.querySelectorAll(".nav-links a");
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
      menuToggle.classList.remove("active");
    });
  });

  // Đóng menu khi click bên ngoài
  navMenu.addEventListener("click", (e) => {
    if (e.target === navMenu) {
      navMenu.classList.remove("active");
      menuToggle.classList.remove("active");
    }
  });
}

// Hiệu ứng nền tối
const toggleBtn = document.getElementById("themeToggle");

if (toggleBtn) {
  toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    const isDark = document.body.classList.contains("dark");
    toggleBtn.textContent = isDark ? "☀️" : "🌙";

    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
}

// Load lại trạng thái
window.onload = () => {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    if (toggleBtn) toggleBtn.textContent = "☀️";
  }
};

// Xử lý Preloader - dùng DOMContentLoaded để không đợi fonts/iframe
document.addEventListener("DOMContentLoaded", () => {
  const preloader = document.getElementById("preloader");
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add("preloader-hidden");
    }, 500); // Hiển thị 0.5 giây
  }
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

  // Ẩn thông báo lỗi size khi đã chọn
  const sizeError = document.getElementById("sizeError");
  if (sizeError) sizeError.classList.remove("show");

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

/* 
========================================================================================

                                    CODE BỞI TRẦN DƯƠNG GIA BẢO

========================================================================================
*/

// ==================== THÊM VÀO GIỎ HÀNG ====================
function addToCart() {
  const sizeError = document.getElementById("sizeError");

  // Kiểm tra đã chọn size chưa
  if (!selectedSize || selectedPrice === 0) {
    // Hiện thông báo lỗi màu đỏ
    if (sizeError) sizeError.classList.add("show");
    return;
  }

  // Ẩn thông báo lỗi nếu đã chọn size
  if (sizeError) sizeError.classList.remove("show");

  // Lấy giỏ hàng hiện tại
  const cart = JSON.parse(localStorage.getItem("giborCart") || "[]");

  // Lấy ghi chú
  const noteEl = document.getElementById("popupNote");
  const note = noteEl ? noteEl.value.trim() : "";

  // Kiểm tra sản phẩm đã tồn tại chưa (cùng tên + size + đường + đá + ghi chú)
  const existIndex = cart.findIndex(
    (item) =>
      item.name === currentProduct.name &&
      item.size === selectedSize &&
      item.sugar === selectedSugar &&
      item.ice === selectedIce &&
      item.note === note,
  );

  if (existIndex !== -1) {
    // Nếu đã có (cùng tùy chọn) thì tăng số lượng
    cart[existIndex].quantity += 1;
  } else {
    // Nếu chưa có thì thêm mới
    cart.push({
      name: currentProduct.name,
      image: currentProduct.img,
      size: selectedSize,
      price: selectedPrice,
      sugar: selectedSugar,
      ice: selectedIce,
      note: note,
      quantity: 1,
    });
  }

  // Lưu lại vào localStorage
  localStorage.setItem("giborCart", JSON.stringify(cart));

  // Cập nhật số lượng trên icon giỏ hàng
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartBadges = document.querySelectorAll(
    ".icon-btn.cart span:last-child",
  );
  cartBadges.forEach((badge) => {
    badge.textContent = totalItems;
  });

  // Đóng popup và hiện toast thông báo
  closePopup();
  showPopupToast(
    'Đã thêm "' +
      currentProduct.name +
      '" (Size ' +
      selectedSize +
      ") vào giỏ hàng!",
  );
}

// ==================== TOAST THÔNG BÁO (MENU PAGE) ====================
function showPopupToast(message) {
  const toast = document.getElementById("popupToast");
  const toastMsg = document.getElementById("popupToastMsg");
  if (!toast || !toastMsg) {
    // Fallback nếu không có toast element
    alert(message);
    return;
  }
  toastMsg.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

// Cập nhật số lượng giỏ hàng khi load trang
document.addEventListener("DOMContentLoaded", () => {
  const cart = JSON.parse(localStorage.getItem("giborCart") || "[]");
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartBadges = document.querySelectorAll(
    ".icon-btn.cart span:last-child",
  );
  cartBadges.forEach((badge) => {
    badge.textContent = totalItems;
  });
});
/* 
========================================================================================

                                KẾT THÚC CODE BỞI TRẦN DƯƠNG GIA BẢO

========================================================================================
*/
