// Xử lý Preloader
window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");
  setTimeout(() => {
    preloader.classList.add("preloader-hidden");
  }, 1200); // Hiển thị 1.2 giây để khách thấy logo
});

//Reveal Timeline on scroll
const observerOptions = { threshold: 0.5 };
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("active");
    }
  });
}, observerOptions);

document
  .querySelectorAll(".timeline-item")
  .forEach((item) => observer.observe(item));
