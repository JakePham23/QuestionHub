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
    const data: CurriculumItem[] = await response.json();
    return data;
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
    const data: ExamItem[] = await response.json();
    return data;
  } catch (err) {
    console.error("Lỗi khi tải danh sách đề thi:", err);
    if (err instanceof Error) {
      throw err;
    }
    throw new Error("Đã xảy ra lỗi không mong muốn khi tải đề thi.");
  }
}