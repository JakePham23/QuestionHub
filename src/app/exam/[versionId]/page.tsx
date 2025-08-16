// src/app/exam/[versionId]/page.tsx
import { notFound } from 'next/navigation';
import { api_backend } from '../../../utils/api';
import ExamPage from './ExamPage'; // Import component đã tách ra

// Định nghĩa kiểu dữ liệu cho props của component
type Params = { versionId: string };
interface PageProps {
  params: Params;
}

// Định nghĩa kiểu dữ liệu cho câu hỏi và chi tiết đề thi (giữ nguyên)
interface Question {
  question_id: string;
  question_type: string;
  question_content: string;
}

interface ExamDetail {
  exam_id: string;
  title: string;
  description: string;
  total_questions: number;
  duration_minutes: number;
  subject_name: string;
  grade_name: string;
}

// Hàm lấy dữ liệu từ hai API
async function fetchData(versionId: string) {
  if (!versionId) {
    notFound(); 
  }

  try {
    const [res1, res2] = await Promise.all([
      fetch(`${api_backend}/versions/${versionId}`, {
        headers: { 'ngrok-skip-browser-warning': 'true' },
        cache: 'no-store',
      }),
      fetch(`${api_backend}/exams/${versionId}`, {
        headers: { 'ngrok-skip-browser-warning': 'true' },
        cache: 'no-store',
      }),
    ]);

    if (res1.status === 404 || res2.status === 404) {
      notFound();
    }

    if (!res1.ok || !res2.ok) {
      throw new Error('Không thể tải đề thi từ server');
    }

    const questions: Question[] = await res1.json();
    const examDetail: ExamDetail = await res2.json();

    return { questions, examDetail };
  } catch (err) {
    console.error(err);
    throw new Error('Lỗi kết nối hoặc tải dữ liệu');
  }
}

// Next.js sẽ tự động cung cấp props, bạn chỉ cần định nghĩa kiểu cho params
export default async function ExamDataFetcher({ params }: PageProps) {
  const { versionId } = params;

  let questions: Question[] = [];
  let examDetail: ExamDetail | null = null;
  let error: string | null = null;

  try {
    const data = await fetchData(versionId);
    questions = data.questions;
    examDetail = data.examDetail;
  } 
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
  catch (err: any) {
    error = err.message;
  }

  // Luôn trả về component hiển thị giao diện
  return (
    <ExamPage
      versionId={versionId}
      examDetail={examDetail as ExamDetail} // Sử dụng type assertion
      initialQuestions={questions}
      initialError={error}
    />
  );
}