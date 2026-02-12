/* 
========================================================================================

                                    CODE BỞI TRẦN GIA BẢO

========================================================================================
*/
// GỬI CONTACT
const contactForm = document.getElementById("contactForm");
const modal = document.getElementById("myModal");
const closeBtn = document.querySelector(".closeBtn");
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Ngăn trang web tải lại

    // 1. KIỂM TRA HỢP LỆ
    if (!contactForm.checkValidity()) {
      contactForm.reportValidity(); // Hiển thị thông báo lỗi mặc định của trình duyệt
      return; // Dừng lại, không chạy code bên dưới
    }

    const btn = contactForm.querySelector(".btn-send");
    const originalText = btn.innerText;

    // 2. HIỆU ỨNG ĐANG GỬI
    btn.innerText = "Đang gửi...";
    btn.style.opacity = "0.5";
    btn.style.pointerEvents = "none";

    // 3. GIẢ LẬP GỬI DỮ LIỆU
    setTimeout(() => {
      // Sau khi "gửi" xong thì mới hiện Modal thành công
      modal.style.display = "block";

      // Khôi phục trạng thái nút
      btn.innerText = originalText;
      btn.style.opacity = "1";
      btn.style.pointerEvents = "all";

      contactForm.reset(); // Xóa trắng form
    }, 1500);
  });
}

// 4. CÁC SỰ KIỆN ĐÓNG MODAL
if (closeBtn) {
  closeBtn.onclick = () => {
    modal.style.display = "none";
  };
}

window.onclick = (event) => {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
/* 
========================================================================================

                                KẾT THÚC CODE BỞI TRẦN GIA BẢO

========================================================================================
*/
