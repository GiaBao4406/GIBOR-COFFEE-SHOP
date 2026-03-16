const popup = document.getElementById("promoPopup");
const closeBtn = document.getElementById("closePopup");

// Hiển thị popup sau 1 giây
window.onload = function () {
  // Kiểm tra xem khách đã xem popup trong phiên này chưa
  if (!sessionStorage.getItem("popupShown")) {
    setTimeout(() => {
      popup.classList.add("show");
    }, 1000);
  }
};

// Hàm đóng popup
function closePopupHandler() {
  popup.classList.remove("show");
  setTimeout(() => {
    popup.style.display = "none";
  }, 400);
}

closeBtn.onclick = closePopupHandler;

// Đóng khi nhấn ra ngoài vùng popup
window.onclick = function (event) {
  if (event.target == popup) {
    closePopupHandler();
  }
};

// JavaScript cho trang khuyến mãi (ads.html)
document.addEventListener("DOMContentLoaded", () => {
  console.log("Trang khuyến mãi đã sẵn sàng!");
  // Bạn có thể thêm các chức năng cho trang ads tại đây
});
