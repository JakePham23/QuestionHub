// validate.ts

/**
 * Kiểm tra tính hợp lệ của mật khẩu.
 * @param password Mật khẩu cần kiểm tra.
 * @returns Trả về thông báo lỗi nếu mật khẩu không hợp lệ, ngược lại trả về null.
 */
export const validatePassword = (password: string): string | null => {
    // Kiểm tra độ dài mật khẩu
    if (password.length < 8) {
        return 'Mật khẩu phải có ít nhất 8 ký tự.';
    }

    // Kiểm tra có ít nhất một chữ cái viết hoa
    if (!/[A-Z]/.test(password)) {
        return 'Mật khẩu phải chứa ít nhất một chữ cái viết hoa.';
    }

    // Kiểm tra có ít nhất một chữ cái viết thường
    if (!/[a-z]/.test(password)) {
        return 'Mật khẩu phải chứa ít nhất một chữ cái viết thường.';
    }

    // Kiểm tra có ít nhất một số
    if (!/\d/.test(password)) {
        return 'Mật khẩu phải chứa ít nhất một số.';
    }

    // Kiểm tra có ít nhất một ký tự đặc biệt
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return 'Mật khẩu phải chứa ít nhất một ký tự đặc biệt.';
    }

    return null; // Mật khẩu hợp lệ
};

/**
 * Kiểm tra tính hợp lệ của email.
 * @param email Email cần kiểm tra.
 * @returns Trả về thông báo lỗi nếu email không hợp lệ, ngược lại trả về null.
 */
export const validateEmail = (email: string): string | null => {
    // Biểu thức chính quy để kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Kiểm tra xem email có hợp lệ không
    if (!emailRegex.test(email)) {
        return 'Email không hợp lệ.';
    }

    return null; // Email hợp lệ
};

/**
 * Kiểm tra tính hợp lệ của tên đăng nhập.
 * @param username Tên đăng nhập cần kiểm tra.
 * @returns Trả về thông báo lỗi nếu tên đăng nhập không hợp lệ, ngược lại trả về null.
 */
export const validateUsername = (username: string): string | null => {
    // Kiểm tra độ dài username
    if (username.length < 3 || username.length > 20) {
        return 'Tên đăng nhập phải có từ 3 đến 20 ký tự.';
    }

    // Kiểm tra chỉ chứa chữ cái, số và dấu gạch dưới
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
        return 'Tên đăng nhập chỉ có thể chứa chữ cái, số và dấu gạch dưới.';
    }

    return null; // Tên đăng nhập hợp lệ
};