// src/app/exam/[versionId]/components/QuestionList.tsx
import QuestionCard from './QuestionCard';
import { Empty, FloatButton } from 'antd';
import { VerticalAlignTopOutlined } from '@ant-design/icons';
import React from 'react';

// Định nghĩa các kiểu dữ liệu
interface Question {
  question_id: string;
  question_type: 'trac_nghiem' | 'dung_sai' | 'dien_dap_an' | 'tu_luan' | string;
  question_content: string;
  // Thêm các trường khác nếu cần
}

interface UserAnswers {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [questionId: string]: any;
}

type ExamStatus = 'not-started' | 'in-progress' | 'submitted' | 'time-up';

interface QuestionListProps {
  questions: Question[];
  userAnswers: UserAnswers;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onAnswerChange: (questionId: string, answer: any) => void;
  examStatus: ExamStatus;
  currentQuestionIndex: number;
}

const QuestionList: React.FC<QuestionListProps> = ({ 
  questions, 
  userAnswers, 
  onAnswerChange, 
  examStatus,
  currentQuestionIndex 
}) => {
  if (questions.length === 0) {
    return (
      <div style={{ 
        padding: '100px 20px', 
        textAlign: 'center',
        background: '#fafafa',
        borderRadius: '8px'
      }}>
        <Empty 
          description="Không có câu hỏi nào trong đề thi này." 
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ padding: '24px' }}>
        {questions.map((q, index) => (
          <div 
            key={q.question_id} 
            id={`question-${index}`}
            style={{ 
              marginBottom: index === questions.length - 1 ? 0 : '32px',
              scrollMarginTop: '80px' // Offset for sticky header
            }}
          >
            <QuestionCard 
              question={q} 
              index={index} 
              userAnswer={userAnswers[q.question_id]}
              onAnswerChange={onAnswerChange}
              examStatus={examStatus}
              isCurrent={index === currentQuestionIndex}
            />
          </div>
        ))}
      </div>

      <FloatButton.BackTop 
        style={{ right: '30px' }}
        target={() => (document.querySelector('.ant-layout-content') as HTMLElement) || window}
      >
        <div style={{
          height: '40px',
          width: '40px',
          lineHeight: '40px',
          borderRadius: '4px',
          backgroundColor: '#1890ff',
          color: '#fff',
          textAlign: 'center',
          fontSize: '18px'
        }}>
          <VerticalAlignTopOutlined />
        </div>
      </FloatButton.BackTop>
    </div>
  );
};

export default QuestionList;