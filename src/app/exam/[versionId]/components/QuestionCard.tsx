// src/app/exam/[versionId]/components/QuestionCard.tsx

import { Card, Radio, Space, Typography, Input, Checkbox, Badge } from 'antd';

import { InlineMath }  from 'react-katex';
import { 
  CheckCircleOutlined, 
  QuestionCircleOutlined,
  EyeOutlined 
} from '@ant-design/icons';
import React from 'react';

const { Paragraph, Text } = Typography;

// Định nghĩa các kiểu dữ liệu
interface Answer {
  answer_id: string;
  answer_content: string;
}

interface Question {
  question_id: string;
  question_type: 'trac_nghiem' | 'dung_sai' | 'dien_dap_an' | 'tu_luan' | string;
  question_content: string;
  answers?: Answer[];
}

type UserAnswer = string | string[] | boolean | number | undefined | null;
type ExamStatus = 'not-started' | 'in-progress' | 'submitted' | 'time-up';

interface QuestionCardProps {
  question: Question;
  index: number;
  userAnswer: UserAnswer;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onAnswerChange: (questionId: string, answer: any) => void;
  examStatus: ExamStatus;
  isCurrent: boolean;
}

// Helper component để render LaTeX và tiếng Việt
const LatexRenderer: React.FC<{ text?: string }> = ({ text = '' }) => {
  const parts = text.split('$');
  return (
    <span>
      {parts.map((part, index) => {
        if (index % 2 === 1) {
          return <InlineMath key={index} math={part} />;
        }
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
};

const QuestionCard: React.FC<QuestionCardProps> = ({ 
  question, 
  index, 
  userAnswer, 
  onAnswerChange, 
  examStatus,
  isCurrent 
}) => {
  const isFinished = examStatus === 'submitted' || examStatus === 'time-up';
  const isAnswered = userAnswer !== undefined && userAnswer !== null && userAnswer !== '';

  // Render các loại câu hỏi khác nhau
  const renderQuestionType = () => {
    switch (question.question_type) {
      case 'trac_nghiem': // Trắc nghiệm một đáp án
        return (
          <Radio.Group 
            value={userAnswer} 
            onChange={(e) => onAnswerChange(question.question_id, e.target.value)}
            disabled={isFinished}
            style={{ width: '100%' }}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              {(question.answers || []).map((answer) => (
                <Radio 
                  key={answer.answer_id} 
                  value={answer.answer_id}
                  style={{ 
                    padding: '12px 16px',
                    border: '1px solid #f0f0f0',
                    borderRadius: '6px',
                    margin: '4px 0',
                    display: 'flex',
                    alignItems: 'flex-start',
                    backgroundColor: userAnswer === answer.answer_id ? '#e6f7ff' : '#fafafa'
                  }}
                >
                  <div style={{ marginLeft: '8px', lineHeight: '1.6' }}>
                    <LatexRenderer text={answer.answer_content} />
                  </div>
                </Radio>
              ))}
            </Space>
          </Radio.Group>
        );

      case 'dung_sai': // Đúng/Sai
        return (
          <Radio.Group 
            value={userAnswer as boolean | undefined}
            onChange={(e) => onAnswerChange(question.question_id, e.target.value)}
            disabled={isFinished}
            style={{ width: '100%' }}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <Radio 
                value={true}
                style={{ 
                  padding: '12px 16px',
                  border: '1px solid #f0f0f0',
                  borderRadius: '6px',
                  margin: '4px 0',
                  backgroundColor: userAnswer === true ? '#e6f7ff' : '#fafafa'
                }}
              >
                <Text style={{ marginLeft: '8px', fontSize: '16px' }}>✅ Đúng</Text>
              </Radio>
              <Radio 
                value={false}
                style={{ 
                  padding: '12px 16px',
                  border: '1px solid #f0f0f0',
                  borderRadius: '6px',
                  margin: '4px 0',
                  backgroundColor: userAnswer === false ? '#e6f7ff' : '#fafafa'
                }}
              >
                <Text style={{ marginLeft: '8px', fontSize: '16px' }}>❌ Sai</Text>
              </Radio>
            </Space>
          </Radio.Group>
        );

      case 'dien_dap_an': // Điền đáp án
        return (
          <div style={{ margin: '16px 0' }}>
            <Text strong style={{ display: 'block', marginBottom: '8px' }}>
              Nhập đáp án:
            </Text>
            <Input 
              value={userAnswer as string | undefined || ''}
              onChange={(e) => onAnswerChange(question.question_id, e.target.value)}
              placeholder="Nhập đáp án của bạn..."
              disabled={isFinished}
              size="large"
              style={{ 
                fontSize: '16px',
                backgroundColor: isAnswered ? '#e6f7ff' : '#fff'
              }}
            />
          </div>
        );

      case 'tu_luan': // Tự luận
        return (
          <div style={{ margin: '16px 0' }}>
            <Text strong style={{ display: 'block', marginBottom: '8px' }}>
              Câu trả lời của bạn:
            </Text>
            <Input.TextArea 
              value={userAnswer as string | undefined || ''}
              onChange={(e) => onAnswerChange(question.question_id, e.target.value)}
              rows={6}
              placeholder="Viết câu trả lời chi tiết của bạn..."
              disabled={isFinished}
              style={{ 
                fontSize: '16px',
                backgroundColor: isAnswered ? '#e6f7ff' : '#fff'
              }}
            />
          </div>
        );
      
      default:
        return (
          <div style={{ 
            padding: '20px',
            background: '#fff2e8',
            border: '1px solid #ffbb96',
            borderRadius: '6px',
            textAlign: 'center'
          }}>
            <Paragraph type="danger">
              ⚠️ Loại câu hỏi không được hỗ trợ: {question.question_type}
            </Paragraph>
          </div>
        );
    }
  };

  const cardTitle = (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Text strong style={{ fontSize: '18px', color: '#1890ff' }}>
          Câu {index + 1}
        </Text>
      </div>
    </div>
  );

  return (
    <Card 
      title={cardTitle}
      style={{ 
        marginBottom: 0,
        border: isCurrent ? '2px solid #1890ff' : '1px solid #f0f0f0',
        borderRadius: '8px',
        boxShadow: isCurrent ? '0 4px 12px rgba(24, 144, 255, 0.15)' : '0 2px 8px rgba(0,0,0,0.06)',
        transition: 'all 0.3s ease',
        background: isCurrent ? '#fafbff' : '#fff'
      }}
    >
      {/* Question Content */}
      <div style={{ 
        marginBottom: 24, 
        fontSize: '16px',
        padding: '16px 20px',
        background: '#f9f9f9',
        borderRadius: '6px',
        border: '1px solid #f0f0f0'
      }}>
        <LatexRenderer text={question.question_content} />
      </div>

      {/* Answer Section */}
      {renderQuestionType()}

      {/* Footer info for finished exam */}
      {isFinished && (
        <div style={{ 
          marginTop: '20px',
          padding: '12px 16px',
          background: '#f6ffed',
          border: '1px solid #b7eb8f',
          borderRadius: '6px'
        }}>
          <Text style={{ color: '#389e0d', fontSize: '14px' }}>
            ✅ Bài thi đã hoàn thành - Không thể chỉnh sửa
          </Text>
        </div>
      )}
    </Card>
  );
};

export default QuestionCard;