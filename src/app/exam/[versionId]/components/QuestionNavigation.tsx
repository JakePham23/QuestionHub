'use client'
import { Button, Tooltip, Typography, Divider } from 'antd';
import { 
  CheckCircleOutlined, 
  QuestionCircleOutlined,
  EyeOutlined,
  BarsOutlined
} from '@ant-design/icons';
import React from 'react';

const { Title, Text } = Typography;

// Định nghĩa các kiểu dữ liệu
interface Question {
  question_id: string;
}

interface UserAnswers {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [questionId: string]: any;
}

type ExamStatus = 'not-started' | 'in-progress' | 'submitted' | 'time-up';

interface QuestionNavigationProps {
  questions: Question[];
  userAnswers: UserAnswers;
  currentQuestionIndex: number;
  onQuestionClick: (index: number) => void;
  collapsed: boolean;
  examStatus: ExamStatus;
}

const QuestionNavigation: React.FC<QuestionNavigationProps> = ({ 
  questions, 
  userAnswers, 
  currentQuestionIndex, 
  onQuestionClick, 
  collapsed,
  examStatus 
}) => {
  const isFinished = examStatus === 'submitted' || examStatus === 'time-up';

  const getQuestionStatus = (question: Question, index: number): 'current' | 'answered' | 'unanswered' => {
    const isAnswered = userAnswers.hasOwnProperty(question.question_id);
    const isCurrent = index === currentQuestionIndex;
    
    if (isCurrent && !isFinished) {
      return 'current';
    } else if (isAnswered) {
      return 'answered';
    } else {
      return 'unanswered';
    }
  };

  const getQuestionColor = (status: 'current' | 'answered' | 'unanswered'): string => {
    switch (status) {
      case 'current':
        return '#1890ff';
      case 'answered':
        return '#52c41a';
      default:
        return '#d9d9d9';
    }
  };

  if (collapsed) {
    return (
      <div style={{ padding: '16px 8px' }}>
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <BarsOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {questions.map((question, index) => {
            const status = getQuestionStatus(question, index);
            const color = getQuestionColor(status);
            
            return (
              <Tooltip 
                key={question.question_id} 
                title={`Câu ${index + 1} - ${status === 'answered' ? 'Đã trả lời' : status === 'current' ? 'Đang xem' : 'Chưa trả lời'}`}
                placement="right"
              >
                <Button
                  size="small"
                  shape="circle"
                  onClick={() => onQuestionClick(index)}
                  style={{
                    backgroundColor: status === 'current' ? '#1890ff' : 'transparent',
                    borderColor: color,
                    color: status === 'current' ? '#fff' : color,
                    fontWeight: 'bold',
                    width: '32px',
                    height: '32px'
                  }}
                >
                  {index + 1}
                </Button>
              </Tooltip>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '20px 8px', 
      height: '70vh', 
      overflowY: 'auto'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '20px', position: 'sticky', top: '0', zIndex: '10', background: '#fff' }}>
        <Title level={5} style={{ margin: 0, color: '#1890ff' }}>
          📋 Danh sách câu hỏi
        </Title>
      </div>

      <Divider style={{ margin: '16px 0' }} />

      {/* Question Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)', 
        gap: '8px',
      }}>
        {questions.map((question, index) => {
          const status = getQuestionStatus(question, index);
          const color = getQuestionColor(status);
          
          return (
            <Tooltip 
              key={question.question_id} 
              title={`Câu ${index + 1}`}
            >
              <Button
                size="small"
                onClick={() => onQuestionClick(index)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '12px 4px',
                  height: '15px',
                  borderColor: color,
                  backgroundColor: status === 'current' ? '#e6f7ff' : 
                                 status === 'answered' ? '#f6ffed' : 
                                 '#fafafa'
                }}
              >

                <Text 
                  style={{ 
                    fontSize: '11px', 
                    fontWeight: status === 'current' ? 'bold' : 'normal',
                    color: status === 'current' ? '#1890ff' : 
                           status === 'answered' ? '#52c41a' : 
                           '#8c8c8c'
                  }}
                >
                  {index + 1}
                </Text>
              </Button>
            </Tooltip>
          );
        })}
      </div>

      {/* Summary */}
      {!isFinished && (
        <div style={{ 
          marginTop: '20px',
          padding: '12px',
          background: '#f6ffed',
          border: '1px solid #b7eb8f',
          borderRadius: '6px'
        }}>
          <Text style={{ fontSize: '12px', color: '#666' }}>
            💡 <strong>Gợi ý:</strong> Click vào số câu để nhảy đến câu hỏi đó
          </Text>
        </div>
      )}
    </div>
  );
};

export default QuestionNavigation;