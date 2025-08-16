// src/app/exam/[versionId]/components/QuestionList.tsx
import QuestionCard from './QuestionCard';
import { Empty, FloatButton, Grid } from 'antd';
import { VerticalAlignTopOutlined } from '@ant-design/icons';
import React from 'react';

const { useBreakpoint } = Grid;

// Định nghĩa các kiểu dữ liệu
interface Question {
  question_id: string;
  question_type: 'trac_nghiem' | 'dung_sai' | 'dien_dap_an' | 'tu_luan' | string;
  question_content: string;
  // Thêm các trường khác nếu cần
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
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
  const screens = useBreakpoint();
  const isMobile = screens.xs || screens.sm;

  if (questions.length === 0) {
    return (
      <div style={{ 
        padding: isMobile ? '40px 16px' : '100px 20px', 
        textAlign: 'center',
        background: '#fafafa',
        borderRadius: isMobile ? '4px' : '8px'
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
      <div style={{ 
        padding: isMobile ? '12px 8px' : '24px',
        paddingBottom: isMobile ? '60px' : '24px' // Extra space on mobile for floating elements
      }}>
        {questions.map((q, index) => (
          <div 
            key={q.question_id} 
            id={`question-${q.question_id}`} // Use question_id instead of index for better targeting
            style={{ 
              marginBottom: index === questions.length - 1 ? 0 : (isMobile ? '20px' : '32px'),
              scrollMarginTop: isMobile ? '60px' : '80px' // Offset for sticky header
            }}
          >
            <QuestionCard 
              question={q} 
              index={index} 
              userAnswer={userAnswers[q.question_id]}
              onAnswerChange={onAnswerChange}
              examStatus={examStatus}
              isCurrent={index === currentQuestionIndex}
              isMobile={isMobile}
            />
          </div>
        ))}
      </div>

      {/* Back to top button - positioned differently on mobile */}
      <FloatButton.BackTop 
        style={{ 
          right: isMobile ? '16px' : '30px',
          bottom: isMobile ? '80px' : '30px' // Higher on mobile to avoid conflicts
        }}
        target={() => (document.querySelector('.ant-layout-content') as HTMLElement) || window}
        visibilityHeight={isMobile ? 300 : 400}
      >
        <div style={{
          height: isMobile ? '36px' : '40px',
          width: isMobile ? '36px' : '40px',
          lineHeight: isMobile ? '36px' : '40px',
          borderRadius: '4px',
          backgroundColor: '#1890ff',
          color: '#fff',
          textAlign: 'center',
          fontSize: isMobile ? '16px' : '18px'
        }}>
          <VerticalAlignTopOutlined />
        </div>
      </FloatButton.BackTop>
    </div>
  );
};

export default QuestionList;