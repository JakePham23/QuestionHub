// src/services/data.service.ts
import { api_backend } from '@/utils/api';
import { CurriculumItem, ExamItem } from '@/types/data.type';

export async function fetchCurriculumData(): Promise<CurriculumItem[]> {
  try {
    const response = await fetch(`${api_backend}/data_info`, {
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
      },
    });

    if (!response.ok) {
      throw new Error('Không thể kết nối tới server để tải dữ liệu chương trình học.');
    }
    // Lấy toàn bộ đối tượng JSON từ phản hồi
    const result = await response.json();
    
    // Kiểm tra và trả về mảng metadata
    if (result && Array.isArray(result.metadata)) {
      return result.metadata;
    } else {
      console.error("Dữ liệu trả về không có thuộc tính 'metadata' hoặc không phải là mảng:", result);
      return [];
    }
  } catch (err) {
    console.error("Lỗi khi tải dữ liệu chương trình học:", err);
    throw new Error("Lỗi khi tải dữ liệu chương trình học.");
  }
}

export async function fetchExams(gradeId: number | null, subjectId: number | null): Promise<ExamItem[]> {
  if (!gradeId && !subjectId) {
    return [];
  }
  
  try {
    const params = new URLSearchParams();
    if (gradeId) {
      params.append("gradeId", String(gradeId));
    }
    if (subjectId) {
      params.append("subjectId", String(subjectId));
    }
    const queryString = params.toString();
    const url = `${api_backend}/exams?${queryString}`;

    const response = await fetch(url, {
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    });

    if (!response.ok) {
      throw new Error("Đề thi loại này chưa được cập nhật. Vui lòng liên hệ Admin hoặc chờ Admin cập nhật thêm nhé!");
    }
    const result = await response.json();
    
    // Tương tự, kiểm tra và trích xuất mảng metadata
    if (result && Array.isArray(result.metadata)) {
      return result.metadata;
    } else {
      console.error("Dữ liệu đề thi trả về không có thuộc tính 'metadata' hoặc không phải là mảng:", result);
      return [];
    }
  } catch (err) {
    console.error("Lỗi khi tải danh sách đề thi:", err);
    if (err instanceof Error) {
      throw err;
    }
    throw new Error("Đã xảy ra lỗi không mong muốn khi tải đề thi.");
  }
}