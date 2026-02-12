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

  // ===== HIỂN THỊ TRẠNG THÁI ĐĂNG NHẬP TRÊN HEADER =====
  const authLink = document.getElementById("authLink");
  if (authLink && typeof UserManager !== "undefined") {
    const currentUser = UserManager.getCurrentUser();
    if (currentUser) {
      // Đã đăng nhập → hiển thị tên người dùng (Họ + Tên)
      authLink.innerHTML =
        '<i class="fas fa-user-circle"></i> ' + currentUser.displayName;
      authLink.href = "#";
      authLink.classList.add("logged-in");
      authLink.title = "Tài khoản của bạn";
      authLink.style.cursor = "pointer";

      // Tạo user dropdown popup
      const dropdownOverlay = document.createElement("div");
      dropdownOverlay.className = "user-dropdown-overlay";
      dropdownOverlay.id = "userDropdownOverlay";

      // Lấy chữ cái đầu của tên
      const initials = (
        currentUser.lastName.charAt(0) + currentUser.firstName.charAt(0)
      ).toUpperCase();

      dropdownOverlay.innerHTML =
        '<div class="user-dropdown">' +
        '<div class="user-dropdown-header">' +
        '<div class="user-dropdown-avatar">' +
        initials +
        "</div>" +
        '<div class="user-dropdown-info">' +
        '<div class="user-dropdown-name">' +
        currentUser.displayName +
        "</div>" +
        '<div class="user-dropdown-email">' +
        currentUser.email +
        "</div>" +
        "</div>" +
        "</div>" +
        '<ul class="user-dropdown-menu">' +
        '<li><a href="#"><i class="fas fa-user"></i> Tài khoản của tôi</a></li>' +
        '<li><a href="#" id="btnOrderHistory"><i class="fas fa-shopping-bag"></i> Đơn hàng</a></li>' +
        '<li><button class="logout-btn" id="btnLogout"><i class="fas fa-sign-out-alt"></i> Đăng xuất</button></li>' +
        "</ul>" +
        "</div>";

      document.body.appendChild(dropdownOverlay);

      // Click vào tên → mở/đóng dropdown
      authLink.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropdownOverlay.classList.toggle("show");
      });

      // Click overlay → đóng dropdown
      dropdownOverlay.addEventListener("click", (e) => {
        if (e.target === dropdownOverlay) {
          dropdownOverlay.classList.remove("show");
        }
      });

      // Nút đăng xuất → hiện popup xác nhận
      document.getElementById("btnLogout").addEventListener("click", () => {
        dropdownOverlay.classList.remove("show");
        showGiborPopup({
          type: "warning",
          title: "Đăng xuất",
          message: "Bạn có chắc muốn đăng xuất khỏi tài khoản?",
          confirmText: "Đăng xuất",
          cancelText: "Hủy",
          onConfirm: () => {
            UserManager.logout();
            showGiborPopup({
              type: "success",
              title: "Đã đăng xuất",
              message: "Hẹn gặp lại bạn tại GIBOR Coffee!",
              confirmText: "OK",
              onConfirm: () => {
                window.location.reload();
              },
            });
          },
        });
      });

      // Nút đơn hàng → hiện popup lịch sử đơn hàng
      document
        .getElementById("btnOrderHistory")
        .addEventListener("click", (e) => {
          e.preventDefault();
          dropdownOverlay.classList.remove("show");
          showOrderHistoryPopup();
        });
    }
    // Nếu chưa đăng nhập → giữ nguyên link "Đăng nhập"
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
    // Hiện thông báo lỗi bằng popup
    if (sizeError) sizeError.classList.add("show");
    showGiborPopup({
      type: "warning",
      title: "Chưa chọn Size",
      message: "Vui lòng chọn size (S, M hoặc L) trước khi thêm vào giỏ hàng.",
      confirmText: "Đã hiểu",
    });
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

                                    CODE BỞI TRẦN DƯƠNG GIA BẢO

========================================================================================
*/

/**
 * Hệ thống Popup thông báo dùng chung cho toàn bộ website
 * Thay thế alert() và confirm() mặc định của trình duyệt
 */
