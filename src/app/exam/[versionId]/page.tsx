// server-side rendering
import ExamPage from './ExamPage';
import { api_backend } from '../../../utils/api';

interface ExamPageProps {
  params: {
    versionId: string;
  };
}

export default async function ExamDataFetcher({ params }: ExamPageProps) {
  const versionId = params.versionId;

  async function getExamByVersionId(id: string) {
    if (!id) {
      throw new Error('Exam ID is not existed');
    }
    const res = await fetch(`${api_backend}/versions/${id}`, {
      headers: {
        'ngrok-skip-browser-warning': 'true',
      },
      cache: 'no-store'
    });

    if (!res.ok) {
      throw new Error('Không thể tải đề thi');
    }

    return res.json();
  }

  let questions = [];
  let error: string | null = null;

  try {
    const data = await getExamByVersionId(versionId);
    questions = data;
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
