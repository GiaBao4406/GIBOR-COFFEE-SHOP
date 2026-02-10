/* 
========================================================================================

                                    CODE BỞI TRẦN GIA BẢO

========================================================================================
*/
// GỬI CONTACT
const contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Ngăn trang web tải lại

    const btn = contactForm.querySelector(".btn-send");
    const originalText = btn.innerText;

    // Hiệu ứng đang gửi
    btn.innerText = "Đang gửi...";
    btn.style.opacity = "0.3";
    btn.style.pointerEvents = "none";

    setTimeout(() => {
      alert("Cảm ơn bạn! GIBOR đã nhận được lời nhắn.");
      btn.innerText = originalText;
      btn.style.opacity = "1";
      btn.style.pointerEvents = "all";
      contactForm.reset(); // Xóa trắng form
    }, 2000);
  });
}

/* 
========================================================================================

                                KẾT THÚC CODE BỞI TRẦN GIA BẢO

========================================================================================
*/