function showGiborPopup({
  type = "success",
  title = "",
  message = "",
  confirmText = "OK",
  cancelText = "",
  onConfirm = null,
  onCancel = null,
}) {
  // Xóa popup cũ nếu có
  const oldPopup = document.getElementById("giborPopupOverlay");
  if (oldPopup) oldPopup.remove();

  // Icon theo loại
  const iconMap = {
    success: '<i class="fas fa-check-circle"></i>',
    error: '<i class="fas fa-times-circle"></i>',
    warning: '<i class="fas fa-exclamation-triangle"></i>',
  };

  const overlay = document.createElement("div");
  overlay.className = "gibor-popup-overlay";
  overlay.id = "giborPopupOverlay";

  let buttonsHTML =
    '<button class="gibor-popup-btn primary" id="giborPopupConfirm">' +
    confirmText +
    "</button>";
  if (cancelText) {
    buttonsHTML =
      '<button class="gibor-popup-btn secondary" id="giborPopupCancel">' +
      cancelText +
      "</button>" +
      buttonsHTML;
  }

  overlay.innerHTML =
    '<div class="gibor-popup-box">' +
    '<div class="gibor-popup-icon ' +
    type +
    '">' +
    (iconMap[type] || iconMap.success) +
    "</div>" +
    '<div class="gibor-popup-title">' +
    title +
    "</div>" +
    '<div class="gibor-popup-message">' +
    message +
    "</div>" +
    '<div class="gibor-popup-actions">' +
    buttonsHTML +
    "</div>" +
    "</div>";

  document.body.appendChild(overlay);

  // Hiện popup với animation
  requestAnimationFrame(() => {
    overlay.classList.add("show");
  });

  // Hàm đóng popup
  function closePopupNotify() {
    overlay.classList.remove("show");
    setTimeout(() => overlay.remove(), 300);
  }

  // Nút xác nhận
  document.getElementById("giborPopupConfirm").addEventListener("click", () => {
    closePopupNotify();
    if (onConfirm) onConfirm();
  });

  // Nút hủy
  const cancelBtn = document.getElementById("giborPopupCancel");
  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      closePopupNotify();
      if (onCancel) onCancel();
    });
  }
}

/**
 * Hiện popup lịch sử đơn hàng
 */
function showOrderHistoryPopup() {
  // Xóa popup cũ nếu có
  const oldOverlay = document.getElementById("orderHistoryOverlay");
  if (oldOverlay) oldOverlay.remove();

  const orders =
    typeof OrderManager !== "undefined" ? OrderManager.getOrders() : [];

  // Sắp xếp đơn mới nhất lên trước
  orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  let contentHTML = "";

  if (orders.length === 0) {
    contentHTML =
      '<div class="order-history-empty">' +
      '<i class="fas fa-receipt"></i>' +
      "<p>Bạn chưa có đơn hàng nào.</p>" +
      '<p style="font-size:0.85rem;">Hãy đặt hàng để thưởng thức cà phê GIBOR!</p>' +
      "</div>";
  } else {
    orders.forEach((order) => {
      const date = new Date(order.createdAt);
      const dateStr = date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      let itemsHTML = "";
      order.items.forEach((item) => {
        const itemTotal = item.price * item.quantity;
        itemsHTML +=
          '<div class="order-card-item">' +
          '<span class="order-card-item-name">' +
          item.name +
          " x" +
          item.quantity +
          "</span>" +
          '<span class="order-card-item-detail">Size ' +
          item.size +
          "</span>" +
          '<span class="order-card-item-price">' +
          itemTotal.toLocaleString("vi-VN") +
          "đ</span>" +
          "</div>";
      });

      // Thông tin người đặt hàng
      let customerHTML = "";
      if (order.customer) {
        customerHTML = '<div class="order-card-customer">';
        if (order.customer.name)
          customerHTML +=
            '<span><i class="fas fa-user"></i> ' +
            order.customer.name +
            "</span>";
        if (order.customer.phone)
          customerHTML +=
            '<span><i class="fas fa-phone"></i> ' +
            order.customer.phone +
            "</span>";
        if (order.customer.email)
          customerHTML +=
            '<span><i class="fas fa-envelope"></i> ' +
            order.customer.email +
            "</span>";
        if (order.customer.address)
          customerHTML +=
            '<span><i class="fas fa-map-marker-alt"></i> ' +
            order.customer.address +
            "</span>";
        customerHTML += "</div>";
      }

      contentHTML +=
        '<div class="order-card">' +
        '<div class="order-card-header">' +
        '<span class="order-card-code"><i class="fas fa-receipt"></i> ' +
        order.code +
        "</span>" +
        '<span class="order-card-date">' +
        dateStr +
        "</span>" +
        "</div>" +
        customerHTML +
        '<div class="order-card-items">' +
        itemsHTML +
        "</div>" +
        '<div class="order-card-footer">' +
        '<span class="order-card-meta">' +
        order.payment +
        " · " +
        order.shipping +
        "</span>" +
        '<span class="order-card-total">' +
        order.total.toLocaleString("vi-VN") +
        "đ</span>" +
        "</div>" +
        "</div>";
    });
  }

  const overlay = document.createElement("div");
  overlay.className = "order-history-overlay";
  overlay.id = "orderHistoryOverlay";
  overlay.innerHTML =
    '<div class="order-history-box">' +
    '<div class="order-history-header">' +
    '<h3><i class="fas fa-history"></i> Lịch sử đơn hàng</h3>' +
    '<button class="order-history-close" id="orderHistoryClose">✕</button>' +
    "</div>" +
    contentHTML +
    "</div>";

  document.body.appendChild(overlay);

  requestAnimationFrame(() => {
    overlay.classList.add("show");
  });

  // Đóng popup
  function closeOrderHistory() {
    overlay.classList.remove("show");
    setTimeout(() => overlay.remove(), 300);
  }

  document
    .getElementById("orderHistoryClose")
    .addEventListener("click", closeOrderHistory);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeOrderHistory();
  });
}

/* 
========================================================================================

                                KẾT THÚC CODE BỞI TRẦN DƯƠNG GIA BẢO

========================================================================================
*/
