// src/app/exam/[versionId]/components/QuestionCard.tsx

import { Card, Radio, Space, Typography, Input, Checkbox, Badge, Grid } from 'antd';

import { InlineMath }  from 'react-katex';
import { 
  CheckCircleOutlined, 
  QuestionCircleOutlined,
  EyeOutlined 
} from '@ant-design/icons';
import React from 'react';
import {api} from '../../../../utils/api'; // Đã sửa tên biến import

const { Paragraph, Text } = Typography;
const { useBreakpoint } = Grid;

// Định nghĩa các kiểu dữ liệu
interface Answer {
  answer_id: string;
  is_correct?: boolean;
  choice_text: string;
  choice_media_url?: string; // Đã thêm trường URL ảnh cho đáp án
}

interface Question {
  question_id: string;
  question_type: string;
  question_text: string;
  answers?: Answer[];
  answer_choices?: Answer[];
  question_url?: string;
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
  isMobile?: boolean;
}

// Helper component để render LaTeX và tiếng Việt
const LatexRenderer: React.FC<{ text?: string; isMobile?: boolean }> = ({ text = '', isMobile = false }) => {
  const parts = text.split('$');
  return (
    <span style={{ 
      fontSize: isMobile ? '14px' : '16px',
      lineHeight: isMobile ? '1.4' : '1.6'
    }}>
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
  isCurrent,
  isMobile: propIsMobile
}) => {
  const screens = useBreakpoint();
  const isMobile = propIsMobile ?? (screens.xs || screens.sm);
  
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
            <Space direction="vertical" style={{ width: '100%' }} size={isMobile ? 'small' : 'middle'}>
              {(question.answer_choices || []).map((answer) => (
                <Radio 
                  key={answer.answer_id} 
                  value={answer.answer_id}
                  style={{ 
                    padding: isMobile ? '8px 12px' : '12px 16px',
                    border: '1px solid #f0f0f0',
                    borderRadius: '6px',
                    margin: isMobile ? '2px 0' : '4px 0',
                    display: 'flex',
                    alignItems: 'flex-start',
                    backgroundColor: userAnswer === answer.answer_id ? '#e6f7ff' : '#fafafa',
                    fontSize: isMobile ? '14px' : '16px'
                  }}
                >
                  <div style={{ 
                    marginLeft: isMobile ? '6px' : '8px', 
                    lineHeight: isMobile ? '1.4' : '1.6' 
                    
                  }}>
                    {answer.choice_media_url ? (
                      // Render hình ảnh nếu có URL
                      <img 
                        src={api + answer.choice_media_url} 
                        alt="Đáp án minh họa" 
                        style={{ maxWidth: '100%', height: 'auto', maxHeight: '200px' }}
                      />
                    ) : (
                      // Render văn bản nếu không có URL hình ảnh
                      <LatexRenderer text={answer.choice_text} isMobile={isMobile} />
                    )}
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
            <Space direction="vertical" style={{ width: '100%' }} size={isMobile ? 'small' : 'middle'}>
              <Radio 
                value={true}
                style={{ 
                  padding: isMobile ? '10px 12px' : '12px 16px',
                  border: '1px solid #f0f0f0',
                  borderRadius: '6px',
                  margin: isMobile ? '2px 0' : '4px 0',
                  backgroundColor: userAnswer === true ? '#e6f7ff' : '#fafafa'
                }}
              >
                <Text style={{ 
                  marginLeft: isMobile ? '6px' : '8px', 
                  fontSize: isMobile ? '14px' : '16px' 
                }}>
                  ✅ Đúng
                </Text>
              </Radio>
              <Radio 
                value={false}
                style={{ 
                  padding: isMobile ? '10px 12px' : '12px 16px',
                  border: '1px solid #f0f0f0',
                  borderRadius: '6px',
                  margin: isMobile ? '2px 0' : '4px 0',
                  backgroundColor: userAnswer === false ? '#e6f7ff' : '#fafafa'
                }}
              >
                <Text style={{ 
                  marginLeft: isMobile ? '6px' : '8px', 
                  fontSize: isMobile ? '14px' : '16px' 
                }}>
                  ❌ Sai
                </Text>
              </Radio>
            </Space>
          </Radio.Group>
        );

      case 'dien_dap_an': // Điền đáp án
        return (
          <div style={{ margin: isMobile ? '12px 0' : '16px 0' }}>
            <Text strong style={{ 
              display: 'block', 
              marginBottom: isMobile ? '6px' : '8px',
              fontSize: isMobile ? '13px' : '14px'
            }}>
              Nhập đáp án:
            </Text>
            <Input 
              value={userAnswer as string | undefined || ''}
              onChange={(e) => onAnswerChange(question.question_id, e.target.value)}
              placeholder="Nhập đáp án của bạn..."
              disabled={isFinished}
              size={isMobile ? 'middle' : 'large'}
              style={{ 
                fontSize: isMobile ? '14px' : '16px',
                backgroundColor: isAnswered ? '#e6f7ff' : '#fff'
              }}
            />
          </div>
        );

      case 'tu_luan': // Tự luận
        return (
          <div style={{ margin: isMobile ? '12px 0' : '16px 0' }}>
            <Text strong style={{ 
              display: 'block', 
              marginBottom: isMobile ? '6px' : '8px',
              fontSize: isMobile ? '13px' : '14px'
            }}>
              Câu trả lời của bạn:
            </Text>
            <Input.TextArea 
              value={userAnswer as string | undefined || ''}
              onChange={(e) => onAnswerChange(question.question_id, e.target.value)}
              rows={isMobile ? 4 : 6}
              placeholder="Viết câu trả lời chi tiết của bạn..."
              disabled={isFinished}
              style={{ 
                fontSize: isMobile ? '14px' : '16px',
                backgroundColor: isAnswered ? '#e6f7ff' : '#fff'
              }}
            />
          </div>
        );
      
      default:
        return (
          <div style={{ 
            padding: isMobile ? '12px' : '20px',
            background: '#fff2e8',
            border: '1px solid #ffbb96',
            borderRadius: '6px',
            textAlign: 'center'
          }}>
            <Paragraph type="danger" style={{ 
              fontSize: isMobile ? '13px' : '14px',
              margin: 0
            }}>
              ⚠️ Loại câu hỏi không được hỗ trợ: {question.question_type}
            </Paragraph>
          </div>
        );
    }
  };

  const cardTitle = (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '12px' }}>
        <Text strong style={{ 
          fontSize: isMobile ? '16px' : '18px', 
          color: '#1890ff' 
        }}>
          Câu {index + 1}
        </Text>
        {/* Status indicator */}
        {isAnswered ? (
          <CheckCircleOutlined style={{ 
            color: '#52c41a', 
            fontSize: isMobile ? '14px' : '16px' 
          }} />
        ) : (
          <QuestionCircleOutlined style={{ 
            color: '#d9d9d9', 
            fontSize: isMobile ? '14px' : '16px' 
          }} />
        )}
      </div>
      
      {/* Question type badge */}
      <Badge 
        count={question.question_type === 'trac_nghiem' ? 'Trắc nghiệm' :
              question.question_type === 'dung_sai' ? 'Đúng/Sai' :
              question.question_type === 'dien_dap_an' ? 'Điền ĐA' :
              question.question_type === 'tu_luan' ? 'Tự luận' : 'Khác'}
        style={{ 
          backgroundColor: '#f0f0f0', 
          color: '#666',
          fontSize: isMobile ? '10px' : '11px',
          height: isMobile ? '18px' : '20px',
          lineHeight: isMobile ? '16px' : '18px'
        }}
      />
    </div>
  );

  return (
    <Card 
      title={cardTitle}
      style={{ 
        marginBottom: 0,
        border: isCurrent ? '2px solid #1890ff' : '1px solid #f0f0f0',
        borderRadius: isMobile ? '6px' : '8px',
        boxShadow: isCurrent ? 
          (isMobile ? '0 2px 8px rgba(24, 144, 255, 0.15)' : '0 4px 12px rgba(24, 144, 255, 0.15)') : 
          (isMobile ? '0 1px 4px rgba(0,0,0,0.06)' : '0 2px 8px rgba(0,0,0,0.06)'),
        transition: 'all 0.3s ease',
        background: isCurrent ? '#fafbff' : '#fff'
      }}

    >
      {/* Question Content */}
      <div style={{ 
        marginBottom: isMobile ? 16 : 24, 
        fontSize: isMobile ? '14px' : '16px',
        padding: isMobile ? '12px 14px' : '16px 20px',
        background: '#f9f9f9',
        borderRadius: '6px',
        border: '1px solid #f0f0f0',
        lineHeight: isMobile ? '1.4' : '1.6'
      }}>
        <LatexRenderer text={question.question_text} isMobile={isMobile} />
      </div>
      
      {/* Question Image */}
      {question.question_url && (
        <div style={{ 
          textAlign: 'center', 
          margin: isMobile ? '16px 0' : '24px 0' 
        }}>
          <img 
            src={api + question.question_url} 
            alt="Hình ảnh minh họa" 
            style={{ 
              maxWidth: '100%', 
              height: 'auto', 
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }} 
          />
        </div>
      )}

      {/* Answer Section */}
      {renderQuestionType()}

      {/* Footer info for finished exam */}
      {isFinished && (
        <div style={{ 
          marginTop: isMobile ? '12px' : '20px',
          padding: isMobile ? '8px 12px' : '12px 16px',
          background: '#f6ffed',
          border: '1px solid #b7eb8f',
          borderRadius: '6px'
        }}>
          <Text style={{ 
            color: '#389e0d', 
            fontSize: isMobile ? '12px' : '14px' 
          }}>
            ✅ Bài thi đã hoàn thành - Không thể chỉnh sửa
          </Text>
        </div>
      )}
    </Card>
  );
};

export default QuestionCard;