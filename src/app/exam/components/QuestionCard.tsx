// src/app/exam/[versionId]/components/QuestionCard.tsx

import { Card, Radio, Space, Typography, Input, Checkbox, Badge, Grid } from 'antd';
import { InlineMath } from 'react-katex';
import {
  CheckCircleOutlined,
  QuestionCircleOutlined,
  EyeOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import React from 'react';

import { Answer, Question, UserAnswer, ExamStatus } from '@/types/exam.type';
import { getMediaUrl } from '@/utils/media';
import NgrokImage from '@/components/NgrokImage';

const { Paragraph, Text } = Typography;
const { useBreakpoint } = Grid;

interface QuestionCardProps {
  question: Question;
  index: number;
  userAnswer: UserAnswer;

  onAnswerChange: (questionId: string, answer: string) => void;
  examStatus: ExamStatus;
  isCurrent: boolean;
  isMobile?: boolean;
}

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

const getAnswerStatus = (answer: Answer, userAnswer: UserAnswer, isFinished: boolean) => {
  if (!isFinished) return 'default';

  const isCorrectAnswer = answer.is_correct;
  const isUserSelected = answer.answer_id === userAnswer;

  if (isUserSelected && isCorrectAnswer) return 'correct-selected';
  if (isUserSelected && !isCorrectAnswer) return 'incorrect-selected';
  if (!isUserSelected && isCorrectAnswer) return 'correct-not-selected';
  return 'default';
};

// Sửa lỗi: Cập nhật hàm này để kiểm tra đúng thuộc tính
const renderChoiceContent = (answer: Answer, isMobile: boolean) => {
    if (answer.choice_image_url) {
        return (
            <NgrokImage
                src={getMediaUrl(answer.choice_image_url)}
                alt="Đáp án minh họa"
                style={{ maxWidth: '100%', height: 'auto', maxHeight: '200px' }}
            />
        );
    }
    return <LatexRenderer text={answer.choice_text} isMobile={isMobile} />;
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
  const isMobile: boolean = propIsMobile !== undefined
    ? propIsMobile
    : Boolean(screens.xs || screens.sm);

  const isFinished = examStatus === 'submitted' || examStatus === 'time-up';
  const isAnswered = userAnswer !== undefined && userAnswer !== null && userAnswer !== '';

  const renderQuestionType = () => {
    switch (question.question_type) {
      case 'trac_nghiem':
        return (
          <Radio.Group
            value={userAnswer}
            onChange={(e) => onAnswerChange(question.question_id, e.target.value)}
            disabled={isFinished}
            style={{ width: '100%' }}
          >
            <Space direction="vertical" style={{ width: '100%' }} size={isMobile ? 'small' : 'middle'}>
              {(question.answer_choices || []).map((answer) => {
                const status = getAnswerStatus(answer, userAnswer, isFinished);
                let borderColor = '#f0f0f0';
                let backgroundColor = '#fafafa';
                let icon = null;

                if (status === 'correct-selected') {
                  borderColor = '#52c41a';
                  backgroundColor = '#f6ffed';
                  icon = <CheckCircleOutlined style={{ color: '#52c41a' }} />;
                } else if (status === 'incorrect-selected') {
                  borderColor = '#ff4d4f';
                  backgroundColor = '#fff2f0';
                  icon = <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
                } else if (status === 'correct-not-selected') {
                  borderColor = '#52c41a';
                  backgroundColor = '#f6ffed';
                  icon = <CheckCircleOutlined style={{ color: '#52c41a' }} />;
                } else if (userAnswer === answer.answer_id) {
                  backgroundColor = '#e6f7ff';
                }

                return (
                  <Radio
                    key={answer.answer_id}
                    value={answer.answer_id}
                    style={{
                      padding: isMobile ? '8px 12px' : '12px 16px',
                      border: `1px solid ${borderColor}`,
                      borderRadius: '6px',
                      margin: isMobile ? '2px 0' : '4px 0',
                      display: 'flex',
                      alignItems: 'flex-start',
                      backgroundColor: backgroundColor,
                      fontSize: isMobile ? '14px' : '16px'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: isMobile ? '8px' : '12px'
                    }}>
                      {isFinished && icon}
                      <div style={{
                        marginLeft: isFinished ? 0 : (isMobile ? '6px' : '8px'),
                        lineHeight: isMobile ? '1.4' : '1.6'
                      }}>
                        {renderChoiceContent(answer, isMobile)}
                      </div>
                    </div>
                  </Radio>
                );
              })}
            </Space>
          </Radio.Group>
        );

      default:
        // Cần hoàn thiện logic cho các loại câu hỏi khác ở đây
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
      id={`question-${question.question_id}`}
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

      {question.question_url && (
        <div style={{
          textAlign: 'center',
          margin: isMobile ? '16px 0' : '24px 0'
        }}>
          <NgrokImage
            src={getMediaUrl(question.question_url)}
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

      {renderQuestionType()}

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