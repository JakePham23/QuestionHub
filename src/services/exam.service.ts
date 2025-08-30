// src/services/examService.ts
import { ExamDetail, Question, SavedExamData } from '../types/exam.type';
import { api_backend } from '../utils/api';

// This function centralizes the data fetching logic
export async function getExamData(examId: string): Promise<{ questions: Question[]; examDetail: ExamDetail }> {
  if (!examId) {
    throw new Error('ID đề thi không tồn tại');
  }

  try {
    const [res1, res2] = await Promise.all([
      fetch(`${api_backend}/exams/${examId}`, {
        headers: { 'ngrok-skip-browser-warning': 'true' },
        cache: 'no-store',
      }),
      fetch(`${api_backend}/exams/${examId}/questions`, {
        headers: { 'ngrok-skip-browser-warning': 'true' },
        cache: 'no-store',
      }),
    ]);

    if (!res1.ok || !res2.ok) {
      throw new Error('Không thể tải đề thi từ server');
    }

    const questions: Question[] = await res2.json();
    const examDetail: ExamDetail = await res1.json();

    return { questions, examDetail };

  } catch (err) {
    console.error('Lỗi khi tải dữ liệu đề thi:', err);
    throw new Error('Lỗi kết nối hoặc tải dữ liệu');
  }
}

// Hàm lưu dữ liệu bài làm lên server
export async function saveExamToServer(examId: string, examData: Partial<SavedExamData>): Promise<void> {
  try {
    const response = await fetch(`/api/exam/${examId}/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
      },
      body: JSON.stringify(examData),
    });

    if (response.ok) {
      console.log('☁️ Đã lưu bài làm lên server thành công');
    } else {
      console.error('Không thể lưu bài làm lên server. Status:', response.status);
    }
  } catch (error) {
    console.error('Lỗi khi kết nối đến server để lưu:', error);
    // Có thể thêm logic lưu vào localStorage ở đây nếu muốn, nhưng ở đây ta sẽ xử lý ở component để dễ dàng quản lý
  }
}