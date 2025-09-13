'use client'
import React, { useState } from 'react';
import { Book, Eye, EyeOff } from 'lucide-react';
import { Card, Typography, Tag, Space, Button, Divider } from 'antd';
import LatexRenderer from '@/components/LatexRenderer';
import QuestionRenderer from '@/components/questions/QuestionRenderer';
import { getDifficultyColor } from '@/utils/ColorUtils';
import { getDifficultyDisplayName } from '@/utils/DifficultyConverter';
import { Difficulty } from '@/types/common.type';
import { Answer, Question, UserAnswer } from '@/types/exam.type';
import { AnswerCorrect } from '@/types/exercise.type';
import {
  CheckCircleOutlined,
} from '@ant-design/icons';

const { Text } = Typography;

interface QuestionCardProps {
  question: Question;
  index: number;
  userAnswer: UserAnswer;
  onAnswerChange: (questionId: string, answer: string) => void;
  showAnswer?: boolean;
  onToggleAnswer?: () => void;
  answer_corrects?: AnswerCorrect[];
  showAnswerCorrect: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  index,
  userAnswer,
  onAnswerChange,
  showAnswer = false,
  onToggleAnswer,
  answer_corrects = [],
  showAnswerCorrect = false,
}) => {
  const [showHint, setShowHint] = useState(false);
  const isAnswered = userAnswer !== undefined && userAnswer !== null && userAnswer !== '';

  const correctAnswerForEssay =
    answer_corrects?.find(ac => String(ac.question_id) === question.question_id)?.answer_correct || '';

  return (
    <Card
      style={{
        maxWidth: 800,
        margin: '0 auto 20px',
        borderRadius: 12,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
        border: '1px solid #f0f0f0',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div 
        style={{
          padding: '16px 24px',
          background: '#fafafa',
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Book size={18} color="#666" />
            <Text strong style={{ fontSize: '16px', color: '#262626' }}>
              Câu {index + 1}
            </Text>
          </div>
          {isAnswered && (
            <CheckCircleOutlined 
              style={{ 
                color: '#52c41a', 
                fontSize: '16px',
                marginLeft: '4px'
              }} 
            />
          )}
        </div>
        
        <Space size="small">
          <Tag 
            color={getDifficultyColor(question.difficulty_level as Difficulty)}
            style={{ 
              borderRadius: '6px',
              border: 'none',
              fontSize: '12px',
              padding: '2px 8px'
            }}
          >
            {getDifficultyDisplayName(question.difficulty_level as Difficulty)}
          </Tag>
          <Tag 
            style={{ 
              background: '#f0f0f0',
              color: '#666',
              border: 'none',
              borderRadius: '6px',
              fontSize: '12px',
              padding: '2px 8px'
            }}
          >
            {question.topic_name}
          </Tag>
        </Space>
      </div>

      {/* Question Content */}
      <div style={{ padding: '24px' }}>
        <QuestionRenderer
          question={question}
          userAnswer={userAnswer}
          onAnswerChange={(answer) => onAnswerChange(question.question_id, answer)}
          isInteractive={!showAnswer}
          showCorrectAnswer={showAnswer}
        />

        {/* Action Buttons */}
        {showAnswerCorrect && (
          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #f0f0f0' }}>
            <Button
              size="middle"
              icon={showAnswer ? <EyeOff size={14} /> : <Eye size={14} />}
              onClick={onToggleAnswer}
              style={{
                borderRadius: '8px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                border: '1px solid #d9d9d9',
                background: '#fff',
                color: '#595959'
              }}
            >
              {showAnswer ? 'Ẩn đáp án' : 'Xem đáp án'}
            </Button>
          </div>
        )}

        {/* Answer Section */}
        {showAnswer && (
          <div style={{ marginTop: '16px' }}>
            <Card 
              size="small" 
              style={{ 
                background: '#f6ffed',
                border: '1px solid #b7eb8f',
                borderRadius: '8px'
              }}
            >
              {question.question_type === 'tu_luan' ? (
                <div>
                  <Text 
                    strong 
                    style={{ 
                      color: '#389e0d',
                      fontSize: '14px',
                      marginBottom: '8px',
                      display: 'block'
                    }}
                  >
                    Đáp án:
                  </Text>
                  <div style={{ 
                    background: '#fff',
                    padding: '12px',
                    borderRadius: '6px',
                    border: '1px solid #d9f7be'
                  }}>
                    <LatexRenderer text={correctAnswerForEssay} />
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <Text 
                    strong 
                    style={{ 
                      color: '#389e0d',
                      fontSize: '14px',
                      flexShrink: 0,
                      marginTop: '8px'
                    }}
                  >
                    Đáp án đúng:
                  </Text>
                  <div style={{ 
                    background: '#fff',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #d9f7be',
                    flex: 1
                  }}>
                    <LatexRenderer
                      text={
                        question.answer_choices?.find((c: Answer) => c.is_correct)?.choice_text ||
                        correctAnswerForEssay
                      }
                    />
                  </div>
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </Card>
  );
};

export default QuestionCard;