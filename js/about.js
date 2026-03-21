/* 
========================================================================================

                                    CODE BỞI TRẦN GIA BẢO

========================================================================================
*/
// Reveal timeline cards on scroll
const observerOptions = { threshold: 0.25 };
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("active");
    }
  });
}, observerOptions);

document
  .querySelectorAll(".about-timeline-item")
  .forEach((item) => observer.observe(item));

/* 
========================================================================================

                                KẾT THÚC CODE BỞI TRẦN GIA BẢO

========================================================================================
*/
