// src/app/exam/[versionId]/page.tsx
import ExamPage from './ExamPage';
import { Alert } from 'antd';
import { getExamData } from '../../../services/exam.service'; // Import the service
import { ExamDetail, Question } from '../../../types/exam.type'; // Import types

type Params = Promise<{ versionId: string }>

export default async function ExamDataFetcher({ params }: { params: Params }) {
  const { versionId } = await params;

  let questions: Question[] = [];
  let examDetail: ExamDetail | null = null;
  let error: string | null = null;

  try {
    const data = await getExamData(versionId); // Use the service function
    questions = data.questions;
    examDetail = data.examDetail;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
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