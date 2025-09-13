// src/components/QuestionRenderer.tsx

import React from 'react';
import { Radio, Space, Input, Typography } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Question, Answer, UserAnswer } from '@/types/exam.type'; // Assuming a common type
import LatexRenderer from '@/components/LatexRenderer';
import NgrokImage from '@/components/NgrokImage';
import { getMediaUrl } from '@/utils/media';

interface QuestionRendererProps {
  question: Question;
  userAnswer: UserAnswer;
  onAnswerChange?: (answer: string) => void;
  isInteractive?: boolean;
  showCorrectAnswer?: boolean;
}

const getAnswerStatus = (answer: Answer, userAnswer: UserAnswer, showCorrectAnswer: boolean) => {
  if (!showCorrectAnswer) return 'default';
  const isCorrectAnswer = answer.is_correct;
  const isUserSelected = answer.answer_id === userAnswer;

  if (isUserSelected && isCorrectAnswer) return 'correct-selected';
  if (isUserSelected && !isCorrectAnswer) return 'incorrect-selected';
  if (!isUserSelected && isCorrectAnswer) return 'correct-not-selected';
  return 'default';
};

const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  userAnswer,
  onAnswerChange,
  isInteractive = true,
  showCorrectAnswer = false,
}) => {
  const isMultipleChoice = question.question_type === 'trac_nghiem' || question.question_type === 'dung_sai';
  const isEssayQuestion = question.question_type === 'tu_luan' || question.question_type === 'dien_dap_an';

  const renderChoiceContent = (answer: Answer) => {
    if (answer.choice_image_url) {
      return (
        <NgrokImage
          src={getMediaUrl(answer.choice_image_url)}
          alt="Đáp án minh họa"
          style={{ 
            maxWidth: '100%', 
            height: 'auto', 
            maxHeight: '200px',
            borderRadius: '6px'
          }}
        />
      );
    }
    return <LatexRenderer text={answer.choice_text} />;
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Question Text */}
      <div style={{ 
        marginBottom: 20,
        fontSize: '16px',
        lineHeight: '1.6',
        color: '#262626'
      }}>
        <LatexRenderer text={question.question_text} />
      </div>

      {/* Question Image */}
      {question.question_url && (
        <div style={{ 
          textAlign: 'center', 
          marginBottom: 20,
          padding: '8px',
          background: '#fafafa',
          borderRadius: '8px',
          border: '1px solid #f0f0f0'
        }}>
          <NgrokImage
            src={getMediaUrl(question.question_url)}
            alt="Hình ảnh minh họa"
            style={{ 
              maxWidth: '100%', 
              borderRadius: '6px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}
          />
        </div>
      )}

      {/* Multiple Choice Options */}
      {isMultipleChoice && question.answer_choices && (
        <Radio.Group
          value={userAnswer}
          onChange={(e) => onAnswerChange?.(e.target.value)}
          disabled={!isInteractive}
          style={{ width: '100%' }}
        >
          <Space direction="vertical" style={{ width: '100%' }} size={12}>
            {question.answer_choices.map((option, index) => {
              const status = getAnswerStatus(option, userAnswer, showCorrectAnswer);
              let borderColor = '#e6e6e6';
              let backgroundColor = '#fff';
              let icon = null;
              let boxShadow = 'none';

              if (status === 'correct-selected') {
                borderColor = '#52c41a';
                backgroundColor = '#f6ffed';
                icon = <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '16px' }} />;
                boxShadow = '0 2px 4px rgba(82, 196, 26, 0.1)';
              } else if (status === 'incorrect-selected') {
                borderColor = '#ff4d4f';
                backgroundColor = '#fff2f0';
                icon = <CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: '16px' }} />;
                boxShadow = '0 2px 4px rgba(255, 77, 79, 0.1)';
              } else if (status === 'correct-not-selected') {
                borderColor = '#52c41a';
                backgroundColor = '#f6ffed';
                icon = <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '16px' }} />;
                boxShadow = '0 2px 4px rgba(82, 196, 26, 0.1)';
              } else if (userAnswer === option.answer_id) {
                backgroundColor = '#e6f7ff';
                borderColor = '#1890ff';
                boxShadow = '0 2px 4px rgba(24, 144, 255, 0.1)';
              }

              // Choice labels
              const choiceLabel = String.fromCharCode(65 + index); // A, B, C, D...

              return (
                <Radio
                  key={option.answer_id}
                  value={option.answer_id}
                  style={{
                    padding: '16px',
                    border: `2px solid ${borderColor}`,
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    backgroundColor: backgroundColor,
                    fontSize: '16px',
                    margin: 0,
                    width: '100%',
                    boxShadow: boxShadow,
                    transition: 'all 0.2s ease',
                    cursor: isInteractive ? 'pointer' : 'default'
                  }}
                  className="question-choice"
                >
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    width: '100%',
                    gap: '12px'
                  }}>
                    {/* Choice Label */}
                    <div style={{
                      minWidth: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: userAnswer === option.answer_id ? borderColor : '#f0f0f0',
                      color: userAnswer === option.answer_id ? '#fff' : '#666',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      flexShrink: 0,
                      marginTop: '2px'
                    }}>
                      {choiceLabel}
                    </div>

                    {/* Status Icon */}
                    {showCorrectAnswer && icon && (
                      <div style={{ flexShrink: 0, marginTop: '2px' }}>
                        {icon}
                      </div>
                    )}

                    {/* Choice Content */}
                    <div style={{ 
                      flex: 1,
                      lineHeight: '1.6',
                      fontSize: '15px'
                    }}>
                      {renderChoiceContent(option)}
                    </div>
                  </div>
                </Radio>
              );
            })}
          </Space>
        </Radio.Group>
      )}

      {/* Essay Question */}
      {isEssayQuestion && (
        <div style={{ marginTop: '8px' }}>
          <Input.TextArea
            rows={6}
            value={userAnswer as string}
            onChange={(e) => onAnswerChange?.(e.target.value)}
            disabled={!isInteractive}
            placeholder="Nhập câu trả lời của bạn..."
            style={{ 
              fontSize: '15px',
              borderRadius: '12px',
              border: '2px solid #e6e6e6',
              padding: '16px',
              lineHeight: '1.6',
              resize: 'vertical'
            }}
            showCount
            maxLength={5000}
          />
        </div>
      )}

      <style jsx>{`
        .question-choice:hover {
          border-color: ${isInteractive ? '#40a9ff' : 'inherit'} !important;
          box-shadow: ${isInteractive ? '0 4px 12px rgba(24, 144, 255, 0.15)' : 'inherit'} !important;
        }
      `}</style>
    </div>
  );
};

export default QuestionRenderer;