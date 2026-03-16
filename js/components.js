/* 
========================================================================================

                                    CODE BỞI TRẦN GIA BẢO
                      Tái sử dụng Header và Footer cho GIBOR COFFEE
========================================================================================
*/

const HeaderComponent = `
    <header class="header">
      <div class="header-container">
        <!-- LOGO -->
        <a href="index.html" class="logo">
          <img src="images/logo/logo.jpg" alt="GIBOR Coffee" />
          <span>GIBOR COFFEE</span>
        </a>

        <!-- NAV -->
        <nav class="nav">
          <ul class="nav-links">
            <li><a href="index.html">Trang chủ</a></li>
            <li><a href="menu.html">Menu</a></li>
            <li><a href="about.html">Giới thiệu</a></li>
            <li><a href="contact.html">Liên hệ</a></li>
          </ul>
        </nav>

        <!-- AUTH + CART -->
        <div class="header-actions">
          <a href="login.html" class="icon-btn" id="authLink">Đăng nhập</a>
          <a href="cart.html" class="icon-btn cart">
            🛒
            <span>Giỏ hàng</span>
            <span id="cart-count">0</span>
          </a>
          <button class="theme-toggle" id="themeToggle">🌙</button>
          <button class="menu-toggle" id="menuToggle" aria-label="Menu">
            <i class="fas fa-bars"></i>
          </button>
        </div>
      </div>
    </header>
`;

const FooterComponent = `
    <footer class="footer">
      <div class="footer-container">
        <div class="footer-col">
          <h3 class="footer-logo">GIBOR COFFEE</h3>
          <ul>
            <li>
              <p>
                Khơi nguồn cảm hứng từ những hạt cà phê rang xay nguyên chất.
                Chúng tôi mang đến trải nghiệm hương vị mộc mạc và tinh tế nhất.
              </p>
            </li>
            <li>
              <img src="images/logo/logoHuit.png" alt="logo-huit" height="60" />
            </li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Khám Phá</h4>
          <ul>
            <li><a href="index.html">Trang chủ</a></li>
            <li><a href="menu.html">Menu</a></li>
            <li><a href="about.html">Giới thiệu</a></li>
            <li><a href="contact.html">Liên hệ</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Liên Hệ</h4>
          <ul>
            <li>
              <p>📍 140 Lê Trọng Tấn, Tân Phú, TP.HCM</p>
            </li>
            <li>
              <p>📞 0909 999 999</p>
            </li>
          </ul>

          <h4 style="margin-top: 25px">Theo Dõi GIBOR</h4>
          <div class="social-links">
            <a href="#" class="btn btn-secondary">Facebook</a>
            <a href="#" class="btn btn-secondary">TikTok</a>
          </div>
        </div>

        <div class="footer-col">
          <h4>Vị Trí</h4>
          <div class="google-map">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31352.538163214747!2d106.5926170349121!3d10.806159823201295!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752be27d8b4f4d%3A0x92dcba2950430867!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBDw7RuZyBUaMawxqFuZyBUUC4gSOG7kyBDaMOtIE1pbmggKEhVSVQp!5e0!3m2!1svi!2s!4v1770452982001!5m2!1svi!2s"
              width="100%"
              height="150"
              style="border: 0"
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p>© 2026 GIBOR COFFEE. Designed by Team 3 Bảo & Anh.</p>
      </div>
    </footer>
`;

/**
 * Tự động chèn Header và Footer vào các thẻ placeholder
 */
function loadComponents() {
  const headerPlaceholder = document.getElementById("header-placeholder");
  const footerPlaceholder = document.getElementById("footer-placeholder");

  if (headerPlaceholder) {
    headerPlaceholder.outerHTML = HeaderComponent;
  }

  if (footerPlaceholder) {
    footerPlaceholder.outerHTML = FooterComponent;
  }

  // Sau khi chèn xong, nếu có hàm updateCartCount từ cart.js thì gọi để cập nhật số lượng
  if (typeof updateCartCount === "function") {
    updateCartCount();
  }
}

// Chạy ngay khi script được load (nếu placeholder đã có trong DOM)
// Hoặc có thể gọi trong DOMContentLoaded
document.addEventListener("DOMContentLoaded", loadComponents);
