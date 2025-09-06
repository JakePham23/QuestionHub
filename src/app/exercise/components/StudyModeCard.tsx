import React, { useState } from 'react';
import { Book, Eye, EyeOff, CheckCircle, XCircle, Lightbulb } from 'lucide-react';
import { StudyModeCardProps } from '@/types/exercise.type';
import { Difficulty } from '@/types/common.type';
import NgrokImage from '@/components/NgrokImage';
import LatexRenderer from '@/components/LatexRenderer';
import { getDifficultyDisplayName } from '@/utils/DifficultyConverter';

const StudyModeCard: React.FC<StudyModeCardProps> = ({
  question,
  index,
  showAnswer,
  onToggleAnswer,
  userAnswer,
  onAnswerSelect,
}) => {
  const [showHint, setShowHint] = useState(false);

  const getDifficultyColor = (difficulty?: Difficulty) => {
    switch (difficulty) {
      case 'nhan_biet':
        return '#1890ff';
      case 'thong_hieu':
        return '#52c41a';
      case 'van_dung':
        return '#faad14';
      case 'van_dung_cao':
        return '#f5222d';
      default:
        return '#8c8c8c';
    }
  };

  return (
    <div
      style={{
        border: '1px solid #ddd',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        background: '#fff',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Book size={20} />
          <span>Câu {index + 1}</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <span
            style={{
              padding: '2px 8px',
              borderRadius: 4,
              color: '#fff',
              background: getDifficultyColor(question.difficulty_level as Difficulty),
            }}
          >
            {getDifficultyDisplayName(question.difficulty_level as Difficulty)}
          </span>
          <span
            style={{
              padding: '2px 8px',
              borderRadius: 4,
              background: '#f0f0f0',
            }}
          >
            {question.topic_name}
          </span>
        </div>
      </div>

      {/* Question */}
      <h3 style={{ marginBottom: 12 }}>
        <LatexRenderer text={question.question_text} />
      </h3>

      {question.question_url && (
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <NgrokImage
            src={question.question_url}
            alt="Biểu đồ"
            style={{ maxWidth: '100%', borderRadius: 6 }}
          />
        </div>
      )}

      {/* Options */}
      <div style={{ display: 'grid', gap: 8 }}>
        {question.options.map((option, optionIndex) => {
          const isCorrect = optionIndex === question.correctAnswer;
          const isSelected = userAnswer === optionIndex;
          const isWrong = showAnswer && isSelected && userAnswer !== question.correctAnswer;

          const backgroundColor = isSelected && !showAnswer ? '#e6f7ff' :
                                 isCorrect && showAnswer ? '#e6fffb' :
                                 isWrong ? '#fff2f0' : '#fff';
          const borderColor = isSelected && !showAnswer ? '#1890ff' :
                              isCorrect && showAnswer ? '#52c41a' :
                              isWrong ? '#ff4d4f' : '#ddd';

          return (
            <div
              key={optionIndex}
              onClick={() => !showAnswer && onAnswerSelect(optionIndex)}
              style={{
                padding: 12,
                border: `1px solid ${borderColor}`,
                borderRadius: 6,
                cursor: showAnswer ? 'default' : 'pointer',
                background: backgroundColor,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              {showAnswer && isCorrect && (
                <CheckCircle size={20} color="#52c41a" />
              )}
              {isWrong && <XCircle size={20} color="#f5222d" />}
              <LatexRenderer text={option} />
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
        <button
          onClick={() => setShowHint(!showHint)}
          style={{
            padding: '6px 12px',
            border: '1px solid #ddd',
            borderRadius: 6,
            background: '#fafafa',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <Lightbulb size={16} />
          {showHint ? 'Ẩn gợi ý' : 'Xem gợi ý'}
        </button>
        <button
          onClick={onToggleAnswer}
          style={{
            padding: '6px 12px',
            border: '1px solid #ddd',
            borderRadius: 6,
            background: '#fafafa',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          {showAnswer ? <EyeOff size={16} /> : <Eye size={16} />}
          {showAnswer ? 'Ẩn đáp án' : 'Xem đáp án'}
        </button>
      </div>

      {showHint && (
        <div style={{ marginTop: 12, padding: 12, background: '#fffbe6' }}>
          <LatexRenderer text={question.hint} />
        </div>
      )}

      {showAnswer && (
        <div style={{ marginTop: 12, padding: 12, background: '#f6ffed' }}>
          <strong>Đáp án đúng:</strong> <LatexRenderer text={question.options[question.correctAnswer]} />
          <div style={{ marginTop: 8 }}>
            <LatexRenderer text={question.explanation} />
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyModeCard;