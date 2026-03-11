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
  copyPromoCode();
}

closeBtn.onclick = closePopupHandler;

// Đóng khi nhấn ra ngoài vùng popup
window.onclick = function (event) {
  if (event.target == popup) {
    closePopupHandler();
  }
};

// Hàm sao chép mã
function copyPromoCode() {
  const code = document.getElementById("promoCode").innerText;
  const el = document.createElement("textarea");
  el.value = code;
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);

  const copyBtn = document.querySelector(".copy-link");
  copyBtn.innerText = "ĐÃ CHÉP!";
  copyBtn.style.color = "#059669";

  setTimeout(() => {
    copyBtn.innerText = "SAO CHÉP";
    copyBtn.style.color = "var(--pink-primary)";
  }, 2000);
}
