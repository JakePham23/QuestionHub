import QuestionCard from './QuestionCard';
import { Empty, FloatButton, Grid } from 'antd';
import { VerticalAlignTopOutlined } from '@ant-design/icons';
import React from 'react';

// Import types từ file trung tâm
import { Question, UserAnswers, ExamStatus } from '@/types/exam.type';

const { useBreakpoint } = Grid;

interface QuestionListProps {
  questions: Question[];
  userAnswers: UserAnswers;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onAnswerChange: (questionId: string, answer: any) => void;
  examStatus: ExamStatus;
  currentQuestionIndex: number;
  isMobile?: boolean;
}

const QuestionList: React.FC<QuestionListProps> = ({ 
  questions, 
  userAnswers, 
  onAnswerChange, 
  examStatus,
  currentQuestionIndex, 
  isMobile
}) => {
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
        paddingBottom: isMobile ? '60px' : '24px'
      }}>
        {questions.map((q, index) => (
          <div 
            key={q.question_id} 
            id={`question-${q.question_id}`}
            style={{ 
              marginBottom: index === questions.length - 1 ? 0 : (isMobile ? '20px' : '32px'),
              scrollMarginTop: isMobile ? '60px' : '80px'
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

      <FloatButton.BackTop 
        style={{ 
          right: isMobile ? '16px' : '30px',
          bottom: isMobile ? '80px' : '30px'
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