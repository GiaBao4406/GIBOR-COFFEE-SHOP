/* 
  ========================================================================================

                                    CODE BỞI TRẦN DƯƠNG GIA BẢO

  ========================================================================================
  QUẢN LÝ TÀI KHOẢN NGƯỜI DÙNG - data.js
  Lưu trữ & xử lý dữ liệu người dùng bằng localStorage
*/

const UserManager = {
  /**
   * Lấy danh sách tất cả người dùng từ localStorage
   * @returns {Array} Mảng các đối tượng user
   */
  getUsers() {
    const users = localStorage.getItem("gibor_users");
    return users ? JSON.parse(users) : [];
  },

  /**
   * Lưu danh sách người dùng vào localStorage
   * @param {Array} users - Mảng người dùng
   */
  saveUsers(users) {
    localStorage.setItem("gibor_users", JSON.stringify(users));
  },

  /**
   * Đăng ký tài khoản mới
   * @param {Object} param0
   * @param {string} param0.lastName - Họ
   * @param {string} param0.firstName - Tên
   * @param {string} param0.email - Email
   * @param {string} param0.phone - Số điện thoại
   * @param {string} param0.password - Mật khẩu
   * @returns {Object} { success, message, user }
   */
  register({ lastName, firstName, email, phone, password }) {
    const users = this.getUsers();

    // Kiểm tra email đã tồn tại chưa
    if (users.find((u) => u.email === email)) {
      return { success: false, message: "Email đã được dùng để đăng ký." };
    }

    // Kiểm tra mật khẩu tối thiểu 6 ký tự
    if (password.length < 6) {
      return {
        success: false,
        message: "Mật khẩu phải có ít nhất 6 ký tự.",
      };
    }

    const newUser = {
      id: Date.now(),
      lastName: lastName,
      firstName: firstName,
      displayName: (lastName + " " + firstName).trim(),
      email: email,
      phone: phone,
      password: password,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    this.saveUsers(users);

    // Tự động đăng nhập sau khi đăng ký
    this.setCurrentUser(newUser);

    return { success: true, message: "Đăng ký thành công!", user: newUser };
  },

  /**
   * Đăng nhập
   * @param {string} email
   * @param {string} password
   * @returns {Object} { success, message, user }
   */
  login(email, password) {
    const users = this.getUsers();
    const user = users.find(
      (u) => u.email === email && u.password === password,
    );

    if (!user) {
      return {
        success: false,
        message: "Email hoặc mật khẩu không đúng.",
      };
    }

    this.setCurrentUser(user);
    return {
      success: true,
      message: "Đăng nhập thành công!",
      user: user,
    };
  },

  /**
   * Lưu thông tin user đang đăng nhập (không lưu password)
   * @param {Object} user
   */
  setCurrentUser(user) {
    const safeUser = {
      id: user.id,
      lastName: user.lastName,
      firstName: user.firstName,
      displayName: user.displayName,
      email: user.email,
      phone: user.phone,
    };
    localStorage.setItem("gibor_current_user", JSON.stringify(safeUser));
  },

  /**
   * Lấy thông tin user đang đăng nhập
   * @returns {Object|null}
   */
  getCurrentUser() {
    const user = localStorage.getItem("gibor_current_user");
    return user ? JSON.parse(user) : null;
  },

  /**
   * Đăng xuất
   */
  logout() {
    localStorage.removeItem("gibor_current_user");
  },

  /**
   * Kiểm tra đã đăng nhập chưa
   * @returns {boolean}
   */
  isLoggedIn() {
    return this.getCurrentUser() !== null;
  },
};

/**
 * Quản lý lịch sử đơn hàng - lưu vào localStorage
 */
const OrderManager = {
  /**
   * Lấy tất cả đơn hàng của user hiện tại
   * @returns {Array}
   */
  getOrders() {
    const currentUser = UserManager.getCurrentUser();
    if (!currentUser) return [];
    const allOrders = JSON.parse(localStorage.getItem("gibor_orders") || "[]");
    return allOrders.filter((o) => o.userId === currentUser.id);
  },

  /**
   * Lưu đơn hàng mới
   * @param {Object} order - { code, items, total, payment, shipping, date }
   */
  saveOrder(order) {
    const currentUser = UserManager.getCurrentUser();
    if (!currentUser) return;

    const allOrders = JSON.parse(localStorage.getItem("gibor_orders") || "[]");
    allOrders.push({
      ...order,
      userId: currentUser.id,
      userName: currentUser.displayName,
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem("gibor_orders", JSON.stringify(allOrders));
  },
};

/* 
========================================================================================

                                KẾT THÚC CODE BỞI TRẦN DƯƠNG GIA BẢO

========================================================================================
*/
