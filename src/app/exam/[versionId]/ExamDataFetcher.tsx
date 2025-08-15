// server-side rendering
import ExamPage from './ExamPage';
import { api_backend } from '../../../utils/api';

// Định nghĩa kiểu dữ liệu cho props của component
interface ExamDataFetcherProps {
  params?: {
    versionId?: string;
  };
}

// Định nghĩa kiểu dữ liệu cho câu hỏi giống với ExamPage.tsx
interface Question {
  question_id: string;
  question_type: string;
  question_content: string;
  // Các trường khác nếu cần
}
export default async function ExamDataFetcher({ params }: ExamDataFetcherProps) {
  const versionId = params?.versionId;

  async function getExamByVersionId(id: string): Promise<Question[]> {
    if (!id) {
      throw new Error('Exam ID is not existed');
    }
    const res = await fetch(`${api_backend}/versions/${id}`, {
      headers: {
        'ngrok-skip-browser-warning': 'true',
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error('Không thể tải đề thi');
    }

    const data = (await res.json()) as Question[];
    return data;
  }

  let questions: Question[] = [];
  let error: string | null = null;
  try {
    const data = await getExamByVersionId(versionId as string); // Type casting để đảm bảo versionId là string
    questions = data;
  } catch (err) {
    if (err instanceof Error) {
      error = err.message;
    } else {
      error = 'An unexpected error occurred';
    }
  }

  return <ExamPage versionId={versionId as string} initialQuestions={questions} initialError={error} />;
}