// src/app/exam/[versionId]/page.tsx
import ExamPage from './ExamPage';
import { api_backend } from '../../../utils/api';
import { Alert } from 'antd'; // Thêm import Alert

// Định nghĩa kiểu dữ liệu cho props của component
type Params = Promise<{ versionId: string}>

// Định nghĩa kiểu dữ liệu cho câu hỏi
interface Question {
  question_id: string;
  question_type: string;
  question_text: string; // Đã đổi lại từ question_content
  answers?: Answer[]; // Giữ nguyên tên answers
  answer_choices?: Answer[]; // Thêm lại nếu cần
  question_url?: string; // Thêm trường URL ảnh
}

interface Answer {
  answer_id: string;
  is_correct?: boolean; // Thêm trường này nếu có
  choice_text: string; // Đã đổi lại thành choice_text
}

// Định nghĩa kiểu dữ liệu cho chi tiết đề thi
interface ExamDetail {
  exam_id: string;
  title: string;
  school_year: string;
  description: string;
  total_questions: number;
  duration_minutes: number;
  subject_name: string;
  grade_name: string;
  source_name: string,
}

// Hàm lấy dữ liệu từ hai API
async function fetchData(examId: string) {
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
    console.error(err);
    throw new Error('Lỗi kết nối hoặc tải dữ liệu');
  }
}

export default async function ExamDataFetcher({ params }: { params: Params }) {
  const { versionId } = await params;

  let questions: Question[] = [];
  let examDetail: ExamDetail | null = null;
  let error: string | null = null;

  try {
    const data = await fetchData(versionId);
    questions = data.questions;
    examDetail = data.examDetail;


  }         // eslint-disable-next-line @typescript-eslint/no-explicit-any 
  catch (err: any) {
    error = err.message;
  }

  // Thêm kiểm tra ở đây
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
      examDetail={examDetail} // Lúc này examDetail chắc chắn không phải null
      initialQuestions={questions}
      initialError={error}
    />
  );
}