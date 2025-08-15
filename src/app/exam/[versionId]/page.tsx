// src/app/exam/[versionId]/page.tsx
import ExamPage from './ExamPage';
import { api_backend } from '../../../utils/api';

// Định nghĩa kiểu dữ liệu cho props của component
// Đảm bảo kiểu dữ liệu params khớp với tên thư mục [versionId]
type Params = Promise<{ versionId: string}>

// Định nghĩa kiểu dữ liệu cho câu hỏi
interface Question {
  question_id: string;
  question_type: string;
  question_content: string;
  // Thêm các trường khác nếu có
}

export default async function ExamDataFetcher({ params }: { params: Params }) {
  // Lấy versionId từ params
  const { versionId } = await params

  async function getExamByVersionId(id: string): Promise<Question[]> {
    if (!id) {
      throw new Error('ID đề thi không tồn tại');
    }

    try {
      const res = await fetch(`${api_backend}/versions/${id}`, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
        },
        cache: 'no-store',
      });

      if (!res.ok) {
        throw new Error('Không thể tải đề thi từ server');
      }

      return (await res.json()) as Question[];
    } catch (err) {
      console.error(err);
      throw new Error('Lỗi kết nối hoặc tải dữ liệu');
    }
  }

  let questions: Question[] = [];
  let error: string | null = null;

  try {
    questions = await getExamByVersionId(versionId);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    error = err.message;
  }

  return (
    <ExamPage
      versionId={versionId}
      initialQuestions={questions}
      initialError={error}
    />
  );
}