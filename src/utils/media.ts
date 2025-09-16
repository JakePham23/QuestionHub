// src/utils/media.ts

// Import biến môi trường cho URL của backend
const api  = process.env.NEXT_PUBLIC_API_BACKEND

/**
 * Xây dựng URL hoàn chỉnh cho file media bằng cách sử dụng endpoint proxy.
 * @param relativePath Đường dẫn tương đối của file media từ database (ví dụ: 'images/lop12/toan/exam/1/questions/question6.png').
 * @returns URL hoàn chỉnh để truy cập file media.
 */
export const getMediaUrl = (relativePath?: string): string => {
  // Trả về chuỗi rỗng nếu không có đường dẫn
  if (!relativePath) {
    return '';
  }

  // Sử dụng endpoint proxy để định tuyến yêu cầu ảnh qua backend
  // encodeURIComponent đảm bảo các ký tự đặc biệt được xử lý đúng
  return `${api}/api/proxy-image?path=${encodeURIComponent(relativePath)}`;
};