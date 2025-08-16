// src/app/exam/[versionId]/page.tsx
import { notFound } from 'next/navigation'; // Import notFound from next/navigation
import ExamPage from './ExamPage';
import { api_backend } from '../../../utils/api';
import { Alert } from 'antd'; 

// 

// Định nghĩa kiểu dữ liệu cho props của component
type Params = { versionId: string };

// Định nghĩa kiểu dữ liệu cho câu hỏi
interface Question {
  question_id: string;
  question_type: string;
  question_content: string;
  // Thêm các trường khác nếu có
}

// Định nghĩa kiểu dữ liệu cho chi tiết đề thi
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
    // Sử dụng notFound() để trả về trang 404 nếu không có ID
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

    // Sử dụng notFound() nếu API trả về lỗi 404
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
export default async function ExamDataFetcher({ params }: { params: Params }) {
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

  if (error || !examDetail) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <Alert
          message="Lỗi"
          description={error || 'Không thể tải chi tiết đề thi.'}
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <ExamPage
      versionId={versionId}
      examDetail={examDetail}
      initialQuestions={questions}
      initialError={error}
    />
  );
}